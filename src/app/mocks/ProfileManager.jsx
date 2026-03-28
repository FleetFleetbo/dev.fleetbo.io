import React, { useState, useEffect, useMemo } from 'react';
import { fleetboDB } from '@fleetbo';

export default function ProfileManager() {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [inputUsername, setInputUsername] = useState('');
    const [inputPhone, setInputPhone] = useState('');

    const avatarLetter = useMemo(() => {
        return profile?.username ? profile.username.charAt(0).toUpperCase() : '?';
    }, [profile?.username]);

    const isFormValid = useMemo(() => {
        return inputUsername.trim() !== '' && inputPhone.trim() !== '';
    }, [inputUsername, inputPhone]);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const result = await Fleetbo.getDocsU(fleetboDB, 'users');
                if (result && result.success && result.data && result.data.length > 0) {
                    setProfile(result.data[0]);
                } else {
                    setProfile(null);
                }
            } catch (error) {
                console.error(error);
                setProfile(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [refreshTrigger]);

    const handleSave = async () => {
        if (!isFormValid) return;
        setIsLoading(true);
        try {
            const payload = {
                userId: "mock_user_id",
                username: inputUsername,
                phoneNumber: inputPhone,
                dateCreated: "2026-03-28"
            };
            await Fleetbo.add(fleetboDB, 'users', JSON.stringify(payload));
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: '#F8F9FA', paddingBottom: '80px' }}>
            <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center p-4">
                {isLoading ? (
                    <div className="spinner-border" style={{ color: '#0E904D' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : profile ? (
                    <div className="d-flex flex-column align-items-center w-100">
                        <div 
                            className="rounded-circle d-flex align-items-center justify-content-center mb-4"
                            style={{ width: '100px', height: '100px', backgroundColor: '#0E904D', color: 'white', fontSize: '40px', fontWeight: 'bold' }}
                        >
                            {avatarLetter}
                        </div>
                        
                        <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '24px' }}>{profile.username}</h2>
                        <span className="text-secondary mb-1" style={{ fontSize: '16px' }}>{profile.phoneNumber}</span>
                        {profile.dateCreated && (
                            <span className="text-muted mb-5" style={{ fontSize: '14px' }}>Member since: {profile.dateCreated}</span>
                        )}

                        <div 
                            className="d-flex align-items-center justify-content-center text-white rounded mb-3"
                            style={{ width: '80%', height: '50px', backgroundColor: 'black', fontWeight: 'bold', cursor: 'default' }}
                            onClick={() => Fleetbo.emit('OPEN_EDIT_PROFILE', {})}
                        >
                            EDIT PROFILE
                        </div>

                        <div 
                            className="d-flex align-items-center justify-content-center text-white rounded"
                            style={{ width: '80%', height: '50px', backgroundColor: '#DC3545', fontWeight: 'bold', cursor: 'default' }}
                            onClick={() => Fleetbo.emit('LOGOUT', {})}
                        >
                            LOGOUT
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column align-items-center w-100">
                        <h2 className="fw-bold text-dark mb-2" style={{ fontSize: '24px' }}>Create your profile</h2>
                        <span className="text-secondary mb-4" style={{ fontSize: '14px' }}>Please provide your information.</span>

                        <div className="w-100 mb-3">
                            <label className="form-label text-secondary" style={{ fontSize: '12px' }}>Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={inputUsername}
                                onChange={(e) => setInputUsername(e.target.value)}
                                style={{ height: '50px' }}
                            />
                        </div>

                        <div className="w-100 mb-5">
                            <label className="form-label text-secondary" style={{ fontSize: '12px' }}>Phone number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={inputPhone}
                                onChange={(e) => setInputPhone(e.target.value)}
                                style={{ height: '50px' }}
                            />
                        </div>

                        <div 
                            className="d-flex align-items-center justify-content-center text-white rounded"
                            style={{ 
                                width: '80%', 
                                height: '50px', 
                                backgroundColor: isFormValid ? '#0E904D' : '#D3D3D3', 
                                fontWeight: 'bold', 
                                cursor: 'default',
                                pointerEvents: isFormValid ? 'auto' : 'none'
                            }}
                            onClick={handleSave}
                        >
                            SAVE
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-28 at 23:03:31
