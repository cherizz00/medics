import React, { useState, useEffect } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import OnboardingFlow from './components/OnboardingFlow';
import LoginView from './components/LoginView';
import SignUpView from './components/SignUpView';
import Dashboard from './components/Dashboard';
import ProfileView from './components/ProfileView';
import RecordsView from './components/RecordsView';
import FAQView from './components/FAQView';
import { SharedAccessView, SecurityView, StorageView } from './components/ProfileSubViews';

function App() {
  const [currentStep, setCurrentStep] = useState('splash'); // splash, onboarding, login, dashboard, profile, records
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medics_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
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
    // Check for auto-login
    const token = localStorage.getItem('medics_token');
    if (token && user) {
      // Only redirect to dashboard if we are on an introductory/auth screen
      if (['splash', 'onboarding', 'login', 'signup'].includes(currentStep)) {
        setCurrentStep('dashboard');
      }
    } else if (currentStep === 'splash') {
      const timer = setTimeout(() => setCurrentStep('onboarding'), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentStep('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('medics_token');
    localStorage.removeItem('medics_user');
    setUser(null);
    setCurrentStep('login');
  };

  return (
    <div className="App native-container" style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-app)'
    }}>
      <div className={`step-wrapper ${currentStep === 'splash' ? 'active' : ''}`}>
        {currentStep === 'splash' && <SplashScreen />}
      </div>
      <div className={`step-wrapper ${currentStep === 'onboarding' ? 'active' : ''}`}>
        {currentStep === 'onboarding' && <OnboardingFlow onComplete={() => setCurrentStep('login')} />}
      </div>
      <div className={`step-wrapper ${currentStep === 'login' ? 'active' : ''}`}>
        {currentStep === 'login' && <LoginView onLogin={handleLogin} onNavigate={(step) => setCurrentStep(step)} />}
      </div>
      <div className={`step-wrapper ${currentStep === 'signup' ? 'active' : ''}`}>
        {currentStep === 'signup' && <SignUpView onSignUp={handleLogin} onNavigate={(step) => setCurrentStep(step)} />}
      </div>
      <div className={`step-wrapper ${['dashboard', 'profile', 'records', 'faq', 'shared', 'security', 'storage'].includes(currentStep) ? 'active' : ''}`}>
        {currentStep === 'dashboard' && (
          <Dashboard
            user={user}
            documents={documents.slice(0, 3)}
            onNavigate={(step) => setCurrentStep(step)}
            onAdd={addDocument}
          />
        )}
        {currentStep === 'profile' && <ProfileView user={user} onBack={() => setCurrentStep('dashboard')} onLogout={handleLogout} onNavigate={(step) => setCurrentStep(step)} />}
        {currentStep === 'records' && (
          <RecordsView
            user={user}
            documents={documents}
            onBack={() => setCurrentStep('dashboard')}
            onAdd={addDocument}
            onDelete={deleteDocument}
            onNavigate={(step) => setCurrentStep(step)}
          />
        )}
        {currentStep === 'faq' && <FAQView onBack={() => setCurrentStep('profile')} />}
        {currentStep === 'shared' && <SharedAccessView onBack={() => setCurrentStep('profile')} />}
        {currentStep === 'security' && <SecurityView onBack={() => setCurrentStep('profile')} />}
        {currentStep === 'storage' && <StorageView onBack={() => setCurrentStep('profile')} />}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .step-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
        }
        .step-wrapper.active {
          display: block;
          animation: fadeIn 0.4s ease-out;
        }
      `}} />
    </div>
  );
}

export default App;
