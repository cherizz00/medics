import React from 'react';
import { IconHome, IconRecords, IconProfile, IconBot, IconScan } from '../Icons';

const BottomNavigation = ({ activeTab, onNavigate }) => {
    return (
        <>
            <div className="fab-container">
                <button className="fab-main" onClick={() => onNavigate('scan')}>
                    <IconScan />
                </button>
            </div>

            <nav className="nav-bar">
                {/* Left Side */}
                <button onClick={() => onNavigate('dashboard')} className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}>
                    <IconHome active={activeTab === 'home'} />
                    <span>Home</span>
                </button>
                <button onClick={() => onNavigate('records')} className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}>
                    <IconRecords active={activeTab === 'records'} />
                    <span>Vault</span>
                </button>

                {/* FAB Placeholder (Invisible, just takes up space) */}
                <div style={{ width: '20%', height: '52px' }}></div>

                {/* Right Side */}
                <button onClick={() => onNavigate('bot')} className={`nav-item ${activeTab === 'bot' ? 'active' : ''}`}>
                    <IconBot />
                    <span>Coach</span>
                </button>
                <button onClick={() => onNavigate('profile')} className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}>
                    <IconProfile active={activeTab === 'profile'} />
                    <span>Profile</span>
                </button>
            </nav>
        </>
    );
};

export default BottomNavigation;
