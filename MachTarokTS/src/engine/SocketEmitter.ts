import { getSocket } from "./SocketEngine";

export function emitNewRoom(): void {
  const socket = getSocket();
  socket.emit("newRoom");
}