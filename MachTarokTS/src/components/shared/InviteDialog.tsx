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
import { useState } from 'react';

interface InviteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    roomCode: string;
}

const InviteDialog: React.FC<InviteDialogProps> = ({ isOpen, onClose, roomCode }) => {

    const { showToast } = useToast();

    const [joinLink, setJoinLink] = useState<string>(`https://machtarok.com/machtarok.com/?join=${roomCode}`);

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
                <Table className='w-full'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] text-left">Username</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className='text-right'>Invite</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[{ user: "user1", status: PlayerStatus.Online }, { user: "user2", status: PlayerStatus.InGame }, { user: "user3", status: PlayerStatus.Idle }].map((player: Player) => {
                            const textColorClass = getStatusColorClass(player.status);
                            return (
                                <TableRow key={player.user}>
                                    <TableCell className='py-2'>
                                        <div className="text-left">
                                            {player.user}
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-2'>
                                        <div className={"text-center " + textColorClass}>
                                            {player.status.toString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className='px-0 py-2'>
                                        <div className="flex flex-row items-end justify-end">
                                            <Button className='button-navy py-1 text-xs h-8'>Invite</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default InviteDialog