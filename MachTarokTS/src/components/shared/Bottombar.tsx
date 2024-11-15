import { Link, useLocation } from "react-router-dom";

import { bottombarLinks } from "@/constants";

const Bottombar = () => {
    const { pathname } = useLocation();

    return (
        <section className="bottombar overflow-x-auto">
            {bottombarLinks.map((link) => {
                const isActive = pathname === link.route;
                return (
                    <Link
                        key={`bottombar-${link.label}`}
                        to={link.route}
                        className={`${isActive && "bg-blue"
                            } flex-center flex-col gap-3 p-2 transition rounded-[10px]`}>
                        <img
                            src={link.imgUrl}
                            alt={link.label}
                            width={16}
                            height={16}
                            className={`${isActive && "invert-white"}`}
                        />

                        <p className={`tiny-medium text-white text-center ${isActive && "underline"}`}>{link.label}</p>
                    </Link>
                );
            })}
        </section>
    );
};

export default Bottombar;