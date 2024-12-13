import React, { useEffect, useState } from 'react';
import { Link  } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';


const AppLauncher = () => {

    const [isLoading, setIsLoading] = useState(true);
	const [loading, setLoading] = useState(false);

	const logOutAll = () => {
		if (window.Android) {
			setLoading(true);
			window.Android.LogOutAll(() => {
			  localStorage.clear();
			  setLoading(false);
			});
		} else {
			console.error('Android interface not found.');
		}
	};
	
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 500); 
    }, []);
	
	// Pendant le chargement, vous pouvez afficher un indicateur visuel de chargement ou simplement retourner null
	if (isLoading) {
      return <div><><div className="loader fs-3 fw-normal text-dark p-5">
		  <Spinner animation="grow" variant="warning" role="status">
			  <span className="visually-hidden text-light">Loading...</span>
		  </Spinner>
      </div></> </div>;
    }

    return (
        <div className='App'>
		    <nav className="navbar fixed-top">
				<div className='container'>
					<div className="navbar-left">
						<Link to="/">
						  <img src={`${process.env.PUBLIC_URL}/logo.png`} className="" alt="logo" /> 
						</Link>
					</div>
					<div className="navbar-right">
						<span className='fs-6 text-dark fw-bold'> Nouveau projet </span>
					</div>
				</div>
			</nav>
		    <div className='App-Container'>
				<h1> hello Word !</h1> 
				<button className='logout' onClick={logOutAll} >
					{loading ? 'Chargement...' : 'Se déconnecter'}
				</button>
			</div>
        </div>     
    )
};

export default AppLauncher;
