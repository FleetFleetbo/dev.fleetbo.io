import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

// Context and internal logic
import { AuthProvider, AuthGate, useAuth, ProtectedRoute, ProtectedLayout } from '@fleetbo';

// Application pages
import Login from "./app/auth/Login";
import RouteAuth from "./app/auth/RouteAuth";

import Tab1 from "./app/tabs/Tab1";
import Tab2 from "./app/tabs/Tab2";
import Tab3 from "./app/tabs/Tab3";
import Welcome from "./app/tabs/Welcome";

import SetUser from "./app/items/User/SetUser";
import Item from "./app/items/Item";

import SampleMock from "./app/mocks/SampleMock";
import SampleTabMock from "./app/mocks/SampleTabMock";
import NotFound from './app/NotFound';

/* =======================================================================
    FLEETBO AUTO-GENERATION ZONE
    DO NOT DELETE OR MODIFY THE SECTION BELOW.
   ======================================================================= */

// FLEETBO_IMPORTS
import GuestCreator from './app/mocks/GuestCreator';
import GuestList from './app/mocks/GuestList';
// FLEETBO_MORE_IMPORTS

import { useStartupEffect } from '@fleetbo/hooks/useStartupEffect';

function AppContent() {

    const auth = useAuth();
    const location = useLocation();

    const isTechnicalRoute = 
        location.pathname === '/navbar' || 
        window.location.hash.includes('navbar') ||
        location.pathname.includes('/mocks') || 
        window.location.hash.includes('mocks'); 

    if (!isTechnicalRoute) {
        const isLoading = auth ? auth.isLoading : true;
        if (isLoading) {
            return <InitializingScreen />;
        }
    }

    return (
        <Routes>
            <Route path="/"                element={<AuthGate />} />

            <Route path="/auth/route"      element={<RouteAuth />} />
            <Route path="/login"           element={<Login />} />

            <Route                         element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
                <Route path="/tab1"        element={<Tab1 />} />
                <Route path="/tab2"        element={<Tab2 />} />
                <Route path="/tab3"        element={<Tab3 />} />
            </Route>

            <Route path="/setuser"         element={<ProtectedRoute><SetUser /></ProtectedRoute>} />
            <Route path="/item/:id"        element={<ProtectedRoute><Item /></ProtectedRoute>} />

            <Route path="/mocks/samplemock"    element={<SampleMock />} />
            <Route path="/mocks/sampletabmock" element={<SampleTabMock />} />

            {/* =======================================================================
              FLEETBO DYNAMIC ROUTES
              DO NOT DELETE THE ANCHOR BELOW.
              ======================================================================= */}
            {/* FLEETBO_ROUTES */}

            {/* =======================================================================
              FLEETBO DYNAMIC ROUTES
              DO NOT DELETE THE ANCHOR BELOW.
              ======================================================================= */}
             {/* FLEETBO_DYNAMIC ROUTES */}
            <Route path="/mocks/guestcreator" element={<GuestCreator />} />
            <Route path="/mocks/guestlist" element={<GuestList />} />            

            <Route path="*"       element={<NotFound />} />
            <Route path="/navbar" element={<Welcome />} />
        </Routes>
    );
}

const InitializingScreen = ({ error }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
        {error ? (
            <>
                <i className="fa-solid fa-triangle-exclamation fa-3x text-danger mb-3"></i>
                <h5 className="text-danger">Connection Failed</h5>
                <p style={{ marginTop: '1rem', color: '#6c757d' }}>{error}</p>
                <button className="btn btn-outline-secondary mt-3" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </>
        ) : (
            <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        )}
    </div>
);

function App() {
    const { isFleetboReady, initializationError } = useStartupEffect();
    const isNavbarRoute = window.location.hash.includes('navbar');

    if (isNavbarRoute) {
        return <AppContent />;
    }

    if (!isFleetboReady) {
        return <InitializingScreen error={initializationError} />;
    }

    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
