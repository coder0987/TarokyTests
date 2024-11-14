import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    ToastProvider,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastViewport,
} from '@/components/ui/toast';

type ToastType = 'success' | 'error' | 'neutral';

interface ToastContextProps {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const [toastType, setToastType] = useState<ToastType>('neutral');

    const triggerToast = (message: string, type: ToastType) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    return (
        <ToastContext.Provider value={{ showToast: triggerToast }}>
            <ToastProvider>
                {children}
                {showToast && (
                    <Toast onOpenChange={setShowToast} open={showToast} className={
                        toastType === 'success' ? 'toast-success' :
                            toastType === 'error' ? 'toast-error' :
                                'toast-neutral'}>
                        <ToastTitle>{toastType === 'success' ? 'Success' : toastType === 'error' ? 'Error' : 'Info'}</ToastTitle>
                        <ToastDescription>
                            {toastMessage}
                        </ToastDescription>
                    </Toast>
                )}
                <ToastViewport />
            </ToastProvider>
        </ToastContext.Provider>
    );
};
