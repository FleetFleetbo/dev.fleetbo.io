import React, { useEffect, useState } from 'react';
import Fleetbo from './../Tabs/helper/systemHelper';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const Login = () => {

    const navigate                  = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement de la page
    const [loading, setLoading]     = useState(false); // Pour gérer l'état de chargement des données
    const [appInfo, setAppInfo]     = useState(null); // État pour stocker les données``

    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true); 
    
        try {
            Fleetbo.c0074(); 
        } catch (error) {
            console.error(`Erreur : ${error.message}`); 
        } finally {
            setTimeout(() => setLoading(false), 1000); // Ajoute un petit délai pour un effet visuel fluide
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
                        navigate('/tab1');
                    } else {
                        setAppInfo(parsedData);
                    }
                    setIsLoading(false);  // Mettre à jour le statut de chargement
                } else {
                    setIsLoading(false);  // Pas de données, terminer le chargement
                }
            }, 1000); 
    }, [appInfo, navigate]);



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
                            {/*
                            <div className='row'>
                                <img
                                    src={`${process.env.PUBLIC_URL}/logo.png`}
                                    className="img-login mt-2" 
                                    alt="Logo"
                                />
                            </div>
                            */}
                            <div className='row mt-4'>
                                <h2 className='fw-bolder'>{appInfo.name}</h2>
                                <div style={{ height: "70px" }}>
                                    <p style={{ textAlign: "left" }}>{appInfo.description}</p>
                                </div>
                                <div > 
                                    <button onClick={handleSubmit} className="go">
                                        {loading ? "Chargement..." : "Go"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="pb-2">
                            <button onClick={() => { setTimeout(() => { Fleetbo.d0a13() }, 500)  }} className="btn-logout mt-1 text-secondary">
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

export default Login;
