
import React from 'react';
import PageConfig from 'components/common/PageConfig';

const SampleMock = () => {

  const centeredStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000000',
    color: '#10b981',     
    textAlign: 'center',
    padding: '20px'
  };

  const textStyles = {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '15px',
    lineHeight: '1.2',
    textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' 
  };

  const subTextStyles = {
    fontSize: '1.2em',
    color: '#f3f4f6'
  };


  return (
    <div style={centeredStyles}>
      <PageConfig navbar="none" /> 
      
      <div style={textStyles}>
        Build your Native module.
      </div>
      
      <div style={subTextStyles}>
        — Ready for Deployment —
      </div>
      
    </div>
  );
};

export default SampleMock;
