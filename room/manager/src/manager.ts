// manager.ts
import {Kube} from './kube';

const kube = new Kube();
Kube.INSTANCE = kube;

import { sub, redis } from './redis';
import { Room } from './room';

// Listen for room creation/deletion requests from server.ts
sub.subscribe("room_create");
sub.subscribe("room_delete");

const ROOM_HASH = "rooms";
const TARGET_EMPTY_ROOMS = 2;
const MAX_EMPTY_ROOMS = 5;
const CHECK_INTERVAL_MS = 10000;

sub.on("message", async (channel: string, message: string) => {
  if (channel === "room_create") {
    try {
      const roomId = (new Room()).roomId;
      await redis.publish("room_created", JSON.stringify({ roomId }));
    } catch (err) {
      // Optionally publish error
    }
  } else if (channel === "room_delete") {
    try {
      const { roomId } = JSON.parse(message);
      await Room.delete(roomId);
      await redis.publish("room_deleted", JSON.stringify({ roomId }));
    } catch (err) {
      // Optionally publish error
    }
  }
});


async function cleanupOrphanedRooms(): Promise<void> {
  const rooms = await Room.getAll();

  for (const roomId of Object.keys(rooms)) {
    try {
      // Check if deployment exists in the namespace
      await kube.getRoom(roomId);
      // Deployment exists, no action needed
    } catch (err: any) {
      if (err.statusCode === 404) {
        // Deployment not found — remove room from Redis
        await Room.delete(roomId);
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
    const rooms = await Room.getAll();
    const emptyRooms = Object.values(rooms).filter((r) => r.status === "empty");
    const needed = TARGET_EMPTY_ROOMS - emptyRooms.length;
    console.log("needed: ", needed);
    if (needed > 0) {
      console.log(
        `[scaler] ${emptyRooms.length} empty rooms found. Creating ${needed} more.`
      );
      for (let i = 0; i < needed; i++) {
        await Room.create();
      }
    } else if (needed < 0) {
      // Too many empty rooms, delete the extras
      const extraRooms = emptyRooms.slice(0, -needed); // Get the extra rooms to delete
      for (const room of extraRooms) {
        await Room.delete(room.roomId);
        console.log(`[scaler] Deleted extra empty room: ${room.roomId}`);
      }
    } else {
      console.log(`[scaler] Sufficient empty rooms: ${emptyRooms.length}`);
    }
  } catch (error) {
    console.error("[scaler] Error in checkAndScaleRooms:", error);
  }
};

setInterval(checkAndScaleRooms, CHECK_INTERVAL_MS);