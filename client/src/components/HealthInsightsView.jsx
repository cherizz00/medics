import React, { useState, useEffect } from 'react';
import { IconChevronLeft } from './Icons';
import BottomNavigation from './common/BottomNavigation';

/* ─── Insight Card ─── */
const InsightCard = ({ icon, title, value, unit, status, statusColor, detail, accent }) => (
    <div style={{
        background: 'white', borderRadius: '18px', padding: '18px',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: `${accent}12`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
            }}>
                {icon}
            </div>
            <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: '500' }}>{title}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1F2937' }}>{value || '—'}</span>
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{unit}</span>
                </div>
            </div>
            {status && (
                <span style={{
                    padding: '4px 10px', borderRadius: '8px', fontSize: '0.68rem',
                    fontWeight: '700', background: `${statusColor}15`, color: statusColor,
                }}>
                    {status}
                </span>
            )}
        </div>
        {detail && <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', lineHeight: '1.5' }}>{detail}</p>}
    </div>
);

/* ─── Risk Score Ring ─── */
const RiskRing = ({ score }) => {
    const r = 48;
    const c = 2 * Math.PI * r;
    const offset = c - (score / 100) * c;
    const color = score < 30 ? '#10B981' : score < 60 ? '#F59E0B' : '#EF4444';
    const label = score < 30 ? 'Low Risk' : score < 60 ? 'Moderate' : 'High Risk';

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
                <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={c} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                />
                <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1F2937">{score}</text>
                <text x="60" y="72" textAnchor="middle" fontSize="10" fontWeight="500" fill="#9CA3AF">/100</text>
            </svg>
            <p style={{ fontSize: '0.88rem', fontWeight: '700', color, marginTop: '4px' }}>{label}</p>
        </div>
    );
};

/* ─── Tip Card ─── */
const TipCard = ({ emoji, title, text }) => (
    <div style={{
        background: 'white', borderRadius: '14px', padding: '14px 16px',
        border: '1px solid rgba(0,0,0,0.04)', display: 'flex', gap: '12px',
        alignItems: 'flex-start',
    }}>
        <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
        <div>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#1F2937', display: 'block' }}>{title}</span>
            <span style={{ fontSize: '0.74rem', color: '#6B7280', lineHeight: '1.5' }}>{text}</span>
        </div>
    </div>
);


const HealthInsightsView = ({ onBack, onNavigate }) => {
    const [bmiData] = useState(() => JSON.parse(localStorage.getItem('medics_bmi') || '[]'));
    const [bpData] = useState(() => JSON.parse(localStorage.getItem('medics_bp') || '[]'));
    const [glucoseData] = useState(() => JSON.parse(localStorage.getItem('medics_glucose') || '[]'));
    const [sleepData] = useState(() => JSON.parse(localStorage.getItem('medics_sleep') || '[]'));

    // Calculate health risk score
    const calcRisk = () => {
        let score = 20; // base
        const latestBMI = bmiData[0] ? parseFloat(bmiData[0].bmi) : null;
        const latestBP = bpData[0] ? { s: parseInt(bpData[0].systolic), d: parseInt(bpData[0].diastolic) } : null;
        const latestGlucose = glucoseData[0] ? parseInt(glucoseData[0].glucose) : null;
        const latestSleep = sleepData[0] ? parseFloat(sleepData[0].hours) : null;

        if (latestBMI) {
            if (latestBMI >= 30) score += 20;
            else if (latestBMI >= 25) score += 10;
            else if (latestBMI < 18.5) score += 8;
        }
        if (latestBP) {
            if (latestBP.s >= 140 || latestBP.d >= 90) score += 20;
            else if (latestBP.s >= 130) score += 10;
        }
        if (latestGlucose) {
            if (latestGlucose >= 200) score += 20;
            else if (latestGlucose >= 126) score += 12;
            else if (latestGlucose >= 100) score += 5;
        }
        if (latestSleep) {
            if (latestSleep < 5) score += 10;
            else if (latestSleep < 7) score += 5;
        }
        return Math.min(score, 100);
    };

    const riskScore = calcRisk();
    const latestBMI = bmiData[0];
    const latestBP = bpData[0];
    const latestGlucose = glucoseData[0];
    const latestSleep = sleepData[0];

    const getBMIStatus = (v) => {
        const n = parseFloat(v);
        if (n < 18.5) return { s: 'Underweight', c: '#F59E0B' };
        if (n < 25) return { s: 'Normal', c: '#10B981' };
        if (n < 30) return { s: 'Overweight', c: '#F59E0B' };
        return { s: 'Obese', c: '#EF4444' };
    };

    const getBPStatus = (s, d) => {
        if (s < 120 && d < 80) return { s: 'Normal', c: '#10B981' };
        if (s < 130) return { s: 'Elevated', c: '#F59E0B' };
        return { s: 'High', c: '#EF4444' };
    };

    const hasData = bmiData.length > 0 || bpData.length > 0 || glucoseData.length > 0 || sleepData.length > 0;

    return (
        <div className="page-container" style={{ background: '#F7F8FA' }}>
            <div style={{
                padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: '12px',
                flexShrink: 0,
            }}>
                <button onClick={onBack} style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.06)', background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-main)',
                }}>
                    <IconChevronLeft size={20} />
                </button>
                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    Health Insights
                </span>
            </div>

            <main className="scroll-content hide-scrollbar" style={{ padding: '20px 20px 100px' }}>
                {/* Risk Score */}
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '24px',
                    marginBottom: '20px', textAlign: 'center',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: '700' }}>Your Health Score</h3>
                    <p style={{ margin: '0 0 16px', fontSize: '0.75rem', color: '#9CA3AF' }}>Based on your tracked data</p>
                    <RiskRing score={riskScore} />
                </div>

                {!hasData && (
                    <div style={{
                        background: 'white', borderRadius: '18px', padding: '30px 20px',
                        textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '20px',
                    }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📊</div>
                        <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: '700' }}>No Data Yet</h4>
                        <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#9CA3AF', lineHeight: '1.5' }}>
                            Start tracking your BMI, Blood Pressure, Glucose, and Sleep to see detailed insights here.
                        </p>
                        <button onClick={() => onNavigate('trackers')} style={{
                            padding: '12px 24px', borderRadius: '12px', border: 'none',
                            background: 'linear-gradient(135deg, #4A55A2, #6366F1)',
                            color: 'white', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(74,85,162,0.3)',
                        }}>
                            Start Tracking →
                        </button>
                    </div>
                )}

                {/* Vital Cards */}
                {hasData && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                        <InsightCard
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
                            title="BMI"
                            value={latestBMI ? latestBMI.bmi : null}
                            unit="kg/m²"
                            status={latestBMI ? getBMIStatus(latestBMI.bmi).s : null}
                            statusColor={latestBMI ? getBMIStatus(latestBMI.bmi).c : '#9CA3AF'}
                            accent="#8B5CF6"
                        />
                        <InsightCard
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" /></svg>}
                            title="Blood Pressure"
                            value={latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : null}
                            unit="mmHg"
                            status={latestBP ? getBPStatus(parseInt(latestBP.systolic), parseInt(latestBP.diastolic)).s : null}
                            statusColor={latestBP ? getBPStatus(parseInt(latestBP.systolic), parseInt(latestBP.diastolic)).c : '#9CA3AF'}
                            accent="#EF4444"
                        />
                        <InsightCard
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8"><path d="M12 2L6 8.5c-3.5 4-1 9.5 6 12.5 7-3 9.5-8.5 6-12.5L12 2z" /></svg>}
                            title="Glucose"
                            value={latestGlucose ? latestGlucose.glucose : null}
                            unit="mg/dL"
                            accent="#F59E0B"
                        />
                        <InsightCard
                            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>}
                            title="Sleep"
                            value={latestSleep ? latestSleep.hours : null}
                            unit="hours"
                            accent="#6366F1"
                        />
                    </div>
                )}

                {/* Health Tips */}
                <h3 style={{ fontSize: '0.92rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>
                    Health Tips
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TipCard emoji="💧" title="Stay Hydrated" text="Drink at least 8 glasses of water daily to maintain optimal health." />
                    <TipCard emoji="🏃" title="Stay Active" text="30 minutes of moderate exercise daily can reduce heart disease risk by 35%." />
                    <TipCard emoji="🥗" title="Balanced Diet" text="Include fruits, vegetables, and whole grains in every meal for better nutrition." />
                    <TipCard emoji="😴" title="Quality Sleep" text="Aim for 7-9 hours of sleep per night to support immune function and recovery." />
                    <TipCard emoji="🧘" title="Manage Stress" text="Practice deep breathing or meditation for 10 minutes daily to lower cortisol levels." />
                </div>
            </main>

            <BottomNavigation activeTab="home" onNavigate={onNavigate} />
        </div>
    );
};

export default HealthInsightsView;
