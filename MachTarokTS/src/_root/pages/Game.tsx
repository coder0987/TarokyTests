import { gameStore } from "@/engine/GameStore";
import { emitLeaveGame } from "@/engine/SocketEmitter";
import { useGameSlice } from "@/hooks/useGameSlice"
import { useEffect, useState } from "react";
import Board from "./board/Board";
import { ServerGameProvider } from "@/context/GameContext";

// Game is the page. It displays the board, the chat/ledger, and higher-level game actions like leaving the game

const Game = () => {
    
    return (
        <ServerGameProvider>
            <p>Game</p>
            <Board />
            <button onClick={emitLeaveGame}>Leave Game</button>
        </ServerGameProvider>
    )
}

export default Game;