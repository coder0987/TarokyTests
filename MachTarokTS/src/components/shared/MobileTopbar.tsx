import { Link } from 'react-router-dom';

const MobileTopbar = () => {
    return (
        <section className='mobile-topbar'>
            <div className='flex flex-row gap-3 py-4 px-3 items-center justify-center'>
                <Link to='/' className='flex gap-4 items-center'>
                    <img
                        src='/assets/logo/logo-white.png'
                        alt='logo'
                        width={36}
                        height={36}
                    />
                    <img
                        src='/assets/logo/logo-full-white.png'
                        alt='logo'
                        width={100}
                        height={36}
                    />
                </Link>
            </div>
        </section>
    )
}

export default MobileTopbar