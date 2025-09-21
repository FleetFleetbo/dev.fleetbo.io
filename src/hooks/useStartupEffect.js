//src/hooks/useStartupEffect.js

import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Fleetbo from 'api/fleetbo';
import { useAuth } from 'context/AuthContext'; 
import { history } from 'components/layout/Navigation';

export const useStartupEffect = () => {
    const location       = useLocation(); 
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            Fleetbo.onWebPageReady();
        }, 150);

        return () => clearTimeout(timer); 
    }, [location]);

    useEffect(() => {
        const lastActiveTab = localStorage.getItem("activeTab") || "Tab1";
        const initialRoute = `/${lastActiveTab.toLowerCase()}`;
        if (location.pathname === '/' && initialRoute !== '/tab1') { 
            console.log(`Synchronisation de la route initiale vers : ${initialRoute}`);
            history.push(initialRoute);
        }
    }, [location.pathname]); 

    useEffect(() => {
      if (!window.fleetbo) {
        console.error("L'application doit être exécutée dans le conteneur natif.");
        window.location.href = 'https://fleetbo.io/docs';
      }
    }, []); 

        
    useEffect(() => {
        if (isLoggedIn) {
            console.log("Auth state changed to logged IN, navigating...");
            // On le redirige vers la page d'accueil par défaut ou la dernière page active
            const lastActiveTab = localStorage.getItem('activeTab') || 'Tab1';
            const initialRoute = `/${lastActiveTab.toLowerCase()}`;
            navigate(initialRoute, { replace: true });
        }
    }, [isLoggedIn, navigate]);

};
