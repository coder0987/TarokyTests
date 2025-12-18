import { useEffect, useState } from "react";
import { gameStore } from "../engine/GameStore";

export function useGameSlice<T>(selector: (gameState: typeof gameStore.game) => T): T {
  const [slice, setSlice] = useState(() => selector(gameStore.game));

  useEffect(() => {
    const handler = () => {
      const newSlice = selector(gameStore.game);
      setSlice(prev => (Object.is(prev, newSlice) ? prev : newSlice));
    };
    
    return gameStore.subscribe(handler);
  }, [selector]);

  return slice;
}
