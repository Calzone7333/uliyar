import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login');

    const openLogin = () => {
        setAuthModalView('login');
        setIsAuthModalOpen(true);
    };

    const openRegister = () => {
        setAuthModalView('register');
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    return (
        <UIContext.Provider value={{
            isAuthModalOpen,
            authModalView,
            openLogin,
            openRegister,
            closeAuthModal,
            setAuthModalView
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => useContext(UIContext);
