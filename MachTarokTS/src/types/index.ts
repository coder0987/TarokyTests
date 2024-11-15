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
