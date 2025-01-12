import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

const CountersCreator = ({ initialCounters = [] }) => {
    const [counters, setCounters] = useState(initialCounters.map(toTitleCase));
    const [newCounter, setNewCounter] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    function toTitleCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const handleAddCounter = () => {
        const trimmedCounter = newCounter.trim();
        if (trimmedCounter) {
            const titleCaseCounter = toTitleCase(trimmedCounter);
            const isDuplicate = counters.some(counter =>
                counter.toLowerCase() === titleCaseCounter.toLowerCase()
            );

            if (!isDuplicate) {
                setCounters([...counters, titleCaseCounter]);
                setNewCounter('');
                setIsAdding(false);
            }
        }
    };

    const handleRemoveCounter = (index) => {
        setCounters(counters.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddCounter();
        } else if (e.key === 'Escape') {
            setIsAdding(false);
            setNewCounter('');
        }
    };

    return (
        <div className="p-4">
            <div className="space-y-2">
                {counters.length === 0 && !isAdding && (
                    <div className="text-gray-400">[empty]</div>
                )}

                {counters.map((counter, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-gray-50 rounded"
                    >
                        <span>{counter}</span>
                        <button
                            onClick={() => handleRemoveCounter(index)}
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
                                value={newCounter}
                                onChange={(e) => setNewCounter(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="New counter name"
                                className="border border-gray-300 rounded px-2 py-2 flex-grow max-w-[125px]"
                                autoFocus
                            />
                        </div>
                        <div className="flex flex-row gap-1">
                            <button
                                onClick={handleAddCounter}
                                className="bg-blue-500 px-2 py-2 rounded hover:bg-blue-600"
                            >
                                ✓
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewCounter('');
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

export default CountersCreator;