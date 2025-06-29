import { ACTION, VALUE } from "./enums";

export type t_value = keyof typeof VALUE;
export type t_suit = "Trump" | "Spade" | "Heart" | "Diamond" | "Club";
export type t_action = keyof typeof ACTION;
export type t_seat = -1 | 0 | 1 | 2 | 3;
export type t_seat_c = 1 | 2 | 3 | 4; //what the client sees

export interface table {
    card: card;
    pn: number;
    lead: boolean;
};

export interface nextStep { 
    player: number;
    action: t_action;
    time: number;
    info: any;
};

export interface card {
    suit: t_suit;
    value: t_value;
    grayed: boolean | undefined;
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
        0: string,
        1: string,
        2: string,
        3: string
    };
    partnerCard?: t_value;
    valat?: t_seat_c;
    iote?: t_seat_c;
    contra?: number;
};

export interface trick {
    leadPlayer: t_seat;
    winner: t_seat;
    cards: card[];
};