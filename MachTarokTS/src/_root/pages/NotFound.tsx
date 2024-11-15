import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center w-full h-full">
            <div className="mt-20 w-4/5 xl:w-3/4 h-full">
                <h1 className="h1-bold ">404 Page Not Found</h1>
                <div className="flex items-center justify-center w-full h-full pb-[300px]">
                    <Card className="card">
                        <CardHeader>
                            <CardTitle className='flex justify-center'>No place like home</CardTitle>
                        </CardHeader>
                        <CardContent className='flex justify-center'>
                            <Button className="button-white" onClick={() => navigate("/")}>Go Back Home</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default NotFound