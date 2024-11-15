import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface InviteDialogProps {
    isOpen: boolean;
    onClose: () => void
}

const InviteDialog: React.FC<InviteDialogProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='invite-card'>
                <DialogHeader>
                    <DialogTitle>Invite</DialogTitle>
                </DialogHeader>
                <DialogDescription>Click the link below to copy it and send it to your friends:</DialogDescription>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default InviteDialog