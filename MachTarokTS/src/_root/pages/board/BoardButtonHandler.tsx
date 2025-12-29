import { useGame } from "@/context/GameContext";
import { useEffect, useState } from "react";
import BoardButton from "./BoardButton";

type ButtonArray = {
    name: string;
    callback: () => void;
}

const BoardButtonHandler = ({ action }: { action: string }) => {
    const callbacks = useGame().actions;

    const [buttons, setButtons] = useState<ButtonArray[]>([]);

    useEffect(() => {
        switch (action) {
            case 'prever': setButtons([{name:'Go Prever', callback: callbacks.goPrever},{name:'Pass Prever', callback: callbacks.noPrever}]); break;
            case 'valat': setButtons([{name:'Go Valat', callback: callbacks.goValat},{name:'Pass Valat', callback: callbacks.noValat}]); break;
            case 'contra': break;
            case 'povinnostBidaUniChoice': break;
            case '12choice': break;
            case 'choosePartner': break;
            case 'preverTalon': break;
            case 'drawTalon': break;
            default: setButtons([]);
        }
    }, [action]);
    

    return (
        <div className="w-full h-full flex items-center justify-center pointer-events-auto">
            {buttons.map((button: ButtonArray, idx: number) => (
                <BoardButton key={idx} title={button.name} onClick={button.callback} />
            ))}
        </div>
    )
}

export default BoardButtonHandler;