import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

    const ProtectedRoute = ({ children }) => {
		
		const [isLoading, setIsLoading] = useState(true);
		const [isLogged, setIsLogged] = useState(null);
		const navigate = useNavigate();

		window.checkAuthenticated = (status) => {
			setIsLogged(status);
		};

		useEffect(() => {
			const checkAuthStatus = async () => {
				await isAuthenticated(); 
					setTimeout(() => {
					setIsLoading(false);
				}, 500); 
			};

			checkAuthStatus();
		}, []);

		useEffect(() => {
			if (isLogged === 'none') {
			  navigate('/un'); 
			  alert('No such document initial!');
			  setIsLoading(false);
			  return; 
			}
			if (isLogged === 'false') {
			  console.log('Not logged!');
			  navigate('/auth'); 
			  alert('No such document initial!');
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
