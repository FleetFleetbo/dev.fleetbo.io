import React, { useEffect, useState } from 'react';
import Fleetbo, { FleetboGet } from 'systemHelper';
import { fleetboDB } from 'db';



const Tab3 = () => {

    const [loadpage, setLoadPage]   = useState(true); 
    const [userData, setUserData]   = useState({
          username: "",
          dateCreated: ""
    });
    const  db                       = "users";


    useEffect(() => {
      FleetboGet((jsonData) => {
        try {
          setUserData({
            username: jsonData.username || "Anonymous",
            dateCreated: jsonData.dateCreated || "",
          });
        } catch (error) {
          console.error("Error getting data:", jsonData, error);
        }
      });
    
      setTimeout(() => {
        Fleetbo.gdf37Auth(fleetboDB, db); 
        setLoadPage(false);
      }, 300);
    }, []);


    return (
      <>
        <header className='navbar pt-4'> 
            <h1 className='fs-5 fw-bolder'>Tab3</h1>
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
                  <button onClick={() => { setTimeout(() => { Fleetbo.d0a13() }, 500)  }} className="go mt-3"> 
                     Log Out 
                  </button>
              </div>
            </>
          )}
        </div>
      </>
    );
};

export default Tab3;
