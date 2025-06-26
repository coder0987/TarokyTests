const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const redis = new Redis();
const pub = new Redis();
const sub = new Redis();

const PORT = 8449;
const MAX_PLAYERS_PER_ROOM = 4;
const TARGET_EMPTY_ROOMS = 2;
const ROOM_HASH = 'rooms';
const ROOM_PREFIX = 'room-';

sub.subscribe('room_updates');

sub.on('message', async (channel, message) => {
    const msg = JSON.parse(message);
    if (msg.type === 'room_empty') {
        console.log(`Room ${msg.roomId} is empty. Removing...`);
        await redis.hdel(ROOM_HASH, msg.roomId);
    }
});

async function getRoomData() {
    const raw = await redis.hgetall(ROOM_HASH);
    return Object.entries(raw).reduce((acc, [id, val]) => {
        acc[id] = JSON.parse(val);
        return acc;
    }, {});
}

async function createRoom() {
    const roomId = uuidv4();
    const key = `${ROOM_PREFIX}${roomId}`;

    const roomData = {
        roomId,
        players: 0,
        audience: 0,
        status: 'empty',
        createdAt: Date.now(),
    };

    await redis.hset(ROOM_HASH, key, JSON.stringify(roomData));

    console.log(`Created new empty room: ${key}`);
    return key;
}

async function maintainEmptyRoomBuffer() {
    const rooms = await getRoomData();
    const emptyRooms = Object.values(rooms).filter(r => r.status === 'empty');
    const needed = TARGET_EMPTY_ROOMS - emptyRooms.length;
    if (needed > 0) {
        for (let i = 0; i < needed; i++) {
            await createRoom();
        }
    }
}

// Initial empty room buffer
maintainEmptyRoomBuffer();

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Client requests all room data
    socket.on('getRooms', async () => {
        const rooms = await getRoomData();
        const formatted = Object.values(rooms).map(r => ({
            roomId: r.roomId,
            players: r.players,
            audience: r.audience,
            status: r.status,
        }));
        socket.emit('roomList', formatted);
    });

    // Client selects and joins a room
    socket.on('joinRoom', async ({ roomId, role = 'player' }) => {
        const key = `${ROOM_PREFIX}${roomId}`;
        const roomRaw = await redis.hget(ROOM_HASH, key);

        if (!roomRaw) {
            return socket.emit('error', { message: `Room ${roomId} does not exist.` });
        }

        const roomData = JSON.parse(roomRaw);

        if (role === 'player') {
            if (roomData.players >= MAX_PLAYERS_PER_ROOM) {
                return socket.emit('error', { message: `Room ${roomId} is full.` });
            }
            roomData.players += 1;
        } else {
            roomData.audience += 1;
        }

        if (roomData.players >= MAX_PLAYERS_PER_ROOM) {
            roomData.status = 'full';
        } else {
            roomData.status = 'active';
        }

        await redis.hset(ROOM_HASH, key, JSON.stringify(roomData));
        await maintainEmptyRoomBuffer();

        socket.emit('roomJoined', { roomId: roomData.roomId, role });
    });
});

server.listen(PORT, () => {
    console.log(`Main server listening on port ${PORT}`);
});
