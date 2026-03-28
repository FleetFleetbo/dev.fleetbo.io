import React from 'react';

export default function SampleTab() {
    return (
        <div 
            className="d-flex flex-column justify-content-center align-items-center w-100"
            style={{ 
                minHeight: '100vh', 
                backgroundColor: '#F8F9FA', 
                padding: '24px', 
                paddingBottom: '80px' 
            }}
        >
            <h1 
                style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: '#212529', 
                    margin: '0 0 16px 0',
                    textAlign: 'center'
                }}
            >
                Metal Foundation
            </h1>
            
            <p 
                style={{ 
                    fontSize: '16px', 
                    color: '#6C757D', 
                    textAlign: 'center', 
                    lineHeight: '24px', 
                    margin: '0 0 40px 0',
                    maxWidth: '400px'
                }}
            >
                This is a Fleetbo View. The interface is rendered natively at 120 FPS. Use this foundation to build complex and high-performance views.
            </p>
            
            <div
                className="d-flex align-items-center justify-content-center text-white"
                style={{ 
                    backgroundColor: '#0E904D', 
                    borderRadius: '12px', 
                    width: '100%', 
                    maxWidth: '400px',
                    height: '56px', 
                    cursor: 'default',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    transition: 'transform 0.1s'
                }}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => Fleetbo.emit('PING_JS', {})}
            >
                EMIT SIGNAL TO JS
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-28 at 15:04:20
