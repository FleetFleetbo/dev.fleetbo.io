// src/pages/Tabs/Tab2.jsx

import React from 'react';

// --- Composant Header ---
const Tab2Header = () => {
    return (
        <header className='navbar ps-3 pt-3'> <h2 className='fw-bolder'>Tab 2</h2> </header>
    );
};

// --- Main component ---
const Tab2 = () => {
    // --- Render logic ---
    const renderContent = () => {
        return (
            <div className="container text-center">
                <h5 className="text-dark fw-normal">Build your interface here..</h5>
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
