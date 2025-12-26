import DialogueBox from "@/components/shared/DialogueBox";
import { Scene } from "@/types";

type TrainerOverlayProps = {
    scene: Scene,
    text: string;
    isTyping: boolean;
    onNext: () => void;
};

const TrainerOverlay = ({ scene, text, isTyping, onNext }: TrainerOverlayProps) => {
  if (!scene?.trainer) return null;

  return (
    <div className="fixed bottom-0 w-full flex items-end">
      {scene.trainer && <img
        src="/assets/mach-deck-web/skyz.png"
        className={`hidden md:block ${scene.flip ? "scale-x-[-1]" : ""}`}
      />}

      <DialogueBox showNext={!isTyping} text={text} onNext={onNext} />
    </div>
  );
};

export default TrainerOverlay;