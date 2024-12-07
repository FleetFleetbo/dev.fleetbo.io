import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

const DelayedRoute = ({ element: Element, delay, ...rest }) => {
  const [showElement, setShowElement] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowElement(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return showElement ? <Route {...rest} element={<Element />} /> : null;
};

export default DelayedRoute;