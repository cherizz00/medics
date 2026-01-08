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
        { icon: <IconMedicine />, title: 'Medicine Orders', subtitle: 'View status and past orders' },
        { icon: <IconLab />, title: 'Lab Reports', subtitle: 'View and download test results' },
        { icon: <IconHospital />, title: 'Consultations', subtitle: 'List of past and upcoming doctors' },
        { icon: <IconInsurance />, title: 'Health Insurance', subtitle: 'Manage policies and claims' },
        { icon: <IconQuery />, title: 'Account Settings', subtitle: 'Security, privacy and notifications' }
    ];

    return (
        <div className="profile-root-p">
            <IconStyles />
            <header className="premium-header">
                <div className="h-top">
                    <button onClick={onBack} className="r-back">←</button>
                    <h3>Account</h3>
                    <div className="p-bell">🔔</div>
                </div>
            </header>

            <main className="dash-main-p">
                <div className="u-card-p animate-fade" style={{ background: 'white', padding: '24px', borderRadius: '32px', marginBottom: '24px', border: '1px solid var(--border)' }}>
                    <div className="u-top-p" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                        <div className="u-big-av" style={{ width: '64px', height: '64px', background: 'var(--primary)', color: 'white', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' }}>{userInitials}</div>
                        <div className="u-meta">
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-header)', margin: 0 }}>{userName}</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-body)', margin: '4px 0' }}>{userPhone && `+91 ${userPhone}`}</p>
                        </div>
                    </div>
                    <div className="u-stats-p" style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div className="stat-p"><span>12</span><h4>Orders</h4></div>
                        <div className="stat-p"><span>4</span><h4>Reports</h4></div>
                        <div className="stat-p"><span>8</span><h4>Consults</h4></div>
                    </div>
                </div>

                <section className="section-p animate-fade" style={{ animationDelay: '0.2s' }}>
                    <div className="s-head">
                        <h3>Connected Profiles</h3>
                        <span>Manage</span>
                    </div>
                    <div className="f-scroll-p" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                        <div className="f-add-p" onClick={handleAddMember} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div className="f-icon-add" style={{ width: '54px', height: '54px', border: '1.5px dashed var(--border)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: 'var(--text-muted)' }}>+</div>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>Add</span>
                        </div>
                        {familyMembers.map((m, i) => (
                            <div key={i} className="f-member-p" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '60px' }}>
                                <div className="f-av-p" style={{ width: '54px', height: '54px', borderRadius: '18px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>{m.initial}</div>
                                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-header)' }}>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="menu-group-p animate-fade" style={{ marginTop: '32px' }}>
                    {menuItems.map((item, i) => (
                        <div key={i} className="r-card-p" style={{ marginBottom: '12px', padding: '16px' }}>
                            <div className="r-icon-p" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>{item.icon}</div>
                            <div className="r-text-p">
                                <h4>{item.title}</h4>
                                <p>{item.subtitle}</p>
                            </div>
                            <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>&rsaquo;</span>
                        </div>
                    ))}
                    <button className="logout-btn-p" onClick={onLogout} style={{ width: '100%', padding: '16px', background: '#FFF5F5', color: '#FF5252', border: 'none', borderRadius: '20px', fontWeight: '700', fontSize: '15px', marginTop: '12px', cursor: 'pointer' }}>Log Out</button>
                </div>
            </main >

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
                        <span className="n-icon">{tab.icon}</span>
                        <span className="n-label">{tab.label}</span>
                    </div>
                ))}
            </nav>

            <style dangerouslySetInnerHTML={{
                __html: `
                .profile-root-p { background: var(--bg-primary); height: 100vh; display: flex; flex-direction: column; overflow: hidden; position: relative; }
                
                .premium-header { 
                    flex-shrink: 0;
                    background: white; 
                    padding: 40px 24px 20px 24px; 
                    position: relative;
                    z-index: 20;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }
                .h-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .r-back { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-header); display: flex; align-items: center; padding: 0; }
                .premium-header h3 { font-size: 20px; font-weight: 700; color: var(--text-header); margin: 0; }
                .p-bell { font-size: 20px; color: var(--text-header); }

                .dash-main-p { flex: 1; overflow-y: auto; padding: 24px; padding-bottom: 120px; position: relative; z-index: 10; }
                .dash-main-p::-webkit-scrollbar { display: none; }
                
                .u-card-p { padding: 24px; background: white; border-radius: 32px; margin-bottom: 24px; border: 1px solid var(--border); }
                .u-top-p { display: flex; align-items: center; gap: 20px; position: relative; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1.5px dashed var(--border); }
                .u-big-av { width: 64px; height: 64px; background: var(--primary); color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; flex-shrink: 0; }
                .u-meta { flex: 1; min-width: 0; }
                .u-meta h3 { font-size: 20px; font-weight: 800; color: var(--text-header); margin: 0; }
                .u-meta p { font-size: 13px; color: var(--text-body); margin: 4px 0; }
                
                .u-stats-p { display: flex; justify-content: space-around; }
                .stat-p { text-align: center; }
                .stat-p span { font-size: 20px; font-weight: 800; color: var(--text-header); display: block; }
                .stat-p h4 { font-size: 12px; color: var(--text-muted); font-weight: 500; margin: 0; }

                .section-p { margin-bottom: 32px; }
                .s-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .s-head h3 { font-size: 18px; font-weight: 700; color: var(--text-header); }
                .s-head span { color: var(--primary); font-size: 14px; font-weight: 600; cursor: pointer; }

                .f-scroll-p { display: flex; gap: 16px; margin-top: 10px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
                .f-scroll-p::-webkit-scrollbar { display: none; }
                .f-add-p, .f-member-p { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 60px; }
                .f-icon-add { width: 54px; height: 54px; border: 2px dashed #DDD; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #BBB; }
                .f-av-p { width: 54px; height: 54px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: var(--primary); }
                .f-scroll-p span { font-size: 11px; font-weight: 600; color: var(--text-muted); }

                .r-card-p { 
                    padding: 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; 
                    background: white; border: 1px solid var(--border); border-radius: 20px;
                    transition: var(--transition);
                }
                .r-card-p:active { transform: scale(0.98); border-color: var(--primary); }
                .r-icon-p { width: 44px; height: 44px; background: var(--bg-secondary); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .r-text-p { flex: 1; }
                .r-text-p h4 { font-size: 15px; font-weight: 600; color: var(--text-header); margin-bottom: 2px; }
                .r-text-p p { font-size: 12px; color: var(--text-body); }
                
                .logout-btn-p { width: 100%; margin: 30px 0; padding: 16px; background: #FFF5F5; color: #FF5252; border: none; border-radius: 20px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.3s; }

                .bottom-nav-p { 
                    position: fixed; bottom: 0; left: 0; right: 0; height: 80px; 
                    display: flex; justify-content: space-around; align-items: center;
                    background: white; border-top: 1px solid var(--border); z-index: 1000;
                    padding: 0 20px;
                }
                .nav-item-p { 
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: var(--text-muted); cursor: pointer; transition: var(--transition); flex: 1;
                }
                .nav-item-p.active { color: var(--primary); }
                .n-icon { font-size: 24px; margin-bottom: 4px; }
                .n-label { font-size: 11px; font-weight: 600; }
                * { -webkit-tap-highlight-color: transparent; user-select: none; }
                input { user-select: text; }
      `}} />
        </div >
    );
};

export default ProfileView;
