import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './../../images/logo1.png';
import './Welcome.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Welcome = () => {

    const navigate = useNavigate();
    // setter
    localStorage.setItem('my-key', 'Connected');
    // getter
    const key = localStorage.getItem('my-key');
    const [show, setShow] = useState(false);
    useEffect(() => {
       if (key === 'Connected') { setShow(true) } 
    }, [key])

    const handleClose = async (e) => {
        setShow(false);
        navigate('/tab1');
    }

    return (
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
                        <img className='App-logo' src={logo}  alt="Logo" />
                        <h2 className='Brand'>FleetBo project</h2>
                        <span className='desc'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Mauris condimentum ante velit, quis eleifend urna ultricies et. 
                            Vivamus consectetur aliquet ultricies.
                        </span>
                    </div>
                    <Button variant="success" className='go' onClick={handleClose}>
                       I am Understood
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default Welcome;
