import { Card, PlayerIndex, Selectable } from "@/types";
import CardComponent from "./CardComponent";
import { useGame } from "@/context/GameContext";
import { useEffect, useState } from "react";

const Hand = () => {

    // TODO: deck choice

    // TODO: decide what to do with empty hand

    const callbacks = useGame().actions;
    
    const action = useGame().useGameStateSlice((game) => game?.currentAction);
    const pn = useGame().useGameStateSlice((game) => game.myInfo.playerNumber);
    const hand = useGame().useGameStateSlice((game) => game?.myInfo.hand || [] as Card[]);
    const [selected, setSelected] = useState<Card[]>([] as Card[]);

    const handState = (pn as PlayerIndex) === action.player ?
            ( ['lead','discard','follow'].includes(action.action) ? Selectable.SELECTABLE : Selectable.STANDARD )
            : Selectable.STANDARD;

    // Discarding
    const [cardClickCallback, setCardClickCallback] = useState<(card: Card) => void>(() => callbacks.play);

    const discardCallback = (card: Card) => {
        // TODO: limit selection
        if (pn !== action.player || card.grayed) {
            return; // ignore
        }

        if (!selected.includes(card)) {
            setSelected(selected.concat(card));
        } else {
            setSelected(selected.filter((value: Card) => value !== card));
        }
    }

    useEffect( () => {
        setSelected([]);// reset whenever the action changes
        if (action.action === 'discard')
            setCardClickCallback(() => discardCallback);
        else 
            setCardClickCallback(() => callbacks.play);
    }, [action] );

    const cardStyle = "w-12 sm:w-16 md:w-32 h-auto";
    const overlapStyle = "-mt-12 sm:-mt-16 md:-mt-32";

    const s = (card: Card) => {
        if (handState === Selectable.STANDARD) return Selectable.STANDARD;
        if (card.grayed) return Selectable.NOT_SELECTABLE;
        if (selected.includes(card)) return Selectable.SELECTED;
        return Selectable.SELECTABLE;
    }

    if (hand.length <= 6) {
        return (
            <div className="hand flex flex-row">
                {hand.map((card: Card, idx: number) => <CardComponent key={idx} onClick={cardClickCallback} card={card} className={cardStyle} selectable={s(card)} />)
                }
            </div>
        );
    }
    
    return (
        <div className="hand flex flex-col items-center relative">
            <div className="text-white">
                {JSON.stringify(hand)}<br />
                {JSON.stringify(handState)}<br />
                {pn}<br />
                {JSON.stringify(Selectable)}<br />
                {JSON.stringify(action)}<br />
                Action requires hand: {['lead','discard','follow'].includes(action.action) ? 'true' : 'false'}<br />
                Current player's turn: {(pn as PlayerIndex) === action.player ? 'true' : 'false'} <br />
                {typeof pn}, {typeof action.player}
            </div>
            
            <div className="flex flex-row justify-center relative z-0">
                {hand.map((card: Card, idx: number) => {
                        if (idx > hand.length / 2) return;
                        return <CardComponent key={idx} onClick={cardClickCallback} card={card} className={cardStyle} selectable={s(card)} />
                    })
                }
            </div>
            <div className={`flex flex-row justify-center relative z-10 ${overlapStyle}`}>
                {hand.map((card: Card, idx: number) => {
                        if (idx <= hand.length / 2) return;
                        return <CardComponent key={idx} onClick={cardClickCallback} card={card} className={cardStyle} selectable={s(card)} />
                    })
                }
            </div>
        </div>
    );
}

export default Hand;