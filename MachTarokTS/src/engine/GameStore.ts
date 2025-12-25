import { ClientState, UIGameState } from "@/types";

export class GameStore {
  readonly game = new ClientState();
  readonly ui = new UIGameState();

  private listeners = new Set<() => void>();

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {this.listeners.delete(fn);};
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const gameStore = new GameStore();
