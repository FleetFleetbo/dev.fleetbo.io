// src/components/Internal/AuthGate.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext'; 

const AuthGate = () => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (isLoggedIn) {
    // User connected -> Main page.
    return <Navigate to="/tab1" replace />;
  }

  // User not connected -> login page.
  return <Navigate to="/login" replace />;
};

export default AuthGate;
