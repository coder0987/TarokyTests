import { Button } from '@/components/ui/button';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Ranked = () => {
    const navigate = useNavigate();

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full flex flex-row items-start'>
                <Button
                    className='back-button m-2'
                    onClick={() => {
                        // any other handling when leaving ranked
                        navigate("/play");
                    }}>➤</Button>
            </div>
            <div>RANKED</div>
        </div>
    )
}

export default Ranked