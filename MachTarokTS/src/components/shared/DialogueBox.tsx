type DialogueBoxProps = {
  text: string;
  showNext: boolean;
  onNext: () => void;
};

const DialogueBox = ({ text, showNext, onNext }: DialogueBoxProps) => {
  return (
    <div className="speech-box w-full bg-white/90 rounded-lg p-4 shadow-md">
      <p className="speech-text text-base leading-relaxed whitespace-pre-wrap">
        {text}
      </p>

      {showNext && (
        <button
          onClick={onNext}
          className="mt-3 px-4 py-2 rounded bg-navy text-white hover:bg-navy/90 transition"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default DialogueBox;
