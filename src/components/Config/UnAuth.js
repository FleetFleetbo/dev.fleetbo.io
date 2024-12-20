import React, { useState } from 'react';
import './../../index.css';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

const Un = () => {

  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  const handleClose = async (e) => {
      setShow(false);
      navigate('/tab1');
  }

	return (
        <div className='App'>
		    
            <div className='App-Container'>
                <div className=''>
				    <i className="fa-solid fa-xmark" style={{ fontSize: '50px'}}></i>
					<br />  <br />
				    <h2 className='text-danger  fw-bolder'>Not authorized </h2>
			    </div>
            </div>
        </div>
    )
};

export default Un;
