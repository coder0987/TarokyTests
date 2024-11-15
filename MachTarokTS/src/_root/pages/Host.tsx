import InviteDialog from '@/components/shared/InviteDialog';
import OpponentSelect from '@/components/shared/OpponentSelect';
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Host = () => {

    const navigate = useNavigate();

    const { account } = useUserContext();
    const { showToast } = useToast();

    const [gameType, setGameType] = useState("Taroky");
    const [roomNumeral, setRoomNumeral] = useState<string>("II");
    const [joinCode, setJoinCode] = useState<string>("GKPRD");

    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    const copyRoomCode = async () => {
        try {
            await navigator.clipboard.writeText(joinCode);
            console.log('room code copied to clipboard!');
            showToast('Successfully copied room code', 'success');
        } catch (err) {
            console.error('Failed to copy ${subject}: ', err);
            showToast('Failed to copy ${subject}', 'error');
        }
    }

    return (
        <>
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
                    <div className="text-xl flex flex-row justify-between w-full"><span>Room {roomNumeral}</span> <span>Code: <span className='hover:underline hover:cursor-copy' onClick={() => copyRoomCode()}> {joinCode}</span></span></div>
                    <div className="flex flex-row w-full mt-8">
                        <div className='flex flex-col justify-start gap-1 w-1/2'>
                            <div className="w-[150px] border-navy bg-white text-navy rounded-md border px-3 py-2 hover:cursor-not-allowed">{account.user} (you)</div>
                            <OpponentSelect />
                            <OpponentSelect />
                            <OpponentSelect />
                        </div>
                        <div className='flex flex-col justify-start gap-1 w-1/2 items-end'>
                            <Button
                                className="button-white border boder-navy w-[75px]"
                                onClick={() => setIsInviteDialogOpen(true)}>Invite</Button>
                        </div>
                    </div>
                </div>

            </div>
            <InviteDialog isOpen={isInviteDialogOpen} onClose={() => setIsInviteDialogOpen(false)} />
        </>
    )
}

export default Host