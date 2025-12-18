import { ClientGameState } from "@/types";
import { gameStore } from "./GameStore";

export function youStart(roomName: string, joinCode: string) {
    console.log(`You will start the game in room ${roomName} (${joinCode})`);
    // If the room does not exist, create the room

    if (gameStore.game.gameState === null || gameStore.game.gameState.roomName !== roomName) {
        gameStore.game.gameState = new ClientGameState(roomName);
    }

    // Then, set the inGame flag and room code
    gameStore.game.inGame = true;
    gameStore.game.gameState.roomCode = joinCode;

    gameStore.notify();
}

export function roomConnected(roomName: string) {
    console.log("Joined room:", roomName);
    if (gameStore.game.gameState === null || gameStore.game.gameState.roomName !== roomName) {
        gameStore.game.gameState = new ClientGameState(roomName);
        gameStore.notify();
    }
}
