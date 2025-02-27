import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const Login = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement de la page
    const [loading, setLoading]     = useState(false); // Pour gérer l'état de chargement des données
    const [appInfo, setAppInfo]     = useState(null); // État pour stocker les données``


    const logout = async (e) => {
        e.preventDefault(); 
		setIsLoading(true);
		setTimeout(() => {
			if (typeof window.fleetbo.c00ey0 === 'function') {
				window.fleetbo.c00ey0();
			} 
		}, 1000);
	};
    
     const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
        setLoading(true);    // Active le chargement
    
        try {
            if (typeof window.fleetbo.s0075 === 'function') {
                window.fleetbo.s0075(); //  Appelle la fonction Android
            } else {
                localStorage.clear();
                navigate('/un'); // Redirige si Android n'est pas disponible
            }
        } catch (error) {
            console.error(`Erreur : ${error.message}`); //  Meilleure gestion des erreurs
        } finally {
            setTimeout(() => setLoading(false), 1000); // Ajoute un petit délai pour un effet visuel fluide
        }
    };

     useEffect(() => {
            // Récupérer les données depuis localStorage dès que le composant est monté
            const data = localStorage.getItem('AppInfo');

            setTimeout(() => {
                if (data) {
                    // Parsez les données JSON récupérées
                    const parsedData = JSON.parse(data);
                 
                    // Vérifiez la valeur de 'logged' et mettez à jour l'état
                    if (parsedData.logged === true) {
                        navigate('/welcome');
                    } else {
                        setAppInfo(parsedData);
                    }
                    setIsLoading(false);  // Mettre à jour le statut de chargement
                } else {
                    setIsLoading(false);  // Pas de données, terminer le chargement
                }
            }, 1000); 
    }, [appInfo, navigate]);


    if (isLoading) {
        return <div className='parent-container'><><div className="loader">
        </div></> </div>;
    }


    return (
        <motion.div
            transition={{ duration: 0.4 }}
            className="parent-container"
        >
            <div className="container">
            {isLoading ? (
                    <div className="parent-container">
                        <div className="loader"></div>
                    </div>
                ) : appInfo ? (
                    <>
                        <img
                            src={`${process.env.PUBLIC_URL}/logo512.png`}
                            className="img-login"
                            alt="Logo"
                        />
                        <div className="text-container">
                            <h2>{appInfo.name}</h2>
                            <div style={{ height: "70px" }}>
                                <p>{appInfo.description}</p>
                            </div>
                            <button onClick={handleSubmit} className="go">
                                {loading ? "Chargement..." : "Se connecter"}
                            </button>
                        </div>
                        <br />
                        <div className="pb-2">
                            <button onClick={logout} className="btn-logout mt-3 text-secondary">
                                <i className="fa-solid fa-power-off"></i> Quitter
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <p>Informations non disponibles</p>
                    </div>
                )}
            </div>   
        </motion.div>
    )
};

export default Login;
