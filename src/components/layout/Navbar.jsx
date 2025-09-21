import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fleetbo from 'api/fleetbo';
import 'assets/css/Navbar.css';

// 1. Define the navbar configuration in an array.
const navItems = [
  { id: 'Tab1', view: 'tab1', isNative: false, icon: 'fa-solid fa-house' },
  { id: 'Tab2', view: 'tab2', isNative: false, icon: 'fa-solid fa-crown' }, // Example: { view: 'Home', isNative: true } loads a native component
  { id: 'Tab3', view: 'tab3', isNative: false, icon: 'fa-solid fa-user' },
];

const Navbar = () => {
  // Initialize the state with the saved value from localStorage, only once.
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "Tab1");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const navbarType = localStorage.getItem("navbar");

  // Effect to save the active tab to localStorage on each change.
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // 2. The navigation function is now much simpler.
  const handleSelectTab = (item) => {
    if (isTransitioning || activeTab === item.id) return;

    setIsTransitioning(true);
    setActiveTab(item.id);
    
    // Unified call to the native layer.
    Fleetbo.openView(item.view, item.isNative);
    
    // Re-enable clicks after a short delay to allow the transition to complete.
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className={navbarType === "header" ? "header" : "footer"}>
      {/* 3. Dynamically generate links from the configuration array. */}
      {navItems.map(item => (
        <Link 
          key={item.id}
          onClick={() => handleSelectTab(item)}
          // The 'disabled' class is more semantic for the transition state.
          className={`nav-link ${activeTab === item.id ? "active" : ""} ${isTransitioning ? "disabled" : ""}`}
        >
          <i className={item.icon}></i>
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
