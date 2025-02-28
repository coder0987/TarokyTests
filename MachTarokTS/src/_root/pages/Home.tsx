import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white w-full">
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center py-16 md:py-24">
                    <img
                        src="/assets/logo/logo-full-navy.png"
                        alt="Mach Tarok Logo"
                        className="mb-8 w-64 md:w-80"
                    />

                    <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-4">
                        Play Tarok Online
                    </h1>

                    <p className="text-lg text-gray-700 text-center max-w-lg mb-10">
                        Experience the classic European trick-taking card game with friends or against AI opponents
                    </p>

                    <Button
                        className="bg-red hover:bg-blue-800 text-white text-xl font-semibold py-3 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105"
                        onClick={() => navigate("/play")}
                    >
                        Play Now
                    </Button>
                </div>

                {/* Card Display */}
                <div className="relative h-64 md:h-80 my-8 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-black/20 z-10"></div>
                    <img
                        src="/assets/tarok-cards.jpg"
                        alt="Tarok Cards"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-blue-900/90 via-blue-900/60 to-transparent flex items-end">
                        <div className="p-6 md:p-8 text-white">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">Rich in Tradition</h2>
                            <p className="text-lg drop-shadow">Discover the history and strategy behind one of Europe's most beloved card games.</p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-4 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12l7.5 4 7.5-4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-center mb-2">Learn to Play</h3>
                        <p className="text-gray-600 text-center">New to Tarok? Check out our comprehensive tutorials and rules.</p>
                        <div className="text-center mt-4">
                            <Button
                                variant="outline"
                                className="text-blue-700 border-blue-700 hover:bg-blue-50"
                                onClick={() => navigate("/learn")}
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-4 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-center mb-2">Daily Challenges</h3>
                        <p className="text-gray-600 text-center">Test your skills with our daily puzzles and special game modes.</p>
                        <div className="text-center mt-4">
                            <Button
                                variant="outline"
                                className="text-blue-700 border-blue-700 hover:bg-blue-50"
                                onClick={() => navigate("/daily")}
                            >
                                Try Today's Challenge
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-4 mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-center mb-2">Ranked Matches</h3>
                        <p className="text-gray-600 text-center">Compete against players from around the world and climb the leaderboard.</p>
                        <div className="text-center mt-4">
                            <Button
                                variant="outline"
                                className="text-blue-700 border-blue-700 hover:bg-blue-50"
                                onClick={() => navigate("/ranked")}
                            >
                                Compete Now
                            </Button>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                {/* <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h2 className="text-3xl font-bold text-blue-900 mb-6">Ready to Play?</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg"
                            onClick={() => navigate("/host")}
                        >
                            Host a Game
                        </Button>
                        <Button
                            variant="outline"
                            className="border-blue-700 text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg"
                            onClick={() => navigate("/browse")}
                        >
                            Join a Game
                        </Button>
                    </div>
                </div> */}
            </div>

            {/* Footer */}
            <footer className="bg-blue-900 text-tan py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <img
                                src="/assets/logo/logo-full-navy.png"
                                alt="Mach Tarok Logo"
                                className="h-10 invert"
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                variant="link"
                                className="text-tan hover:text-blue"
                                onClick={() => navigate("/rules")}
                            >
                                Rules
                            </Button>
                            <Button
                                variant="link"
                                className="text-tan hover:text-blue"
                                onClick={() => navigate("/updates")}
                            >
                                Updates
                            </Button>
                            <Button
                                variant="link"
                                className="text-tan hover:text-blue"
                                onClick={() => navigate("/donate")}
                            >
                                Support Us
                            </Button>
                        </div>
                    </div>
                    <div className="text-center text-blue-200 mt-6 text-sm">
                        © {new Date().getFullYear()} Mach Tarok. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;