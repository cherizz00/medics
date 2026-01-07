import React from 'react';

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <div className="logo-wrapper">
                <div className="apollo-logo-container">
                    <svg width="120" height="120" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFB84D" />
                                <stop offset="100%" stopColor="#FF9500" />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#logoGrad)" strokeWidth="0.5" strokeDasharray="5 5" />
                        <path className="logo-path" d="M50 15L70 45H30L50 15Z" fill="url(#logoGrad)" />
                        <path className="cross-line" d="M50 30V80" stroke="white" strokeWidth="8" strokeLinecap="round" />
                        <path className="cross-line" d="M25 55H75" stroke="white" strokeWidth="8" strokeLinecap="round" />
                    </svg>
                </div>
                <div className="brand-reveal">
                    <h1>Medics</h1>
                    <div className="tagline">WORLD CLASS CARE</div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .splash-screen {
          height: 100vh;
          background: #02363D;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }
        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        .apollo-logo-container {
          animation: logoEntrance 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .logo-path {
          animation: shapeIntro 1.5s ease-out;
        }
        .cross-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: traceLine 1s ease-out 0.5s forwards;
        }
        .brand-reveal h1 {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -2px;
          margin: 0;
          opacity: 0;
          transform: translateY(20px);
          animation: textUp 1s cubic-bezier(0.23, 1, 0.32, 1) 0.8s forwards;
        }
        .tagline {
          font-size: 10px;
          letter-spacing: 6px;
          text-transform: uppercase;
          opacity: 0;
          margin-top: 8px;
          text-align: center;
          animation: fadeIn 1s ease-in 1.5s forwards;
        }
        @keyframes logoEntrance {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes traceLine {
          to { stroke-dashoffset: 0; }
        }
        @keyframes textUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shapeIntro {
          from { transform: translateY(-30px) scale(0.8); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          to { opacity: 0.5; }
        }
      `}} />
        </div>
    );
};

export default SplashScreen;
