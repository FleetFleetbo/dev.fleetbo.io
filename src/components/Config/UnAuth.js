import React, { useState } from 'react';
import './../../index.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';

const PageNotFound = () => {

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
                          <i className="fa-solid fa-skull-crossbones text-danger" style={{ fontSize: '50px'}}></i>
                          <br />  <br />
                          <h2 className='text-danger  fw-bolder'>Not authorized </h2>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
};

export default PageNotFound;
