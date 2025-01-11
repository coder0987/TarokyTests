import React from 'react'

import { cn } from "@/lib/utils"

// Generic type T with constraint that it must be a valid value from the options array
interface AOESelectorProps<T> {
    currentSelected: T;
    options: T[];
    onSelectionChange: (newValue: T) => void;
    startSelected?: T;
    className?: string;
}

const AOESelector = <T,>({
    currentSelected,
    options,
    onSelectionChange,
    startSelected,
    className = ''
}: AOESelectorProps<T>) => {
    // Handle initialization with startSelected if provided
    React.useEffect(() => {
        if (startSelected && startSelected !== currentSelected) {
            onSelectionChange(startSelected);
        }
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default browser behavior

        const currentIndex = options.indexOf(currentSelected);
        let nextIndex: number;

        // Right click
        if (e.button === 2) {
            nextIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
        }
        // Left click
        else {
            nextIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
        }

        onSelectionChange(options[nextIndex]);
    };

    return (
        <button
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
                className
            )}
            onClick={handleClick}
            onContextMenu={handleClick} // Handle right click
            onKeyDown={(e) => {
                // Add keyboard support (right/left arrows)
                if (e.key === 'ArrowRight') {
                    handleClick({ button: 0, preventDefault: () => { } } as React.MouseEvent);
                } else if (e.key === 'ArrowLeft') {
                    handleClick({ button: 2, preventDefault: () => { } } as React.MouseEvent);
                }
            }}
        >
            {String(currentSelected)}
        </button>
    )
}

export default AOESelector