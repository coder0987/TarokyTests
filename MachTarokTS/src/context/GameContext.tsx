import { createContext, useContext, useEffect, useState } from "react";
import { GameState } from "@/types";
import { useSocket } from './SocketContext';

type IContextType = GameState;

const INITIAL_GAMESTATE = {
    
};

const GameContext = createContext<IContextType>(INITIAL_GAMESTATE);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const socket = useSocket().socket;
    const [gamestate, setGamestate] = useState<GameState>(INITIAL_GAMESTATE);
    //define any other global state here

    useEffect(() => {
        if (!socket) return;

        const handleAutoReconnect = (newGameState: GameState) => {
            // Fake some leaderboard scores
            newGameState.leaderboard = [
                {
                    "name": "SkyzDodo",
                    "score": 190,
                    "avatar": 23,
                    "wins": [
                        0,
                        0,
                        0
                    ]
                },
                {
                    "name": "Sobeit",
                    "score": -170,
                    "avatar": 0,
                    "wins": [
                        0,
                        0,
                        0
                    ]
                }
            ]
            
            setGamestate(newGameState);
            console.log(JSON.stringify(newGameState));
        };

        socket.on('autoReconnect', handleAutoReconnect);

        

        return () => {
            socket.off('autoReconnect', handleAutoReconnect);
        };
    }, [socket]);

    return (
        <GameContext.Provider value={ gamestate }>
            {children}
        </GameContext.Provider>
    );
}

export const useGameContext = () => useContext(GameContext);