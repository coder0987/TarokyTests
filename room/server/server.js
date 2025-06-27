const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const k8s = require('@kubernetes/client-node');
const fs = require('fs');
const yaml = require('js-yaml');
const Redis = require('ioredis');
const path = require('path');

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

// Redis clients
const redis = new Redis({
  host: redisHost,
  port: redisPort,
});
const sub = new Redis({
  host: redisHost,
  port: redisPort,
});

// K8s setup
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApiApps = kc.makeApiClient(k8s.AppsV1Api);
const k8sApiCore = kc.makeApiClient(k8s.CoreV1Api);

// Constants
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const ROOM_PREFIX = 'room-';
const TARGET_EMPTY_ROOMS = 2;
const CHECK_INTERVAL_MS = 10000;
const PORT = 8449;
const MAX_PLAYERS_PER_ROOM = 4;
const ROOM_HASH = 'rooms';
const NAMESPACE = 'taroky-namespace';

//
// Utility: Build Deployment/Service YAML from template
//
function buildRoomResources(roomId) {
    const rawYaml = fs.readFileSync(path.join(__dirname, 'room-template.yaml'), 'utf8');
    const filledYaml = rawYaml.replace(/room-PLACEHOLDER/g, roomId);
    return yaml.loadAll(filledYaml);
}

//
// Deploy room pod and service in K8s
//
async function deployRoomToK8s(roomId) {
    const resources = buildRoomResources(roomId);

    for (const resource of resources) {
        if (resource.kind === 'Deployment') {
            await k8sApiApps.createNamespacedDeployment(NAMESPACE, resource);
            console.log(`[k8s] Deployment ${roomId} created.`);
        } else if (resource.kind === 'Service') {
            await k8sApiCore.createNamespacedService(NAMESPACE, resource);
            console.log(`[k8s] Service ${roomId} created.`);
        }
    }
}

//
// Create room in Redis + deploy to K8s
//
async function createFullRoom() {
    const roomUuid = uuidv4();
    const roomId = `${ROOM_PREFIX}${roomUuid}`;

    const roomData = {
        roomId,
        players: 0,
        audience: 0,
        status: 'empty',
        createdAt: Date.now(),
    };

    await redis.hset(ROOM_HASH, roomId, JSON.stringify(roomData));
    await deployRoomToK8s(roomId);
    console.log(`[room] Created new room: ${roomId}`);
    return roomId;
}

//
// Get current room data from Redis
//
async function getRoomData() {
    const raw = await redis.hgetall(ROOM_HASH);
    return Object.entries(raw).reduce((acc, [id, val]) => {
        acc[id] = JSON.parse(val);
        return acc;
    }, {});
}

async function cleanupOrphanedRooms() {
  const rooms = await getRoomData();

  for (const roomId of Object.keys(rooms)) {
    try {
      // Check if deployment exists in the namespace
      await k8sApiApps.readNamespacedDeployment(roomId, NAMESPACE);
      // Deployment exists, no action needed
    } catch (err) {
      if (err.statusCode === 404) {
        // Deployment not found — remove room from Redis
        await redis.hdel(ROOM_HASH, roomId);
        console.log(`[cleanup] Removed orphaned room from Redis: ${roomId}`);
      } else {
        console.error(`[cleanup] Error checking deployment ${roomId}:`, err);
      }
    }
  }
}


//
// Check empty rooms and scale up if needed
//
async function checkAndScaleRooms() {
    await cleanupOrphanedRooms();
    const rooms = await getRoomData();
    const emptyRooms = Object.values(rooms).filter(r => r.status === 'empty');
    const needed = TARGET_EMPTY_ROOMS - emptyRooms.length;

    if (needed > 0) {
        console.log(`[scaler] ${emptyRooms.length} empty rooms found. Creating ${needed} more.`);
        for (let i = 0; i < needed; i++) {
            await createFullRoom();
        }
    } else {
        console.log(`[scaler] Sufficient empty rooms: ${emptyRooms.length}`);
    }
}

setInterval(checkAndScaleRooms, CHECK_INTERVAL_MS);

//
// Redis pub/sub: handle empty room cleanup
//
sub.subscribe('room_updates');
sub.on('message', async (channel, message) => {
    const msg = JSON.parse(message);
    if (msg.type === 'room_empty') {
        const roomId = msg.roomId;
        console.log(`[cleanup] Room ${roomId} is empty. Removing...`);
        await redis.hdel(ROOM_HASH, roomId);

        try {
            await k8sApiApps.deleteNamespacedDeployment(roomId, NAMESPACE);
            await k8sApiCore.deleteNamespacedService(roomId, NAMESPACE);
            console.log(`[k8s] Deleted Deployment and Service for ${roomId}`);
        } catch (err) {
            console.error(`[k8s] Error deleting ${roomId}:`, err.body?.message || err.message);
        }
    }
});

//
// WebSocket logic
//
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('getRooms', async () => {
        const rooms = await getRoomData();
        const list = Object.values(rooms).map(r => ({
            roomId: r.roomId,
            players: r.players,
            audience: r.audience,
            status: r.status,
        }));
        socket.emit('roomList', list);
    });

    socket.on('joinRoom', async ({ roomId, role = 'player' }) => {
        const roomRaw = await redis.hget(ROOM_HASH, roomId);

        if (!roomRaw) {
            return socket.emit('error', { message: `Room ${roomId} not found.` });
        }

        const roomData = JSON.parse(roomRaw);

        if (role === 'player') {
            if (roomData.players >= MAX_PLAYERS_PER_ROOM) {
                return socket.emit('error', { message: `Room ${roomId} is full.` });
            }
            roomData.players++;
        } else {
            roomData.audience++;
        }

        roomData.status = roomData.players >= MAX_PLAYERS_PER_ROOM ? 'full' : 'active';
        await redis.hset(ROOM_HASH, roomId, JSON.stringify(roomData));

        socket.emit('roomJoined', { roomId: roomData.roomId, role });
    });

    socket.on('msg', (msg) => {
        console.log('Message received: ' + msg);
    })
});

server.listen(PORT, () => {
    console.log(`Main server listening on port ${PORT}`);
});
