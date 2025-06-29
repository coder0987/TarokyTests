import http from "http";
import express from "express";
import { Server } from "socket.io";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

// Environment variables
const redisHost: string = process.env.REDIS_HOST || "localhost";
const redisPort: number = parseInt(process.env.REDIS_PORT || "6379", 10);

// Redis clients
const redis = new Redis({
  host: redisHost,
  port: redisPort,
});
const sub = new Redis({
  host: redisHost,
  port: redisPort,
});


// Express and Socket.IO setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Constants
const PORT = 8449;
const MAX_PLAYERS_PER_ROOM = 4;
const ROOM_HASH = "rooms";

const disconnectTimers: { [userId: string]: NodeJS.Timeout } = {};

// Types
interface RoomData {
  roomId: string;
  players: number;
  audience: number;
  status: "empty" | "active" | "full";
  createdAt: number;
}

interface RoomListItem {
  roomId: string;
  players: number;
  audience: number;
  status: string;
}

interface JoinRoomData {
  roomId: string;
  role?: "player" | "audience";
}

interface RoomUpdateMessage {
  type: "room_empty";
  roomId: string;
}


// Get current room data from Redis
async function getRoomData(): Promise<Record<string, RoomData>> {
  const raw = await redis.hgetall(ROOM_HASH);
  return Object.entries(raw).reduce((acc, [id, val]) => {
    acc[id] = JSON.parse(val) as RoomData;
    return acc;
  }, {} as Record<string, RoomData>);
}


// Redis pub/sub: handle empty room cleanup
sub.subscribe("room_updates");
sub.subscribe("room_created");
sub.subscribe("room_deleted");

sub.on("message", (channel: string, message: string) => {
  if (channel === "room_created") {
    const { roomId } = JSON.parse(message);
    // Notify clients as needed, e.g. io.emit("roomCreated", { roomId });
  } else if (channel === "room_deleted") {
    const { roomId } = JSON.parse(message);
    // Notify clients as needed, e.g. io.emit("roomDeleted", { roomId });
  }
});

// WebSocket logic
io.on("connection", (socket) => {
  // Get userId from client or assign a new one
  let userId = socket.handshake.query.userId as string;
  if (!userId) {
    userId = uuidv4();
    socket.emit("assignUserId", userId);
  }

  // Clear disconnect timer on reconnect
  if (disconnectTimers[userId]) {
    clearTimeout(disconnectTimers[userId]);
    delete disconnectTimers[userId];
  }

  // On reconnect, check if user was in a room and rejoin
  (async () => {
    const roomId = await redis.get(`user:${userId}:room`);
    if (roomId) {
      socket.emit("rejoinRoom", { roomId });
      // Optionally, you could auto-join the room here
    }
  })();

  socket.on("createRoom", async () => {
    await redis.publish("room_create", "");
  });

  socket.on("deleteRoom", async (roomId: string) => {
    await redis.publish("room_delete", JSON.stringify({ roomId }));
  });

  socket.on("getRooms", async () => {
    try {
      const rooms = await getRoomData();
      const list: RoomListItem[] = Object.values(rooms).map((r) => ({
        roomId: r.roomId,
        players: r.players,
        audience: r.audience,
        status: r.status,
      }));
      socket.emit("roomList", list);
    } catch (error) {
      console.error("[socket] Error getting rooms:", error);
      socket.emit("error", { message: "Failed to get room list" });
    }
  });

  socket.on("joinRoom", async (data: JoinRoomData) => {
    try {
      const { roomId, role = "player" } = data;
      const roomRaw = await redis.hget(ROOM_HASH, roomId);

      if (!roomRaw) {
        socket.emit("error", { message: `Room ${roomId} not found.` });
        return;
      }

      const roomData: RoomData = JSON.parse(roomRaw);

      // Only increment if user is not already in this room
      const prevRoom = await redis.get(`user:${userId}:room`);
      if (prevRoom !== roomId) {
        if (role === "player") {
          if (roomData.players >= MAX_PLAYERS_PER_ROOM) {
            socket.emit("error", { message: `Room ${roomId} is full.` });
            return;
          }
          roomData.players++;
        } else {
          roomData.audience++;
        }
      }

      roomData.status =
        roomData.players >= MAX_PLAYERS_PER_ROOM ? "full" : "active";
      await redis.hset(ROOM_HASH, roomId, JSON.stringify(roomData));

      // Store user-room mapping in Redis
      await redis.set(`user:${userId}:room`, roomId);

      // Clear any disconnect timer for this user
      if (disconnectTimers[userId]) {
        clearTimeout(disconnectTimers[userId]);
        delete disconnectTimers[userId];
      }

      console.log(`Player ${socket.id} joined room ${roomId}`);

      socket.emit("roomJoined", { roomId: roomId, role });
    } catch (error) {
      console.error("[socket] Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on("leaveRoom", async (data: { roomId: string }) => {
    const { roomId } = data;
    const userRoom = await redis.get(`user:${userId}:room`);
    if (userRoom !== roomId) {
      // User is not in this room, nothing to do
      return;
    }

    const roomRaw = await redis.hget(ROOM_HASH, roomId);
    if (roomRaw) {
      const roomData: RoomData = JSON.parse(roomRaw);
      // Decrement player count
      if (roomData.players > 0) {
        roomData.players--;
      }
      // Optionally, handle audience decrement if needed
      // roomData.audience--;

      // Update room status
      roomData.status =
        roomData.players === 0
          ? "empty"
          : roomData.players >= MAX_PLAYERS_PER_ROOM
          ? "full"
          : "active";

      await redis.hset(ROOM_HASH, roomId, JSON.stringify(roomData));
    }
    await redis.del(`user:${userId}:room`);

    // Optionally, emit a confirmation to the client
    socket.emit("leftRoom", { roomId });
  });

  socket.on("msg", (msg: string) => {
    console.log("Message received: " + msg);
  });

  socket.on("disconnect", async () => {
    // Start a timer to allow for quick reconnects (e.g., page refresh)
    disconnectTimers[userId] = setTimeout(async () => {
      const roomId = await redis.get(`user:${userId}:room`);
      if (roomId) {
        const roomRaw = await redis.hget(ROOM_HASH, roomId);
        if (roomRaw) {
          const roomData: RoomData = JSON.parse(roomRaw);
          // Decrement player count
          if (roomData.players > 0) {
            roomData.players--;
          }
          // Optionally, handle audience decrement if needed
          // roomData.audience--;

          // Update room status
          roomData.status =
            roomData.players === 0
              ? "empty"
              : roomData.players >= MAX_PLAYERS_PER_ROOM
              ? "full"
              : "active";

          await redis.hset(ROOM_HASH, roomId, JSON.stringify(roomData));
        }
        await redis.del(`user:${userId}:room`);
      }
      console.log(
        `Client ${socket.id} fully disconnected and removed from room`
      );
    }, 10000); // 10 seconds
    console.log(
      `Client disconnected: ${socket.id} (waiting for possible reconnect)`
    );
  });
});

server.listen(PORT, () => {
  console.log(`Main server listening on port ${PORT}`);
});
