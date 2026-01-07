import React, { useState } from 'react';
import { IconHome, IconRecords, IconProfile, IconStyles, IconHospital, IconMedicine, IconLab, IconInsurance, IconQuery } from './Icons';

const ProfileView = ({ onBack, onNavigate }) => {
    const familyMembers = [
        { name: 'Cherry', color: '#E0F2F1', initial: 'C' },
        { name: 'John Jr', color: '#E3F2FD', initial: 'J' },
        { name: 'Emily', color: '#FFF3E0', initial: 'E' }
    ];

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
            <div className="mesh-bg"></div>
            <div className="p-header-p glass animate-fade">
                <button onClick={onBack} className="p-back">←</button>
                <h2>Account</h2>
                <div className="p-bell">🔔</div>
            </div>

            <div className="p-scroll-area">
                <div className="premium-card u-card-p animate-fade" style={{ animationDelay: '0.1s' }}>
                    <div className="u-top-p">
                        <div className="u-big-av">JS</div>
                        <div className="u-meta">
                            <h3>John Smith</h3>
                            <p>+91 91234 56789</p>
                            <span className="uhid-p">UHID: APJ1.0019111579</span>
                        </div>
                        <div className="membership-star">circle</div>
                    </div>
                    <div className="u-stats-p">
                        <div className="stat-p"><span>12</span><h4>Orders</h4></div>
                        <div className="stat-p"><span>4</span><h4>Reports</h4></div>
                        <div className="stat-p"><span>8</span><h4>Consults</h4></div>
                    </div>
                </div>

                <section className="section-p-inner animate-fade" style={{ animationDelay: '0.2s' }}>
                    <div className="s-head">
                        <h3>Connected Profiles</h3>
                        <span>Manage</span>
                    </div>
                    <div className="f-scroll-p">
                        <div className="f-add-p">
                            <div className="f-icon-add">+</div>
                            <span>Add</span>
                        </div>
                        {familyMembers.map((m, i) => (
                            <div key={i} className="f-member-p">
                                <div className="f-av-p" style={{ background: m.color }}>{m.initial}</div>
                                <span>{m.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="premium-card promo-card-p animate-fade" style={{ animationDelay: '0.3s' }}>
                    <div className="promo-txt">
                        <h4>Become a Member</h4>
                        <p>Save up to ₹1,200 on every order</p>
                        <button className="promo-btn-p">Upgrade Now</button>
                    </div>
                    <div className="promo-icon-p">👑</div>
                </div>

                <div className="menu-group-p animate-fade" style={{ animationDelay: '0.4s' }}>
                    {menuItems.map((item, i) => (
                        <div key={i} className="menu-item-premium">
                            <div className="m-icon-bg">{item.icon}</div>
                            <div className="m-body">
                                <h4>{item.title}</h4>
                                <p>{item.subtitle}</p>
                            </div>
                            <span className="m-chevron">&rsaquo;</span>
                        </div>
                    ))}
                    <button className="logout-btn-p">Log Out</button>
                </div>
            </div>

            <nav className="bottom-nav-p glass">
                {[
                    { id: 'dashboard', label: 'Home', icon: <IconHome active={false} /> },
                    { id: 'records', label: 'Records', icon: <IconRecords active={false} /> },
                    { id: 'profile', label: 'Profile', icon: <IconProfile active={true} /> }
                ].map(tab => (
                    <div
                        key={tab.id}
                        className={`nav-item-p ${tab.id === 'profile' ? 'active' : ''}`}
                        onClick={() => onBack()}
                    >
                        <span className="n-icon">{tab.icon}</span>
                        <span className="n-label">{tab.label}</span>
                    </div>
                ))}
            </nav>

            <style dangerouslySetInnerHTML={{
                __html: `
        .profile-root-p { height: 100vh; background: var(--apollo-bg); display: flex; flex-direction: column; overflow: hidden; position: relative; }
        .mesh-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--mesh-gradient); z-index: 0; pointer-events: none; }
        
        .p-header-p { 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 15px 24px; z-index: 100; border-radius: 0 0 24px 24px;
            background: rgba(255,255,255,0.8);
        }
        .p-header-p h2 { font-size: 20px; font-weight: 800; color: var(--apollo-blue); margin: 0; }
        .p-back { background: none; border: none; font-size: 26px; cursor: pointer; color: var(--apollo-blue); display: flex; align-items: center; }
        .p-bell { font-size: 20px; }

        .p-scroll-area { flex: 1; overflow-y: auto; padding: 24px; padding-bottom: 180px; scrollbar-width: none; position: relative; z-index: 1; -webkit-overflow-scrolling: touch; }
        .p-scroll-area::-webkit-scrollbar { display: none; }
        
        .u-card-p { padding: 24px; background: white; border-radius: 32px; margin-bottom: 24px; }
        .u-top-p { display: flex; align-items: center; gap: 20px; position: relative; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1.5px dashed #F0F0F0; }
        .u-big-av { width: 64px; height: 64px; background: var(--primary-gradient); color: white; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; flex-shrink: 0; }
        .u-meta { flex: 1; min-width: 0; }
        .u-meta h3 { font-size: 20px; font-weight: 800; color: var(--apollo-blue); margin: 0; }
        .u-meta p { font-size: 13px; color: var(--apollo-text-light); margin: 4px 0; }
        .uhid-p { font-size: 10px; font-weight: 700; color: var(--apollo-orange); background: rgba(255,149,0,0.1); padding: 4px 8px; border-radius: 6px; }
        .membership-star { position: absolute; right: 0; top: 0; background: #000; color: var(--apollo-orange); font-weight: 800; font-size: 10px; padding: 4px 10px; border-radius: 20px; }
        
        .u-stats-p { display: flex; justify-content: space-around; }
        .stat-p { text-align: center; }
        .stat-p span { font-size: 20px; font-weight: 800; color: var(--apollo-blue); display: block; }
        .stat-p h4 { font-size: 12px; color: var(--apollo-text-light); font-weight: 500; margin: 0; }

        .section-p-inner { margin-bottom: 32px; }
        .s-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .s-head h3 { font-size: 18px; font-weight: 700; color: var(--apollo-blue); margin: 0; }
        .s-head span { color: var(--apollo-orange); font-size: 13px; font-weight: 600; cursor: pointer; }

        .f-scroll-p { display: flex; gap: 16px; margin-top: 10px; overflow-x: auto; padding-bottom: 10px; scrollbar-width: none; }
        .f-scroll-p::-webkit-scrollbar { display: none; }
        .f-add-p, .f-member-p { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 60px; }
        .f-icon-add { width: 54px; height: 54px; border: 2px dashed #DDD; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #BBB; }
        .f-av-p { width: 54px; height: 54px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: var(--apollo-blue); }
        .f-scroll-p span { font-size: 11px; font-weight: 600; color: #666; }

        .promo-card-p { background: var(--primary-gradient); color: white; padding: 24px; border-radius: 28px; margin: 32px 0; display: flex; justify-content: space-between; align-items: center; border: none; position: relative; z-index: 1; }
        .promo-txt { flex: 1; }
        .promo-txt h4 { font-size: 17px; margin: 0 0 4px 0; }
        .promo-txt p { font-size: 12px; opacity: 0.8; margin: 0 0 16px 0; }
        .promo-btn-p { background: white; color: var(--apollo-blue); border: none; padding: 8px 16px; border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer; }
        .promo-icon-p { font-size: 40px; margin-left: 15px; }

        .menu-group-p { background: white; border-radius: 32px; padding: 5px 24px; box-shadow: var(--shadow-soft); }
        .menu-item-premium { display: flex; align-items: center; padding: 18px 0; border-bottom: 1px solid #F8F9FA; cursor: pointer; transition: transform 0.1s ease; }
        .menu-item-premium:active { transform: scale(0.98); opacity: 0.8; }
        .menu-item-premium:last-child { border: none; }
        .m-icon-bg { width: 40px; height: 40px; background: #F8F9FA; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; transition: 0.3s; flex-shrink: 0; color: var(--apollo-blue); }
        .menu-item-premium:active .m-icon-bg { background: var(--apollo-blue); color: white; }
        .m-body { flex: 1; min-width: 0; }
        .m-body h4 { font-size: 15px; font-weight: 700; color: var(--apollo-blue); margin: 0; }
        .m-body p { font-size: 12px; color: var(--apollo-text-light); margin: 2px 0 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .m-chevron { font-size: 24px; color: #DDD; }
        
        .logout-btn-p { width: 100%; margin: 30px 0; padding: 16px; background: #FFF5F5; color: #FF5252; border: none; border-radius: 20px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.3s; }
        .bottom-nav-p { 
            position: fixed; bottom: 24px; left: 24px; right: 24px; height: 72px; 
            display: flex !important; flex-direction: row !important;
            justify-content: space-around; align-items: center;
            background: rgba(2, 54, 61, 0.9) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 24px; z-index: 1000;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
            padding: 0 10px;
        }
        .nav-item-p { 
            display: flex !important; flex-direction: column !important; 
            align-items: center; justify-content: center;
            color: rgba(255,255,255,0.5); cursor: pointer; 
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); 
            flex: 1; height: 100%; position: relative;
        }
        .nav-item-p.active { color: white !important; }
        .nav-item-p.active::after {
            content: ''; position: absolute; top: 10px; width: 40px; height: 40px;
            background: var(--apollo-orange); border-radius: 12px; z-index: -1;
            opacity: 0.2; filter: blur(10px); animation: pulse 2s infinite;
        }
        .n-icon { font-size: 24px; margin-bottom: 2px; transition: inherit; z-index: 1; }
        .n-label { font-size: 10px; font-weight: 700; transition: inherit; letter-spacing: 0.5px; opacity: 0.8; z-index: 1; }
        .nav-item-p.active .n-label { opacity: 1; transform: translateY(-1px); }
        .nav-item-p.active .n-icon { transform: translateY(-2px); }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.2); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.2; }
        }

        /* Native App Feel */
        * { -webkit-tap-highlight-color: transparent; user-select: none; }
        input { user-select: text; }
      `}} />
        </div>
    );
};

export default ProfileView;
