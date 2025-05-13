import React, {  useState } from 'react';
import { Link } from 'react-router-dom';
import Fleetbo from 'systemHelper';
import './css/Navbar.css';


const Navbar                                 = () => {

    const [activeTab, setActiveTab]          = useState();
    const navbarType                         = localStorage.getItem("navbarType");

    window.activeTab                         = (tab) => {
        console.log("activeTab called with:", tab);
        setActiveTab(tab);
    };


    return (
        <>
            {navbarType === "header" ? (
                //You can choose depending on the navbarType value
                <div className="header">
                    <Link 
                        onClick={(e) => Fleetbo.selectTab('tab1', e, setActiveTab)} 
                        className={`nav-link ${activeTab === "Tab1" ? "active" : ""}`}
                    >
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <Link 
                        onClick={(e) => Fleetbo.selectTab('tab2', e, setActiveTab)} 
                        className={`nav-link ${activeTab === "Tab2" ? "active" : ""}`}
                    >
                        <i className="fa-solid fa-bell"></i> 
                    </Link>
                    <Link 
                        onClick={(e) => Fleetbo.selectTab('tab3', e, setActiveTab)} 
                        className={`nav-link ${activeTab === "Tab3" ? "active" : ""}`}
                    >
                        <i className="fa-solid fa-user"></i>
                    </Link>
                </div>
            ) : (
                <div className="footer">
                    <Link 
                        onClick={(e) => Fleetbo.selectTab('tab1', e, setActiveTab)} 
                        className={`nav-link ${activeTab === "Tab1" ? "active" : ""}`}
                    >
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    <Link 
                        onClick={(e) => Fleetbo.selectTab('tab2', e, setActiveTab)} 
                        className={`nav-link ${activeTab === "Tab2" ? "active" : ""}`}
                    >
                        <i className="fa-solid fa-bell"></i> 
                    </Link>
                    <Link 
                        onClick={(e) => Fleetbo.selectTab('tab3', e, setActiveTab)} 
                        className={`nav-link ${activeTab === "Tab3" ? "active" : ""}`}
                    >
                        <i className="fa-solid fa-user"></i>
                    </Link>
                </div>
            )}
        </>
    );

};

export default Navbar;
