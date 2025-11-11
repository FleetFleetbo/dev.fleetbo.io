/**
 * === Fleetbo Developer Tutorial: A Full CRUD Page (Tab1.jsx) ===
 *
 * This file is a complete, production-ready example of a dynamic list
 * with Create, Read, and Delete (CRUD) functionality. It communicates
 * securely with your Fleetbo backend.
 *
 * --- How It Works ---
 * 1. PageConfig:
 * The <PageConfig navbar="show" /> component at the bottom tells the
 * native shell how to render its UI. "visible" shows the bottom tab bar.
 * You can set this to navbar="none" for full-screen pages (like "Insert" or "Item").
 *
 * 2. Auth Check (`useEffect`):
 * This component first calls `await Fleetbo.isAuthenticated()` to ensure
 * the user is logged in *before* fetching any data. This is a critical
 * security best practice.
 *
 * 3. Data Fetching (`fetchData`):
 * It uses `await Fleetbo.getDocsG(...)` to securely read the entire
 * "items" collection from Firestore. No complex fetch or headers needed.
 *
 * 4. Optimistic UI (`deleteItem`):
 * When deleting, the UI updates *instantly* (removing the item from the list)
 * *before* waiting for the backend. If the backend fails, it "rewinds"
 * and adds the item back. This makes the app feel incredibly fast.
 *
 * --- Your Customization ---
 * - This is the main template for any "list" page in your app.
 * - You can customize the `collectionName` to fetch other data.
 * - You can customize the `renderContent` to change how your list looks.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useLoadingTimeout } from 'hooks/useLoadingTimeout';
import PageConfig from 'components/common/PageConfig';
import { fleetboDB } from 'config/fleetboConfig';
import Loader from 'components/common/Loader'; 
import { MessageCirclePlus, Inbox, Eye, Trash2, RefreshCcw } from 'lucide-react';

const Tab1Header = () => {
    return (
        <header className='navbar ps-3 pe-3 pt-3'>
            <h2 className='fw-bolder'>Home</h2>
            <div className="navbar-right">
                <button onClick={() => Fleetbo.openPage('insert')} className="btn-header text-success fs-5 ms-3 fw-bold" title="Add New Item">
                    <MessageCirclePlus />
                </button>
            </div>
        </header>
    );
};

const Tab1 = () => {
    const [isLoading, setIsLoading]             = useState(true);
    const [data, setData]                       = useState([]);          
    const [error, setError]                     = useState("");           
    const [isDeleting, setIsDeleting]           = useState(new Set()); 
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    
    const collectionName = "items";

    useLoadingTimeout(isLoading, setIsLoading, setError);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const parsedData = await Fleetbo.getDocsG(fleetboDB, collectionName);
            
            if (parsedData.success) {
                setData(parsedData.data || []);
            } else {
                setError(parsedData.message || "Error fetching data.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    }, []); 

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            setIsLoading(true);
            setError("");
            try {
                const authStatus = await Fleetbo.isAuthenticated();

                if (authStatus.success && authStatus.isLoggedIn) {
                    setIsAuthenticated(true);
                    fetchData();
                } else {
                    setIsAuthenticated(false);
                    setError("Access denied. Please log in.");
                    setIsLoading(false);
                }
            } catch (err) {
                setIsAuthenticated(false);
                setError(err.message || "Could not verify connection status.");
                setIsLoading(false);
                console.error("Authentication check failed:", err);
            }
        };

        checkAuthAndFetchData();
    }, [fetchData]);
    
    const deleteItem = async (id) => {
        if (isDeleting.has(id)) return;
        
        const originalData = [...data];
        setIsDeleting(prev => new Set(prev).add(id));

        setData(prevData => prevData.filter(item => item.id !== id));
        setError("");
        
        try {
            const result = await Fleetbo.delete(fleetboDB, collectionName, id);

            if (result && result.success === false) {
                throw new Error(result.message || "Deletion failed on the native side.");
            }
            console.log(`Item ${id} deleted successfully.`);
        } catch (err) {
            console.error("Error during deletion:", err);
            setError(`Deletion error: ${err.message}`);
            setData(originalData);
        } finally {
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

        if (!isAuthenticated) {
            return <div className="alert alert-warning">Waiting for connection verification...</div>
        }
        
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className='fw-bolder'>Items</h2>
                    <button className="btn btn-sm btn-outline-secondary d-flex align-items-center" onClick={fetchData} disabled={isLoading}>
                        <RefreshCcw size={16} className="me-2" />
                        Refresh
                    </button>
                </div>

                <div className="alert alert-success-subtle border border-success border-opacity-25 p-3 mb-4">
                    <h5 className="fw-bold text-success">Welcome to Your First Fleetbo App!</h5>
                    <p className="mb-0">
                        This is a fully functional demo showing how to Create, Read, and Delete items using the Fleetbo API.
                        Click the <MessageCirclePlus size={16} className="mx-1"/> icon in the header to add your first item.
                    </p>
                </div>
                
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className='col-12'>
                            <div className="card shadow-sm mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <h5 className="card-title text-success mb-1">{item.title || 'Untitled'}</h5>
                                            <p className="card-text float-start text-muted">{item.content || 'No content.'}</p>
                                        </div>
                                        <div className="d-flex align-items-center ms-3">
                                            <button 
                                                onClick={() => Fleetbo.openPageId('item', item.id)} 
                                                className="btn btn-link text-success fs-5 fw-bold me-2" 
                                                title="View"
                                                disabled={isDeleting.has(item.id)}>
                                                <Eye />
                                            </button>
                                            <button 
                                                onClick={() => deleteItem(item.id)} 
                                                className="btn btn-link text-danger fs-5 fw-bold" 
                                                title="Delete"
                                                disabled={isDeleting.has(item.id)}>
                                                {isDeleting.has(item.id) ? (
                                                    <span className="spinner-border spinner-border-sm text-warning" role="status" aria-hidden="true"></span>
                                                ) : (
                                                    <Trash2 />
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
                        <Inbox size={48} className="mb-3" />
                        <p>No items to display.</p>
                        <button className="btn btn-success ps-2 pe-2" onClick={() => Fleetbo.openPage('insert')}>
                            Create first item
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <PageConfig navbar="show" />
            <Tab1Header />
            <div className="p-3 position-relative" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab1;
