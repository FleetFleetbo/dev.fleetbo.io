/**
 * === Fleetbo Developer Tutorial: A User Profile Page (Tab3.jsx) ===
 *
 * This component demonstrates another core feature of a real-world application:
 * fetching and displaying data for the *currently logged-in user*.
 *
 * Pay attention to `Fleetbo.getAuthUser()`. This single command hides a lot of complexity,
 * allowing you to build personalized user experiences with ease.
 *
 * --- How It Works ---
 * 1. Data Fetching (`fetchUserData`):
 * This component calls `await Fleetbo.getAuthUser()` on load. This special
 * function securely finds the logged-in user's ID and fetches their
 * corresponding document from the 'users' collection, all in one step.
 *
 * 2. Onboarding Flow (`userNotFound`):
 * If the user is authenticated but *doesn't* have a document in the 'users'
 * collection (i.e., they are a new user), the API returns `notFound: true`.
 * The code handles this by showing a "Create Profile" button, which is a
 * perfect example of a new user "onboarding" flow.
 *
 * 3. Data Display (`renderContent`):
 * The component handles all states: `isLoading`, `error`, `userNotFound`,
 * and the final success state where the `userData` is displayed.
 *
 * --- Your Customization ---
 * - This is the main "Account" or "Profile" tab for your app.
 * - You can add more fields to the `processedUserData` object.
 * - The "Create Profile" button navigates to `setuser`. You can change this
 * destination or build your own profile creation page.
 */

import React, { useEffect, useState, useCallback } from 'react';

import { fleetboDB } from 'config/fleetboConfig';
import Loader from 'components/common/Loader';
import avatarImage from 'assets/images/avatar.png';
import { useLoadingTimeout } from 'hooks/useLoadingTimeout';
import { formatFirestoreDate } from 'utils/FormatDate';
import PageConfig from 'components/common/PageConfig';
import { UserPlus } from 'lucide-react';

const Tab3Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Tab 3 </h2>
        </header>
    );
};

const Tab3 = () => {
    const [isLoading, setIsLoading]       = useState(true);
    const [userData, setUserData]         = useState(null);
    const [error, setError]               = useState(null);
    const [userNotFound, setUserNotFound] = useState(false); 
    const dbName                          = "users";

    useLoadingTimeout(isLoading, setIsLoading, setError);

    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setUserNotFound(false); 
        try {
            const response = await Fleetbo.getAuthUser(fleetboDB, dbName);

            if (response && response.success && response.data) {
                const actualUserData = response.data;
                
                const rawDate        = actualUserData.dateCreated || actualUserData.createdAt || actualUserData.date;
                const formattedDate  = formatFirestoreDate(rawDate);

                const processedUserData = {
                    username: actualUserData.username || actualUserData.name || "User",
                    phoneNumber: actualUserData.phoneNumber || actualUserData.phone || "Phone number not available",
                    dateCreated: formattedDate,
                };
                setUserData(processedUserData);
                
            } else if (response && response.notFound) {
                console.warn("User document not found");
                setUserNotFound(true);
            } else {
                console.warn("Unexpected response structure:", response);
                setError("Invalid data format received from the server.");
            }

        } catch (err) {
            if (err.message?.includes("non authentifié")) {
                setError("Session expired. Please log in again.");
            } else if (err.message?.includes("entreprise")) {
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

    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }

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
            <Tab3Header />
            <div className="position-relative d-flex align-items-center text-center" style={{ minHeight: 'calc(100vh - 63px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab3;
