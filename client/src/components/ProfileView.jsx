import React, { useState, useEffect } from 'react';
import { IconHome, IconRecords, IconProfile, IconHospital, IconMedicine, IconLab, IconInsurance, IconQuery, IconLock, IconStar, IconChat, IconStorage, IconAge, IconHeight, IconWeight, IconGender, IconChevronRight, IconChevronLeft, IconPlus, IconClose, IconTrash, IconNotification, IconCheck, IconLanguage, IconHistory } from './Icons';
import BottomNavigation from './common/BottomNavigation';

const ProfileView = ({ onBack, onNavigate, onLogout, user, documents = [], familyMembers: sharedFamilyMembers = [], onRefreshFamily }) => {

    const [activeTab, setActiveTab] = useState('profile');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', relation: 'other', phoneNumber: '' });
    const [isManaging, setIsManaging] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', gender: '', dob: '' });

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

    const userName = (user && user.name) ? user.name : 'Guest User';
    const userInitials = (user && user.name) ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'G';

    useEffect(() => {
        if (user && (!editForm.name || editForm.name !== user.name)) {
            setEditForm({
                name: user.name || '',
                phone: user.phoneNumber || '',
                gender: user.gender || '',
                dob: user.dob || ''
            });
        }
    }, [user, editForm.name]);

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
                alert('Profile updated successfully!');
                window.location.reload();
            } else {
                alert('Failed to update profile');
            }
        } catch (err) {
            console.error('Update Profile Error:', err);
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

    const familyMembersMapped = sharedFamilyMembers.map(m => ({
        id: m._id,
        name: m.name,
        initial: m.name.charAt(0).toUpperCase(),
        relation: m.relation,
        linked_user_id: m.linked_user_id
    }));

    const me = { id: 'me', name: 'You', initial: 'Y', relation: 'self' };
    const allFamilyMembers = [me, ...familyMembersMapped];

    const handleAddMember = async () => {
        if (newMember.name.trim()) {
            try {
                const token = localStorage.getItem('medics_token');
                const response = await fetch('/api/family', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(newMember)
                });

                if (response.ok) {
                    onRefreshFamily();
                    setNewMember({ name: '', relation: 'other', phoneNumber: '' });
                    setShowAddModal(false);
                }
            } catch (err) {
                console.error('Error adding member:', err);
            }
        }
    };

    const deleteMember = async (id) => {
        if (id === 'me') return;
        if (window.confirm('Remove this profile?')) {
            try {
                const token = localStorage.getItem('medics_token');
                await fetch('/api/family/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                onRefreshFamily();
            } catch (err) {
                console.error('Error deleting member:', err);
            }
        }
    };

    const menuItems = [
        { icon: <IconRecords />, title: 'My Health Vault', subtitle: 'Clinical documents & records' },
        { icon: <IconLock />, title: 'Secret Vault', subtitle: 'AES-256 encrypted storage' },
        { icon: <IconHospital />, title: 'Shared Access', subtitle: 'Manage doctor permissions' },
        { icon: <IconStorage />, title: 'Storage & Data', subtitle: 'Manage usage & limits' },
        { icon: <IconLock />, title: 'Security Settings', subtitle: '2FA & App Lock' },
        { icon: <IconStar stroke="#EAB308" />, title: `Subscription: ${(user?.subscription?.tier || 'Free').toUpperCase()}`, subtitle: 'View benefits & billing' },
        { icon: <IconMedicine />, title: 'Medications', subtitle: 'Prescriptions & reminders' },
        { icon: <IconInsurance />, title: 'Insurance Insights', subtitle: 'Coverage analysis' },
        { icon: <IconChat />, title: 'Send Feedback', subtitle: 'Report bugs or suggestions' },
        { icon: <IconQuery />, title: 'Help & Support', subtitle: 'FAQs & Privacy Policy' }
    ];

    return (
        <div className="page-container" style={{ background: 'var(--bg-app)' }}>

            <header style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0 }}>
                        <IconChevronLeft size={24} />
                    </button>
                    <button className="btn-ghost flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0 }}>
                        <IconNotification size={24} />
                    </button>
                </div>

                <div className="flex-center" style={{
                    width: '100px', height: '100px', background: 'var(--primary-subtle)',
                    borderRadius: '32px', color: 'var(--primary)', fontWeight: '800', fontSize: '2rem',
                    boxShadow: '0 8px 16px rgba(80, 66, 189, 0.1)', border: '2px solid white'
                }}>
                    {userInitials}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 4px', color: 'var(--premium-dark)' }}>{userName}</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Male, 28 years</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginTop: '8px' }}>
                    <button className="btn btn-primary" style={{ height: '48px', borderRadius: '14px', fontSize: '0.85rem' }}>Switch Profile</button>
                    <button className="btn-outlined" style={{ height: '48px', borderRadius: '14px', fontSize: '0.85rem' }}>Refer a Friend</button>
                </div>
            </header>

            <main className="scroll-content" style={{ padding: '0 20px 100px' }}>

                {/* Eka Style ABHA Card */}
                <div className="animate-fade" style={{ marginBottom: '24px' }}>
                    <div className="health-id-card" style={{
                        padding: '24px', display: 'flex', flexDirection: 'column',
                        minHeight: '210px', justifyContent: 'space-between',
                        boxShadow: '0 12px 30px rgba(16, 185, 129, 0.25)'
                    }}>
                        <div className="holographic-glow"></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                <div className="flex-center" style={{
                                    width: '52px', height: '52px',
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(8px)',
                                    borderRadius: '16px', color: 'white', fontWeight: '800',
                                    fontSize: '1.2rem', border: '1px solid rgba(255,255,255,0.3)'
                                }}>
                                    {userInitials}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 2px', fontWeight: '800', letterSpacing: '0.01em' }}>{userName}</h3>
                                    <p style={{ fontSize: '0.75rem', opacity: 0.9, margin: 0, fontWeight: '600' }}>ABHA: 12-3456-7890-1234</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" alt="Emblem" style={{ height: '36px', filter: 'brightness(0) invert(1)' }} />
                                <span style={{ fontSize: '0.5rem', fontWeight: '800', opacity: 0.8, textTransform: 'uppercase' }}>Government of India</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div>
                                    <p style={{ fontSize: '0.6rem', opacity: 0.8, margin: '0 0 4px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>DOB</p>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '800', margin: 0 }}>{user?.dob || '20 May 1995'}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.6rem', opacity: 0.8, margin: '0 0 4px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em' }}>Gender</p>
                                    <p style={{ fontSize: '0.85rem', fontWeight: '800', margin: 0 }}>{user?.gender || 'Male'}</p>
                                </div>
                            </div>
                            <div style={{
                                background: 'white', padding: '6px', borderRadius: '12px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.5)'
                            }}>
                                <div style={{
                                    width: '64px', height: '64px',
                                    background: 'url(https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg)',
                                    backgroundSize: 'cover',
                                    filter: 'contrast(1.1)'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                    <div className="stat-card-premium animate-fade">
                        <div className="stat-icon-wrapper">
                            <IconAge />
                        </div>
                        <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', margin: '4px 0 2px', fontWeight: '800', textTransform: 'uppercase' }}>AGE</p>
                        <p style={{ fontSize: '1rem', fontWeight: '900', margin: 0, color: 'var(--text-main)' }}>28</p>
                    </div>
                    <div className="stat-card-premium animate-fade" style={{ animationDelay: '0.1s' }}>
                        <div className="stat-icon-wrapper">
                            <IconHeight />
                        </div>
                        <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', margin: '4px 0 2px', fontWeight: '800', textTransform: 'uppercase' }}>HEIGHT</p>
                        <p style={{ fontSize: '1rem', fontWeight: '900', margin: 0, color: 'var(--text-main)' }}>178 cm</p>
                    </div>
                    <div className="stat-card-premium animate-fade" style={{ animationDelay: '0.2s' }}>
                        <div className="stat-icon-wrapper">
                            <IconWeight />
                        </div>
                        <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', margin: '4px 0 2px', fontWeight: '800', textTransform: 'uppercase' }}>WEIGHT</p>
                        <p style={{ fontSize: '1rem', fontWeight: '900', margin: 0, color: 'var(--text-main)' }}>72 kg</p>
                    </div>
                </div>

                {/* Family Profiles */}
                <section style={{ marginBottom: '32px' }}>
                    <div className="flex-between" style={{ padding: '0 4px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)' }}>Family Members</span>
                        <button onClick={() => setIsManaging(!isManaging)} className="btn-ghost" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                            {isManaging ? 'Done' : 'MANAGE'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '4px 4px 12px', scrollbarWidth: 'none' }}>
                        <button onClick={() => setShowAddModal(true)} className="flex-center" style={{
                            width: '64px', height: '64px', borderRadius: '22px', border: '2px dashed var(--border)',
                            background: 'white', color: 'var(--primary)', flexShrink: 0,
                            transition: 'all 0.2s ease',
                        }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                            <IconPlus />
                        </button>

                        {allFamilyMembers.map((m, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '22px',
                                    background: m.id === 'me' ? 'var(--primary-subtle)' : 'white',
                                    color: m.id === 'me' ? 'var(--primary)' : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.2rem', fontWeight: '900', border: m.id === 'me' ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                                    position: 'relative', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {m.initial}
                                    {m.linked_user_id && <span style={{
                                        position: 'absolute', bottom: '-4px', right: '-4px',
                                        background: 'var(--primary)', color: 'white', borderRadius: '50%',
                                        padding: '4px', border: '2px solid white', display: 'flex'
                                    }}>
                                        <IconCheck size={10} color="white" />
                                    </span>}
                                    {isManaging && m.id !== 'me' && (
                                        <button onClick={() => deleteMember(m.id)} style={{
                                            position: 'absolute', top: '-8px', right: '-8px',
                                            width: '24px', height: '24px', background: 'var(--error)',
                                            color: 'white', borderRadius: '50%', border: '2px solid white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: 0
                                        }}>
                                            <IconClose size={12} color="white" />
                                        </button>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-main)' }}>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Eka Style Categorized Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* PROFILE Section */}
                    <div>
                        <h4 className="text-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '4px' }}>PROFILE</h4>
                        <div className="medical-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {[
                                { icon: <IconProfile />, title: 'Update Profile', action: () => setShowEditModal(true) },
                                { icon: <IconPlus />, title: 'Add Family', action: () => setShowAddModal(true) }
                            ].map((item, i, arr) => (
                                <div key={i} onClick={item.action} className="flex-between clickable" style={{
                                    padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ color: 'var(--text-main)' }}>{item.icon}</div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.title}</span>
                                    </div>
                                    <IconChevronRight size={18} color="var(--text-muted)" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* APP PREFERENCES Section */}
                    <div>
                        <h4 className="text-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '4px' }}>APP PREFERENCES</h4>
                        <div className="medical-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {[
                                { icon: <IconLanguage />, title: 'Language', subtitle: 'English' },
                                { icon: <IconLock />, title: 'Security Settings', action: () => onNavigate('security') }
                            ].map((item, i, arr) => (
                                <div key={i} onClick={item.action} className="flex-between clickable" style={{
                                    padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ color: 'var(--text-main)' }}>{item.icon}</div>
                                        <div>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.title}</span>
                                            {item.subtitle && <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.subtitle}</p>}
                                        </div>
                                    </div>
                                    <IconChevronRight size={18} color="var(--text-muted)" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EKA PASS / SUBSCRIPTION Section */}
                    <div>
                        <h4 className="text-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '4px' }}>MEDICS PASS</h4>
                        <div className="medical-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {[
                                { icon: <IconStar />, title: 'Manage Subscription', action: () => onNavigate('subscription') },
                                { icon: <IconHistory />, title: 'Restore Purchase' }
                            ].map((item, i, arr) => (
                                <div key={i} onClick={item.action} className="flex-between clickable" style={{
                                    padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ color: 'var(--text-main)' }}>{item.icon}</div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.title}</span>
                                    </div>
                                    <IconChevronRight size={18} color="var(--text-muted)" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DATA Section */}
                    <div>
                        <h4 className="text-label" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '4px' }}>DATA</h4>
                        <div className="medical-card" style={{ padding: 0, overflow: 'hidden' }}>
                            {[
                                { icon: <IconStorage />, title: 'Data Sources and Devices', action: () => onNavigate('storage') },
                                { icon: <IconLock />, title: 'My Health Vault', action: () => onNavigate('records') }
                            ].map((item, i, arr) => (
                                <div key={i} onClick={item.action} className="flex-between clickable" style={{
                                    padding: '16px 20px', borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ color: 'var(--text-main)' }}>{item.icon}</div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.title}</span>
                                    </div>
                                    <IconChevronRight size={18} color="var(--text-muted)" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={onLogout} className="btn btn-secondary" style={{ width: '100%', color: 'var(--error)', height: '52px', borderRadius: '16px', fontWeight: '800' }}>
                        LOG OUT
                    </button>
                    <button onClick={handleDeleteAccount} style={{
                        background: 'none', border: 'none', width: '100%', fontSize: '0.75rem',
                        color: 'var(--text-muted)', fontWeight: '800', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}>
                        <IconTrash /> DELETE ACCOUNT
                    </button>
                </div>
            </main>

            <BottomNavigation activeTab="profile" onNavigate={onNavigate} />

            {/* Modal Components */}
            {showAddModal && (
                <div className="overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} onClick={() => setShowAddModal(false)}>
                    <div className="medical-card animate-pop" onClick={e => e.stopPropagation()} style={{ background: 'white', padding: '32px', width: '90%', maxWidth: '400px', borderRadius: '24px' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '1.5rem', fontWeight: '900', color: 'var(--premium-dark)' }}>Add Family Member</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '600' }}>Manage health records for your loved ones.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <input className="input-field" placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} style={{ borderRadius: '14px' }} />
                            <input className="input-field" placeholder="Relation (e.g. Spouse)" value={newMember.relation} onChange={e => setNewMember({ ...newMember, relation: e.target.value })} style={{ borderRadius: '14px' }} />
                            <input className="input-field" placeholder="Phone Number" value={newMember.phoneNumber} onChange={e => setNewMember({ ...newMember, phoneNumber: e.target.value })} style={{ borderRadius: '14px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-ghost" style={{ flex: 1, fontWeight: '700' }} onClick={() => setShowAddModal(false)}>CANCEL</button>
                            <button className="btn btn-primary" style={{ flex: 1, fontWeight: '900', borderRadius: '14px' }} onClick={handleAddMember}>ADD PROFILE</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} onClick={() => setShowEditModal(false)}>
                    <div className="medical-card animate-pop" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px', padding: '32px', background: 'white', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', color: 'var(--premium-dark)' }}>Edit Profile</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '600' }}>Update your personal health information.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <input className="input-field" placeholder="Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ borderRadius: '14px' }} />
                            <input className="input-field" placeholder="Phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} style={{ borderRadius: '14px' }} />
                            <select className="input-field" value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} style={{ borderRadius: '14px' }}>
                                <option value="">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button className="btn btn-ghost" style={{ flex: 1, fontWeight: '700' }} onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1, fontWeight: '900', borderRadius: '14px' }} onClick={handleSaveProfile}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {showFeedback && (
                <div className="overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} onClick={() => setShowFeedback(false)}>
                    <div className="medical-card animate-pop" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px', padding: '32px', background: 'white', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '8px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', color: 'var(--premium-dark)' }}>App Feedback</h3>
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '600' }}>Help us improve your clinical experience.</p>

                        <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <textarea className="input-field" placeholder="Tell us how we can improve..." style={{ minHeight: '140px', borderRadius: '16px', paddingTop: '16px' }} value={feedback.message} onChange={e => setFeedback({ ...feedback, message: e.target.value })} />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" className="btn btn-ghost" style={{ flex: 1, fontWeight: '700' }} onClick={() => setShowFeedback(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, fontWeight: '900', borderRadius: '14px' }}>Submit Feedback</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
