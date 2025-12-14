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
import { MessageCirclePlus, ImageIcon, Inbox, Eye, Trash2, RefreshCcw } from 'lucide-react';

const Tab1Header = () => {
    return (
        <header className='navbar ps-3 pe-3 pt-3 bg-white sticky-top border-bottom' style={{ zIndex: 1020, top: 0, height: '70px' }}>
            <h2 className='fw-bolder fb-name text-dark mb-0'>Feed</h2>
            <div className="navbar-right">
                <button onClick={() => Fleetbo.openPage('insert')} className="btn-header text-success fs-5 fw-bold" title="Add New Item">
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
            if (response.success) { 
                // Tri par date (récent en haut)
                const sortedData = (response.data || []).sort((a, b) => {
                    const dateA = a.dateCreated ? new Date(a.dateCreated) : new Date(0);
                    const dateB = b.dateCreated ? new Date(b.dateCreated) : new Date(0);
                    return dateB - dateA;
                });
                setData(sortedData); 
            } else { setError(response.message || "Error fetching data."); }
        } catch (err) {
            console.error("--> [FLEETBO_DEBUG] Native error: ", err);
            setError(`Native Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, []);  

    useEffect(() => {
        let isMounted = true; 
        const load = async () => { if (!isMounted) return;  await fetchData(); };
        load();
        return () => { isMounted = false; };
    }, [fetchData]);
    
    const deleteItem = async (id) => {
        if (isDeleting.has(id) || !id) return;
        setIsDeleting(prev => new Set(prev).add(id));
        try {
            const result = await Fleetbo.delete(fleetboDB, collectionName, id);
            if (result && result.success) {
                setData(prevData => prevData.filter(item => item.id !== id));
            } else {  throw new Error(result.message || "Delete failed"); }
        } catch (err) {
            setError(`Deletion error: ${err.message}`);
        } finally {
            setIsDeleting(prev => { const newSet = new Set(prev);  newSet.delete(id); return newSet; });
        }
    };

    const renderContent = () => {
        
        if (error) {
            return (
                <div className="alert alert-danger d-flex justify-content-between align-items-center m-3" style={{ marginTop: '80px' }}>
                    <span>{error}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={fetchData}>Retry</button>
                </div>
            );
        }
        
        return (
            <div className="pb-1"> 
                
                <div 
                    className="d-flex justify-content-between align-items-center px-3 py-2 sticky-top shadow-sm"
                    style={{ top: '70px', zIndex: 1010, backgroundColor: '#fff', borderBottom: '1px solid #e9ecef' }}
                >
                    <span className='text-muted small fw-bold'>{data.length} Publications</span>
                    <button className="btn-header text-success text-decoration-none p-0 d-flex align-items-center" onClick={fetchData} disabled={isLoading}>
                        <RefreshCcw size={14} className={`me-1 ${isLoading ? 'fa-spin' : ''}`} /> 
                        Refresh
                    </button>
                </div>

                <div className="ps-3 pe-3 pt-2 mt-3">
                    {data.length > 0 ? (
                        data.map((item) => {
                            return (
                                <div key={item.id} className='col-12 mb-3'>
                                    {/* CARD */}
                                    <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white">
                                        {item.image ? (
                                            <div 
                                                className="w-100 bg-light d-flex align-items-center justify-content-center" 
                                                style={{ height: '250px', overflow: 'hidden', cursor: 'pointer' }}
                                                onClick={() => Fleetbo.openPageId('item', item.id)}
                                            >
                                                <img 
                                                    src={item.image} 
                                                    alt={item.title} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = "https://via.placeholder.com/400x300?text=Error+Loading";
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-100 bg-light d-flex flex-column align-items-center justify-content-center text-muted" style={{ height: '100px' }}>
                                                <ImageIcon size={24} className="mb-1 opacity-50"/>
                                                <small style={{fontSize: '10px'}}>No image</small>
                                            </div>
                                        )}

                                        {/* CONTENT */}
                                        <div className="card-body px-3 pt-3 pb-1">
                                            <h6 className="mb-0 fw-bold text-dark">{item.title || 'Untitled Post'}</h6>
                                            <p className="card-text text-secondary text-truncate">
                                                {item.content || 'No description.'}
                                            </p>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="card-footer bg-white border-top-0 px-3 pt-1 pb-2 d-flex justify-content-between align-items-center">
                                            <button 
                                                onClick={() => Fleetbo.openPageId('item', item.id)} 
                                                className="btn btn-sm btn-light text-success fw-bold px-3 rounded-pill d-flex align-items-center"
                                            >
                                                <Eye size={16} className="me-2"/> Read
                                            </button>

                                            <button 
                                                onClick={() => deleteItem(item.id)} 
                                                className="btn-delete text-danger p-2" 
                                                disabled={isDeleting.has(item.id)}
                                            >
                                                {isDeleting.has(item.id) ? (
                                                    <span className="spinner-border spinner-border-sm text-danger" />
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-muted mt-5 pt-5">
                            <div className="mb-3 p-4 bg-white rounded-circle d-inline-block shadow-sm">
                                <Inbox size={48} className="text-success opacity-75" />
                            </div>
                            <h5 className="fw-bold text-dark">No publications yet</h5>
                            <p className="small mb-4">Start by adding your first item.</p>
                            <button className="btn btn-success rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={() => Fleetbo.openPage('quick')}>
                                <MessageCirclePlus size={18} className="me-2"/> Camera
                            </button>
                        </div>
                    )}
                </div>
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
            <div className="position-relative" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab1;
