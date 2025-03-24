import React, { useEffect, useState } from 'react';


const Tab3 = () => {


    const [loadpage, setLoadPage]   = useState(true); 
    const [userData, setUserData]   = useState({
      username: "",
      //phoneNumber: "Non défini",
      dateCreated: ""
    });


    useEffect(() => {
        setTimeout(() => {
          if (typeof window.fleetbo.gdf37Auth === "function") {
            window.fleetbo.gdf37Auth("users");
          }
          setLoadPage(false);
        }, 300);
    
        // Correction de la fonction qui récupère les données de WebView
        window.getData = (jsonData) => {
          try {
            if (typeof jsonData === "string") {
              const cleanedJson = jsonData.replace(/\\"/g, '"'); // Nettoyage des échappements
              const data = JSON.parse(cleanedJson);
      
              setUserData({
                username: data.username || "",
                //phoneNumber: data.phoneNumber || "Non défini",
                dateCreated: data.dateCreated || ""
              });
            } else {
              console.error("Données reçues ne sont pas valides :", jsonData);
            }
          } catch (error) {
            console.error("Erreur de parsing JSON :", error);
          }
        };

    }, []);


    const logout = async (e) => {
        e.preventDefault(); 
        setLoadPage(true);
        setTimeout(() => {
          if (typeof window.fleetbo.c00ey0 === 'function') {
            window.fleetbo.d0a13();
          } 
        }, 1000);
    };

    const openPage= async () => {
        if (typeof window.fleetbo.openPage === 'function') {
          window.fleetbo.openPage('insert');
        } 
    };


    return (
      <>
        <header className='navbar pt-4'> 
            <h1 className='fs-5 fw-bolder'>Tab3</h1>
            <div className="navbar-right">
                <button onClick={ openPage } className="logout fs-5 fw-bold">
                    <i className="fa-solid fa-plus"></i>
                </button>
            </div>
        </header>

        {/* Container avec gestion du loader */}
        <div className="center-container">
          {loadpage ? (
              <div className="loader"></div>
          ) : (
            <>
              <div className="container">
                  <img
                  className='img-login'
                    src="https://static.vecteezy.com/system/resources/thumbnails/009/397/835/small/man-avatar-clipart-illustration-free-png.png"
                    alt="user"
                  />
                  <h2 className="text-success fw-bolder mt-2">{userData.username}</h2>
                  <h5 className="text-dark fw-normal">+237693386555</h5>
                  <h6 className="text-secondary fw-bold">Since {userData.dateCreated} </h6>
                  <button onClick={logout} className="go mt-3"> Log Out </button>
              </div>
            </>
          )}
        </div>
      </>
    );
};

export default Tab3;
