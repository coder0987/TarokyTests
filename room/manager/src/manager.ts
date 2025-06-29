// manager.ts
import {Kube} from './kube';

const kube = new Kube();
Kube.INSTANCE = kube;

import { sub, redis, roomSub } from './redis';
import { Room } from './room';

// Listen for room creation/deletion requests from server.ts
sub.subscribe("room_create");
sub.subscribe("room_delete");

const TARGET_EMPTY_ROOMS = 2;
const MAX_EMPTY_ROOMS = 5;
const CHECK_INTERVAL_MS = 10000;

// listen for server to ask for rooms - useful for custom rooms, daily challenge, etc.
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

roomSub.on("message", async (channel: string, message: string) => {
  const to = await Room.get(channel);

  console.log(`Received message from ${channel}: ${message}`);

  if (!to) {
    // No room with that id
    console.error('No room with the id ' + channel);
    return;
  }

  switch (message) {
    case 'empty':
      // Room had users but no longer does
      to.status = "empty";
      Room.update(to);
      resetEmptyRoomConditional(to.roomId);
      break;
    case 'ready':
      // Room has no users and is reset (either just started or just finished a reset)
      to.status = "ready";
      Room.update(to);
      break;
    case 'running':
      // Room has users actively in it (currently handled by other redis channel)
      break;
    default:
      console.log('unknown message:', message);
  }
});

// Reset a room if it's empty and max capacity isn't exceeded
async function resetEmptyRoomConditional(roomId: string) {
  try {
    await Room.cleanupOrphanedRooms();
    const rooms = await Room.getAll();
    const emptyRooms = Object.values(rooms).filter((r) => r.status === "ready" || r.status === "starting");
    if (MAX_EMPTY_ROOMS - emptyRooms.length > 0) {
      Room.reset(roomId);
    } else {
      Room.delete(roomId);
    }
  } catch (error) {
    console.error("[scaler] Error in resetEmptyRoomConditional:", error);
  }
}

// Check empty rooms and scale up if needed
async function checkAndScaleRooms(): Promise<void> {
  try {
    await Room.cleanupOrphanedRooms();
    const rooms = await Room.getAll();
    const emptyRooms = Object.values(rooms).filter((r) => r.status === "ready" || r.status === "starting");
    const needed = TARGET_EMPTY_ROOMS - emptyRooms.length;
    const excess = emptyRooms.length - MAX_EMPTY_ROOMS;

    console.log("needed: ", needed);
    if (needed > 0) {
      console.log(
        `[scaler] ${emptyRooms.length} empty rooms found. Creating ${needed} more.`
      );
      for (let i = 0; i < needed; i++) {
        await Room.create();
      }
    } else if (excess > 0) {
      // Too many empty rooms, delete the extras
      const extraRooms = emptyRooms.slice(0, excess); // Get the extra rooms to delete
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