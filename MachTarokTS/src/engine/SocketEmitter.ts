import { getSocket } from "./SocketEngine";

export function emitNewRoom(): void {
  const socket = getSocket();
  socket.emit("newRoom");
}

export function emitJoinRoomByCode(code: string): void {
  const socket = getSocket();
  socket.emit("roomConnect", code, true);
}

export function emitSettings(type: string, value: any): void {
  const socket = getSocket();
  socket.emit("settings", type, value);

  console.log(`Settings emitted: ${type} = ${value}`);
}

export function emitSaveSettings(): void {
  const socket = getSocket();
  socket.emit("saveSettings");
}

export function emitGetPlayerList(): void {
  const socket = getSocket();
  socket.emit("getPlayerList");
}

export function emitInvite(socketId: number): void {
  const socket = getSocket();
  socket.emit("invite", socketId);
}

export function emitStartGame(): void {
  const socket = getSocket();
  socket.emit("startGame");
}

export function emitLeaveGame(): void {
  const socket = getSocket();
  socket.emit("exitRoom");
}

export function emitShuffle(): void {
  const socket = getSocket();
  socket.emit("shuffle");
}