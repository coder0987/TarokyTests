import { SUIT, VALUE } from "@/constants";
import { ClientGameState, Scene, Tutorial } from "@/types";

const introTutorialScenes: Scene[] = [
  {
    trainer: true,
    text: "So you want to play Taroky?",
  },
  {
    trainer: true,
    text: "At first glance, this game has a lot of rules.",
  },
  {
    trainer: true,
    flip: true,
    text: "Grandpa needs your help!",
  },
  {
    board: {
      instruction: "Click the three of diamonds to play it",
      enableCards: [{ value: VALUE.THREE, suit: SUIT.DIAMONDS }],
      shouldAdvance: (cardId: string) => cardId === `${VALUE.THREE}${SUIT.DIAMONDS}`,
    },
  },
];

const introTutorialStartingConfiguration: ClientGameState = new ClientGameState('introTutorial');

export const introTutorial: Tutorial = {
    scenes: introTutorialScenes,
    startingConfiguration: introTutorialStartingConfiguration
};