import React, { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import { Card, ClientGameState, GameActions, Scene } from "@/types";
import { emitChoosePartner, emitDeal, emitDiscardCards, emitDrawTalon, emitGoBidaUni, emitGoContra, emitGoIOTE, emitGoPrever, emitGoPreverTalon, emitGoValat, emitMoneyCards, emitNoBidaUni, emitNoContra, emitNoIOTE, emitNoPrever, emitNoPreverTalon, emitNoValat, emitPassTalon, emitPlayCard, emitShuffle, emitTwelveChoice, emitWinTrick } from "@/engine/SocketEmitter";
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
    discard: emitDiscardCards,
    play: emitPlayCard,
    drawTalon: emitDrawTalon,
    passTalon: emitPassTalon,
    moneyCards: emitMoneyCards,
    callContra: emitGoContra,
    passContra: emitNoContra,
    winTrick: emitWinTrick,
    deal: emitDeal,
    goPrever: emitGoPrever,
    noPrever: emitNoPrever,
    goValat: emitGoValat,
    noValat: emitNoValat,
    twelveChoice: emitTwelveChoice,
    drawPreverTalon: emitGoPreverTalon,
    passPreverTalon: emitNoPreverTalon,
    callPovinnostBidaUniChoice: emitGoBidaUni,
    passPovinnostBidaUniChoice: emitNoBidaUni,
    playWithPartner: emitChoosePartner,
    callIote: emitGoIOTE,
    passIote: emitNoIOTE,
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
    shuffle: () => { },
    discard: (cards: Card[]) => { },
    play: (card: Card) => { },
    drawTalon: () => { },
    passTalon: () => { },
    moneyCards: () => { },
    callContra: () => { },
    passContra: () => { },
    winTrick: () => { },
    deal: () => { },
    goPrever: () => { },
    noPrever: () => { },
    goValat: () => { },
    noValat: () => { },
    twelveChoice: () => { },
    drawPreverTalon: () => { },
    passPreverTalon: () => { },
    callPovinnostBidaUniChoice: () => { },
    passPovinnostBidaUniChoice: () => { },
    playWithPartner: () => { },
    callIote: () => { },
    passIote: () => { },
  }

  return (
    <GameContext.Provider value={{ actions, useGameStateSlice: slicer }}>
      {children}
    </GameContext.Provider>
  );
}