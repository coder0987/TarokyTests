import http from "http";
import express from "express";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import * as k8s from "@kubernetes/client-node";
import fs from "fs";
import * as yaml from "js-yaml";
import Redis from "ioredis";
import path from "path";

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

// K8s setup
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApiApps = kc.makeApiClient(k8s.AppsV1Api);
const k8sApiCore = kc.makeApiClient(k8s.CoreV1Api);

// Express and Socket.IO setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Constants
const ROOM_PREFIX = "room-";
const TARGET_EMPTY_ROOMS = 2;
const CHECK_INTERVAL_MS = 10000;
const PORT = 8449;
const MAX_PLAYERS_PER_ROOM = 4;
const ROOM_HASH = "rooms";
const NAMESPACE = "taroky-namespace";

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

// Utility: Build Deployment/Service YAML from template
function buildRoomResources(roomId: string): any[] {
  const rawYaml = fs.readFileSync(
    path.join(__dirname, "room-template.yaml"),
    "utf8"
  );
  const filledYaml = rawYaml.replace(/room-PLACEHOLDER/g, roomId);
  return yaml.loadAll(filledYaml) as any[];
}

// Deploy room pod and service in K8s
async function deployRoomToK8s(roomId: string): Promise<void> {
  const resources = buildRoomResources(roomId);

  for (const resource of resources) {
    try {
      if (resource.kind === "Deployment") {
        await k8sApiApps.createNamespacedDeployment(NAMESPACE, resource);
        console.log(`[k8s] Deployment ${roomId} created.`);
      } else if (resource.kind === "Service") {
        await k8sApiCore.createNamespacedService(NAMESPACE, resource);
        console.log(`[k8s] Service ${roomId} created.`);
      }
    } catch (error) {
      console.error(
        `[k8s] Error creating ${resource.kind} for ${roomId}:`,
        error
      );
      throw error;
    }
  }
}

// Create room in Redis + deploy to K8s
async function createFullRoom(): Promise<string> {
  const roomUuid = uuidv4();
  const roomId = `${ROOM_PREFIX}${roomUuid}`;

  const roomData: RoomData = {
    roomId,
    players: 0,
    audience: 0,
    status: "empty",
    createdAt: Date.now(),
  };

  try {
    await redis.hset(ROOM_HASH, roomId, JSON.stringify(roomData));
    await deployRoomToK8s(roomId);
    console.log(`[room] Created new room: ${roomId}`);
    return roomId;
  } catch (error) {
    console.error(`[room] Error creating room ${roomId}:`, error);
    // Clean up Redis if K8s deployment failed
    await redis.hdel(ROOM_HASH, roomId);
    throw error;
  }
}

// Get current room data from Redis
async function getRoomData(): Promise<Record<string, RoomData>> {
  const raw = await redis.hgetall(ROOM_HASH);
  return Object.entries(raw).reduce((acc, [id, val]) => {
    acc[id] = JSON.parse(val) as RoomData;
    return acc;
  }, {} as Record<string, RoomData>);
}

async function cleanupOrphanedRooms(): Promise<void> {
  const rooms = await getRoomData();

  for (const roomId of Object.keys(rooms)) {
    try {
      // Check if deployment exists in the namespace
      await k8sApiApps.readNamespacedDeployment(roomId, NAMESPACE);
      // Deployment exists, no action needed
    } catch (err: any) {
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

// Check empty rooms and scale up if needed
async function checkAndScaleRooms(): Promise<void> {
  try {
    await cleanupOrphanedRooms();
    const rooms = await getRoomData();
    const emptyRooms = Object.values(rooms).filter((r) => r.status === "empty");
    const needed = TARGET_EMPTY_ROOMS - emptyRooms.length;

    if (needed > 0) {
      console.log(
        `[scaler] ${emptyRooms.length} empty rooms found. Creating ${needed} more.`
      );
      for (let i = 0; i < needed; i++) {
        await createFullRoom();
      }
    } else {
      console.log(`[scaler] Sufficient empty rooms: ${emptyRooms.length}`);
    }
  } catch (error) {
    console.error("[scaler] Error in checkAndScaleRooms:", error);
  }
}

setInterval(checkAndScaleRooms, CHECK_INTERVAL_MS);

// Redis pub/sub: handle empty room cleanup
sub.subscribe("room_updates");
sub.on("message", async (channel: string, message: string) => {
  try {
    const msg: RoomUpdateMessage = JSON.parse(message);
    if (msg.type === "room_empty") {
      const roomId = msg.roomId;
      console.log(`[cleanup] Room ${roomId} is empty. Removing...`);
      await redis.hdel(ROOM_HASH, roomId);

      try {
        await k8sApiApps.deleteNamespacedDeployment(roomId, NAMESPACE);
        await k8sApiCore.deleteNamespacedService(roomId, NAMESPACE);
        console.log(`[k8s] Deleted Deployment and Service for ${roomId}`);
      } catch (err: any) {
        console.error(
          `[k8s] Error deleting ${roomId}:`,
          err.body?.message || err.message
        );
      }
    }
  } catch (error) {
    console.error("[redis] Error processing room update message:", error);
  }
});

// WebSocket logic
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

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
        return socket.emit("error", { message: `Room ${roomId} not found.` });
      }

      const roomData: RoomData = JSON.parse(roomRaw);

      if (role === "player") {
        if (roomData.players >= MAX_PLAYERS_PER_ROOM) {
          return socket.emit("error", { message: `Room ${roomId} is full.` });
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
