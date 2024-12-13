import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';


const ConfirmAuth = () => {

    const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement de la page
	const [loading, setLoading] = useState(false); // Pour gérer l'état de chargement des données


	const Login = () => {
		setLoading(true);
		if (window.Android) {
			window.Android.login();
			setTimeout(() => {
				setLoading(false);
			}, 500); 
			navigate('/app');
		} else {
			console.error('Android interface not found.');
		}
    };
	
	useEffect(() => {
        setTimeout(() => {
			const userId = localStorage.getItem('userId'); // Simulez la récupération de données stockées
			const loggedIn   = localStorage.getItem('logged'); // Simulez la récupération de données stockées
			if(userId & loggedIn){
				navigate('/app');
			}
			setIsLoading(false);
		}, 500); 
    }, [])
	
    // Pendant le chargement, vous pouvez afficher un indicateur visuel de chargement ou simplement retourner null
    if (isLoading) {
		return <div>
			<><div className="loader fs-3 fw-normal text-dark">
				<Spinner animation="grow" variant="success" role="status">
					<span className="visually-hidden text-light">Loading...</span>
				</Spinner>
			</div></> 
		</div>;
    }	

    return (
        <div className='App p-3'>
            <div className='App-Container'>
                <div className='p-3 text-center'>
                    <br />
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} className="logo" alt="Logo" />
					<br />
                    <h3 className='Brand text-dark'>Application Name </h3>
					<h5 className='desc'> Speciality </h5>
	                <p className='text-secondary'>Descripiton </p>
                    <button className='go' onClick={Login} > 
					   {loading ? 'Chargement...' : 'Se connecter'}
					</button>
                </div>
            </div>
        </div>
    )
};

export default ConfirmAuth;
