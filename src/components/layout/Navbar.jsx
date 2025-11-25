import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import 'assets/css/Navbar.css';

const navItems = [
  { id: 'Tab1', view: 'tab1', isNative: false, icon: 'fa-solid fa-house' },
  { id: 'Tab2', view: 'tab2', isNative: false, icon: 'fa-solid fa-crown' }, 
  { id: 'Tab3', view: 'tab3', isNative: false, icon: 'fa-solid fa-user' },
];

const Navbar = () => {
  const location = useLocation();

  // --- 1. DÉTECTION INTELLIGENTE DU TYPE (Header vs Footer) ---
  const getNavbarType = () => {
    // A. Priorité au paramètre URL (Injecté par le Simulateur)
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'header') return 'header';
    if (params.get('type') === 'footer') return 'footer';

    // B. Sinon, localStorage (Persistance)
    const savedType = localStorage.getItem("navbar");
    if (savedType) return savedType;

    // C. Défaut
    return 'footer';
  };

  const [navbarType, setNavbarType] = useState(getNavbarType);

  // --- 2. GESTION DES ONGLETS ACTIFS ---
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

  // --- 3. ÉCOUTEURS D'ÉVÉNEMENTS (Communication avec Index.jsx) ---
  useEffect(() => {
    const handleMessage = (event) => {
        // Sécurité : On ignore les messages vides
        if (!event.data) return;

        const { type, route, navbarMode } = event.data;

        // Mise à jour de la route active
        if (type === 'SET_ACTIVE_ROUTE') {
            const matchedTab = navItems.find(item => !item.isNative && route.includes(`/${item.view}`));
            if (matchedTab) setActiveTab(matchedTab.id);
        }

        // Mise à jour du TYPE (Header/Footer) via message
        if (type === 'SET_NAVBAR_TYPE') {
            setNavbarType(navbarMode);
            localStorage.setItem("navbar", navbarMode);
        }
    };

    window.addEventListener('message', handleMessage);
    
    // Au montage, on signale qu'on est prêt (pour le Hot Reload)
    if (window.top !== window.self) {
        window.top.postMessage({ type: 'FLEETBO_REQUEST_ENGINE' }, '*');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Synchronisation avec l'URL locale (si on navigue dans l'app elle-même)
  useEffect(() => {
    const currentTab = navItems.find(item => !item.isNative && location.pathname.includes(item.view));
    if (currentTab) {
      setActiveTab(currentTab.id);
      localStorage.setItem("activeTab", currentTab.id);
    }
  }, [location]);

  const handleSelectTab = (item) => {
    setActiveTab(item.id);
    // Si l'objet Fleetbo est injecté, on l'utilise
    if (window.Fleetbo) {
        window.Fleetbo.openView(item.view, item.isNative);
    } else {
        console.warn("Fleetbo bridge not found");
    }
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
