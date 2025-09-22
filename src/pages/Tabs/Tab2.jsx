// src/pages/Tabs/Tab2.jsx

import React from 'react';
import PageConfig from 'components/common/PageConfig';

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
            <div> <h5 className="text-secondary fw-normal">Build your interface here..</h5> </div>
        );
    };

    return (
        <>
            <PageConfig navbar="visible" />
            <Tab2Header />
            <div className="p-3 d-flex align-items-center justify-content-center text-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab2;
