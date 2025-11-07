//src/hooks/useStartupEffect.js

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { history } from 'components/layout/Navigation';

export const useStartupEffect = () => {
    const location       = useLocation(); 
    const navigate       = useNavigate();

    const [isFleetboReady, setIsFleetboReady] = useState(false);
    const [initializationError, setInitializationError] = useState(null);

    useEffect(() => {
        const startTime = Date.now();

        const checkFleetbo = () => {
            if (window.Fleetbo) {
                console.log("Fleetbo API is ready!");
                setIsFleetboReady(true);
                return;
            }

            if (Date.now() - startTime < 10000) {
                setTimeout(checkFleetbo, 100);
            } else {

                console.error("Fleetbo initialization timed out.");
                setInitializationError("Failed to connect to the fleetbo engine interface. ");
            }
        };

        checkFleetbo();

    }, []); 

    useEffect(() => {
        window.navigateToTab = (route) => {
            console.log(`Commande de navigation native reçue pour : ${route}`);
            navigate(route);
        };
        return () => { delete window.navigateToTab; };
    }, [navigate]);

    useEffect(() => {
        console.log("React: Page rendue. Notification au natif pour la route :", location.pathname);
        Fleetbo.onWebPageReady();
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

    return { isFleetboReady, initializationError };

};
