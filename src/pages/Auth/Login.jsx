import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import {  Link  } from 'react-router-dom';


const Login = () => {

    const navigate                            = useNavigate();
    const [isLoading, setIsLoading]           = useState(true); 
    const [loading, setLoading]               = useState(false); 
    const [loadingLeave, setLoadingLeave]     = useState(false); 
    const [appInfo, setAppInfo]               = useState(null);

    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);   
    
        try {
            Fleetbo.c0074(); 
        } catch (error) {
            console.error(`Erreur : ${error.message}`);
        } finally {
            setTimeout(() => setLoading(false), 1000); 
        }
    };

    const leaveApp = async () => { 
        setLoadingLeave(true);   

        try {
            Fleetbo.d0a13(); 
        } catch (error) {
            console.error(`Erreur : ${error.message}`);
        } finally {
            setTimeout(() => setLoadingLeave(false), 500); 
        }
    };

    useEffect(() => {
            const data = localStorage.getItem('AppInfo');
            setTimeout(() => {
                if (data) {
                    const parsedData = JSON.parse(data);

                    if (parsedData.logged === true) {
                        navigate('/tab1');
                    } else {
                        setAppInfo(parsedData);
                    }
                    setIsLoading(false);  
                } else {
                    setIsLoading(false); 
                }
            }, 100); 
    }, [appInfo, navigate]);

    return (
        <motion.div
                    transition={{ duration: 0.4 }}
                    className="form-container"
                >
                    <div className="">
                    {isLoading ? (
                        <></>
                        ) : appInfo ? (
                    <>
 
                        <div className="text-container">
                            <div className='row mt-4 pb-2'>
                                <h1 className='fw-bolder text-success fs-1'>Login </h1>
                                
                                <div className='pb-1' >
                                    <h3 className='fw-bolder'>{appInfo.appName}</h3>
                                    <p style={{ textAlign: "left" }}>{appInfo.description}</p>
                                </div>
                                <div className='mt-2' > 
                                    <button onClick={handleSubmit} className="go mt-2">
                                        {loading ? "Loading..." : "Go"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="pb-1">
                            <Link to="/register" className="btn-logout">
                                New account
                            </Link>
                        </div>
                        <br />
                        <div className="pb-2">
                            <button onClick={leaveApp} className="btn-leave">
                                <i className="fa-solid fa-power-off"></i> {loadingLeave ? "Leave..." : "Leave"}
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
    )
};

export default Login;
