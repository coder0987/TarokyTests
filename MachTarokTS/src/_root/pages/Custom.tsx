import { Button } from '@/components/ui/button';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Custom = () => {

    const navigate = useNavigate();

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full flex flex-row items-start'>
                <Button
                    className='back-button m-2'
                    onClick={() => {
                        // any other handling when leaving custom
                        navigate("/play");
                    }}>➤</Button>
            </div>
            <div>CUSTOM</div>
        </div>
    )
}

export default Custom