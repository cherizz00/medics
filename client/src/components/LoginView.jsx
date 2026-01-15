import React, { useState } from 'react';
import { IconPhone, IconLock, IconGoogle, IconFacebook, IconApple } from './Icons';

const LoginView = ({ onLogin, onNavigate }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, password }),
            });

            let data;
            const text = await response.text();
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('SERVER RESPONSE WAS NOT JSON:', text);
                throw new Error('Server issues. Please try again.');
            }

            if (response.ok) {
                localStorage.setItem('medics_token', data.token);
                localStorage.setItem('medics_user', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login Error:', err);
            setError(`Connection Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const IconLogo = () => (
        <svg width="64" height="64" viewBox="0 0 100 100" className="anim-pulse">
            <path d="M50 15L70 45H30L50 15Z" fill="var(--warning)" />
            <path d="M50 30V80" stroke="var(--primary-dark)" strokeWidth="8" strokeLinecap="round" />
            <path d="M25 55H75" stroke="var(--primary-dark)" strokeWidth="8" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="mesh-gradient" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Blobs */}
            <div className="bg-blob" style={{ top: '10%', left: '10%' }}></div>
            <div className="bg-blob" style={{ bottom: '10%', right: '10%', animationDelay: '-5s', background: 'rgba(99, 102, 241, 0.1)' }}></div>

            <div className="premium-card glass-morphism anim-slide-up" style={{
                width: '100%',
                maxWidth: '420px',
                padding: 'min(48px, 10%) min(32px, 8%)',
                borderRadius: 'var(--radius-2xl)',

                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <IconLogo />
                        </div>
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '8px', color: 'var(--primary-dark)', fontWeight: '800' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '0.9rem' }}>Sign in to access your health vault</p>

                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {error && (
                        <div className="anim-shake" style={{
                            padding: '14px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--error-bg)',
                            color: 'var(--error)',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.1)'
                        }}>
                            {error}
                        </div>
                    )}

                    <div className="input-premium-wrapper">
                        <label style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            marginBottom: '8px',
                            color: 'var(--primary-dark)',
                            letterSpacing: '0.05em',
                            marginLeft: '4px'
                        }}>PHONE NUMBER</label>
                        <div style={{ position: 'relative' }}>
                            <div className="input-icon">
                                <IconPhone />
                            </div>
                            <span style={{
                                position: 'absolute',
                                left: '44px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1rem',
                                color: 'var(--text-main)',
                                fontWeight: '600'
                            }}>+91</span>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="98765 43210"
                                maxLength="10"
                                className="input-premium"
                                style={{ paddingLeft: '84px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-premium-wrapper">
                        <label style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            marginBottom: '8px',
                            color: 'var(--primary-dark)',
                            letterSpacing: '0.05em',
                            marginLeft: '4px'
                        }}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <div className="input-icon">
                                <IconLock />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="input-premium"
                                required
                            />
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '10px' }}>
                            <span style={{
                                color: 'var(--primary)',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'color 0.2s ease'
                            }} className="hover-underline">Forgot Password?</span>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading} style={{
                        marginTop: '8px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        border: 'none',
                        boxShadow: 'var(--shadow-glow)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        {isLoading ? 'Verifying...' : 'Sign In'}
                    </button>

                    <div style={{
                        marginTop: '16px',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)'
                    }}>
                        New to Medics? <span onClick={() => onNavigate('signup')} style={{
                            color: 'var(--primary)',
                            fontWeight: '800',
                            cursor: 'pointer'
                        }} className="hover-underline">Create Account</span>
                    </div>
                </form>

                <div style={{ marginTop: '40px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        marginBottom: '24px'
                    }}>
                        <div style={{ flex: 1, height: '1.5px', background: 'rgba(0,0,0,0.05)' }}></div>
                        <span>OR CONTINUE WITH</span>
                        <div style={{ flex: 1, height: '1.5px', background: 'rgba(0,0,0,0.05)' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        {[
                            { icon: <IconGoogle />, label: 'Google' },
                            { icon: <IconFacebook />, label: 'Facebook' },
                            { icon: <IconApple />, label: 'Apple' }
                        ].map((item, i) => (
                            <button key={i} className="glass" style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                border: '1px solid rgba(255,255,255,0.8)',
                                transition: 'all 0.3s var(--ease-elastic)',
                                background: 'rgba(255,255,255,0.5)'
                            }} onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }} onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-underline:hover { text-decoration: underline; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .anim-shake { animation: shake 0.4s ease-in-out; }
            `}} />
        </div>
    );
};

export default LoginView;
