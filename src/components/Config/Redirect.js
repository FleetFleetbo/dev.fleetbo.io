import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';


const Redirect = () => {

    const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement
    const [loading, setLoading] = useState(false); // Pour gérer l'état de chargement des données
	

    useEffect(() => {
		const timer = setTimeout(() => {
		  const storedData = localStorage.getItem('userId'); // Simulez la récupération de données stockées
		  const loggedIn   = localStorage.getItem('logged'); // Simulez la récupération de données stockées
		  if (storedData) {
			if(loggedIn === 'true') {
			   navigate('/app'); 
			   setIsLoading(false);
			} else {
			   navigate('/auth');
			   setIsLoading(false); 
			}
		  } 
		}, 500); 
		return () => clearTimeout(timer);
	}, [navigate]); 


	// Pendant le chargement, vous pouvez afficher un indicateur visuel de chargement ou simplement retourner null
    if (isLoading) {
      return <div><><div className="loader fs-3 fw-normal text-dark">
		  <Spinner animation="border" variant="success" role="status">
			  <span className="visually-hidden text-light">Loading...</span>
		  </Spinner>
      </div></> </div>;
    }

    return (
        <div className='App'>
            <div className=''>
               
            </div>
        </div>
    )
};

export default Redirect;
