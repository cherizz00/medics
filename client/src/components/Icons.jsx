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
