// manager.ts
const Kube = require('./kube');

const kube = new Kube();
Kube.INSTANCE = kube;

const { sub, redis } = require('./redis');
const Room = require('./room');




// Listen for room creation/deletion requests from server.ts
sub.subscribe("room_create");
sub.subscribe("room_delete");

const ROOM_HASH = "rooms";
const TARGET_EMPTY_ROOMS = 2;
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
      await Room.removeRoom(roomId);
      await redis.publish("room_deleted", JSON.stringify({ roomId }));
    } catch (err) {
      // Optionally publish error
    }
  }
});


async function cleanupOrphanedRooms(): Promise<void> {
  const rooms = await Room.getRoomData();

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
    const rooms = Room.rooms;
    const emptyRooms = Object.values(rooms).filter((r : typeof Room) => r.status === "empty");
    const needed = TARGET_EMPTY_ROOMS - emptyRooms.length;

    if (needed > 0) {
      console.log(
        `[scaler] ${emptyRooms.length} empty rooms found. Creating ${needed} more.`
      );
      for (let i = 0; i < needed; i++) {
        new Room();
      }
    } else {
      console.log(`[scaler] Sufficient empty rooms: ${emptyRooms.length}`);
    }
  } catch (error) {
    console.error("[scaler] Error in checkAndScaleRooms:", error);
  }
}

setInterval(checkAndScaleRooms, CHECK_INTERVAL_MS);