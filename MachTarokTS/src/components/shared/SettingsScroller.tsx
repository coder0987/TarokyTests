import { useState } from 'react';

interface SettingsMenuProps {
  list: string[];
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ list }) => {
    const [currentItem, setCurrentItem] = useState(0);

    const right = () => {
        setCurrentItem((currentItem + 1) % list.length);
    }
     const left = () => {
        setCurrentItem((currentItem - 1 < 0) ? list.length - 1 : currentItem - 1);
    }

    return (
        <div className="flex flex-row border w-full items-center justify-between bg-white">
            <span onClick={left} className="cursor-pointer pl-3 select-none">&lt;</span>
            <span>{list[currentItem]}</span>
            <span onClick={right} className="cursor-pointer pr-3 select-none">&gt;</span>
        </div>
    );
}

export default SettingsMenu;
