import React, { useState, useEffect } from 'react';
import { fleetboDB } from '@fleetbo';
import { Plus } from 'lucide-react';

export default function GuestList() {
    const [guests, setGuests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        Fleetbo.listenToDocs(fleetboDB, 'guests', (data) => {
            setGuests(data || []);
        });

        return () => {
            Fleetbo.stopListening(fleetboDB, 'guests');
        };
    }, []);

    const filteredGuests = guests.filter(g => 
        (g.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.lastName || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="d-flex flex-column h-100 position-relative" style={{ backgroundColor: '#FAF9F6', paddingBottom: '80px' }}>
            <div className="p-3 d-flex flex-column flex-grow-1 overflow-hidden">
                <h2 className="mb-2 fw-bold" style={{ fontFamily: 'serif', color: '#2C3E50', fontSize: '24px' }}>
                   Guests List
                </h2>
                <div style={{ height: '2px', backgroundColor: '#D4AF37', width: '100%', marginBottom: '16px' }} />
                
                <input 
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search Guest..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ backgroundColor: 'white', borderColor: '#ced4da' }}
                />

                <div className="flex-grow-1 overflow-auto">
                    {filteredGuests.map((g, i) => (
                        <div 
                            key={g.id || i} 
                            className="p-3 mb-3 bg-white rounded" 
                            style={{ 
                                border: '1px solid #D4AF37', 
                                cursor: 'default',
                                transition: 'transform 0.1s'
                            }}
                            onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                            onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onClick={() => Fleetbo.emit('OPEN_GUEST_DETAILS', { id: g.id })}
                        >
                            <div className="fw-bold" style={{ fontSize: '18px', color: '#2C3E50' }}>
                                {g.firstName} {g.lastName}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button */}
            <div 
                className="position-absolute d-flex align-items-center justify-content-center rounded-circle shadow"
                style={{
                    bottom: '96px',
                    right: '16px',
                    width: '56px',
                    height: '56px',
                    backgroundColor: '#D4AF37',
                    color: 'white',
                    cursor: 'default',
                    transition: 'transform 0.1s',
                    zIndex: 10
                }}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => Fleetbo.emit('OPEN_CREATOR', {})}
            >
                <Plus size={24} />
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-13 at 02:02:46