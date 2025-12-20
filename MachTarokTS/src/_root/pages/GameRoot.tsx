import { useLocation, useNavigate } from "react-router-dom";
import { useGameSlice } from "../../hooks/useGameSlice";
import { useEffect } from "react";

export function GameRoot({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    //define any other global state here

    const inGame = useGameSlice((game) => game.inGame);
    const action = useGameSlice((game) => game.gameState?.currentAction.action);
    const pathname = useLocation().pathname;

    useEffect(() => {
        const gameStarted = action !== 'start';

        if (inGame && !gameStarted) {
            navigate(`/host`);
        } else if (inGame) {
            navigate(`/game`);
        }

        if (!inGame && (pathname === '/host' || pathname === '/game')) {
            navigate(`/play`);
        }
    }, [inGame, navigate, action, pathname]);

    return (
        <>{children}</>
    );
}