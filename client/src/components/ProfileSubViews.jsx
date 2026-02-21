import React, { useState } from 'react';
import { IconPhone, IconMail, IconChevronLeft, IconChevronRight, IconLock, IconShieldCheck, IconSparkles, IconHelp, IconSearch, IconActivity, IconClock, IconLaboratory, IconScans, IconMedicine } from './Icons';
import SubHeader from './common/SubHeader';

export const SharedAccessView = ({ onBack }) => {
    const [shares, setShares] = useState([
        { id: 1, name: 'Dr. Sarah Wilson', hospital: 'Apollo Hospital', expiry: 'Expires in 2 days', status: 'Active' },
        { id: 2, name: 'City Lab Diagnostics', hospital: 'Lab Report Access', expiry: 'Expires in 24 hours', status: 'Active' }
    ]);

    return (
        <div className="page-container" style={{ background: 'white' }}>
            <SubHeader title="Shared Access" onBack={onBack} />
            <main className="scroll-content">

                <div style={{
                    background: 'var(--primary-subtle)', padding: '16px', borderRadius: '16px',
                    display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary-dark)',
                    fontSize: '0.85rem', fontWeight: '600', border: '1px solid rgba(37, 99, 235, 0.1)',
                    marginBottom: '20px'
                }}>
                    <IconLock />
                    <p style={{ margin: 0 }}>Your data is end-to-end encrypted. You can revoke any doctor's access instantly.</p>
                </div>

                <h4 className="text-label">Active Shares</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {shares.map(share => (
                        <div key={share.id} className="medical-card">
                            <div className="flex-between" style={{ marginBottom: '12px' }}>
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '2px' }}>{share.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{share.hospital}</p>
                                </div>
                                <span style={{
                                    background: '#dcfce7', color: '#166534', padding: '4px 10px',
                                    borderRadius: '99px', fontSize: '0.7rem', fontWeight: '800'
                                }}>{share.status}</span>
                            </div>
                            <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
                            <div className="flex-between">
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
                                    <IconClock size={14} /> {share.expiry}
                                </span>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Revoke access for ' + share.name + '?')) {
                                            setShares(shares.filter(s => s.id !== share.id));
                                        }
                                    }}
                                    style={{
                                        color: 'var(--error)', background: 'none', border: 'none',
                                        fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
                                    }}>Revoke Access</button>
                            </div>
                        </div>
                    ))}
                    {shares.length === 0 && (
                        <div className="medical-card" style={{ textAlign: 'center', borderStyle: 'dashed' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active shares</p>
                        </div>
                    )}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', height: '56px', marginTop: '24px' }}>+ Share New Access</button>
            </main>
        </div>
    );
};

export const SecurityView = ({ onBack }) => {
    const [toggles, setToggles] = useState({ biometric: true, twoFa: false, pin: true });

    const Toggle = ({ active, onClick }) => (
        <div onClick={onClick} style={{
            width: '44px', height: '24px', background: active ? 'var(--primary)' : 'var(--border)',
            borderRadius: '99px', padding: '2px', cursor: 'pointer', position: 'relative'
        }}>
            <div style={{
                width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                transform: active ? 'translateX(20px)' : 'translateX(0)',
                boxShadow: 'var(--shadow-sm)'
            }}></div>
        </div>
    );

    return (
        <div className="page-container" style={{ background: 'white' }}>
            <SubHeader title="Security" onBack={onBack} />
            <main className="scroll-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="medical-card flex-between">
                    <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800' }}>Biometric Login</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>FaceID / Fingerprint</p>
                    </div>
                    <Toggle active={toggles.biometric} onClick={() => setToggles({ ...toggles, biometric: !toggles.biometric })} />
                </div>

                <div className="medical-card flex-between">
                    <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800' }}>App Lock (PIN)</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Require PIN on open</p>
                    </div>
                    <Toggle active={toggles.pin} onClick={() => setToggles({ ...toggles, pin: !toggles.pin })} />
                </div>

                <div className="medical-card flex-between">
                    <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '800' }}>Two-Factor Auth</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SMS verification</p>
                    </div>
                    <Toggle active={toggles.twoFa} onClick={() => setToggles({ ...toggles, twoFa: !toggles.twoFa })} />
                </div>

                <div className="medical-card" style={{ background: 'var(--primary-subtle)', borderColor: 'rgba(37,99,235,0.1)', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>
                        Last secure login: Today, 10:30 AM <br />
                        <span style={{ opacity: 0.8, fontWeight: '500' }}>Device: medical_mobile_id_01</span>
                    </p>
                </div>
            </main>
        </div>
    );
};

export const StorageView = ({ onBack }) => {
    return (
        <div className="page-container" style={{ background: 'white' }}>
            <SubHeader title="Storage" onBack={onBack} />
            <main className="scroll-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <div className="medical-card flex-center" style={{ flexDirection: 'column', gap: '20px', padding: '32px 16px' }}>
                    <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary-subtle)" strokeWidth="3" />
                            <path strokeDasharray="45, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeLinecap="round" stroke="var(--primary)" />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>45%</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Used</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>2.25 GB / 5 GB</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Standard Storage Plan</p>
                        <button onClick={() => alert("Upgrades soon!")} className="btn btn-ghost" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '0.8rem' }}>Manage Storage</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 className="text-label">Breakdown</h4>
                    {[
                        { icon: <IconLaboratory />, label: 'Lab Reports', size: '1.2 GB', pct: '50%', color: '#10B981' },
                        { icon: <IconScans />, label: 'Medical Scans', size: '800 MB', pct: '35%', color: '#F59E0B' },
                        { icon: <IconMedicine />, label: 'Prescriptions', size: '250 MB', pct: '15%', color: '#3B82F6' }
                    ].map((item, i) => (
                        <div key={i} className="medical-card flex-between" style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="flex-center" style={{ width: '44px', height: '44px', background: 'var(--bg-app)', borderRadius: '12px', color: item.color }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800' }}>{item.label}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.size}</p>
                                </div>
                            </div>
                            <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--primary)' }}>{item.pct}</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export const FAQView = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const faqs = [
        { q: 'How is my medical data secured?', a: 'We use military-grade AES-256 encryption. Only you and authorized doctors can access your records through our secure clinical gateway.', icon: <IconShieldCheck /> },
        { q: 'Can I add my family members?', a: 'Yes, you can add up to 6 family members under the Gold plan. Each member gets their own secure clinical profile.', icon: <IconLock /> },
        { q: 'How accurate is the AI Health Bot?', a: 'Our AI provides preliminary triage based on 10M+ medical records, offering 98% accuracy in symptom assessment, but does not replace a doctor.', icon: <IconActivity /> },
        { q: 'Where are my reports stored?', a: 'All reports are stored in our secure clinical cloud, accessible anytime through your personal Vault.', icon: <IconSparkles /> }
    ];

    const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="page-container" style={{ background: 'white' }}>
            <header style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0 }}>
                    <IconChevronLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0, color: 'var(--premium-dark)' }}>Help Center</h2>
            </header>

            <main className="scroll-content" style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '0 24px 120px' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                        <IconSearch size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '48px', height: '56px', borderRadius: '18px', background: '#F8FAFC', border: '1.5px solid #F1F5F9', fontSize: '0.95rem', fontWeight: '700' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="medical-card" style={{ padding: '24px', textAlign: 'center', background: 'var(--primary-subtle)', border: 'none' }}>
                        <div className="flex-center" style={{ width: '44px', height: '44px', background: 'white', borderRadius: '14px', margin: '0 auto 12px', color: 'var(--primary)' }}>
                            <IconMail size={20} />
                        </div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: '900' }}>Email Us</h4>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800' }}>24/7 Response</p>
                    </div>
                    <div className="medical-card" style={{ padding: '24px', textAlign: 'center', background: '#F1F5F9', border: 'none' }}>
                        <div className="flex-center" style={{ width: '44px', height: '44px', background: 'white', borderRadius: '14px', margin: '0 auto 12px', color: 'var(--premium-dark)' }}>
                            <IconPhone size={20} />
                        </div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: '900' }}>Call Us</h4>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '800' }}>Expert Team</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 className="text-label" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>TOP RELEVANT QUESTIONS</h4>
                    {filteredFaqs.map((item, i) => (
                        <div key={i} className="medical-card" style={{ padding: '24px', borderRadius: '24px' }}>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <div className="flex-center" style={{ width: '40px', height: '40px', background: '#F8FAFC', borderRadius: '12px', color: 'var(--primary)', flexShrink: 0 }}>
                                    {item.icon}
                                </div>
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', lineHeight: '1.4', color: 'var(--premium-dark)' }}>{item.q}</h4>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem', fontWeight: '600' }}>{item.a}</p>
                        </div>
                    ))}
                    {filteredFaqs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontWeight: '700' }}>
                            <IconHelp size={40} style={{ opacity: 0.2, marginBottom: '12px' }} /><br />
                            No matching questions found.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
