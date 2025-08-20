// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'; 
import 'assets/css/Index.css'; 
import App from './App'; 
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { history } from 'components/layout/Navigation';

const rootElement = document.getElementById('root');

window.navigateToTab = (route) => {
  history.push(route);
};

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HistoryRouter history={history}>
      <App />
    </HistoryRouter>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
