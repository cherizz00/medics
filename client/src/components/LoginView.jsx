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
                throw new Error('Server returned HTML instead of JSON. Check console for details.');
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
            setError(`Network error: ${err.message}. Ensure server is running.`);
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
            <div className="login-panel animate-fade">
                <div className="login-header-p">
                    <div className="mini-logo">
                        <IconLogo />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Enter your details to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form-p">
                    {error && <div className="error-msg">{error}</div>}

                    <div className="input-p">
                        <div className="input-wrapper-p">
                            <span className="input-icon">📞</span>
                            <span className="cc">+91</span>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Phone Number"
                                maxLength="10"
                                className="clean-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-p">
                        <div className="input-wrapper-p">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="clean-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="forgot-pass">Forgot Password?</div>

                    <button type="submit" className="btn-primary" disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </button>

                    <div className="resend-p">
                        Don't have an account? <span onClick={() => onNavigate('signup')}>Sign Up</span>
                    </div>
                </form>

                <div className="login-social">
                    <div className="sep"><span>Or login with</span></div>
                    <div className="social-grid">
                        <div className="social-icon">G</div>
                        <div className="social-icon">f</div>
                        <div className="social-icon"></div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .login-root-p { background: var(--bg-primary); height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
                .login-panel { width: 100%; max-width: 400px; }
                .login-header-p { text-align: center; margin-bottom: 40px; }
                .login-header-p h1 { font-size: 28px; color: var(--text-header); margin-bottom: 8px; }
                .login-header-p p { color: var(--text-body); font-size: 16px; }
                
                .input-wrapper-p { 
                    display: flex; align-items: center; gap: 12px; 
                    background: var(--bg-secondary); border: 1px solid var(--border); 
                    border-radius: 24px; padding: 4px 20px;
                    transition: var(--transition);
                }
                .input-wrapper-p:focus-within { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(25, 154, 142, 0.1); }
                .input-icon { opacity: 0.5; }
                .cc { font-weight: 700; color: var(--text-header); font-size: 14px; border-right: 1px solid var(--border); padding-right: 12px; }
                .clean-input { border: none !important; background: none !important; padding: 16px 0 !important; font-size: 16px; flex: 1; outline: none; color: var(--text-header); }
                
                .error-msg { color: #E11D48; background: #FFF1F2; padding: 12px; border-radius: 12px; font-size: 14px; margin-bottom: 20px; text-align: center; }
                .forgot-pass { text-align: right; color: var(--primary); font-size: 14px; font-weight: 600; margin: -10px 4px 24px 0; cursor: pointer; }
                .resend-p { text-align: center; margin-top: 24px; font-size: 14px; color: var(--text-body); }
                .resend-p span { color: var(--primary); font-weight: 700; cursor: pointer; }

                .login-social { margin-top: 40px; }
                .sep { display: flex; align-items: center; gap: 12px; color: var(--text-muted); font-size: 12px; margin-bottom: 24px; }
                .sep::before, .sep::after { content: ''; flex: 1; border-bottom: 1px solid var(--border); }
                .social-grid { display: flex; justify-content: center; gap: 16px; }
                .social-icon { width: 60px; height: 60px; border: 1px solid var(--border); border-radius: 30px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: var(--text-header); cursor: pointer; transition: var(--transition); }
                .social-icon:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }
            `}} />
        </div>
    );
};

export default LoginView;
