import React from 'react';
import { IconChevronLeft } from '../Icons';

const SubHeader = ({ title, onBack }) => (
    <header className="animate-fade" style={{ padding: '24px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0 }}>
            <IconChevronLeft size={24} />
        </button>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, color: 'var(--premium-dark)' }}>{title}</h3>
    </header>
);

export default SubHeader;
