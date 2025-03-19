
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Redirect from "./Components/Config/Redirect";
import Footer from "./Components/Config/Footer";
import Not from './Components/Config/Not';

import Login from "./Components/Auth/Login";
import Welcome from "./Components/Welcome";

import Tab1 from "./Components/Tabs/Tab1";
import Tab2 from "./Components/Tabs/Tab2";
import Tab3 from "./Components/Tabs/Tab3";

import './App.css';

function App() {


  useEffect(() => {

    if (window.fleetbo) {
      if(window.localStorage){
           // WARNING! use localStorage only for test mode
	    localStorage.setItem('appId', 'your appId');
	    localStorage.setItem('database', 'your databaseName');
      }
    }else {
      localStorage.clear(); 
      sessionStorage.clear(); 
      window.location.href = 'https://fleetbo.io';
      return; // Arrête l'exécution si redirection
    }
  
  }, []);
  
  

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
      <Router>
        <Routes>

          <Route path="/redirect" element={<Redirect isLoggedIn={isLoggedIn} />} />
          {/* Authentification */}
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/welcome" element={isLoggedIn ? <Welcome /> : <Navigate to="/login" />} />

          <Route path="/tab1" element={isLoggedIn ? <Tab1 /> : <Navigate to="/login" />} />
          <Route path="/tab2" element={isLoggedIn ? <Tab2 /> : <Navigate to="/login" />} />
          <Route path="/tab3" element={isLoggedIn ? <Tab3 /> : <Navigate to="/login" />} />
         
          
          {/* Page non trouvée */}
	        <Route path="*" element={<Not />} />
          {/* Page non trouvée */}
          <Route path="/footer" element={ <Footer /> } />
        </Routes>
      </Router>
  );
}

export default App;

