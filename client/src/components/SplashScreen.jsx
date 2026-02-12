import React from 'react';
import { IconLogo, IconSparkles } from './Icons';

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="logo-wrapper">
        <div className="apollo-logo-container" style={{ position: 'relative' }}>
          <IconLogo size={140} />
          <div className="sparkle-float" style={{ position: 'absolute', top: '-20px', right: '-20px', color: 'white' }}>
            <IconSparkles size={40} />
          </div>
        </div>
        <div className="brand-reveal">
          <h1 className="brand-title">Medics</h1>
          <div className="tagline-reveal">
            <div className="tagline-pip"></div>
            <span>CLINICAL INTELLIGENCE 2025</span>
            <div className="tagline-pip"></div>
          </div>
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
          position: relative;
        }
        .splash-screen::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          z-index: 10;
        }
        .apollo-logo-container {
          animation: logoFloat 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sparkle-float {
          animation: float 4s infinite ease-in-out;
        }
        .brand-title {
          font-size: 3.5rem;
          font-weight: 950;
          color: white;
          margin: 0;
          letter-spacing: -0.05em;
          text-shadow: 0 10px 30px rgba(0,0,0,0.1);
          opacity: 0;
          transform: translateY(20px);
          animation: textReveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.4s forwards;
        }
        .tagline-reveal {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          transform: translateY(10px);
          animation: textReveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.6s forwards;
        }
        .tagline-reveal span {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.8);
        }
        .tagline-pip {
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          opacity: 0.5;
        }
        @keyframes logoFloat {
          0% { transform: scale(0.5); opacity: 0; filter: blur(10px); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }
        @keyframes textReveal {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
      `}} />
    </div>
  );
};

export default SplashScreen;
