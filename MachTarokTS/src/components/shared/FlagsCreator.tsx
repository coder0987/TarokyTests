import React, { useState } from 'react';

const FlagsCreator = ({ initialFlags = [] }) => {
    const [flags, setFlags] = useState(initialFlags);
    const [newFlag, setNewFlag] = useState('');

    const handleAddFlag = () => {
        if (newFlag.trim()) {
            setFlags([...flags, newFlag.trim()]);
            setNewFlag('');
        }
    };

    const handleRemoveFlag = (index) => {
        setFlags(flags.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddFlag();
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={newFlag}
                    onChange={(e) => setNewFlag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter new flag name"
                    className="border border-gray-300 rounded px-3 py-2 flex-grow"
                />
                <button
                    onClick={handleAddFlag}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Flag
                </button>
            </div>

            <div className="space-y-2">
                {flags.map((flag, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded"
                    >
                        <span>{flag}</span>
                        <button
                            onClick={() => handleRemoveFlag(index)}
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

export default FlagsCreator;