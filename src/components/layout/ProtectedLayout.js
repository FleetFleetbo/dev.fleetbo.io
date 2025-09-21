// src/components/layout/ProtectedLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';


const ProtectedLayout = () => {
    return (
        <div className="app-container">
            <main className="main-content">
                {/* L'Outlet rendra la page (Tab1, Tab2...), RIEN DE PLUS */}
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedLayout;
