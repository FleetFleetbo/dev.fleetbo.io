import React, { useState } from 'react';
import Fleetbo from 'api/fleetbo';
import { useAuth } from 'context/AuthContext';
import { motion } from "framer-motion";
import logoF from 'assets/images/logoF.png';


const Login = () => {

    const [loadingLog, setLoadingLog]                      = useState(false); 
    const [loadingLeave, setLoadingLeave]                  = useState(false); 
    const { login, sessionData, isLoading: isAuthLoading } = useAuth()

    const log = async () => { 
        setLoadingLog(true);
        try {
            const loginResult = await Fleetbo.log();
            login(loginResult);
        } catch (error) {
            console.error(`Erreur de connexion: ${error.message}`);
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
            className="container"
        >
            <div className="App-center">
                {isAuthLoading ? (
                    <p>Loading session...</p> 
                ) : sessionData ? ( // Check sessionData 
                    <>
                        <div className="p-3">
                            <div className='row pb-2'>
                                <img
                                    style={{ height: "95px", width:"115px"}}
                                    src={logoF}
                                    alt="logo"
                                />
                                <div className='mt-4' style={{ height: "100%" }}>
                                    <h3 className='fw-bolder' style={{ color: "#0E904D" }}>{sessionData.appName || "Welcome"}</h3>
                                    <p style={{ textAlign: "left" }}>{sessionData.description || "Please log in to continue."}</p>
                                </div>
                                
                                <div className='mt-2' > 
                                    <button onClick={log} className="go mt-2">
                                        {loadingLog ? "Connexion..." : "Login"} <i className="fa-solid fa-arrow-right ms-1"></i> 
                                    </button>
                                </div>
                                <div className="pb-1">
                                    <button onClick={leaveApp} className="btn-leave">
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
