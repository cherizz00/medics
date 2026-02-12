import React, { useState, useEffect } from 'react';
import { IconRecords, IconLock, IconPlus, IconChevronLeft, IconChevronRight, IconShieldCheck, IconSparkles } from './Icons';

const VaultView = ({ onBack }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pin, setPin] = useState('');
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleUnlock = async () => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/vault/unlock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ pin })
            });
            const data = await response.json();
            if (data.success) {
                setIsUnlocked(true);
                fetchFiles();
            } else {
                alert('Incorrect PIN');
                setPin('');
            }
        } catch (err) { console.error(err); }
    };

    const fetchFiles = async () => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/vault/files', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setFiles(await response.json());
            }
        } catch (err) { console.error(err); }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/vault/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                fetchFiles();
            } else {
                alert('Upload failed');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    if (!isUnlocked) {
        return (
            <div className="page-container flex-center" style={{ background: 'white', padding: '24px' }}>
                <div className="medical-card animate-fade" style={{ width: '100%', maxWidth: '400px', padding: '48px 32px', borderRadius: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div className="holographic-glow" style={{ opacity: 0.1, background: 'var(--primary)' }} />

                    <div className="flex-center" style={{
                        width: '88px', height: '88px', borderRadius: '28px',
                        background: 'var(--premium-dark)', color: 'var(--premium-gold)',
                        margin: '0 auto 32px', position: 'relative', zIndex: 1,
                        boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)'
                    }}>
                        <IconLock size={40} />
                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                            <IconSparkles size={18} />
                        </div>
                    </div>

                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '8px', color: 'var(--premium-dark)', position: 'relative', zIndex: 1 }}>Secure Vault</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '40px', fontWeight: '600', position: 'relative', zIndex: 1 }}>Clinical Decryption Required</p>

                    <div style={{ marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                        <input
                            type="password"
                            value={pin}
                            onChange={e => setPin(e.target.value)}
                            placeholder="••••"
                            maxLength="4"
                            className="input-field"
                            style={{ fontSize: '2.5rem', textAlign: 'center', letterSpacing: '0.4em', height: '80px', borderRadius: '20px', fontWeight: '950', background: '#F8FAFC' }}
                            autoFocus
                        />
                    </div>

                    <button onClick={handleUnlock} className="btn btn-primary" style={{ width: '100%', height: '64px', borderRadius: '18px', fontWeight: '950', fontSize: '1.1rem', position: 'relative', overflow: 'hidden' }}>
                        <div className="holographic-glow" style={{ opacity: 0.2 }} />
                        UNLOCK CLINICAL VAULT
                    </button>
                    <button onClick={onBack} className="btn btn-ghost" style={{ marginTop: '20px', color: 'var(--text-muted)', fontWeight: '700' }}>
                        Return to Dashboard
                    </button>

                    <div style={{ marginTop: '40px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', position: 'relative', zIndex: 1 }}>
                        AES-256 Bank-Level Encryption Active
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ background: 'var(--bg-app)', padding: '0 24px' }}>
            <header className="animate-fade" style={{ padding: '24px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '44px', height: '44px', borderRadius: '14px', padding: 0 }}>
                    <IconChevronLeft size={24} />
                </button>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0, color: 'var(--premium-dark)' }}>Secret Vault</h3>
            </header>

            <main className="scroll-content animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '120px' }}>
                <div className="medical-card" style={{
                    background: 'var(--premium-dark)', color: 'white', border: 'none',
                    padding: '24px', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '5rem', opacity: 0.1 }}>🛡️</div>
                    <div className="flex-center" style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '16px' }}>
                        <IconLock size={20} style={{ color: 'var(--premium-gold)' }} />
                    </div>
                    <h4 style={{ color: 'white', marginBottom: '4px', fontSize: '1.1rem', fontWeight: '900' }}>Clinical Grade Encryption</h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', lineHeight: '1.5', margin: 0 }}>Your most sensitive medical records are protected by AES-256 bank-level encryption. Only you hold the key.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="flex-between" style={{ padding: '0 4px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--premium-dark)' }}>Secure Records</span>
                        <label className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '900', color: 'var(--primary)' }}>
                            + SECURE NEW FILE
                            <input type="file" hidden onChange={handleFileUpload} />
                        </label>
                    </div>

                    {uploading && (
                        <div className="medical-card animate-pulse" style={{ padding: '16px', textAlign: 'center', background: 'white', color: 'var(--primary)', fontWeight: '800', fontSize: '0.85rem' }}>
                            🔒 Encrypting & Securing...
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {files.length === 0 && !uploading && (
                            <div className="flex-center" style={{ flexDirection: 'column', minHeight: '300px', background: 'white', borderRadius: '32px', border: '1px dashed var(--border)', padding: '40px' }}>
                                <div style={{ color: 'var(--text-muted)', marginBottom: '24px', opacity: 0.3 }}><IconLock size={64} /></div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--premium-dark)', margin: '0 0 8px' }}>Vault is Empty</h4>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', maxWidth: '240px', fontWeight: '600' }}>Add sensitive medical records that require maximum encryption.</p>
                            </div>
                        )}

                        {files.map((file, i) => (
                            <div key={file._id} className="medical-card animate-fade" style={{
                                display: 'flex', alignItems: 'center', gap: '20px',
                                padding: '20px', background: 'white', animationDelay: `${i * 0.05}s`,
                                borderRadius: '24px', border: '1px solid #F1F5F9'
                            }}>
                                <div className="flex-center" style={{ width: '56px', height: '56px', background: 'var(--premium-dark)', color: 'var(--premium-gold)', borderRadius: '18px', flexShrink: 0 }}>
                                    <IconShieldCheck size={28} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--premium-dark)' }}>{file.filename}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                                        <span style={{ color: 'var(--primary)', letterSpacing: '0.05em' }}>VAULT-SECURED</span>
                                        <span style={{ opacity: 0.3 }}>•</span>
                                        <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <IconChevronRight size={20} color="var(--border)" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VaultView;
