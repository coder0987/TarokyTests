import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

const FlagsCreator = ({ initialFlags = [] }) => {
    const [flags, setFlags] = useState(initialFlags.map(toTitleCase));
    const [newFlag, setNewFlag] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    function toTitleCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const handleAddFlag = () => {
        const trimmedFlag = newFlag.trim();
        if (trimmedFlag) {
            const titleCaseFlag = toTitleCase(trimmedFlag);
            const isDuplicate = flags.some(flag =>
                flag.toLowerCase() === titleCaseFlag.toLowerCase()
            );

            if (!isDuplicate) {
                setFlags([...flags, titleCaseFlag]);
                setNewFlag('');
                setIsAdding(false);
            }
        }
    };

    const handleRemoveFlag = (index) => {
        setFlags(flags.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddFlag();
        } else if (e.key === 'Escape') {
            setIsAdding(false);
            setNewFlag('');
        }
    };

    return (
        <div className="p-4">
            <div className="space-y-2">
                {flags.length === 0 && !isAdding && (
                    <div className="text-gray-400">[empty]</div>
                )}

                {flags.map((flag, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-gray-50 rounded"
                    >
                        <span>{flag}</span>
                        <button
                            onClick={() => handleRemoveFlag(index)}
                            className="text-red-500 hover:text-red-600 text-lg ml-4"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {isAdding ? (
                    <div className="flex flex-row gap-1">
                        <div className="flex gap-1">
                            <Input
                                type="text"
                                value={newFlag}
                                onChange={(e) => setNewFlag(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="New flag name"
                                className="border border-gray-300 rounded px-2 py-2 flex-grow max-w-[125px]"
                                autoFocus
                            />
                        </div>
                        <div className="flex flex-row gap-1">
                            <button
                                onClick={handleAddFlag}
                                className="bg-blue-500 px-2 py-2 rounded hover:bg-blue-600"
                            >
                                ✓
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewFlag('');
                                }}
                                className="text-gray-500 hover:text-gray-600 px-2 py-2"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-blue-500 hover:text-blue-600 text-lg"
                    >
                        +
                    </button>
                )}
            </div>
        </div>
    );
};

export default FlagsCreator;