import React, {  useState } from 'react';
import { Link } from 'react-router-dom';
import Fleetbo from 'systemHelper';



const Footer                                 = () => {

    const [activeTab, setActiveTab]          = useState();
    const navbarType                         = localStorage.getItem("navbarType");

    window.activeTab                         = (tab) => {
        console.log("activeTab called with:", tab);
        setActiveTab(tab);
    };

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
                <div style={styles.header}>
                <Link onClick={(e) => selectTab('tab1', e)} style={activeTab === "Tab1" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                    <i className="fa-solid fa-house"></i>
                </Link>
                <Link onClick={(e) => selectTab('tab2', e)} style={activeTab === "Tab2" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                    <i className="fa-solid fa-bell"></i> 
                </Link>
                <Link onClick={(e) => selectTab('tab3', e)} style={activeTab === "Tab3" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                    <i className="fa-solid fa-user"></i>
                </Link>
                </div>
            ) : (
                <div style={styles.footer}>
                <Link onClick={(e) => selectTab('tab1', e)} style={activeTab === "Tab1" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                    <i className="fa-solid fa-house"></i>
                </Link>
                <Link onClick={(e) => selectTab('tab2', e)} style={activeTab === "Tab2" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                   <i className="fa-solid fa-bell"></i> 
                </Link>
                <Link onClick={(e) => selectTab('tab3', e)} style={activeTab === "Tab3" ? { ...styles.link, ...styles.activeLink } : styles.link}>
                    <i className="fa-solid fa-user"></i>
                </Link>
                </div>
            )}
        </>
    );

};

export default Footer;

const styles = {
    footer: {
      position: "fixed",
      width: "100%",
      background: "#f2f2f2",
      display: "flex",
      justifyContent: "space-around",
      padding: "10px",
      zIndex: 1000
    },
    header: {
        position: "fixed",
        width: "100%",
        top: 0,
        background: "#f2f2f2",
        display: "flex",
        justifyContent: "space-around",
        padding: "1px",
        zIndex: 1000
    },
    link: {
        color: "#222",
        padding: "10px 40px 10px 40px",
        fontSize: "19px",
        cursor: "pointer",
        borderTopLeftRadius: "8px", 
        borderTopRightRadius: "8px", 
        borderBottomRightRadius: "0px", 
        borderBottomLeftRadius: "0px", 
        textDecoration: "none"
    },
    activeLink: {
        background: "#0E904D",
        color: "#fff",
    }
  };
