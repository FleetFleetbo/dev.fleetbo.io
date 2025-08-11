// src/components/layout/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import Loader from 'components/common/Loader'; 

const ProtectedRoute                = ({ children }) => {
    const { isLoggedIn, isLoading } = useAuth();
    const location                  = useLocation();

    if (isLoading) {
        return <Loader />;
    }

    if (!isLoggedIn) {
        // if user not connected -> Login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
