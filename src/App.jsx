import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthGate, useAuth, ProtectedRoute, ProtectedLayout } from '@fleetbo';

// Application views
import Login from "./app/auth/Login";
import RouteAuth from "./app/auth/RouteAuth";

import Tab1 from "./app/tabs/Tab1";
import Tab2 from "./app/tabs/Tab2";
import Tab3 from "./app/tabs/Tab3";
import Welcome from "./app/tabs/Welcome";

import SetUser from "./app/items/User/SetUser";
import Item from "./app/items/Item";
import NotFound from './app/NotFound';

/* =======================================================================
    FLEETBO AUTO-GENERATION ZONE
    DO NOT DELETE OR MODIFY THE SECTION BELOW.
   ======================================================================= */

// FLEETBO_IMPORTS
import GuestManager from './app/mocks/GuestManager';
import ProfileManager from './app/mocks/ProfileManager';
import SampleTab from './app/mocks/SampleTab';
// FLEETBO_MORE_IMPORTS

import { useStartupEffect } from '@fleetbo/hooks/useStartupEffect';

const DelayedNavbar = () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (!isReady) return null; 
    
    return <Welcome />;
};

const ActiveTabRedirect = ({ tab, children }) => {
    const saved = localStorage.getItem("activeTab") || "Tab1";
    if (saved === "Tab2") return <Navigate to="/tab2" replace />;
    if (saved === "Tab3") return <Navigate to="/tab3" replace />;
    return children;
};

function AppContent() {
    const location = useLocation();

    const isTechnicalRoute = 
        location.pathname === '/navbar' || 
        window.location.hash.includes('navbar') ||
        location.pathname.includes('/mocks') || 
        window.location.hash.includes('mocks');

    return (
        <Routes>
            <Route path="/"                element={<AuthGate />} />
            <Route path="/auth/route"      element={<RouteAuth />} />
            <Route path="/login"           element={<Login />} />

            <Route                         element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
                <Route path="/tab1"        element={<ActiveTabRedirect tab="Tab1"><Tab1 /></ActiveTabRedirect>} />
                <Route path="/tab2"        element={<Tab2 />} />
                <Route path="/tab3"        element={<Tab3 />} />
            </Route>

            <Route path="/setuser"         element={<ProtectedRoute><SetUser /></ProtectedRoute>} />
            <Route path="/item/:id"        element={<ProtectedRoute><Item /></ProtectedRoute>} />

            {/* FLEETBO_ROUTES */}
            {/* =======================================================================
              FLEETBO DYNAMIC ROUTES
              DO NOT DELETE THE ANCHOR BELOW.
              ======================================================================= */}
             <Route path="/mocks/guestmanager" element={<GuestManager />} />
             <Route path="/mocks/profilemanager" element={<ProfileManager />} />
             <Route path="/mocks/sampletab" element={<SampleTab />} />
             {/* FLEETBO_DYNAMIC ROUTES */}        

            <Route path="*"       element={<NotFound />} />
            <Route path="/navbar" element={<DelayedNavbar />} />
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
