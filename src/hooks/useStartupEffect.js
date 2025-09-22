//src/hooks/useStartupEffect.js

import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { history } from 'components/layout/Navigation';
import Fleetbo from 'api/fleetbo';


export const useStartupEffect = () => {
    const location       = useLocation(); 
    const navigate       = useNavigate();

    useEffect(() => {
        window.navigateToTab = (route) => {
            console.log(`Commande de navigation native reçue pour : ${route}`);
            navigate(route);
        };
        return () => { delete window.navigateToTab; };
    }, [navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("React: Page rendue. Notification au natif pour la route :", location.pathname);
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
    }, [location.pathname]);  // a verifier

    useEffect(() => {
      if (!window.fleetbo) {
        console.error("L'application doit être exécutée dans le conteneur natif.");
        window.location.href = 'https://fleetbo.io/docs';
      }
    }, []); 

    useEffect(() => {
        window.navigateToTab = (route) => {
            console.log(`Commande de navigation native reçue pour : ${route}`);
            navigate(route);
        };
        return () => {
            delete window.navigateToTab;
        };
    }, [navigate]);


};
