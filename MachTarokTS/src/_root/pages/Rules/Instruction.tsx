interface InstructionProps {
    action;
    target;
    custom;
  }

const Instruction: React.FC<InstructionProps> = ({ action, target, custom }) => {
    return (
        <>{action}</>
    )
}

export default Instruction;