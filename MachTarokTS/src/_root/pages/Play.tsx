import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const Play = () => {
    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-20 mb-40 w-4/5 xl:w-3/4 flex flex-col items-center">
                <img
                    src="/assets/logo/logo-full-navy.png"
                    className='mb-[200px]'
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
                    <div className="flex flex-row w-full">
                        <Input
                            type="text"
                            placeholder='Room Code'
                            className='text-navy bg-white mr-1'
                            autoComplete='off'
                            onChange={(e) => {
                                const value = e.target.value;
                                // do something with input
                            }}
                        />
                        <Button className='button-red'>Join</Button>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Play