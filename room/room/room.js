// This is the room file. It will be spawned in by the server and associated with a single room
// It will be destroyed when the room is closed
// Many of these will run, and will not communicate with eachother

const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const Redis = require('ioredis');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const redisHost = process.env.REDIS_HOST || 'redis.taroky-namespace.svc.cluster.local';
const redisPort = process.env.REDIS_PORT || 6379;

const pub = new Redis({
  host: redisHost,
  port: redisPort,
});

const PORT = process.env.PORT || 3000;
const ROOM_ID = process.env.ROOM_ID || 'local-test-room';
const REDIS_CHANNEL = 'room_updates';

// In-memory tracking of participants
const players = new Map();   // socket.id -> socket
const audience = new Map();  // socket.id -> socket

// Log & Redis update when room is empty
function checkIfRoomEmpty() {
    if (players.size === 0 && audience.size === 0) {
        console.log(`[${ROOM_ID}] Room is now empty`);
        pub.publish(REDIS_CHANNEL, JSON.stringify({
            type: 'room_empty',
            roomId: `room-${ROOM_ID}`,
        }));
    }
}

// Socket.io logic
io.on('connection', (socket) => {
    console.log(`[${ROOM_ID}] Connection: ${socket.id}`);

    socket.on('join', ({ role }) => {
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
        }));
    });

    // Broadcast to all players + audience
    socket.on('msg', (message) => {
        console.log('Message received: ' + message);
        [...players.values(), ...audience.values()].forEach(s => {
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
            }));
        }

        checkIfRoomEmpty();
    });
});

// Optional: health check
app.get('/status', (req, res) => {
    res.json({
        roomId: ROOM_ID,
        players: players.size,
        audience: audience.size,
    });
});

server.listen(PORT, () => {
    console.log(`[${ROOM_ID}] Room server running on port ${PORT}`);
});
