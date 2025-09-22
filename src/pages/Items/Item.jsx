import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo'; 
import { fleetboDB } from 'config/fleetboConfig';
import PageConfig from 'components/common/PageConfig';


const ItemHeader = () => {
    return (
         <header className='navbar ps-3 pt-3'> 
            <div> 
                <button onClick={() => Fleetbo.back()} className="btn-header text-success fs-5 fw-bold">
                    <i className="fa-solid fa-arrow-left"></i> <span className='ms-3'>Item</span>
                </button>
            </div>
        </header>
    );
};

const Item = () => {
    const [itemData, setItemData] = useState(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState("");
    
    useEffect(() => {
        window.getParam = (id) => {
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
                setError(errorMessage);
            }
            setLoading(false);
        });
        return () => {
            delete window.getParam;
            Fleetbo.setDataCallback(null);
        };
    }, []);

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
            <PageConfig navbar="hidden" />
            <ItemHeader />
            <div className="p-3">
                {renderContent()}
            </div>
        </>
    );
};

export default Item;
