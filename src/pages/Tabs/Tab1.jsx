/**
 * Welcome to your first Fleetbo component!
 *
 * This file (Tab1.js) is a complete, production-ready example
 * of a dynamic list (CRUD) that communicates with your Fleetbo backend.
 *
 * Notice how simple and readable the calls to the Fleetbo API are.
 * Our goal is to let you focus on React; we'll handle the rest.
 *
 * Have fun!
 * - The Fleetbo Team
 */

// --- The Essentials ---
import React, { useEffect, useState, useCallback } from 'react';

// --- The Fleetbo Magic ✨ ---
// This is the Fleetbo API that connects your React code to the native world and your backend.
// All the powerful functions (database, navigation, etc.) go through here.
import Fleetbo from 'api/fleetbo'; 

// --- Utilities & Configuration ---
import { useLoadingTimeout } from 'hooks/useLoadingTimeout';
import { fleetboDB } from 'config/fleetboConfig'; // Your database key (from .env)
import { handleGetToken } from 'utils/getToken';
import Loader from 'components/common/Loader'; 
import PageConfig from 'components/common/PageConfig';


// A simple header for this screen, with examples of Fleetbo navigation.
const Tab1Header = () => {
    return (
        <header className='navbar ps-3 pe-3 pt-3'>
            <h2 className='fw-bolder'>Tab 1 (React)</h2>
            <div className="navbar-right">
                {/* Navigation example: Fleetbo.openPage() opens another React page (WebView). */}
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
    // --- State Management: The 3 pillars of a robust interface ---
    const [isLoading, setIsLoading] = useState(true); // Is the UI currently loading?
    const [data, setData] = useState([]);             // Where we store the received data.
    const [error, setError] = useState("");           // To display a message in case of a problem.
    
    // Bonus state for a perfect UX during deletion (see "Optimistic UI" below).
    const [isDeleting, setIsDeleting] = useState(new Set()); 
    
    const collectionName = "items"; // The name of the collection we are targeting in the database.

    // This custom hook handles cases where loading might be infinite (e.g., network issues).
    useLoadingTimeout(isLoading, setIsLoading, setError);

    /**
     * This is where we fetch our data.
     * We use useCallback for performance optimization, a React best practice.
     */
    const fetchData = useCallback(async () => {
        setIsLoading(true); // First, we tell the UI that we are loading.
        setError("");

        try {
            // 🚀 THE KEY FLEETBO CALL: It's this simple to read an entire collection.
            // No `fetch`, no headers, no URL management. Just a clear command.
            // Security and authentication are handled for you.
            const parsedData = await Fleetbo.getDocsG(fleetboDB, collectionName);
            
            if (parsedData.success) {
                setData(parsedData.data || []); // We update our state with the received data.
            } else {
                setError(parsedData.message || "Error fetching data.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
            console.error("Error fetching data:", err);
        } finally {
            // Whatever happens (success or failure), we stop loading.
            setIsLoading(false);
        }
    }, []); 
    
    // We call fetchData() only once, when the component is mounted on the screen.
    useEffect(() => { fetchData(); }, [fetchData]);
    
    /**
     * Deletes an item.
     * This function uses a technique called "Optimistic UI".
     * It's a best practice for an ultra-responsive user experience.
     */
    const deleteItem = async (id) => {
        if (isDeleting.has(id)) return; // Prevents double-clicking
        
        // 1. We save the current state, in case the deletion fails.
        const originalData = [...data];
        setIsDeleting(prev => new Set(prev).add(id));

        // 2. ✨ IMMEDIATE UI UPDATE. The item disappears instantly for the user.
        setData(prevData => prevData.filter(item => item.id !== id));
        setError("");
        
        try {
            // 3. We send the delete command to the backend in the background.
            const result = await Fleetbo.delete(fleetboDB, collectionName, id);

            // If the backend returns an error, we "throw" it to be caught by the `catch` block.
            if (result && result.success === false) {
                throw new Error(result.message || "Deletion failed on the native side.");
            }
            console.log(`Item ${id} deleted successfully.`);
        } catch (err) {
            console.error("Error during deletion:", err);
            // 4. 🚑 FAILURE! We "rewind" the interface by restoring the original data.
            setError(`Deletion error: ${err.message}`);
            setData(originalData);
        } finally {
            // 5. We clean up the deleting state, whether the operation succeeded or failed.
            setIsDeleting(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    // This function handles the display based on the state (loading, error, or success).
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
                {/* ... (the rest of the JSX to display the list) ... */}
                {data.length > 0 ? (
                    data.map((item) => (
                        <div key={item.id} className='col-12'>
                            {/* ... (JSX for an item card) ... */}
                            <button 
                                onClick={() => Fleetbo.openPageId('item', item.id)}
                                // ...
                            >
                                <i className="fa-solid fa-eye"></i>
                            </button>
                            <button 
                                onClick={() => deleteItem(item.id)} 
                                // ...
                            >
                                {isDeleting.has(item.id) ? (
                                    <span className="spinner-border spinner-border-sm text-warning" role="status"></span>
                                ) : (
                                    <i className="fa-solid fa-trash"></i>
                                )}
                            </button>
                            {/* ... */}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted mt-5">
                        <p>No items to display.</p>
                        <button className="btn btn-primary" onClick={() => Fleetbo.openPage('insert')}>
                            Create the first item
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* This component configures the native navbar of the application. */}
            <PageConfig navbar="visible" />
            <Tab1Header />
            <div className="p-3 position-relative" style={{ minHeight: 'calc(100vh - 63px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab1;
