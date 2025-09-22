import React, { useState } from 'react';
import Fleetbo from 'api/fleetbo';
import { useAuth } from 'context/AuthContext';
import { motion } from "framer-motion";
import logoF from 'assets/images/logoF.png';


const Login = () => {
    const [loadingLog, setLoadingLog]                      = useState(false); 
    const [loadingLeave, setLoadingLeave]                  = useState(false); 
    const {sessionData, isLoading: isAuthLoading, login }  = useAuth()

    const log = async () => {
        // Prevent multiple clicks while loading
        if (loadingLog) return;
        setLoadingLog(true);
        try {
            // A. Wait for the result from the native function
            const loginResult = await Fleetbo.log(); // Ensure Fleetbo.log() returns a promise
            // B. Update the global context with the login data
            login(loginResult);
            // C. Instruct the native side to orchestrate the navigation
            const lastActiveTab = localStorage.getItem('activeTab') || 'Tab1';
            Fleetbo.navigateToMainApp(lastActiveTab.toLowerCase());
        } catch (error) {
            console.error(`Login error: ${error.message}`);
        } finally {
            setLoadingLog(false);
        }
    };

    const leaveApp = async () => { 
        setLoadingLeave(true);   

        try {
            Fleetbo.leave(); 
        } catch (error) {
            console.error(`Erreur : ${error.message}`);
        } finally {
            setTimeout(() => setLoadingLeave(false), 500); 
        }
    };

    return (
        <motion.div
            transition={{ duration: 0.4 }}
            className="p-3 vh-100 d-flex align-items-center justify-content-center"
        >
            <div className="">
                {isAuthLoading ? (
                    <p>Loading session...</p> 
                ) : sessionData ? ( 
                    <>
                        <div className="p-3">
                            <div className='row pb-2'>
                                <img
                                    className='App-logo'
                                    style={{borderRadius: "12px"}}
                                    src={logoF}
                                    alt="logo"
                                />
                                <div className='mt-4' style={{ height: "100%" }}>
                                    <h3 className='fw-bolder text-success'>{sessionData.appName || "Welcome"}</h3>
                                    <p className='text-dark fs-6' >{sessionData.description || "Please log in to continue."}</p>
                                </div>
                                
                                <div className='mt-2' > 
                                    <button onClick={log} className="btn btn-success w-100 p-2 fs-5 mt-3" style={{ fontWeight: '550' }}>
                                        {loadingLog ? "Connexion..." : "Login"}
                                    </button>
                                </div>
                                <div className="pb-1">
                                    <button onClick={leaveApp} className="btn btn-link w-100 p-2 fs-6 text-secondary text-decoration-none mt-3" style={{ fontWeight: '550' }}>
                                        {loadingLeave ? "Leaving..." : "Leave"} 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        {/* Message if sessionData empty */}
                        <p>Application information could not be loaded.</p>
                    </div>
                )}
            </div>   
        </motion.div>
    )
};

export default Login;
