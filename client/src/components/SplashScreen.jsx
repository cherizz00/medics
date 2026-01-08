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
          background: var(--primary);
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
          gap: 16px;
        }
        .apollo-logo-container {
          animation: logoEntrance 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .brand-reveal h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin: 0;
          opacity: 0;
          transform: translateY(10px);
          animation: textUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.5s forwards;
        }
        @keyframes logoEntrance {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes textUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
