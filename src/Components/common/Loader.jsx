// src/components/common/Loader.jsx

import React from 'react';

const Loader = () => {
  return (
    <div 
      className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)', zIndex: 1050 }} 
    >
      {/* Standard Bootstrap spinner */}
      <div className="spinner-border text-info" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
