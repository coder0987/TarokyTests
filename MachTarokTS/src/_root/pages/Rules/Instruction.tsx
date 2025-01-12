import { ITEMS_REVERSE, ACTIONS_REVERSE, TARGETS_REVERSE } from "@/constants";

interface InstructionProps {
    action : number;
    targets : number[];
    items : number;
    custom : any;
  }

const Instruction: React.FC<InstructionProps> = ({ action, targets, items, custom }) => {
    return (
        <div className="py-4">
            <p>Action: {ACTIONS_REVERSE[action] || action}</p>
            <p>Target: {targets.map((target, index) => {
                return (
                    <span key={index}>{TARGETS_REVERSE[target] || target}</span>
                )
            })}</p>
            <p>Items: {Array.isArray(items) ? items.map((item, index) => {return (
                <span key={index}>{ITEMS_REVERSE[item] || item}</span>
            )}) : (ITEMS_REVERSE[items] || items)}</p>
            <p>Custom: {
                (custom ? 'Coming soon' : 'None')     
            }</p>
        </div>
    )
}

export default Instruction;