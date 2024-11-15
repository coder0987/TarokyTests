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

    const handleLogin = (username: string, token: string) => {
        setAccount({ user: username, authToken: token });
        document.cookie = `username=${username};secure`;
        document.cookie = `token=${token};secure`;
    };

    const handleLogout = () => {
        setAccount(INITIAL_ACCOUNT);
    };

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            if (event.origin !== 'https://sso.smach.us' && event.origin !== 'https://sso.samts.us') return;

            const messageData = event.data as string;

            if (messageData === 'signOut') {
                handleLogout();
            } else {
                const [username, token, signUp] = messageData.split(':');
                if (signUp === 'new') {
                    //special handling for new user?
                }
                handleLogin(username, token);
            }
        };

        window.addEventListener('message', messageHandler);

        return () => {
            window.removeEventListener('message', messageHandler);
        };
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