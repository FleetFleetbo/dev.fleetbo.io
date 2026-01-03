// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center text-center vh-100 bg-light">
      <div>
        <h1 className="display-1 fw-bold text-secondary">404</h1>
        <p className="lead text-muted">
          Page not found.
        </p>
        <Link to="/main" className="btn btn-success w-100 mt-3">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
