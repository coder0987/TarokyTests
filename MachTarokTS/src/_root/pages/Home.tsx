import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {

    const navigate = useNavigate();
    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-20 mb-40 w-4/5 xl:w-3/4">
                <img
                    src="/assets/logo/logo-full-navy.png"
                    className='mb-60'
                />
                <div className="flex items-center justify-center">
                    <Button
                        className="big-play-button"
                        onClick={() => {
                            navigate("/play");
                        }
                        }>Play!</Button>
                </div>

            </div>
        </div>
    )
}

export default Home