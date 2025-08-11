import React, { useEffect, useState } from 'react';
import Fleetbo from 'api/fleetbo';
import { fleetboDB } from 'config/fleetboConfig';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import "assets/css/form.css"


const Register = () => {

    const navigate                  = useNavigate();
    const [isLoading, setIsLoading] = useState(true); 
    const [loading, setLoading]     = useState(false); 
    const [appInfo, setAppInfo]     = useState(null); 
    const [formData, setFormData]   = useState({ username: "" });
    const  db                       = "users";
    

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
            }, 1000); 
    }, [appInfo, navigate]);


    return (
        <motion.div
            transition={{ duration: 0.4 }}
            className="form-container"
        >
            <div className="">
            {isLoading ? (
                        <div className=" "></div>
                ) : appInfo ? (
                    <>
 
                        <div className="text-container">
                            <div className='row mt-4'>
                                <h2 className='fw-bold'>Create an account</h2>
                                <div style={{ height: "70px" }}>
                                    <p style={{ textAlign: "left" }}>{appInfo.description}</p>
                                </div>
                                <form onSubmit={handleSubmit} >
                                    <div className='mb-3'>
                                        <label className='form-group label'>Username</label>
                                        <input 
                                            className='form-control input p-2' 
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
                        <div className="pb-2">
                            <button onClick={() => { setTimeout(() => { Fleetbo.toHome() }, 500)  }} className="btn-logout mt-2 text-secondary">
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

export default Register;
