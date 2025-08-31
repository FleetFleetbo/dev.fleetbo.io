import { useEffect } from 'react';
import Fleetbo from 'api/fleetbo';
import { useLocation } from 'react-router-dom';
import { history } from 'components/layout/Navigation';

export const useStartupEffect = () => {
        const location = useLocation(); 

        useEffect(() => {
            setTimeout(() => {
            console.log("React: Page rendue. Notification au natif.");
            Fleetbo.onWebPageReady();
            }, 150); 
        }, [location]); 
    
        useEffect(() => {
            const lastActiveTab = localStorage.getItem("activeTab") || "Tab1";
            const initialRoute = `/${lastActiveTab.toLowerCase()}`;
            if (location.pathname === '/' && initialRoute !== '/tab1') { 
                console.log(`Synchronisation de la route initiale vers : ${initialRoute}`);
                history.push(initialRoute);
            }
        }, []); 

        useEffect(() => {
          if (!window.fleetbo) {
            console.error("L'application doit être exécutée dans le conteneur natif.");
            window.location.href = 'https://fleetbo.io/docs'; 
          }
        }, []);
};
