import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const Welcome = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading]             = useState(true); // Pour gérer l'état de chargement de la page
	const [hasLoadedNavbar, setHasLoadedNavbar] = useState(false);
	const [appInfo, setAppInfo]                 = useState(null); // État pour stocker les données


    const logout = () => {
		setIsLoading(true);
		setTimeout(() => {
			if (window.Android && typeof window.Android.o00011 === 'function') {
				window.Android.o00011();
				localStorage.clear();
			} else {
				navigate('/un');
			}
		}, 1000);
	};


    useEffect(() => {
        setHasLoadedNavbar(true);
        setTimeout(() => {
            const data = localStorage.getItem('AppInfo');
            if (data) {
                const parsedData = JSON.parse(data);
    
                if (parsedData.logged === false) {
                    navigate('/login');
                } else {
                    setAppInfo(parsedData);
                }
            }
            setIsLoading(false); // Désactive le chargement après récupération des données
        }, 1000); 
    }, [navigate]); // Supprime `appInfo` pour éviter des re-render inutiles


    return (
        <motion.div
           transition={{ duration: 0.4 }}
        >
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="logo" />
                    <h1 className="title">{appInfo?.name}</h1>
                </div>
                <div className="navbar-right">
                    <button onClick={logout} className="logout">
                        <i className="fa-solid fa-power-off"></i>
                    </button>
                </div>
            </nav>

            {/* ✅ Le contenu ne s'affiche qu'après que la navbar soit chargée */}
            {hasLoadedNavbar && (
                <div className="App-Container">
                    {isLoading ? (
                        <div className="parent-container">
                            <div className="loader"></div>
                        </div>
                    ) : appInfo ? (
                        <div className="text-container">
                            <h2>{appInfo.name}</h2>
                            <p>Welcome !</p>
                        </div>
                    ) : (
                        <div className="parent-container">
                            <p>Impossible de charger les informations de l'application.</p>
                        </div>
                    )}
                </div>
            )}  
        </motion.div>
    
    )
};

export default Welcome;
