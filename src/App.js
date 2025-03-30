import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

import Tab1 from "./Components/Tabs/Tab1";
import Tab2 from "./Components/Tabs/Tab2";
import Tab3 from "./Components/Tabs/Tab3";

import Insert from "./Components/Tabs/Pages/Insert";

import Footer from "./Components/Config/Footer";
import Not from './Components/Config/Not';

import './App.css';



function App() {


    useEffect(() => {
      
      if (window.fleetbo) {
        if(window.localStorage){ }
      }else {
        window.location.href = 'https://fleetbo.io';
        return; 
      }
    
    }, []);
  
  

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        <Router>
          <Routes>

            <Route path="/tab1" element={<Tab1 isLoggedIn={isLoggedIn} />} />

            {/* Authentification */}
            <Route path="/register" element={<Register onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/login"    element={<Login onLogin={() => setIsLoggedIn(true)} />} />

            <Route path="/tab1" element={isLoggedIn ? <Tab1 /> : <Navigate to="/login" />} />
            <Route path="/tab2" element={isLoggedIn ? <Tab2 /> : <Navigate to="/login" />} />
            <Route path="/tab3" element={isLoggedIn ? <Tab3 /> : <Navigate to="/login" />} />

            {/* Pages */}
            <Route path="/insert" element={isLoggedIn ? <Insert /> : <Navigate to="/login" />} />
          
            
            {/* Page non trouvée */}
            <Route path="*" element={<Not />} />

            {/* Tabs */}
            <Route path="/footer" element={ <Footer /> } />
          </Routes>
        </Router>
    );
}

export default App;
