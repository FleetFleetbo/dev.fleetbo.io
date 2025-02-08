import React, { useState } from 'react';
import './css/index.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';


const PageNotFound = () => {

	const navigate = useNavigate();
	const [show, setShow] = useState(true);
	const handleClose = async (e) => {
		  setShow(false);
		  navigate('/auth');
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
					<div className='App-Container text-dark'>
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

export default PageNotFound;
