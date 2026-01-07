import React, { useState } from 'react';

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
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phoneNumber, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('medics_token', data.token);
                localStorage.setItem('medics_user', JSON.stringify(data.user));
                onSignUp(data.user);
            } else {
                setError(data.message || 'Registration failed');
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
                    <h1>Create Account</h1>
                    <p>Join Medics for secure health records</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form-p">
                    {error && <div style={{ color: '#FF5252', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>{error}</div>}

                    <div className="input-p">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="apollo-input"
                            required
                        />
                    </div>

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
                            placeholder="Create a strong password"
                            className="apollo-input"
                            required
                        />
                    </div>

                    <button type="submit" className="apollo-btn sign-btn" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <div className="resend-p" style={{ marginTop: '20px' }}>
                        Already have an account? <span onClick={() => onNavigate('login')}>Log In</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpView;
