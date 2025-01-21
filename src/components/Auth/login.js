import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';


const Login = () => {

    const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true); // Pour gérer l'état de chargement de la page
	const [loading, setLoading]     = useState(false); // Pour gérer l'état de chargement des données
	const [appInfo, setAppInfo]     = useState(null); // État pour stocker les données
        const [password, setPassword]   = useState('');
	

	const connexion = async (e)  => {
		e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
		setLoading(true);    // Active le chargement

		try {
			// Vérifier si l'interface Android est disponible
			if (window.Android && typeof window.Android.r0023 === 'function') {
				window.Android.r0023();
			} else {
				navigate('/un');
				localStorage.clear();
				setLoading(false);
			}
		} catch (error) {
			// En cas d'erreur, affiche le message d'erreur
			//console.log(`Erreur : ${error.message}`);
		} finally {
			// Désactive le chargement après la soumission
			setLoading(false);
		}
    };

	
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


    // Pendant le chargement, afficher un spinner
    if (isLoading) {
        return (
            <div>
                <div className="loader fs-3 fw-normal text-dark">
                    <Spinner animation="border" variant="success" role="status">
                        <span className="visually-hidden text-light">Loading...</span>
                    </Spinner>
                </div>
            </div>
        );
    }	

    return (
        <div className='App'>
		    
            <div className='App-Container  container'>
			    {appInfo ? (
                    <div className='p-4 d-flex flex-column justify-content-center align-items-center text-center'>
                        <br />
						 <div className="d-flex justify-content-center align-items-center" 
						    style={{ width: '100px', height: '100px' }}>
							<img 
								src={`${process.env.PUBLIC_URL}/logo.png`} 
								className='rounded-circle bg-light' 
								alt="Logo" 
							/>
						</div>
						<div style={{height: '120px', width: '100%' }}>
							<h3 className='text-dark fw-bold mt-2'>{appInfo.name}</h3>
							<p className='text-secondary'>{appInfo.description}</p>
						</div>
						<form> 
							<div className="col-md-5 pb-2" >
								<button className='go' onClick={connexion} style={{ width: '100%' }} >
							    	{loading ? 'Chargement...' : 'Confirmer'} <i className="fa fa-arrow-right ms-1"></i>
								</button>
							</div>
						</form>
						<div className="pb-2 mt-2"  >
							<span className='fs-6 text-secondary fw-bold'  >
								Confirmez votre connexion
							</span>
						</div>
						<div className="pb-2 mt-2"  >
						     <button onClick={logout} className='btn-logout text-secondary '>  <i className="fa-solid fa-power-off"></i> Quitter</button>
						</div>Ò

                    </div>
                ) : (
                    <h3 className="text-danger">Erreur: Informations de l'application non disponibles</h3>
                )}
            </div>
        </div>
    )
};

export default Login;
