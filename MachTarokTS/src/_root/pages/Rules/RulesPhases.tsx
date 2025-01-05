import React from 'react';
import RulesNav from '@/components/shared/RulesNav';

interface RulesPhasesProps {
  steps: string[];
}

const RulesPhases: React.FC<RulesPhasesProps> = ({ steps }) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full p-4">
        {steps.map((value, key) => {
            return (
                <div key={key}>
                    {value}    
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default RulesPhases;
