import React, { useState } from 'react';
import './index.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';

const Page404 = () => {

  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const handleClose = async (e) => {
      setShow(false);
      navigate('/tab1');
  }

  return (
    <div className='App'>
        <br /> <br /> 
        <Modal
            show={show}
            onHide={handleClose}
            fullscreen={true}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Body>
                <div className='App-header text-dark'>
                    <div className='text-center'>
                          <h2 className='text-dark fw-bolder'>Error  </h2>
                          <h5 className='text-dark fw-bold'> Not Found </h5>
                    </div>
                    <Button  variant="secondary" className='back btn-secondary' onClick={handleClose}>
                       Go back
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
};

export default Page404;
