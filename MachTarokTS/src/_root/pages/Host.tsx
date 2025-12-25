import { Button } from '@/components/ui/button'
import { useUserContext } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { InviteDialog, OpponentSelect, SettingsMenu } from '@/components/shared';
import { useGameSlice } from '@/hooks/useGameSlice';
import { emitGetPlayerList, emitLeaveGame, emitStartGame } from '@/engine/SocketEmitter';
import { GamePlayer } from '@/types';

const Host = () => {
    const navigate = useNavigate();
    const { account } = useUserContext();
    const { showToast } = useToast();

    const gameType = "Taroky";
    const roomNumeral = useGameSlice(useCallback(game => game.gameState?.roomName, [])) ?? "I";
    const joinCode = useGameSlice(useCallback(game => game.gameState?.roomCode, [])) ?? "";
    const players = useGameSlice(useCallback(game => game.gameState?.gamePlayers, [])) ?? [];
    const pn = useGameSlice(useCallback(game => game.gameState?.myInfo.playerNumber, [])) ?? 0; // should always be 0 if hosting
    const host = useGameSlice(useCallback(game => game.gameState?.hostNumber, [])) ?? 0;
    const inAudience = useGameSlice(useCallback(game => game.inAudience, [])) ?? false;

    

    const [isHostReady, setIsHostReady] = useState(false);
    const [settingsLocked, setSettingsLocked] = useState(false);
    const [readyText, setReadyText] = useState<"Ready" | "Not Ready">("Not Ready");

    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    useEffect(() => {
        console.log('Rerender');
        emitGetPlayerList();
    }, [isInviteDialogOpen]);

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

    useEffect(() => {
        if (isHostReady) {
            setReadyText("Ready");
            setSettingsLocked(true);
        } else {
            setReadyText("Not Ready");
            setSettingsLocked(false);
        }
    }, [isHostReady]);

    return (
        <div className="bg-gray-100 min-h-screen w-full">
            {/* Header Bar - Full Width */}
            <div className="bg-navy text-white p-4 flex items-center justify-center shadow-md w-full relative">
                <Button
                    className="absolute left-4 bg-transparent hover:bg-navy/80 text-white"
                    onClick={() => emitLeaveGame()}
                >
                    ← Back
                </Button>
                <h1 className="text-xl font-bold">{gameType} - Game Setup</h1>
            </div>

            {/* Main Content - Full Width with Max Width Container */}
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
                {/* Game Info Banner */}
                <div className="bg-white rounded-lg shadow-md p-4 my-6 w-full">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold">Room {roomNumeral}</div>
                        <div className="flex items-center">
                            <span className="mr-2">Join Code:</span>
                            <span
                                className="bg-gray-100 px-3 py-1 rounded font-mono text-navy font-bold cursor-copy hover:bg-gray-200 text-2xl"
                                onClick={copyRoomCode}
                            >
                                {joinCode}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-12">
                    {/* Left Panel - Players */}
                    <div className="lg:col-span-2 w-full">
                        <div className="bg-white rounded-lg shadow-md p-6 w-full">
                            <h2 className="text-lg font-bold mb-4 text-navy border-b pb-2">Players</h2>

                            <div className="space-y-3 mb-6">
                                {/* Player slots */}
                                {players.map(player => {
                                    return <div key={player.seat} className="flex items-center bg-gray-50 p-3 rounded-md border border-gray-200">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${(!inAudience && player.seat == pn) ? "bg-navy text-white" : "bg-gray-300 text-gray-600"}`}>{+player.seat + 1}</div>
                                        <div className="ml-3 flex flex-grow items-center">
                                            {/*<OpponentSelect />*/}
                                            <img src={`https://machtarok.com/assets/profile-pictures/profile-${player.avatar}.png`} alt="avatar" height={50} width={50} className='rounded-full' />
                                            <div className="ml-4 flex-grow">
                                                <div className="font-medium">{player.username}</div>
                                                {player.seat == host && <div className="text-sm text-gray-400">Host</div>}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-400">Waiting...</div>
                                    </div>
                                })}
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-between pt-4 border-t">
                                <Button
                                    className="bg-navy transition-all transform hover:scale-105 text-white"
                                    onClick={() => {setIsInviteDialogOpen(true);}}
                                >
                                    Invite Players
                                </Button>
                                <Button
                                    className="bg-red transition-all transform hover:scale-105 text-white"
                                    disabled={/*!isHostReady*/false}
                                    onClick={emitStartGame}
                                >
                                    Start Game
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Settings */}
                    <div className="lg:col-span-1 w-full">
                        <div className="bg-white rounded-lg shadow-md p-6 w-full">
                            <h2 className="text-lg font-bold mb-4 text-navy border-b pb-2">Game Settings</h2>
                            <div className="space-y-4 w-full">
                                <SettingsMenu locked={inAudience || host !== pn} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite Dialog */}
            <InviteDialog
                isOpen={isInviteDialogOpen}
                onClose={() => setIsInviteDialogOpen(false)}
                roomCode={joinCode}
            />
        </div>
    );
}

export default Host;