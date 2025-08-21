import { createContext, useContext, useEffect, useState } from "react";
import { GameState } from "@/types";
import { useSocket } from './SocketContext';

const INITIAL_GAMESTATE: GameState = {
    client: {
        startTime: Date.now(),
        ticker: null,
        players: null,
        deck: null,
        hand: null,
        numCardsSelected: 0,
        partners: null,
        handChoices: null,
        theSettings: null,
        roomCode: null,
        returnToGameAvailable: false,
        availableRooms: {},
        connectingToRoom: false,
        inGame: false,
        chipCount: 100,
        playerNumber: -1,
        povinnostNumber: -1,
        hostNumber: -1,
        currentAction: null,
        baseDeck: null,//TODO generateBaseDeck(),
        returnTableQueue: [],
        currentTable: [],
        drawnCards: [],
        queued: false,
        discardingOrPlaying: true,
        timeOffset: 0,
        activeUsernames: {
            0: null,
            1: null,
            2: null,
            3: null,
        },
        activeAvatars: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
        },
    },
    ui: {
        cardBackLoaded: false,
        drawnRooms: null,
        tableDrawnTime: 0,
    },
    server: {
        // To be loaded in
    }
};

const GameContext = createContext<GameState>(INITIAL_GAMESTATE);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const socket = useSocket().socket;
    const [gamestate, setGamestate] = useState<GameState>(INITIAL_GAMESTATE);
    //define any other global state here

    useEffect(() => {
        if (!socket) return;

        const handleAutoReconnect = (newGameState: GameState) => {
            // Fake some leaderboard scores
            newGameState.server.leaderboard = [
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