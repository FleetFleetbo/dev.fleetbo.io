/**
 * Tab1.jsx — Standard Feed Page & Fleetbo Paradigm Masterpiece
 * * Fleetbo JS = Scripting, not coding.
 *   Your JS orchestrates. The Engine executes.
 * 
 * * Quick Reference:
 *   Fleetbo.getDocsG(db, col)          → Read all docs
 *   Fleetbo.delete(db, col, id)        → Delete a doc
 *   Fleetbo.exec('Module', 'action')   → Call a native module
 * 
 * * Need a native module (camera, form, scanner)?
 *   → Open Alex: npm run fleetbo alex
 *   → Describe WHAT + WHY: "A form with photo that saves to items"
 *   → Alex forges the native muscle. You plug it with one exec() call.
 * 
 * * COMMUNICATION PROTOCOL: 
 *   → One-Shot Mission : Fleetbo.exec('GuestCreator') -> The module opens, works, and terminates returning {success: true}.
 *   → The Neural Link  : Fleetbo.openView('GuestList', true, { emit: (action) => ... }) -> The module stays alive and talks to the JS Brain (Walkie-Talkie).
 **/
import React, { useEffect, useState, useCallback } from 'react';
import { fleetboDB, useLoadingTimeout, Loader, PageConfig } from '@fleetbo';

const Tab1 = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData]           = useState([]);
    const [error, setError]         = useState("");
    const collectionName            = "guests";

    useLoadingTimeout(isLoading, setIsLoading, setError);

    const fetchData = useCallback(async () => {
        setError("");
        try {
            const response = await Fleetbo.getDocsG(fleetboDB, collectionName);
            if (response.success) {
                setData(response.data || []);
                return response.data || [];
            } else {
                setError(response.message || "Error fetching data.");
                return [];
            }
        } catch (err) {
            setError(`Engine error: ${err.message}`);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const openNativeGuestList = () => {
        // 🛡️ The 2nd parameter of openView MUST be 'true' (boolean)
        Fleetbo.openView('GuestList', true, {
            emit: async (action, payload) => {
                // The JS Brain listens to the Metal's Walkie-Talkie
                if (action === 'OPEN_CREATOR') {
                    // Overlay the creator module
                    const result = await Fleetbo.exec('GuestCreator', 'open', { collection: 'guests' });
                    // If the user saved (and didn't cancel), refresh the data silently
                    if (result && result.success) { fetchData(); }
                }
            }
        });
    };

    useEffect(() => {
        let mounted = true;
        const load = async () => { 
            if (mounted) { openNativeGuestList(); }
        };
        load();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderContent = () => {
        if (isLoading) return <Loader />;

        if (error) {
            return (
                <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 h-100 p-4">
                    <div className="text-danger fw-bold mb-2">System Error</div>
                    <div className="text-muted small text-center">{error}</div>
                </div>
            );
        }

        // If data exists, the Engine renders the fleetbo module GuestList
        return null;
    };

    return (
        <>
            <PageConfig navbar="show" />
            <div className="d-flex flex-column bg-white" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
                {renderContent()}
            </div>
        </>
    );
};
export default Tab1;