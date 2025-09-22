import React, { useEffect, useState, useCallback } from 'react';
import Fleetbo from 'api/fleetbo';
import { fleetboDB } from 'config/fleetboConfig';
import Loader from 'components/common/Loader';
import avatarImage from 'assets/images/avatar.png';
import { useLoadingTimeout } from 'hooks/useLoadingTimeout';
import { formatFirestoreDate } from 'utils/FormatDate';
import PageConfig from 'components/common/PageConfig';


// --- Header Component ---
const Tab3Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Tab 3</h2>
            <div className="navbar-right"> </div>
        </header>
    );
};

// --- Main Component ---
const Tab3 = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const dbName = "users";

    useLoadingTimeout(isLoading, setIsLoading, setError);

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await Fleetbo.getAuthUser(fleetboDB, dbName);

            if (response && response.success && response.data) {
                const actualUserData = response.data;
                const rawDate = actualUserData.dateCreated || actualUserData.createdAt || actualUserData.date;
                
                const formattedDate = formatFirestoreDate(rawDate);

                const processedUserData = {
                    username: actualUserData.username || actualUserData.name || "User",
                    phoneNumber: actualUserData.phoneNumber || actualUserData.phone || "Phone number not available",
                    dateCreated: formattedDate,
                };
                setUserData(processedUserData);
                
            } else if (response && response.notFound) {
                console.warn("User document not found");
                setError("User document not found. Please contact an administrator.");
            } else {
                console.warn("Unexpected response structure:", response);
                setError("Invalid data format received from the server.");
            }

        } catch (err) {
            if (err.message?.includes("non authentifié")) { // Keeping keyword for logic
                setError("Session expired. Please log in again.");
            } else if (err.message?.includes("entreprise")) { // Keeping keyword for logic
                setError("Company configuration missing.");
            } else {
                setError(err.message || "Error loading user data.");
            }
            setUserData(null);
        } finally {
            console.log("=== END fetchUserData ===");
            setIsLoading(false);
        }
    }, [dbName]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // The rendering logic (renderContent) remains exactly the same
    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        
        if (error) {
            return (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={fetchUserData}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Retry"}
                    </button>
                </div>
            );
        }
        
        if (userData) {
            return (
                <div className="container">
                    <img
                        src={avatarImage}
                        alt="User avatar"
                        style={{ maxWidth: '150px', height: 'auto' }}
                    />
                    <h2 className="text-success fw-bolder mt-2">
                        {userData.username}
                    </h2>
                    <h5 className="text-dark fw-normal">
                        {userData.phoneNumber} 
                    </h5>
                    <h6 className="text-secondary mt-2">
                        {userData.dateCreated && 
                        typeof userData.dateCreated === 'string' && 
                        userData.dateCreated.trim().length > 0
                            ? `Member since ${userData.dateCreated}` 
                            : "⚠ No date available"
                        }
                    </h6>
                    <button
                        onClick={() => { Fleetbo.logout();  }}
                        className="btn btn-success w-100 p-2 fs-5 mt-3"
                        style={{ fontWeight: '550' }}
                    >
                        Logout
                    </button>
                </div>
            );
        }
        
        return (
            <div className="alert alert-info text-center">
                <p>No user data available.</p>
                <button 
                    className="btn btn-primary" 
                    onClick={fetchUserData}
                >
                    Refresh
                </button>
            </div>
        );
    };

    return (
        <>
            <PageConfig navbar="visible" />
            <Tab3Header />
            <div className="p-3 d-flex align-items-center justify-content-center text-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab3;

