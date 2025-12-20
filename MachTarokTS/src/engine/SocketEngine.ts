import io, { Socket } from "socket.io-client";
import { authController } from "./AuthEngine";

const SOCKET_URL = "http://localhost:8448"; // !! CHANGE BEFORE BUILD !!

let socket: Socket | null = null;

import { admin, audienceConnected, audienceNotConnected, autoAction, autoReconnect, avatar, broadcast, challengeComplete, chat, chatMessage, dailyChallengeScore, deckChoice, defaultSettings, elo, failedDiscard, failedPlayCard, gameEnded, handleGameMessage, invite, message, nextAction, reload, returnChips, returnHand, returnPlayerCount, returnPlayerList, returnPlayersInGame, returnPN, returnPossiblePartners, returnPovinnost, returnRooms, returnRoundInfo, returnSettings, returnTable, returnToGame, roomConnected, roomNotConnected, startingGame, timeSync, twelveChoice, youStart } from "./SocketListeners";

// Socket listeners (which all must update either the gamestate or the ui state)

function attachListeners(socket: Socket) {
  socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
  });

  socket.on('timeSync', timeSync);
  socket.on('reload', reload);
  socket.on('broadcast', broadcast);
  socket.on('youStart', youStart);
  socket.on("roomConnected", roomConnected);
  socket.on('roomNotConnected', roomNotConnected);
  socket.on('audienceConnected', audienceConnected);
  socket.on('audienceNotConnected', audienceNotConnected);
  socket.on('startingGame', startingGame);
  socket.on('returnRooms', returnRooms);
  socket.on('returnToGame', returnToGame);
  socket.on('dailyChallengeScore', dailyChallengeScore);
  socket.on('returnPlayerList', returnPlayerList);
  socket.on('invite', invite);
  socket.on('returnPlayerCount', returnPlayerCount);
  socket.on('chatMessage', chatMessage);
  socket.on('message', message);
  socket.on('returnPovinnost', returnPovinnost);
  socket.on('returnHand', returnHand);
  socket.on('returnTable', returnTable);
  socket.on('returnChips', returnChips);
  socket.on('returnPossiblePartners', returnPossiblePartners);
  socket.on('returnSettings', returnSettings);
  socket.on('returnPlayersInGame', returnPlayersInGame);
  socket.on('returnPN', returnPN);
  socket.on('12Choice', twelveChoice);
  socket.on('returnRoundInfo', returnRoundInfo);
  socket.on('autoAction', autoAction);
  socket.on('nextAction', nextAction);
  socket.on('failedDiscard', failedDiscard);
  socket.on('failedPlayCard', failedPlayCard);
  socket.on('gameEnded', gameEnded);
  socket.on('challengeComplete', challengeComplete);
  socket.on('gameMessage', handleGameMessage);
  socket.on('elo', elo);
  socket.on('avatar', avatar);
  socket.on('chat', chat);
  socket.on('deckChoice', deckChoice);
  socket.on('admin', admin);
  socket.on('defaultSettings', defaultSettings);
  socket.on('autoReconnect', autoReconnect);

  socket.on('loginSuccess', authController.loginSuccess);
  socket.on('loginFailed', authController.loginFailure);
  socket.on('loginExpired', authController.loginFailure);
  socket.on('logout', authController.loginFailure);
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

export function signInUser(username: string, token: string): void {
  if (!socket) return;

  socket.emit("signIn", {
    username: username,
    token: token,
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
