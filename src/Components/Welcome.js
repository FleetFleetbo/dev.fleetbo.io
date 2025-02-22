import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const Welcome = () => {

    const navigate                              = useNavigate();
    const [isLoading, setIsLoading]             = useState(true); // Pour gérer l'état de chargement de la page
	const [appInfo, setAppInfo]             = useState(null); // État pour stocker les données


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
        }, 1500); 
    }, [navigate]); // Supprime `appInfo` pour éviter des re-render inutiles


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
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
                       <p>Impossible de charger les informations de l'app.</p>
                    </div>
                )}
            </div>
            
        </motion.div>
    
    )
};

export default Welcome;
