import React, { useState, useEffect } from 'react';
import { fleetboDB } from '@fleetbo';

export default function GuestManager() {
    const [mode, setMode] = useState('list');
    const [guests, setGuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedImageUri, setSelectedImageUri] = useState(null);

    const loadData = async () => {
        setIsLoading(true);
        const result = await Fleetbo.getDocsG(fleetboDB, 'guests');
        if (result && result.success) {
            setGuests(result.data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (mode === 'list') {
            loadData();
        }
    }, [mode]);

    const handleDelete = async (id) => {
        setIsLoading(true);
        await Fleetbo.delete(fleetboDB, 'guests', id);
        loadData();
    };

    const handleAddClick = () => {
        Fleetbo.emit('HIDE_NAVBAR', {});
        setFirstName('');
        setLastName('');
        setSelectedImageUri(null);
        setMode('creator');
    };

    const handleCancel = () => {
        Fleetbo.emit('SHOW_NAVBAR', {});
        setMode('list');
    };

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) return;
        const payload = { firstName, lastName };
        if (selectedImageUri) {
            payload.imageUrl = selectedImageUri;
        }
        await Fleetbo.add(fleetboDB, 'guests', JSON.stringify(payload));
        Fleetbo.emit('SHOW_NAVBAR', {});
        setMode('list');
    };

    const handlePhotoClick = () => {
        const index = Math.floor(Math.random() * 10);
        setSelectedImageUri(`https://fleetbo.io/images/console/gallery/${index}.png`);
    };

    if (mode === 'creator') {
        return (
            <div className="d-flex flex-column h-100 bg-white">
                <div className="p-3">
                    <h4 className="mb-0 fw-bold text-dark">New Guest</h4>
                </div>
                <div className="flex-grow-1 p-3 d-flex flex-column align-items-center">
                    <div 
                        className="rounded-circle d-flex flex-column align-items-center justify-content-center bg-light"
                        style={{ width: '100px', height: '100px', cursor: 'default' }}
                        onClick={handlePhotoClick}
                    >
                        {selectedImageUri ? (
                            <span className="fw-bold" style={{ color: '#0E904D', fontSize: '14px' }}>Photo OK</span>
                        ) : (
                            <>
                                <span className="text-secondary" style={{ fontSize: '24px' }}>+</span>
                                <span className="text-secondary" style={{ fontSize: '12px' }}>Photo</span>
                            </>
                        )}
                    </div>
                    <div className="w-100 mt-4">
                        <label className="form-label text-secondary small mb-1">First Name</label>
                        <input 
                            type="text" 
                            className="form-control mb-3" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label className="form-label text-secondary small mb-1">Last Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-3 d-flex gap-3">
                    <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-center border rounded"
                        style={{ height: '50px', cursor: 'default', color: '#6c757d' }}
                        onClick={handleCancel}
                    >
                        CANCEL
                    </div>
                    <div 
                        className="flex-grow-1 d-flex align-items-center justify-content-center rounded text-white"
                        style={{ 
                            height: '50px', 
                            cursor: 'default', 
                            backgroundColor: (firstName.trim() && lastName.trim()) ? '#0E904D' : '#a5d8bc',
                            pointerEvents: (firstName.trim() && lastName.trim()) ? 'auto' : 'none'
                        }}
                        onClick={handleSave}
                    >
                        SAVE
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: '#F8F9FA', paddingBottom: '80px' }}>
            <div className="bg-white p-3 shadow-sm">
                <h4 className="mb-0 fw-bold text-dark">Guest List</h4>
            </div>
            <div className="flex-grow-1 position-relative">
                {isLoading ? (
                    <div className="position-absolute top-50 start-50 translate-middle">
                        <div className="spinner-border" style={{ color: '#0E904D' }} role="status"></div>
                    </div>
                ) : guests.length === 0 ? (
                    <div className="position-absolute top-50 start-50 translate-middle text-secondary">
                        No guests yet.
                    </div>
                ) : (
                    <div className="p-3 d-flex flex-column gap-2 overflow-auto h-100">
                        {guests.map((g, i) => (
                            <div key={i} className="bg-white p-3 rounded shadow-sm d-flex align-items-center">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        backgroundColor: g.imageUrl ? '#0E904D' : 'rgba(14, 144, 77, 0.1)' 
                                    }}
                                >
                                    {g.imageUrl ? (
                                        <span className="text-white fw-bold">✓</span>
                                    ) : (
                                        <span className="fw-bold" style={{ color: '#0E904D' }}>
                                            {g.firstName ? g.firstName.charAt(0) : ''}
                                        </span>
                                    )}
                                </div>
                                <div className="ms-3 flex-grow-1">
                                    <div className="fw-bold text-dark">{g.firstName} {g.lastName}</div>
                                </div>
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '36px', height: '36px', backgroundColor: '#FFEBEB', cursor: 'default' }}
                                    onClick={() => handleDelete(g.id)}
                                >
                                    <span className="text-danger fw-bold">✕</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div 
                    className="position-absolute rounded-circle d-flex align-items-center justify-content-center shadow"
                    style={{ 
                        width: '56px', 
                        height: '56px', 
                        backgroundColor: '#0E904D', 
                        bottom: '16px', 
                        right: '16px',
                        cursor: 'default',
                        transition: 'transform 0.1s'
                    }}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={handleAddClick}
                >
                    <span className="text-white mb-1" style={{ fontSize: '24px' }}>+</span>
                </div>
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-28 at 15:19:50
