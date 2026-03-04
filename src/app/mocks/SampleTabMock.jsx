/**
 * SampleTabMock.jsx — Default Native Module Simulation
 *
 * This is a Mock: the dev-mode twin of a native module.
 * In production, the real Kotlin/Swift code runs instead.
 * In dev, this JSX simulates the same UI + logic so you can test without building.
 *
 * How it works:
 *   1. Your JS calls: await Fleetbo.exec('ModuleName', 'action', { params })
 *   2. In dev  → this Mock opens, simulates the native behavior, returns data.
 *   3. In prod → the real native module runs at 120FPS, same interface.
 *
 * Need a real module? Open Alex: npm run fleetbo alex
 *   → "A camera to scan receipts for my expense tracker"
 *   → "A form with photo + title that saves to products"
 *   → Alex forges the native .kt AND its mock .jsx together.
 *
 * You script the orders. Alex builds the muscle.
 */
import React from 'react';

const SampleTabMock = () => {
    return (
        <div
            className="d-flex flex-column bg-white"
            style={{ width: '100%', height: '100vh' }}
        >
            {/* HEADER */}
            <div className="d-flex align-items-center w-100 p-3 border-bottom bg-white pt-4 sticky-top">
                 <h2 className='fw-bolder fb-name text-dark mb-0'>Sample Tab</h2>
            </div>

            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center px-4">
                <p className="text-muted text-center" style={{ maxWidth: '280px', lineHeight: '1.6' }}>
                    This is a native module placeholder.<br/>
                    Ask <strong>Alex</strong> to forge the real one.
                </p>
            </div>
        </div>
    );
};

export default SampleTabMock;
