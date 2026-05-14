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
            case 'contra': setButtons([{name:'Call Contra', callback: callbacks.callContra}, {name:'Pass Contra', callback: callbacks.passContra}]); break;
            case 'povinnostBidaUniChoice': setButtons([{name:'Call Bida or Uni', callback: callbacks.callPovinnostBidaUniChoice}, {name:'Pass Bida or Uni', callback: callbacks.passPovinnostBidaUniChoice}]); break;
            case '12choice': setButtons([]); break; // Need numbers
            case 'choosePartner': break; // Need choices
            case 'preverTalon': setButtons([{name:'Pass Cards', callback: callbacks.passPreverTalon}, {name:'Keep Cards', callback: callbacks.drawPreverTalon}]); break;
            case 'drawTalon': break; // Need info from server
            case 'iote': setButtons([{name:'Call I on the End', callback: callbacks.callIote}, {name:'Pass I on the End', callback: callbacks.passIote}]); break;
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