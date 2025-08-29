import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import logo from 'assets/images/logo.png';


const Login = () => {

    const navigate                            = useNavigate();
    const [isLoading, setIsLoading]           = useState(true); 
    const [loadingLog, setLoadingLog]         = useState(false); 
    const [loadingLeave, setLoadingLeave]     = useState(false); 
    const [appInfo, setAppInfo]               = useState(null);

    
    const log = async (e) => {
        try {
            setLoadingLog(true)
            Fleetbo.log(); 
        } catch (error) {
            console.log(`Erreur : ${error.message}`);
        } finally {
            setTimeout(() => setLoadingLog(false), 500); 
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
                                <img
                                    style={{ height: "95px", width:"110px"}}
                                    src={logo}
                                    alt="logo"
                                />
                                <div className='mt-3' style={{ height: "100%" }}>
                                    <h3 className='fw-bolder' style={{ color: "#b37605" }}>{appInfo.appName}</h3>
                                    <p style={{ textAlign: "left" }}>{appInfo.description}</p>
                                </div>
                                
                                <div className='mt-2' > 
                                    <button onClick={log} className="go mt-2">
                                        {loadingLog ? "Connexion..." : "Go"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="pb-1">
                            <button onClick={leaveApp} className="btn-leave">
                                <i className="fa-solid fa-power-off"></i> {loadingLeave ? "Leave..." : "Leave"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <p>Information not available 2</p>
                    </div>
                )}
            </div>   
        </motion.div>
    )
};

export default Login;
