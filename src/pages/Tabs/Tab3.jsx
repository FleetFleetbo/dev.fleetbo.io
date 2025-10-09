/**
 * Welcome to Tab 3!
 *
 * This component demonstrates another core feature of a real-world application:
 * fetching and displaying data for the *currently logged-in user*.
 *
 * Pay attention to `Fleetbo.getAuthUser()`. This single command hides a lot of complexity,
 * allowing you to build personalized user experiences with ease.
 */

// --- The Essentials ---
import React, { useEffect, useState, useCallback } from 'react';

// --- The Fleetbo Magic  ---
import { fleetboDB } from 'config/fleetboConfig';
// --- Utilities & Assets ---
import Loader from 'components/common/Loader';
import avatarImage from 'assets/images/avatar.png';
import { useLoadingTimeout } from 'hooks/useLoadingTimeout';
import { formatFirestoreDate } from 'utils/FormatDate';
import PageConfig from 'components/common/PageConfig';
import { UserPlus} from 'lucide-react';


// --- Header Component ---
const Tab3Header = () => {
    return (
        <header className='navbar ps-3 pt-3'> <h2 className='fw-bolder'>Tab 3 (User)</h2> </header>
    );
};

// --- Main Component ---
const Tab3 = () => {
    // --- State Management ---
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    // A specific state for a specific user flow: when the user is logged in but has no profile document yet.
    const [userNotFound, setUserNotFound] = useState(false); 
    const dbName = "users";

    useLoadingTimeout(isLoading, setIsLoading, setError);

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setUserNotFound(false); 
        try {
            // 🚀 THE KEY FLEETBO CALL: This command is your shortcut to the current user's data.
            // Fleetbo handles getting the user's auth ID and fetching the corresponding document for you.
            const response = await Fleetbo.getAuthUser(fleetboDB, dbName);

            if (response && response.success && response.data) {
                const actualUserData = response.data;
                
                // --- Defensive Data Handling: A best practice ---
                // We handle multiple possible date fields and format them for display.
                const rawDate = actualUserData.dateCreated || actualUserData.createdAt || actualUserData.date;
                const formattedDate = formatFirestoreDate(rawDate);

                // We create a clean data object for the UI, with fallbacks to prevent crashes.
                const processedUserData = {
                    username: actualUserData.username || actualUserData.name || "User",
                    phoneNumber: actualUserData.phoneNumber || actualUserData.phone || "Phone number not available",
                    dateCreated: formattedDate,
                };
                setUserData(processedUserData);
                
            } else if (response && response.notFound) {
                // This is not an error, but a specific case: the user needs to create their profile.
                console.warn("User document not found");
                setUserNotFound(true);
            } else {
                console.warn("Unexpected response structure:", response);
                setError("Invalid data format received from the server.");
            }

        } catch (err) {
            // Here, we can handle specific errors returned from the native side.
            if (err.message?.includes("non authentifié")) { // Keyword for "unauthenticated"
                setError("Session expired. Please log in again.");
            } else if (err.message?.includes("entreprise")) { // Keyword for "company"
                setError("Company configuration missing.");
            } else {
                setError(err.message || "Error loading user data.");
            }
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    }, [dbName]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // This function decides what to show on the screen based on our state.
    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }

        // The "Create Profile" onboarding flow. This is a great user experience!
        if (userNotFound) {
            return (
                <div className="container text-center">
                    <UserPlus size={48}  color='green' />
                    <h4 className="fw-bold">Welcome!</h4>
                    <p className="text-muted">Your user profile is not yet complete. <br/> Please create it to continue.</p>
                    <button
                        onClick={() => Fleetbo.openPage('setuser')}
                        className="btn btn-success w-100 p-2 fs-5 mt-3"
                    >
                        Create Profile
                    </button>
                    <button
                        onClick={() => Fleetbo.logout()}
                        className="btn btn-outline-success w-100 p-2 fs-5 mt-4"
                    >
                        Logout
                    </button>
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={fetchUserData}
                    >
                        Retry
                    </button>
                </div>
            );
        }
        
        // The successful case: we display the user's profile.
        if (userData) {
            return (
                <div className="container">
                    <img
                        src={avatarImage}
                        alt="User avatar"
                        style={{ maxWidth: '150px', height: 'auto', borderRadius: '50%' }}
                    />
                    <h2 className="text-success fw-bolder mt-2">
                        {userData.username}
                    </h2>
                    <h6 className="text-secondary mt-2">
                        {userData.dateCreated ? `Since ${userData.dateCreated}` : "Date not available"}
                    </h6>
                    <button
                        onClick={() => Fleetbo.logout()}
                        className="btn btn-success w-100 p-2 fs-5 mt-4"
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
            <div className="position-relative d-flex align-items-center text-center" style={{ minHeight: 'calc(100vh - 63px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab3;
