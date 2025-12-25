import { useLocation, useNavigate } from "react-router-dom";
import { useGameSlice } from "../../hooks/useGameSlice";
import { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { shiftFirstInvite } from "@/engine/GameEngine";
import { emitJoinRoomByCode } from "@/engine/SocketEmitter";

export function GameRoot({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { showToast } = useToast();
    //define any other global state here

    const inGame = useGameSlice((game) => game.inGame);
    const action = useGameSlice((game) => game.gameState?.currentAction.action);
    const pathname = useLocation().pathname;
    const invites = useGameSlice((game) => game.invites);

    useEffect(() => {
        // Display invites one at a time, each for 5 seconds
        if (invites.length > 0) {
            const invite = shiftFirstInvite();
            console.log('Invite received:', invite);
            showToast(
                'Click here to join',
                null,
                `${invite.playerName} wants to play Taroky!`,
                () => {console.log('Click!');emitJoinRoomByCode(invite.joinCode)}
            );
        }
    }, [invites]);

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