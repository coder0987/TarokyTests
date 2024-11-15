import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/context/ToastContext';

interface InviteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    roomCode: string;
}

const InviteDialog: React.FC<InviteDialogProps> = ({ isOpen, onClose, roomCode }) => {

    const { showToast } = useToast();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='invite-card flex flex-col gap-4'>
                <DialogHeader>
                    <DialogTitle>Invite</DialogTitle>
                </DialogHeader>
                <DialogDescription>Click the link below to copy it and send it to your friends:</DialogDescription>
                <span className='copy-text text-sm font-bold'>{`https://machtarok.com/machtarok.com/?join=${roomCode}`}</span>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default InviteDialog