import { SUIT, SUIT_SORT_ORDER, VALUE_REVERSE } from "@/constants";
import { Card, Selectable } from "@/types";

const CardComponent = ({ card, className, angle = true, selectable = Selectable.STANDARD, onClick }: { card: Card, className?: string, angle?: boolean, selectable?: Selectable, onClick?: (card: Card) => void }) => {
    const url = `/assets/mach-deck-thumb/${card.suit.toLowerCase()}-${card.value.toLowerCase()}-t.png`;

    const maxAngle = 10;

    let angleNumber = (SUIT_SORT_ORDER[card.suit] * 7 + VALUE_REVERSE[card.value]*3) % maxAngle*2 - maxAngle;
    let clockwise = true;
    if (angleNumber < 0) {
        angleNumber *= -1;
        clockwise = false;
    }

    const angleStyle = angle ? `transform ${clockwise?'':'-'}rotate-[${angleNumber}deg]` : '';

    const s_sel =
        selectable === Selectable.SELECTABLE
            ? 'transform hover:rotate-0 hover:scale-110 transition-transform duration-200 ease-out cursor-pointer pointer-events-auto'
            : '';
    const d_sel =
        selectable === Selectable.SELECTED
            ? `
            transition-transform duration-200
            scale-105
            ring-4 ring-yellow-400 ring-offset-2
            shadow-lg
            hover:scale-115
            cursor-pointer
            `
            : '';
    const u_sel =
        selectable === Selectable.NOT_SELECTABLE
            ? "opacity-50 grayscale brightness-75 cursor-not-allowed pointer-events-none"
            : "";

    const style = `${angleStyle} ${u_sel} ${s_sel} ${d_sel} ${className} object-contain`;
    
    return (
        <div className={style} onClick={() => onClick(card)}><img src={url} alt={`${card.value} of ${card.suit}s`} /></div>
    );
}

export default CardComponent;