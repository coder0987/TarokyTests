export type Account = {
  user: string | null;
  authToken: string | null;
  preferences: {};
};

export type GameState = any; // TODO: fill in details

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
};
