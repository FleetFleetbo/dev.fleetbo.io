import { useState, useEffect } from 'react';

export default function ProfileCreator() {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [phone, setPhone] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [, setCollection] = useState('users');

    useEffect(() => {
        try {
            const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
            if (hashParams.has('collection')) {
                setCollection(hashParams.get('collection'));
            }
        } catch (e) {
            // Ignore
        }
    }, []);

    const handleImagePick = () => {
        const index = Math.floor(Math.random() * 10);
        setImageUri(`https://fleetbo.io/images/console/gallery/${index}.png`);
    };

    const handleSubmit = () => {
        setTimeout(() => {
            Fleetbo.close({
                success: true,
                documentId: "mock_" + Date.now(),
                imageUrl: imageUri
            });
        }, 800);
    };

    const handleClose = () => {
        Fleetbo.close();
    };

    return (
        <div className="d-flex flex-column h-100 bg-white p-3" style={{ width: '100%', overflow: 'hidden' }}>
            <h4 className="mb-3">Créer un Profil</h4>
            
            <div 
                className="mb-3 d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ cursor: 'default', height: '48px', backgroundColor: '#6200ee', borderRadius: '4px', transition: 'transform 0.1s' }}
                onClick={handleImagePick}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                {imageUri ? "IMAGE SÉLECTIONNÉE" : "CHOISIR UNE IMAGE"}
            </div>

            <div className="mb-2">
                <label className="form-label text-muted small mb-1">Nom</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
            </div>

            <div className="mb-2">
                <label className="form-label text-muted small mb-1">Bio</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                />
            </div>

            <div className="mb-4">
                <label className="form-label text-muted small mb-1">Téléphone</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                />
            </div>

            <div className="mt-auto d-flex justify-content-between align-items-center">
                <div 
                    className="text-secondary fw-bold" 
                    style={{ cursor: 'default', padding: '10px' }} 
                    onClick={handleClose}
                >
                    ANNULER
                </div>
                <div 
                    className="fw-bold"
                    style={{ cursor: 'default', padding: '10px 20px', backgroundColor: '#6200ee', color: 'white', borderRadius: '4px', transition: 'transform 0.1s' }}
                    onClick={handleSubmit}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    ENREGISTRER
                </div>
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-11 at 23:10:26