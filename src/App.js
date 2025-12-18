/**
 * === Fleetbo Developer Tutorial: The App Entry Point (App.jsx) ===
 *
 * This file is the main entry point for your React application.
 * It is responsible for three core tasks:
 *
 * 1. Startup Logic (`useStartupEffect`):
 * Handles the initial "handshake" with the native Fleetbo shell.
 * It shows an `InitializingScreen` while waiting for the native bridge to be ready.
 *
 * 2. Auth Context (`AuthProvider`):
 * Wraps the entire application to provide global session data.
 * This is populated by the `Login.jsx` gateway and can be accessed
 * by any component using the `useAuth()` hook.
 *
 * 3. Routing (`<Routes>`):
 * Defines all the pages in your application.
 * It uses `ProtectedRoute` to secure pages that require a user to be
 * authenticated, redirecting them to the `/login` gateway if not.
 *
 * --- Your Customization ---
 * - You will add all your new pages (Routes) here.
 * - You can customize the `InitializingScreen` to match your app's branding.
 */
import React from 'react';
import { Routes, Route } from "react-router-dom";

// Context and internal logic
import { AuthProvider } from './context/AuthContext';
import AuthGate from './components/Internal/AuthGate';

// Layout components
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import ProtectedLayout from './components/layout/ProtectedLayout';

// Application pages
import Login from "./pages/Auth/Login";
import RouteAuth from "./pages/Auth/RouteAuth";

import Tab1 from "./pages/Tabs/Tab1";
import Tab2 from "./pages/Tabs/Tab2";
import Tab3 from "./pages/Tabs/Tab3";

import SetUser from "./pages/Items/User/SetUser";
import Insert from "./pages/Items/Insert";
import Item from "./pages/Items/Item";

import QuickMock from "./pages/mocks/Quick";
import SampleMock from "./pages/mocks/SampleMock";
import NotFound from './pages/NotFound';

/* =======================================================================
    FLEETBO AUTO-GENERATION ZONE
    DO NOT DELETE OR MODIFY THE SECTION BELOW.
   ======================================================================= */
// FLEETBO_IMPORTS

import './assets/css/App.css';

import { useStartupEffect } from 'hooks/useStartupEffect';

function AppContent() {
    return (
        // Add Routes
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
            <Route path="/insert"          element={<ProtectedRoute><Insert /></ProtectedRoute>} />
            <Route path="/item/:id"        element={<ProtectedRoute><Item /></ProtectedRoute>} />

            <Route path="/quick"           element={<QuickMock />} />
            <Route path="/mocks/sample"    element={<SampleMock />} />

            {/* =======================================================================
              FLEETBO DYNAMIC ROUTES
              DO NOT DELETE THE ANCHOR BELOW.
              New pages generated via 'npm run fleetbo page NamePage' will be inserted here.
               ======================================================================= */}
            {/* FLEETBO_ROUTES */}

            <Route path="*"       element={<NotFound />} />
            <Route path="/navbar" element={<Navbar />} />
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
      <>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    )}
  </div>
);

function App() {
    const { isFleetboReady, initializationError } = useStartupEffect();
    
    const isNavbarRoute = window.location.pathname === '/navbar';

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
