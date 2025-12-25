import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { ClientGameState, GameActions } from "@/types";
import { emitShuffle } from "@/engine/SocketEmitter";
import { gameStore } from "@/engine/GameStore";
import { createSlicer } from "@/hooks/useGameStateSlice";

type GameContextType<T> = {
  useGameStateSlice: <S>(selector: (state: T) => S) => S;
  actions: GameActions;
};

const GameContext = createContext<GameContextType<ClientGameState> | null>(null);

export const useGame = () => {
  const ctx = useContext(GameContext) as GameContextType<ClientGameState> | null;
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};

export function ServerGameProvider({ children }: PropsWithChildren) {
  const state = gameStore.game.gameState;

  const actions: GameActions = {
    shuffle: emitShuffle,
  };

  const slicer = createSlicer(state, handler => gameStore.subscribe(handler));

  return (
    <GameContext.Provider value={{ actions, useGameStateSlice: slicer }}>
      {children}
    </GameContext.Provider>
  );
}
