import React, {  useState } from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {

    const [activeTab, setActiveTab]          = useState();

    window.activeTab                         = (tab) => {
        console.log("activeTab called with:", tab);
        setActiveTab(tab);
    };


    const selectTab = async (theView, e) => {
        if (e) {
            e.preventDefault(); 
        }
        
        try {
            // Vérifier si `tabId` est valide
            if (!theView) {
                console.error("tabId invalide");
                return;
            }
            
            switch(theView) {
                case 'Home':
                    setActiveTab("Tab1");
                    window.fleetbo.openView(theView, true);
                    break;
                case 'tab2':
                    setActiveTab("Tab2");
                    window.fleetbo.openView(theView, false );
                    break;
                case 'tab3':
                    setActiveTab("Tab3");
                    window.fleetbo.openView(theView, false);
                    break;
                default:
                    console.error(`Onglet inconnu: ${theView}`);
            }
        } catch (error) {
            console.error("Erreur lors de la sélection de l'onglet :", error);
        }
    };


    return (
        <div style={styles.footer}>
            <Link onClick={(e) => selectTab('Home', e) } style={activeTab === "Tab1" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                <i className="fa-solid fa-house"></i>
            </Link>
            <Link onClick={(e) => selectTab('tab2', e)} style={activeTab === "Tab2" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                ➕ 
            </Link>
            <Link onClick={(e) => selectTab('tab3', e)} style={activeTab === "Tab3" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                <i className="fa-solid fa-user"></i>
            </Link>
        </div>
    );

};

export default Footer;

const styles = {
  footer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    background: "#f2f2f2",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
    zIndex: 1000
  },
  link: {
    color: "#222",
    padding: "10px 40px 10px 40px", // Increased left and right padding
    fontSize: "17px",
    cursor: "pointer",
    borderRadius: "8px",
    textDecoration: "none"
  },
  activeLink: {
    color: "#333",
    backgroundColor: '#c7f3de'
  },
};
