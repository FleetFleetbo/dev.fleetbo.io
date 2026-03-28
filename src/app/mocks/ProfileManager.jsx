import React, { useState, useEffect } from 'react';
import { fleetboDB } from '@fleetbo';

export default function ProfileManager() {
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateCreated, setDateCreated] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [hasProfile, setHasProfile] = useState(false);

    const [inputUsername, setInputUsername] = useState("");
    const [inputPhone, setInputPhone] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                const res = await Fleetbo.getDocsU(fleetboDB, 'users');
                if (isMounted) {
                    if (res && res.success && res.data && res.data.length > 0) {
                        const data = res.data[0];
                        setUsername(data.username || "Unknown user");
                        setPhoneNumber(data.phoneNumber || "Not provided");
                        setDateCreated(data.dateCreated || "");
                        setHasProfile(true);
                    } else {
                        setHasProfile(false);
                    }
                }
            } catch (error) {
                if (isMounted) setHasProfile(false);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        loadProfile();
        return () => { isMounted = false; };
    }, [refreshTrigger]);

    const handleSave = async () => {
        if (inputUsername && inputPhone) {
            setIsLoading(true);
            const payload = {
                username: inputUsername,
                phoneNumber: inputPhone,
                dateCreated: "2026"
            };
            await Fleetbo.addWithUserId(fleetboDB, 'users', JSON.stringify(payload));
            setRefreshTrigger(prev => prev + 1);
        }
    };

    return (
        <div className="d-flex flex-column h-100" style={{ backgroundColor: '#F8F9FA', paddingBottom: '80px' }}>
            <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center p-4">
                {isLoading ? (
                    <div className="spinner-border" style={{ color: '#0E904D' }} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : hasProfile ? (
                    <>
                        <div 
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ width: '100px', height: '100px', backgroundColor: '#0E904D', fontSize: '40px' }}
                        >
                            {username ? username.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div className="mt-4 fs-4 fw-bold text-dark">{username}</div>
                        <div className="mt-2 text-secondary">{phoneNumber}</div>
                        {dateCreated && <div className="mt-1 text-muted" style={{ fontSize: '14px' }}>Member since: {dateCreated}</div>}
                        
                        <div className="mt-5 w-100 d-flex flex-column align-items-center">
                            <div 
                                className="d-flex align-items-center justify-content-center text-white fw-bold rounded"
                                style={{ width: '80%', height: '50px', backgroundColor: '#000000', cursor: 'default', transition: 'transform 0.1s' }}
                                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onClick={() => Fleetbo.emit('OPEN_EDIT_PROFILE', {})}
                            >
                                EDIT PROFILE
                            </div>
                            <div 
                                className="d-flex align-items-center justify-content-center text-white fw-bold rounded mt-3"
                                style={{ width: '80%', height: '50px', backgroundColor: '#DC3545', cursor: 'default', transition: 'transform 0.1s' }}
                                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onClick={() => Fleetbo.emit('LOGOUT', {})}
                            >
                                LOGOUT
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="fs-4 fw-bold text-dark">Create your profile</div>
                        <div className="mt-2 text-secondary" style={{ fontSize: '14px' }}>Please provide your information.</div>
                        
                        <div className="mt-4 w-100">
                            <label className="form-label text-secondary" style={{ fontSize: '12px' }}>Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={inputUsername}
                                onChange={(e) => setInputUsername(e.target.value)}
                            />
                        </div>
                        <div className="mt-3 w-100">
                            <label className="form-label text-secondary" style={{ fontSize: '12px' }}>Phone number</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={inputPhone}
                                onChange={(e) => setInputPhone(e.target.value)}
                            />
                        </div>
                        
                        <div className="mt-5 w-100 d-flex justify-content-center">
                            <div 
                                className="d-flex align-items-center justify-content-center text-white fw-bold rounded"
                                style={{ width: '80%', height: '50px', backgroundColor: '#0E904D', cursor: 'default', transition: 'transform 0.1s' }}
                                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                onClick={handleSave}
                            >
                                SAVE
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
// ⚡ Forged by Alex on 2026-03-28 at 20:01:02
