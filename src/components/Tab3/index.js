import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBarProfile from './NavBarProfile';
import  './profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; 

const Tab3 = () => {

    const navigate = useNavigate();

    const logout = async (e) => {
        //e.preventDefault();
        // remove
        localStorage.removeItem('my-key');
        // remove all
        localStorage.clear();
        navigate('/');
        window.location.reload(false);  
    }


    return (   
        <div className='App'>
        <NavBarProfile />
        <br /> <br /> 
        <div className='App-header'>
            <h1 className='text-dark fw-bold'>FleetBo Project</h1>
            <button className='logout' onClick={logout}>Disconnect <FontAwesomeIcon size="lg" icon={faRightFromBracket} /> </button>
        </div> 
    </div>
    )
};

export default Tab3;
