import { useToast } from '@/context/ToastContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Player, PlayerStatus } from '@/types';
import { Button } from '../ui/button';
import { getStatusColorClass } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useGameSlice } from '@/hooks/useGameSlice';
import { emitInvite } from '@/engine/SocketEmitter';

interface InviteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    roomCode: string;
}

const InviteDialog: React.FC<InviteDialogProps> = ({ isOpen, onClose, roomCode }) => {

    const { showToast } = useToast();
    const playerList = useGameSlice((gameState) => gameState.connectedPlayers);

    const [joinLink, setJoinLink] = useState<string>(`https://machtarok.com/machtarok.com/?join=${roomCode}`);
    const [inviteList, setInviteList] = useState<{player: Player, invited: boolean}[]>([]);

    useEffect(() => {
        console.log(JSON.stringify(playerList));
        setInviteList(playerList.map((player: Player) => ({player, invited: false})));
    }, [playerList]);

    const handleInvite = (socketId: number) => {
        console.log(`Inviting player with socketId: ${socketId}`);
        showToast('Player invited', 'success');

        setInviteList(inviteList.map((i: {player: Player, invited: boolean}) => {
            if (i.player.socket === socketId) {
                return {...i, invited: true};
            } else {
                return i;
            }
        }));

        emitInvite(socketId);
    };

    const copyJoinLink = async () => {
        try {
            await navigator.clipboard.writeText(joinLink);
            console.log('join link copied to clipboard!');
            showToast('Successfully copied join link', 'success');
        } catch (err) {
            console.error('Failed to copy join link: ', err);
            showToast('Failed to copy join link', 'error');
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='invite-card flex flex-col gap-4'>
                <DialogHeader>
                    <DialogTitle>Invite</DialogTitle>
                </DialogHeader>
                <DialogDescription>Click the link below to copy it and send it to your friends:</DialogDescription>
                <span className='copy-text text-sm font-bold' onClick={() => copyJoinLink()}>{joinLink}</span>
                <h4 className='h4-bold'>Online Players:</h4>
                <Table className='w-full overflow-hidden'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] text-left">Username</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className='mr-2 text-right'>Invite</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className='overflow-visible'>
                        {inviteList.length > 0 ? inviteList.map((i: {player: Player, invited: boolean}) => {
                            const textColorClass = getStatusColorClass(i.player.status);
                            return (
                                <TableRow key={i.player.socket}>
                                    <TableCell className='py-2'>
                                        <div className="text-left">
                                            {i.player.username}
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-2'>
                                        <div className={"text-center " + textColorClass}>
                                            {i.player.status.toString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className='px-2 py-2'>
                                        <div className="flex flex-row items-end justify-end">
                                            {
                                                i.invited ? (
                                                    <Button className='button-navy py-1 text-xs h-8 transition-all transform' disabled>
                                                        Invited
                                                    </Button>
                                                ) : (
                                                    <Button className='button-navy py-1 text-xs h-8 transition-all transform hover:scale-105' onClick={() => handleInvite(i.player.socket)}>
                                                        Invite
                                                    </Button>
                                                )
                                            }
                                            
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={3} className='py-4 text-center'>
                                    <p>No one else is online. Try sending them the invite link!</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default InviteDialog