import { createContext, useContext, useEffect, useState } from "react";
import { IAccount } from '@/types';

export const INITIAL_ACCOUNT = {
    user: null,
    authToken: null
}

const INITIAL_STATE = {
    account: INITIAL_ACCOUNT
}

type IContextType = {
    account: IAccount;
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [account, setAccount] = useState<IAccount>(INITIAL_ACCOUNT);
    const [isLoading, setIsLoading] = useState(false);
    //define any other global state here

    useEffect(() => {
        const checkAuthUser = async () => {
            setIsLoading(true);
            // check if user signed in or guest, use setAccount
            window.addEventListener
            setIsLoading(false);
        };
        checkAuthUser();
    }, []);

    const value = {
        account: account
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export const useUserContext = () => useContext(AuthContext);