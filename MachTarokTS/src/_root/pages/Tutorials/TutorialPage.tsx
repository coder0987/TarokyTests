import { useTutorial } from "@/hooks/useTutorial";
import { Scene } from "@/types";
import TrainerOverlay from "./TrainerOverlay";
import Board from "../Board";
import { TutorialGameProvider } from "@/context/GameContext";

const TutorialPage = ({ scenes }: { scenes: Scene[] }) => {
    // TODO: Actual scenes will instead come from grabbing the slug from the url, decoding that to a tutorial index, and using the corresponding tutorial

  const tutorial = useTutorial(scenes);

  return (
    <div className="relative w-full h-full">
      {/*<TutorialGameBoard
        scene={tutorial.scene}
        onAdvance={tutorial.next}
      />*/}
      <TutorialGameProvider scenes={scenes}>
        <Board />
      </TutorialGameProvider>

      <TrainerOverlay
        scene={tutorial.scene}
        text={tutorial.typedText}
        isTyping={tutorial.isTyping}
        onNext={tutorial.next}
      />
    </div>
  );
};

export default TutorialPage;