import React, { useEffect, useState } from 'react';
import Fleetbo from './helper/systemHelper';


const Tab1 = () => {


    const [loadpage, setLoadPage]   = useState(true); 
    const [data, setData]           = useState([]);  // Doit être un tableau pour stocker tous les documents
    const  fleetboDB                = "vOWFCGQNcE2QyzlTMe8h";
    const  db                       = "items";

    const openPage= async () => {
      Fleetbo.openPage('insert');
    };

    // Get data
    window.getData = (jsonData) => {
      try {
          const parsedData = JSON.parse(jsonData);

          if (parsedData.success) {
              setData(parsedData.data || []); // Stocker tous les éléments
              setLoadPage(false); // Fin du chargement après récupération des données
          } else {
              console.error("Erreur de récupération des données :", parsedData.message);
              setLoadPage(false);
          }
      } catch (error) {
          console.error("Erreur de parsing JSON :", error);
          setLoadPage(false);
      }
    };


    useEffect(() => {
      Fleetbo.gdf37(fleetboDB, db);
    }, []);


    const deleteItem = async (id) => {
      Fleetbo.dd0769(fleetboDB, db, id);
      setData((prevData) => prevData.filter(item => item.id !== id));
    };



    return (
      <>
        <header className='navbar pt-4'> 
            <h1 className='fs-5 fw-bolder'>Tab1</h1>
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
                    <p>Aucun élément disponible.</p>
                  )}

              </div>
            </>
          )}
        </div>
      </>
    );
};

export default Tab1;
