import React, { useState } from 'react';

const onboardingData = [
    {
        title: "Instant Video Consultation",
        image: "https://images.unsplash.com/photo-1576091160550-217359f481c3?q=80&w=1000",
        desc: "Speak with India's top doctors within 15 minutes, anytime."
    },
    {
        title: "Medicines in 2 Hours",
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=1000",
        desc: "Order from a range of over 1.2 lakh+ verified medicines."
    },
    {
        title: "Lab Tests at Home",
        image: "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=1000",
        desc: "Certified technicians and accurate results in 24 hours."
    }
];

const OnboardingFlow = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    return (
        <div className="onboarding-root">
            <div className="image-container">
                {onboardingData.map((data, i) => (
                    <img
                        key={i}
                        src={data.image}
                        className={`onboarding-img ${i === step ? 'active' : ''}`}
                        alt="health"
                    />
                ))}
                <div className="img-vignette"></div>
            </div>

            <div className="content-area animate-fade">
                <div className="o-dots">
                    {onboardingData.map((_, i) => (
                        <div key={i} className={`o-dot ${i === step ? 'active' : ''}`}></div>
                    ))}
                </div>

                <h2>{onboardingData[step].title}</h2>
                <p>{onboardingData[step].desc}</p>
            </div>

            <div className="o-footer animate-fade">
                {step < onboardingData.length - 1 ? (
                    <>
                        <button className="btn-primary" onClick={() => setStep(step + 1)}>Next</button>
                        <button className="btn-skip" onClick={() => setStep(onboardingData.length - 1)}>Skip</button>
                    </>
                ) : (
                    <button className="btn-primary" onClick={onComplete}>Get Started</button>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .onboarding-root { height: 100vh; background: var(--bg-primary); display: flex; flex-direction: column; align-items: center; padding: 40px 24px; position: relative; }
        .image-container { width: 100%; max-width: 320px; height: 350px; position: relative; margin-bottom: 40px; margin-top: 40px; }
        .onboarding-img { 
          position: absolute; width: 100%; height: 100%; object-fit: contain; 
          opacity: 0; transition: opacity 0.5s ease-in-out; 
        }
        .onboarding-img.active { opacity: 1; }
        
        .content-area { text-align: center; max-width: 320px; }
        .o-dots { display: flex; justify-content: center; gap: 8px; margin-bottom: 32px; }
        .o-dot { width: 8px; height: 8px; background: #E5E7EB; border-radius: 4px; transition: var(--transition); }
        .o-dot.active { width: 24px; background: var(--primary); }
        
        h2 { font-size: 24px; font-weight: 700; color: var(--text-header); margin-bottom: 16px; }
        p { color: var(--text-body); line-height: 1.6; font-size: 16px; margin-bottom: 40px; }
        
        .o-footer { width: 100%; max-width: 320px; display: flex; flex-direction: column; gap: 12px; margin-top: auto; }
        .btn-skip { background: none; border: none; color: var(--text-muted); font-weight: 600; cursor: pointer; padding: 10px; margin-top: 8px; }
      `}} />
        </div>
    );
};

export default OnboardingFlow;
