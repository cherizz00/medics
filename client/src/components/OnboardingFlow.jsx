import React, { useState } from 'react';

const onboardingData = [
    {
        title: "Secure Health Records",
        image: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png", // Using a placeholder icon/image
        desc: "Store your prescriptions, lab reports, and medical history in one encrypted vault."
    },
    {
        title: "Access Anywhere",
        image: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
        desc: "View your complete health timeline whenever you need it, from any device."
    },
    {
        title: "Easy Sharing",
        image: "https://cdn-icons-png.flaticon.com/512/1000/1000946.png",
        desc: "Share vital health data with doctors instantly and securely when it matters most."
    }
];

const OnboardingFlow = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    return (
        <div style={{
            height: '100vh',
            background: 'var(--bg-app)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px',
            paddingBottom: '40px',
            position: 'relative'
        }}>
            <div style={{
                width: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginBottom: '24px'
            }}>
                {onboardingData.map((data, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: i === step ? 1 : 0,
                        transform: i === step ? 'scale(1)' : 'scale(0.95)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                        pointerEvents: 'none'
                    }}>
                        <img
                            src={data.image}
                            alt={data.title}
                            style={{
                                maxWidth: '80%',
                                maxHeight: '300px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="animate-slide-up" style={{
                textAlign: 'center',
                maxWidth: '320px',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                    {onboardingData.map((_, i) => (
                        <div key={i} style={{
                            width: i === step ? '24px' : '8px',
                            height: '8px',
                            background: i === step ? 'var(--primary)' : 'var(--border-light)',
                            borderRadius: '4px',
                            transition: 'all 0.3s ease'
                        }}></div>
                    ))}
                </div>

                <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: 'var(--text-main)' }}>
                    {onboardingData[step].title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '40px' }}>
                    {onboardingData[step].desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                    {step < onboardingData.length - 1 ? (
                        <>
                            <button className="btn-primary" onClick={() => setStep(step + 1)}>
                                Continue
                            </button>
                            <button className="btn-ghost" onClick={() => setStep(onboardingData.length - 1)}>
                                Skip
                            </button>
                        </>
                    ) : (
                        <button className="btn-primary" onClick={onComplete}>
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingFlow;
