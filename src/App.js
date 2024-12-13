// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

import Redirect  from './components/Config/Redirect';
import ProtectedRoute from './components/Config/ProtectedRoute';
import PageNotFound from "./components/Config/PageNotFound";
import UnAuth from './components/Config/UnAuth';

import Login from './components/login';
import Welcome from './components/welcome';


import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

	  return (
		<Router>
		  <div className="App">
			<Routes>

			  {/* Redirection à partir de la racine */}
			  <Route path="/" element={<Redirect />} /> 

			  {/* Authentification publique */}
			  <Route path="/auth" element={<Login />} />
			  <Route path="/un" element={<UnAuth />} />
			  

			  {/* Routes protégées */}
			  
			    <Route 
					path="/app" 
					element={
					  <ProtectedRoute>
						<Welcome />
					  </ProtectedRoute>
				} 
			    />

			  {/* Page non trouvée */}
			  <Route path="*" element={<PageNotFound />} />
			</Routes>
		  </div>
		</Router>
	  );

}

export default App;
