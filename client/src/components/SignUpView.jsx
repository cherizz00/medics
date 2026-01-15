import React, { useState } from 'react';
import { IconPhone, IconLock, IconGoogle, IconFacebook, IconApple } from './Icons';

const SignUpView = ({ onSignUp, onNavigate }) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phoneNumber, password }),
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
                onSignUp(data.user);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Sign Up Error:', err);
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

    const IconUser = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21V19a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
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
            <div className="bg-blob" style={{ top: '5%', right: '15%', background: 'rgba(99, 102, 241, 0.1)' }}></div>
            <div className="bg-blob" style={{ bottom: '5%', left: '15%', animationDelay: '-7s' }}></div>

            <div className="premium-card glass-morphism anim-slide-up" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '48px 32px',
                borderRadius: 'var(--radius-2xl)',
                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
                    <h1 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--primary-dark)', fontWeight: '800' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Begin your wellness journey today</p>
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
                        }}>FULL NAME</label>
                        <div style={{ position: 'relative' }}>
                            <div className="input-icon">
                                <IconUser />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="input-premium"
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
                        }}>CREATE PASSWORD</label>
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
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading} style={{
                        marginTop: '8px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        border: 'none',
                        boxShadow: 'var(--shadow-glow)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <div style={{
                        marginTop: '16px',
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)'
                    }}>
                        Already have an account? <span onClick={() => onNavigate('login')} style={{
                            color: 'var(--primary)',
                            fontWeight: '800',
                            cursor: 'pointer'
                        }} className="hover-underline">Log In</span>
                    </div>
                </form>
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

export default SignUpView;
