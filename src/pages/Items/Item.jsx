import React, { useEffect, useState } from 'react';
import Fleetbo from '../../api/fleetbo'; 
import { fleetboDB } from '../../config/fleetboConfig';


const Item = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState("");


    useEffect(() => {
        window.getParam = (id) => {
            console.log("ID reçu du natif:", id);
            if (id) {
                Fleetbo.getDoc(fleetboDB, "items", id);
            } else {
                setError("Aucun ID d'item n'a été fourni.");
                setLoading(false);
            }
        };

        Fleetbo.setDataCallback((response) => {
            if (response.success && response.data) {
                setItemData(response.data);
            } else {
                const errorMessage = response.message || "Erreur lors de la récupération du document.";
                console.error("Erreur de récupération:", errorMessage);
                setError(errorMessage);
            }
            setLoading(false);
        });

        return () => {
            delete window.getParam;
            Fleetbo.setDataCallback(null);
        };
    }, []);

    // Fonction pour afficher le contenu (chargement, erreur, ou données)
    const renderContent = () => {
        if (loading) {
            return (
                <div className='center-container'>
                    <div className="loader"></div>
                </div>
            );
        }

        if (error) {
            return <div className="alert alert-danger">{error}</div>;
        }

        if (itemData) {
            return (
                <div>
                    <h2>{itemData.title}  </h2>
                    <h5 className='fw-normal text-secondary'>{itemData.content} </h5>
                </div>
            );
        }
        return <p>Aucune donnée trouvée pour cet item.</p>;
    };
    return (
        <>
            <header className='navbar pt-4'> 
                <div> 
                    <button onClick={() => Fleetbo.back()} className="logout fs-5 fw-bold">
                        <i className="fa-solid fa-arrow-left"></i> <span className='ms-3'>Item</span>
                    </button>
                </div>
            </header>
            <div className="p-3">
                {renderContent()}
            </div>
        </>
    );
};

export default Item;
