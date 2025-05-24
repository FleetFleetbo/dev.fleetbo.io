
import React, { useState, useEffect } from 'react';
import Fleetbo, { FleetboGet, useLoadingTimeout } from 'systemHelper';
import { fleetboDB } from 'db';


const Item = () => {
    
    const [loadpage, setLoadPage]                 = useState(true);

    const db                                      = "items";
    const [docData, setDocData]                   = useState(null); 
    const [error, setError]                       = useState("");


    useLoadingTimeout(loadpage, setLoadPage, setError);

    
    useEffect(() => {

        window.getParam = (param) => {
            Fleetbo.getDoc(fleetboDB, db, param);
        };

        FleetboGet((jsonData) => {
            try {
                if (jsonData.error) {
                    setError(jsonData.message || "Une erreur s'est produite");
                    setDocData(null);
                } else if (jsonData.notFound) {
                    setError("Aucune donnée utilisateur disponible");
                    setDocData(null);
                } else if (jsonData && (jsonData.title || jsonData.content || jsonData.dateCreated)) {
                    setDocData({
                        title: jsonData.title || "Not available",
                        content: jsonData.content || "Not available",
                        dateCreated: jsonData.dateCreated || ""
                    });
                    setError("");
                } else {
                    setError("Format de données incorrect");
                    setDocData(null);
                }
            } catch (error) {
                console.error("Error processing data:", jsonData, error);
                setError("Erreur lors du traitement des données");
                setDocData(null);
            } finally {
                setLoadPage(false);
            }
        });


    }, []);

    
    
    return (
        <>
            <header className='navbar pt-4'> 
                <div className=''> 
                    <button onClick={() => Fleetbo.back() }  className="logout fs-5 fw-bold">
                        <i className="fa-solid fa-arrow-left"></i> <span className='ms-3'>Item </span>
                    </button>
                </div>
            </header>


            <div className="p-3" >
        
                <div className="p-2 mt-2">          

                    <div className='row mt-3'>
                        {loadpage ? (
                            <div className="loader"></div>
                        ) : error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : docData ? (
                            <>
                                <h5 className="fw-bold text-success mt-2">{docData.title}</h5><div className="d-flex col-12">
                                    <div className='col-11 order-1'>
                                        <span className="text-dark fw-normal"> {docData.content}</span>
                                    </div>
                                </div>
                            </>
                         ) : (
                            <div className="alert alert-info">No user data</div>
                        )}
                    </div>

                </div>
          
            </div>
        </>
    );
};

export default Item;

