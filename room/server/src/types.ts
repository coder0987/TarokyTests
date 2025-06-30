import { DIFFICULTY } from "./enums";
import Settings from "./Settings";

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

export interface Card {
    value: string;
    suit: string;
};

export interface Player {
    hand: Card[];
    chips?: number;
};

export interface Room {
    settings: Settings;
    players: Player[];
    board: any;
    name?: string;
};
