import React, { useEffect, useState } from 'react';


const Tab1 = () => {


    const [loadpage, setLoadPage]   = useState(true); 

    useEffect(() => {
        setTimeout(() => {  setLoadPage(false); }, 300);   
    }, [loadpage]);


    return (
      <>
        <header className='navbar pt-4'> 
            <h1 className='fs-5 fw-bolder'>Tab1</h1>
        </header>

        {/* Container avec gestion du loader */}
        <div className="container">
          {loadpage ? (
            <div className="parent-container">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <h2 className="mt-2 fw-bolder text-success">Welcome developer.</h2>
              <h3 className="text-dark fw-normal">Change code for your app.</h3>
            </>
          )}
        </div>
      </>
    );
};

export default Tab1;

