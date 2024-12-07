// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

import Redirect  from './components/Config/Redirect';
import ProtectedRoute from './components/Config/ProtectedRoute';
import UnAuth from './components/Config/UnAuth';

import ConfirmAuth from './components/ConfirmAuth';
import AppLauncher from './components/AppLauncher';

import PageNotFound from "./components/Error/PageNotFound";
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

	  return (
		<Router>
		  <div className="App">
			<Routes>

			  {/* Redirection à partir de la racine */}
			  <Route path="/" element={<Redirect />} /> 

			  {/* Authentification publique */}
			  <Route path="/auth" element={<ConfirmAuth />} />
			  <Route path="/un" element={<UnAuth />} />
			  

			  {/* Routes protégées */}
			  
			    <Route 
					path="/app" 
					element={
					  <ProtectedRoute>
						<AppLauncher />
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
