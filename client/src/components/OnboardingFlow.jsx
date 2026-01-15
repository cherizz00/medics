import React, { useState } from 'react';

const onboardingData = [
    {
        title: "Secure Data Storage",
        image: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png",
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
        <div className="page-container" style={{ padding: 0 }}>
            <main className="scroll-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', paddingBottom: '40px' }}>

                {/* Image Carousel */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 'min(350px, 40vh)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    flexShrink: 0
                }}>

                    {onboardingData.map((data, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: i === step ? 1 : 0,
                            transform: i === step ? 'scale(1)' : 'scale(0.9)',
                            transition: 'all 0.6s var(--ease-elastic)',
                            pointerEvents: 'none'
                        }}>
                            <img
                                src={data.image}
                                alt={data.title}
                                style={{
                                    width: '80%',
                                    maxHeight: '300px',
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 20px 30px rgba(13, 148, 136, 0.15))'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="anim-fade-up" style={{
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: '360px',
                    margin: '0 auto',
                    zIndex: 10
                }}>
                    {/* Dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                        {onboardingData.map((_, i) => (
                            <div key={i} style={{
                                width: i === step ? '32px' : '8px',
                                height: '8px',
                                background: i === step ? 'var(--primary)' : 'var(--border-medium)',
                                borderRadius: '4px',
                                transition: 'all 0.4s var(--ease-elastic)'
                            }} />
                        ))}
                    </div>

                    <h2 style={{
                        fontSize: '2rem',
                        marginBottom: '16px',
                        background: 'linear-gradient(135deg, var(--text-main) 0%, var(--text-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {onboardingData[step].title}
                    </h2>

                    <p style={{
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: '40px',
                        color: 'var(--text-secondary)'
                    }}>
                        {onboardingData[step].desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                        {step < onboardingData.length - 1 ? (
                            <>
                                <button className="btn btn-primary btn-lg" onClick={() => setStep(step + 1)}>
                                    Continue
                                </button>
                                <button className="btn btn-ghost" onClick={() => setStep(onboardingData.length - 1)}>
                                    Skip
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-primary btn-lg" onClick={onComplete}>
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>


    );
};

export default OnboardingFlow;
