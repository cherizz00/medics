import React from 'react';
import { useLanguage } from '../../LanguageContext';
import translations from '../../translations';

const BottomNavigation = ({ activeTab, onNavigate }) => {
    const { language } = useLanguage();
    const t = translations[language] || translations.English;

    const tabs = [
        {
            id: 'home', label: t.home, action: 'dashboard',
            icon: (active) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#4A55A2' : 'none'} stroke={active ? '#4A55A2' : '#8E8E93'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10L12 3l8 7v10a1 1 0 01-1 1H5a1 1 0 01-1-1V10z" />
                    {!active && <path d="M9 21V14h6v7" />}
                </svg>
            ),
        },
        {
            id: 'records', label: t.records, action: 'records',
            icon: (active) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#4A55A2' : 'none'} stroke={active ? '#4A55A2' : '#8E8E93'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 4a2 2 0 012-2h6l6 6v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
                    {!active && <><polyline points="13 2 13 8 19 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></>}
                </svg>
            ),
        },
        {
            id: 'scan', label: t.scan, action: 'scan',
            icon: (active) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#4A55A2' : 'none'} stroke={active ? '#4A55A2' : '#8E8E93'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7V5a2 2 0 012-2h2" />
                    <path d="M17 3h2a2 2 0 012 2v2" />
                    <path d="M21 17v2a2 2 0 01-2 2h-2" />
                    <path d="M7 21H5a2 2 0 01-2-2v-2" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                </svg>
            ),
        },
        {
            id: 'bot', label: t.coach, action: 'bot',
            icon: (active) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#4A55A2' : 'none'} stroke={active ? '#4A55A2' : '#8E8E93'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    {!active && <><circle cx="9" cy="10" r="1" fill="#8E8E93" /><circle cx="15" cy="10" r="1" fill="#8E8E93" /></>}
                </svg>
            ),
        },
        {
            id: 'profile', label: t.profile, action: 'profile',
            icon: (active) => (
                <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#4A55A2' : 'none'} stroke={active ? '#4A55A2' : '#8E8E93'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M20 21a8 8 0 10-16 0" />
                </svg>
            ),
        },
    ];

    return (
        <div className="eka-nav">
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        className={`eka-nav-tab ${isActive ? 'is-active' : ''}`}
                        onClick={() => onNavigate(tab.action)}
                    >
                        <div className="eka-nav-icon">
                            {tab.icon(isActive)}
                        </div>
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNavigation;
