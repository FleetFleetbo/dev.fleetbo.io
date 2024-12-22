// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Route, Routes  } from 'react-router-dom';
import Launch  from './components/Config/Redirect';
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
			window.location.href = 'https://fleetbo.com';	
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
