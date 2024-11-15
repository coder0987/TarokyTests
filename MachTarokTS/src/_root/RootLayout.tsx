import { Outlet } from 'react-router-dom';
import { Bottombar, Topbar } from '@/components/shared';
import MobileTopbar from '@/components/shared/MobileTopbar';

const RootLayout = () => {
    return (
        <div className="w-full flex flex-col overflow-hidden">
            <Topbar />
            <MobileTopbar />
            <section className="flex flex-1 h-full overflow-auto">
                <Outlet />
            </section>
            <Bottombar />

        </div>
    );
}

export default RootLayout