import React from 'react';
import './Home.css';
import NavBarHome from './NavBarHome';
import MobileTabs from '../Tabs';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';


const Tab1 = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className='App'>
        <NavBarHome />
        <br /> <br /> 
        <div className='App-header'>
            <h1 className='text-dark fw-bold'>FleetBo Project</h1>
            <h5 className='text-dark'>I am connected !</h5>
            { /* <Button variant="success" > Launch modal </Button> <Link to="/ergrt"  > Test </Link>  */ }    
        </div>       
    </div>
  )
};

export default Tab1;
