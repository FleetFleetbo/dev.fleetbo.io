import React, { useState } from 'react';

export default function GuestCreator() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedImageUri, setSelectedImageUri] = useState(null);

    const handlePickImage = () => {
        const index = Math.floor(Math.random() * 10);
        setSelectedImageUri(`https://fleetbo.io/images/console/gallery/${index}.png`);
    };

    const handleSubmit = () => {
        if (!firstName || !lastName) return;
        Fleetbo.close({ success: true, documentId: "mock_" + Date.now() });
    };

    const handleClose = () => {
        Fleetbo.close("");
    };

    return (
        <div className="d-flex flex-column h-100 bg-white" style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <div className="p-3 d-flex flex-column align-items-center flex-grow-1">
                <h4 className="mb-4 mt-2 text-dark">Nouveau Guest</h4>
                
                <div 
                    className="rounded-circle d-flex align-items-center justify-content-center mb-4"
                    style={{ 
                        width: '100px', 
                        height: '100px', 
                        backgroundColor: '#D3D3D3', 
                        cursor: 'default',
                        overflow: 'hidden',
                        transition: 'transform 0.1s'
                    }}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={handlePickImage}
                >
                    {selectedImageUri ? (
                        <img src={selectedImageUri} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ color: '#555' }}>Photo</span>
                    )}
                </div>

                <div className="w-100 mb-3">
                    <label className="form-label text-muted small mb-1">Prénom</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="w-100 mb-4">
                    <label className="form-label text-muted small mb-1">Nom</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="w-100 d-flex justify-content-between mt-auto mb-3">
                    <div 
                        className="text-secondary fw-bold p-2" 
                        style={{ cursor: 'default' }}
                        onClick={handleClose}
                    >
                        ANNULER
                    </div>
                    <div 
                        className={`fw-bold p-2 rounded ${firstName && lastName ? 'text-primary' : 'text-muted'}`} 
                        style={{ cursor: 'default' }}
                        onClick={handleSubmit}
                    >
                        ENREGISTRER
                    </div>
                </div>
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-23 at 16:34:04
