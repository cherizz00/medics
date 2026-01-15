import React, { useState } from 'react';
import { IconStyles } from './Icons';

// Shared Header Component for consistency
const SubHeader = ({ title, onBack }) => (
    <header className="premium-header anim-slide-up">
        <div className="h-top" style={{ marginBottom: 0, gap: '16px' }}>
            <button onClick={onBack} style={{
                background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
                width: '36px', height: '36px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
            </button>
            <h3 style={{
                fontSize: '1.2rem', margin: 0, fontWeight: '800',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
            }}>{title}</h3>
            <div style={{ width: 36, flexShrink: 0 }}></div>
        </div>
    </header>
);


export const SharedAccessView = ({ onBack }) => {
    const [shares, setShares] = useState([
        { id: 1, name: 'Dr. Sarah Wilson', hospital: 'Apollo Hospital', expiry: 'Expires in 2 days', status: 'Active' },
        { id: 2, name: 'City Lab Diagnostics', hospital: 'Lab Report Access', expiry: 'Expires in 24 hours', status: 'Active' }
    ]);

    return (
        <div className="page-container">


            <SubHeader title="Shared Access" onBack={onBack} />
            <main className="scroll-content" style={{ padding: '24px 0', gap: '20px', display: 'flex', flexDirection: 'column' }}>

                <div className="anim-slide-up" style={{
                    background: 'var(--primary-light)', padding: '18px', borderRadius: '20px',
                    display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary-dark)',
                    fontSize: '0.9rem', fontWeight: '600', border: '1px solid var(--primary-subtle)'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🔐</span>
                    <p style={{ margin: 0 }}>Your data is end-to-end encrypted. You can revoke any doctor's access instantly.</p>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '8px' }}>Active Shares</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {shares.map(share => (
                        <div key={share.id} className="premium-card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '4px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{share.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{share.hospital}</p>
                                </div>
                                <span style={{
                                    background: '#DCFCE7', color: '#166534', padding: '4px 10px',
                                    borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0
                                }}>{share.status}</span>

                            </div>
                            <div style={{ height: '1px', background: 'var(--border-light)', margin: '12px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>🕒 {share.expiry}</span>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Revoke access for ' + share.name + '?')) {
                                            setShares(shares.filter(s => s.id !== share.id));
                                        }
                                    }}
                                    style={{
                                        color: 'var(--error)', background: 'none', border: 'none',
                                        fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer'
                                    }}>Revoke</button>
                            </div>
                        </div>
                    ))}
                    {shares.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active shares</p>
                    )}
                </div>

                <button className="btn-primary" style={{ marginTop: '12px', width: '100%', padding: '16px', borderRadius: '20px', fontWeight: '800' }}>+ Share New Access</button>
            </main>
        </div>
    );
};

export const SecurityView = ({ onBack }) => {
    const [toggles, setToggles] = useState({ biometric: true, twoFa: false, pin: true });

    const Toggle = ({ active, onClick }) => (
        <div onClick={onClick} style={{
            width: '44px', height: '24px', background: active ? 'var(--primary)' : '#E5E7EB',
            borderRadius: '12px', padding: '2px', transition: '0.3s', cursor: 'pointer', position: 'relative'
        }}>
            <div style={{
                width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                transition: '0.3s', transform: active ? 'translateX(20px)' : 'translateX(0)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}></div>
        </div>
    );

    return (
        <div className="page-container">


            <SubHeader title="Security Settings" onBack={onBack} />
            <main className="scroll-content" style={{ padding: '24px 0', gap: '16px', display: 'flex', flexDirection: 'column' }}>

                <div className="premium-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>Biometric Login</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FaceID / Fingerprint</p>
                    </div>
                    <Toggle active={toggles.biometric} onClick={() => setToggles({ ...toggles, biometric: !toggles.biometric })} />
                </div>

                <div className="premium-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>App Lock (PIN)</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ask for PIN on opening</p>
                    </div>
                    <Toggle active={toggles.pin} onClick={() => setToggles({ ...toggles, pin: !toggles.pin })} />
                </div>

                <div className="premium-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '4px' }}>2-Factor Auth</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SMS verification</p>
                    </div>
                    <Toggle active={toggles.twoFa} onClick={() => setToggles({ ...toggles, twoFa: !toggles.twoFa })} />
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '24px', lineHeight: '1.6' }}>
                    Last secure login: Today, 10:30 AM <br /> Device: iPhone 13 Pro
                </p>
            </main>
        </div>
    );
};

export const StorageView = ({ onBack }) => {
    return (
        <div className="page-container">


            <SubHeader title="Storage Usage" onBack={onBack} />
            <main className="scroll-content" style={{ padding: '24px 0', gap: '24px', display: 'flex', flexDirection: 'column' }}>

                <div className="premium-card" style={{
                    padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
                }}>
                    <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                        <svg viewBox="0 0 36 36" style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '100%' }}>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3.8" />
                            <path strokeDasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.8" strokeLinecap="round" stroke="var(--primary)" style={{ animation: 'progress 1s ease-out forwards' }} />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-main)' }}>45%</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Used</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: 'var(--text-main)' }}>2.25 GB / 5 GB</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Standard Plan</p>
                        <button
                            onClick={() => alert("Premium plans are coming soon!")}
                            style={{
                                marginTop: '12px', background: 'var(--text-main)', color: 'white',
                                border: 'none', padding: '8px 16px', borderRadius: '20px',
                                fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer'
                            }}>Upgrade Plan</button>
                    </div>
                </div>

                <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '16px' }}>Breakdown</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="premium-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{
                                width: '40px', height: '40px', borderRadius: '10px', background: '#E3F2FD',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                flexShrink: 0
                            }}>📄</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Lab Reports</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>1.2 GB</p>
                            </div>
                            <span style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }}>50%</span>
                        </div>

                        <div className="premium-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{
                                width: '40px', height: '40px', borderRadius: '10px', background: '#E8F5E9',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                flexShrink: 0
                            }}>🖼️</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Scans (X-Ray, MRI)</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>800 MB</p>
                            </div>
                            <span style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }}>35%</span>
                        </div>

                        <div className="premium-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{
                                width: '40px', height: '40px', borderRadius: '10px', background: '#FFF3E0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                flexShrink: 0
                            }}>💊</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Prescriptions</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>250 MB</p>
                            </div>
                            <span style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }}>15%</span>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};
