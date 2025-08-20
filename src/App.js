import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- Imports from the new structure ---

// Context and internal logic
import { AuthProvider } from './context/AuthContext';
import AuthGate from './components/Internal/AuthGate';

// Layout components
import ProtectedRoute from './components/layout/ProtectedRoute';
import Navbar from './components/layout/Navbar';

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

// Hooks
import { useStartupEffects } from 'hooks/useStartupEffects';


function AppContent() {
    useStartupEffects();
    return (
        <Routes>
            {/* Le AuthGate gère la redirection initiale depuis la racine */}
            <Route path="/" element={<AuthGate />} />

            {/* Routes publiques */}
            <Route path="/auth/route" element={<RouteAuth />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/login"      element={<Login />} />

            {/* Routes protégées */}
            <Route path="/tab1" element={<ProtectedRoute><Tab1 /></ProtectedRoute>} />
            <Route path="/tab2" element={<ProtectedRoute><Tab2 /></ProtectedRoute>} />
            <Route path="/tab3" element={<ProtectedRoute><Tab3 /></ProtectedRoute>} />

            {/* ... vos autres routes protégées ... */}
            <Route path="/insert" element={<ProtectedRoute><Insert /></ProtectedRoute>} />
            <Route path="/item" element={<ProtectedRoute><Item /></ProtectedRoute>} />

            {/* Routes de secours */}
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
