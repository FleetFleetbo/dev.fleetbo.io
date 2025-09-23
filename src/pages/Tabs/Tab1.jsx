import React, { useEffect, useState, useCallback } from 'react';
import Fleetbo from 'api/fleetbo'; 
import { useLoadingTimeout } from 'hooks/useLoadingTimeout';
import { fleetboDB } from 'config/fleetboConfig';
import { handleGetToken } from 'utils/getToken';
import Loader from 'components/common/Loader'; 
import PageConfig from 'components/common/PageConfig';


const Tab1Header = () => {

    return (
        <header className='navbar ps-3 pe-3 pt-3'>
            <h2 className='fw-bolder'>Tab 1</h2>
            <div className="navbar-right">
                <button onClick={() => Fleetbo.openPage('insert')} className="btn-header text-success fs-5 me-3 fw-bold">
                    <i className="fa-solid fa-plus"></i>
                </button>
                <button onClick={handleGetToken} className="btn-header fs-5 text-success fw-bold ms-3">
                    <i className="fa-solid fa-bell"></i>
                </button>
            </div>
        </header>
    );
};

const Tab1 = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(new Set()); 
    const collectionName = "items";


    useLoadingTimeout(isLoading, setIsLoading, setError);

    // Data fetching function, memoized with useCallback
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const parsedData = await Fleetbo.getDocsG(fleetboDB, collectionName);
            if (parsedData.success) {
                setData(parsedData.data || []);
            } else {
                setError(parsedData.message || "Erreur de récupération des données.");
            }
        } catch (err) {
            setError(err.message || "Une erreur inattendue s'est produite.");
            console.error("Erreur de récupération des données :", err);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    // useEffect calls the fetch function when the component mounts
    useEffect(() => { fetchData(); }, [fetchData]);

    // Robust delete function with optimistic UI and rollback
    const deleteItem = async (id) => {
        if (isDeleting.has(id)) return; 
        
        const originalData = [...data];
        setIsDeleting(prev => new Set(prev).add(id));
        setData(prevData => prevData.filter(item => item.id !== id));
        setError("");
        
        try {
            const result = await Fleetbo.delete(fleetboDB, collectionName, id);
            if (result && result.success === false) {
                throw new Error(result.message || "La suppression a échoué côté natif.");
            }
            console.log(`Item ${id} supprimé avec succès.`);
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
            // On failure, revert the change and display an error
            setError(`Erreur de suppression : ${err.message}`);
            setData(originalData);
        } finally {
            // Clean up the deleting state, whether the operation succeeded or failed
            setIsDeleting(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        if (error) {
            return (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={fetchData}>
                        Try again
                    </button>
                </div>
            );
        }
        
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className='fw-bolder'>Items</h2>
                    <button className="btn btn-sm btn-outline-secondary" onClick={fetchData} disabled={isLoading}>
                        <i className="fa-solid fa-refresh me-2"></i>
                        Refresh
                    </button>
                </div>
                
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className='col-12'>
                            <div className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title text-success mb-1">{item.title || 'Sans titre'}</h5>
                                            <p className="card-text float-start text-muted">{item.content || 'Pas de contenu.'}</p>
                                        </div>
                                        <div className="d-flex align-items-center ms-3">
                                            <button 
                                                onClick={() => Fleetbo.openPageId('item', item.id)} 
                                                className="btn btn-link text-success fs-5 fw-bold me-2" 
                                                title="Voir"
                                                disabled={isDeleting.has(item.id)}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button 
                                                onClick={() => deleteItem(item.id)} 
                                                className="btn btn-link text-danger fs-5 fw-bold" 
                                                title="Supprimer"
                                                disabled={isDeleting.has(item.id)}>
                                                {isDeleting.has(item.id) ? (
                                                    <span className="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <i className="fa-solid fa-trash"></i>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted mt-5">
                        <i className="fa-solid fa-inbox fa-3x mb-3"></i>
                        <p>No items to display.</p>
                        <button className="btn btn-primary" onClick={() => Fleetbo.openPage('insert')}>
                            Create first item
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <PageConfig navbar="visible" />
            <Tab1Header />
            <div className="p-3 position-relative" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab1;
