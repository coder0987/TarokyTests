import {
  SHUFFLE_TYPE,
  TRUMP_VALUE,
  VALUE_REVERSE,
  VALUE_REVERSE_ACE_HIGH,
} from "./enums";
import Deck from "./Deck";
import { card } from "./types";

export function nextPlayer(pn: number): number {
  return (pn + 1) % 4;
}

export function prevPlayer(pn: number): number {
  return (pn + 3) % 4;
}

export function playerOffset(startingPlayer: number, offset: number): number {
  return (+startingPlayer + +offset) % 4;
}

export function playerPerspective(
  originalPlace: number,
  viewpoint: number
): number {
  //Ex. if player 0 is povinnost and player 1 is AI, then from AI's view player 3 is povinnost
  return (+originalPlace - +viewpoint + 4) % 4;
}

export function shuffleType(givenType: number | undefined): number {
  if (u(givenType)) {
    return SHUFFLE_TYPE.RANDOM as number;
  }
  return givenType! > 0 && givenType! < 4 ? givenType! : SHUFFLE_TYPE.RANDOM as number;
}

export function shuffleLocation(givenLocation: number | undefined): number {
  if (u(givenLocation)) {
    return 32;
  }
  return givenLocation! >= 7 && givenLocation! <= 47 ? givenLocation! : 32;
}

export function findPovinnost(players: { hand: card[] }[]): number {
  let value = 1; // start with the 'II' and start incrementing to next Trump if no one has it until povinnost is found
  while (typeof TRUMP_VALUE[value] !== "undefined") {
    const trump = TRUMP_VALUE[value];
    if (typeof trump !== "undefined") {
      for (let i = 0; i < 4; i++) {
        const player = players[i];
        if (
          player &&
          Array.isArray(player.hand) &&
          Deck.handContainsCard(player.hand, trump)
        ) {
          return i; // found povinnost
        }
      }
    }
    value++;
  }
  // fallback if not found
  return -1;
}

export function findTheI(players: { hand: card[] }[]): number {
  const theI = TRUMP_VALUE[0];
  if (typeof theI === "undefined") return -1;
  for (let i = 0; i < 4; i++) {
    const player = players[i];
    if (
      player &&
      Array.isArray(player.hand) &&
      Deck.handContainsCard(player.hand, theI)
    ) {
      return i; // found the I
    }
  }
  // The I was in the prever talon and was rejected
  return -1;
}

export function whoWon(
  table: { card: card }[],
  leadPlayer: number,
  aceHigh: boolean
): number {
  if (!table || table.length < 4) return -1;
  // First card in the table belongs to the leadPlayer
  const trickLeadCard = table[0]?.card;
  if (!trickLeadCard) return -1;
  const trickLeadSuit = trickLeadCard.suit;
  let highestTrump = -1;
  let currentWinner = 0; // LeadPlayer is assumed to be winning

  const reverseEnum = (aceHigh ? VALUE_REVERSE_ACE_HIGH : VALUE_REVERSE) as {
    [key: string]: number;
  };

  for (let i = 0; i < 4; i++) {
    const entry = table[i];
    const value =
      entry && entry.card ? reverseEnum[entry.card.value] ?? -1 : -1;
    if (
      entry &&
      entry.card &&
      entry.card.suit === "Trump" &&
      value > highestTrump
    ) {
      highestTrump = value;
      currentWinner = i;
    }
  }
  if (highestTrump !== -1) {
    // If a trump was played, then the highest trump wins
    return (leadPlayer + currentWinner) % 4;
  }
  let highestOfLeadSuit = reverseEnum[trickLeadCard.value] ?? -1;
  for (let i = 1; i < 4; i++) {
    const entry = table[i];
    const value =
      entry && entry.card ? reverseEnum[entry.card.value] ?? -1 : -1;
    if (
      entry &&
      entry.card &&
      entry.card.suit === trickLeadSuit &&
      value > highestOfLeadSuit
    ) {
      highestOfLeadSuit = value;
      currentWinner = i;
    }
  }
  // No trumps means that the winner is whoever played the card of the lead suit with the highest value
  return (leadPlayer + currentWinner) % 4;
}

export function u(v: unknown): boolean {
  return typeof v === "undefined";
}

export function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i]!;
    array[i] = array[j]!;
    array[j] = temp;
  }
}

export function cyrb128(str: string): number[] {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

export function sfc32(
  a: number,
  b: number,
  c: number,
  d: number
): () => number {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export function shuffleArraySeeded<T>(array: T[], randFn: () => number): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(randFn() * (i + 1));
    if (j !== i) {
        const temp = array[i]!;
        array[i] = array[j]!;
        array[j] = temp;
    }
  }
}

// Generates a random integer from min to max, inclusive
export function random(min: number, max: number) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  );
}