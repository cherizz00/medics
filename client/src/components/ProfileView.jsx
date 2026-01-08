import React, { useState } from 'react';
import { IconHome, IconRecords, IconProfile, IconStyles, IconHospital, IconMedicine, IconLab, IconInsurance, IconQuery } from './Icons';

const ProfileView = ({ onBack, onNavigate, onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const userName = (user && user.name) ? user.name : 'Guest User';
    const userPhone = (user && user.phoneNumber) ? user.phoneNumber : '';
    const userInitials = (user && user.name) ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'G';

    const [familyMembers, setFamilyMembers] = useState(() => {
        const saved = localStorage.getItem('medics_family');
        return saved ? JSON.parse(saved) : [
            { name: 'Cherry', color: '#E0F2F1', initial: 'C' },
            { name: 'John Jr', color: '#E3F2FD', initial: 'J' },
            { name: 'Emily', color: '#FFF3E0', initial: 'E' }
        ];
    });

    React.useEffect(() => {
        localStorage.setItem('medics_family', JSON.stringify(familyMembers));
    }, [familyMembers]);

    const handleAddMember = () => {
        const name = prompt("Enter family member's name:");
        if (name) {
            const colors = ['#E0F2F1', '#E3F2FD', '#FFF3E0', '#F3E5F5', '#FFFDE7'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const newMember = {
                id: Date.now(),
                name: name,
                color: randomColor,
                initial: name.charAt(0).toUpperCase()
            };
            setFamilyMembers([...familyMembers, newMember]);
        }
    };

    const handleDeleteMember = (indexToRemove) => {
        if (window.confirm("Remove this family member?")) {
            setFamilyMembers(familyMembers.filter((_, index) => index !== indexToRemove));
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
        <div style={{ height: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <IconStyles />
            <header className="premium-header animate-slide-up" style={{ flexShrink: 0 }}>
                <div className="h-top">
                    <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>←</button>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Account</h3>
                    <div className="p-bell" style={{ fontSize: '1.25rem' }}>🔔</div>
                </div>
            </header>

            <main style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="premium-card animate-fade" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '24px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', fontWeight: '800', boxShadow: 'var(--shadow-md)'
                        }}>
                            {userInitials}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{userName}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '4px 0' }}>{userPhone && `+91 ${userPhone}`}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>12</span>
                            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', margin: 0 }}>Orders</h4>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>4</span>
                            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', margin: 0 }}>Reports</h4>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>8</span>
                            <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500', margin: 0 }}>Consults</h4>
                        </div>
                    </div>
                </div>

                <section className="animate-fade" style={{ animationDelay: '0.1s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem' }}>Connected Profiles</h3>
                        <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer' }}>Manage</span>
                    </div>
                    <div className="scroll-area" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                        <div onClick={handleAddMember} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '60px'
                        }}>
                            <div style={{
                                width: '56px', height: '56px', border: '2px dashed var(--border-light)', borderRadius: '20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--text-muted)'
                            }}>+</div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Add</span>
                        </div>
                        {familyMembers.map((m, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '60px' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '20px', background: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                    fontWeight: '700', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)'
                                }}>{m.initial}</div>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)' }}>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', animationDelay: '0.2s' }}>
                    {menuItems.map((item, i) => (
                        <div
                            key={i}
                            className="premium-card"
                            style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
                            onClick={() => {
                                if (item.title === 'My Health Vault') onNavigate('records');
                                if (item.title === 'Shared Access') onNavigate('shared');
                                if (item.title === 'Security Settings') onNavigate('security');
                                if (item.title === 'Storage Usage') onNavigate('storage');
                                if (item.title === 'Help & Support') onNavigate('faq');
                            }}
                        >
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-light)',
                                color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '2px', color: 'var(--text-main)' }}>{item.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.subtitle}</p>
                            </div>
                            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>&rsaquo;</span>
                        </div>
                    ))}
                    <button onClick={onLogout} style={{
                        width: '100%', padding: '16px', background: 'var(--error-bg)', color: 'var(--error)',
                        border: 'none', borderRadius: '20px', fontWeight: '700', fontSize: '1rem', marginTop: '12px', cursor: 'pointer'
                    }}>Log Out</button>

                    {/* Spacer for bottom nav */}
                    <div style={{ height: '120px', flexShrink: 0 }}></div>
                </div>
            </main>

            <nav className="bottom-nav-p">
                {[
                    { id: 'dashboard', label: 'Home', icon: <IconHome active={activeTab === 'dashboard' || activeTab === 'home'} /> },
                    { id: 'records', label: 'Records', icon: <IconRecords active={activeTab === 'records'} /> },
                    { id: 'profile', label: 'Profile', icon: <IconProfile active={activeTab === 'profile'} /> }
                ].map(tab => (
                    <div
                        key={tab.id}
                        className={`nav-item-p ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab.id); onNavigate(tab.id); }}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default ProfileView;
