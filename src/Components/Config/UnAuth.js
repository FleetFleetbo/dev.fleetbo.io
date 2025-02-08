import React, { useEffect } from 'react';
import './../../index.css';

const Un = () => {
        useEffect(() => {	 
	    localStorage.clear(); 
	    sessionStorage.clear(); 
	    window.location.href = 'https://fleetbo.io';	
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
