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
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('medics_token', data.token);
                localStorage.setItem('medics_user', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const IconLogo = () => (
        <svg width="60" height="60" viewBox="0 0 100 100">
            <path d="M50 15L70 45H30L50 15Z" fill="var(--apollo-orange)" />
            <path d="M50 30V80" stroke="#02363D" strokeWidth="8" strokeLinecap="round" />
            <path d="M25 55H75" stroke="#02363D" strokeWidth="8" strokeLinecap="round" />
        </svg>
    );

    return (
        <div className="login-root-p">
            <div className="mesh-bg"></div>
            <div className="bg-decor">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <div className="login-panel glass animate-fade">
                <div className="login-header-p">
                    <div className="mini-logo">
                        <IconLogo />
                    </div>
                    <h1>Welcome back</h1>
                    <p>Login to access your medical records</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form-p">
                    {error && <div style={{ color: '#FF5252', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}

                    <div className="input-p">
                        <label>Phone Number</label>
                        <div className="input-wrapper-p">
                            <span className="cc">+91</span>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter 10 digits"
                                maxLength="10"
                                className="apollo-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-p">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="apollo-input"
                            required
                        />
                    </div>

                    <button type="submit" className="apollo-btn sign-btn" disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </button>

                    <div className="resend-p" style={{ marginTop: '20px' }}>
                        New to Medics? <span onClick={() => onNavigate('signup')}>Create Account</span>
                    </div>
                </form>

                <div className="login-social">
                    <div className="sep"><span>Or login with</span></div>
                    <div className="social-grid">
                        <div className="social-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-1.92 5.36-7.84 5.36-5.12 0-9.28-4.24-9.28-9.44s4.16-9.44 9.28-9.44c2.88 0 4.88 1.2 5.92 2.24l2.56-2.48C19.44 1.84 16.24 0 12.48 0 5.76 0 0 5.76 0 12.8s5.76 12.8 12.48 12.8c7.04 0 11.76-4.96 11.76-11.92 0-.8-.08-1.44-.16-2.08h-11.6z" /></svg>
                        </div>
                        <div className="social-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        </div>
                        <div className="social-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05 1.79-3.23 2.5a.73.73 0 0 1-.9-.1c-2.43-2.42-4.14-5.22-5.11-8.22A16.2 16.2 0 0 1 7 8a9.49 9.49 0 0 1 2.76-6.76.73.73 0 0 1 1 0l3 3a.75.75 0 0 1 .1 1.05 5.5 5.5 0 0 0 0 7.42.75.75 0 0 1-.1 1.05l-3 3a.73.73 0 0 1-.78.1c-.24-.12-.47-.26-.7-.4a13.36 13.36 0 0 0 5.61 5.61.73.73 0 0 1 .1-.78l3-3a.75.75 0 0 1 1.05.1l3 3a.73.73 0 0 1 0 1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
