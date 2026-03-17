import React, { useState, useEffect } from 'react';

export default function testModule() {
    const [title, setTitle] = useState("Titre par défaut");
    const [imageUrl, setImageUrl] = useState("https://fleetbo.io/images/console/gallery/5.png");

    useEffect(() => {
        try {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const params = JSON.parse(decodeURIComponent(hash));
                if (params.title) setTitle(params.title);
                if (params.imageUrl) setImageUrl(params.imageUrl);
            }
        } catch (e) {
            console.error("Erreur de parsing des paramètres:", e);
        }
    }, []);

    const handleClose = () => {
        Fleetbo.close({ status: "closed" });
    };

    return (
        <div className="d-flex flex-column h-100 bg-white align-items-center justify-content-center p-4">
            <img 
                src={imageUrl} 
                alt="Image principale" 
                style={{ 
                    width: '200px', 
                    height: '200px', 
                    objectFit: 'cover', 
                    marginBottom: '24px', 
                    borderRadius: '12px' 
                }} 
            />
            
            <h2 className="text-dark fw-bold text-center m-0">
                {title}
            </h2>
            
            <div style={{ marginTop: '48px' }}>
                <div 
                    className="bg-primary text-white rounded d-flex align-items-center justify-content-center px-4 py-2"
                    style={{ cursor: 'default', transition: 'transform 0.1s', fontWeight: '500' }}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={handleClose}
                >
                    FERMER
                </div>
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-17 at 05:08:13