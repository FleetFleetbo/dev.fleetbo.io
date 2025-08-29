import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { history } from 'components/layout/Navigation';

export const useStartupEffect = () => {
    const location = useLocation(); 
    
        // Ce useEffect gère la redirection au démarrage
        useEffect(() => {
            const lastActiveTab = localStorage.getItem("activeTab") || "Tab1";
            const initialRoute = `/${lastActiveTab.toLowerCase()}`;
    
            if (location.pathname === '/' && initialRoute !== '/tab1') { // On agit seulement au démarrage
                console.log(`Synchronisation de la route initiale vers : ${initialRoute}`);
                history.push(initialRoute);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []); // Le tableau vide garantit une seule exécution au montage

        useEffect(() => {
          if (!window.fleetbo) {
            console.error("L'application doit être exécutée dans le conteneur natif.");
            window.location.href = 'https://fleetbo.io/docs';
          }
        }, []);
};
