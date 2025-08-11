// src/pages/Tabs/Tab2.jsx

import React, { useState } from 'react';
import Fleetbo from 'api/fleetbo';
import Loader from 'components/common/Loader';

// --- Composant Header ---
const Tab2Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Tab 2</h2>
        </header>
    );
};

// --- Main component ---
const Tab2 = () => {
    // --- États du composant ---
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    Fleetbo.useLoadingTimeout(isLoading, setIsLoading, setError, 1000); 

    // --- Render logic ---
    const renderContent = () => {
        if (isLoading) {
            return <Loader />;
        }
        if (error) {
            return <div className="alert alert-danger">{error}</div>;
        }
        return (
            <div className="container text-center">
                <h3 className="fw-bolder text-success">Welcome to Tab 2</h3>
                <h5 className="text-dark fw-normal">You can start building your interface here..</h5>
            </div>
        );
    };

    return (
        <>
            <Tab2Header />
            <div className="center-container position-relative" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab2;
