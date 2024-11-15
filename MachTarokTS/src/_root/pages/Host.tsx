import OpponentSelect from '@/components/shared/OpponentSelect';
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { useUserContext } from '@/context/AuthContext';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Host = () => {

    const navigate = useNavigate();

    const { account } = useUserContext();

    const [gameType, setGameType] = useState("Taroky");
    const [roomNumeral, setRoomNumeral] = useState<string>("II");
    const [joinCode, setJoinCode] = useState<string>("GKPRD");

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full flex flex-row items-start'>
                <Button
                    className='back-button m-2'
                    onClick={() => {
                        // any other handling when host leaves game
                        navigate("/play");
                    }}>➤</Button>
            </div>
            <div className="mt-10 mb-40 w-4/5 xl:w-3/4 flex flex-col items-center">
                <div className="text-3xl">{gameType}</div>
                <Separator className='my-4 bg-gray' />
                <div className="text-xl flex flex-row justify-between w-full"><span>Room {roomNumeral}</span> <span>Code: {joinCode}</span></div>
                <div className='flex flex-col justify-start gap-1 w-full mt-4'>
                    <div>{account.user}</div>
                    <OpponentSelect />
                    <OpponentSelect />
                    <OpponentSelect />
                </div>
            </div>
        </div>
    )
}

export default Host