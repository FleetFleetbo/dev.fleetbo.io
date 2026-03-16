/**
 * Native Tab Redirect or Not
 *
 * This tab is handled by a native module (or its mock in dev).
 * If React renders this route (e.g. on reload), we redirect to the mock.
 */
import { useEffect } from 'react';
import { PageConfig } from '@fleetbo';

const Tab2 = () => {
    // Call your fleetbo tab module 
    useEffect(() => { Fleetbo.openView('SampleTabMock', true);}, []);

    return (
        <>
            <PageConfig navbar="show" />
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="spinner-border text-success" role="status" />
            </div>
        </>
    );
};

export default Tab2;