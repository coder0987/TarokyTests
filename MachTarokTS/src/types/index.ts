import { Socket } from "socket.io-client";

export type PN = 0 | 1 | 2 | 3 | -1; //how the server sees it
export type PlayerIndex = 0 | 1 | 2 | 3;
export type dPN = 1 | 2 | 3 | 4 | -1; // offset for display

export interface Card {
  value: string;
  suit: string;
}

export interface GameSettings {
  timeout: number;
  difficulty: number;
  aceHigh: boolean;
  locked: boolean;
  botPlayTime: number;
  botThinkTime: number;
}

export type Account = {
  user: string | null;
  authToken: string | null;
  wins: number[] | null;
  preferences: {
    elo: number;
    admin: boolean;
    avatar: number;
    displayChat: boolean;
    dailyScore: number;
    defaultSettings: GameSettings;
  };
};

export enum PlayerStatus {
  Offline = "Offline",
  Online = "Online",
  InGame = "In Game",
  Idle = "Idle",
}

export type Player = {
  user: string;
  status: PlayerStatus;
};

export enum Difficulty {
  Beginner = "Beginner",
  Easy = "Easy",
  Normal = "Normal",
  Hard = "Hard",
  Ruthless = "Ruthless",
  AI = "AI",
}

export type Room = {
  numeral: string;
  numPlayers: number;
  numComputers: number;
  availble: number;
};
/* // For the new server
export type PlayerDefinition = {
  piles: string[];
  counters: string[];
  flags: string[];
};

export type BoardDefinition = {
  piles: string[];
  counters: string[];
  flags: string[];
};

export type BasicRules = {
  deck: DeckType;
  numDecks: number;
  deckScaling: number;
  playerMin: number;
  playerMax: number;
  type: number;
  start: string;
  playerDef: PlayerDefinition;
  boardDef: BoardDefinition;
};

export enum DeckType {
  Standard = "Standard",
  Tarok = "Tarok",
}

export type StepsList = {
  [phase: string]: string[];
};*/

export interface ClientGameState {
  startTime: number;
  ticker: number | null;
  players: Player[];
  deck: Card[] | null;
  hand: Card[] | null;
  numCardsSelected: number;
  partners: any;
  handChoices: any;
  theSettings: GameSettings;
  roomCode: string | null;
  returnToGameAvailable: boolean;
  availableRooms: Record<string, any>;
  connectingToRoom: boolean;
  inGame: boolean;
  chipCount: number;
  playerNumber: PN;
  povinnostNumber: PN;
  hostNumber: PN;
  currentAction: string | null;
  baseDeck: Card[];
  returnTableQueue: any[];
  currentTable: any[];
  drawnCards: Card[];
  queued: boolean;
  discardingOrPlaying: boolean;
  timeOffset: number;
  activeUsernames: Record<PlayerIndex, string | null>;
  activeAvatars: Record<PlayerIndex, number>;
}

export interface UIGameState {
  cardBackLoaded: boolean;
  drawnRooms: string[];
  tableDrawnTime: number;
}

export type GameState = {
  client: ClientGameState;
  ui: UIGameState;
  server: any;
}; // TODO: fill in details