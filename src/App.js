// App.js
import React, { useEffect } from 'react';
<<<<<<< HEAD
import { BrowserRouter as  Route, Routes  } from 'react-router-dom';
import Launch  from './components/Config/Redirect';
//import ProtectedRoute from './components/Config/ProtectedRoute';
=======
<<<<<<< HEAD
import { BrowserRouter as Route, Routes  } from 'react-router-dom';
import Launch  from './components/Config/Redirect';
=======
import { BrowserRouter as  Route, Routes  } from 'react-router-dom';
import Launch  from './components/Config/Redirect';
//import ProtectedRoute from './components/Config/ProtectedRoute';
>>>>>>> 3c9c7e7 (MAJ 13/01/2025)
>>>>>>> 6a1e78927fb5b735d45e6801231d4396d277dfeb
import PageNotFound from "./components/Config/PageNotFound";
import UnAuth from './components/Config/UnAuth';
import Login    from './components/Auth/login';
import Register from './components/Auth/register';
import Welcome  from './components/welcome';


import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
	
    useEffect(() => {	
	    if (!window.Android) {  
		    localStorage.clear(); 
			sessionStorage.clear(); 
<<<<<<< HEAD
			window.location.href = 'https://autre-nom-de-domaine';	
=======
<<<<<<< HEAD
			window.location.href = 'https://fleetbo.com';	
=======
			window.location.href = 'https://autre-nom-de-domaine';	
>>>>>>> 3c9c7e7 (MAJ 13/01/2025)
>>>>>>> 6a1e78927fb5b735d45e6801231d4396d277dfeb
		} 
	}, []);

    return (
		<div className="App">
		  <Routes>
			{/* Racine */}
			<Route path="/" element={<Launch />} />

			{/* Authentification */}
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/un" element={<UnAuth />} />
			
			{/* Home */}
            <Route path="/welcome" element={<Welcome />} />
			
			{/* Page non trouvée */}
			<Route path="*" element={<PageNotFound />} />
		  </Routes>
		</div>
    );
};

export default App;
