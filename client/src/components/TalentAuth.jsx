import React, { useState } from 'react';
import { IconLock, IconProfile, IconLogo, IconSparkles, IconChevronLeft } from './Icons';

const TalentAuth = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('medics_token', data.token);
                localStorage.setItem('medics_user', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError(`Connection Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container flex-center" style={{
            background: 'radial-gradient(circle at top left, #F8FAFC, #EFF6FF, #F1F5F9)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decorative Elements */}
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(92, 86, 214, 0.05) 0%, transparent 70%)', borderRadius: '50%' }} />

            <div style={{
                width: '100%',
                maxWidth: '440px',
                padding: '48px 32px',
                borderRadius: '32px',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '28px', display: 'inline-block' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                padding: '4px',
                                background: 'white',
                                borderRadius: '24px',
                                boxShadow: '0 10px 20px rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(255,255,255,0.8)'
                            }}>
                                <IconLogo size={72} />
                            </div>
                            <div style={{ position: 'absolute', top: '-14px', right: '-14px', color: '#5C56D6' }}>
                                <IconSparkles size={32} />
                            </div>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '950', color: '#5C56D6', margin: '0 0 8px', letterSpacing: '-0.06em' }}>Staff Terminal</h1>
                    <p style={{ color: '#5C56D6', fontSize: '1rem', fontWeight: '700', opacity: 0.9 }}>
                        Clinical Professional Intelligence
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 1 }}>
                    {error && (
                        <div style={{
                            padding: '16px', borderRadius: '16px', background: '#FEF2F2',
                            color: 'var(--error)', fontSize: '0.85rem', fontWeight: '800', textAlign: 'center',
                            border: '1px solid #FEE2E2',
                            animation: 'shake 0.4s ease-in-out'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: '900', color: 'var(--text-muted)' }}>CLINICAL IDENTIFIER</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="professional@medics.com"
                            className="input-field"
                            style={{
                                borderRadius: '20px',
                                height: '64px',
                                fontSize: '1.1rem',
                                fontWeight: '800',
                                background: 'white',
                                border: '1.5px solid rgba(0,0,0,0.05)',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}
                            required
                            autoFocus
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className="text-label" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', fontWeight: '900', color: 'var(--text-muted)' }}>SYSTEM KEY</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-field"
                            style={{
                                borderRadius: '20px',
                                height: '64px',
                                fontSize: '1.1rem',
                                fontWeight: '800',
                                background: 'white',
                                border: '1.5px solid rgba(0,0,0,0.05)',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{
                            height: '64px',
                            borderRadius: '20px',
                            fontWeight: '950',
                            fontSize: '1.25rem',
                            position: 'relative',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, #5C56D6 0%, #4338CA 100%)',
                            boxShadow: '0 12px 28px -6px rgba(92, 86, 214, 0.45)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            marginTop: '8px',
                            border: 'none',
                            color: 'white',
                            letterSpacing: '-0.01em'
                        }}
                    >
                        {isLoading ? (
                            <div className="flex-center" style={{ gap: '12px' }}>
                                <div style={{ width: '24px', height: '24px', border: '3.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                <span>Verifying Terminal...</span>
                            </div>
                        ) : 'Establish Secure Connection'}
                    </button>

                    <button
                        type="button"
                        onClick={onBack}
                        className="btn-ghost"
                        style={{
                            marginTop: '12px',
                            color: 'var(--text-secondary)',
                            fontWeight: '800',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: 0.8
                        }}
                    >
                        <IconChevronLeft size={18} /> BACK TO MEMBER PORTAL
                    </button>
                </form>

                <div style={{
                    marginTop: '40px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.6',
                    fontWeight: '700',
                    position: 'relative',
                    zIndex: 1,
                    opacity: 0.6
                }}>
                    Enterprise Clinical Security Environment.<br />
                    Session data is cryptographically audited.
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                button:active {
                    transform: scale(0.98);
                }
                .input-field:focus {
                    border-color: #10B981 !important;
                    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default TalentAuth;
