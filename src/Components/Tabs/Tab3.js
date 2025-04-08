import React, { useEffect, useState } from 'react';
import Fleetbo, { FleetboGet } from 'systemHelper';
import { fleetboDB } from 'db';

const Tab3 = () => {
    const [loadpage, setLoadPage] = useState(true);
    const [userData, setUserData] = useState(null); 
    const [error, setError] = useState("");
    const db = "users";

    useEffect(() => {
        FleetboGet((jsonData) => {
            try {
                if (jsonData && (jsonData.username || jsonData.dateCreated)) {
                    setUserData({
                        username: jsonData.username || "Not available",
                        dateCreated: jsonData.dateCreated || ""
                    });
                } else {
                    setError("Aucune donnée utilisateur disponible");
                }
            } catch (error) {
                console.error("Error getting data:", jsonData, error);
                setError("Erreur lors de la récupération des données");
            }
            
            setLoadPage(false);
        });
    
        setTimeout(() => {
            Fleetbo.gdf37Auth(fleetboDB, db);
        }, 300);
    }, []);

    return (
        <>
            <header className='navbar pt-4'> 
                <h1 className='fs-5 fw-bolder'>Tab3</h1>
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
