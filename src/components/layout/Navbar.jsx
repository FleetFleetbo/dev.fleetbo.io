import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fleetbo from 'api/fleetbo';
import 'assets/css/Navbar.css';

if (!window.currentActiveTab) {
  window.currentActiveTab = localStorage.getItem("activeTab") || "Tab1";
}

const Navbar = () => {
  const [activeTab, setActiveTab] = useState(window.currentActiveTab);
  
  const navbarType = localStorage.getItem("navbar");

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    window.currentActiveTab = activeTab;
  }, [activeTab]);

  useEffect(() => {
    window.activeTab = (tab) => {
      setActiveTab(tab);
      window.currentActiveTab = tab;
    };
    return () => {
      delete window.activeTab;
    };
  }, []); 

  const selectTab = (theView, e) => {
    if (e) { e.preventDefault(); }
    try {
      if (!theView) {
        console.error("theView invalide");
        return;
      }
        
      switch(theView) {
        case 'tab1':
          setActiveTab("Tab1");
          Fleetbo.openView(theView, false); // web
          break;
        case 'Home':
          setActiveTab("Tab2");
          Fleetbo.openView(theView, true); // native
          break;
        case 'tab3':
          setActiveTab("Tab3");
          Fleetbo.openView(theView, false); // web
          break;
        default:
          console.error(`Onglet inconnu: ${theView}`);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de l'onglet :", error);
    }
  };

  const navLinks = (
    <>
      <Link onClick={(e) => selectTab('tab1', e)} className={`nav-link ${activeTab === "Tab1" ? "active" : ""}`}>
        <i className="fa-solid fa-house"></i>
      </Link>
      <Link onClick={(e) => selectTab('Home', e)} className={`nav-link ${activeTab === "Tab2" ? "active" : ""}`}>
        <i className="fa-solid fa-crown"></i>
      </Link>
      <Link onClick={(e) => selectTab('tab3', e)} className={`nav-link ${activeTab === "Tab3" ? "active" : ""}`}>
        <i className="fa-solid fa-users"></i>
      </Link>
    </>
  );

  return (
    <div className={navbarType === "header" ? "header" : "footer"}>
      {navLinks}
    </div>
  );
};

export default Navbar;
