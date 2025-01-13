import React, { useEffect } from 'react';
import './../../index.css';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
=======
<<<<<<< HEAD
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> 3c9c7e7 (MAJ 13/01/2025)
>>>>>>> 6a1e78927fb5b735d45e6801231d4396d277dfeb

const Un = () => {
    useEffect(() => {	 
		    localStorage.clear(); 
			sessionStorage.clear(); 
<<<<<<< HEAD
			window.location.href = 'https://fleetbo.com';	
=======
<<<<<<< HEAD
			window.location.href = 'https://fleetbo.io';	
=======
			window.location.href = 'https://fleetbo.com';	
>>>>>>> 3c9c7e7 (MAJ 13/01/2025)
>>>>>>> 6a1e78927fb5b735d45e6801231d4396d277dfeb
	}, []);
	return (
        <div className='App'>
		    
            <div className='App-Container'>
                <div className=''>
				    <i className="fa-solid fa-xmark" style={{ fontSize: '50px'}}></i>
					<br />  <br />
				    <h2 className='text-danger  fw-bolder'>Not authorized </h2>
			    </div>
            </div>
        </div>
    )
};

export default Un;
