import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Leaderboard from './Leaderboard';
import { emitJoinRoomByCode, emitNewRoom } from '@/engine/SocketEmitter';

const Play = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useUserContext();
    const roomCodeInput = useRef(null);
    const [roomCode, setRoomCode] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filteredValue = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();
        e.target.value = filteredValue;
        setRoomCode(filteredValue);
    };

    const handleJoinClicked = () => {
        // is valid room code?
        // if so join room
        emitJoinRoomByCode(roomCode);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white w-full">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center py-8 md:py-12">
                    <img
                        src="/assets/logo/logo-full-navy.png"
                        alt="Mach Tarok Logo"
                        width={256}
                        height={70}
                        className="mb-8 w-64 md:w-96 max-w-full h-auto"
                    />

                    <div className="w-full max-w-md">
                        {/* Game Mode Cards */}
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <Card
                                className="bg-navy hover:bg-blue-800 text-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                                onClick={() => navigate("/ranked")}
                            >
                                <CardContent className="flex justify-center items-center py-6">
                                    <span className="text-2xl font-semibold">Ranked</span>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 gap-4">
                                <Card
                                    className="bg-navy hover:bg-blue-800 text-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                                    onClick={() => emitNewRoom()}
                                >
                                    <CardContent className="flex justify-center items-center py-5">
                                        <span className="text-xl font-semibold">Host</span>
                                    </CardContent>
                                </Card>

                                <Card
                                    className="bg-navy hover:bg-blue-800 text-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                                    onClick={() => navigate("/custom")}
                                >
                                    <CardContent className="flex justify-center items-center py-5">
                                        <span className="text-xl font-semibold">Custom</span>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className={`grid ${isAuthenticated ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                                <Card
                                    className="bg-navy hover:bg-blue-800 text-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                                    onClick={() => navigate("/browse")}
                                >
                                    <CardContent className="flex justify-center items-center py-5">
                                        <span className="text-xl font-semibold">Browse</span>
                                    </CardContent>
                                </Card>

                                {isAuthenticated && (
                                    <Card
                                        className="bg-navy hover:bg-blue-800 text-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                                        onClick={() => navigate("/daily")}
                                    >
                                        <CardContent className="flex justify-center items-center py-5">
                                            <span className="text-xl font-semibold">Daily</span>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            <Card
                                className="bg-navy hover:bg-blue-800 text-white transition-all transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                                onClick={() => navigate("/tutorial")}
                            >
                                <CardContent className="flex justify-center items-center py-6">
                                    <span className="text-2xl font-semibold">Tutorial</span>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Room Code Input */}
                        <div className="flex flex-row gap-2 mt-6">
                            <Input
                                ref={roomCodeInput}
                                type="text"
                                placeholder="Room Code"
                                className="flex-1 text-navy bg-white border border-gray-200 shadow-sm h-12"
                                autoComplete="off"
                                onChange={handleInputChange}
                            />
                            <Button
                                className="bg-red hover:bg-red-600 text-white font-semibold px-6 shadow-sm h-12 transition-all transform hover:scale-105"
                                onClick={handleJoinClicked}
                            >
                                Join
                            </Button>
                        </div>
                        <Leaderboard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Play;