// This is the actual game board
// It displays the hand, table, important info, current action but not the chat

// Note: board does not contain any state, it is just a display component

import { useGame } from "@/context/GameContext";
import Hand from "./Hand";
import CardBack from "./CardBack";
import { useEffect, useState } from "react";
import BoardButton from "./BoardButton";
import BoardButtonHandler from "./BoardButtonHandler";

const Board = () => {
    const inGame = useGame().useGameStateSlice((game) => game);
    if (!inGame) {
        return (
            <h2>Oops! You aren't in a game!</h2>
        );
    }

    // Actions
    const callbacks = useGame().actions;

    const action = useGame().useGameStateSlice((game) => game?.currentAction);

    const buttonActions = ['prever','valat','contra','povinnostBidaUniChoice','12choice','choosePartner','preverTalon','drawTalon'];

    useEffect(() => {
        switch (action.action) {
            case 'deal': callbacks.deal(); break;
            case 'moneyCards': callbacks.moneyCards(); break;
            case 'winTrick': callbacks.winTrick(); break;
        }
    }, [action]);
    

    return (
        <div className="w-full flex justify-center items-center overflow-hidden">
            <div className="relative">
                <img
                    src="/assets/game-assets/card-table.png"
                    alt="Card table"
                    className="max-h-[95vh] w-auto object-contain pointer-events-none"
                    />

                <div className="absolute inset-0 flex flex-col pointer-events-none">
                    <div>Board</div>
                    <p className="text-white">Action: {action?.action}</p>
                    {action.action === 'shuffle' && 
                        <div className="w-full h-full flex items-center justify-center pointer-events-auto">
                            <CardBack onClick={callbacks.shuffle} />
                        </div>
                    }
                    {buttonActions.includes(action.action) && 
                        <BoardButtonHandler action={action.action} />
                    }

                    <div className="mt-auto mb-[-5px] flex justify-center pointer-events-auto">
                        <Hand />
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Board;