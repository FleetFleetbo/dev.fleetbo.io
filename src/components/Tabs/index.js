import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './MobileTabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const MobileTabs = () => {
  const location = useLocation(); // Utilisation de useLocation pour déterminer la route actuelle
  const [activeTab, setActiveTab] = useState(location.pathname); // Définit l'onglet actif sur la route actuelle

  return (
    <footer className="mobile-tabs">
      <Link 
        to="/tab1" 
        className={`tab ${activeTab === '/tab1' ? 'active' : '/tab1'}`}
        onClick={() => setActiveTab('/tab1')}
      >
        <FontAwesomeIcon size="lg" icon={faHouse} />
        <br />
        <span className='tab-indice'>Tab1</span>
      </Link>
     
      <Link 
        to="/tab2" 
        className={`tab ${activeTab === '/tab2' ? 'active' : ''}`}
        onClick={() => setActiveTab('/tab2')}
      >
        <FontAwesomeIcon size="lg" icon={faBell} />
        <br />
        <span className='tab-indice'>Tab2</span>
      </Link>

      <Link 
        to="/tab3" 
        className={`tab ${activeTab === '/tab3' ? 'active' : ''}`}
        onClick={() => setActiveTab('/tab3')}
      >
        <FontAwesomeIcon size="lg" icon={faUser} />
        <br />
        <span className='tab-indice'>Tab3</span>
      </Link>
    </footer>
  );
};

export default MobileTabs;
