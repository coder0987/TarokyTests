import http from "http";
import express from "express";
import { Server } from "socket.io";
import Redis from "ioredis";

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
  console.log(`Client connected: ${socket.id}`);

  socket.on("createRoom", async () => {
    // Ask manager to create a room
    await redis.publish("room_create", "");
    // Optionally, wait for "room_created" event to notify client
  });

  socket.on("deleteRoom", async (roomId: string) => {
    // Ask manager to delete a room
    await redis.publish("room_delete", JSON.stringify({ roomId }));
    // Optionally, wait for "room_deleted" event to notify client
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

      if (role === "player") {
        if (roomData.players >= MAX_PLAYERS_PER_ROOM) {
          socket.emit("error", { message: `Room ${roomId} is full.` });
          return;
        }
        roomData.players++;
      } else {
        roomData.audience++;
      }

      roomData.status =
        roomData.players >= MAX_PLAYERS_PER_ROOM ? "full" : "active";
      await redis.hset(ROOM_HASH, roomId, JSON.stringify(roomData));

      socket.emit("roomJoined", { roomId: roomData.roomId, role });
    } catch (error) {
      console.error("[socket] Error joining room:", error);
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on("msg", (msg: string) => {
    console.log("Message received: " + msg);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Main server listening on port ${PORT}`);
});
