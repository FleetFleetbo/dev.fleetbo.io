import React from 'react';
import Spinner from 'react-bootstrap/Spinner';


const Redirect = () => {


    return (
        <div><><div className="loader fs-4 fw-normal text-dark">
		  <Spinner animation="border" variant="success" role="status">
			  <span className="visually-hidden text-light">Loading...</span>
		  </Spinner>
        </div></> </div>
    )
};

export default Redirect;
