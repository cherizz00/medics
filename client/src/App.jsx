import React, { useState, useEffect } from 'react';
import './App.css';
import { LanguageProvider } from './LanguageContext';
import Tesseract from 'tesseract.js';
import SplashScreen from './components/SplashScreen';
import OnboardingFlow from './components/OnboardingFlow';
import LoginView from './components/LoginView';
import TalentAuth from './components/TalentAuth';
import Dashboard from './components/Dashboard';
import ProfileView from './components/ProfileView';
import RecordsView from './components/RecordsView';
import { SharedAccessView, SecurityView, StorageView, FAQView } from './components/ProfileSubViews';
import VaultView from './components/VaultView';
import InsuranceView from './components/InsuranceView';
import ConsultancyView from './components/ConsultancyView';
import ExploreView from './components/ExploreView';
import HeartRateMonitor from './components/HeartRateMonitor';
import MedicineScanner from './components/MedicineScanner';
import HealthTrackersView from './components/HealthTrackersView';
import HealthInsightsView from './components/HealthInsightsView';
import MedicineReminderView from './components/MedicineReminderView';
import { MEDICINE_DATABASE } from './data/medicineDb';
import { IconMedicine, IconCart, IconScan, IconClose, IconArrowLeft } from './components/Icons';

function App() {
  const [currentStep, setCurrentStep] = useState('splash');
  const [dashboardAction, setDashboardAction] = useState(null);

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
    if (!savedUser) return null;
    const parsed = JSON.parse(savedUser);
    return parsed;
  });
  const [documents, setDocuments] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('medics_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [analyzingReport, setAnalyzingReport] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('Initializing AI Vision...');
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [detectedMedicines, setDetectedMedicines] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    localStorage.setItem('medics_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const [selectedMeds, setSelectedMeds] = useState({});
  const [extractedSnippets, setExtractedSnippets] = useState([]);

  const triggerAnalysis = async (file) => {
    setAnalyzingReport(true);
    setAnalysisStatus('Initializing OCR Engine...');
    setExtractedSnippets([]);

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setAnalysisStatus(`OCR: Processing... ${(m.progress * 100).toFixed(0)}%`);
          }
        }
      });

      const extractedText = result.data.text.toLowerCase();
      setAnalysisStatus('NLP: Analyzing clinical mentions...');

      const found = MEDICINE_DATABASE.filter(med =>
        extractedText.includes(med.name.toLowerCase().split(' ')[0])
      );

      setAnalysisStatus('Finalizing results...');
      setTimeout(() => {
        setAnalyzingReport(false);
        const mapped = found.map((item, i) => ({
          ...item,
          id: `med-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
          quantity: 1
        }));
        setDetectedMedicines(mapped);

        const initialSelection = {};
        mapped.forEach(m => initialSelection[m.id] = true);
        setSelectedMeds(initialSelection);
        setShowMedicineModal(true);
      }, 1000);

    } catch (error) {
      console.error("Analysis Error:", error);
      setAnalyzingReport(false);
      alert("OCR Analysis failed. Please try a clearer document.");
    }
  };

  const toggleMedSelection = (id) => {
    setSelectedMeds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = () => {
    const medsToPush = detectedMedicines.filter(m => selectedMeds[m.id]);
    if (medsToPush.length === 0) {
      setShowMedicineModal(false);
      return;
    }

    const itemsWithUniqueIds = medsToPush.map(med => ({
      ...med,
      cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setCartItems(prev => [...prev, ...itemsWithUniqueIds]);
    setShowMedicineModal(false);
    setDetectedMedicines([]);
    setSelectedMeds({});
    setTimeout(() => setShowCart(true), 500);
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchFamily();

      const interval = setInterval(() => {
        fetchDocuments();
        fetchFamily();
      }, 30000);

      return () => clearInterval(interval);
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

  const saveVital = async (type, value, unit) => {
    try {
      const token = localStorage.getItem('medics_token');
      const response = await fetch('/api/vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type, value, unit,
          date: new Date(),
          family_member_id: selectedFamilyMember?._id
        })
      });
      return response.ok;
    } catch (err) {
      console.error('Save Vital Error:', err);
      return false;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('medics_token');
    if (token && user) {
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
    <LanguageProvider>
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
        <div className={`step-wrapper ${['dashboard', 'profile', 'records', 'explore', 'faq', 'shared', 'security', 'storage', 'vault', 'insurance', 'consultancy', 'heartrate', 'trackers', 'insights', 'medicine-reminder'].includes(currentStep) ? 'active' : ''}`}>
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
              selectedFamilyMember={selectedFamilyMember}
              onSetFamilyMember={setSelectedFamilyMember}
              cartItems={cartItems}
              onSetCartItems={setCartItems}
              onTriggerAnalysis={triggerAnalysis}
              onShowCart={() => setShowCart(true)}
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
              onTriggerAnalysis={triggerAnalysis}
            />
          )}
          {currentStep === 'faq' && <FAQView onBack={() => setCurrentStep('profile')} />}
          {currentStep === 'shared' && <SharedAccessView onBack={() => setCurrentStep('profile')} />}
          {currentStep === 'security' && <SecurityView onBack={() => setCurrentStep('profile')} />}
          {currentStep === 'storage' && <StorageView onBack={() => setCurrentStep('profile')} />}
          {currentStep === 'vault' && <VaultView onBack={() => setCurrentStep('profile')} />}
          {currentStep === 'insurance' && <InsuranceView onBack={() => setCurrentStep('profile')} />}
          {currentStep === 'consultancy' && <ConsultancyView onBack={() => setCurrentStep('dashboard')} onNavigate={handleNavigate} />}
          {currentStep === 'explore' && <ExploreView onBack={() => setCurrentStep('dashboard')} onNavigate={handleNavigate} />}
          {currentStep === 'trackers' && <HealthTrackersView onBack={() => setCurrentStep('explore')} onNavigate={handleNavigate} />}
          {currentStep === 'insights' && <HealthInsightsView onBack={() => setCurrentStep('explore')} onNavigate={handleNavigate} />}
          {currentStep === 'medicine-reminder' && <MedicineReminderView onBack={() => setCurrentStep('explore')} onNavigate={handleNavigate} />}
          {currentStep === 'heartrate' && (
            <HeartRateMonitor
              onBack={() => setCurrentStep('dashboard')}
              onSave={async (bpm) => {
                const success = await saveVital('heart_rate', bpm, 'BPM');
                if (success) {
                  alert(`Heart Rate of ${bpm} BPM saved to history.`);
                  setCurrentStep('dashboard');
                } else {
                  alert('Failed to save reading.');
                }
              }}
            />
          )}
          {currentStep === 'scanner' && (
            <MedicineScanner
              onBack={() => setCurrentStep('dashboard')}
              onAddToCart={(meds) => {
                const itemsToAdd = meds.map(m => ({
                  ...m,
                  quantity: 1,
                  cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                }));
                setCartItems(prev => [...prev, ...itemsToAdd]);
                alert(`${meds.length} item(s) added to cart.`);
              }}
            />
          )}
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
        }
      `}} />

        {analyzingReport && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 50, 40, 0.95)', backdropFilter: 'blur(12px)',
            zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white', textAlign: 'center'
          }}>
            <div style={{ marginBottom: '32px' }}>
              <IconScan size={64} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '8px' }}>Analyzing Medical Report</h3>
            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>{analysisStatus}</p>

            <div style={{
              marginTop: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px',
              width: '80%', fontSize: '0.85rem', fontFamily: 'monospace', textAlign: 'left',
              color: '#10b981', overflow: 'hidden', height: '80px', border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {extractedSnippets.map((snippet, i) => (
                <div key={i}>{`> ${snippet}`}</div>
              ))}
            </div>
          </div>
        )}

        {showMedicineModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
            zIndex: 3100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <div className="medical-card" style={{ background: 'white', width: '100%', maxWidth: '400px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div className="flex-center" style={{ width: '44px', height: '44px', background: 'var(--primary-subtle)', color: 'var(--primary)', borderRadius: '12px' }}>
                  <IconMedicine />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>Medicines Detected</h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {detectedMedicines.length > 0
                      ? `We found ${detectedMedicines.length} items in your report`
                      : 'We couldn’t find any medicines in this report'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {detectedMedicines.length > 0 ? (
                  detectedMedicines.map(med => {
                    const isSelected = selectedMeds[med.id];
                    return (
                      <div
                        key={med.id}
                        onClick={() => toggleMedSelection(med.id)}
                        style={{
                          padding: '12px', borderRadius: '14px', border: `1px solid ${isSelected ? 'var(--primary)' : '#E2E8F0'}`,
                          background: isSelected ? 'var(--primary-subtle)' : '#F8FAFC', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '12px'
                        }}
                      >
                        <div style={{
                          width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${isSelected ? 'var(--primary)' : '#CBD5E0'}`,
                          background: isSelected ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {isSelected && <span style={{ color: 'white', fontSize: '12px', fontWeight: '900' }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="flex-between">
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>{med.name}</h4>
                            <span style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--primary)' }}>₹{med.price}</span>
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{med.instructions}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', background: '#F8FAFC', borderRadius: '14px', border: '1px dashed #E2E8F0' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>No medications were detected by the AI scanner.</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: detectedMedicines.length > 0 ? '1fr 1fr' : '1fr', gap: '12px' }}>
                <button onClick={() => setShowMedicineModal(false)} className="btn-outlined" style={{ height: '48px', borderRadius: '14px' }}>
                  {detectedMedicines.length > 0 ? 'Cancel' : 'Close'}
                </button>
                {detectedMedicines.length > 0 && (
                  <button onClick={addToCart} className="btn btn-primary" style={{ height: '48px', borderRadius: '14px' }}>Confirm & Add</button>
                )}
              </div>
            </div>
          </div>
        )}

        {showCart && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
            zIndex: 3200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
          }}>
            <div style={{ height: '70vh', background: 'white', borderRadius: '32px 32px 0 0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }} onClick={() => setShowCart(false)}>
                <div style={{ width: '40px', height: '5px', background: '#E2E8F0', borderRadius: '3px', cursor: 'pointer' }} />
              </div>
              <div style={{ flex: 1, padding: '0 24px 24px', overflowY: 'auto' }}>
                <div className="flex-between" style={{ padding: '8px 0 20px', borderBottom: '1px solid #E2E8F0', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--premium-dark)' }}>Pharmacy Cart</h3>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>{cartItems.length} items</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                  {cartItems.map((item, idx) => (
                    <div key={item.cartId || idx} className="flex-between" style={{ padding: '12px 0', borderBottom: '1px dashed #E2E8F0' }}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div className="flex-center" style={{ width: '48px', height: '48px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                          <IconMedicine size={20} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800' }}>{item.name}</h4>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--premium-dark)' }}>₹{item.price * item.quantity / 10}</div>
                        <button onClick={() => setCartItems(prev => prev.filter((_, i) => i !== idx))} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.7rem', fontWeight: '800', padding: 0 }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="medical-card" style={{ background: '#F8FAFC', padding: '16px', marginBottom: '24px' }}>
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Subtotal</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity / 10), 0)}</span>
                  </div>
                  <div className="flex-between" style={{ borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '8px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: '900' }}>Total Amount</span>
                    <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--primary)' }}>₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity / 10), 0)}</span>
                  </div>
                </div>

                <button onClick={() => { alert('Proceeding to payment...'); setShowCart(false); setCartItems([]); }} className="btn btn-primary" style={{ width: '100%', height: '56px', borderRadius: '18px', fontSize: '1rem', fontWeight: '900' }}>
                  Checkout Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
