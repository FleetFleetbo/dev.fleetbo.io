import React, { useEffect, useState } from 'react';
import Fleetbo, { FleetboGet, useLoadingTimeout } from 'systemHelper';
import { fleetboDB } from 'db';


const Tab3 = () => {
    const [loadpage, setLoadPage] = useState(true);
    const [userData, setUserData] = useState(null); 
    const [error, setError]       = useState("");
    const db                      = "users";
    

    useLoadingTimeout(loadpage, setLoadPage, setError);

    useEffect(() => {
        FleetboGet((jsonData) => {
            try {
                console.log("Données reçues:", jsonData);
                
                // Gérer les différents cas de réponse
                if (jsonData.error) {
                    setError(jsonData.message || "Une erreur s'est produite");
                    setUserData(null);
                } else if (jsonData.notFound) {
                    setError("Aucune donnée utilisateur disponible");
                    setUserData(null);
                } else if (jsonData && (jsonData.username || jsonData.dateCreated)) {
                    setUserData({
                        username: jsonData.username || "Not available",
                        dateCreated: jsonData.dateCreated || ""
                    });
                    setError("");
                } else {
                    setError("Format de données incorrect");
                    setUserData(null);
                }
            } catch (error) {
                console.error("Error processing data:", jsonData, error);
                setError("Erreur lors du traitement des données");
                setUserData(null);
            } finally {
                setLoadPage(false);
            }
        });
    
        setTimeout(() => {
            Fleetbo.gdf37Auth(fleetboDB, db);
        }, 500);
        
        // Pas besoin de retour de nettoyage ici car le failsafe est géré séparément
    }, []);

    return (
        <>
            <header className='navbar pt-3'> 
                <h2 className='fw-bolder'>Tab3</h2>
            </header>

            <div className="center-container">
                {loadpage ? (
                    <div className="loader"></div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : userData ? (
                    <div className="container">
                        <img
                            className='img-login'
                            src="https://static.vecteezy.com/system/resources/thumbnails/009/397/835/small/man-avatar-clipart-illustration-free-png.png"
                            alt="user"
                        />
                        <h2 className="text-success fw-bolder mt-2">
                            {userData.username || "Not available"}
                        </h2>
                        <h5 className="text-dark fw-normal">+237693386555</h5>
                        <h6 className="text-secondary fw-bold">
                            {userData.dateCreated ? `Since ${userData.dateCreated}` : ""}
                        </h6>
                        <button 
                            onClick={() => { setTimeout(() => { Fleetbo.d0a13() }, 500) }} 
                            className="go mt-3"
                        > 
                            Log Out 
                        </button>
                    </div>
                ) : (
                    <div className="alert alert-info">Aucune donnée utilisateur disponible</div>
                )}
            </div>
        </>
    );
};

export default Tab3;
