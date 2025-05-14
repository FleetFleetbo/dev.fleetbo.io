import React, { useEffect, useState } from 'react';
import Fleetbo, { useLoadingTimeout }  from 'systemHelper';
import { fleetboDB } from 'db';




const Tab1 = () => {

    const [loadpage, setLoadPage]   = useState(true); 
    const [data, setData]           = useState([]);  
    const [error, setError]         = useState("");
    const db                        = "items";
    /*
    const [isNative, setIsNative]   = useState(true);
    useEffect(() => {
      if(isNative){
        Fleetbo.openView("Home", true);
        setIsNative(true);
      }   
    },[isNative]);
    */

    const openPage                  = async () => {
        Fleetbo.openPage('insert');
    };

    // Utiliser le hook de timeout pour gérer le loader infini
    useLoadingTimeout(loadpage, setLoadPage, setError);

    useEffect(() => {
      // 1. Callback function wil be used by Fleetbo
      Fleetbo.setDataCallback((parsedData) => {
        if (parsedData.success) {
          setData(parsedData.data || []); 
        } else {
          setError("Erreur de récupération des données.");
          console.error("Erreur de récupération des données :", parsedData.message);
        }
        setLoadPage(false);
      });

      // 2. Call function to get data 
      Fleetbo.getDocs(fleetboDB, db);
      
      // Clean lors du démontage du composant
      return () => {
        Fleetbo.setDataCallback(null);
      };
    }, []);
    

    const deleteItem = async (id) => {
      Fleetbo.delete(fleetboDB, db, id);
      setData((prevData) => prevData.filter(item => item.id !== id));
    };


    return (
      <>

        <header className='navbar ps-3 pt-3'> 
          <h2 className='fw-bolder'>Home</h2>
            <div className="navbar-right">
                  <button onClick={ openPage } className="logout fs-5 fw-bold">
                      <i className="fa-solid fa-plus"></i>
                  </button>
            </div>
        </header>
       

        {/* Container avec gestion du loader */}
        <div className="p-3">
          {loadpage ? (
            <div className='center-container'>
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <div className="row mt-3">
                  <h2 className='fw-bolder'>Items</h2>

                  {data.length > 0 ? (
                      data.map((item, index) => (
                          <div key={index} className='row'>
                              <h5 className="fw-bold text-success mt-2">{item.title}</h5>
                              <div className="d-flex col-12">
                                  <div className='col-11 order-1'>
                                      <span className="text-dark fw-normal">  {item.content}</span>
                                  </div>
                                  <div className='col-1 order-3'>
                                      <button onClick={() => deleteItem(item.id)}  className="logout fs-5 fw-bold"> 
                                          <i className="fa-solid fa-trash text-danger"></i> 
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                    <p>No data available.</p>
                  )}

              </div>
            </>
          )}
        </div>
      </>
    );
};

export default Tab1;
