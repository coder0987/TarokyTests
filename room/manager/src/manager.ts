// manager.ts
import * as k8s from "@kubernetes/client-node";
import fs from "fs";
import * as yaml from "js-yaml";
import Redis from "ioredis";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const redisHost: string = process.env.REDIS_HOST || "localhost";
const redisPort: number = parseInt(process.env.REDIS_PORT || "6379", 10);
const redis = new Redis({ host: redisHost, port: redisPort });
const sub = new Redis({ host: redisHost, port: redisPort });

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApiApps = kc.makeApiClient(k8s.AppsV1Api);
const k8sApiCore = kc.makeApiClient(k8s.CoreV1Api);

const ROOM_PREFIX = "room-";
const ROOM_HASH = "rooms";
const NAMESPACE = "taroky-namespace";

interface RoomData {
  roomId: string;
  players: number;
  audience: number;
  status: "empty" | "active" | "full";
  createdAt: number;
}

function buildRoomResources(roomId: string): any[] {
  const rawYaml = fs.readFileSync(
    path.join(__dirname, "room-template.yaml"),
    "utf8"
  );
  const filledYaml = rawYaml.replace(/room-PLACEHOLDER/g, roomId);
  return yaml.loadAll(filledYaml) as any[];
}

async function deployRoomToK8s(roomId: string): Promise<void> {
  const resources = buildRoomResources(roomId);
  for (const resource of resources) {
    if (resource.kind === "Deployment") {
      await k8sApiApps.createNamespacedDeployment(NAMESPACE, resource);
    } else if (resource.kind === "Service") {
      await k8sApiCore.createNamespacedService(NAMESPACE, resource);
    }
  }
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
  await deployRoomToK8s(roomId);
  return roomId;
}

async function deleteRoom(roomId: string): Promise<void> {
  await redis.hdel(ROOM_HASH, roomId);
  try {
    await k8sApiApps.deleteNamespacedDeployment(roomId, NAMESPACE);
    await k8sApiCore.deleteNamespacedService(roomId, NAMESPACE);
  } catch (err) {
    // Ignore if already deleted
  }
}

// Listen for room creation/deletion requests from server.ts
sub.subscribe("room_create");
sub.subscribe("room_delete");

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
