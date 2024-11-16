import { DifficultySelect } from '@/components/shared';
import InviteDialog from '@/components/shared/InviteDialog';
import OpponentSelect from '@/components/shared/OpponentSelect';
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Difficulty } from '@/types';
import { Select } from '@radix-ui/react-select';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


const timeoutMin = 15;
const timeoutDefault = 30;
const timeoutMax = 90;

const Host = () => {

    const navigate = useNavigate();

    const { account } = useUserContext();
    const { showToast } = useToast();

    const [gameType, setGameType] = useState("Taroky");
    const [roomNumeral, setRoomNumeral] = useState<string>("II");
    const [joinCode, setJoinCode] = useState<string>("GKPRD");

    const [roomVisibility, setRoomVisibility] = useState<"Public" | "Private">("Private");
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Normal);
    const [timeout, setTimeout] = useState<number | string>(timeoutDefault);
    const [isAceHigh, setIsAceHigh] = useState(false);

    const [isHostReady, setIsHostReady] = useState(false);
    const [readyText, setReadyText] = useState<"Ready" | "Not Ready">("Not Ready");

    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    const copyRoomCode = async () => {
        try {
            await navigator.clipboard.writeText(joinCode);
            console.log('room code copied to clipboard!');
            showToast('Successfully copied room code', 'success');
        } catch (err) {
            console.error('Failed to copy room code: ', err);
            showToast('Failed to copy room code', 'error');
        }
    }

    const toggleRoomVisibility = () => {
        if (roomVisibility === "Private") setRoomVisibility("Public");
        else setRoomVisibility("Private");
    }

    useEffect(() => {
        if (isHostReady) setReadyText("Ready");
        else setReadyText("Not Ready");
    }, [isHostReady]);

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
                    <Separator className='my-4 bg-gray seperator-fix' />
                    <div className="text-xl flex flex-row justify-between w-full"><span>Room {roomNumeral}</span> <span>Code: <span className='copy-text' onClick={() => copyRoomCode()}> {joinCode}</span></span></div>
                    <div className="flex flex-row w-full mt-8">
                        <div className='flex flex-col justify-start gap-1 w-1/2'>
                            <div className="flex flex-row gap-1 items-center text-left justify-start">P1: <div className="w-[150px] border-navy bg-white text-navy rounded-md border px-3 py-2 hover:cursor-not-allowed">{account.user} (you)</div></div>
                            <div className="flex flex-row gap-1 items-center text-left justify-start">P2: <OpponentSelect /></div>
                            <div className="flex flex-row gap-1 items-center text-left justify-start">P3: <OpponentSelect /></div>
                            <div className="flex flex-row gap-1 items-center text-left justify-start">P4: <OpponentSelect /></div>
                        </div>
                        <div className='flex flex-col justify-start gap-1 w-1/2 items-end'>
                            <Button
                                className="button-white border boder-navy w-[75px]"
                                onClick={() => setIsInviteDialogOpen(true)}>Invite</Button>
                        </div>
                    </div>
                    <Separator className='my-4 bg-gray seperator-fix' />
                    <div className='flex flex-row justify-between w-full'>
                        <div className="flex items-center space-x-2">
                            <Checkbox checked={isHostReady} className='check-box' id="ready" onClick={() => setIsHostReady(!isHostReady)} />
                            <Label htmlFor="ready">{readyText}</Label>
                        </div>
                        <div><Button className="button-red w-[75px]">Start</Button></div>
                    </div>
                    <Separator className='my-4 bg-gray seperator-fix' />
                    <div className='flex flex-row justify-between w-full'>
                        <div className="flex flex-col justify-start gap-4 w-1/2">
                            <div className='flex flex-row justify-between'><span>Visibility: </span> <Button className='button-white w-[125px] py-1 h-7 border border-navy' onClick={() => toggleRoomVisibility()}>{roomVisibility}</Button></div>
                            <div className='flex flex-row justify-between'><span>Difficulty: </span> <DifficultySelect selection={difficulty} setSelection={setDifficulty} /></div>
                            <div className='flex flex-row justify-between'><span>Timeout: </span>
                                <Input
                                    value={timeout}
                                    type="number"
                                    className='w-[125px] h-7'
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setTimeout(newValue === '' || isNaN(Number(newValue)) ? timeoutDefault : parseInt(newValue, 10));
                                    }}
                                    onBlur={() => {
                                        if (timeout.toString() === '' || isNaN(Number(timeout))) {
                                            setTimeout(timeoutDefault);
                                        } else if (Number(timeout) < timeoutMin) {
                                            setTimeout(timeoutMin);
                                        } else if (Number(timeout) > timeoutMax) {
                                            setTimeout(timeoutMax);
                                        }
                                    }}
                                />
                            </div>
                            <div className='flex flex-row justify-between'><span>Ace High: </span><div className="flex w-[125px] items-center justify-center"><Checkbox checked={isAceHigh} className='check-box' id="ace-high" onClick={() => setIsAceHigh(!isAceHigh)} /></div></div>
                        </div>
                        <div className='flex flex-col justify-start gap-1 w-1/2 items-end'>

                        </div>
                    </div>

                </div>

            </div>
            <InviteDialog isOpen={isInviteDialogOpen} onClose={() => setIsInviteDialogOpen(false)} roomCode={joinCode} />
        </>
    )
}

export default Host