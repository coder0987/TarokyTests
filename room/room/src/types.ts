import { VALUE } from "./enums";

export type t_value = keyof typeof VALUE;
export type t_suit = "Trump" | "Spade" | "Heart" | "Diamond" | "Club";

export interface card {
    suit: t_suit;
    value: t_value;
    grayed: boolean | undefined;
};