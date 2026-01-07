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

            <div className="card-overlay animate-fade">
                <div className="premium-card o-card">
                    <div className="o-dots">
                        {onboardingData.map((_, i) => (
                            <div key={i} className={`o-dot ${i === step ? 'active' : ''}`}></div>
                        ))}
                    </div>

                    <h2>{onboardingData[step].title}</h2>
                    <p>{onboardingData[step].desc}</p>

                    <div className="o-footer">
                        {step < onboardingData.length - 1 ? (
                            <>
                                <button className="btn-txt" onClick={() => setStep(onboardingData.length - 1)}>Skip</button>
                                <button className="apollo-btn" onClick={() => setStep(step + 1)}>
                                    Next <span style={{ fontSize: '20px' }}>→</span>
                                </button>
                            </>
                        ) : (
                            <button className="apollo-btn full-w" onClick={onComplete}>
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .onboarding-root { height: 100vh; background: #000; position: relative; overflow: hidden; }
        .image-container { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
        .onboarding-img { 
          position: absolute; width: 100%; height: 100%; object-fit: cover; 
          opacity: 0; transition: opacity 1s ease-in-out; 
        }
        .onboarding-img.active { opacity: 0.6; transform: scale(1.05); transition: transform 6s linear, opacity 1s ease-in-out; }
        .img-vignette { 
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
          background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%); 
        }
        
        .card-overlay { 
          position: absolute; bottom: 40px; left: 20px; right: 20px; 
          z-index: 10; 
        }
        .o-card { padding: 40px 30px; text-align: center; }
        .o-dots { display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; }
        .o-dot { width: 6px; height: 6px; background: #EEE; border-radius: 3px; transition: var(--transition-premium); }
        .o-dot.active { width: 20px; background: var(--apollo-orange); }
        
        .o-card h2 { font-size: 28px; font-weight: 700; color: var(--apollo-blue); margin-bottom: 12px; letter-spacing: -0.5px; }
        .o-card p { color: var(--apollo-text-light); line-height: 1.6; margin-bottom: 32px; font-size: 16px; }
        
        .o-footer { display: flex; justify-content: space-between; align-items: center; }
        .btn-txt { background: none; border: none; color: var(--apollo-text-light); font-weight: 600; cursor: pointer; padding: 10px; }
        .full-w { width: 100%; font-size: 18px; }
      `}} />
        </div>
    );
};

export default OnboardingFlow;
