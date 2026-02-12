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
        <div className="page-container" style={{ background: 'var(--bg-app)', padding: '0 20px' }}>
            <header className="animate-fade" style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0, cursor: 'pointer' }}>
                    <IconChevronLeft />
                </button>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: 'var(--premium-dark)' }}>Health Pass</h3>
            </header>

            <main className="scroll-content animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '120px' }}>
                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{
                        width: '64px', height: '64px', background: 'var(--primary)',
                        borderRadius: '20px', display: 'inline-flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', marginBottom: '16px',
                        boxShadow: '0 10px 20px rgba(80, 66, 189, 0.2)'
                    }}>
                        <IconPremium size={32} />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--premium-dark)', margin: '0 0 8px' }}>Get the Pass</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Exclusive health benefits for you & family</p>
                </div>

                {plans.map((plan, i) => {
                    const isCurrent = currentPlan === plan.id;
                    const isPremium = plan.id === 'premium' || plan.id === 'family';

                    return (
                        <div key={plan.id} className="medical-card animate-fade" style={{
                            padding: '32px 24px',
                            background: isPremium ? 'var(--premium-dark)' : 'white',
                            color: isPremium ? 'white' : 'var(--text-main)',
                            border: plan.recommended ? `2.5px solid var(--premium-gold)` : '1px solid var(--border)',
                            position: 'relative',
                            overflow: 'hidden',
                            animationDelay: `${i * 0.1}s`
                        }}>
                            {plan.recommended && (
                                <div style={{
                                    position: 'absolute', top: '0', right: '0',
                                    background: 'var(--premium-gold)', color: 'white',
                                    padding: '8px 16px', borderRadius: '0 0 0 16px',
                                    fontWeight: '900', fontSize: '0.65rem', letterSpacing: '0.1em'
                                }}>RECOMMENDED</div>
                            )}

                            {isPremium && (
                                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05, transform: 'rotate(-15deg)' }}>
                                    <IconPremium />
                                </div>
                            )}

                            <span style={{
                                fontSize: '0.7rem', fontWeight: '900',
                                color: isPremium ? 'var(--premium-gold)' : 'var(--text-muted)',
                                textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '8px'
                            }}>{plan.id}</span>

                            <h3 style={{ fontSize: '1.6rem', fontWeight: '900', margin: '0 0 4px', color: 'inherit' }}>{plan.name}</h3>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '24px', color: 'inherit' }}>Everything you need for better care</p>

                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '32px', color: 'inherit' }}>
                                <span style={{ fontSize: '2.8rem', fontWeight: '900', color: 'inherit' }}>{plan.price}</span>
                                <span style={{ opacity: 0.6, fontWeight: '700', fontSize: '1rem', color: 'inherit' }}>{plan.period}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                {plan.features.map((feat, j) => (
                                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.9rem', fontWeight: '600' }}>
                                        <div style={{
                                            width: '20px', height: '20px', borderRadius: '50%',
                                            background: isPremium ? 'rgba(255,255,255,0.1)' : 'var(--primary-subtle)',
                                            color: isPremium ? 'var(--premium-gold)' : 'var(--primary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, fontSize: '0.7rem'
                                        }}>
                                            <IconCheck size={12} />
                                        </div>
                                        <span style={{ opacity: isCurrent ? 0.6 : 1 }}>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={isCurrent || loading}
                                className="btn"
                                style={{
                                    width: '100%',
                                    height: '56px',
                                    background: isCurrent ? 'rgba(255,255,255,0.1)' : (isPremium ? 'var(--premium-gold)' : 'var(--primary)'),
                                    color: 'white',
                                    fontWeight: '900',
                                    fontSize: '0.95rem',
                                    border: isCurrent ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                    boxShadow: !isCurrent && isPremium ? '0 10px 20px rgba(212, 175, 55, 0.3)' : 'none',
                                    borderRadius: '16px'
                                }}
                            >
                                {isCurrent ? 'Current Plan' : (loading ? 'Processing...' : plan.btnText)}
                            </button>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default SubscriptionView;
