import React, { useState } from 'react';

const CountersCreator = ({ initialCounters = [] }) => {
    const [counters, setCounters] = useState(initialCounters);
    const [newCounter, setNewCounter] = useState('');

    const handleAddCounter = () => {
        if (newCounter.trim()) {
            setCounters([...counters, newCounter.trim()]);
            setNewCounter('');
        }
    };

    const handleRemoveCounter = (index) => {
        setCounters(counters.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddCounter();
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={newCounter}
                    onChange={(e) => setNewCounter(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter new counter name"
                    className="border border-gray-300 rounded px-3 py-2 flex-grow"
                />
                <button
                    onClick={handleAddCounter}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Counter
                </button>
            </div>

            <div className="space-y-2">
                {counters.map((counter, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                        <span>{counter}</span>
                        <button
                            onClick={() => handleRemoveCounter(index)}
                            className="text-red-500 hover:text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountersCreator;