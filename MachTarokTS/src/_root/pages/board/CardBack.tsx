const CardBack = ({ onClick }: { onClick: () => void }) => {
    const cardStyle = "w-12 sm:w-16 md:w-32 h-auto";
    
    return (
        <img onClick={onClick} className={`${cardStyle} object-contain`} src="/assets/mach-deck-thumb/card-back-t.png" />
    )
}

export default CardBack;