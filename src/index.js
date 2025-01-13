import React from 'react';
import ReactDOM from 'react-dom/client'; // Remarque : utilisez createRoot
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root")); // Utilisation de createRoot
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Optionnel : si vous utilisez reportWebVitals
reportWebVitals();
