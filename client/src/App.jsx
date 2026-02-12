import React, { useState, useEffect } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import OnboardingFlow from './components/OnboardingFlow';
import LoginView from './components/LoginView';
import TalentAuth from './components/TalentAuth';
// import SignUpView from './components/SignUpView'; // Deprecated
import Dashboard from './components/Dashboard';
import ProfileView from './components/ProfileView';
import RecordsView from './components/RecordsView';
import { SharedAccessView, SecurityView, StorageView, FAQView } from './components/ProfileSubViews';
import SubscriptionView from './components/SubscriptionView';
import VaultView from './components/VaultView';
import InsuranceView from './components/InsuranceView';

function App() {
  const [currentStep, setCurrentStep] = useState('splash'); // splash, onboarding, login, dashboard, profile, records
  const [dashboardAction, setDashboardAction] = useState(null); // 'scan' | 'bot' | null

  const handleNavigate = (step) => {
    if (step === 'scan' || step === 'bot') {
      setDashboardAction(step);
      setCurrentStep('dashboard');
    } else {
      setCurrentStep(step);
    }
  };

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medics_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [documents, setDocuments] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchFamily();
    }
  }, [user]);

  const fetchFamily = async () => {
    try {
      const token = localStorage.getItem('medics_token');
      const response = await fetch('/api/family', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFamilyMembers(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Fetch Family Error:', err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('medics_token');
      const response = await fetch('/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Fetch Documents Error:', err);
    }
  };

  const addDocument = async (newDoc) => {
    try {
      const token = localStorage.getItem('medics_token');
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newDoc.title,
          fileUrl: newDoc.url || newDoc.fileUrl,
          category: newDoc.category,
          size: newDoc.size
        })

      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(prev => [data, ...prev]);
        alert('File uploaded to vault successfully!');
      } else if (response.status === 401) {
        handleLogout();
        alert('Session expired. Please log in again.');
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Add Document Error:', err);
      alert('Connection error. Please check if the server is running.');
    }

  };

  const deleteDocument = async (id) => {
    try {
      const token = localStorage.getItem('medics_token');
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => (doc._id || doc.id) !== id));
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Delete Document Error:', err);
    }
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
      <div className={`step-wrapper ${currentStep === 'talent-auth' ? 'active' : ''}`}>
        {currentStep === 'talent-auth' && <TalentAuth onLogin={handleLogin} onBack={() => setCurrentStep('login')} />}
      </div>
      {/* SignUpView merged into LoginView (OTP Flow) */}
      <div className={`step-wrapper ${['dashboard', 'profile', 'records', 'faq', 'shared', 'security', 'storage', 'subscription', 'vault', 'insurance'].includes(currentStep) ? 'active' : ''}`}>
        {currentStep === 'dashboard' && (
          <Dashboard
            user={user}
            documents={documents.slice(0, 3)}
            familyMembers={familyMembers}
            onNavigate={handleNavigate}
            onAdd={addDocument}
            onRefreshFamily={fetchFamily}
            action={dashboardAction}
            onActionHandled={() => setDashboardAction(null)}
          />
        )}
        {currentStep === 'profile' && <ProfileView user={user} documents={documents} familyMembers={familyMembers} onBack={() => setCurrentStep('dashboard')} onLogout={handleLogout} onNavigate={handleNavigate} onRefreshFamily={fetchFamily} />}

        {currentStep === 'records' && (
          <RecordsView
            user={user}
            documents={documents}
            familyMembers={familyMembers}
            onBack={() => setCurrentStep('dashboard')}
            onAdd={addDocument}
            onDelete={deleteDocument}
            onNavigate={handleNavigate}
          />
        )}
        {currentStep === 'faq' && <FAQView onBack={() => setCurrentStep('profile')} />}
        {currentStep === 'shared' && <SharedAccessView onBack={() => setCurrentStep('profile')} />}
        {currentStep === 'security' && <SecurityView onBack={() => setCurrentStep('profile')} />}
        {currentStep === 'storage' && <StorageView onBack={() => setCurrentStep('profile')} />}
        {currentStep === 'subscription' && (
          <SubscriptionView
            user={user}
            onBack={() => setCurrentStep('profile')}
            onUpdateUser={(updated) => setUser(updated)}
          />
        )}
        {currentStep === 'vault' && <VaultView onBack={() => setCurrentStep('profile')} />}
        {currentStep === 'insurance' && <InsuranceView onBack={() => setCurrentStep('profile')} />}
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
