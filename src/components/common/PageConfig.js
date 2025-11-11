// Dans src/components/common/PageConfig.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Fleetbo from 'config/systemhelper';

const PageConfig = ({ navbar }) => {
    const location = useLocation();

    useEffect(() => {
        const route = location.pathname;
        let navbarState = navbar || 'none';

        // Security logic
        if (navbarState !== 'show' && navbarState !== 'visible') {
            navbarState = 'none';
        }

        console.log(`React [PageConfig]: Page [${route}] peinte. Notif native. Config: [${navbarState}]`);

        // Envoie l'info au natif
        if (window.Fleetbo && typeof window.Fleetbo.onWebPageReady === 'function') {
            Fleetbo.onWebPageReady(route, navbarState);
        }
        
    }, [location, navbar]);
    return null;
};

export default PageConfig;
