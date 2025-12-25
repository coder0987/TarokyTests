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
    showToast: (message: string, type?: ToastType, title?: string, clickHandler?: () => void) => void;
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
    const [toastTitle, setToastTitle] = useState<string>('');
    const [toastClickHandler, setToastClickHandler] = useState<() => void>();

    const triggerToast = (message: string, type?: ToastType, title?: string, clickHandler?: () => void) => {
        setToastMessage(message);
        setToastType(type || 'neutral');
        setToastTitle(title || '');
        setToastClickHandler(() => clickHandler);
        setShowToast(true);
    };

    return (
        <ToastContext.Provider value={{ showToast: triggerToast}}>
            <ToastProvider>
                {children}
                {showToast && (
                    <Toast onOpenChange={setShowToast} open={showToast} className={
                        toastType === 'success' ? 'toast-success' :
                            toastType === 'error' ? 'toast-error' :
                                'toast-neutral'}>
                        <ToastTitle>{toastTitle ? toastTitle : (toastType === 'success' ? 'Success' : toastType === 'error' ? 'Error' : 'Info')}</ToastTitle>
                        <ToastDescription onClick={toastClickHandler}>
                            {toastMessage}
                        </ToastDescription>
                    </Toast>
                )}
                <ToastViewport />
            </ToastProvider>
        </ToastContext.Provider>
    );
};
