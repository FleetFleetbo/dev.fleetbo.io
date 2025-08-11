// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center text-center vh-100 bg-light">
      <div>
        <h1 className="display-1 fw-bold text-secondary">404</h1>
        <p className="lead text-muted">
          Désolé, la page que vous cherchez n'existe pas.
        </p>
        <Link to="/tab1" className="btn btn-primary mt-3">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
