import React from 'react';

const PremiumModal = ({ isOpen, onClose, onUpgrade }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
        }} onClick={onClose}>
            <div
                className="slide-up"
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: '24px 24px 0 0',
                    padding: '32px 24px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px',
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '2px', position: 'absolute', top: '12px' }} />

                <div style={{
                    width: '64px', height: '64px', background: 'var(--premium-gold)',
                    borderRadius: '20px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '2rem', color: 'white'
                }}>
                    👑
                </div>

                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--premium-dark)', marginBottom: '8px' }}>Unlock Medics Pass</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        This feature is part of our premium health plan. Upgrade now to get full access to advanced AI insights.
                    </p>
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--primary-subtle)', padding: '12px 16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '1.2rem' }}>✨</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>Advanced AI Health Risk Analysis</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--primary-subtle)', padding: '12px 16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '1.2rem' }}>📦</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>Unlimited Secure Records Vault</span>
                    </div>
                </div>

                <button
                    onClick={() => { onUpgrade(); onClose(); }}
                    className="btn btn-primary"
                    style={{ width: '100%', height: '54px', fontSize: '1rem', fontWeight: '800', background: 'var(--premium-dark)', border: 'none' }}
                >
                    GET PASS • ₹99
                </button>

                <button
                    onClick={onClose}
                    className="btn btn-ghost"
                    style={{ width: '100%', fontSize: '0.85rem', fontWeight: '700' }}
                >
                    Maybe Later
                </button>
            </div>
        </div>
    );
};

export default PremiumModal;
