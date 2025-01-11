import { BasicRules } from "@/types";

const DECK_TYPES = {
  standard: 0,
  tarok: 1
}
interface GeneralProps {
  basic: BasicRules;
}

const General: React.FC<GeneralProps> = ({ basic }) => {
  

  return (
    <>General</>
    //TODO: add the option sliders that Ben programmed. Add callbacks to update basic on the socketio server side
  );
};

export default General;
