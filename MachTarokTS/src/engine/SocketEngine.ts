import io, { Socket } from "socket.io-client";
import { authController } from "./AuthEngine";

const SOCKET_URL = "http://localhost:8448"; // !! CHANGE BEFORE BUILD !!

let socket: Socket | null = null;

import { ClientGameState } from "@/types";
import { roomConnected, youStart } from "./SocketListeners";

// Socket listeners (which all must update either the gamestate or the ui state)

function attachListeners(socket: Socket) {
  socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
  });

  socket.on("roomConnected", roomConnected);
  socket.on('youStart', youStart);
}


/* ---------------------------------------
   Socket ID (persisted across sessions)
--------------------------------------- */

function generateSocketId(): number {
  const existing = localStorage.getItem("socketId");
  if (existing) return parseInt(existing, 10);

  const id =
    Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1)) + 1;

  localStorage.setItem("socketId", String(id));
  return id;
}

/* ---------------------------------------
   Socket creation
--------------------------------------- */

export function createSocket(): Socket {
  if (socket) return socket;

  const socketId = generateSocketId();
  const account = authController.account;

  socket = io(SOCKET_URL, {
    auth: {
      token: socketId,
      username: account?.user ?? null,
      signInToken: account?.authToken ?? null,
    },
  });

  attachListeners(socket);

  return socket;
}

/* ---------------------------------------
   Auth-related socket actions
--------------------------------------- */

export function signInUser(): void {
  if (!socket) return;
  if (!authController.isAuthenticated) return;

  socket.emit("signIn", {
    username: authController.account!.user,
    token: authController.account!.authToken,
  });
}

/* ---------------------------------------
   Accessor
--------------------------------------- */

export function getSocket(): Socket {
  if (!socket) {
    throw new Error("Socket has not been created yet");
  }
  return socket;
}

/* ---------------------------------------
   Cleanup (optional)
--------------------------------------- */

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
