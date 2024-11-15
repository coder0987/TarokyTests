import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useUserContext } from '@/context/AuthContext';
import { useRef } from 'react';

const Play = () => {

    const { isAuthenticated } = useUserContext();

    const roomCodeInput = useRef(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filteredValue = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();
        e.target.value = filteredValue;  // Update the input field's value directly
    };

    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-20 mb-40 w-4/5 xl:w-3/4 flex flex-col items-center">
                <img
                    src="/assets/logo/logo-full-navy.png"
                    className='mb-[200px] w-full max-w-[600px] h-aut'
                />
                <div className="flex flex-col items-center justify-center w-[320px]">
                    <Card className='card min-w-[320px] mb-3 hover:cursor-pointer'>
                        <CardContent className="pt-2 text-center text-3xl">Ranked</CardContent>
                    </Card>
                    <div className="flex flex-row gap-3 items-center justify-center w-full mb-3">
                        <Card className='card card flex-1 hover:cursor-pointer'>
                            <CardContent className="pt-2 text-center text-3xl">Host</CardContent>
                        </Card>
                        <Card className='card card flex-1 hover:cursor-pointer'>
                            <CardContent className="pt-2 text-center text-3xl">Custom</CardContent>
                        </Card>
                    </div>
                    <div className="flex flex-row gap-3 items-center justify-center w-full mb-3">
                        <Card className={`card card hover:cursor-pointer ${isAuthenticated ? "flex-1" : "min-w-[320px]"}`}>
                            <CardContent className="pt-2 text-center text-3xl">Browse</CardContent>
                        </Card>
                        {isAuthenticated &&
                            <Card className='card card flex-1 hover:cursor-pointer'>
                                <CardContent className="pt-2 text-center text-3xl">Daily</CardContent>
                            </Card>}
                    </div>
                    <div className="flex flex-row w-full">
                        <Input
                            ref={roomCodeInput}
                            type="text"
                            placeholder='Room Code'
                            className='text-navy bg-white mr-1'
                            autoComplete='off'
                            onChange={handleInputChange}
                        />
                        <Button
                            className='button-red'
                            onClick={() => {
                                // join room by code
                            }}>Join</Button>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Play