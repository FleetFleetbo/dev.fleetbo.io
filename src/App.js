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
import Register from "./pages/Auth/Register";
import RouteAuth from "./pages/Auth/RouteAuth";

import Tab1 from "./pages/Tabs/Tab1";
import Tab2 from "./pages/Tabs/Tab2";
import Tab3 from "./pages/Tabs/Tab3";
import Insert from "./pages/Items/Insert";
import Item from "./pages/Items/Item";
import NotFound from './pages/NotFound';

// Global styles
import './assets/css/App.css';

//hooks
import { useStartupEffect } from 'hooks/useStartupEffect';

function AppContent() {
    useStartupEffect();
    return (
        <Routes>
            {/* The AuthGate handles the initial redirect from the root */}
            <Route path="/" element={<AuthGate />} />

            {/* Public routes */}
            <Route path="/auth/route" element={<RouteAuth />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/login"      element={<Login />} />

            {/* Protected routes using the conditional layout */}
            <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
                <Route path="/tab1" element={<Tab1 />} />
                <Route path="/tab2" element={<Tab2 />} />
                <Route path="/tab3" element={<Tab3 />} />
                {/* ... other protected routes ... */}
            </Route>

            {/* ... other protected routes ... */}
            <Route path="/insert" element={<ProtectedRoute><Insert /></ProtectedRoute>} />
            <Route path="/item"   element={<ProtectedRoute><Item /></ProtectedRoute>} />

            {/* Fallback routes */}
            <Route path="*"       element={<NotFound />} />
            <Route path="/navbar" element={<Navbar />} />
        </Routes>
    );
}


function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
