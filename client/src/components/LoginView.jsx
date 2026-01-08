import React, { useState } from 'react';

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
        <svg width="64" height="64" viewBox="0 0 100 100" className="animate-pulse-subtle">
            <path d="M50 15L70 45H30L50 15Z" fill="var(--warning)" />
            <path d="M50 30V80" stroke="var(--primary-dark)" strokeWidth="8" strokeLinecap="round" />
            <path d="M25 55H75" stroke="var(--primary-dark)" strokeWidth="8" strokeLinecap="round" />
        </svg>
    );

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--primary-light) 0%, #ffffff 100%)',
            padding: '24px'
        }}>
            <div className="premium-card glass animate-slide-up" style={{
                width: '100%',
                maxWidth: '420px',
                padding: '48px 32px',
                border: '1px solid rgba(255,255,255,0.8)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                        <IconLogo />
                    </div>
                    <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--primary-dark)' }}>Welcome Back</h1>
                    <p>Sign in to access your health vault</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{
                            padding: '12px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--error-bg)',
                            color: 'var(--error)',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            {error}
                        </div>
                    )}

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginBottom: '6px',
                            color: 'var(--text-secondary)',
                            marginLeft: '4px'
                        }}>PHONE NUMBER</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1rem',
                                color: 'var(--text-muted)',
                                fontWeight: '600'
                            }}>+91</span>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="98765 43210"
                                maxLength="10"
                                className="input-premium"
                                style={{ paddingLeft: '54px' }}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginBottom: '6px',
                            color: 'var(--text-secondary)',
                            marginLeft: '4px'
                        }}>PASSWORD</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-premium"
                            required
                        />
                        <div style={{ textAlign: 'right', marginTop: '8px' }}>
                            <span style={{
                                color: 'var(--primary)',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>Forgot Password?</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '12px' }}>
                        {isLoading ? 'Verifying...' : 'Sign In'}
                    </button>

                    <div style={{
                        marginTop: '24px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                    }}>
                        New to Medics? <span onClick={() => onNavigate('signup')} style={{
                            color: 'var(--primary)',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}>Create Account</span>
                    </div>
                </form>

                <div style={{ marginTop: '40px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        marginBottom: '20px'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                        <span>OR CONTINUE WITH</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        {['G', 'f', ''].map((icon, i) => (
                            <button key={i} className="premium-card" style={{
                                width: '56px',
                                height: '56px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                color: 'var(--text-main)',
                                cursor: 'pointer',
                                padding: 0
                            }}>
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
