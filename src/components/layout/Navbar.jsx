import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fleetbo from 'api/fleetbo';
import 'assets/css/Navbar.css';

// 1. On définit la configuration de la navbar dans un tableau.
// C'est plus facile à lire et à faire évoluer.
const navItems = [
  { id: 'Tab1', view: 'tab1', isNative: false, icon: 'fa-solid fa-house' },
  { id: 'Tab2', view: 'Home', isNative: true, icon: 'fa-solid fa-crown' },
  { id: 'Tab3', view: 'tab3', isNative: false, icon: 'fa-solid fa-user' },
];

const Navbar = () => {
  // On initialise l'état avec la valeur sauvegardée, une seule fois.
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "Tab1");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const navbarType = localStorage.getItem("navbar");

  // Effet pour sauvegarder l'onglet actif à chaque changement.
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // 2. La fonction de navigation est maintenant beaucoup plus simple.
  const handleSelectTab = (item) => {
    // On évite les clics multiples ou sur l'onglet déjà actif.
    if (isTransitioning || activeTab === item.id) return;

    setIsTransitioning(true);
    setActiveTab(item.id);
    
    // Appel unifié à la couche native.
    Fleetbo.openView(item.view, item.isNative);
    
    // On réactive les clics après une courte durée pour laisser le temps à la transition de se faire.
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className={navbarType === "header" ? "header" : "footer"}>
      {/* 3. On génère dynamiquement les liens à partir du tableau de configuration. */}
      {navItems.map(item => (
        <Link 
          key={item.id}
          onClick={() => handleSelectTab(item)}
          // La classe 'disabled' est plus sémantique pour l'état de transition.
          className={`nav-link ${activeTab === item.id ? "active" : ""} ${isTransitioning ? "disabled" : ""}`}
        >
          <i className={item.icon}></i>
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
