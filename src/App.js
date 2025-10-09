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

import NotFound from './pages/NotFound';

// Global styles
import './assets/css/App.css';

//hooks
import { useStartupEffect } from 'hooks/useStartupEffect';

function AppContent() {
    return (
        <Routes>
            {/* The AuthGate handles the initial redirection from the root */}
            <Route path="/" element={<AuthGate />} />

            {/* Public routes */}
            <Route path="/auth/route" element={<RouteAuth />} />
            <Route path="/login"      element={<Login />} />

            {/* Protected routes using the conditional layout */}
            <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
                <Route path="/tab1" element={<Tab1 />} />
                <Route path="/tab2" element={<Tab2 />} />
                <Route path="/tab3" element={<Tab3 />} />
                {/* ... your other protected routes ... */}
            </Route>

            {/* ... your other protected routes ...  */}
            <Route path="/setuser"   element={<ProtectedRoute><SetUser /></ProtectedRoute>} />
            <Route path="/insert" element={<ProtectedRoute><Insert /></ProtectedRoute>} />
            <Route path="/item"   element={<ProtectedRoute><Item /></ProtectedRoute>} />
            

            {/* Fallback routes */}
            <Route path="*"       element={<NotFound />} />
            <Route path="/navbar" element={<Navbar />} />
        </Routes>
    );
}

// A simple loading screen for initialization
// The loading screen now also handles an error state.
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
        <p style={{ marginTop: '1rem', color: '#6c757d' }}>Connecting to Fleetbo...</p>
      </>
    )}
  </div>
);


function App() {
    const { isFleetboReady, initializationError } = useStartupEffect();

    // We display the loading screen, either with the indicator or with an error message.
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

