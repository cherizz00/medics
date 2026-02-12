import React, { useState } from 'react';
import { IconShieldCheck, IconCloud, IconShare, IconSparkles } from './Icons';

const onboardingData = [
    {
        title: "Secure Vault",
        icon: <IconShieldCheck size={120} />,
        desc: "Protect your prescriptions, lab reports, and medical history in our AES-256 encrypted health vault.",
        accent: 'var(--primary)'
    },
    {
        title: "Cloud Sync",
        icon: <IconCloud size={120} />,
        desc: "Your records are always within reach. Access your complete health timeline securely from any device.",
        accent: '#3B82F6'
    },
    {
        title: "Smart Sharing",
        icon: <IconShare size={120} />,
        desc: "Instantly share vital medical insights with your doctor or family during emergencies or routine checkups.",
        accent: '#8B5CF6'
    }
];

const OnboardingFlow = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    return (
        <div className="page-container" style={{ background: 'white' }}>
            <main className="scroll-content flex-center" style={{ paddingBottom: '60px', flexDirection: 'column' }}>

                {/* Visual Section */}
                <div style={{
                    width: '100%',
                    height: '40vh',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '48px',
                    overflow: 'visible'
                }}>
                    <div className="holographic-glow" style={{ opacity: 0.1, background: onboardingData[step].accent, borderRadius: '50%' }} />

                    {onboardingData.map((data, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: i === step ? 1 : 0,
                            transform: i === step
                                ? 'translate(-50%, -50%) scale(1.1)'
                                : `translate(-50%, -50%) scale(0.8) translateY(${i < step ? -40 : 40}px)`,
                            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            color: data.accent,
                            zIndex: i === step ? 2 : 1,
                            pointerEvents: i === step ? 'auto' : 'none'
                        }}>
                            <div className="flex-center" style={{
                                width: '220px', height: '220px',
                                background: 'white',
                                borderRadius: '48px',
                                boxShadow: `0 30px 60px ${data.accent}20`,
                                border: `1px solid ${data.accent}30`,
                                position: 'relative'
                            }}>
                                {data.icon}
                                {i === step && (
                                    <div style={{ position: 'absolute', top: '20px', right: '20px', animation: 'float 3s infinite ease-in-out' }}>
                                        <IconSparkles size={32} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="animate-fade" style={{ padding: '0 32px', textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                        {onboardingData.map((_, i) => (
                            <div key={i} style={{
                                width: i === step ? '32px' : '8px',
                                height: '8px',
                                background: i === step ? onboardingData[step].accent : 'var(--border)',
                                borderRadius: '4px',
                                transition: 'all 0.4s ease'
                            }} />
                        ))}
                    </div>

                    <h2 style={{
                        fontSize: '2.25rem', fontWeight: '800', marginBottom: '16px',
                        color: 'var(--premium-dark)', letterSpacing: '-0.02em'
                    }}>
                        {onboardingData[step].title}
                    </h2>

                    <p style={{
                        fontSize: '1.05rem', color: 'var(--text-secondary)',
                        lineHeight: '1.6', marginBottom: '48px', fontWeight: '600'
                    }}>
                        {onboardingData[step].desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {step < onboardingData.length - 1 ? (
                            <>
                                <button
                                    className="btn btn-primary"
                                    style={{ height: '64px', borderRadius: '18px', fontSize: '1.1rem', fontWeight: '800', background: onboardingData[step].accent }}
                                    onClick={() => setStep(step + 1)}
                                >
                                    Next Intelligence
                                </button>
                                <button className="btn btn-ghost" style={{ fontWeight: '700' }} onClick={onComplete}>
                                    SKIP INTRO
                                </button>
                            </>
                        ) : (
                            <button
                                className="btn btn-primary"
                                style={{ height: '64px', borderRadius: '18px', fontSize: '1.1rem', fontWeight: '900', background: onboardingData[step].accent }}
                                onClick={onComplete}
                            >
                                Secure My Health
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OnboardingFlow;
