import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Redirect from "./Components/Config/Redirect";
import Not from './Components/Config/Not';

import Login from "./Components/Auth/Login";
import Welcome from "./Components/Welcome";

import './App.css';

function App() {
  useEffect(() => {	
    if (!window.fleetbo) {  
        localStorage.clear(); 
        sessionStorage.clear(); 
        window.location.href = 'https://fleetbo.io';	
    } 
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Authentification */}
          <Route path="/login" element={<Login />} />
          <Route path="/redirect" element={<Redirect />} />

          <Route path="/welcome" element={<Welcome />} />
          
          {/* Page non trouvée */}
	  <Route path="*" element={<Not />} />
        </Routes>
      </Router>
    </AnimatePresence>  
  );
}

export default App;
