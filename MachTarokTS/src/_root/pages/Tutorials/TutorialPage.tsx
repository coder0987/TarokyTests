import { useTutorial } from "@/hooks/useTutorial";
import { Scene } from "@/types";
import TrainerOverlay from "./TrainerOverlay";

const TutorialPage = ({ scenes }: { scenes: Scene[] }) => {
  const tutorial = useTutorial(scenes);

  return (
    <div className="relative w-full h-full">
      {/*<TutorialGameBoard
        scene={tutorial.scene}
        onAdvance={tutorial.next}
      />*/}

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