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
                // Store token and user data
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
        <div className="page-container flex-center" style={{ background: 'white', padding: '24px' }}>
            <div className="medical-card animate-fade" style={{ width: '100%', maxWidth: '400px', padding: '40px 32px', borderRadius: '28px', border: '1px solid #F1F5F9', position: 'relative', overflow: 'hidden' }}>
                <div className="holographic-glow" style={{ opacity: 0.05 }} />

                <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '24px', display: 'inline-block' }}>
                        <div style={{ position: 'relative' }}>
                            <IconLogo size={64} />
                            <div style={{ position: 'absolute', top: '-12px', right: '-12px', color: 'var(--primary)', animation: 'float 3s infinite ease-in-out' }}>
                                <IconSparkles size={24} />
                            </div>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--premium-dark)', margin: '0 0 8px', letterSpacing: '-0.04em' }}>Staff Login</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: '600' }}>
                        Clinical Professional Intelligence
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
                    {error && (
                        <div className="animate-pop" style={{
                            padding: '14px', borderRadius: '14px', background: '#FEF2F2',
                            color: 'var(--error)', fontSize: '0.9rem', fontWeight: '700', textAlign: 'center',
                            border: '1.5px solid #FEE2E2'
                        }}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-label" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>CLINICAL EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="professional@medics.com"
                            className="input-field"
                            style={{ borderRadius: '16px', height: '60px', fontSize: '1.1rem', fontWeight: '800' }}
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="text-label" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-field"
                            style={{ borderRadius: '16px', height: '60px', fontSize: '1.1rem', fontWeight: '800' }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ height: '60px', borderRadius: '18px', fontWeight: '950', fontSize: '1.1rem', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 24px rgba(16, 185, 129, 0.2)', marginTop: '8px' }}>
                        <div className="holographic-glow" style={{ opacity: 0.2 }} />
                        {isLoading ? 'Authenticating...' : 'Secure Access'}
                    </button>

                    <button type="button" onClick={onBack} className="btn-ghost flex-center" style={{ gap: '8px', color: 'var(--text-secondary)', fontWeight: '800', marginTop: '12px' }}>
                        <IconChevronLeft size={18} /> BACK TO MOBILE LOGIN
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '600', position: 'relative', zIndex: 1 }}>
                    Enterprise Clinical Security Enabled.<br />
                    System access is monitored and recorded.
                </div>
            </div>
        </div>
    );
};

export default TalentAuth;
