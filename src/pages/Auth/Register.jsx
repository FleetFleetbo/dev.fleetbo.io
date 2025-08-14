import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo';
import { fleetboDB } from 'config/fleetboConfig';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import {  Link  } from 'react-router-dom';


const Register = () => {

    const navigate                            = useNavigate();
    const [isLoading, setIsLoading]           = useState(true); 
    const [loading, setLoading]               = useState(false); 
    const [loadingLeave, setLoadingLeave]     = useState(false); 
    const [appInfo, setAppInfo]               = useState(null);
    const [formData, setFormData]             = useState({ username: "" });
    const  db                                 = "users";
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            Fleetbo.s0075(fleetboDB, db, JSON.stringify(formData)); 
            setFormData({ username: "" });
        } catch (error) {
            console.error(`Error : ${error.message}`);
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
                        navigate('/welcome');
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
                            <div className='row mt-4'>
                                <div style={{ height: "100px" }}>
                                    <h2 className='fw-bold'>New Account</h2>
                                    <p style={{ textAlign: "left" }}>{appInfo.description}</p>
                                </div>
                                <form className='mt-1' onSubmit={handleSubmit} >
                                    <div className='mb-3'>
                                        <label className='form-group label'>Username</label>
                                        <input 
                                            className='form-control mt-2 p-2' 
                                            name="username" type="text" 
                                            value={formData.username} onChange={handleChange} 
                                            placeholder='' required />
                                    </div>
                                    <div > 
                                        <button type="submit" className="go">
                                            {loading ? "Loading..." : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <br />
                        <div className="pb-1">
                            <Link to="/login" className="btn-logout mt-1">
                                Login
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

export default Register;
