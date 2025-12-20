import { getSocket } from "./SocketEngine";

export function emitNewRoom(): void {
  const socket = getSocket();
  socket.emit("newRoom");
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