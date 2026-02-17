import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('login');
    const [authRole, setAuthRole] = useState('candidate');

    const openLogin = (role = 'candidate') => {
        setAuthModalView('login');
        setAuthRole(role);
        setIsAuthModalOpen(true);
    };

    const openRegister = (role = 'candidate') => {
        setAuthModalView('register');
        setAuthRole(role);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    return (
        <UIContext.Provider value={{
            isAuthModalOpen,
            authModalView,
            authRole,
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
