import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const Redirect = () => {

    const navigate = useNavigate();


    useEffect(() => {
            setTimeout(() => {
                const data = localStorage.getItem('AppInfo');
                if (data) {
                    const parsedData = JSON.parse(data);
        
                    if (parsedData.logged === true) {
                        navigate('/welcome');
                    } else {
                        navigate('/login');
                    }
                }
            }, 100); 
    }, [navigate]);


    return (
        <motion.div transition={{ duration: 0.4 }} > </motion.div>
    )
};

export default Redirect;

