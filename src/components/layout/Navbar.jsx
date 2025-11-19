import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'assets/css/Navbar.css';

const navItems = [
  { id: 'Tab1', view: 'tab1', isNative: false, icon: 'fa-solid fa-house' },
  { id: 'Tab2', view: 'tab2', isNative: false,  icon: 'fa-solid fa-crown' }, // Example: { view: 'Home', isNative: true } loads a native component
  { id: 'Tab3', view: 'tab3', isNative: false, icon: 'fa-solid fa-user' },
];

const Navbar          = () => {
  const location      = useLocation();
  const getInitialTab = () => {
    // 1. Emulator
    const params = new URLSearchParams(window.location.search);
    const activeRoute = params.get('activeRoute');
    
    if (activeRoute) {
      const matchedTab = navItems.find(item => 
        !item.isNative && activeRoute.includes(`/${item.view}`)
      );
      if (matchedTab) {
        return matchedTab.id;
      }
    }
    
    // Native
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      return savedTab;
    }
    
    // 3. Default : Tab1
    return 'Tab1';
  };

    useEffect(() => {
        const handleMessage = (event) => {
            const { type, route } = event.data;
            if (type === 'SET_ACTIVE_ROUTE') {
                const matchedTab = navItems.find(item => 
                    !item.isNative && route.includes(`/${item.view}`)
                );

                if (matchedTab) {
                    setActiveTab(matchedTab.id);
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
        
    }, []);

  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const currentTab = navItems.find(item => !item.isNative && location.pathname.includes(item.view));
    if (currentTab) {
      setActiveTab(currentTab.id);
      localStorage.setItem("activeTab", currentTab.id);
    }
  }, [location]);

  const handleSelectTab = (item) => {
    setActiveTab(item.id); 
    Fleetbo.openView(item.view, item.isNative);
  };

  const navbarType = localStorage.getItem("navbar");

  return (
    <div className={navbarType === "header" ? "header" : "footer"}>
      {navItems.map(item => (
        <button 
          key={item.id}
          onClick={() => handleSelectTab(item)}
          className={`nav-link ${activeTab === item.id ? "active" : ""}`}
        >
          <i className={item.icon}></i>
        </button>
      ))}
    </div>
  );
};

export default Navbar;
