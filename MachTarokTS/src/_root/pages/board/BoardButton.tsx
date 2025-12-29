import { Button } from "@/components/ui/button";

const BoardButton = ({ title, onClick }: { title: string; onClick: () => void }) => {
    
    const style = "rounded-lg bg-blue-600 px-4 py-2 text-white font-medium transition duration-150 ease-out hover:scale-105 hover:bg-blue-700 active:scale-100";

    return (
        <Button className={style} onClick={onClick}>
            {title}
        </Button>
    );
}

export default BoardButton;