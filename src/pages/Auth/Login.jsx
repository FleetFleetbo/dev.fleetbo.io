import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const Login = () => {

    const navigate                  = useNavigate();
    const [isLoading, setIsLoading] = useState(true); 
    const [loading, setLoading]     = useState(false); 
    const [appInfo, setAppInfo]     = useState(null);

    
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
            }, 1000); 
    }, [appInfo, navigate]);

    const handleLeave = () => {
        localStorage.clear();
        Fleetbo.d0a13();
    };

    return (
        <motion.div
            transition={{ duration: 0.4 }}
            className="form-container"
        >
            <div className="container">
            {isLoading ? (
                    <div className=""> </div>
                ) : appInfo ? (
                    <>
 
                        <div className="text-container">
                            <div className='row mt-4'>
                                <h2 className='fw-bolder'>{appInfo.name}</h2>
                                <div style={{ height: "70px" }}>
                                    <p style={{ textAlign: "left" }}>{appInfo.description}</p>
                                </div>
                                <div > 
                                    <button onClick={handleSubmit} className="go">
                                        {loading ? "Loading..." : "Go"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="pb-2">
                            <button onClick={handleLeave} className="btn-logout mt-1 text-secondary">
                                <i className="fa-solid fa-power-off"></i> Leave
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
