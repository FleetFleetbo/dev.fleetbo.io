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
			if (typeof window.fleetbo.d0a13 === 'function') {
				window.fleetbo.d0a13();
				localStorage.clear();
			} else {
				navigate('/un');
			}
	    }, 1000);
    };


   useEffect(() => {
        setTimeout(() => {
            try {
                const data = localStorage.getItem("AppInfo");

                if (data) {
                    const parsedData = JSON.parse(data);

                    if (!parsedData.logged) {
                        navigate("/login");
                    } else {
                        setAppInfo(parsedData);
                    }
                } else {
                    navigate("/un");
                }
            } catch (error) {
                console.error("Erreur lors du parsing de AppInfo :", error);
                localStorage.removeItem("AppInfo"); // Supprime les données corrompues
            }
            setIsLoading(false);
        }, 1000);
    }, [navigate]); // Supprime `appInfo` pour éviter des re-render inutiles


   return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
        >
            <nav className="navbar">
                <div className="navbar-left">
                    <img src={`${process.env.PUBLIC_URL}/logo512.png`} alt="Logo" className="logo" />
                    <h1 className="title"> {appInfo.name} </h1>
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
                       <h2> Fleetbo </h2>
                       <p>Welcome developer!</p>
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
