import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Loader from 'components/common/Loader'; 
import Fleetbo from 'api/fleetbo';

/**
 * Ce composant agit comme un aiguilleur.
 * Il lit l'état ('login' ou 'register') stocké par le code natif,
 * s'assure que la barre de navigation est masquée,
 * et redirige l'utilisateur vers la page appropriée en utilisant React Router.
 */
const RouteAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem('AppInfo');

        if (data) {
            try {
                const parsedData = JSON.parse(data);

                if (parsedData.state === "register") {
                    navigate('/register', { replace: true });
                } else {
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error("Erreur de parsing pour AppInfo depuis localStorage", error);
                navigate('/login', { replace: true });
            }
        } else {
            console.error("Aucune information AppInfo trouvée dans localStorage pour le routage.");
            navigate('/login', { replace: true });
        }
    }, [navigate]); 

    return <Loader />;
};

export default RouteAuth;
