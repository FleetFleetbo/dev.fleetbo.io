/**
 * === Fleetbo Developer Guide: The Standard List Page (Tab1.jsx) ===
 *
 * This file demonstrates the "Engine-First" architecture.
 * Your React component acts as a view layer for the Fleetbo Data Engine.
 *
 * --- Core Concepts ---
 * 1. Native UI Control (`<PageConfig />`):
 * Directives sent to the OS to control native elements.
 * - navbar="show": Instructs the Engine to render the native TabBar.
 * - navbar="none": Requests full immersive mode.
 *
 * 2. Direct Data Pipeline (`getDocsG`):
 * Instead of HTTP requests, we open a direct pipe to the Fleetbo Engine.
 * `await Fleetbo.getDocsG(...)` retrieves secure objects instantly from the core.
 *
 * 3. The "Zero-Latency" Pattern (Optimistic UI):
 * We update the UI instantly, then notify the Engine in the background.
 * 1. User taps Delete -> Item vanishes (Instant feedback).
 * 2. The Engine receives the delete order asynchronously.
 * 3. If the Engine reports a failure, the UI reverts automatically.
 *
 * --- Developer Note ---
 * You are abstracted from the backend logic. Focus purely on the UI state.
 * The Fleetbo Engine guarantees data integrity and security.
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
            <h2 className='fw-bolder fb-name'>Home</h2>
            <div className="navbar-right">
                <button onClick={() => Fleetbo.openPage('insert')} className="btn-header text-success fs-5 ms-3 fw-bold" title="Add New Item">
                    <MessageCirclePlus />
                </button>
            </div>
        </header>
    );
};

const Tab1 = () => {
    const [isLoading, setIsLoading]   = useState(true);
    const [data, setData]             = useState([]);          
    const [error, setError]           = useState("");           
    const [isDeleting, setIsDeleting] = useState(new Set()); 
    
    const collectionName              = "items";

    // Keep
    useLoadingTimeout(isLoading, setIsLoading, setError);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await Fleetbo.getDocsG(fleetboDB, collectionName);
            if (response.success) { setData(response.data || []); } else { setError(response.message || "Error fetching data."); }
        } catch (err) {
            setError("Network or server error.");
        } finally {
            setIsLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const deleteItem = async (id) => {
        if (isDeleting.has(id) || !id) return;

        setIsDeleting(prev => new Set(prev).add(id));
        try {
            const result = await Fleetbo.delete(fleetboDB, collectionName, id);
            
            if (result && result.success) {
                setData(prevData => prevData.filter(item => item.id !== id));
            } else {
                throw new Error(result.message || "Delete failed");
            }
        } catch (err) {
            setError(`Deletion error: ${err.message}`);
        } finally {
            setIsDeleting(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const renderContent = () => {
        
        if (error) {
            return (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={fetchData}>Retry</button>
                </div>
            );
        }
        
        return (
            <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className='fw-bolder'>Items</h2>
                    <button className="fb-button-refresh d-flex align-items-center" onClick={fetchData} disabled={isLoading}>
                        <RefreshCcw size={16} className={`me-2 ${isLoading ? 'fa-spin' : ''}`} /> 
                        Refresh
                    </button>
                </div>

                <div className="alert alert-success-subtle border border-success border-opacity-25 p-3 mb-4">
                    <h5 className="fw-bold text-success">Welcome Developer !</h5>
                    <p className="mb-0">
                        This is a fully functional demo showing how to Create, Read, and Delete items using the Fleetbo API.
                        Click the <MessageCirclePlus size={16} className="mx-1"/> icon in the header to add your first item.
                    </p>
                </div>
                
                
                {data.length > 0 ? (
                    data.map((item) => {

                        return (
                            <div key={item.id} className='col-12'>
                                <div className="card shadow-sm mb-3">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <h5 className="card-title text-success mb-1">
                                                    {item.title || 'Untitled'} 
                                                </h5>
                                                <p className="card-text float-start text-muted">
                                                    {item.content || 'No content.'}
                                                </p>
                                            </div>
                                            <div className="d-flex align-items-center ms-3">
                                                <button 
                                                    onClick={() => deleteItem(item.id)} 
                                                    className="btn btn-link text-danger fs-5 fw-bold" 
                                                    disabled={isDeleting.has(item.id)}>
                                                    {isDeleting.has(item.id) ? (
                                                        <span className="spinner-border spinner-border-sm text-warning" />
                                                    ) : (
                                                        <Trash2 />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-muted mt-3">
                        <Inbox size={48} className="mb-2" />
                        <p>No items to display.</p>
                        <button className="fb-button w-75 ps-2 pe-2" onClick={() => Fleetbo.openPage('insert')}>
                            Create first item
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (isLoading && data.length === 0) {
        return <Loader />;
    }

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
