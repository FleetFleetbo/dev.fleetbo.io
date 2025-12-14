import { createBrowserHistory } from "history";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'; 
import 'assets/css/Index.css'; 
import 'assets/css/Native.css'; 
import App from './App'; 
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const history = createBrowserHistory(); 

const rootElement = document.getElementById('root');

window.navigateToTab = (route) => {
  if (history) {
      history.push(route);
  } else {
      window.location.href = route;
  }
};

const root = ReactDOM.createRoot(rootElement);

root.render(
    <HistoryRouter history={history}>
      <App />
    </HistoryRouter>
);

serviceWorkerRegistration.register();
