import React, { useEffect, useState } from 'react';


const Tab2 = () => {


    const [loadpage, setLoadPage]   = useState(true); 

    useEffect(() => {
        setTimeout(() => {  setLoadPage(false); }, 300);   
    }, [loadpage]);


    return (
      <>
        <header className='navbar pt-4'> 
            <h1 className='fs-5 fw-bolder'>Tab2</h1>
        </header>

        {/* Container avec gestion du loader */}
        <div className="center-container">
          {loadpage ? (
            <div className="">
              <div className="loader"></div>
            </div>
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
