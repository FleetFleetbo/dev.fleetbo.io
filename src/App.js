import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Welcome from "./Components/Welcome";

import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

import Tab1 from "./Components/Tabs/Tab1";
import Tab2 from "./Components/Tabs/Tab2";
import Tab3 from "./Components/Tabs/Tab3";

import Insert from "./Components/Tabs/Pages/Insert";
import Item from "./Components/Tabs/Pages/Item";

import Navbar from "./Components/Config/Navbar";
import Not from './Components/Config/Not';

import './App.css';



function App() {

    useEffect(() => {
      localStorage.setItem("navbar",localStorage.getItem("navbarType"));
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

            <Route path="/" element={<Welcome isLoggedIn={isLoggedIn} />} />

            {/* Authentification */}
            <Route path="/register" element={<Register onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/login"    element={<Login onLogin={() => setIsLoggedIn(true)} />} />

            <Route path="/tab1" element={isLoggedIn ? <Tab1 /> : <Navigate to="/login" />} />
            <Route path="/tab2" element={isLoggedIn ? <Tab2 /> : <Navigate to="/login" />} />
            <Route path="/tab3" element={isLoggedIn ? <Tab3 /> : <Navigate to="/login" />} />

            {/* Pages */}
            <Route path="/insert" element={isLoggedIn ? <Insert /> : <Navigate to="/login" />} />
            <Route path="/item" element={isLoggedIn ? <Item /> : <Navigate to="/login" />} />
          
            
            {/* Error*/}
            <Route path="*" element={<Not />} />

            {/* Tabs */}
            <Route path="/navbar" element={ <Navbar /> } />
          </Routes>
        </Router>
    );
}

export default App;
