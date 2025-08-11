import React, { createContext, useState, useContext, useEffect } from 'react';
import Fleetbo from 'api/fleetbo'; 
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sessionData, setSessionData] = useState(null);
    useEffect(() => {
        Fleetbo.setDataCallback((data) => {
            if (data && data.isLoggedIn) {
                setIsLoggedIn(true);
                setSessionData(data); 
            } else {
                setIsLoggedIn(false);
                setSessionData(null); 
            }
            setIsLoading(false);
        });
        return () => Fleetbo.setDataCallback(null);
    }, []);
    const value = { isLoading, isLoggedIn, sessionData, setSessionData, setIsLoggedIn };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};
