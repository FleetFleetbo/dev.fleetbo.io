// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import 'assets/css/Index.css'; 
import App from './App'; 
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

const rootElement = document.getElementById('root');

window.navigateToTab = (route) => {
  window.history.pushState({}, "", route);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
