import { useGame } from "@/context/GameContext";
import { Card, TableCard } from "@/types";
import CardComponent from "./CardComponent";
import { useEffect, useRef } from "react";
import { shiftTableQueue } from "@/engine/GameEngine";

const Table = () => {
    const table = useGame().useGameStateSlice((game) => game?.currentTable);
    const preverTalon = useGame().useGameStateSlice((game) => game?.preverTalon);
    const rejectedPreverTalon = useGame().useGameStateSlice((game) => game?.rejectedPreverTalon);
    const discardedTrump = useGame().useGameStateSlice((game) => game?.trumpDiscard);
    
    const tableQueue = useGame().useGameStateSlice((game) => game?.tableQueue);
    const timeout = useRef(null);

    const clearTable = () => {
        clearTimeout(timeout.current);
        shiftTableQueue();
    }

    useEffect(() => {
        if (!table && tableQueue.length > 0) {
            shiftTableQueue();
        } else if (tableQueue.length > 0 && !timeout.current) {
            // we're displaying cards and more cards want to be displayed
            timeout.current = setTimeout(clearTable, 3000);
        }
    }, [tableQueue])
    
    return (
        <>
            <div>
                table
            {table &&
                <div>
                    {table.map((card: TableCard, key: number) => {
                        return (
                            <CardComponent key={key} angle={false} card={card.card} />
                        )
                    })}
                </div>
            }
            {preverTalon &&
                <div>
                    <p>Would you like to keep these?</p>
                    {preverTalon.map((card: Card, key: number) => {
                        return (
                            <CardComponent key={key} angle={false} card={card} />
                        )
                    })}
                </div>
            }
            {rejectedPreverTalon &&
                <div>
                    <p>Rejected prever talon:</p>
                    {rejectedPreverTalon.map((card: Card, key: number) => {
                        return (
                            <CardComponent key={key} angle={false} card={card} />
                        )
                    })}
                </div>
            }
            {discardedTrump &&
                <div>
                    <p>Discarded Trump:</p>
                    {discardedTrump.map((card: Card, key: number) => {
                        return (
                            <CardComponent key={key} angle={false} card={card} />
                        )
                    })}
                </div>
            }
            </div>
        </>
        
    )
}

export default Table;