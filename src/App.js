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
import Tab1 from "./pages/Tabs/Tab1";
import Tab2 from "./pages/Tabs/Tab2";
import Tab3 from "./pages/Tabs/Tab3";
import Insert from "./pages/Items/Insert";
import Item from "./pages/Items/Item";
import NotFound from './pages/NotFound';

// Global styles
import './assets/css/App.css';

function App() {
    useEffect(() => {
      // This check ensures that the app is running correctly in the WebView
      if (!window.fleetbo) {
        // In production, you might want a more elegant error page
        window.location.href = 'https://fleetbo.io'; 
        console.error("The application must be run in the native container.");
      }
    }, []);

    return (
        <AuthProvider>
          <Router>

            <Routes>
              {/* The AuthGate guard handles the initial redirection from the root */}
              <Route path="/" element={<AuthGate />} />

              {/* Public routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Protected routes that require authentication */}
              <Route path="/tab1" element={<ProtectedRoute><Tab1 /></ProtectedRoute>} />
              <Route path="/tab2" element={<ProtectedRoute><Tab2 /></ProtectedRoute>} />
              <Route path="/tab3" element={<ProtectedRoute><Tab3 /></ProtectedRoute>} />
              <Route path="/insert" element={<ProtectedRoute><Insert /></ProtectedRoute>} />
              <Route path="/item" element={<ProtectedRoute><Item /></ProtectedRoute>} />

              {/* Utility or "fallback" routes */}
              <Route path="*" element={<NotFound />} />
              <Route path="/navbar" element={<Navbar />} />
            </Routes>
          </Router>
        </AuthProvider>
    );
}

export default App;
