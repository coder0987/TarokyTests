export type Account = {
  user: string | null;
  authToken: string | null;
  preferences: {};
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
