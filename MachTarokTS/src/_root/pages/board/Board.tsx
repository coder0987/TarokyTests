// This is the actual game board
// It displays the hand, table, important info, current action but not the chat

// Note: board does not contain any state, it is just a display component

import { useGame } from "@/context/GameContext";
import { Action, Card } from "@/types";
import Hand from "./Hand";

const Board = () => {
    const action = useGame().useGameStateSlice((game) => game?.currentAction);
    const hand = useGame().useGameStateSlice((game) => game?.myInfo.hand || [] as Card[]);

    return (
        <>
            <div>Board</div>
            <p>Action: {action?.action}</p>
            <Hand hand={hand} />
        </>
    );
}

export default Board;