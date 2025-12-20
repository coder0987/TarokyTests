import { ClientGameState } from "@/types";
import { useEffect, useState } from "react";

export function createSlicer<ClientGameState>(gameState: ClientGameState, subscribe: (handler: () => void) => () => void) {
    return function useSlice<S>(selector: (piece: ClientGameState) => S): S {
        const [slice, setSlice] = useState(() => selector(gameState));

        useEffect(() => {
            const handler = () => {
                const newSlice = selector(gameState);
                setSlice(prev => (Object.is(prev, newSlice) ? prev : newSlice));
            };
            
            return subscribe(handler);
        }, [selector]);

        return slice;
    }
}


