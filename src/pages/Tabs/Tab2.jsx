/**
 * === Fleetbo Developer Tutorial: A Blank Page (Tab2.jsx) ===
 *
 * This file is a clean, blank template for a standard page in your app.
 * It's the perfect starting point for building a new feature.
 *
 * --- How It Works ---
 * 1. PageConfig:
 * The <PageConfig navbar="show" /> component at the bottom tells the
 * native shell how to render its UI. "visible" shows the bottom tab bar.
 * You can set this to navbar="none" for full-screen pages (like "Insert" or "Item").
 *
 * 2. Header:
 * The <Tab2Header /> component is a simple header for this page.
 *
 * 3. Content:
 * The `renderContent` function is where you will add your
 * custom React components to build your page.
 *
 * --- Your Customization ---
 * - You can copy and paste this file to create new pages (e.g., Tab4, Profile, etc.).
 * - Start building your feature by replacing the content inside `renderContent`.
 */

import React from 'react';
import PageConfig from 'components/common/PageConfig';

const Tab2Header = () => {
    return (
        <header className='navbar ps-3 pt-3'>
            <h2 className='fw-bolder'>Interface</h2>
        </header>
    );
};

const Tab2 = () => {
    const renderContent = () => {
        return (
            <div>
                <h5 className="text-secondary fw-normal">Build your interface here...</h5>
            </div>
        );
    };

    return (
        <>
            <PageConfig navbar="show" />
            <Tab2Header />
            <div className="p-3 d-flex align-items-center justify-content-center text-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
                {renderContent()}
            </div>
        </>
    );
};

export default Tab2;
