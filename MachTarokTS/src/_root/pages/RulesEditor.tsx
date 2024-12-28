import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import RulesNav from '@/components/shared/RulesNav';
import GamePhases from './GamePhases';
import { useState } from 'react';

const Rules = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('general'); // Default active tab

    const handleTabClick = (tabId : string) => {
        setActiveTab(tabId);
    };

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full flex flex-row items-start'>
                <RulesNav activeTab={activeTab} onTabClick={handleTabClick} />
            </div>
            {activeTab === 'general' && <div>Rules Editor Content Here</div>}
            {activeTab === 'order' && <GamePhases />}
            {activeTab === 'pre-bid' && <div>Pre-Bid Content Here</div>}
            {activeTab === 'bid' && <div>Bid Content Here</div>}
            {activeTab === 'play' && <div>Play Content Here</div>}
            {activeTab === 'end' && <div>End Content Here</div>}
        </div>
    )
}

export default Rules