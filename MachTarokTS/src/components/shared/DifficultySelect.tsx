import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Difficulty } from '@/types';

interface DifficultySelectProps {
    selection: Difficulty;
    setSelection: (value: Difficulty) => void;
}

const DifficultySelect: React.FC<DifficultySelectProps> = ({ selection, setSelection }) => {

    const handleSelectionChange = (value: string) => {
        setSelection(value as Difficulty);
    };

    return (
        <div>
            <Select
                value={selection}
                onValueChange={handleSelectionChange}
            >
                <SelectTrigger className="w-[125px] border-navy bg-white text-navy hover:bg-whiteHover h-7">
                    <SelectValue placeholder="difficulty" />
                </SelectTrigger>
                <SelectContent className='select-content border-navy'>
                    {Object.values(Difficulty)
                        .map((difficulty) => {
                            return (
                                <SelectItem key={difficulty} value={difficulty}>
                                    <div className="flex flex-row items-center">
                                        <p>{difficulty}</p>
                                    </div>
                                </SelectItem>
                            );
                        })
                    }
                </SelectContent>
            </Select>
        </div>
    );
}

export default DifficultySelect;
