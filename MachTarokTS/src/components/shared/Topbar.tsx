import { topbarLinks } from '@/constants';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Topbar = () => {

    const { pathname } = useLocation();

    return (
        <section className='topbar'>
            <div className='flex gap-3 py-4 px-3'>
                <Link to='/' className='flex gap-1 items-center'>
                    <img
                        src='/assets/logo/logo-full-white.png'
                        alt='logo'
                        width={100}
                        height={36}
                    />
                </Link>
                <ul className='flex flex-row gap-3 ml-2'> {/*flex-row gap-3 ml-2 hidden md:flex*/}
                    {topbarLinks.map((link: { label: string; route: string }) => {
                        const isActive = pathname === link.route;
                        return (
                            <li
                                key={link.label}
                                className={`flex text-center items-center justify-center text-gray text-sm  hover:text-white group ${isActive && "underline"}`}
                            >
                                <NavLink
                                    to={link.route}
                                >
                                    {link.label}
                                </NavLink>

                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    )
}

export default Topbar