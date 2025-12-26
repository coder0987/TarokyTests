import { Scene, TutorialState } from "@/types";
import { GameStore } from "./GameStore";

export class TutorialStore {
    readonly tutorialState: TutorialState;

    private listeners = new Set<() => void>();
    
    constructor(scenes: Scene[]) {
        this.tutorialState = new TutorialState(scenes);
    }

    subscribe(fn: () => void) {
        this.listeners.add(fn);
        return () => {this.listeners.delete(fn);};
    }

    notify() {
        this.listeners.forEach(fn => fn());
    }
};