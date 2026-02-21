import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import translations from '../translations';
import {
    IconHome, IconRecords, IconProfile, IconHeart, IconActivity,
    IconThermometer, IconWeight, IconSleep, IconPlus, IconUpload,
    IconScan, IconVitals, IconBot, IconBell, IconSearch,
    IconShieldCheck, IconInsurance, IconMedicine, IconFlask, IconSparkles, IconDoctor, IconLock, IconClose
} from './Icons';
import BottomNavigation from './common/BottomNavigation';
import HealthTrackers from './HealthTrackers';


import StoryViewer from './StoryViewer';
import HealthBot from './HealthBot';

/* ─── Inline SVG Icons ─── */
const ScanIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h3" /><path d="M20 7V4h-3" /><path d="M4 17v3h3" /><path d="M20 17v3h-3" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const SparkIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" /></svg>
);
const ChevronRightSmall = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4l4 4-4 4" /></svg>
);

const Dashboard = ({ onNavigate, documents, onAdd, user, familyMembers = [], onRefreshFamily, action, onActionHandled, selectedFamilyMember, onSetFamilyMember, cartItems = [], onSetCartItems, onTriggerAnalysis, onShowCart }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [vitals, setVitals] = useState({ heart_rate: null, bp: null, weight: null, temp: null });
    const [stories, setStories] = useState([]);
    const [viewingStory, setViewingStory] = useState(null);
    const [showBot, setShowBot] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const fileInputRef = useRef(null);

    const handleFeatureClick = (path) => {
        if (path === 'bot') setShowBot(true);
        else onNavigate(path);
    };

    useEffect(() => {
        if (action === 'scan') {
            onNavigate('scanner');
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
        fetchNotifications();

        const interval = setInterval(() => {
            fetchVitals();
            fetchNotifications();
        }, 30000);
        return () => clearInterval(interval);
    }, [user, selectedFamilyMember]);

    const fetchStories = async () => {
        try {
            const response = await fetch('/api/content/stories');
            if (response.ok) setStories(await response.json());
        } catch (err) { console.error(err); }
    };

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) setNotifications(await response.json());
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

    const markNotificationAsRead = async (id) => {
        try {
            const token = localStorage.getItem('medics_token');
            await fetch(`/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) { console.error(err); }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            onTriggerAnalysis(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                onAdd({
                    id: Date.now(),
                    title: file.name,
                    fileUrl: event.target.result,
                    size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                    category: 'Uploaded',
                    doctor: 'Self Upload',
                    uploadedAt: new Date().toISOString()
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const { language } = useLanguage();
    const t = translations[language] || translations.English;

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return t.goodMorning;
        if (h < 17) return t.goodAfternoon;
        return t.goodEvening;
    };

    const quickActions = [
        { icon: <IconRecords size={20} />, label: t.records, sub: t.healthVault, color: '#4A6CF7', bg: '#EEF2FF', path: 'records' },
        { icon: <IconBot size={20} />, label: t.drCoach, sub: t.aiAssistant, color: '#EC4899', bg: '#FDF2F8', path: 'bot' },
        { icon: <IconDoctor size={20} />, label: t.consult, sub: t.findDoctors, color: '#10B981', bg: '#ECFDF5', path: 'consultancy' },
        { icon: <IconInsurance size={20} />, label: t.insurance, sub: t.policyInsights, color: '#F59E0B', bg: '#FFFBEB', path: 'insurance' },
        { icon: <IconLock size={20} />, label: t.vault, sub: t.encrypted, color: '#6366F1', bg: '#EEF2FF', path: 'vault' },
        { icon: <IconMedicine size={20} />, label: t.pharmacy, sub: t.orderMeds, color: '#EF4444', bg: '#FEF2F2', path: 'pharmacy' },
    ];

    return (
        <div className="page-container" style={{ background: '#F7F8FA' }}>

            {/* ─── Header ─── */}
            <div style={{
                padding: '16px 20px 12px',
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.04)',
                flexShrink: 0,
            }}>
                <div
                    onClick={() => onNavigate('profile')}
                    style={{
                        width: '42px', height: '42px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, var(--primary), #6366F1)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer',
                        boxShadow: '0 4px 12px -4px rgba(74,108,247,0.3)',
                        letterSpacing: '-0.02em',
                    }}
                >
                    {userInitials}
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 1px', fontWeight: '400' }}>{getGreeting()}</p>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{userName} 👋</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {cartItems.length > 0 && (
                        <button
                            onClick={onShowCart}
                            style={{
                                width: '38px', height: '38px', borderRadius: '12px',
                                background: 'var(--primary)', border: 'none',
                                color: 'white', position: 'relative', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <IconRecords size={18} />
                            <div style={{
                                position: 'absolute', top: '-4px', right: '-4px',
                                background: '#EF4444', color: 'white', borderRadius: '50%',
                                width: '18px', height: '18px', fontSize: '0.6rem', fontWeight: '700',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid white',
                            }}>
                                {cartItems.length}
                            </div>
                        </button>
                    )}
                    <button
                        onClick={() => setShowNotifications(true)}
                        style={{
                            width: '38px', height: '38px', borderRadius: '12px',
                            background: '#F3F4F6', border: 'none',
                            color: 'var(--text-secondary)', position: 'relative', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <IconBell size={19} />
                        {notifications.some(n => !n.is_read) && (
                            <div style={{
                                position: 'absolute', top: '8px', right: '8px',
                                width: '8px', height: '8px', background: '#EF4444',
                                borderRadius: '50%', border: '2px solid #F3F4F6',
                            }} />
                        )}
                    </button>
                </div>
            </div>

            <main className="scroll-content hide-scrollbar" style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* ─── Scan Records CTA ─── */}
                <div
                    onClick={() => onNavigate('scanner')}
                    style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #3B5BDB 50%, #6366F1 100%)',
                        borderRadius: '20px',
                        padding: '24px 20px',
                        minHeight: '80px',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 8px 24px -8px rgba(74,108,247,0.35)',
                    }}
                >
                    {/* Decorative circles */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <ScanIcon />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', margin: 0, color: 'white' }}>
                                {t.scanAnalyze}
                            </h4>
                            <p style={{ fontSize: '0.78rem', opacity: 0.85, margin: '3px 0 0', color: 'white', fontWeight: '400' }}>
                                {t.scanSubtitle}
                            </p>
                        </div>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <SparkIcon />
                        </div>
                    </div>
                </div>

                {/* ─── Vitals Summary ─── */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 2px' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>{t.healthSummary}</h3>
                        <button onClick={() => onNavigate('explore')} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '500',
                            display: 'flex', alignItems: 'center', gap: '2px',
                        }}>
                            {t.viewAll} <ChevronRightSmall />
                        </button>
                    </div>

                    <div style={{
                        display: 'flex', gap: '10px', overflowX: 'auto',
                        scrollbarWidth: 'none', padding: '2px 0 4px',
                    }}>
                        {[
                            { label: t.heartRate, value: vitals.heart_rate?.value || '--', unit: 'BPM', color: '#EF4444', bg: '#FEF2F2', icon: <IconHeart size={16} />, path: 'heartrate' },
                            { label: t.temperature, value: vitals.temp?.value || '--', unit: '°F', color: '#3B82F6', bg: '#EFF6FF', icon: <IconThermometer size={16} />, path: null },
                            { label: t.bloodSugar, value: vitals.blood_sugar?.value || '--', unit: 'mg/dL', color: '#8B5CF6', bg: '#F5F3FF', icon: <IconFlask size={16} />, path: null },
                        ].map((v, i) => (
                            <div
                                key={i}
                                onClick={() => v.path && onNavigate(v.path)}
                                style={{
                                    minWidth: '140px', flex: '0 0 auto',
                                    background: 'white', borderRadius: '18px',
                                    padding: '16px 14px',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                    cursor: v.path ? 'pointer' : 'default',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '10px',
                                    background: v.bg, color: v.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '10px',
                                }}>
                                    {v.icon}
                                </div>
                                <p style={{ fontSize: '0.65rem', fontWeight: '500', color: 'var(--text-muted)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{v.label}</p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                                    <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)' }}>{v.value}</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '400', color: 'var(--text-muted)' }}>{v.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Quick Actions Grid ─── */}
                <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 14px 2px' }}>{t.quickActions}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {quickActions.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleFeatureClick(item.path)}
                                style={{
                                    background: 'white',
                                    borderRadius: '18px',
                                    padding: '18px 12px 16px',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                    cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s',
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '13px',
                                    background: item.bg, color: item.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {item.icon}
                                </div>
                                <div>
                                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', display: 'block' }}>{item.label}</span>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '400', color: 'var(--text-muted)', display: 'block', marginTop: '1px' }}>{item.sub}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>



                {/* ─── Health Trackers ─── */}
                <HealthTrackers onAddVital={handleAddVital} onNavigate={onNavigate} />

            </main>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*,application/pdf" />

            <BottomNavigation activeTab="home" onNavigate={onNavigate} />

            {/* ─── Health Bot Modal ─── */}
            {showBot && (
                <div
                    onClick={() => setShowBot(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 2000,
                        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            height: '94vh', background: 'white',
                            borderRadius: '20px 20px 0 0', overflow: 'hidden',
                            display: 'flex', flexDirection: 'column', position: 'relative',
                        }}
                    >

                        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }} onClick={() => setShowBot(false)}>
                            <div style={{ width: '36px', height: '4px', background: '#E5E7EB', borderRadius: '2px', cursor: 'pointer' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                            <HealthBot onNavigate={onNavigate} onClose={() => setShowBot(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Notifications Panel ─── */}
            {showNotifications && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 2000,
                    background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }}>
                    <div style={{
                        height: '80vh', background: '#FAFBFC',
                        borderRadius: '20px 20px 0 0', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                    }}>
                        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }} onClick={() => setShowNotifications(false)}>
                            <div style={{ width: '36px', height: '4px', background: '#E5E7EB', borderRadius: '2px', cursor: 'pointer' }} />
                        </div>
                        <div style={{ flex: 1, padding: '0 20px 24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '4px 0 16px', borderBottom: '1px solid #F3F4F6', marginBottom: '16px',
                            }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>{t.notifications}</h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        fontSize: '0.85rem', fontWeight: '600', color: 'var(--primary)',
                                    }}
                                >Done</button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {notifications.length === 0 ? (
                                    <div style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                                        justifyContent: 'center', height: '300px', opacity: 0.4,
                                    }}>
                                        <IconBell size={44} />
                                        <p style={{ marginTop: '12px', fontWeight: '500', fontSize: '0.9rem' }}>{t.noNotifications}</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div
                                            key={n._id}
                                            onClick={() => markNotificationAsRead(n._id)}
                                            style={{
                                                padding: '14px 16px', borderRadius: '16px', background: 'white',
                                                border: '1px solid rgba(0,0,0,0.04)',
                                                display: 'flex', gap: '12px',
                                                position: 'relative', cursor: 'pointer',
                                                boxShadow: n.is_read ? 'none' : '0 1px 4px rgba(0,0,0,0.04)',
                                                opacity: n.is_read ? 0.6 : 1,
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            {!n.is_read && (
                                                <div style={{ position: 'absolute', top: '16px', right: '16px', width: '7px', height: '7px', background: 'var(--primary)', borderRadius: '50%' }} />
                                            )}
                                            <div style={{
                                                width: '38px', height: '38px', borderRadius: '12px',
                                                background: n.type === 'reminder' ? '#FEF3C7' : (n.type === 'premium' ? '#EEF2FF' : '#F3F4F6'),
                                                color: n.type === 'reminder' ? '#D97706' : (n.type === 'premium' ? 'var(--primary)' : '#64748B'),
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                {n.type === 'reminder' ? <IconActivity size={16} /> : (n.type === 'premium' ? <IconSparkles size={16} /> : <IconBell size={16} />)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: '0.88rem', fontWeight: '600', margin: '0 0 2px', color: 'var(--text-main)' }}>{n.title}</h4>
                                                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4', fontWeight: '400' }}>{n.message}</p>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block', fontWeight: '400' }}>
                                                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Dashboard;
