// manager.ts
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

const Kube = require('./kube');

const kube = new Kube();

const redisHost: string = process.env.REDIS_HOST || "localhost";
const redisPort: number = parseInt(process.env.REDIS_PORT || "6379", 10);
const redis = new Redis({ host: redisHost, port: redisPort });
const sub = new Redis({ host: redisHost, port: redisPort });


// Listen for room creation/deletion requests from server.ts
sub.subscribe("room_create");
sub.subscribe("room_delete");

const ROOM_PREFIX = "room-";
const ROOM_HASH = "rooms";
const TARGET_EMPTY_ROOMS = 2;
const CHECK_INTERVAL_MS = 10000;

interface RoomData {
  roomId: string;
  players: number;
  audience: number;
  status: "empty" | "active" | "full";
  createdAt: number;
}



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
  await redis.hset(ROOM_HASH, roomId, JSON.stringify(roomData));
  await kube.deployRoomToK8s(roomId);
  return roomId;
}

async function deleteRoom(roomId: string): Promise<void> {
  await redis.hdel(ROOM_HASH, roomId);
  try {
    await kube.deleteRoom(roomId);
  } catch (err) {
    // Ignore if already deleted
  }
}

async function getRoomData(): Promise<Record<string, RoomData>> {
  const raw = await redis.hgetall(ROOM_HASH);
  return Object.entries(raw).reduce((acc, [id, val]) => {
    acc[id] = JSON.parse(val) as RoomData;
    return acc;
  }, {} as Record<string, RoomData>);
}

sub.on("message", async (channel: string, message: string) => {
  if (channel === "room_create") {
    try {
      const roomId = await createFullRoom();
      await redis.publish("room_created", JSON.stringify({ roomId }));
    } catch (err) {
      // Optionally publish error
    }
  } else if (channel === "room_delete") {
    try {
      const { roomId } = JSON.parse(message);
      await deleteRoom(roomId);
      await redis.publish("room_deleted", JSON.stringify({ roomId }));
    } catch (err) {
      // Optionally publish error
    }
  }
});


async function cleanupOrphanedRooms(): Promise<void> {
  const rooms = await getRoomData();

  for (const roomId of Object.keys(rooms)) {
    try {
      // Check if deployment exists in the namespace
      await kube.getRoom(roomId);
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