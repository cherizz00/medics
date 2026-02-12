import React from 'react';
import { IconLock } from '../Icons';

const PremiumLock = ({ isPremium, title, children, onUpgrade }) => {
    if (isPremium) {
        return children;
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
            <div style={{ filter: 'blur(4px)', pointerEvents: 'none', opacity: 0.6 }}>
                {children}
            </div>
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.4)', zIndex: 10
            }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'var(--primary)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '12px', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.4)'
                }}>
                    <IconLock />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '4px' }}>
                    {title || 'Premium Feature'}
                </h3>
                <button
                    onClick={onUpgrade}
                    style={{
                        padding: '8px 16px', borderRadius: '12px', border: 'none',
                        background: 'var(--primary-dark)', color: 'white',
                        fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer'
                    }}
                >
                    Unlock
                </button>
            </div>
        </div>
    );
};

export default PremiumLock;
