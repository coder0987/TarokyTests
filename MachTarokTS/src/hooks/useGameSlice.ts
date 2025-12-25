import { useEffect, useRef, useState } from "react";
import { gameStore } from "../engine/GameStore";

export function useGameSlice<T>(selector: (gameState: typeof gameStore.game) => T): T {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;
  
  const [slice, setSlice] = useState(() => selector(gameStore.game));

  useEffect(() => {
    const handler = () => {
      const newSlice = selectorRef.current(gameStore.game);
      setSlice(prev => (Object.is(prev, newSlice) ? prev : newSlice));
    };
    
    return gameStore.subscribe(handler);
  }, []);

  return slice;
}
