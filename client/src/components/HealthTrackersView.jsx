import React, { useState, useEffect } from 'react';
import { IconChevronLeft } from './Icons';
import BottomNavigation from './common/BottomNavigation';

/* ─── Tab Icons ─── */
const BMITabIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#8B5CF6'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
);
const BPTabIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#EF4444'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
);
const GlucoseTabIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#F59E0B'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L6 8.5c-3.5 4-1 9.5 6 12.5 7-3 9.5-8.5 6-12.5L12 2z" />
    </svg>
);
const SleepTabIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : '#6366F1'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

const TABS = [
    { id: 'bmi', label: 'BMI', icon: BMITabIcon, color: '#8B5CF6' },
    { id: 'bp', label: 'BP', icon: BPTabIcon, color: '#EF4444' },
    { id: 'glucose', label: 'Glucose', icon: GlucoseTabIcon, color: '#F59E0B' },
    { id: 'sleep', label: 'Sleep', icon: SleepTabIcon, color: '#6366F1' },
];

/* ─── Reusable Card ─── */
const TrackerCard = ({ children, style }) => (
    <div style={{
        background: 'white', borderRadius: '18px', padding: '20px',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        marginBottom: '14px', ...style,
    }}>
        {children}
    </div>
);

/* ─── Reusable Input ─── */
const TrackerInput = ({ label, value, onChange, placeholder, unit, type = 'number' }) => (
    <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#6B7280', display: 'block', marginBottom: '6px' }}>
            {label}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    flex: 1, padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.08)', background: '#F9FAFB',
                    fontSize: '0.9rem', outline: 'none', fontWeight: '500',
                }}
            />
            {unit && <span style={{ fontSize: '0.78rem', color: '#9CA3AF', fontWeight: '600', minWidth: '30px' }}>{unit}</span>}
        </div>
    </div>
);

/* ─── History Item ─── */
const HistoryItem = ({ value, label, date, color }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)',
    }}>
        <div>
            <span style={{ fontSize: '1rem', fontWeight: '700', color: color || '#1F2937' }}>{value}</span>
            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginLeft: '6px' }}>{label}</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#D1D5DB' }}>{date}</span>
    </div>
);

/* ─── Save Button ─── */
const SaveButton = ({ onClick, color, label = 'Save Reading' }) => (
    <button onClick={onClick} style={{
        width: '100%', padding: '14px', borderRadius: '14px',
        border: 'none', cursor: 'pointer', fontWeight: '700',
        fontSize: '0.88rem', color: 'white',
        background: `linear-gradient(135deg, ${color}, ${color}CC)`,
        boxShadow: `0 4px 14px ${color}40`,
        transition: 'all 0.2s',
    }}>
        {label}
    </button>
);

/* ─── Gauge Component ─── */
const GaugeCircle = ({ value, max, label, color, unit }) => {
    const pct = Math.min((value / max) * 100, 100);
    const r = 54;
    const c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
                <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
                    strokeDasharray={c} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                <text x="70" y="64" textAnchor="middle" fontSize="24" fontWeight="800" fill="#1F2937">
                    {value || '—'}
                </text>
                <text x="70" y="84" textAnchor="middle" fontSize="11" fontWeight="500" fill="#9CA3AF">
                    {unit}
                </text>
            </svg>
            <p style={{ fontSize: '0.82rem', fontWeight: '700', color, marginTop: '4px' }}>{label}</p>
        </div>
    );
};

/* ─── BMI Calculator ─── */
const BMITab = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('medics_bmi') || '[]'));

    const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(1) : null;
    const getCategory = (v) => {
        if (v < 18.5) return { label: 'Underweight', color: '#F59E0B' };
        if (v < 25) return { label: 'Normal', color: '#10B981' };
        if (v < 30) return { label: 'Overweight', color: '#F59E0B' };
        return { label: 'Obese', color: '#EF4444' };
    };
    const cat = bmi ? getCategory(parseFloat(bmi)) : null;

    const save = () => {
        if (!bmi) return;
        const entry = { bmi, height, weight, date: new Date().toLocaleDateString(), ts: Date.now() };
        const updated = [entry, ...history].slice(0, 20);
        setHistory(updated);
        localStorage.setItem('medics_bmi', JSON.stringify(updated));
        setHeight(''); setWeight('');
    };

    return (
        <>
            <TrackerCard>
                <h4 style={{ margin: '0 0 16px', fontSize: '0.92rem', fontWeight: '700' }}>Calculate BMI</h4>
                <TrackerInput label="Height" value={height} onChange={setHeight} placeholder="170" unit="cm" />
                <TrackerInput label="Weight" value={weight} onChange={setWeight} placeholder="70" unit="kg" />
                {bmi && (
                    <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
                        <GaugeCircle value={bmi} max={40} label={cat.label} color={cat.color} unit="kg/m²" />
                    </div>
                )}
                <SaveButton onClick={save} color="#8B5CF6" />
            </TrackerCard>
            {history.length > 0 && (
                <TrackerCard>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', fontWeight: '700' }}>History</h4>
                    {history.map((e, i) => (
                        <HistoryItem key={i} value={e.bmi} label="kg/m²" date={e.date} color={getCategory(parseFloat(e.bmi)).color} />
                    ))}
                </TrackerCard>
            )}
        </>
    );
};

/* ─── Blood Pressure ─── */
const BPTab = () => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [pulse, setPulse] = useState('');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('medics_bp') || '[]'));

    const getCategory = (s, d) => {
        if (s < 120 && d < 80) return { label: 'Normal', color: '#10B981' };
        if (s < 130 && d < 80) return { label: 'Elevated', color: '#F59E0B' };
        if (s < 140 || d < 90) return { label: 'High Stage 1', color: '#F97316' };
        return { label: 'High Stage 2', color: '#EF4444' };
    };

    const save = () => {
        if (!systolic || !diastolic) return;
        const entry = { systolic, diastolic, pulse, date: new Date().toLocaleDateString(), ts: Date.now() };
        const updated = [entry, ...history].slice(0, 20);
        setHistory(updated);
        localStorage.setItem('medics_bp', JSON.stringify(updated));
        setSystolic(''); setDiastolic(''); setPulse('');
    };

    const cat = systolic && diastolic ? getCategory(parseInt(systolic), parseInt(diastolic)) : null;

    return (
        <>
            <TrackerCard>
                <h4 style={{ margin: '0 0 16px', fontSize: '0.92rem', fontWeight: '700' }}>Log Blood Pressure</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <TrackerInput label="Systolic" value={systolic} onChange={setSystolic} placeholder="120" unit="mmHg" />
                    <TrackerInput label="Diastolic" value={diastolic} onChange={setDiastolic} placeholder="80" unit="mmHg" />
                </div>
                <TrackerInput label="Pulse (optional)" value={pulse} onChange={setPulse} placeholder="72" unit="bpm" />
                {cat && (
                    <div style={{
                        padding: '12px 16px', borderRadius: '12px', marginBottom: '14px',
                        background: `${cat.color}10`, border: `1px solid ${cat.color}30`,
                        textAlign: 'center',
                    }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', color: cat.color }}>{systolic}/{diastolic}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: cat.color, display: 'block', marginTop: '2px' }}>{cat.label}</span>
                    </div>
                )}
                <SaveButton onClick={save} color="#EF4444" />
            </TrackerCard>
            {history.length > 0 && (
                <TrackerCard>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', fontWeight: '700' }}>History</h4>
                    {history.map((e, i) => (
                        <HistoryItem key={i} value={`${e.systolic}/${e.diastolic}`} label="mmHg" date={e.date}
                            color={getCategory(parseInt(e.systolic), parseInt(e.diastolic)).color} />
                    ))}
                </TrackerCard>
            )}
        </>
    );
};

/* ─── Blood Glucose ─── */
const GlucoseTab = () => {
    const [glucose, setGlucose] = useState('');
    const [type, setType] = useState('fasting');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('medics_glucose') || '[]'));

    const getCategory = (v, t) => {
        if (t === 'fasting') {
            if (v < 100) return { label: 'Normal', color: '#10B981' };
            if (v < 126) return { label: 'Pre-diabetic', color: '#F59E0B' };
            return { label: 'Diabetic', color: '#EF4444' };
        }
        if (v < 140) return { label: 'Normal', color: '#10B981' };
        if (v < 200) return { label: 'Pre-diabetic', color: '#F59E0B' };
        return { label: 'Diabetic', color: '#EF4444' };
    };

    const save = () => {
        if (!glucose) return;
        const entry = { glucose, type, date: new Date().toLocaleDateString(), ts: Date.now() };
        const updated = [entry, ...history].slice(0, 20);
        setHistory(updated);
        localStorage.setItem('medics_glucose', JSON.stringify(updated));
        setGlucose('');
    };

    const cat = glucose ? getCategory(parseInt(glucose), type) : null;

    return (
        <>
            <TrackerCard>
                <h4 style={{ margin: '0 0 16px', fontSize: '0.92rem', fontWeight: '700' }}>Log Blood Glucose</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    {['fasting', 'post-meal'].map(t => (
                        <button key={t} onClick={() => setType(t)} style={{
                            flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                            border: type === t ? '2px solid #F59E0B' : '1px solid rgba(0,0,0,0.08)',
                            background: type === t ? '#FEF3C7' : '#F9FAFB',
                            fontWeight: '600', fontSize: '0.78rem',
                            color: type === t ? '#D97706' : '#6B7280',
                        }}>
                            {t === 'fasting' ? '🌅 Fasting' : '🍽️ Post-meal'}
                        </button>
                    ))}
                </div>
                <TrackerInput label="Glucose Level" value={glucose} onChange={setGlucose} placeholder="100" unit="mg/dL" />
                {cat && (
                    <div style={{ textAlign: 'center', padding: '8px 0 14px' }}>
                        <GaugeCircle value={glucose} max={300} label={cat.label} color={cat.color} unit="mg/dL" />
                    </div>
                )}
                <SaveButton onClick={save} color="#F59E0B" />
            </TrackerCard>
            {history.length > 0 && (
                <TrackerCard>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', fontWeight: '700' }}>History</h4>
                    {history.map((e, i) => (
                        <HistoryItem key={i} value={`${e.glucose}`} label={`mg/dL • ${e.type}`} date={e.date}
                            color={getCategory(parseInt(e.glucose), e.type).color} />
                    ))}
                </TrackerCard>
            )}
        </>
    );
};

/* ─── Sleep Tracker ─── */
const SleepTab = () => {
    const [hours, setHours] = useState('');
    const [quality, setQuality] = useState('good');
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('medics_sleep') || '[]'));

    const getLabel = (h) => {
        if (h < 5) return { label: 'Poor', color: '#EF4444' };
        if (h < 7) return { label: 'Fair', color: '#F59E0B' };
        if (h <= 9) return { label: 'Optimal', color: '#10B981' };
        return { label: 'Excessive', color: '#F59E0B' };
    };

    const save = () => {
        if (!hours) return;
        const entry = { hours, quality, date: new Date().toLocaleDateString(), ts: Date.now() };
        const updated = [entry, ...history].slice(0, 20);
        setHistory(updated);
        localStorage.setItem('medics_sleep', JSON.stringify(updated));
        setHours('');
    };

    const cat = hours ? getLabel(parseFloat(hours)) : null;
    const weekData = history.slice(0, 7).reverse();

    return (
        <>
            <TrackerCard>
                <h4 style={{ margin: '0 0 16px', fontSize: '0.92rem', fontWeight: '700' }}>Log Sleep</h4>
                <TrackerInput label="Hours Slept" value={hours} onChange={setHours} placeholder="7.5" unit="hrs" />
                <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: '600', color: '#6B7280', display: 'block', marginBottom: '6px' }}>
                        Quality
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                            { id: 'poor', emoji: '😴', label: 'Poor' },
                            { id: 'fair', emoji: '😐', label: 'Fair' },
                            { id: 'good', emoji: '😊', label: 'Good' },
                            { id: 'great', emoji: '🤩', label: 'Great' },
                        ].map(q => (
                            <button key={q.id} onClick={() => setQuality(q.id)} style={{
                                flex: 1, padding: '10px 4px', borderRadius: '10px', cursor: 'pointer',
                                border: quality === q.id ? '2px solid #6366F1' : '1px solid rgba(0,0,0,0.08)',
                                background: quality === q.id ? '#EEF2FF' : '#F9FAFB',
                                fontSize: '0.7rem', fontWeight: '600',
                                color: quality === q.id ? '#4338CA' : '#6B7280',
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{q.emoji}</div>
                                {q.label}
                            </button>
                        ))}
                    </div>
                </div>
                {cat && (
                    <div style={{ textAlign: 'center', padding: '8px 0 14px' }}>
                        <GaugeCircle value={hours} max={12} label={cat.label} color={cat.color} unit="hours" />
                    </div>
                )}
                <SaveButton onClick={save} color="#6366F1" />
            </TrackerCard>

            {/* Weekly Bar Chart */}
            {weekData.length > 0 && (
                <TrackerCard>
                    <h4 style={{ margin: '0 0 14px', fontSize: '0.85rem', fontWeight: '700' }}>This Week</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', justifyContent: 'space-around' }}>
                        {weekData.map((e, i) => {
                            const barH = (parseFloat(e.hours) / 12) * 100;
                            const c = getLabel(parseFloat(e.hours)).color;
                            return (
                                <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                                    <span style={{ fontSize: '0.62rem', fontWeight: '600', color: '#6B7280' }}>{e.hours}h</span>
                                    <div style={{
                                        height: `${barH}%`, minHeight: '4px', borderRadius: '6px 6px 0 0',
                                        background: `linear-gradient(to top, ${c}, ${c}80)`,
                                        marginTop: '4px', transition: 'height 0.3s',
                                    }} />
                                    <span style={{ fontSize: '0.58rem', color: '#D1D5DB', marginTop: '4px', display: 'block' }}>
                                        {e.date.split('/')[0]}/{e.date.split('/')[1]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </TrackerCard>
            )}

            {history.length > 0 && (
                <TrackerCard>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.85rem', fontWeight: '700' }}>History</h4>
                    {history.map((e, i) => (
                        <HistoryItem key={i} value={`${e.hours}h`} label={`${e.quality}`} date={e.date}
                            color={getLabel(parseFloat(e.hours)).color} />
                    ))}
                </TrackerCard>
            )}
        </>
    );
};


/* ═══════════════════════════════════════════ */
/*             MAIN VIEW                       */
/* ═══════════════════════════════════════════ */
const HealthTrackersView = ({ onBack, onNavigate, initialTab }) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'bmi');

    return (
        <div className="page-container" style={{ background: '#F7F8FA' }}>
            {/* Header */}
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
                    Health Trackers
                </span>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '8px', padding: '16px 20px 0',
                overflowX: 'auto', flexShrink: 0,
            }}>
                {TABS.map(tab => {
                    const active = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '10px 18px', borderRadius: '12px', cursor: 'pointer',
                            border: 'none', whiteSpace: 'nowrap',
                            background: active ? tab.color : 'white',
                            color: active ? 'white' : '#6B7280',
                            fontWeight: '600', fontSize: '0.82rem',
                            boxShadow: active ? `0 4px 12px ${tab.color}40` : '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'all 0.2s',
                        }}>
                            <Icon active={active} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <main className="scroll-content hide-scrollbar" style={{ padding: '16px 20px 100px' }}>
                {activeTab === 'bmi' && <BMITab />}
                {activeTab === 'bp' && <BPTab />}
                {activeTab === 'glucose' && <GlucoseTab />}
                {activeTab === 'sleep' && <SleepTab />}
            </main>

            <BottomNavigation activeTab="home" onNavigate={onNavigate} />
        </div>
    );
};

export default HealthTrackersView;
