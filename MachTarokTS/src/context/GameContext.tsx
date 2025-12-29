import React, { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import { Card, ClientGameState, GameActions, Scene } from "@/types";
import { emitDeal, emitDiscardCard, emitGoPrever, emitGoValat, emitMoneyCards, emitNoPrever, emitNoValat, emitPlayCard, emitShuffle, emitWinTrick } from "@/engine/SocketEmitter";
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
    discard: emitDiscardCard,
    play: emitPlayCard,
    moneyCards: emitMoneyCards,
    winTrick: emitWinTrick,
    deal: emitDeal,
    goPrever: emitGoPrever,
    noPrever: emitNoPrever,
    goValat: emitGoValat,
    noValat: emitNoValat,
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
      discard: (card: Card) => {},
      play: (card: Card) => {},
      moneyCards: () => {},
      winTrick: () => {},
      deal: () => {},
      goPrever: () => {},
      noPrever: () => {},
      goValat: () => {},
      noValat: () => {},
      // Will also have mappings for all of the other actions as calbacks to the scene
  }

  return (
    <GameContext.Provider value={{ actions, useGameStateSlice: slicer }}>
      {children}
    </GameContext.Provider>
  );
}