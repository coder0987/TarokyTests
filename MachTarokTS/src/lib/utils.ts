import { PlayerStatus } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColorClass = (playerStatus: PlayerStatus): string => {
  switch (playerStatus) {
    case PlayerStatus.Offline:
      return "offline";
    case PlayerStatus.Online:
      return "online";
    case PlayerStatus.InGame:
      return "in-game";
    case PlayerStatus.Idle:
      return "idle";
    default:
      return "offline";
  }
};
