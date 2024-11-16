import { Button } from '@/components/ui/button'
import { AspectRatio } from "@/components/ui/aspect-ratio"
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate();
    return (
        <div className='flex flex-col justify-start w-full h-full'>
            <AspectRatio ratio={400 / 266} className='w-full p-1'>
                <img src="/assets/tarok-cards.jpg" className="m-0 w-full" ></img>
            </AspectRatio>
            <div className="flex flex-col justify-start mt-20 mb-40 w-full md:w-4/5 xl:w-3/4">
                <img
                    src="/assets/logo/logo-full-navy.png"
                    className='mb-20'
                />
                <div className="flex items-center justify-center mb-20">
                    <Button
                        className="big-play-button"
                        onClick={() => {
                            navigate("/play");
                        }
                        }>Play!</Button>
                </div>
                <h1 className="h1-bold w-full text-center">Welcome to Mach Tarok</h1>
                <h2 className="h2-bold w-full text-center">play Tarok online</h2>

            </div>
        </div>
    )
}

export default Home