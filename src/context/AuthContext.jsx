import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async (userId) => {
        if (!userId) return;
        try {
            // We need to fetch the latest user details from the server to get the updated photo
            // Assuming we have an endpoint GET /api/user/:id or similar.
            // We used to fetch it in components, but centralizing here is better for sync.
            const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
            if (response.ok) {
                const freshUser = await response.json();
                setUser(freshUser);
                localStorage.setItem('uliyar_user', JSON.stringify(freshUser));
            }
        } catch (error) {
            console.error("Failed to refresh user context", error);
        }
    };

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('uliyar_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Optional: Refresh from server on load to ensure data is fresh
            fetchUser(parsedUser.id);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('uliyar_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('uliyar_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
