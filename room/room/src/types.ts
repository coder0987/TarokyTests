import { ACTION, DIFFICULTY, PLAYER_TYPE, VALUE } from "./enums";

export type t_value = keyof typeof VALUE;
export type t_suit = "Trump" | "Spade" | "Heart" | "Diamond" | "Club";
export type t_action = keyof typeof ACTION;
export type t_seat = -1 | 0 | 1 | 2 | 3;
export type t_seat_c = 1 | 2 | 3 | 4; //what the client sees
export type t_difficulty = keyof typeof DIFFICULTY;
export type t_player = keyof typeof PLAYER_TYPE;

export interface table {
    card: card;
    pn: number;
    lead: boolean;
};

export interface nextStep { 
    player: t_seat;
    action: t_action;
    time: number;
    info: any;
};

export interface card {
    suit: t_suit;
    value: t_value;
    grayed?: boolean;
};

export interface importantInfo {
    chips?: {
        0: number,
        1: number,
        2: number,
        3: number
    };
    prever?: t_seat_c;
    preverMultiplier?: number;
    moneyCards?: string[][];
    usernames?: {
        [idx: number]: string | null
    };
    partnerCard?: t_value;
    valat?: t_seat_c;
    iote?: t_seat_c;
    contra?: number;
    povinnost?: t_seat_c;
    pn?: t_seat_c;
};

export interface trick {
    leadPlayer: t_seat;
    winner: t_seat;
    cards: card[];
};

export interface settings {
    lock?: boolean;
    timeout?: number;
    aceHigh?: boolean;
    difficulty?: keyof typeof DIFFICULTY;
    botPlayTime?: number;
    botThinkTime?: number;
};

export interface userInfo {
    avatar: number;
    username?: string;
    elo?: number;
    admin?: boolean;
    settings?: settings;
    deck?: string;
    chat?: boolean;
};