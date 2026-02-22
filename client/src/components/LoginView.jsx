import React, { useState, useRef, useEffect } from 'react';
import { IconPhone, IconLock, IconGoogle, IconFacebook, IconApple, IconLogo, IconSparkles, IconChevronLeft } from './Icons';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useLanguage } from '../LanguageContext';
import translations from '../translations';




const LanguagePicker = ({ language, setLanguage }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const options = [
        { value: 'English', label: 'EN', flag: '🌐' },
        { value: 'Hindi', label: 'हि', flag: '🇮🇳' },
    ];

    useEffect(() => {
        const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const current = options.find(o => o.value === language);

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    transition: 'all 0.2s',
                    boxShadow: open ? '0 4px 16px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                }}
            >
                <span style={{ fontSize: '0.9rem' }}>{current.flag}</span>
                <span>{current.label}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: '14px',
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    minWidth: '140px',
                    animation: 'dropIn 0.2s ease-out',
                    zIndex: 100,
                }}>
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => { setLanguage(opt.value); setOpen(false); }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                width: '100%', padding: '12px 16px',
                                border: 'none',
                                background: language === opt.value ? 'var(--primary-subtle)' : 'transparent',
                                color: language === opt.value ? 'var(--primary)' : 'var(--text-main)',
                                fontSize: '0.85rem',
                                fontWeight: language === opt.value ? '600' : '400',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>{opt.flag}</span>
                            <span>{opt.value}</span>
                            {language === opt.value && (
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--primary)" style={{ marginLeft: 'auto' }}>
                                    <path d="M11.5 4L5.5 10L2.5 7" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const LoginView = ({ onLogin, onNavigate }) => {
    const [authMethod, setAuthMethod] = useState('phone');
    const [emailMode, setEmailMode] = useState('signin');
    const [phoneStep, setPhoneStep] = useState('phone');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [devNote, setDevNote] = useState('');
    const { language, setLanguage } = useLanguage();

    const t = translations[language] || translations.English;

    useEffect(() => {
        // Initialize Google Auth for web support
        GoogleAuth.initialize({
            clientId: '366925712525-ug8iunglghg6aa9cm8cncekg8b693u2o.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
        }).catch(err => console.warn('GoogleAuth initialization warning:', err));
    }, []);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            // First initialize/initialize sign in
            const googleUser = await GoogleAuth.signIn();

            if (!googleUser || !googleUser.authentication.idToken) {
                throw new Error('Google Sign-In failed to return an ID Token');
            }

            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: googleUser.authentication.idToken }),
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
            console.error('Google Auth Error:', err);
            setError(`Google Error: ${err.message || 'Authentication cancelled or failed'}`);
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
                setPhoneStep('otp');
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

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const endpoint = emailMode === 'signin' ? '/api/auth/login-password' : '/api/auth/register-password';
            const body = emailMode === 'signin' ? { email, password } : { name, email, password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('medics_token', data.token);
                localStorage.setItem('medics_user', JSON.stringify(data.user));
                onLogin(data.user);
            } else {
                setError(data.message || 'Authentication Failed');
            }
        } catch (err) {
            setError(`Connection Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getSubtitle = () => {
        if (authMethod === 'phone') {
            return phoneStep === 'phone' ? t.clinicalGateway : t.verifyingLine;
        }
        return emailMode === 'signin' ? t.welcomeBack : t.createAccount;
    };

    const getButtonLabel = () => {
        if (isLoading) return t.authenticating;
        if (authMethod === 'phone') {
            return phoneStep === 'phone' ? t.beginSession : t.accessVault;
        }
        return emailMode === 'signin' ? t.enterSpace : t.createProfile;
    };

    return (
        <div className="page-container flex-center" style={{
            background: 'linear-gradient(160deg, #F8FAFF 0%, #EEF2FF 30%, #F0F4FF 60%, #F8FAFC 100%)',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '100vh',
        }}>
            {/* Ambient orbs */}
            <div style={{ position: 'absolute', top: '-15%', left: '-15%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(74, 108, 247, 0.06) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '45%', height: '45%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 65%)', borderRadius: '50%', filter: 'blur(40px)' }} />

            {/* Language picker */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
                <LanguagePicker language={language} setLanguage={setLanguage} />
            </div>

            {/* Main card */}
            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '40px 28px 32px',
                borderRadius: '28px',
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(24px) saturate(200%)',
                WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 24px 64px -16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255,255,255,0.4) inset',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Subtle top accent line */}
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '60%', height: '3px',
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                    borderRadius: '0 0 4px 4px', opacity: 0.5
                }} />

                {/* Logo + title */}
                <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '20px', display: 'inline-block' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                padding: '3px',
                                background: 'white',
                                borderRadius: '22px',
                                boxShadow: '0 8px 24px rgba(74, 108, 247, 0.1)',
                                border: '1px solid rgba(255,255,255,0.9)',
                            }}>
                                <IconLogo size={64} />
                            </div>
                            <div style={{ position: 'absolute', top: '-12px', right: '-12px', color: 'var(--primary)', opacity: 0.7 }}>
                                <IconSparkles size={28} />
                            </div>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: '700', color: 'var(--primary)', margin: '0 0 6px', letterSpacing: '-0.03em' }}>Medics</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '400', margin: 0 }}>
                        {getSubtitle()}
                    </p>

                    {/* Premium pill-style tab switcher */}
                    <div style={{
                        marginTop: '28px',
                        background: '#F1F3F9',
                        padding: '4px',
                        borderRadius: '14px',
                        display: 'flex',
                        position: 'relative',
                    }}>
                        {/* Sliding indicator */}
                        <div style={{
                            position: 'absolute',
                            top: '4px', bottom: '4px',
                            left: authMethod === 'phone' ? '4px' : '50%',
                            width: 'calc(50% - 4px)',
                            background: 'white',
                            borderRadius: '11px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }} />
                        <button
                            onClick={() => setAuthMethod('phone')}
                            style={{
                                flex: 1, padding: '11px', borderRadius: '11px', fontSize: '0.88rem', fontWeight: '600',
                                border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1,
                                background: 'transparent',
                                color: authMethod === 'phone' ? 'var(--primary)' : 'var(--text-muted)',
                                transition: 'color 0.25s',
                            }}
                        >
                            {t.mobile}
                        </button>
                        <button
                            onClick={() => setAuthMethod('email')}
                            style={{
                                flex: 1, padding: '11px', borderRadius: '11px', fontSize: '0.88rem', fontWeight: '600',
                                border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1,
                                background: 'transparent',
                                color: authMethod === 'email' ? 'var(--primary)' : 'var(--text-muted)',
                                transition: 'color 0.25s',
                            }}
                        >
                            {t.email}
                        </button>
                    </div>
                </div>

                {/* Form section */}
                <form onSubmit={authMethod === 'phone' ? (phoneStep === 'phone' ? handleSendOTP : handleVerifyOTP) : handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
                    {error && (
                        <div style={{
                            padding: '14px 16px', borderRadius: '14px', background: '#FEF2F2',
                            color: '#DC2626', fontSize: '0.84rem', fontWeight: '500', textAlign: 'center',
                            border: '1px solid #FECACA',
                            animation: 'shake 0.4s ease-in-out',
                        }}>
                            {error}
                        </div>
                    )}

                    {authMethod === 'phone' ? (
                        <>
                            {devNote && (
                                <div style={{
                                    fontSize: '0.8rem', color: 'var(--primary)',
                                    background: 'var(--primary-subtle)', padding: '12px 16px', borderRadius: '12px',
                                    fontWeight: '500', border: '1px solid rgba(74, 108, 247, 0.08)', marginBottom: '2px',
                                    textAlign: 'center',
                                }}>
                                    {t.bypassPin}: <span style={{ letterSpacing: '3px', fontWeight: '700', fontSize: '0.9rem' }}>{devNote}</span>
                                </div>
                            )}
                            {phoneStep === 'phone' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.memberMobile}</label>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
                                            fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500',
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                        }}>
                                            <span style={{ fontSize: '0.95rem' }}>IN</span>
                                            <span style={{ opacity: 0.15, fontSize: '1.2rem', fontWeight: '300' }}>|</span>
                                            <span>+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder={t.phonePlaceholder}
                                            maxLength="10"
                                            className="login-input"
                                            style={{ paddingLeft: '110px' }}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label style={{ fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.verificationCode}</label>
                                        <button type="button" onClick={() => setPhoneStep('phone')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.04em' }}>
                                            {t.changeNumber}
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder={t.otpPlaceholder}
                                        maxLength="6"
                                        className="login-input"
                                        style={{
                                            textAlign: 'center',
                                            letterSpacing: '0.6em',
                                            fontWeight: '700',
                                            fontSize: '1.5rem',
                                            color: 'var(--primary)',
                                        }}
                                        required
                                        autoFocus
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Sign In / Sign Up sub-tabs */}
                            <div style={{
                                display: 'flex',
                                background: '#F1F3F9',
                                padding: '3px',
                                borderRadius: '12px',
                                position: 'relative',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '3px', bottom: '3px',
                                    left: emailMode === 'signin' ? '3px' : '50%',
                                    width: 'calc(50% - 3px)',
                                    background: 'white',
                                    borderRadius: '10px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }} />
                                <button
                                    type="button"
                                    onClick={() => setEmailMode('signin')}
                                    style={{
                                        flex: 1, padding: '10px', fontSize: '0.82rem', fontWeight: '600', border: 'none',
                                        background: 'transparent',
                                        color: emailMode === 'signin' ? 'var(--primary)' : 'var(--text-muted)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        position: 'relative', zIndex: 1,
                                        transition: 'color 0.25s',
                                    }}
                                >
                                    {t.signIn}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEmailMode('signup')}
                                    style={{
                                        flex: 1, padding: '10px', fontSize: '0.82rem', fontWeight: '600', border: 'none',
                                        background: 'transparent',
                                        color: emailMode === 'signup' ? 'var(--primary)' : 'var(--text-muted)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        position: 'relative', zIndex: 1,
                                        transition: 'color 0.25s',
                                    }}
                                >
                                    {t.signUp}
                                </button>
                            </div>

                            {emailMode === 'signup' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.fullName}</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="login-input"
                                        required
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.emailAddress}</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="login-input"
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t.password}</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="login-input"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{
                            height: '56px',
                            borderRadius: '16px',
                            fontWeight: '600',
                            fontSize: '1.05rem',
                            position: 'relative',
                            overflow: 'hidden',
                            background: 'linear-gradient(135deg, var(--primary) 0%, #3B5BDB 100%)',
                            boxShadow: '0 8px 24px -8px rgba(74, 108, 247, 0.4)',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            letterSpacing: '0.01em',
                        }}
                    >
                        {isLoading ? (
                            <div className="flex-center" style={{ gap: '10px' }}>
                                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                <span>{t.authenticating}</span>
                            </div>
                        ) : (
                            getButtonLabel()
                        )}
                    </button>
                </form>

                {/* Social section */}
                {authMethod === 'phone' && phoneStep === 'phone' && (
                    <div style={{ marginTop: '32px', position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)',
                            fontSize: '0.62rem', fontWeight: '500', marginBottom: '18px', letterSpacing: '0.1em',
                        }}>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)' }} />
                            <span style={{ opacity: 0.5, whiteSpace: 'nowrap' }}>{t.socialAccess}</span>
                            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={handleGoogleLogin}
                                className="social-btn"
                            >
                                <IconGoogle size={20} />
                                <span>{t.google}</span>
                            </button>
                            <button className="social-btn">
                                <IconApple color="#000000" size={20} />
                                <span>{t.apple}</span>
                            </button>
                        </div>

                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={() => onNavigate('talent-auth')}
                                className="btn-ghost"
                                style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--primary)',
                                    fontWeight: '600',
                                    opacity: 0.7,
                                    letterSpacing: '0.03em',
                                    textTransform: 'uppercase',
                                    transition: 'opacity 0.2s',
                                }}
                            >
                                {t.switchStaff}
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.7',
                    fontWeight: '400',
                    position: 'relative',
                    zIndex: 1,
                    opacity: 0.45
                }}>
                    {t.footerLine1}<br />
                    {t.footerLine2} <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>{t.globalProtocols}</span>.
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
                @keyframes dropIn {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .login-input {
                    width: 100%;
                    height: 56px;
                    padding: 0 18px;
                    border-radius: 14px;
                    border: 1.5px solid rgba(0,0,0,0.06);
                    background: rgba(255,255,255,0.8);
                    font-size: 1rem;
                    font-weight: 500;
                    color: var(--text-main);
                    outline: none;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    box-sizing: border-box;
                }
                .login-input::placeholder {
                    color: rgba(0,0,0,0.2);
                    font-weight: 400;
                }
                .login-input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.08);
                    background: white;
                }
                .login-input:hover:not(:focus) {
                    border-color: rgba(0,0,0,0.1);
                    background: white;
                }

                .social-btn {
                    flex: 1;
                    height: 52px;
                    border-radius: 14px;
                    border: 1.5px solid rgba(0,0,0,0.06);
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    color: var(--text-main);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
                }
                .social-btn:hover {
                    border-color: rgba(0,0,0,0.1);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                    transform: translateY(-1px);
                }
                .social-btn:active {
                    transform: translateY(0) scale(0.98);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                }

                button:active {
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
};

export default LoginView;
