import { RED_VALUE, SUIT, VALUE } from "@/constants";
import { Scene } from "@/types";

// TODO: some starting state

export const introTutorial: Scene[] = [
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
