import { gameStore } from "@/engine/GameStore";
import { emitLeaveGame } from "@/engine/SocketEmitter";
import { useGameSlice } from "@/hooks/useGameSlice"
import { useEffect, useState } from "react";

const Game = () => {
    const action = useGameSlice((game) => game.gameState?.currentAction);
    
    return (
        <>
            <p>Game</p>
            <p>{action?.action}</p>
            {JSON.stringify(gameStore, null, 2)}
            <button onClick={emitLeaveGame}>Leave Game</button>
        </>
    )
}

export default Game;