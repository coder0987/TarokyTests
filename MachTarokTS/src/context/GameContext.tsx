import React, { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import { ClientGameState, GameActions, Scene } from "@/types";
import { emitShuffle } from "@/engine/SocketEmitter";
import { gameStore } from "@/engine/GameStore";
import { createSlicer } from "@/hooks/useGameStateSlice";
import { startTutorial } from "@/engine/TutorialEngine";

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

type TutorialGameProviderProps = {
  children: ReactNode;
  scenes: Scene[];
}

export function TutorialGameProvider({ children, scenes }: TutorialGameProviderProps) {
  const tutorialStore = startTutorial(scenes);

  const slicer = createSlicer(tutorialStore.tutorialState.gameState, handler => tutorialStore.subscribe(handler));

  
  const actions: GameActions = {
      shuffle: () => {},
      // Will also have mappings for all of the other actions as calbacks to the scene
  }

  return (
    <GameContext.Provider value={{ actions, useGameStateSlice: slicer }}>
      {children}
    </GameContext.Provider>
  );
}