import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Loader from 'components/common/Loader'; 

/**
 * Ce composant agit comme un aiguilleur.
 * Il lit l'état ('login' ou 'welcome') stocké par le code natif,
 * s'assure que la barre de navigation est masquée,
 * et redirige l'utilisateur vers la page appropriée en utilisant React Router.
 */
const RouteAuth = () => {
    const navigate = useNavigate(); 

    useEffect(() => {
        // Fleetbo.setNavbarHide();
        // On exécute la logique de redirection une seule fois au montage du composant.
        const data = localStorage.getItem('AppInfo');

        if (data) {
            try {
                const parsedData = JSON.parse(data);

                // Logique de redirection basée sur l'état reçu.
                if (parsedData.state === "welcome") {
                    // Utiliser navigate pour rediriger
                    navigate('/tab1', { replace: true });
                } else {
                    // Par défaut, on redirige vers 'login'
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error("Erreur de parsing pour AppInfo depuis localStorage", error);
                // En cas d'erreur, on redirige vers login par sécurité.
                navigate('/login', { replace: true });
            }
        } 
    }, [navigate]); // Ajouter navigate aux dépendances de l'effet.

    // On affiche un loader pendant que la logique de redirection s'exécute.
    // L'utilisateur ne le verra qu'une fraction de seconde.
    return <Loader />;
};

export default RouteAuth;
