import { useNavigate } from "react-router-dom";
import { useGameSlice } from "../../hooks/useGameSlice";
import { useEffect } from "react";

export function GameRoot({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    //define any other global state here

    const inGame = useGameSlice((game) => game.inGame);

    useEffect(() => {
        if (inGame) {
            navigate(`/host`);
        }
    }, [inGame, navigate]);

    return (
        <>{children}</>
    );
}