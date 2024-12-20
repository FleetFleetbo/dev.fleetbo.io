import React, { useEffect, useState } from 'react';
import {  useNavigate  } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';


const Welcome = () => {

    const [isLoading, setIsLoading] = useState(true);
	const [appInfo, setAppInfo]     = useState(null);
	const navigate = useNavigate();


	const logout = () => {
		setIsLoading(true);
		setTimeout(() => {
			if (window.Android && typeof window.Android.o00011 === 'function') {
				window.Android.o00011(() => {
				  localStorage.clear();
				});
			} else {
				navigate('/un');
			}
		}, 1000);
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
		}, 1000); 
    }, [appInfo, navigate]);
	
	// Pendant le chargement, vous pouvez afficher un indicateur visuel de chargement ou simplement retourner null
	if (isLoading) {
      return <div><><div className="loader fs-4 fw-normal text-dark p-5">
		  <Spinner animation="border" variant="success" role="status">
			  <span className="visually-hidden text-light">Loading...</span>
		  </Spinner>
      </div></> </div>;
    }

    return (
        <div className='App'>
     
		    {appInfo ? (
				<>
					<nav className="navbar fixed-top pt-3">
						<div className='container'>
							<div className="d-flex">
								<h4 className='fw-bold' >{appInfo.name}</h4>
							</div>
							<div className="d-flex float-right">
								<button onClick={logout} className='logout'>
								    <i className="fa-solid fa-power-off"></i>
								</button>
							</div>
						</div>
					</nav>
					<div className='App-Container-Home'>
						<div className="text-center">
							<span className="text-dark fs-1 fw-bold"> Hello Word !</span> 
						</div>
					</div>
			    </>
            ) : (
			    <>
				    <div className='App-Container'>
						<div className="text-center">
							<h2 className="text-danger">Erreur: Informations de l'application non disponibles</h2>
						</div>
			        </div>
				</>
            )}	   
        </div>     
    )
};

export default Welcome;
