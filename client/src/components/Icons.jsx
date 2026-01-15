import React from 'react';

export const IconHome = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`premium-icon ${active ? 'active' : ''}`}>
        <path className="icon-path icon-home-roof" d="M3 9.5L12 3L21 9.5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path className="icon-path icon-home-door" d="M9 21V12H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconRecords = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`premium-icon ${active ? 'active' : ''}`}>
        <path className="icon-path icon-doc-body" d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path className="icon-path icon-doc-fold" d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path className="icon-path-accent" d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path className="icon-path-accent" d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const IconProfile = ({ active }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`premium-icon ${active ? 'active' : ''}`}>
        <path className="icon-path icon-user-circle" d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path className="icon-path icon-user-head" d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconHospital = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M10 21V19H14V21H19V11L12 6L5 11V21H10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 9V15M9 12H15" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const IconMedicine = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M10.5 3L3 10.5L13.5 21L21 13.5L10.5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 6.5L17.5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const IconLab = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M21 21H3L10 6V3H14V6L21 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.5 13H13.5" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const IconInsurance = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const IconQuery = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const IconPhone = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

export const IconLock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export const IconGoogle = () => (
    <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export const IconFacebook = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

export const IconApple = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75 1.18-.02 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.88-3.12 1.87-2.38 5.98.67 7.28-.65 1.63-1.57 3.25-2.72 4.9zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
);

export const IconStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
    .premium-icon { transition: var(--transition); }
    .premium-icon .icon-path { stroke: var(--text-muted); }
    .premium-icon.active .icon-path { stroke: var(--primary); }
    .premium-icon.active .icon-path-accent { stroke: var(--primary-dark); }
    
    .nav-item-p.active .icon-home-roof { transform: translateY(-1px); }
    .nav-item-p.active .icon-home-door { opacity: 1; }
    
    .nav-item-p.active .icon-doc-body { transform: scale(1.05); }
    
    .nav-item-p.active .icon-user-head { transform: translateY(-1px); }
  `}} />
);
