import { Button } from "@/components/ui/button";

const BoardButton = ({ title, onClick }: { title: string; onClick: () => void }) => {
    
    return (
        <Button onClick={onClick}>
            {title}
        </Button>
    );
}

export default BoardButton;