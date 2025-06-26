import { useState } from 'react';

interface SettingsScrollerProps {
    list: string[];
    initialValue?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

const SettingsScroller: React.FC<SettingsScrollerProps> = ({
    list,
    initialValue,
    onChange,
    disabled
}) => {
    const initialIndex = initialValue ? list.indexOf(initialValue) : 0;
    const [currentItem, setCurrentItem] = useState(initialIndex >= 0 ? initialIndex : 0);

    const right = () => {
        if (disabled) return;
        const newIndex = (currentItem + 1) % list.length;
        setCurrentItem(newIndex);
        if (onChange) onChange(list[newIndex]);
    };

    const left = () => {
        if (disabled) return;
        const newIndex = (currentItem - 1 < 0) ? list.length - 1 : currentItem - 1;
        setCurrentItem(newIndex);
        if (onChange) onChange(list[newIndex]);
    };

    return (
        <div
            className={`flex flex-row border border-gray-200 w-full items-center justify-between bg-white rounded-md h-10 overflow-hidden transition-opacity ${disabled ? "opacity-50 cursor-not-allowed " : ""
                }`}
        >
            <div
                onClick={left}
                className={`cursor-pointer h-full flex items-center justify-center px-3 select-none hover:bg-gray-100 text-gray-500 ${disabled ? "cursor-not-allowed" : ""}`}
            >
                {"<"}
            </div>
            <div className={`font-medium select-none text-navy ${disabled ? "cursor-not-allowed" : ""}`}>{list[currentItem]}</div>
            <div
                onClick={right}
                className={`cursor-pointer h-full flex items-center justify-center px-3 select-none hover:bg-gray-100 text-gray-500 ${disabled ? "cursor-not-allowed" : ""}`}
            >
                {">"}
            </div>
        </div>
    );
};


export default SettingsScroller;