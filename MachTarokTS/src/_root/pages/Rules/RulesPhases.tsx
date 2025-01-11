import React, { useEffect, useState } from 'react';
import RulesNav from '@/components/shared/RulesNav';
import Instruction from './Instruction'
import { useSocket } from '@/context/SocketContext';

interface RulesPhasesProps {
  phase : string;
}

const RulesPhases: React.FC<RulesPhasesProps> = ({ phase }) => {
  const [steps, setSteps] = useState<{ order: string[]; steps: Record<string, any[]> } | null>(null);

  const { socket } = useSocket();

  useEffect(() => {
    socket.emit('getPhaseInstructions', phase, (instr: { order: string[]; steps: Record<string, any[]> }) => {
      setSteps(instr);
    });
  }, [socket]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full p-4">
        {steps ? (
          // Iterate over the phase order and display the steps and instructions
          steps.order.map((stepKey, stepIndex) => (
            <div key={stepIndex} className="step-container">
              <h3>Step: {stepKey}</h3>
              {/* Iterate through the instructions for this step */}
              {steps.steps[stepKey].map((instruction, instrIndex) => (
                <Instruction
                  key={instrIndex}
                  action={instruction.action}
                  target={instruction.target}
                  custom={instruction.custom}
                />
              ))}
            </div>
          ))
        ) : (
          <p>Loading steps...</p>
        )}
      </div>
    </div>
  );
};

export default RulesPhases;
