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
import { Room, SimplifiedRoom } from '@/types';
import { useGameSlice } from '@/hooks/useGameSlice';
import RoomBox from '@/components/shared/RoomBox';
import { emitJoinAudience, emitJoinRoom, emitNewRoom } from '@/engine/SocketEmitter';

const Browse = () => {
    const navigate = useNavigate();

    const roomList = useGameSlice(useCallback(game => game.availableRooms, [])) ?? {};
    const newRoom: SimplifiedRoom = { count: 0, usernames: [], audienceCount: 0 };

    const clickRoom = (roomId: string) => {
        emitJoinRoom(roomId);
    }

    const clickAudience = (roomId: string) => {
        emitJoinAudience(roomId);
    }

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
                <div className="text-3xl">Taroky Room Browser</div>
                <Separator className='my-4 bg-gray seperator-fix' />
                {Object.keys(roomList).map((key: string) => {
                    const room = roomList[key];
                    return (
                        <RoomBox key={key} simplifiedRoom={room} roomId={key} onClick={() => clickRoom(key)} onJoinAudience={() => clickAudience(key)} />
                    );
                })}
                {Object.keys(roomList).length == 0 &&
                    <div>
                        <p>It seems no one is playing Taroky for now</p>
                        
                    </div>
                }

                <RoomBox simplifiedRoom={newRoom} roomId={'New Room'} onJoinAudience={() => {}} onClick={emitNewRoom} />
            </div>
        </div>
    )
}

export default Browse