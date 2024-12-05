// App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tab1 from './components/Tab1/index';
import Tab2 from './components/Tab2/index';
import Tab3 from './components/Tab3/index';
import MobileTabs from './components/Tabs/index';
import AppLauncher from './components/AppLauncher';
import PageNotFound from "./components/Error/Page404";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Welcome from './components/Welcome';


function App() {

  { /* const [user] = useAuthState(auth);  */}

   
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AppLauncher />} />
          <Route path="/tab1" element={<Tab1 />} />
          <Route path="/tab2" element={<Tab2 />} />
          <Route path="/tab3" element={<Tab3 />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <MobileTabs />
        <Welcome />
      </div>
    </Router>
  );
}

export default App;
