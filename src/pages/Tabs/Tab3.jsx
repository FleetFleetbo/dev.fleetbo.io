// src/pages/Tabs/Tab3.jsx

import React, { useEffect, useState } from 'react';
import Fleetbo from '../../api/fleetbo'; 
import { fleetboDB } from '../../config/fleetboConfig';
import Loader from '../../components/common/Loader'; 
import avatarImage from '../../assets/images/avatar.png'; 


// --- Composant Header ---
const Tab3Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Tab 3 </h2>
        </header>
    );
};

// --- Main component ---
const Tab3 = () => {
    // --- États du composant ---
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null); 
    const [error, setError] = useState(null);    
    const dbName = "users"; 

    Fleetbo.useLoadingTimeout(isLoading, setIsLoading, setError, 15000);

    useEffect(() => {
        let isComponentMounted = true;

        Fleetbo.setDataCallback((jsonData) => {
            if (!isComponentMounted) {
                console.warn("Données reçues après le démontage de Tab3. Mise à jour ignorée.");
                return;
            }

            try {
                if (jsonData && jsonData.success && jsonData.data) {
                    setUserData({
                        username: jsonData.data.username || "Utilisateur",
                        phoneNumber: jsonData.data.phoneNumber || "Numéro non disponible",
                        dateCreated: jsonData.data.dateCreated || ""
                    });
                    setError(null);
                } else {
                    throw new Error(jsonData.message || "Les données utilisateur sont incomplètes.");
                }
            } catch (err) {
                console.error("Erreur lors du traitement des données de l'utilisateur:", err);
                setError(err.message);
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        });

        const timer = setTimeout(() => {
            Fleetbo.getAuthUser(fleetboDB, dbName);
        }, 100);

        return () => {
            isComponentMounted = false;
            clearTimeout(timer);
            Fleetbo.setDataCallback(null);
        };
    }, []);

    // --- Render logic ---
    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        if (error) {
            return <div className="alert alert-danger">{error}</div>;
        }
        if (userData) {
            return (
                <div className="container text-center">
                    <img
                        className='img-login'
                        src={avatarImage}
                        alt="Avatar de l'utilisateur"
                    />
                    <h2 className="text-success fw-bolder mt-2">
                        {userData.username}
                    </h2>
                    <h5 className="text-dark fw-normal">{userData.phoneNumber}</h5>
                    <h6 className="text-secondary">
                        {userData.dateCreated ? `Membre depuis ${userData.dateCreated}` : ""}
                    </h6>
                    <button
                        onClick={() => Fleetbo.d0a13()} 
                        className="go mt-3"
                    >
                        Logout
                    </button>
                </div>
            );
        }
        return <div className="alert alert-info">No user data available.</div>;
    };

    return (
        <>
            <Tab3Header />
            <div className="center-container position-relative" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab3;
