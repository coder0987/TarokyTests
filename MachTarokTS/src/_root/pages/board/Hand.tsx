import { Card } from "@/types";

const Hand = ({ hand }: {hand: Card[] }) => {

    // TODO: deck choice

    // TODO: decide what to do with empty hand
    
    return (
        <div className="hand">
            {hand.map((card: Card) => {
                    const id = `${card.value}${card.suit}`;
                    const url = `/assets/mach-deck-thumb/${card.value.toLowerCase()}-${card.suit.toLowerCase()}-t.png`;
                    
                    return (
                        <div key={id}><img src={url} alt={`${card.value} of ${card.suit}`} /></div>
                    );
                })
            }
        </div>
    );
}

export default Hand;