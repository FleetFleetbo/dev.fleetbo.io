import React, { useEffect, useState } from 'react';
import Fleetbo from 'systemHelper';


const Welcome = ()  => {

  const [isNative, setIsNative] = useState(true);

  useEffect(() => {
    if(isNative){
      Fleetbo.openView("Home", true);
      setIsNative(true);
    }
      
  },[isNative]);

  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
};

export default Welcome;
