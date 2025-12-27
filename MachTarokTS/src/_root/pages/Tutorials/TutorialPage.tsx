import { useTutorial } from "@/hooks/useTutorial";
import { Scene } from "@/types";
import TrainerOverlay from "./TrainerOverlay";
import Board from "../board/Board";
import { TutorialGameProvider } from "@/context/GameContext";
import { useParams } from "react-router-dom";
import { tutorials, tutorialsMeta } from "./tutorials";

const TutorialPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const tutorialMeta = tutorialsMeta.find(a => a.slug === slug);
    const tutorial = tutorials[tutorialMeta.index];

    if (!tutorial) return <div className="text-center py-20">Article not found</div>;

    const scenes = tutorial.scenes;

    // TODO: use tutorial.startingConfiguration

    const activeTutorial = useTutorial(scenes);

    return (
        <div className="relative w-full h-full">
        <TutorialGameProvider scenes={scenes}>
            <Board />
        </TutorialGameProvider>

        <TrainerOverlay
            scene={activeTutorial.scene}
            text={activeTutorial.typedText}
            isTyping={activeTutorial.isTyping}
            onNext={activeTutorial.next}
        />
        </div>
    );
};

export default TutorialPage;