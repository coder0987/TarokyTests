import { Card } from "@/types";
import { getSocket } from "./SocketEngine";

function log(msg: string) {
  console.log(`Sending "${msg}" to the server`);
}

export function emitSendMessage(message: string): void {
  const socket = getSocket();
  log(`message ${message}`);
  socket.emit("message", message);
}

export function emitNewRoom(): void {
  const socket = getSocket();
  log("newRoom");
  socket.emit("newRoom");
}

export function emitJoinAudience(roomId: string): void {
  const socket = getSocket();
  log(`joinAudience ${roomId}`);
  socket.emit("joinAudience", roomId);
}

export function emitJoinRoom(roomId: string): void {
  const socket = getSocket();
  log(`roomConnect ${roomId} by id`);
  socket.emit("roomConnect", roomId, false);
}

export function emitJoinRoomByCode(code: string): void {
  const socket = getSocket();
  log(`roomConnect ${code} by code`);
  socket.emit("roomConnect", code, true);
}

export function emitSettings(type: string, value: any): void {
  const socket = getSocket();
  log(`settings ${type} ${value}`);
  socket.emit("settings", type, value);
}

export function emitSaveSettings(): void {
  const socket = getSocket();
  log("saveSettings");
  socket.emit("saveSettings");
}

export function emitGetPlayerList(): void {
  const socket = getSocket();
  log("getPlayerList");
  socket.emit("getPlayerList");
}

export function emitInvite(socketId: number): void {
  const socket = getSocket();
  log(`invite ${socketId}`);
  socket.emit("invite", socketId);
}

export function emitStartGame(): void {
  const socket = getSocket();
  log("startGame");
  socket.emit("startGame");
}

export function emitLeaveGame(): void {
  const socket = getSocket();
  log("exitRoom");
  socket.emit("exitRoom");
}

export function emitShuffle(): void {
  const socket = getSocket();
  log("shuffle");
  socket.emit("shuffle");
}

export function emitDeal(): void {
  const socket = getSocket();
  log("deal");
  socket.emit("deal");
}

export function emitGoPrever(): void {
  const socket = getSocket();
  log("goPrever");
  socket.emit("goPrever");
}

export function emitNoPrever(): void {
  const socket = getSocket();
  log("noPrever");
  socket.emit("noPrever");
}

export function emitGoValat(): void {
  const socket = getSocket();
  log("goValat");
  socket.emit("goValat");
}

export function emitNoValat(): void {
  const socket = getSocket();
  log("noValat");
  socket.emit("noValat");
}

export function emitGoContra(): void {
  const socket = getSocket();
  log("goContra");
  socket.emit("goContra");
}

export function emitNoContra(): void {
  const socket = getSocket();
  log("noContra");
  socket.emit("noContra");
}

export function emitPlayCard(card: Card): void {
  const socket = getSocket();
  log(`lead ${card.suit} ${card.value}`);
  socket.emit("lead", { suit: card.suit, value: card.value });
}

export function emitDiscardCard(card: Card): void {
  const socket = getSocket();
  log(`discard ${card.suit} ${card.value}`);
  socket.emit("discard", { suit: card.suit, value: card.value });
}

export function emitMoneyCards(): void {
  const socket = getSocket();
  log("moneyCards");
  socket.emit("moneyCards");
}

export function emitWinTrick(): void {
  const socket = getSocket();
  log("winTrick");
  socket.emit("winTrick");
}
