import React, { useEffect, useState } from 'react';
import Fleetbo from 'systemHelper';
import { fleetboDB } from 'db';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import "../Config/css/form.css"


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
            console.error(`Error : ${error.message}`); //  Meilleure gestion des erreurs
        } finally {
            setTimeout(() => setLoading(false), 500); // Ajoute un petit délai pour un effet visuel fluide
        }
    };
    

    useEffect(() => {
            // Récupérer les données depuis localStorage dès que le composant est monté
            const data = localStorage.getItem('AppInfo');

            setTimeout(() => {
                if (data) {
                    // Parsez les données JSON récupérées
                    const parsedData = JSON.parse(data);
                 
                    // Vérifiez la valeur de 'logged' et mettez à jour l'état
                    if (parsedData.logged === true) {
                        navigate('/welcome');
                    } else {
                        setAppInfo(parsedData);
                    }
                    setIsLoading(false);  // Mettre à jour le statut de chargement
                } else {
                    setIsLoading(false);  // Pas de données, terminer le chargement
                }
            }, 500); 
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
                            <button onClick={() => { setTimeout(() => { Fleetbo.d0a13() }, 500)  }} className="btn-logout mt-2 text-secondary">
                                <i className="fa-solid fa-power-off"></i> Leave
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <p>Informations non disponibles</p>
                    </div>
                )}
            </div>   
        </motion.div>
    )
};

export default Register;
