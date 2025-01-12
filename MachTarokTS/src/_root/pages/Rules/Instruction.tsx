interface InstructionProps {
    action;
    target;
    items;
    custom : any;
  }

const Instruction: React.FC<InstructionProps> = ({ action, target, items, custom }) => {
    return (
        <div className="py-4">
            <p>Action: {action}</p>
            <p>Target: {target}</p>
            <p>Items: {items}</p>
            <p>Custom: coming soon</p>
        </div>
    )
}

export default Instruction;