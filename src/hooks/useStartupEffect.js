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
        let timer = null;
        let requester = null; 

        const onFleetboReady = () => {
            clearTimeout(timer);
            clearInterval(requester);
            window.removeEventListener('message', handleMessage);
            setIsFleetboReady(true);
        };
        const handleMessage = (event) => {
            if (event.data.type === 'FLEETBO_DELIVER_ENGINE') {
                try {
                    const scriptEl = document.createElement('script');
                    scriptEl.id = 'fleetbo-native-engine';
                    scriptEl.innerHTML = event.data.code;
                    document.head.appendChild(scriptEl);

                    if (window.Fleetbo) {
                        onFleetboReady();
                    } else {
                        throw new Error("Fleetbo object missing.");
                    }
                } catch (e) {
                    setInitializationError("Failed to execute the fleetbo engine.");
                }
            }
        };

        timer = setTimeout(() => {
            if (!isFleetboReady) {
                setInitializationError("Failed to connect to the fleetbo engine.");
                clearInterval(requester);
                window.removeEventListener('message', handleMessage);
            }
        }, 10000);

        if (window.fleetbo && typeof window.fleetbo.log === 'function') {
            window.Fleetbo = window.fleetbo;       
            onFleetboReady();
        } else if (window.self !== window.top) {
            window.addEventListener('message', handleMessage);
            requester = setInterval(() => {
                if (window.Fleetbo) { 
                    onFleetboReady();
                    return;
                }
                if (window.parent) {
                    window.parent.postMessage({ type: 'FLEETBO_REQUEST_ENGINE' }, '*');
                }
            }, 250);
        } else {
             setInitializationError("FLEETBO ENGINE NOT RECOGNIZED BY YOUR APPLICATION.");
             clearTimeout(timer);
        }
        return () => {
            clearTimeout(timer);
            clearInterval(requester);
            window.removeEventListener('message', handleMessage);
        };

    }, []); 

    useEffect(() => {
        window.navigateToTab = (route) => {
            navigate(route);
        };
        return () => { delete window.navigateToTab; };
    }, [navigate]);

    useEffect(() => {
        const lastActiveTab = localStorage.getItem("activeTab") || "Tab1";
        const initialRoute = `/${lastActiveTab.toLowerCase()}`;
        if (location.pathname === '/' && initialRoute !== '/tab1') { 
            history.push(initialRoute);
        }
    }, [location.pathname]); 

    useEffect(() => {
      const isTopWindow = (window.self === window.top);
      if (!window.Fleetbo && isTopWindow) {
        window.location.href = 'https://fleetbo.io/docs';
      }
    }, []); 
    return { isFleetboReady, initializationError };

};
