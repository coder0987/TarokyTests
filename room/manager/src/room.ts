import { v4 as uuidv4 } from "uuid";
import { redis } from "./redis";
import { Kube } from "./kube";
import { RoomData } from "./types";

const kube = Kube.INSTANCE;
const ROOM_PREFIX = "room-";
const ROOM_HASH = "rooms";

export class Room {
  id: string;
  roomId: string;
  players: number;
  audience: number;
  status: "empty" | "active" | "full";
  createdAt: number;

  constructor(data?: Partial<RoomData>) {
    this.id = uuidv4();
    this.roomId = data?.roomId || `${ROOM_PREFIX}${this.id}`;
    this.players = data?.players ?? 0;
    this.audience = data?.audience ?? 0;
    this.status = data?.status ?? "empty";
    this.createdAt = data?.createdAt ?? Date.now();
  }

  get data(): RoomData {
    return this as RoomData;
  }

  static async create(): Promise<Room> {
    const room = new Room();
    await redis.hset(ROOM_HASH, room.roomId, JSON.stringify(room.data));
    await kube.deployRoomToK8s(room.roomId);
    return room;
  }

  static async delete(roomId: string): Promise<void> {
    await redis.hdel(ROOM_HASH, roomId);
    await kube.deleteRoom(roomId);
  }

  static async getAll(): Promise<Record<string, RoomData>> {
    const raw = await redis.hgetall(ROOM_HASH);
    return Object.entries(raw).reduce((acc, [id, val]) => {
      acc[id] = JSON.parse(val as string) as RoomData;
      return acc;
    }, {} as Record<string, RoomData>);
  }

  static async get(roomId: string): Promise<Room | null> {
    const val = await redis.hget(ROOM_HASH, roomId);
    if (!val) return null;
    return new Room(JSON.parse(val));
  }

  static async update(room: Room): Promise<void> {
    await redis.hset(ROOM_HASH, room.roomId, JSON.stringify(room.data));
  }
}
