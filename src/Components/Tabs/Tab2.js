import React, { useEffect, useState } from 'react';
import        { useLoadingTimeout } from 'systemHelper';

const Tab2 = () => {


    const [loadpage, setLoadPage]   = useState(true); 
    const [error, setError]         = useState("");

    // Utiliser le hook de timeout pour gérer le loader infini
    useLoadingTimeout(loadpage, setLoadPage, setError);

    useEffect(() => {
        setTimeout(() => {  setLoadPage(false); }, 300);   
    }, [loadpage]);


    return (
      <>
        <header className='navbar ps-3 pt-3'> <h2 className='fw-bolder'>Tab 2</h2> </header>

        {/* Container avec gestion du loader */}
        <div className="center-container">
          {loadpage ? (
              <div className="loader"></div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
            <>
              <div className="container">
                  <h3 className="fw-bolder text-success">Tab 2 </h3>
                  <h5 className="text-dark fw-normal">Change code for your app.</h5>
              </div>
            </>
          )}
        </div>
      </>
    );
};

export default Tab2;
