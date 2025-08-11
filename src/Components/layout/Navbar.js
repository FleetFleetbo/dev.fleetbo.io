import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Fleetbo from 'api/fleetbo';
import 'assets/css/Navbar.css';

const Navbar                        = () => {
    const [activeTab, setActiveTab] = useState("Tab1"); 
    const navbarType                = localStorage.getItem("navbar");

    // This function is called to set the active tab.
    window.activeTab = (tab) => {
        setActiveTab(tab);
    };

    const selectTab = (theView, e) => {
        if (e) { e.preventDefault(); }
        try {
            if (!theView) {
                console.error("theView invalide");
                return;
            }

            // Logic for determining the tab state and call type
            switch(theView) {
                case 'tab1':
                    setActiveTab("Tab1");
                    Fleetbo.openView(theView, false); // Web
                    break;
                case 'Home':
                    setActiveTab("Tab2");
                    Fleetbo.openView(theView, true); // Native
                    break;
                case 'tab3':
                    setActiveTab("Tab3");
                    Fleetbo.openView(theView, false); // Web
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
                <i className="fa-solid fa-mobile-screen"></i> 
            </Link>
            <Link onClick={(e) => selectTab('tab3', e)} className={`nav-link ${activeTab === "Tab3" ? "active" : ""}`}>
                <i className="fa-solid fa-user"></i>
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
