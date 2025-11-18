/**
 * === Fleetbo Developer Tutorial: The Secure Handoff (Login.jsx) ===
 *
 * This component acts as a secure "handoff" screen after a user
 * has successfully authenticated (e.g., Phone Auth).
 *
 * --- How It Works ---
 * 1. Purpose:
 * This page is not a traditional login form. It's a simple,
 * one-click step to securely initialize the React application's
 * connection.
 *
 * 2. The `handleSecureConnection` Function (Redirect):
 * When the user clicks "Activate Connection," this function:
 * a. Reads the user's *last active web tab* from localStorage (e.g., 'tab1' or 'tab3').
 * b. If no tab is found, it defaults to 'tab1'.
 * c. It calls the `Fleetbo.log(pageToLoad)` function.
 *
 * 3. The Fleetbo Side (`log` function):
 * The `Fleetbo.log` function receives the *page name*.
 * It updates the user's "logged" status in the database, sets the
 * user info, and forces the app redirection: `window.location.href = '/${pageToLoad}'`.
 *
 * 4. The `leaveApp` Function:
 * This is an "escape hatch" in case the user landed here
 * by mistake. It calls the `Fleetbo.leave()` function.
 *
 * 5. Customization:
 * This is just a template. You can replace this simple "Activate"
 * button with your own custom form (e.g., a "Create Profile"
 * form). After your form is successfully submitted,
 * just call `await Fleetbo.log(...)` (as done in `handleSecureConnection`)
 * to complete the login and trigger the Fleetbo redirection.
 */

import React, { useState } from 'react';
import { useAuth } from 'context/AuthContext';
import { motion } from "framer-motion";
import logo from 'assets/images/logo.png';
import 'assets/css/Login.css';
import PageConfig from 'components/common/PageConfig';

const DEFAULT_TAB = 'tab1'; 

const Login = () => {
    const [loadingLog, setLoadingLog] = useState(false);
    const [loadingLeave, setLoadingLeave] = useState(false); 
    const { sessionData, isLoading: isAuthLoading } = useAuth();

    const handleSecureConnection = async () => {
        if (loadingLog || loadingLeave) return;
        setLoadingLog(true);

        try {
            // 1. Find the last active tab ID, or default
            const lastActiveTabId = localStorage.getItem('activeTab') || DEFAULT_TAB;
            
            // 2. Call the *simplified* native log function
            await Fleetbo.log(lastActiveTabId.toLowerCase());
            
        } catch (error) {
            console.error(`Connection error: ${error.message}`);
            setLoadingLog(false);
            alert(`Connection failed: ${error.message}`);
        }
    };

    const leaveApp = async () => { 
        if (loadingLog || loadingLeave) return;
        setLoadingLeave(true);   

        try {
            Fleetbo.logout(); 
        } catch (error) {
            console.error(`Error: ${error.message}`);
            setLoadingLeave(false); 
        }
        
        setTimeout(() => setLoadingLeave(false), 1500); 
    };

    const renderContent = () => {
        if (isAuthLoading) {
            return (
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">.</span>
                    </div>
                </div>
            );
        }

        if (sessionData) {
            return (
                <>
                    <img
                        className='w-25 mb-3'
                        src={logo}
                        alt="logo"
                    />
                    <h3 className='fw-bolder text-dark mb-1'>
                        Welcome to {sessionData.appName || "Fleetbo"}
                    </h3>
                    <p className='text-muted fs-6 mb-4'>
                        You are authenticated.
                    </p>
                    
                    <button 
                        onClick={handleSecureConnection} 
                        className="btn p-2 fs-6 btn-success" 
                        disabled={loadingLog || loadingLeave}
                    >
                        {loadingLog ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Activating...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-shield-halved me-2"></i>
                                Activate Connection
                            </>
                        )}
                    </button>

                    <button 
                        onClick={leaveApp} 
                        className="btn btn-link text-secondary text-decoration-none mt-3" 
                        style={{ fontSize: '14px' }}
                        disabled={loadingLog || loadingLeave}
                    >
                        {loadingLeave ? "Disconnecting..." : "Wrong Account?"}
                    </button>

                    <p className="mt-4 text-muted" style={{ fontSize: '12px' }}>
                        Finalizing your secure app connection.
                    </p>
                </>
            );
        }

        return <p className="text-danger">Failed to load app data.</p>;
    };

    return (
        <>
            <PageConfig navbar="none" />  // None = No Navbar  & Show = Navbar
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="login-passerelle-container"
            >
                <div className="login-passerelle-box">
                    {renderContent()}
                </div>   
            </motion.div>
        </>
    );
};

export default Login;

