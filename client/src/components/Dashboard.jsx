import React, { useState, useEffect, useRef } from 'react';
import {
    IconHome, IconRecords, IconProfile, IconHeart, IconActivity,
    IconThermometer, IconWeight, IconSleep, IconPlus, IconUpload,
    IconScan, IconVitals, IconBot, IconBell, IconSearch,
    IconShieldCheck, IconInsurance, IconMedicine, IconFlask, IconSparkles
} from './Icons';
import BottomNavigation from './common/BottomNavigation';
import HealthTrackers from './HealthTrackers';

import MedicationReminders from './MedicationReminders';
import StoryViewer from './StoryViewer';
import HealthBot from './HealthBot';
import PremiumModal from './common/PremiumModal';

const Dashboard = ({ onNavigate, documents, onAdd, user, familyMembers = [], onRefreshFamily, action, onActionHandled }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [vitals, setVitals] = useState({ heart_rate: null, bp: null, weight: null, temp: null });
    const [stories, setStories] = useState([]);
    const [viewingStory, setViewingStory] = useState(null);
    const [showBot, setShowBot] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);

    const isPremium = user?.subscription?.tier === 'premium' || user?.subscription?.tier === 'family';

    const handleFeatureClick = (path) => {
        if (!isPremium && (path === 'bot' || path === 'vitals-history')) {
            setShowPremiumModal(true);
        } else {
            if (path === 'bot') setShowBot(true);
            else onNavigate(path);
        }
    };

    // Handle incoming navigation actions (from App.jsx or internal)
    useEffect(() => {
        if (action === 'scan') {
            fileInputRef.current?.click();
            if (onActionHandled) onActionHandled();
        } else if (action === 'bot') {
            setShowBot(true);
            if (onActionHandled) onActionHandled();
        }
    }, [action, onActionHandled]);

    const userName = (user && user.name) ? user.name.split(' ')[0] : 'Guest';
    const userInitials = (user && user.name) ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'G';

    useEffect(() => {
        fetchVitals();
        fetchStories();
    }, [user, selectedFamilyMember]);

    const fetchStories = async () => {
        try {
            const response = await fetch('/api/content/stories');
            if (response.ok) setStories(await response.json());
        } catch (err) { console.error(err); }
    };

    const fetchVitals = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('medics_token');
            let url = '/api/vitals';
            if (selectedFamilyMember) url += `?family_member_id=${selectedFamilyMember._id}`;

            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.ok) {
                const data = await response.json();
                const latest = { heart_rate: null, bp: null, weight: null, temp: null, blood_sugar: null, history: data };
                data.forEach(v => { if (!latest[v.type]) latest[v.type] = v; });
                setVitals(latest);
            }
        } catch (err) { console.error(err); }
    };

    const handleAddVital = async (type, value, unit) => {
        try {
            const token = localStorage.getItem('medics_token');
            const body = { type, value, unit, date: new Date(), family_member_id: selectedFamilyMember?._id };
            await fetch('/api/vitals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            fetchVitals();
        } catch (err) { console.error(err); }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                onAdd({
                    title: file.name,
                    fileUrl: event.target.result,
                    size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                    category: 'Uploaded',
                    doctor: 'Self Upload'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="page-container" style={{ background: 'var(--bg-app)' }}>

            {/* Top Bar - Eka Style */}
            <div style={{ padding: '20px 20px 10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div onClick={() => onNavigate('profile')} className="flex-center" style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'var(--primary-subtle)', color: 'var(--primary)',
                    fontWeight: '800', cursor: 'pointer', border: '2px solid white',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    {userInitials}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>Hello, {userName}</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>How are you feeling?</p>
                </div>
                <button className="flex-center" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', width: '40px', height: '40px', color: 'var(--text-muted)' }}>
                    <IconBell size={20} />
                </button>
            </div>

            <main className="scroll-content" style={{ padding: '0 20px 120px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

                {/* Dual ABHA/Pass Strip - Eka Care Style */}
                <div className="animate-fade" style={{
                    marginTop: '8px',
                    background: 'white', borderRadius: '24px', padding: '16px',
                    border: '1px solid #EEF2FF', display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '1px', boxShadow: '0 4px 12px rgba(80, 66, 189, 0.05)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', height: '60%', width: '1px', background: '#F1F5F9' }}></div>

                    <div onClick={() => onNavigate('profile')} className="clickable" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px' }}>
                        <div className="flex-center" style={{ width: '36px', height: '36px', background: 'var(--primary-subtle)', borderRadius: '12px', color: 'var(--primary)' }}>
                            <IconShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-secondary)' }}>Medics Pass ›</h4>
                            <p style={{ fontSize: '0.7rem', color: 'var(--primary)', margin: 0, fontWeight: '800' }}>Buy now</p>
                        </div>
                    </div>

                    <div onClick={() => onNavigate('profile')} className="clickable" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px', justifyContent: 'flex-end' }}>
                        <div style={{ textAlign: 'right' }}>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: '800', margin: 0, color: 'var(--text-secondary)' }}>ABHA ID ›</h4>
                            <p style={{ fontSize: '0.7rem', color: 'var(--primary)', margin: 0, fontWeight: '800' }}>Create Now</p>
                        </div>
                        <div className="flex-center" style={{ width: '36px', height: '36px', background: 'var(--primary-subtle)', borderRadius: '12px', color: 'var(--primary)' }}>
                            <IconRecords size={20} />
                        </div>
                    </div>
                </div>

                {/* Recently Tracked Section */}
                <div style={{ marginTop: '4px' }}>
                    <div className="flex-between" style={{ marginBottom: '16px', paddingLeft: '4px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--premium-dark)' }}>Recently tracked</h3>
                        <span
                            onClick={() => onNavigate('records')}
                            style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}
                        >
                            HISTORY {!isPremium && '👑'} ›
                        </span>
                    </div>

                    <div className="scroll-snap-x hide-scrollbar" style={{ padding: '4px 2px', gap: '12px' }}>
                        <div className="stat-card-premium scroll-card" style={{ minWidth: '135px' }}>
                            <div className="stat-icon-wrapper" style={{ background: '#FEE2E2', color: '#EF4444' }}>
                                <IconHeart />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>HEART RATE</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>{vitals.heart_rate?.value || '--'}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', opacity: 0.7 }}>BPM</span>
                            </div>
                        </div>

                        <div className="stat-card-premium scroll-card" style={{ minWidth: '135px' }}>
                            <div className="stat-icon-wrapper" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                                <IconThermometer size={18} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>TEMPERATURE</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>{vitals.temp?.value || '--'}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', opacity: 0.7 }}>°F</span>
                            </div>
                        </div>

                        <div className="stat-card-premium scroll-card" style={{ minWidth: '135px' }}>
                            <div className="stat-icon-wrapper" style={{ background: '#DCFCE7', color: '#10B981' }}>
                                <IconFlask size={18} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>BLOOD SUGAR</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>{vitals.blood_sugar?.value || '--'}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', opacity: 0.7 }}>mg/dL</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scan Records Banner - Eka Signature */}
                <div style={{ margin: '8px 0' }}>
                    <div onClick={() => fileInputRef.current.click()} className="health-id-card animate-fade" style={{
                        display: 'flex', alignItems: 'center',
                        gap: '20px', padding: '20px', cursor: 'pointer', border: 'none',
                        position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(80, 66, 189, 0.25)'
                    }}>
                        <div className="holographic-glow" />
                        <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', color: 'white' }}>
                            <IconScan />
                        </div>
                        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0, color: 'white' }}>Scan Records</h4>
                            <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: '2px 0 0', color: 'white' }}>Save reports for AI health analysis</p>
                        </div>
                        <IconSparkles />
                    </div>
                </div>

                {/* Modules Grid */}
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div onClick={() => handleFeatureClick('records')} className="stat-card-premium animate-fade" style={{ background: 'white', alignItems: 'flex-start', padding: '20px' }}>
                        <div className="stat-icon-wrapper" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                            <IconRecords />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>Records</h4>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Latest: Lab Report</p>
                        </div>
                    </div>

                    <div onClick={() => handleFeatureClick('bot')} className="stat-card-premium animate-fade" style={{ background: 'white', alignItems: 'flex-start', padding: '20px', position: 'relative' }}>
                        {!isPremium && <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.8rem' }}>👑</span>}
                        <div className="stat-icon-wrapper" style={{ background: '#FDF2F8', color: '#DB2777' }}>
                            <IconBot />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>Dr. Coach</h4>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Ask AI Assistant</p>
                        </div>
                    </div>

                    <div onClick={() => onNavigate('insurance')} className="stat-card-premium animate-fade" style={{ background: 'white', alignItems: 'flex-start', padding: '20px' }}>
                        <div className="stat-icon-wrapper" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                            <IconInsurance />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>Insurance</h4>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>Policy Insights</p>
                        </div>
                    </div>

                    <div onClick={() => onNavigate('records')} className="stat-card-premium animate-fade" style={{ background: 'white', alignItems: 'flex-start', padding: '20px' }}>
                        <div className="stat-icon-wrapper" style={{ background: '#F0F9FF', color: '#0284C7' }}>
                            <IconMedicine />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '800', margin: 0 }}>Medicines</h4>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>2 Due Today</p>
                        </div>
                    </div>
                </section>

                <div id="medication-section" style={{ marginTop: '4px' }}>
                    <div className="flex-between" style={{ marginBottom: '16px', paddingLeft: '4px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--premium-dark)' }}>Daily Medications</h3>
                        <button
                            onClick={() => handleFeatureClick('records')}
                            className="flex-center"
                            style={{
                                width: '32px', height: '32px', borderRadius: '10px',
                                background: 'var(--primary-subtle)', border: 'none', color: 'var(--primary)'
                            }}
                        >
                            <IconPlus size={18} />
                        </button>
                    </div>
                    <MedicationReminders
                        isPremium={user?.subscription?.tier === 'premium'}
                        onUpgrade={() => onNavigate('subscription')}
                    />
                </div>

                <HealthTrackers onAddVital={handleAddVital} />

            </main>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*,application/pdf" />

            <BottomNavigation
                activeTab="home"
                onNavigate={onNavigate}
            />

            {showBot && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                }}>
                    <div style={{ height: '94vh', background: 'white', borderRadius: '32px 32px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} className="animate-fade">
                        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }} onClick={() => setShowBot(false)}>
                            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px' }} />
                        </div>
                        <div style={{ flex: 1, padding: '0 20px 20px', display: 'flex', flexDirection: 'column' }}>
                            <div className="flex-between" style={{ padding: '8px 0 16px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>HealthBot AI</h3>
                                <button onClick={() => setShowBot(false)} className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>Close</button>
                            </div>
                            <div style={{ flex: 1 }}>
                                <HealthBot />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onUpgrade={() => onNavigate('subscription')}
            />
        </div>
    );
};

export default Dashboard;
