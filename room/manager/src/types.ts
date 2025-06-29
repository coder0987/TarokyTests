export interface RoomData {
  roomId: string;
  players: number;
  audience: number;
  status: "starting" | "ready" | "empty" | "active" | "full";
  createdAt: number;
};