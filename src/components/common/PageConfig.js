// src/components/common/PageConfig.js
import React from 'react';

/**
 * This invisible component is used to communicate the page's configuration
 * to the native Fleetbo shell.
 * @param {object} props
 * @param {'visible' | 'hidden'} props.navbar - Defines the navbar's visibility.
 */
const PageConfig = ({ navbar }) => {
    return (
        <div 
            id="fleetbo-page-config" 
            data-navbar={navbar} 
            style={{ display: 'none' }} 
        />
    );
};

export default PageConfig;
