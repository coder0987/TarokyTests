import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

const PilesCreator = ({ initialPiles = [] }) => {
    // Convert initial piles to title case
    const [piles, setPiles] = useState(initialPiles.map(toTitleCase));
    const [newPile, setNewPile] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Helper function to convert string to title case
    function toTitleCase(str) {
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const handleAddPile = () => {
        const trimmedPile = newPile.trim();
        if (trimmedPile) {
            const titleCasePile = toTitleCase(trimmedPile);
            // Check for case-insensitive duplicates
            const isDuplicate = piles.some(pile =>
                pile.toLowerCase() === titleCasePile.toLowerCase()
            );

            if (!isDuplicate) {
                setPiles([...piles, titleCasePile]);
                setNewPile('');
                setIsAdding(false);
            }
        }
    };

    const handleRemovePile = (index) => {
        setPiles(piles.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddPile();
        } else if (e.key === 'Escape') {
            setIsAdding(false);
            setNewPile('');
        }
    };

    return (
        <div className="p-4">
            <div className="space-y-2">
                {piles.length === 0 && !isAdding && (
                    <div className="text-gray-400">[empty]</div>
                )}

                {piles.map((pile, index) => (
                    <div
                        key={index}
                        className="flex items-center bg-gray-50 rounded"
                    >
                        <span>{pile}</span>
                        <button
                            onClick={() => handleRemovePile(index)}
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
                                value={newPile}
                                onChange={(e) => setNewPile(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="New pile name"
                                className="border border-gray-300 rounded px-2 py-2 flex-grow max-w-[125px]"
                                autoFocus
                            />
                        </div>
                        <div className="flex flex-row gap-1">
                            <button
                                onClick={handleAddPile}
                                className="bg-blue-500 px-2 py-2 rounded hover:bg-blue-600"
                            >
                                ✓
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setNewPile('');
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

export default PilesCreator;