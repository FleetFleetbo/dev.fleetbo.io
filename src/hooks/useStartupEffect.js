import { useEffect } from 'react';
import Fleetbo from 'api/fleetbo';
import { useLocation } from 'react-router-dom';
import { history } from 'components/layout/Navigation';

export const useStartupEffect = () => {
        const location = useLocation(); 

        // Cet effet s'exécute à chaque fois que l'URL change
        useEffect(() => {
            // On attend un très court instant pour s'assurer que le DOM est bien à jour
            setTimeout(() => {
            console.log("React: Page rendue. Notification au natif.");
            Fleetbo.onWebPageReady();
            }, 150); // Un petit délai de sécurité
        }, [location]); // Se déclenche à chaque changement d'URL
    
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
            window.location.href = 'https://fleetbo.io/docs'; // Redirection agressive, à n'utiliser qu'en production
          }
        }, []);
};
