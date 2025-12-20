// This is the actual game board
// It displays the hand, table, important info, current action but not the chat

// Note: board does not contain any state, it is just a display component

import { useGame } from "@/context/GameContext";
import { Action, Card } from "@/types";

const Board = () => {
    const action = useGame().useGameStateSlice((game) => game?.currentAction);

    return (
        <>
            <div>Board</div>
            <p>Action: {action?.action}</p>
        </>
    );
}

export default Board;