import React, { useState } from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { IconPhone, IconLock, IconGoogle, IconFacebook, IconApple, IconLogo, IconSparkles, IconChevronLeft } from './Icons';

const LoginView = ({ onLogin, onNavigate }) => {
    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [devNote, setDevNote] = useState('');
    const [language, setLanguage] = useState('English');

    // Initialize Google Auth
    React.useEffect(() => {
        GoogleAuth.initialize({
            clientId: '943010689340-8os3kgsghuc020gq917eqto7n4p50gaf.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
        });
    }, []);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const googleUser = await GoogleAuth.signIn();
            const idToken = googleUser.authentication.idToken;

            // Use configured API URL or fallback for Android local testing
            // Note: For Android Emulator use 10.0.2.2 instead of localhost
            const API_URL = import.meta.env.VITE_API_URL || '/api';

            const response = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('medics_token', data.token);
                localStorage.setItem('medics_user', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.message || 'Google Login Failed');
            }
        } catch (err) {
            console.error(err);
            setError(`Google Auth Error: ${err.message || JSON.stringify(err)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber }),
            });
            const data = await response.json();
            if (response.ok) {
                setStep('otp');
                if (data.dev_note) setDevNote(data.dev_note);
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError(`Connection Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otp }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('medics_token', data.token);
                localStorage.setItem('medics_user', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError(`Connection Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container flex-center" style={{ background: 'white', padding: '24px' }}>
            {/* Language Selector */}
            <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field"
                    style={{ padding: '8px 16px', fontSize: '0.85rem', width: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}
                >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी</option>
                </select>
            </div>

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
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--premium-dark)', margin: '0 0 8px', letterSpacing: '-0.04em' }}>Medics</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: '600' }}>
                        {step === 'phone' ? 'Your Personal Clinical Intelligence' : `Verifying +91 ${phoneNumber}`}
                    </p>
                    {devNote && (
                        <div style={{
                            marginTop: '20px', fontSize: '0.8rem', color: 'var(--primary)',
                            background: 'var(--primary-subtle)', padding: '12px 16px', borderRadius: '14px',
                            fontWeight: '800', border: '1px solid var(--primary-subtle)'
                        }}>
                            Dev OTP: {devNote}
                        </div>
                    )}
                </div>

                <form onSubmit={step === 'phone' ? handleSendOTP : handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
                    {error && (
                        <div className="animate-pop" style={{
                            padding: '14px', borderRadius: '14px', background: '#FEF2F2',
                            color: 'var(--error)', fontSize: '0.9rem', fontWeight: '700', textAlign: 'center',
                            border: '1.5px solid #FEE2E2'
                        }}>
                            {error}
                        </div>
                    )}

                    {step === 'phone' ? (
                        <div>
                            <label className="text-label" style={{ fontSize: '0.7rem', marginBottom: '8px' }}>MOBILE NUMBER</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
                                    fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '800'
                                }}>+91</span>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="00000 00000"
                                    maxLength="10"
                                    className="input-field"
                                    style={{ paddingLeft: '60px', borderRadius: '16px', height: '60px', fontSize: '1.1rem', fontWeight: '800' }}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label className="text-label" style={{ fontSize: '0.7rem', margin: 0 }}>ENTER CODE</label>
                                <button type="button" onClick={() => setStep('phone')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                                    <IconChevronLeft size={14} /> EDIT NUMBER
                                </button>
                            </div>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="0 0 0 0 0 0"
                                maxLength="6"
                                className="input-field"
                                style={{ textAlign: 'center', letterSpacing: '0.5em', fontWeight: '800', borderRadius: '16px', height: '60px', fontSize: '1.4rem' }}
                                required
                                autoFocus
                            />
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ height: '60px', borderRadius: '18px', fontWeight: '800', fontSize: '1.1rem', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 24px rgba(16, 185, 129, 0.2)' }}>
                        <div className="holographic-glow" style={{ opacity: 0.2 }} />
                        {isLoading ? 'Processing...' : (step === 'phone' ? 'Begin Session' : 'Access Vault')}
                    </button>
                </form>

                {step === 'phone' && (
                    <div style={{ marginTop: '40px', position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '16px', color: '#CBD5E1',
                            fontSize: '0.7rem', fontWeight: '900', marginBottom: '24px', letterSpacing: '0.1em'
                        }}>
                            <div style={{ flex: 1, height: '1.5px', background: '#F1F5F9' }}></div>
                            <span>SECURE AUTHENTICATION</span>
                            <div style={{ flex: 1, height: '1.5px', background: '#F1F5F9' }}></div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={handleGoogleLogin} className="btn-ghost flex-center" style={{ flex: 1, height: '56px', borderRadius: '16px', border: '1px solid #F1F5F9', background: 'white' }}>
                                <IconGoogle />
                            </button>
                            <button className="btn-ghost flex-center" style={{ flex: 1, height: '56px', borderRadius: '16px', border: '1px solid #F1F5F9', background: 'white' }}>
                                <IconApple />
                            </button>
                        </div>

                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={() => onNavigate('talent-auth')}
                                className="btn-ghost"
                                style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', textDecoration: 'underline', textUnderlineOffset: '4px' }}
                            >
                                Switch to Clinical Staff Login
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5', fontWeight: '600', position: 'relative', zIndex: 1 }}>
                    Secure 256-bit encrypted gateway.<br />
                    By continuing, you agree to our <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Terms</span> & <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Privacy Policy</span>.
                </div>
            </div>
        </div>
    );
};

export default LoginView;
