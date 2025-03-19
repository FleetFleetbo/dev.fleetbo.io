
import React, { useEffect, useState } from 'react';


const Tab3 = () => {


    const [loadpage, setLoadPage]   = useState(true); 

    const logout = async (e) => {
        e.preventDefault(); 
        setLoadPage(true);
        setTimeout(() => {
          if (typeof window.fleetbo.c00ey0 === 'function') {
             window.fleetbo.d0a13();
          } 
        }, 1000);
    };

    const openView = async (e) => {
        e.preventDefault(); 
        if (typeof window.fleetbo.openFragment === 'function') {
          window.fleetbo.openFragment();
        } 
    };


    useEffect(() => {
        setTimeout(() => {  setLoadPage(false); }, 300);   
    }, [loadpage]);


    return (
      <>
        <header className='navbar pt-4'> 
            <h1 className='fs-5 fw-bolder'>Tab3</h1>
            <div className="navbar-right">
                <button onClick={openView} className="logout fs-5 fw-bold">
                     New <i className="fa-solid fa-plus"></i>
                </button>
            </div>
        </header>

        {/* Container avec gestion du loader */}
        <div className="container">
          {loadpage ? (
            <div className="parent-container">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/009/397/835/small/man-avatar-clipart-illustration-free-png.png"
                alt="user"
                style={styles.avatar}
              />
              <h2 className="mt-2 fw-bolder text-success">Odin</h2>
              <h3 className="text-dark fw-normal">Paris, France</h3>
              <h6 className="text-secondary fw-bold mt-2">
                Rap ¶ Kompa ¶ Drill ¶ Hip-Hop
              </h6>
              <button onClick={logout} className="go mt-3">
                Log Out
              </button>
            </>
          )}
        </div>
      </>
    );
};

export default Tab3;
