// src/pages/Tabs/Tab1.jsx

import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo'; 
import { fleetboDB } from 'config/fleetboConfig';
import Loader from 'components/common/Loader'; 

// --- Composant Header ---
const Tab1Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Tab 1</h2>
            <div className="navbar-right">
                <button onClick={() => Fleetbo.openPage('insert')} className="logout fs-5 fw-bold">
                    <i className="fa-solid fa-plus"></i>
                </button>
                <button onClick={() => Fleetbo.getToken()} className="logout fs-5 fw-bold ms-5">
                    <i className="fa-solid fa-bell"></i>
                </button>
            </div>
        </header>
    );
};

// --- Main component ---
const Tab1 = () => {
    // --- États du composant ---
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const collectionName = "items";

    // --- Hooks ---
    Fleetbo.useLoadingTimeout(isLoading, setIsLoading, setError);

    useEffect(() => {
        let isMounted = true;

        Fleetbo.setDataCallback((parsedData) => {
            if (!isMounted) return;

            if (parsedData && parsedData.success) {
                setData(parsedData.data || []);
                setError("");
            } else {
                setError(parsedData.message || "Erreur de récupération des données.");
                console.error("Erreur de récupération des données :", parsedData.message);
            }
            setIsLoading(false);
        });

        Fleetbo.getDocsG(fleetboDB, collectionName);

        window.getToken = (deviceToken) => {
            if (!isMounted) return;
            console.log("FCM Token received:", deviceToken);
        };

        return () => {
            isMounted = false;
            Fleetbo.setDataCallback(null);
            delete window.getToken;
        };
    }, []); 

    const deleteItem = (id) => {
        setData((prevData) => prevData.filter(item => item.id !== id));
        Fleetbo.delete(fleetboDB, collectionName, id);
    };

    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        if (error) {
            return <div className="alert alert-danger">{error}</div>;
        }
        return (
            <div className=" mt-3">
                <h2 className='fw-bolder mb-4'>Items</h2>
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className='col-12'>
                             <div className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="card-title text-success mb-1">{item.title}</h5>
                                            <p className="card-text text-muted">{item.content}</p>
                                        </div>
                                        <div className="d-flex align-items-center ms-3">
                                            <button onClick={() => Fleetbo.openPageId('item', item.id)} className="logout fs-5 fw-bold me-4" title="Voir">
                                                <i className="fa-solid fa-eye text-success"></i>
                                            </button>
                                            <button onClick={() => deleteItem(item.id)} className="logout fs-5 fw-bold" title="Supprimer">
                                                <i className="fa-solid fa-trash text-danger"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-muted mt-5">No data available.</p>
                )}
            </div>
        );
    };

    return (
        <>
            <Tab1Header />
            <div className="p-3 position-relative" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab1;
