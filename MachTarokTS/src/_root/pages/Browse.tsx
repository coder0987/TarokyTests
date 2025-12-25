import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Room } from '@/types';
import { useGameSlice } from '@/hooks/useGameSlice';

const Browse = () => {
    const navigate = useNavigate();

    const [gameType, setGameType] = useState("Taroky");

    const roomList = useGameSlice(useCallback(game => game.availableRooms, [])) ?? [];

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <div className='w-full flex flex-row items-start'>
                <Button
                    className='back-button m-2'
                    onClick={() => {
                        // any other handling when leaving custom
                        navigate("/play");
                    }}>➤</Button>
            </div>
            <div className="mt-10 mb-40 w-4/5 xl:w-3/4 flex flex-col items-center">
                <div className="text-3xl">{gameType}</div>
                <Separator className='my-4 bg-gray seperator-fix' />
                <Table className='w-full'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] text-left">Room</TableHead>
                            <TableHead className="text-center">Players</TableHead>
                            <TableHead className='text-right'>Join</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[{ numeral: "I", numPlayers: 1, numComputers: 2, availble: 1 }, { numeral: "II", numPlayers: 2, numComputers: 0, availble: 2 }].map((room: Room) => {
                            return (
                                <TableRow key={room.numeral}>
                                    <TableCell className='py-2'>
                                        <div className="text-left">
                                            {room.numeral}
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-2'>
                                        <div className={"text-center"}>
                                            {`${4 - room.availble} / 4`}
                                        </div>
                                    </TableCell>
                                    <TableCell className='px-0 py-2'>
                                        <div className="flex flex-row items-end justify-end">
                                            <Button className='button-navy py-1 text-xs h-8'>Join</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Browse