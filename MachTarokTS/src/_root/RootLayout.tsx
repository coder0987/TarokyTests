import { Outlet } from 'react-router-dom';
import { Bottombar, Topbar } from '@/components/shared';

const RootLayout = () => {
    return (
        <div className="w-full flex flex-col overflow-hidden">
            <Topbar />
            <section className="flex flex-1 h-full overflow-auto">
                <Outlet />
            </section>
            <Bottombar />

        </div>
    );
}

export default RootLayout