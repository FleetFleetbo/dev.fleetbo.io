import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'assets/css/Navbar.css';

const navItems = [
  { id: 'Tab1', view: 'tab1', isNative: false, icon: 'fa-solid fa-house' },
  { id: 'Tab2', view: 'Sample', isNative: true,  icon: 'fa-solid fa-crown' }, 
  { id: 'Tab3', view: 'tab3', isNative: false, icon: 'fa-solid fa-user' },
];

const Navbar = () => {
  const location = useLocation();

  const getNavbarType = () => {

    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'header') return 'header';
    if (params.get('type') === 'footer') return 'footer';

    const savedType = localStorage.getItem("navbar");
    if (savedType) return savedType;

    return 'footer';
  };

  const [navbarType, setNavbarType] = useState(getNavbarType);

  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const activeRoute = params.get('activeRoute');
    if (activeRoute) {
      const matchedTab = navItems.find(item => !item.isNative && activeRoute.includes(`/${item.view}`));
      if (matchedTab) return matchedTab.id;
    }
    const savedTab = localStorage.getItem("activeTab");
    return savedTab || 'Tab1';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    const handleMessage = (event) => {
        if (!event.data) return;

        const { type, route, navbarMode } = event.data;
        if (type === 'SET_ACTIVE_ROUTE') {
            const matchedTab = navItems.find(item => !item.isNative && route.includes(`/${item.view}`));
            if (matchedTab) setActiveTab(matchedTab.id);
        }
        if (type === 'SET_NAVBAR_TYPE') {
            setNavbarType(navbarMode);
            localStorage.setItem("navbar", navbarMode);
        }
    };
    window.addEventListener('message', handleMessage);
    if (window.top !== window.self) {  window.top.postMessage({ type: 'FLEETBO_REQUEST_ENGINE' }, '*'); }
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const currentTab = navItems.find(item => !item.isNative && location.pathname.includes(item.view));
    if (currentTab) { setActiveTab(currentTab.id); localStorage.setItem("activeTab", currentTab.id); }
  }, [location]);

  const handleSelectTab = (item) => {
    setActiveTab(item.id);
    if (window.Fleetbo) {  window.Fleetbo.openView(item.view, item.isNative); } else { console.warn("Fleetbo engine not found"); }
  };

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
