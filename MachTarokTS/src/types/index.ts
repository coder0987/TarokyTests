import { Socket } from "socket.io-client";

export type PN = 0 | 1 | 2 | 3 | -1; //how the server sees it
export type PlayerIndex = 0 | 1 | 2 | 3;
export type dPN = 1 | 2 | 3 | 4 | -1; // offset for display

export enum MESSAGE_TYPE {
  POVINNOST = 0,
  MONEY_CARDS = 1,
  PARTNER = 2,
  VALAT = 3,
  CONTRA = 4,
  IOTE = 5,
  LEAD = 6,
  PLAY = 7,
  WINNER = 8,
  PREVER_TALON = 9,
  PAY = 10,
  CONNECT = 11,
  DISCONNECT = 12,
  SETTING = 13,
  TRUMP_DISCARD = 14,
  NOTATION = 15,
  DRAW = 16,
  CUT = 17,
}

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

export const DEFAULT_SETTINGS: GameSettings = {
  timeout: 15,
  difficulty: 3,
  aceHigh: false,
  locked: false,
  botPlayTime: 1500,
  botThinkTime: 1000,
};

export type Account = {
  user: string | null;
  authToken: string | null;
  wins: number[] | null;
  preferences: {
    elo: number;
    admin: boolean;
    avatar: number;
    deck: string;
    displayChat: boolean;
    dailyScore: number;
    defaultSettings: GameSettings;
  };
};

export interface AutoReconnectPayload {
  // account / auth
  username?: string;
  elo?: number;
  avatar?: number;
  admin?: boolean;
  chat?: boolean;
  deck?: string;
  defaultSettings?: GameSettings;
  dailyChallengeScore?: number;

  // lobby / global
  playerCount?: number;
  leaderboard?: any[];

  // game identity
  pn?: PlayerIndex;
  host?: {
    number: PlayerIndex;
    name: string;
    joinCode: string;
  };

  // game state
  povinnost?: PlayerIndex;
  hand?: Card[];
  withGray?: boolean;
  table?: any[];
  chips?: number;
  settings?: GameSettings;
  roundInfo?: any; // already decoded elsewhere
  nextAction?: any;

  // room state
  roomConnected?: string;
  audienceConnected?: string;
  playersInGame?: any[];
}


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

export enum DifficultyReverse {
  "Beginner" = 0,
  "Easy" = 1,
  "Normal" = 2,
  "Hard" = 3,
  "Ruthless" = 4,
  "AI" = 5,
}

export type Room = {
  numeral: string;
  numPlayers: number;
  numComputers: number;
  availble: number;
};

export type Action = {
  action: string;
  player: PlayerIndex;
  time: number;
  info: any;
}

//* // For the new server
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
};//*/

// Chat types
export type ChatMessage = {
  author: string;
  message: string;
  timestamp: string;
  bold?: boolean;
};

// GameState class, to handle all of the game-related data

export class GamePlayer {
  username: string;
  avatar: number;
  seat: PlayerIndex;
  chips: number;
  moneycards: string[];

  constructor() {
    this.username = "Guest";
    this.avatar = 0;
    this.seat = 0;
    this.chips = 100;
    this.moneycards = [];
  }
}

export class MyInfoInGame {
  hand: Card[] | null;
  gray: boolean;
  partners: any;
  handChoices: any;
  playerNumber: PN;
  drawnCards: Card[];

  constructor() {
    this.hand = null;
    this.partners = null;
    this.handChoices = null;
    this.playerNumber = -1;
    this.drawnCards = [];
    this.gray = false;
  }
}

export class ClientGameState {
  // Data related to the specific game that the client is in
  roomCode: string | null;
  roomName: string;
  gamePlayers: GamePlayer[];// always of length 4
  settings: GameSettings;
  hostNumber: PN;
  currentAction: Action;

  povinnost?: PlayerIndex;
  prever?: PN;
  preverMultiplier?: number;
  valat?: PN;
  iote?: PN;
  contra?: number;
  partnerCard?: string;

  myInfo: MyInfoInGame;

  returnTableQueue: any[];
  currentTable: any[];

  constructor(roomName: string) {
    this.roomName = roomName;
    this.roomCode = null;
    this.gamePlayers = [new GamePlayer(), new GamePlayer(), new GamePlayer(), new GamePlayer()];
    this.settings = null;
    this.povinnost = 0;
    this.hostNumber = -1;
    this.currentAction = { action: "start", player: 0, time: 0, info: {} };
    this.myInfo = new MyInfoInGame();
    this.returnTableQueue = [];
    this.currentTable = [];
  }
}

export class ClientState {
  startTime: number;
  ticker: number | null;
  inGame: boolean;
  connectedPlayers: Player[]; // all players on the server. Used for invite list
  numPlayers: number; // for "X players online"
  returnToGameAvailable: boolean; // will adjust this later to offer multiple "continue" games
  availableRooms: Record<string, any>;
  connectingToRoom: boolean;
  leaderboard: any[] | null;
  dailyChallengeScore: number | null;
  invites: { roomName: string; joinCode: string; playerName: string }[];

  gameState: ClientGameState | null;

  constructor() {
    this.startTime = Date.now();
    this.ticker = null;
    this.inGame = false;
    this.gameState = null; // set when a game is joined
    this.connectedPlayers = [];
    this.numPlayers = 0;
    this.returnToGameAvailable = false;
    this.availableRooms = {};
    this.connectingToRoom = false;
    this.leaderboard = null;
    this.dailyChallengeScore = null;
    this.invites = [];
  }
}

export class UIGameState {
  cardBackLoaded: boolean;
  drawnRooms: string[];
  tableDrawnTime: number;

  constructor() {
    this.cardBackLoaded = false;
    this.drawnRooms = [];
    this.tableDrawnTime = 0;
  }
}
