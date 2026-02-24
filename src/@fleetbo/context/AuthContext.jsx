// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading]     = useState(true);
    const [isLoggedIn, setIsLoggedIn]   = useState(false);
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        const checkUserSession = async () => {
            try { 
                const data     = await Fleetbo.checkAuthStatusAndRedirect();
                setSessionData(data);
                if (data && data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setSessionData(data);
                } else {
                    setIsLoggedIn(false); 
                }
            } catch (error) {
                setIsLoggedIn(false);
                setSessionData(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkUserSession();
        const handleFleetboLogin = (e) => {
            const data = e.detail || {};
            setIsLoggedIn(true);
            setSessionData(prev => ({ ...prev, ...data, isLoggedIn: true }));
        };
        window.addEventListener('FLEETBO_AUTH_SUCCESS', handleFleetboLogin);
        return () => window.removeEventListener('FLEETBO_AUTH_SUCCESS', handleFleetboLogin);
    }, []);

    const login = (data) => {
        setIsLoggedIn(true);
        setSessionData(data);
    };
    const value = { isLoading, isLoggedIn, sessionData, setIsLoggedIn, login };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};
