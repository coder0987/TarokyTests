import { DIFFICULTY } from "./enums";

export type t_difficulty = keyof typeof DIFFICULTY;

export interface User {
  username: string;
  elo: number;
  admin: boolean;
  settings: any;
  avatar?: number;
  deck?: string;
  chat?: boolean;
};

export interface settings {
    lock?: boolean;
    timeout?: number;
    aceHigh?: boolean;
    difficulty?: keyof typeof DIFFICULTY;
    botPlayTime?: number;
    botThinkTime?: number;
};
