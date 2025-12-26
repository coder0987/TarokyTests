import { Card, GameActions, Scene } from "@/types";
import { TutorialStore } from "./TutorialStore";

export function startTutorial(scenes: Scene[]) {
    return new TutorialStore(scenes);
}