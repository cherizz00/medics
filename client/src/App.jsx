import React, { useState, useEffect } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import OnboardingFlow from './components/OnboardingFlow';
import LoginView from './components/LoginView';
import Dashboard from './components/Dashboard';
import ProfileView from './components/ProfileView';
import RecordsView from './components/RecordsView';

function App() {
  const [currentStep, setCurrentStep] = useState('splash'); // splash, onboarding, login, dashboard, profile, records
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('medics_docs');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Full Blood Count', date: '2023-12-01', size: '1.2 MB', category: 'General' },
      { id: 2, title: 'Pharmacy Receipt', date: '2023-11-20', size: '0.8 MB', category: 'Pharma' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('medics_docs', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (newDoc) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => setCurrentStep('onboarding'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="App native-container">
      <div className={`step-wrapper ${currentStep === 'splash' ? 'active' : ''}`}>
        {currentStep === 'splash' && <SplashScreen />}
      </div>
      <div className={`step-wrapper ${currentStep === 'onboarding' ? 'active' : ''}`}>
        {currentStep === 'onboarding' && <OnboardingFlow onComplete={() => setCurrentStep('login')} />}
      </div>
      <div className={`step-wrapper ${currentStep === 'login' ? 'active' : ''}`}>
        {currentStep === 'login' && <LoginView onLogin={() => setCurrentStep('dashboard')} />}
      </div>
      <div className={`step-wrapper ${['dashboard', 'profile', 'records'].includes(currentStep) ? 'active' : ''}`}>
        {currentStep === 'dashboard' && (
          <Dashboard
            documents={documents.slice(0, 3)}
            onNavigate={(step) => setCurrentStep(step)}
            onAdd={addDocument}
          />
        )}
        {currentStep === 'profile' && <ProfileView onBack={() => setCurrentStep('dashboard')} />}
        {currentStep === 'records' && (
          <RecordsView
            documents={documents}
            onBack={() => setCurrentStep('dashboard')}
            onAdd={addDocument}
            onDelete={deleteDocument}
            onNavigate={(step) => setCurrentStep(step)}
          />
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .native-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: var(--apollo-bg);
        }
        .step-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
          animation: slideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .step-wrapper.active {
          display: block;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

export default App;
