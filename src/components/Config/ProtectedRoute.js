import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';


    const ProtectedRoute = ({ children }) => {
		
		const [isLoading, setIsLoading] = useState(true);
		const [isLogged, setIsLogged] = useState(null);
		const navigate = useNavigate();
		
		useEffect(() => {
			window.checkAuthenticated = (status) => {
				setIsLogged(status);
				setIsLoading(false);
			};

			// Simuler une vérification d'authentification après un délai
			const checkAuthStatus = async () => {
				try {
				  const authStatus = await isAuthenticated();
				  window.checkAuthenticated(authStatus);
				} catch (error) {
				  console.error('Error during authentication check:', error);
				  window.checkAuthenticated(false);
				}
			};

			if (isLogged === 'none') {
				setTimeout(() => {
				  navigate('/un');
				  setIsLoading(false);
				}, 2000); // Délai de 2 secondes avant la navigation
				return;
			}

			if (isLogged === 'false') {
				setTimeout(() => {
				  navigate('/auth');
				  setIsLoading(false);
				}, 2000); // Délai de 2 secondes avant la navigation
				return;
			}

			// Attente de 2 secondes avant de vérifier l'authentification
			setTimeout(() => {
				checkAuthStatus();
			}, 2000); // Délai de 2 secondes avant de vérifier l'authentification

			// Cleanup function pour supprimer la fonction globale lorsque le composant se démonte
			return () => {
				delete window.checkAuthenticated;
			};
		}, [isLogged, navigate]);


		useEffect(() => {
			if (isLogged === 'none') {
			  navigate('/un'); 
			  setIsLoading(false);
			  return; 
			}
			if (isLogged === 'false') {
			  navigate('/auth'); 
			  setIsLoading(false);
			  return;
			}
		}, [isLogged, navigate]);
		

		const isAuthenticated = () => {
			return new Promise((resolve, reject) => {
			  if (typeof window.Android !== 'undefined' && typeof window.Android.isAuthenticated === 'function') {
				window.Android.isAuthenticated(); 
				resolve(true);
			  } else {
				reject(false);
			  }
			});
		};

		if (isLoading) {
			return (
			  <div className="loader fs-3 fw-normal text-dark">
				<Spinner animation="border" variant="success" role="status">
				  <span className="visually-hidden text-light">Loading...</span>
				</Spinner>
			  </div>
			);
		}

		return children; 
	};

export default ProtectedRoute;
