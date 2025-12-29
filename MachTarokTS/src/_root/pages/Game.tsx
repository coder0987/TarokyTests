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
            <div className="h-auto w-full">
                <Board />
                <button className="fixed top-5 left-5 bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-red-700 transition" onClick={emitLeaveGame}>Leave Game</button>
            </div>
        </ServerGameProvider>
    )
}

export default Game;