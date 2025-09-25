import React, { useState } from 'react';
import Fleetbo from 'api/fleetbo';
import { fleetboDB } from 'config/fleetboConfig';
import { motion } from "framer-motion";
import { useAuth } from 'context/AuthContext';
import PageConfig from 'components/common/PageConfig';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [loadingLog, setLoadingLog]         = useState(false); 
    const [loadingLeave, setLoadingLeave]     = useState(false); 
    const [formData, setFormData]             = useState({ username: "" });
    const  db                                 = "users";
    const navigate                            = useNavigate();

    const {sessionData, isLoading: isAuthLoading, }                      = useAuth();
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const register = async (e) => {
        e.preventDefault();
        if (loadingLog) return;
    
        setLoadingLog(true);
        try {
            // We WAIT (await) for the result from the native function
            const result = await Fleetbo.addWithUserId(fleetboDB, db, JSON.stringify(formData));
    
            // We only navigate IF the insertion was successful
            // (result.success comes from the response you send from Kotlin)
            if (result && result.success) {
                const destinationTab = 'Tab1';
    
                // 1. Update localStorage BEFORE dispatching the event
                localStorage.setItem('activeTab', destinationTab);
    
                // Force a re-render of all components that use activeTab
                window.dispatchEvent(new CustomEvent('storage', {
                    detail: { key: 'activeTab', newValue: destinationTab }
                }));
                
                // React Router navigation
                navigate('/tab1');
            } else {
                // Handle the case where the insertion failed silently
                console.error("Registration failed on the native side.");
            }
        } catch (error) {
            // Handle errors if the promise is rejected
            console.error(`Register error: ${error.message}`);
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
        <>
            <PageConfig navbar="hidden" />
            <motion.div
                transition={{ duration: 0.4 }}
                className="p-3 vh-100 d-flex align-items-center justify-content-center"
            >
                <div className="">
                {isAuthLoading ? (
                        <></>
                    ) : sessionData ? (
                        <>
                            <div className="text-container">
                                <div className='row mt-4'>
                                    <div style={{ height: "100px" }}>
                                        <h2 className='fw-bold mb-3'>New Account </h2>
                                        <h5 style={{ textAlign: "left" }}>{sessionData?.appName || "Welcome"}</h5>
                                        <p style={{ textAlign: "left" }}>{sessionData?.description || "Welcome"}</p>
                                    </div>
                                    <form className='mt-3' onSubmit={register} >
                                        <div className='mb-3'>
                                            <label className='form-group label'>Username</label>
                                            <input 
                                                className='form-control mt-2 p-2' 
                                                name="username" type="text" 
                                                value={formData.username} onChange={handleChange} 
                                                placeholder='' required />
                                        </div>
                                        <div> 
                                            <button type="submit" className="btn btn-success w-100 p-2 fs-5" style={{ fontWeight: '550' }}>
                                                {loadingLog ? "Loading..." : "Create"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="pb-1">
                                <button onClick={leaveApp} className="btn btn-link w-100 p-2 fs-6 text-secondary text-decoration-none mt-3" style={{ fontWeight: '550' }}>
                                    {loadingLeave ? "Leaving..." : "Leave"} 
                                </button>
                            </div>
                        </>
                    ) : (
                        <div>
                            <p>Information not available</p>
                        </div>
                    )}
                </div>   
            </motion.div>
        </>
    )
};

export default Register;
