import React, { useState, useEffect, useMemo } from 'react';
import { fleetboDB } from '@fleetbo';

export default function GuestList() {
    const [guests, setGuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await Fleetbo.getDocsG(fleetboDB, 'guests');
                if (result && result.success) {
                    setGuests(result.data || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Optimisation : Mémorisation de la liste triée pour éviter les re-calculs inutiles
    const sortedGuests = useMemo(() => {
        return [...guests].sort((a, b) => 
            (a.firstName || '').localeCompare(b.firstName || '')
        );
    }, [guests]);

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: '#F8F9FA', paddingBottom: '80px' }}>
            <div className="bg-white shadow-sm p-3 sticky-top">
                <h4 className="mb-0 fw-bold text-dark">Liste des Invités</h4>
            </div>

            <div className="flex-grow-1 overflow-auto p-3">
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="spinner-border text-dark" role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {sortedGuests.map((guest, index) => (
                            <div key={guest.id || index} className="bg-white p-3 rounded shadow-sm" style={{ cursor: 'default' }}>
                                <div className="fw-bold text-dark">
                                    {guest.firstName || 'Prénom'} {guest.lastName || 'Nom'}
                                </div>
                                <div className="small" style={{ color: guest.status === 'Confirmé' ? '#4CAF50' : '#6c757d' }}>
                                    {guest.status || 'En attente'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3 bg-white border-top">
                <div 
                    className="d-flex align-items-center justify-content-center bg-dark text-white rounded fw-bold"
                    style={{ height: '50px', cursor: 'default', transition: 'transform 0.1s' }}
                    onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => Fleetbo.emit('OPEN_CREATOR', {})}
                >
                    AJOUTER UN INVITÉ
                </div>
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-23 at 23:35:44
