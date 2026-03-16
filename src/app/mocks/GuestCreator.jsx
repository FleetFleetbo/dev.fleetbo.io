import React, { useState } from 'react';
import { fleetboDB } from '@fleetbo';

export default function GuestCreator() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const getCollection = () => {
        try {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const params = JSON.parse(decodeURIComponent(hash));
                return params.collection || 'guests';
            }
        } catch (e) {}
        return 'guests';
    };

    const handleSave = async () => {
        if (!firstName || !lastName || isSaving) return;
        setIsSaving(true);
        
        try {
            const data = { firstName, lastName };
            const collection = getCollection();
            
            const savePromise = Fleetbo.add(fleetboDB, collection, JSON.stringify(data));
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));
            
            const result = await Promise.race([savePromise, timeoutPromise]);
            Fleetbo.close(result);
        } catch (error) {
            Fleetbo.close({ success: false, error: error.message });
        }
    };

    const handleCancel = () => {
        Fleetbo.close("");
    };

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: '#FAF9F6', fontFamily: 'serif' }}>
            <div className="p-3">
                <h2 className="fw-bold mb-2" style={{ color: '#2C3E50', fontSize: '24px' }}>New Guest</h2>
                <div style={{ height: '2px', backgroundColor: '#D4AF37', width: '100%', marginBottom: '24px' }}></div>
                
                <div className="mb-3">
                    <label className="form-label" style={{ color: '#2C3E50', fontFamily: 'sans-serif', fontSize: '14px' }}>First Name</label>
                    <input 
                        type="text" 
                        className="form-control p-3" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #CED4DA', borderRadius: '4px', fontFamily: 'sans-serif' }}
                    />
                </div>
                
                <div className="mb-4">
                    <label className="form-label" style={{ color: '#2C3E50', fontFamily: 'sans-serif', fontSize: '14px' }}>Last Name</label>
                    <input 
                        type="text" 
                        className="form-control p-3" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #CED4DA', borderRadius: '4px', fontFamily: 'sans-serif' }}
                    />
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4" style={{ fontFamily: 'sans-serif' }}>
                    <div 
                        className="p-2 fw-bold"
                        style={{ color: '#2C3E50', cursor: 'default', opacity: isSaving ? 0.5 : 1 }}
                        onClick={!isSaving ? handleCancel : undefined}
                    >
                        CANCEL
                    </div>
                    <div 
                        className="px-4 py-2 rounded fw-bold text-white shadow-sm"
                        style={{ 
                            backgroundColor: '#D4AF37', 
                            cursor: 'default',
                            opacity: (!firstName || !lastName || isSaving) ? 0.6 : 1,
                            transition: 'transform 0.1s'
                        }}
                        onTouchStart={(e) => { if (firstName && lastName && !isSaving) e.currentTarget.style.transform = 'scale(0.95)' }}
                        onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseDown={(e) => { if (firstName && lastName && !isSaving) e.currentTarget.style.transform = 'scale(0.95)' }}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={handleSave}
                    >
                        {isSaving ? 'SAVING...' : 'SAVE'}
                    </div>
                </div>
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-13 at 02:49:12