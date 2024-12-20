import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';


const Register = () => {

    const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement de la page
	const [loading, setLoading]     = useState(false); // Pour gérer l'état de chargement des données
	const [appInfo, setAppInfo]     = useState(null); // État pour stocker les données
    const [password, setPassword]   = useState('');
	

    const handleSubmit = async (e)  => {
		e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
		setLoading(true);    // Active le chargement

		try {
			// Vérifier si l'interface Android est disponible
			if (window.Android && typeof window.Android.r0014 === 'function') {
				window.Android.r0014(password);
				setPassword(''); // Réinitialise le champ de titre après la soumission
			} else {
				navigate('/un');
				localStorage.clear();
				setLoading(false);
			}
		} catch (error) {
			// En cas d'erreur, affiche le message d'erreur
			console.log(`Erreur : ${error.message}`);
		} finally {
			// Désactive le chargement après la soumission
			setLoading(false);
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
		}, 700); 
    }, [appInfo, navigate]);


    // Pendant le chargement, afficher un spinner
    if (isLoading) {
        return (
            <div>
                <div className="loader fs-3 fw-normal text-dark">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden text-light">Loading...</span>
                    </Spinner>
                </div>
            </div>
        );
    }	

    return (
        <div className='App'>
		    
            <div className='App-Container container'>
			    {appInfo ? (
                    <div className='p-4 text-center'>
                        <br />
                        <img src={`${process.env.PUBLIC_URL}/logo.png`} className='rounded-circle bg-light' width="100px"        alt="Logo" />
                        <br />
                        <h3 className='text-dark fw-bold mt-2'>{appInfo.name}</h3>
                        <p className='text-secondary'>{appInfo.description}</p>
						<br />
						<form onSubmit={handleSubmit}> 
							<div className="mb-3" >
							    <label>Register</label>
								<input type="password" className="form-control fs-5 p-2" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" style={{ width: '100%' }} />
							</div>
							<div className="pb-2 mt-3" >
								<button className='go'  style={{ width: '100%' }} >
									{loading ? 'Chargement...' : 'S\'inscrire'}
								</button>
							</div>
						</form>
                    </div>
                ) : (
                    <h3 className="text-danger">Erreur: Informations de l'application non disponibles</h3>
                )}
            </div>
        </div>
    )
};

export default Register;
