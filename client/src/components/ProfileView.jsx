import React, { useState, useEffect } from 'react';
import { IconHome, IconRecords, IconProfile, IconHospital, IconMedicine, IconLab, IconInsurance, IconQuery, IconStyles } from './Icons';

const ProfileView = ({ onBack, onNavigate, onLogout, user }) => {

    const [activeTab, setActiveTab] = useState('profile');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [isManaging, setIsManaging] = useState(false); // Toggle for delete mode

    const userName = (user && user.name) ? user.name : 'Guest User';
    const userPhone = (user && user.phoneNumber) ? user.phoneNumber : '';
    const userInitials = (user && user.name) ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'G';

    const [familyMembers, setFamilyMembers] = useState(() => {
        const saved = localStorage.getItem('medics_family');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Cherry', color: 'var(--primary-subtle)', initial: 'C' },
            { id: 2, name: 'John Jr', color: 'var(--accent-light)', initial: 'J' },
            { id: 3, name: 'Emily', color: '#FFF7ED', initial: 'E' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('medics_family', JSON.stringify(familyMembers));
    }, [familyMembers]);

    const handleAddMember = () => {
        if (newMemberName.trim()) {
            const newMember = {
                id: Date.now(),
                name: newMemberName,
                initial: newMemberName.charAt(0).toUpperCase(),
                color: ['var(--primary-subtle)', '#FFF7ED', '#F0FDFA'][Math.floor(Math.random() * 3)]
            };
            setFamilyMembers([...familyMembers, newMember]);
            setNewMemberName('');
            setShowAddModal(false);
        }
    };

    const deleteMember = (id) => {
        if (window.confirm('Remove this profile?')) {
            setFamilyMembers(familyMembers.filter(m => m.id !== id));
        }
    };

    const menuItems = [
        { icon: <IconRecords />, title: 'My Health Vault', subtitle: 'View and manage all stored documents' },
        { icon: <IconHospital />, title: 'Shared Access', subtitle: 'Manage doctor and hospital permissions' },
        { icon: <IconInsurance />, title: 'Security Settings', subtitle: 'App lock, Biometrics and Encryption' },
        { icon: <IconLab />, title: 'Storage Usage', subtitle: 'Check used space and plan limits' },
        { icon: <IconQuery />, title: 'Help & Support', subtitle: 'FAQs and privacy policy' }
    ];

    return (
        <div className="page-container">
            <IconStyles />

            {/* Glass Header */}
            <header className="header-glass anim-fade-up">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>←</button>
                    <h3 style={{ fontSize: '1.125rem', margin: 0 }}>My Profile</h3>
                    <div style={{ fontSize: '1.25rem' }}>🔔</div>
                </div>
            </header>

            {/* Scrollable Content */}
            <main className="scroll-content">

                {/* Digital Health Card */}
                <div className="health-card-premium anim-slide-up" style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Digital Health ID</p>
                            <h3 style={{ color: 'white', fontSize: '1.5rem', margin: '8px 0', letterSpacing: '2px' }}>MED-9844-UXI</h3>
                        </div>
                        <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '12px', padding: '6px' }}>
                            {/* Mock QR Code */}
                            <div style={{ width: '100%', height: '100%', border: '4px solid #334155', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
                                {[...Array(9)].map((_, i) => <div key={i} style={{ background: i % 2 === 0 ? '#334155' : 'transparent' }}></div>)}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '2px' }}>{userName}</h4>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Valid thru 12/28</p>
                        </div>
                        <div style={{
                            padding: '6px 14px', background: 'rgba(255,255,255,0.1)',
                            borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700',
                            border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)'
                        }}>
                            PREMIUM GOLD
                        </div>
                    </div>
                </div>

                {/* Quick Stats Banner */}
                <div className="anim-slide-up" style={{ display: 'flex', justifyContent: 'space-between', background: 'white', padding: '20px', borderRadius: '24px', marginTop: '20px', border: '1px solid var(--border-subtle)', animationDelay: '0.1s' }}>
                    {[
                        { count: '12', label: 'Vault Files', color: 'var(--primary)' },
                        { count: '4', label: 'Active Shares', color: 'var(--accent)' },
                        { count: '85', label: 'Health Score', color: 'var(--success)' }
                    ].map((stat, i) => (
                        <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: stat.color, display: 'block' }}>{stat.count}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Family Members Section */}
                <section className="anim-fade-up anim-delay-1" style={{ marginTop: '32px' }}>
                    <div className="section-title">
                        <h3>Connected Profiles</h3>
                        <span
                            onClick={() => setIsManaging(!isManaging)}
                            style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                            {isManaging ? 'Done' : 'Manage'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', marginLeft: '-4px', paddingLeft: '4px' }}>
                        <div onClick={() => setShowAddModal(true)} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '72px'
                        }}>
                            <div style={{
                                width: '60px', height: '60px', border: '2px dashed var(--border-medium)', borderRadius: '20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--text-muted)',
                                transition: 'all 0.2s ease'
                            }}>+</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Add</span>
                        </div>

                        {familyMembers.map((m, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '72px' }}>
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '20px',
                                    background: m.color || 'var(--bg-card)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                                    fontWeight: '700', color: 'var(--text-main)', boxShadow: 'var(--shadow-sm)',
                                    border: '1px solid var(--border-subtle)',
                                    position: 'relative'
                                }}>
                                    {m.initial}
                                    {isManaging && (
                                        <div
                                            onClick={(e) => { e.stopPropagation(); deleteMember(m.id); }}
                                            style={{
                                                position: 'absolute', top: '-6px', right: '-6px',
                                                width: '24px', height: '24px', background: 'var(--error)', color: 'white',
                                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.8rem', border: '2px solid white'
                                            }}
                                        >✕</div>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)' }}>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Menu Items */}
                <div className="anim-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px', animationDelay: '0.2s' }}>
                    {menuItems.map((item, i) => (
                        <div
                            key={i}
                            className="premium-card"
                            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                            onClick={() => {
                                if (item.title === 'My Health Vault') onNavigate('records');
                                if (item.title === 'Shared Access') onNavigate('shared');
                                if (item.title === 'Security Settings') onNavigate('security');
                                if (item.title === 'Storage Usage') onNavigate('storage');
                                if (item.title === 'Help & Support') onNavigate('faq');
                            }}
                        >
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '14px', background: 'var(--primary-light)',
                                color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.2rem'
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '2px', color: 'var(--text-main)' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{item.subtitle}</p>
                            </div>
                            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', opacity: 0.5 }}>&rsaquo;</span>
                        </div>
                    ))}

                    <button className="premium-card" onClick={onLogout} style={{
                        width: '100%', padding: '18px', background: 'var(--error-bg)', color: 'var(--error)',
                        border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-xl)', fontWeight: '800', fontSize: '1rem', marginTop: '12px', cursor: 'pointer',
                        textAlign: 'center'
                    }}>Log Out Session</button>


                    {/* Spacer for bottom nav */}
                    <div style={{ height: '80px' }}></div>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                {[
                    { id: 'dashboard', label: 'Home', icon: <IconHome active={activeTab === 'dashboard' || activeTab === 'home'} /> },
                    { id: 'records', label: 'Records', icon: <IconRecords active={activeTab === 'records'} /> },
                    { id: 'profile', label: 'Profile', icon: <IconProfile active={activeTab === 'profile'} /> }
                ].map(tab => (
                    <div
                        key={tab.id}
                        className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab.id); onNavigate(tab.id); }}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </div>
                ))}
            </nav>


            {/* Add Member Modal */}
            {
                showAddModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                    }} onClick={() => setShowAddModal(false)}>
                        <div
                            className="card"
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: '100%', maxWidth: '320px', padding: '24px',
                                background: 'var(--bg-card)', borderRadius: '24px',
                                boxShadow: 'var(--shadow-xl)',
                                animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        >
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', textAlign: 'center' }}>Add Family Member</h3>
                            <div className="input-field" style={{ padding: '0', border: 'none', background: 'transparent', marginBottom: '20px' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Enter name"
                                    value={newMemberName}
                                    onChange={e => setNewMemberName(e.target.value)}
                                    style={{
                                        width: '100%', padding: '16px', borderRadius: '16px',
                                        border: '1px solid var(--border-medium)', fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    style={{
                                        flex: 1, padding: '14px', borderRadius: '99px',
                                        border: 'none', background: 'var(--bg-app)', color: 'var(--text-secondary)',
                                        fontWeight: '600', cursor: 'pointer'
                                    }}
                                >Cancel</button>
                                <button
                                    onClick={handleAddMember}
                                    style={{
                                        flex: 1, padding: '14px', borderRadius: '99px',
                                        border: 'none', background: 'var(--primary)', color: 'white',
                                        fontWeight: '600', cursor: 'pointer',
                                        opacity: newMemberName.trim() ? 1 : 0.5
                                    }}
                                >Add</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ProfileView;
