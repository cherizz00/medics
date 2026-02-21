import React, { useState, useEffect } from 'react';
import { IconHome, IconRecords, IconProfile, IconHospital, IconMedicine, IconLab, IconInsurance, IconQuery, IconLock, IconStar, IconChat, IconStorage, IconAge, IconHeight, IconWeight, IconGender, IconChevronRight, IconChevronLeft, IconPlus, IconClose, IconTrash, IconNotification, IconCheck, IconLanguage, IconHistory, IconSparkles } from './Icons';
import BottomNavigation from './common/BottomNavigation';
import { useLanguage } from '../LanguageContext';
import translations from '../translations';

/* ─── Inline Icons ─── */
const ChevronIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 5l4 4-4 4" /></svg>
);
const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const ShareIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
);
const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const HeartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" /></svg>
);
const FolderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>
);
const PillIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 1.5l-8 8a5 5 0 007 7l8-8a5 5 0 00-7-7z" /><line x1="6" y1="12" x2="12" y2="6" /></svg>
);
const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
);
const HelpIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);
const LogoutIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
);
const ClipboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>
);
const MessageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
);

/* ─── Menu Row Component ─── */
const MenuRow = ({ icon, label, subtitle, onClick, color = 'var(--primary)', danger = false }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            width: '100%', padding: '15px 0',
            background: 'none', border: 'none', cursor: 'pointer',
            textAlign: 'left',
        }}
    >
        <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: danger ? '#FEF2F2' : `${color}12`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: danger ? '#EF4444' : color, flexShrink: 0,
        }}>
            {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
                fontSize: '0.92rem', fontWeight: '500',
                color: danger ? '#EF4444' : 'var(--text-main)',
                display: 'block',
            }}>{label}</span>
            {subtitle && <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{subtitle}</span>}
        </div>
        {!danger && <ChevronIcon />}
    </button>
);

/* ─── Section Card ─── */
const SectionCard = ({ title, children }) => (
    <div style={{ marginBottom: '24px' }}>
        {title && <h4 style={{
            fontSize: '0.68rem', fontWeight: '600', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            margin: '0 0 10px 4px',
        }}>{title}</h4>}
        <div style={{
            background: 'white', borderRadius: '18px',
            padding: '4px 18px',
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
            {React.Children.map(children, (child, i) => (
                <>
                    {child}
                    {i < React.Children.count(children) - 1 && (
                        <div style={{ height: '1px', background: '#F3F4F6', marginLeft: '54px' }} />
                    )}
                </>
            ))}
        </div>
    </div>
);

const ProfileView = ({ onBack, onNavigate, onLogout, user, documents = [], familyMembers: sharedFamilyMembers = [], onRefreshFamily }) => {

    const [showAddModal, setShowAddModal] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', relation: 'other', phoneNumber: '' });
    const [isManaging, setIsManaging] = useState(false);
    const [localRefresh, setLocalRefresh] = useState(0);

    const { language } = useLanguage();
    const t = translations[language] || translations.English;

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', gender: '', dob: '', age: '', height: '', weight: '' });

    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState({ type: 'general', message: '', rating: 5 });

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(feedback)
            });
            if (response.ok) {
                alert('Thank you for your feedback!');
                setShowFeedback(false);
                setFeedback({ type: 'general', message: '', rating: 5 });
            } else {
                alert('Failed to submit feedback.');
            }
        } catch (err) { console.error(err); }
    };

    const userName = (user && typeof user.name === 'string') ? user.name : 'Guest User';
    const userInitials = (user && typeof user.name === 'string' && user.name.trim())
        ? user.name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'GU';

    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || '',
                phone: user.phoneNumber || '',
                gender: user.gender || '',
                dob: user.dob || '',
                age: user.age || '',
                height: user.height || '',
                weight: user.weight || '',
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('medics_user', JSON.stringify(updatedUser));
                setShowEditModal(false);
                window.location.reload();
            } else {
                throw new Error('API failed');
            }
        } catch (err) {
            // Fallback: save to localStorage directly
            console.warn('API unavailable, saving profile locally');
            const currentUser = JSON.parse(localStorage.getItem('medics_user') || '{}');
            const updatedUser = { ...currentUser, name: editForm.name, phoneNumber: editForm.phone, gender: editForm.gender, dob: editForm.dob, age: editForm.age, height: editForm.height, weight: editForm.weight };
            localStorage.setItem('medics_user', JSON.stringify(updatedUser));
            setShowEditModal(false);
            window.location.reload();
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Delete account? This cannot be undone.')) {
            try {
                const token = localStorage.getItem('medics_token');
                const response = await fetch('/api/user', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    localStorage.clear();
                    window.location.reload();
                } else {
                    alert('Failed to delete account');
                }
            } catch (err) {
                console.error('Delete Account Error:', err);
            }
        }
    };

    const localFamilyMembers = JSON.parse(localStorage.getItem('medics_family') || '[]');
    const apiFamilyMapped = (sharedFamilyMembers || [])
        .filter(m => m && typeof m === 'object')
        .map(m => ({
            id: m._id || m.id,
            name: m.name || 'Family Member',
            initial: (m.name || '?').charAt(0).toUpperCase(),
            relation: m.relation || 'Relative',
            linked_user_id: m.linked_user_id
        }));

    const localFamilyMapped = localFamilyMembers
        .filter(m => m && typeof m === 'object')
        .map(m => ({
            id: m.id,
            name: m.name || 'Family Member',
            initial: (m.name || '?').charAt(0).toUpperCase(),
            relation: m.relation || 'Relative',
            linked_user_id: null
        }));

    // Merge API + localStorage members (avoid duplicates by id)
    const apiIds = new Set(apiFamilyMapped.map(m => m.id));
    const familyMembersMapped = [
        ...apiFamilyMapped,
        ...localFamilyMapped.filter(m => !apiIds.has(m.id)),
    ];

    const me = { id: 'me', name: 'You', initial: 'Y', relation: 'self' };
    const allFamilyMembers = [me, ...familyMembersMapped];

    const handleAddMember = async () => {
        if (!newMember.name.trim()) return;
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newMember)
            });
            if (response.ok) {
                onRefreshFamily?.();
            } else {
                throw new Error('API failed');
            }
        } catch (err) {
            // Fallback: save to localStorage
            console.warn('API unavailable, saving family member locally');
            const stored = JSON.parse(localStorage.getItem('medics_family') || '[]');
            stored.push({ id: Date.now().toString(), name: newMember.name.trim(), relation: newMember.relation, phoneNumber: newMember.phoneNumber });
            localStorage.setItem('medics_family', JSON.stringify(stored));
            setLocalRefresh(n => n + 1);
        }
        setNewMember({ name: '', relation: 'other', phoneNumber: '' });
        setShowAddModal(false);
    };

    const deleteMember = async (id) => {
        if (id === 'me') return;
        if (!window.confirm('Remove this profile?')) return;
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/family/' + id, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                onRefreshFamily?.();
            } else {
                throw new Error('API failed');
            }
        } catch (err) {
            // Fallback: remove from localStorage
            console.warn('API unavailable, removing family member locally');
            const stored = JSON.parse(localStorage.getItem('medics_family') || '[]');
            const updated = stored.filter(m => m.id !== id);
            localStorage.setItem('medics_family', JSON.stringify(updated));
            setLocalRefresh(n => n + 1);
        }
    };

    return (
        <div className="page-container" style={{ background: '#F7F8FA' }}>
            <main className="scroll-content hide-scrollbar" style={{ padding: '0 20px 100px' }}>

                {/* ─── Header ─── */}
                <div style={{
                    padding: '16px 0 0',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <button onClick={onBack} style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.06)', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-main)',
                    }}>
                        <IconChevronLeft size={20} />
                    </button>
                    <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>
                        {t.profile}
                    </span>
                    <button style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.06)', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-main)', position: 'relative',
                    }}>
                        <IconNotification size={20} />
                    </button>
                </div>

                {/* ─── Profile Card ─── */}
                <div style={{
                    margin: '20px 0 28px',
                    background: 'white',
                    borderRadius: '22px',
                    padding: '28px 24px 24px',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Top accent */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                        background: 'linear-gradient(90deg, var(--primary), #818CF8, var(--primary))',
                    }} />

                    {/* Avatar */}
                    <div style={{
                        width: '84px', height: '84px',
                        borderRadius: '26px',
                        background: 'linear-gradient(135deg, var(--primary), #6366F1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: 'white', fontWeight: '700', fontSize: '1.6rem',
                        letterSpacing: '-0.02em',
                        boxShadow: '0 8px 24px -8px rgba(74, 108, 247, 0.35)',
                    }}>
                        {userInitials}
                    </div>

                    <h2 style={{
                        fontSize: '1.3rem', fontWeight: '700', margin: '0 0 4px',
                        color: 'var(--text-main)', letterSpacing: '-0.02em',
                    }}>{userName}</h2>
                    <p style={{
                        fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 12px',
                        fontWeight: '400',
                    }}>
                        {user?.phoneNumber || user?.email || 'Premium Member'}
                    </p>

                    {/* Health ID Token */}
                    {(() => {
                        // Generate or retrieve a persistent unique token per user
                        const userKey = user?.email || user?.phoneNumber || user?.name || 'guest';
                        const storageKey = 'medics_health_id_' + userKey;
                        let token = localStorage.getItem(storageKey);
                        if (!token) {
                            const seed = userKey + Date.now();
                            let hash = 0;
                            for (let i = 0; i < seed.length; i++) {
                                hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
                            }
                            token = 'MED-' + Math.abs(hash).toString(36).toUpperCase().slice(0, 4) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
                            localStorage.setItem(storageKey, token);
                        }
                        return (
                            <div
                                onClick={() => {
                                    navigator.clipboard?.writeText(token);
                                    const el = document.getElementById('token-copied');
                                    if (el) { el.style.opacity = '1'; setTimeout(() => el.style.opacity = '0', 1200); }
                                }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                                    background: 'linear-gradient(135deg, rgba(74,108,247,0.06), rgba(99,102,241,0.08))',
                                    border: '1px solid rgba(74,108,247,0.12)',
                                    borderRadius: '10px', padding: '7px 14px',
                                    cursor: 'pointer', margin: '0 auto 16px',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                }}
                            >
                                <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--primary)', letterSpacing: '0.04em' }}>🆔</span>
                                <span style={{ fontSize: '0.74rem', fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace', letterSpacing: '0.06em' }}>{token}</span>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: '2px' }}>📋</span>
                                <span id="token-copied" style={{
                                    position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
                                    background: '#10B981', color: 'white', fontSize: '0.65rem', fontWeight: '600',
                                    padding: '3px 10px', borderRadius: '6px', opacity: 0,
                                    transition: 'opacity 0.3s', whiteSpace: 'nowrap', pointerEvents: 'none',
                                }}>Copied!</span>
                            </div>
                        );
                    })()}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setShowEditModal(true)}
                            style={{
                                flex: 1, height: '44px', borderRadius: '13px',
                                background: 'var(--primary)', color: 'white',
                                border: 'none', cursor: 'pointer',
                                fontSize: '0.85rem', fontWeight: '600',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                boxShadow: '0 4px 12px -4px rgba(74, 108, 247, 0.3)',
                                transition: 'all 0.2s',
                            }}
                        >
                            <EditIcon /> {t.editProfile}
                        </button>
                        <button style={{
                            width: '44px', height: '44px', borderRadius: '13px',
                            background: '#F3F4F6', color: 'var(--text-secondary)',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}>
                            <ShareIcon />
                        </button>
                    </div>
                </div>

                {/* ─── Quick Stats ─── */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
                    marginBottom: '28px',
                }}>
                    {[
                        { label: t.age, value: user?.age || '—', unit: t.years, color: '#6366F1' },
                        { label: t.height, value: user?.height || '—', unit: t.cm, color: '#10B981' },
                        { label: t.weight, value: user?.weight || '—', unit: t.kg, color: '#F59E0B' },
                    ].map((stat, i) => (
                        <div key={i} style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '16px 12px',
                            textAlign: 'center',
                            border: '1px solid rgba(0,0,0,0.04)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '10px',
                                background: `${stat.color}12`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 8px',
                            }}>
                                {i === 0 && <IconAge size={16} color={stat.color} />}
                                {i === 1 && <IconHeight size={16} color={stat.color} />}
                                {i === 2 && <IconWeight size={16} color={stat.color} />}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                {stat.value} <span style={{ fontSize: '0.72rem', fontWeight: '400', color: 'var(--text-muted)' }}>{stat.unit}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* ─── Family Members ─── */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                        <h4 style={{ fontSize: '0.68rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{t.familyMembers}</h4>
                        <button onClick={() => setIsManaging(!isManaging)} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)',
                        }}>
                            {isManaging ? 'Done' : 'Manage'}
                        </button>
                    </div>

                    <div style={{
                        display: 'flex', gap: '12px', overflowX: 'auto',
                        padding: '4px 0 8px', scrollbarWidth: 'none',
                    }}>
                        <button onClick={() => setShowAddModal(true)} style={{
                            width: '58px', height: '58px', borderRadius: '18px',
                            border: '1.5px dashed rgba(0,0,0,0.12)',
                            background: 'white', color: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0,
                            transition: 'all 0.2s',
                        }}>
                            <IconPlus size={20} />
                        </button>

                        {allFamilyMembers.map((m, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                <div style={{
                                    width: '58px', height: '58px', borderRadius: '18px',
                                    background: m.id === 'me' ? 'linear-gradient(135deg, var(--primary), #6366F1)' : 'white',
                                    color: m.id === 'me' ? 'white' : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.1rem', fontWeight: '700',
                                    border: m.id === 'me' ? 'none' : '1px solid rgba(0,0,0,0.06)',
                                    position: 'relative', flexShrink: 0,
                                    boxShadow: m.id === 'me' ? '0 4px 12px -4px rgba(74,108,247,0.3)' : '0 1px 3px rgba(0,0,0,0.02)',
                                }}>
                                    {m.initial}
                                    {m.linked_user_id && <span style={{
                                        position: 'absolute', bottom: '-3px', right: '-3px',
                                        background: '#10B981', color: 'white', borderRadius: '50%',
                                        padding: '3px', border: '2px solid #F7F8FA', display: 'flex'
                                    }}>
                                        <IconCheck size={8} color="white" />
                                    </span>}
                                    {isManaging && m.id !== 'me' && (
                                        <button onClick={() => deleteMember(m.id)} style={{
                                            position: 'absolute', top: '-6px', right: '-6px',
                                            width: '20px', height: '20px', background: '#EF4444',
                                            color: 'white', borderRadius: '50%', border: '2px solid #F7F8FA',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: 0, cursor: 'pointer',
                                        }}>
                                            <IconClose size={10} color="white" />
                                        </button>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.68rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Medical Services ─── */}
                <SectionCard title={t.healthServices}>
                    <MenuRow icon={<FolderIcon />} label={t.myRecords} subtitle={t.myRecordsSub} onClick={() => onNavigate('records')} />
                    <MenuRow icon={<PillIcon />} label="Medications" subtitle="Prescriptions & reminders" onClick={() => onNavigate('medicine-reminder')} color="#10B981" />
                    <MenuRow icon={<ClipboardIcon />} label={t.insurancePlans} subtitle={t.insurancePlansSub} onClick={() => onNavigate('insurance')} color="#F59E0B" />
                    <MenuRow icon={<HeartIcon />} label={t.consultDoctor} subtitle={t.consultDoctorSub} onClick={() => onNavigate('consultancy')} color="#EC4899" />
                </SectionCard>

                {/* ─── Security & Privacy ─── */}
                <SectionCard title={t.securityPrivacy}>
                    <MenuRow icon={<ShieldIcon />} label={t.securitySettings} subtitle={t.securitySettingsSub} onClick={() => onNavigate('security')} color="#6366F1" />
                    <MenuRow icon={<UsersIcon />} label={t.sharedAccess} subtitle={t.sharedAccessSub} onClick={() => onNavigate('shared')} color="#8B5CF6" />
                    <MenuRow icon={<IconStorage />} label={t.storageUsage} subtitle={t.storageUsageSub} onClick={() => onNavigate('storage')} color="#64748B" />
                </SectionCard>

                {/* ─── Support ─── */}
                <SectionCard title={t.support}>
                    <MenuRow icon={<MessageIcon />} label={t.sendFeedback} subtitle={t.sendFeedbackSub} onClick={() => setShowFeedback(true)} color="#0EA5E9" />
                    <MenuRow icon={<HelpIcon />} label={t.faqHelp} subtitle={t.faqHelpSub} onClick={() => onNavigate('faq')} color="#14B8A6" />
                </SectionCard>

                {/* ─── Danger Zone ─── */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        background: 'white', borderRadius: '18px',
                        padding: '4px 18px',
                        border: '1px solid rgba(0,0,0,0.04)',
                    }}>
                        <MenuRow icon={<LogoutIcon />} label={t.logOut} onClick={onLogout} danger />
                        <div style={{ height: '1px', background: '#F3F4F6', marginLeft: '54px' }} />
                        <MenuRow icon={<IconTrash />} label={t.deleteAccount} onClick={handleDeleteAccount} danger />
                    </div>
                </div>

                {/* ─── App Version ─── */}
                <p style={{
                    textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)',
                    margin: '0 0 16px', fontWeight: '400', opacity: 0.6,
                }}>
                    Medics v2.1.0
                </p>
            </main>

            <BottomNavigation activeTab="profile" onNavigate={onNavigate} />

            {/* ─── Add Family Modal ─── */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: '20px',
                }} onClick={() => setShowAddModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'white', borderRadius: '24px', padding: '28px',
                        width: '100%', maxWidth: '380px',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                    }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 4px', color: 'var(--text-main)', textAlign: 'center' }}>Add Family Member</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 24px', textAlign: 'center' }}>Manage health records for loved ones</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                            {[
                                { placeholder: 'Full Name', key: 'name' },
                                { placeholder: 'Relation (e.g. Spouse)', key: 'relation' },
                                { placeholder: 'Phone Number', key: 'phoneNumber' },
                            ].map(({ placeholder, key }) => (
                                <input
                                    key={key}
                                    placeholder={placeholder}
                                    value={newMember[key]}
                                    onChange={e => setNewMember({ ...newMember, [key]: e.target.value })}
                                    style={{
                                        width: '100%', height: '50px', padding: '0 16px',
                                        borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.07)',
                                        background: '#F9FAFB', fontSize: '0.9rem',
                                        outline: 'none', boxSizing: 'border-box',
                                        transition: 'all 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'white'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.07)'; e.target.style.background = '#F9FAFB'; }}
                                />
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowAddModal(false)} style={{
                                flex: 1, height: '48px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.07)',
                                background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                                color: 'var(--text-secondary)',
                            }}>Cancel</button>
                            <button onClick={handleAddMember} style={{
                                flex: 1, height: '48px', borderRadius: '14px', border: 'none',
                                background: 'var(--primary)', color: 'white', cursor: 'pointer',
                                fontWeight: '600', fontSize: '0.9rem',
                                boxShadow: '0 4px 12px -4px rgba(74,108,247,0.3)',
                            }}>Add Profile</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Edit Profile Modal ─── */}
            {showEditModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: '20px',
                }} onClick={() => setShowEditModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'white', borderRadius: '24px', padding: '28px',
                        width: '100%', maxWidth: '380px',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                    }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 4px', color: 'var(--text-main)', textAlign: 'center' }}>Edit Profile</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 24px', textAlign: 'center' }}>Update your personal information</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                            {[
                                { placeholder: 'Name', key: 'name' },
                                { placeholder: 'Phone', key: 'phone' },
                            ].map(({ placeholder, key }) => (
                                <input
                                    key={key}
                                    placeholder={placeholder}
                                    value={editForm[key]}
                                    onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                                    style={{
                                        width: '100%', height: '50px', padding: '0 16px',
                                        borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.07)',
                                        background: '#F9FAFB', fontSize: '0.9rem',
                                        outline: 'none', boxSizing: 'border-box',
                                        transition: 'all 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'white'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.07)'; e.target.style.background = '#F9FAFB'; }}
                                />
                            ))}
                            {/* Gender Selector */}
                            <div>
                                <p style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', margin: '0 0 8px', paddingLeft: '2px' }}>Gender</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[
                                        { value: 'Male', emoji: '👨', label: 'Male' },
                                        { value: 'Female', emoji: '👩', label: 'Female' },
                                        { value: 'Other', emoji: '🧑', label: 'Other' },
                                    ].map(g => {
                                        const selected = editForm.gender === g.value;
                                        return (
                                            <button key={g.value} onClick={() => setEditForm({ ...editForm, gender: g.value })} style={{
                                                flex: 1, padding: '12px 8px', borderRadius: '14px',
                                                border: selected ? '2px solid var(--primary)' : '1.5px solid rgba(0,0,0,0.07)',
                                                background: selected ? 'rgba(74,108,247,0.06)' : '#F9FAFB',
                                                cursor: 'pointer', textAlign: 'center',
                                                transition: 'all 0.2s',
                                                boxShadow: selected ? '0 2px 8px rgba(74,108,247,0.12)' : 'none',
                                            }}>
                                                <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{g.emoji}</div>
                                                <span style={{
                                                    fontSize: '0.76rem', fontWeight: '600',
                                                    color: selected ? 'var(--primary)' : 'var(--text-muted)',
                                                }}>{g.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Body Stats */}
                            <div>
                                <p style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--text-muted)', margin: '0 0 8px', paddingLeft: '2px' }}>Body Stats</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[
                                        { key: 'age', placeholder: 'Age', unit: 'yrs', emoji: '🎂' },
                                        { key: 'height', placeholder: 'Height', unit: 'cm', emoji: '📏' },
                                        { key: 'weight', placeholder: 'Weight', unit: 'kg', emoji: '⚖️' },
                                    ].map(f => (
                                        <div key={f.key} style={{ flex: 1, position: 'relative' }}>
                                            <div style={{ fontSize: '0.9rem', textAlign: 'center', marginBottom: '4px' }}>{f.emoji}</div>
                                            <input
                                                type="number"
                                                placeholder={f.placeholder}
                                                value={editForm[f.key]}
                                                onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                                style={{
                                                    width: '100%', height: '44px', padding: '0 8px',
                                                    borderRadius: '12px', border: '1.5px solid rgba(0,0,0,0.07)',
                                                    background: '#F9FAFB', fontSize: '0.88rem', fontWeight: '600',
                                                    outline: 'none', boxSizing: 'border-box', textAlign: 'center',
                                                    transition: 'all 0.2s',
                                                }}
                                                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'white'; }}
                                                onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.07)'; e.target.style.background = '#F9FAFB'; }}
                                            />
                                            <p style={{ fontSize: '0.62rem', fontWeight: '500', color: 'var(--text-muted)', textAlign: 'center', margin: '3px 0 0' }}>{f.unit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowEditModal(false)} style={{
                                flex: 1, height: '48px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.07)',
                                background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                                color: 'var(--text-secondary)',
                            }}>Cancel</button>
                            <button onClick={handleSaveProfile} style={{
                                flex: 1, height: '48px', borderRadius: '14px', border: 'none',
                                background: 'var(--primary)', color: 'white', cursor: 'pointer',
                                fontWeight: '600', fontSize: '0.9rem',
                                boxShadow: '0 4px 12px -4px rgba(74,108,247,0.3)',
                            }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Feedback Modal ─── */}
            {showFeedback && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: '20px',
                }} onClick={() => setShowFeedback(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'white', borderRadius: '24px', padding: '28px',
                        width: '100%', maxWidth: '380px',
                        boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                    }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 4px', color: 'var(--text-main)', textAlign: 'center' }}>App Feedback</h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 24px', textAlign: 'center' }}>Help us improve your experience</p>

                        <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <textarea
                                placeholder="Tell us how we can improve..."
                                value={feedback.message}
                                onChange={e => setFeedback({ ...feedback, message: e.target.value })}
                                style={{
                                    width: '100%', minHeight: '120px', padding: '14px 16px',
                                    borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.07)',
                                    background: '#F9FAFB', fontSize: '0.9rem', fontFamily: 'inherit',
                                    outline: 'none', boxSizing: 'border-box', resize: 'vertical',
                                }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setShowFeedback(false)} style={{
                                    flex: 1, height: '48px', borderRadius: '14px', border: '1.5px solid rgba(0,0,0,0.07)',
                                    background: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                }}>Cancel</button>
                                <button type="submit" style={{
                                    flex: 1, height: '48px', borderRadius: '14px', border: 'none',
                                    background: 'var(--primary)', color: 'white', cursor: 'pointer',
                                    fontWeight: '600', fontSize: '0.9rem',
                                    boxShadow: '0 4px 12px -4px rgba(74,108,247,0.3)',
                                }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
