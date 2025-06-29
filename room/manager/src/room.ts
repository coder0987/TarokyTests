import { v4 as uuidv4 } from "uuid";

import { redis } from './redis';
import {Kube} from './kube';
import { RoomData } from './types';

const kube = Kube.INSTANCE;

const ROOM_PREFIX = "room-";
const ROOM_HASH = "rooms";

export class Room {
    static rooms: { [roomId: string]: Room } = {};

    id: string;
    roomId: string;
    players: number;
    audience: number;
    status: "empty" | "active" | "full";
    createdAt: number;
    
    constructor() {
        this.id = uuidv4();
        this.roomId = `${ROOM_PREFIX}${this.id}`;
        this.players = 0;
        this.audience = 0;
        this.status = 'empty';
        this.createdAt = Date.now();

        Room.rooms[this.roomId] = this;

        insertRoom(this);
        deployRoom(this);
    }

    async remove() {
        // Delete from redis
        await redis.hdel(ROOM_HASH, this.roomId);

        // Delete from kubernetes
        await kube.deleteRoom(this.roomId);

        delete Room.rooms[this.roomId];
    }

    get data(): RoomData {
        return this as RoomData;
    }

    static async removeRoom(roomId: string) {
        Room.rooms[roomId]?.remove();
    }

    static async getRoomData(): Promise<Record<string, RoomData>>  {
        const raw = await redis.hgetall(ROOM_HASH);
        return Object.entries(raw).reduce((acc, [id, val]) => {
            acc[id] = JSON.parse(val as string) as RoomData;
            return acc;
        }, {} as Record<string, RoomData>);
    }
};

async function insertRoom(room : Room) {
    await redis.hset(ROOM_HASH, room.roomId, JSON.stringify(room.data));
};

async function deployRoom(room: Room) {
    kube.deployRoomToK8s(room.roomId);
};
