import React, {  useState } from 'react';
import { Link } from 'react-router-dom';
import Fleetbo from 'systemHelper';
import './css/Navbar.css';


const Navbar                                 = () => {

    const [activeTab, setActiveTab]          = useState();
    const navbarType                         = localStorage.getItem("navbarType");
    window.activeTab                         = (tab) => {  setActiveTab(tab); };


    const selectTab = async (theView, e) => {
        if (e) {
            e.preventDefault(); 
        }
        try {
            if (!theView) {
                console.error("tabId invalide");
                return;
            }
            switch(theView) {
                case 'tab1':
                    setActiveTab("Tab1");
                    Fleetbo.openView(theView, false);
                    break;
                case 'tab2':
                    setActiveTab("Tab2");
                    Fleetbo.openView(theView, false );
                    break;
                case 'tab3':
                    setActiveTab("Tab3");
                    Fleetbo.openView(theView, false);
                    break;
                default:
                    console.error(`Onglet inconnu: ${theView}`);
            }

        } catch (error) {
            console.error("Erreur lors de la sélection de l'onglet :", error);
        }
    };


    return (
        <>
            {navbarType === "header" ? (
                <div className="header">
                    <Link onClick={(e) => selectTab('Home', e)} className={`nav-link ${activeTab === "Tab1" ? "active" : ""}`}>
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <Link onClick={(e) => selectTab('tab2', e)} className={`nav-link ${activeTab === "Tab2" ? "active" : ""}`}>
                        <i className="fa-solid fa-bell"></i> 
                    </Link>
                    <Link onClick={(e) => selectTab('tab3', e)} className={`nav-link ${activeTab === "Tab3" ? "active" : ""}`}>
                        <i className="fa-solid fa-user"></i>
                    </Link>
                </div>
            ) : (
                <div className="footer">
                    <Link onClick={(e) => selectTab('tab1', e)} className={`nav-link ${activeTab === "Tab1" ? "active" : ""}`}>
                        <i className="fa-solid fa-house"></i> 
                    </Link>
                    <Link onClick={(e) => selectTab('tab2', e)} className={`nav-link ${activeTab === "Tab2" ? "active" : ""}`}>
                    <i className="fa-solid fa-bell"></i>  
                    </Link>
                    <Link onClick={(e) => selectTab('tab3', e)} className={`nav-link ${activeTab === "Tab3" ? "active" : ""}`}>
                        <i className="fa-solid fa-user"></i>
                    </Link>
                </div>
            )}
        </>
    );

};

export default Navbar;
