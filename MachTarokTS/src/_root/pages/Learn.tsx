import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const Learn = () => {
    return (
        <div className='flex justify-center w-full h-full'>
            <div className="mt-20 mb-40 w-4/5 xl:w-3/4">
                <h2 className="h2-bold mb-10">How to Play Taroky</h2>
                <div className='flex flex-col gap-2 items-center justify-center'>
                    <Card className='card w-[360px] hover:cursor-pointer'>
                        <CardHeader>
                            <CardTitle>New to Taroky?</CardTitle>
                            <CardDescription>Start here</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className='card w-[360px] hover:cursor-pointer'>
                        <CardHeader>
                            <CardTitle>New to MachTarok?</CardTitle>
                            <CardDescription>Learn the website</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className='card w-[360px] hover:cursor-pointer'>
                        <CardHeader>
                            <CardTitle>Want to Advance?</CardTitle>
                            <CardDescription>See the full rules</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Learn