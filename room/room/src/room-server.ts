// This is the room file. It will be spawned in by the server and associated with a single room
// It will be destroyed when the room is closed
// Many of these will run, and will not communicate with each other

import http from 'http';
import express, { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';
import url from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    path: '/socket.io'
});


function debug_logs(socket : Socket) {
    const query = socket.handshake.query;
    const headers = socket.handshake.headers;
    const remoteAddress = socket.handshake.address;

    console.log(`[CONNECTED] ${remoteAddress}`);
    console.log(`Query params:`, query);
    console.log(`Headers:`, headers);
    console.log(`Namespace: ${socket.nsp.name}`);
}
io.engine.on('connection_error', (err) => {
    const req = err.req;

    const parsedUrl = url.parse(req.url || '', true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    console.error(`[FAILED CONNECT]`);
    console.error(`URL: ${req.url}`);
    console.error(`Remote Address: ${req.socket.remoteAddress}`);
    console.error(`Path: ${path}`);
    console.error(`Query:`, query);
    console.error(`Error: ${err.code} – ${err.message}`);
});

const redisHost: string = process.env.REDIS_HOST || 'redis.taroky-namespace.svc.cluster.local';
const redisPort: number = parseInt(process.env.REDIS_PORT || '6379');

const pub = new Redis({
  host: redisHost,
  port: redisPort,
});

const roomSub = new Redis({
  host: redisHost,
  port: redisPort,
});

const roomPub = new Redis({
  host: redisHost,
  port: redisPort,
});

const PORT: number = parseInt(process.env.PORT || '3000');
const ROOM_ID: string = process.env.ROOM_ID || 'local-test-room';
const REDIS_CHANNEL = 'room_updates';

// Let the manager know that the room is ready
roomPub.publish(ROOM_ID, 'ready');

// Type definitions
interface JoinData {
  role: 'player' | 'audience';
}

interface RedisMessage {
  type: 'room_empty' | 'join' | 'leave';
  roomId: string;
  socketId?: string;
  role?: 'player' | 'audience';
}

interface StatusResponse {
  roomId: string;
  players: number;
  audience: number;
}

// In-memory tracking of participants
const players = new Map<string, Socket>();   // socket.id -> socket
const audience = new Map<string, Socket>();  // socket.id -> socket

// Log & Redis update when room is empty
function checkIfRoomEmpty(): void {
    if (players.size === 0 && audience.size === 0) {
        console.log(`[${ROOM_ID}] Room is now empty`);

        roomPub.publish(ROOM_ID, 'empty');

        pub.publish(REDIS_CHANNEL, JSON.stringify({
            type: 'room_empty',
            roomId: `room-${ROOM_ID}`,
        } as RedisMessage));
    }
}

function reset() {
    // Remove all connections
    // Reset all variables

    [...players.values(), ...audience.values()].forEach((s: Socket) => {
        s.emit('close');
        s.disconnect();
    });

    roomPub.publish(ROOM_ID, 'ready');
}

// Manager messages
roomSub.subscribe(ROOM_ID);

roomSub.on('message', (channel: string, message: string) => {
    console.log(`Received message ${message} for ${channel}`);

    if (channel !== ROOM_ID) {
        return;
    }

    switch (message) {
        case 'reset':
            reset();
            break;
        default:
            console.log(`Unknown message: ${message}`);
    }
});

// Socket.io logic
io.on('connection', (socket: Socket) => {
    console.log(`[${ROOM_ID}] Connection: ${socket.id}`);

    debug_logs(socket);

    socket.on('join', ({ role }: JoinData) => {
        // Inform manager that the room has users
        roomPub.publish(ROOM_ID, 'running');

        if (role === 'player') {
            players.set(socket.id, socket);
            console.log(`[${ROOM_ID}] Player joined: ${socket.id}`);
        } else {
            audience.set(socket.id, socket);
            console.log(`[${ROOM_ID}] Audience joined: ${socket.id}`);
        }

        // Optional: notify Redis
        pub.publish(REDIS_CHANNEL, JSON.stringify({
            type: 'join',
            roomId: `room-${ROOM_ID}`,
            socketId: socket.id,
            role,
        } as RedisMessage));
    });

    // Broadcast to all players + audience
    socket.on('msg', (message: string) => {
        console.log('Message received: ' + message);
        [...players.values(), ...audience.values()].forEach((s: Socket) => {
            s.emit('msg', message);
        });
    });

    socket.on('disconnect', () => {
        let removed = false;
        if (players.delete(socket.id)) {
            console.log(`[${ROOM_ID}] Player disconnected: ${socket.id}`);
            removed = true;
        }
        if (audience.delete(socket.id)) {
            console.log(`[${ROOM_ID}] Audience disconnected: ${socket.id}`);
            removed = true;
        }

        if (removed) {
            pub.publish(REDIS_CHANNEL, JSON.stringify({
                type: 'leave',
                roomId: `room-${ROOM_ID}`,
                socketId: socket.id,
            } as RedisMessage));
        }

        checkIfRoomEmpty();
    });
});

// Optional: health check
app.get('/status', (req: Request, res: Response) => {
    res.json({
        roomId: ROOM_ID,
        players: players.size,
        audience: audience.size,
    } as StatusResponse);
});

server.listen(PORT, () => {
    console.log(`[${ROOM_ID}] Room server running on port ${PORT}`);
});