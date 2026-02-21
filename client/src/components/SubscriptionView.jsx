import React, { useState, useEffect } from 'react';
import { IconCheck, IconLock, IconChevronLeft, IconPremium } from './Icons';

const SubscriptionView = ({ user, onBack, onUpdateUser }) => {
    const [loading, setLoading] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(user?.subscription?.tier || 'free');

    const plans = [
        {
            id: 'free',
            name: 'Basic',
            price: '₹0',
            period: '/month',
            features: [
                'Health Vitals Tracking',
                'Medical Records Storage (500MB)',
                'Basic Health Reports',
                'Family Members (Max 2)'
            ],
            btnText: 'Current Plan'
        },
        {
            id: 'premium',
            name: 'Pro Health',
            price: '₹99',
            period: '/month',
            features: [
                'All Basic Features',
                'Unlimited Records Storage',
                'Advanced AI Health Insights',
                'Pulse & Vitals Trend Analysis',
                'Medication Reminders',
                'Priority Support'
            ],
            recommended: true,
            btnText: 'Upgrade to Pro'
        },
        {
            id: 'family',
            name: 'Family Plus',
            price: '₹199',
            period: '/month',
            features: [
                'All Pro Features',
                'Up to 6 Family Members',
                'Separate Profiles for Everyone',
                'Family Health Dashboard',
                'Vaccination Trackers'
            ],
            btnText: 'Upgrade to Family'
        }
    ];

    const handleUpgrade = async (planId) => {
        if (planId === currentPlan) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/subscription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ plan_type: planId, period: 'monthly' })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    localStorage.setItem('medics_user', JSON.stringify(data.user));
                    if (onUpdateUser) onUpdateUser(data.user);
                }
                alert(`Successfully upgraded to ${planId.toUpperCase()}!`);
                setCurrentPlan(planId);
            } else {
                alert('Upgrade failed. Please try again.');
            }
        } catch (err) {
            console.error('Upgrade Error:', err);
            alert('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ background: '#F8FAFF' }}>
            <main className="scroll-content hide-scrollbar" style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <header style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0, cursor: 'pointer', background: 'white', border: '1px solid #EEF2FF', boxShadow: 'var(--shadow-sm)' }}>
                        <IconChevronLeft />
                    </button>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--premium-dark)', letterSpacing: '-0.02em' }}>Health Pass</h3>
                </header>
                <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
                    <div style={{
                        width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--primary), #3B82F6)',
                        borderRadius: '24px', display: 'inline-flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', marginBottom: '20px',
                        boxShadow: '0 12px 24px rgba(80, 66, 189, 0.15)',
                        border: '4px solid white'
                    }}>
                        <IconPremium size={36} />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--premium-dark)', margin: '0 0 8px', letterSpacing: '-0.03em' }}>Get the Pass</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600', opacity: 0.8 }}>Unlock premium healthcare benefits</p>
                </div>

                {plans.map((plan, i) => {
                    const isCurrent = currentPlan === plan.id;
                    const isWhite = plan.id === 'free';
                    const isPro = plan.id === 'premium';
                    const isFamily = plan.id === 'family';

                    const cardBg = isWhite ? 'white' : (isPro ? 'var(--premium-dark)' : '#1E293B');
                    const accentColor = isWhite ? 'var(--primary)' : 'var(--premium-gold)';
                    const textColor = isWhite ? 'var(--text-main)' : 'white';

                    return (
                        <div key={plan.id} style={{
                            padding: '32px 24px',
                            background: cardBg,
                            color: textColor,
                            borderRadius: '32px',
                            border: plan.recommended ? `2px solid var(--premium-gold)` : '1px solid #F1F5F9',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: isWhite ? '0 10px 25px -5px rgba(0,0,0,0.03)' : '0 20px 40px -10px rgba(15, 23, 42, 0.2)'
                        }}>
                            {plan.recommended && (
                                <div style={{
                                    position: 'absolute', top: '0', right: '0',
                                    background: 'linear-gradient(90deg, #F59E0B, #D97706)', color: 'white',
                                    padding: '8px 20px', borderRadius: '0 0 0 20px',
                                    fontWeight: '900', fontSize: '0.65rem', letterSpacing: '0.08em',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                }}>MOST POPULAR</div>
                            )}

                            {!isWhite && (
                                <div style={{
                                    position: 'absolute', top: '-10px', right: '-10px',
                                    fontSize: '10rem', opacity: 0.03, transform: 'rotate(-15deg)',
                                    pointerEvents: 'none'
                                }}>
                                    <IconPremium />
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: '800',
                                        color: accentColor,
                                        textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '6px'
                                    }}>{plan.id}</span>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>{plan.name}</h3>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '2px' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: '900', color: accentColor }}>{plan.price}</span>
                                        <span style={{ opacity: 0.6, fontWeight: '700', fontSize: '0.85rem' }}>{plan.period}</span>
                                    </div>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.6, margin: 0, fontWeight: '600' }}>billed monthly</p>
                                </div>
                            </div>

                            <div style={{ height: '1px', background: isWhite ? '#F1F5F9' : 'rgba(255,255,255,0.1)', marginBottom: '24px' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                {plan.features.map((feat, j) => (
                                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '0.9rem', fontWeight: '600' }}>
                                        <div style={{
                                            width: '22px', height: '22px', borderRadius: '7px',
                                            background: isWhite ? 'var(--primary-subtle)' : 'rgba(255,255,255,0.08)',
                                            color: accentColor,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, fontSize: '0.75rem', marginTop: '1px'
                                        }}>
                                            <IconCheck size={14} />
                                        </div>
                                        <span style={{ opacity: isCurrent ? 0.6 : 0.9, lineHeight: '1.4' }}>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={isCurrent || loading}
                                className="clickable"
                                style={{
                                    width: '100%',
                                    height: '58px',
                                    background: isCurrent ? (isWhite ? '#F1F5F9' : 'rgba(255,255,255,0.05)') : accentColor,
                                    color: isCurrent ? (isWhite ? 'var(--text-muted)' : 'rgba(255,255,255,0.4)') : (isWhite ? 'white' : 'var(--premium-dark)'),
                                    fontWeight: '900',
                                    fontSize: '1rem',
                                    border: isCurrent && !isWhite ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                    boxShadow: !isCurrent ? `0 12px 24px ${isWhite ? 'rgba(16, 185, 129, 0.2)' : 'rgba(217, 119, 6, 0.2)'}` : 'none',
                                    borderRadius: '18px',
                                    cursor: isCurrent ? 'default' : 'pointer'
                                }}
                            >
                                {isCurrent ? 'ACTIVE PLAN' : (loading ? 'Processing...' : plan.btnText)}
                            </button>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default SubscriptionView;
