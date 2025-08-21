import { createContext, useContext, useEffect, useState } from "react";
import { Account } from '@/types';

export const INITIAL_ACCOUNT = {
    user: "Guest",
    authToken: null,
    preferences: {}
}

const INITIAL_STATE = {
    account: INITIAL_ACCOUNT,
    isAuthenticated: false
}

type IContextType = {
    account: Account;
    isAuthenticated: boolean;
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [account, setAccount] = useState<Account>(INITIAL_ACCOUNT);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    //define any other global state here

    const handleLogin = (username: string, token: string) => {
        setAccount({ user: username, authToken: token, preferences: {} });
        document.cookie = `username=${username};secure`;
        document.cookie = `token=${token};secure`;
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setAccount(INITIAL_ACCOUNT);
        setIsAuthenticated(false);
    };

    const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
        return null;
    };

    useEffect(() => {
        const username = getCookie("username");
        const token = getCookie("token");

        if (username && token) {
            handleLogin(username, token);
        } else {
            setIsAuthenticated(false);
        }

        //REMOVE FOR PRODUCTION
        //handleLogin('Test', 'tOkEn');

        setIsLoading(false);
    }, []);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            if (event.origin !== 'https://sso.smach.us') return;

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
        account: account,
        isAuthenticated: isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useUserContext = () => useContext(AuthContext);