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
 * 1. PageConfig:
 * The <PageConfig navbar="show" /> component at the bottom tells the
 * native shell how to render its UI. "visible" shows the bottom tab bar.
 * You can set this to navbar="none" for full-screen pages (like "Insert" or "Item").
 *
 * 2. Data Fetching (`fetchUserData`):
 * This component calls `await Fleetbo.getAuthUser()` on load. This special
 * function securely finds the logged-in user's ID and fetches their
 * corresponding document from the 'users' collection, all in one step.
 *
 * 3. Onboarding Flow (`userNotFound`):
 * If the user is authenticated but *doesn't* have a document in the 'users'
 * collection (i.e., they are a new user), the API returns `notFound: true`.
 * The code handles this by showing a "Create Profile" button, which is a
 * perfect example of a new user "onboarding" flow.
 *
 * 4. Data Display (`renderContent`):
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
import PageConfig from 'components/common/PageConfig';
import Loader from 'components/common/Loader';
import avatarImage from 'assets/images/avatar.png';
import { useLoadingTimeout } from 'hooks/useLoadingTimeout';
import { formatFirestoreDate } from 'utils/FormatDate';
import { UserPlus, LogOut } from 'lucide-react';

const Tab3Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Profile </h2>
        </header>
    );
};

const Tab3 = () => {
    const [isLoading, setIsLoading]       = useState(true);
    const [userData, setUserData]         = useState(null);
    const [error, setError]               = useState(null);
    const [isNotFound, setIsNotFound]     = useState(false); 
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dbName                          = "users";
    
    // keep
    useLoadingTimeout(isLoading, setIsLoading, setError);

    // 2. Fetch 
    const fetchUserData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsNotFound(false);

        try {
            const response = await Fleetbo.getAuthUser(fleetboDB, dbName);
            if (response.success && response.data) {
                const data = response.data;
                setUserData({
                    username: data.username || data.name || "User",
                    phoneNumber: data.phoneNumber || data.phone || "No Phone",
                    dateCreated: formatFirestoreDate(data.dateCreated || data.createdAt),
                });
            } else if (response.notFound) {
                setIsNotFound(true);
            } else {
                setError(response.message || "Error loading profile.");
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
            setError("Connection error.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleLogout = () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        Fleetbo.logout();
    };

    // 3. Button Component Logout réutilisable 
    const LogoutButton = () => (
        <button
            onClick={handleLogout}
            className="fb-button-logout mt-3 w-100" 
            disabled={isLoggingOut}
        >
            {isLoggingOut ? (
                <><i className="fas fa-spinner fa-spin me-2"></i> Logging out...</>
            ) : (
                <><LogOut size={18} className="me-2" /> Log Out</>
            )}
        </button>
    );

    const renderContent = () => {
        if (error) {
            return (
                <div className="alert alert-danger text-center">
                    <p>{error}</p>
                    <button className="btn btn-outline-danger btn-sm" onClick={fetchUserData}>Retry</button>
                    <div className="mt-3"><LogoutButton /></div> 
                </div>
            );
        }

        if (isNotFound) {
            return (
                <div className="container text-center mt-4">
                    <div className="mb-3 text-success opacity-75">
                        <UserPlus size={64} />
                    </div>
                    <h4 className="fw-bold text-dark">Welcome!</h4>
                    <p className="text-muted mb-4">
                        Your user profile is not yet complete.<br/>
                        Please create it to continue.
                    </p>
                    <button onClick={() => Fleetbo.openPage('setuser')} className="fb-button mb-2">
                        Create Profile
                    </button>
                    <LogoutButton />
                </div>
            );
        }

        if (userData) {
            return (
                <div className="container mt-4">
                    <div className="text-center mb-4">
                        <img
                            src={avatarImage}
                            alt="User avatar"
                            className="shadow-sm"
                            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <h2 className="text-success fw-bolder mt-3 mb-0">
                            {userData.username}
                        </h2>
                        <p className="text-muted small mt-1">
                            Member since {userData.dateCreated}
                        </p>
                    </div>
                    
                    {/* Section Infos (Example) */}
                    <div className="card shadow-sm mb-4 text-start">
                        <div className="card-body">
                            <small className="text-uppercase text-muted fw-bold" style={{fontSize: '11px'}}>Phone</small>
                            <div className="fs-6 fw-medium">{userData.phoneNumber}</div>
                        </div>
                    </div>

                    <LogoutButton />
                </div>
            );
        }
        return null; 
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <PageConfig navbar="show" />
            <Tab3Header />
            <div className="position-relative d-flex flex-column justify-content-center align-items-center text-center w-100" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab3;
