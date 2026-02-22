import React, { useState, useEffect } from 'react';
import { IconChevronLeft } from './Icons';
import BottomNavigation from './common/BottomNavigation';


const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);
const CheckIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const TrashIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
);
const EditIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);


const FREQUENCIES = ['Once daily', 'Twice daily', '3× daily', 'Weekly', 'As needed'];

const MED_TYPES = [
    { id: 'tablet', emoji: '💊', label: 'Tablet' },
    { id: 'capsule', emoji: '🔵', label: 'Capsule' },
    { id: 'syrup', emoji: '🍯', label: 'Syrup' },
    { id: 'injection', emoji: '💉', label: 'Injection' },
    { id: 'drops', emoji: '💧', label: 'Drops' },
    { id: 'inhaler', emoji: '🌬️', label: 'Inhaler' },
    { id: 'cream', emoji: '🧴', label: 'Cream' },
    { id: 'other', emoji: '✚', label: 'Other' },
];

const TIME_SLOTS = [
    { id: 'morning', label: 'Morning', emoji: '🌅', desc: '6–10 AM', gradient: 'linear-gradient(135deg, #FDE68A, #F59E0B)' },
    { id: 'afternoon', label: 'Afternoon', emoji: '☀️', desc: '12–2 PM', gradient: 'linear-gradient(135deg, #FED7AA, #F97316)' },
    { id: 'evening', label: 'Evening', emoji: '🌇', desc: '5–7 PM', gradient: 'linear-gradient(135deg, #DDD6FE, #8B5CF6)' },
    { id: 'night', label: 'Night', emoji: '🌙', desc: '9–11 PM', gradient: 'linear-gradient(135deg, #C7D2FE, #4338CA)' },
    { id: 'before-meals', label: 'Before Meals', emoji: '🥗', desc: '', gradient: 'linear-gradient(135deg, #A7F3D0, #10B981)' },
    { id: 'after-meals', label: 'After Meals', emoji: '🍽️', desc: '', gradient: 'linear-gradient(135deg, #99F6E4, #14B8A6)' },
];

const ACCENT_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#0EA5E9', '#8B5CF6', '#EF4444', '#14B8A6'];


const STYLE_TAG_ID = 'med-reminder-styles';
const injectStyles = () => {
    if (document.getElementById(STYLE_TAG_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_TAG_ID;
    style.textContent = `
        @keyframes medSlideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes medFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes medPop { 0% { transform: scale(0.85); opacity: 0; } 60% { transform: scale(1.04); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes medCheckPulse { 0% { transform: scale(1); } 50% { transform: scale(1.25); } 100% { transform: scale(1); } }
        @keyframes medShine { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes medBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .med-card-enter { animation: medPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .med-check-pulse { animation: medCheckPulse 0.3s ease; }
        .med-modal-bg { animation: medFadeIn 0.25s ease both; }
        .med-modal-sheet { animation: medSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .med-streak-bounce { animation: medBounce 2s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
};


const ProgressRing = ({ pct, taken, total }) => {
    const r = 38, c = 2 * Math.PI * r;
    const offset = c - (pct / 100) * c;

    return (
        <div style={{ position: 'relative', width: '92px', height: '92px', flexShrink: 0 }}>
            <svg width="92" height="92" viewBox="0 0 92 92">
                <circle cx="46" cy="46" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                <circle cx="46" cy="46" r={r} fill="none" stroke="white" strokeWidth="6"
                    strokeDasharray={c} strokeDashoffset={offset}
                    strokeLinecap="round" transform="rotate(-90 46 46)"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.3))' }}
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white', lineHeight: 1 }}>{pct}%</span>
                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', marginTop: '1px' }}>{taken}/{total} doses</span>
            </div>
        </div>
    );
};


const DaySelector = () => {
    const days = [];
    const now = new Date();
    for (let i = -2; i <= 4; i++) {
        const d = new Date(now); d.setDate(d.getDate() + i);
        days.push({
            day: d.toLocaleDateString('en', { weekday: 'narrow' }),
            date: d.getDate(),
            isToday: i === 0,
        });
    }
    return (
        <div style={{
            display: 'flex', gap: '6px', padding: '12px 20px 6px',
            overflowX: 'auto', flexShrink: 0,
        }}>
            {days.map((d, i) => (
                <div key={i} style={{
                    minWidth: '42px', padding: '10px 0', borderRadius: '14px',
                    textAlign: 'center', cursor: 'pointer', flex: 1,
                    background: d.isToday ? 'linear-gradient(135deg, #4A55A2, #7C3AED)' : 'white',
                    border: d.isToday ? 'none' : '1px solid rgba(0,0,0,0.04)',
                    boxShadow: d.isToday
                        ? '0 6px 20px rgba(74,85,162,0.3)'
                        : '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                    <span style={{
                        fontSize: '0.58rem', fontWeight: '600', display: 'block', marginBottom: '3px',
                        color: d.isToday ? 'rgba(255,255,255,0.65)' : '#B0B5C0',
                        letterSpacing: '0.5px', textTransform: 'uppercase',
                    }}>{d.day}</span>
                    <span style={{
                        fontSize: '0.95rem', fontWeight: '800',
                        color: d.isToday ? 'white' : '#374151',
                    }}>{d.date}</span>
                </div>
            ))}
        </div>
    );
};


const MedCard = ({ med, slotId, taken, onToggle, getEmoji }) => (
    <div
        className="med-card-enter"
        onClick={onToggle}
        style={{
            background: taken
                ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
                : 'white',
            borderRadius: '16px', padding: '14px 16px',
            border: taken ? '1px solid #86EFAC' : '1px solid rgba(0,0,0,0.05)',
            boxShadow: taken
                ? '0 2px 8px rgba(16,185,129,0.1)'
                : '0 2px 10px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: taken ? 'scale(0.97)' : 'scale(1)',
        }}
    >
        {/* Check / Emoji circle */}
        <div className={taken ? 'med-check-pulse' : ''} style={{
            width: '42px', height: '42px', borderRadius: '13px', flexShrink: 0,
            background: taken
                ? `linear-gradient(135deg, ${med.color}, ${med.color}CC)`
                : `${med.color}0F`,
            border: taken ? 'none' : `2px dashed ${med.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', transition: 'all 0.3s ease',
            boxShadow: taken ? `0 4px 14px ${med.color}35` : 'none',
        }}>
            {taken
                ? <CheckIcon size={18} />
                : <span style={{ fontSize: '1.2rem' }}>{getEmoji(med.type)}</span>
            }
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
                fontSize: '0.88rem', fontWeight: '700', display: 'block',
                color: taken ? '#047857' : '#1F2937',
                textDecoration: taken ? 'line-through' : 'none',
                textDecorationColor: '#6EE7B7',
                opacity: taken ? 0.75 : 1,
                transition: 'all 0.2s',
            }}>
                {med.name}
            </span>
            <span style={{ fontSize: '0.7rem', color: taken ? '#A7F3D0' : '#9CA3AF', fontWeight: '500' }}>
                {med.dosage ? `${med.dosage}` : med.frequency}
                {med.notes && ` · ${med.notes}`}
            </span>
        </div>

        {taken ? (
            <div style={{
                padding: '4px 10px', borderRadius: '8px',
                background: '#059669', color: 'white',
                fontSize: '0.6rem', fontWeight: '800',
                letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>Done</div>
        ) : (
            <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                border: `2px solid ${med.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} />
        )}
    </div>
);



const MedicineReminderView = ({ onBack, onNavigate }) => {
    useEffect(() => injectStyles(), []);

    const [medicines, setMedicines] = useState(() => JSON.parse(localStorage.getItem('medics_medicines') || '[]'));
    const [showAdd, setShowAdd] = useState(false);
    const [viewMode, setViewMode] = useState('timeline');
    const [editingId, setEditingId] = useState(null);
    const [expandedSlot, setExpandedSlot] = useState(null);

    // Form
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [medType, setMedType] = useState('tablet');
    const [frequency, setFrequency] = useState('Once daily');
    const [times, setTimes] = useState(['morning']);
    const [notes, setNotes] = useState('');

    const [takenToday, setTakenToday] = useState(() => JSON.parse(localStorage.getItem('medics_taken_today') || '{}'));
    const today = new Date().toLocaleDateString();
    const dayName = new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' });

    const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('medics_streak') || '0'));

    useEffect(() => { localStorage.setItem('medics_medicines', JSON.stringify(medicines)); }, [medicines]);
    useEffect(() => { localStorage.setItem('medics_taken_today', JSON.stringify(takenToday)); }, [takenToday]);

    useEffect(() => {
        const savedDate = localStorage.getItem('medics_taken_date');
        if (savedDate !== today) {
            const yTotal = medicines.reduce((s, m) => s + m.times.length, 0);
            const yTaken = Object.values(takenToday).filter(Boolean).length;
            if (yTotal > 0 && yTaken >= yTotal) {
                const n = streak + 1; setStreak(n); localStorage.setItem('medics_streak', String(n));
            } else if (yTotal > 0) { setStreak(0); localStorage.setItem('medics_streak', '0'); }
            setTakenToday({}); localStorage.setItem('medics_taken_date', today);
        }
    }, []);

    const toggleTime = (t) => setTimes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
    const resetForm = () => { setName(''); setDosage(''); setMedType('tablet'); setFrequency('Once daily'); setTimes(['morning']); setNotes(''); setEditingId(null); };

    const saveMedicine = () => {
        if (!name.trim()) return;
        const med = {
            id: editingId || Date.now(), name: name.trim(), dosage: dosage.trim(),
            type: medType, frequency, times, notes: notes.trim(),
            color: ACCENT_COLORS[medicines.length % ACCENT_COLORS.length], createdAt: today,
        };
        if (editingId) setMedicines(p => p.map(m => m.id === editingId ? { ...med, color: m.color } : m));
        else setMedicines(p => [...p, med]);
        resetForm(); setShowAdd(false);
    };

    const editMedicine = (m) => {
        setName(m.name); setDosage(m.dosage || ''); setMedType(m.type || 'tablet');
        setFrequency(m.frequency); setTimes(m.times); setNotes(m.notes || '');
        setEditingId(m.id); setShowAdd(true);
    };

    const deleteMedicine = (id) => {
        setMedicines(p => p.filter(m => m.id !== id));
        setTakenToday(p => { const c = { ...p }; Object.keys(c).forEach(k => { if (k.startsWith(`${id}_`)) delete c[k]; }); return c; });
    };

    const toggleTaken = (id, time) => {
        const key = `${id}_${time}`;
        setTakenToday(p => ({ ...p, [key]: !p[key] }));
    };

    const totalDoses = medicines.reduce((s, m) => s + m.times.length, 0);
    const takenCount = Object.values(takenToday).filter(Boolean).length;
    const progressPct = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 0;

    const getMedsBySlot = (slotId) => medicines.filter(m => m.times.includes(slotId));
    const activeSlots = TIME_SLOTS.filter(s => getMedsBySlot(s.id).length > 0);
    const getTypeEmoji = (type) => MED_TYPES.find(t => t.id === type)?.emoji || '💊';


    const getMotivation = () => {
        if (totalDoses === 0) return "Add your first medicine to get started!";
        if (progressPct === 100) return "Perfect! All medications taken today 🌟";
        if (progressPct >= 75) return "Almost there, keep it up! 💪";
        if (progressPct >= 50) return "Halfway through today's doses";
        if (progressPct > 0) return "Good start! Don't forget the rest";
        return "Time to start your medications";
    };

    return (
        <div className="page-container" style={{ background: '#F5F6FA' }}>

            <div style={{
                background: 'linear-gradient(160deg, #3730A3 0%, #6366F1 40%, #818CF8 80%, #A5B4FC 100%)',
                padding: '16px 20px 22px', flexShrink: 0,
                borderRadius: '0 0 28px 28px',
                boxShadow: '0 8px 30px rgba(99,102,241,0.25)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: '-40px', left: '10px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                {/* Top bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', position: 'relative', zIndex: 1 }}>
                    <button onClick={onBack} style={{
                        width: '36px', height: '36px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white',
                    }}>
                        <IconChevronLeft size={18} />
                    </button>
                    <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '1.08rem', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>
                            My Medications
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)', display: 'block', marginTop: '1px' }}>
                            {dayName}
                        </span>
                    </div>
                    <button onClick={() => { resetForm(); setShowAdd(true); }} style={{
                        width: '36px', height: '36px', borderRadius: '12px',
                        border: 'none', cursor: 'pointer',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}>
                        <PlusIcon />
                    </button>
                </div>

                {/* Stats row */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '18px',
                    background: 'rgba(255,255,255,0.08)', borderRadius: '20px',
                    padding: '16px', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative', zIndex: 1,
                }}>
                    <ProgressRing pct={progressPct} taken={takenCount} total={totalDoses} />
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', fontWeight: '500', lineHeight: '1.5' }}>
                            {getMotivation()}
                        </p>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <div className="med-streak-bounce" style={{
                                padding: '5px 10px', borderRadius: '10px',
                                background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.25)',
                                display: 'flex', alignItems: 'center', gap: '4px',
                            }}>
                                <span style={{ fontSize: '0.8rem' }}>🔥</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#FDE68A' }}>
                                    {streak} day{streak !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div style={{
                                padding: '5px 10px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>
                                    💊 {medicines.length} medication{medicines.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DaySelector />

            <div style={{
                display: 'flex', gap: '3px', margin: '6px 20px 10px',
                background: '#ECEDF2', borderRadius: '12px', padding: '3px',
            }}>
                {[
                    { id: 'timeline', label: '⏰ Schedule' },
                    { id: 'list', label: '📋 All Meds' },
                ].map(v => (
                    <button key={v.id} onClick={() => setViewMode(v.id)} style={{
                        flex: 1, padding: '9px', borderRadius: '10px', border: 'none',
                        cursor: 'pointer', fontWeight: '700', fontSize: '0.76rem',
                        background: viewMode === v.id ? 'white' : 'transparent',
                        color: viewMode === v.id ? '#1F2937' : '#9CA3AF',
                        boxShadow: viewMode === v.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}>
                        {v.label}
                    </button>
                ))}
            </div>

            <main className="scroll-content hide-scrollbar" style={{ padding: '4px 20px 100px' }}>

                {/* Empty State */}
                {medicines.length === 0 && (
                    <div className="med-card-enter" style={{
                        background: 'white', borderRadius: '24px', padding: '44px 24px',
                        textAlign: 'center', border: '1px solid rgba(0,0,0,0.04)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                        marginTop: '8px',
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 18px',
                            background: 'linear-gradient(135deg, #EEF2FF, #DDD6FE)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.2rem',
                            boxShadow: '0 8px 24px rgba(99,102,241,0.12)',
                        }}>💊</div>
                        <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: '800', color: '#1F2937' }}>
                            No Medications Yet
                        </h4>
                        <p style={{ margin: '0 0 22px', fontSize: '0.82rem', color: '#9CA3AF', lineHeight: '1.6' }}>
                            Track your daily medications and<br />never miss a dose again.
                        </p>
                        <button onClick={() => { resetForm(); setShowAdd(true); }} style={{
                            padding: '14px 30px', borderRadius: '14px', border: 'none',
                            background: 'linear-gradient(135deg, #6366F1, #4338CA)',
                            color: 'white', fontWeight: '700', fontSize: '0.86rem', cursor: 'pointer',
                            boxShadow: '0 6px 24px rgba(99,102,241,0.35)',
                            transition: 'transform 0.2s',
                        }}>
                            + Add Your First Medicine
                        </button>
                    </div>
                )}

                {viewMode === 'timeline' && medicines.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                        {activeSlots.map((slot, idx) => {
                            const slotMeds = getMedsBySlot(slot.id);
                            const slotTaken = slotMeds.filter(m => takenToday[`${m.id}_${slot.id}`]).length;
                            const allDone = slotTaken === slotMeds.length;

                            return (
                                <div key={slot.id} style={{ marginBottom: '20px' }}>
                                    {/* Slot Header */}
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
                                    }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '13px',
                                            background: allDone ? 'linear-gradient(135deg, #10B981, #059669)' : slot.gradient,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1rem',
                                            boxShadow: allDone
                                                ? '0 4px 14px rgba(16,185,129,0.25)'
                                                : '0 4px 14px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s ease',
                                        }}>
                                            {allDone ? <span style={{ color: 'white' }}><CheckIcon size={18} /></span> : slot.emoji}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <span style={{
                                                fontSize: '0.85rem', fontWeight: '700',
                                                color: allDone ? '#059669' : '#1F2937',
                                            }}>
                                                {slot.label}
                                            </span>
                                            {slot.desc && (
                                                <span style={{ fontSize: '0.65rem', color: '#B0B5C0', marginLeft: '6px', fontWeight: '500' }}>
                                                    {slot.desc}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{
                                            padding: '4px 10px', borderRadius: '8px',
                                            background: allDone ? '#ECFDF5' : '#F3F4F6',
                                            display: 'flex', alignItems: 'center', gap: '3px',
                                        }}>
                                            <span style={{
                                                fontSize: '0.68rem', fontWeight: '800',
                                                color: allDone ? '#059669' : '#6B7280',
                                            }}>
                                                {slotTaken}/{slotMeds.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timeline line + cards */}
                                    <div style={{
                                        paddingLeft: '20px', marginLeft: '19px',
                                        borderLeft: `2px solid ${allDone ? '#A7F3D0' : '#E5E7EB'}`,
                                        display: 'flex', flexDirection: 'column', gap: '8px',
                                        transition: 'border-color 0.3s ease',
                                    }}>
                                        {slotMeds.map(med => (
                                            <MedCard
                                                key={med.id} med={med} slotId={slot.id}
                                                taken={!!takenToday[`${med.id}_${slot.id}`]}
                                                onToggle={() => toggleTaken(med.id, slot.id)}
                                                getEmoji={getTypeEmoji}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {activeSlots.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#B0B5C0' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>No scheduled doses for today</p>
                            </div>
                        )}
                    </div>
                )}

                {viewMode === 'list' && medicines.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                        {medicines.map((med, i) => {
                            const medTaken = med.times.filter(t => takenToday[`${med.id}_${t}`]).length;
                            const medTotal = med.times.length;
                            const allDone = medTaken === medTotal;

                            return (
                                <div key={med.id} className="med-card-enter" style={{
                                    background: 'white', borderRadius: '20px', overflow: 'hidden',
                                    border: allDone ? '1px solid #86EFAC' : '1px solid rgba(0,0,0,0.04)',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                                    animationDelay: `${i * 0.06}s`,
                                }}>
                                    {/* Accent bar */}
                                    <div style={{
                                        height: '3px',
                                        background: allDone
                                            ? 'linear-gradient(90deg, #10B981, #34D399)'
                                            : `linear-gradient(90deg, ${med.color}, ${med.color}88)`,
                                    }} />

                                    <div style={{ padding: '16px' }}>
                                        {/* Top row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '15px',
                                                background: `linear-gradient(135deg, ${med.color}15, ${med.color}08)`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.4rem', flexShrink: 0,
                                                border: `1px solid ${med.color}15`,
                                            }}>
                                                {getTypeEmoji(med.type)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1F2937', display: 'block' }}>
                                                    {med.name}
                                                </span>
                                                <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: '500' }}>
                                                    {med.dosage && `${med.dosage} · `}{med.frequency}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <button onClick={(e) => { e.stopPropagation(); editMedicine(med); }} style={{
                                                    background: '#F3F4F6', border: 'none', cursor: 'pointer', color: '#6B7280',
                                                    width: '30px', height: '30px', borderRadius: '9px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'background 0.2s',
                                                }}>
                                                    <EditIcon />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); deleteMedicine(med.id); }} style={{
                                                    background: '#FEF2F2', border: 'none', cursor: 'pointer', color: '#EF4444',
                                                    width: '30px', height: '30px', borderRadius: '9px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'background 0.2s',
                                                }}>
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Mini progress */}
                                        <div style={{ height: '3px', background: '#F3F4F6', borderRadius: '2px', marginBottom: '12px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', borderRadius: '2px',
                                                width: `${medTotal > 0 ? (medTaken / medTotal) * 100 : 0}%`,
                                                background: allDone
                                                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                                                    : `linear-gradient(90deg, ${med.color}, ${med.color}CC)`,
                                                transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            }} />
                                        </div>

                                        {/* Time chips */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {med.times.map(time => {
                                                const taken = !!takenToday[`${med.id}_${time}`];
                                                const slotInfo = TIME_SLOTS.find(s => s.id === time);
                                                return (
                                                    <button key={time} onClick={() => toggleTaken(med.id, time)} style={{
                                                        display: 'flex', alignItems: 'center', gap: '5px',
                                                        padding: '7px 12px', borderRadius: '10px', cursor: 'pointer',
                                                        border: 'none',
                                                        background: taken
                                                            ? `linear-gradient(135deg, ${med.color}, ${med.color}CC)`
                                                            : '#F5F6FA',
                                                        color: taken ? 'white' : '#6B7280',
                                                        fontSize: '0.72rem', fontWeight: '600',
                                                        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                                        boxShadow: taken ? `0 3px 10px ${med.color}30` : 'none',
                                                        transform: taken ? 'scale(0.96)' : 'scale(1)',
                                                    }}>
                                                        {slotInfo?.emoji || '⏰'}
                                                        <span>{slotInfo?.label || time}</span>
                                                        {taken && <span>✓</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {med.notes && (
                                            <div style={{
                                                margin: '10px 0 0', fontSize: '0.72rem', color: '#6B7280',
                                                padding: '8px 12px', borderRadius: '10px',
                                                background: '#F9FAFB', border: '1px solid rgba(0,0,0,0.03)',
                                                display: 'flex', gap: '6px', alignItems: 'flex-start',
                                            }}>
                                                <span>📝</span>
                                                <span style={{ fontStyle: 'italic' }}>{med.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {showAdd && (
                <div className="med-modal-bg" style={{
                    position: 'fixed', inset: 0, zIndex: 2000,
                    background: 'rgba(15,15,30,0.55)', backdropFilter: 'blur(12px)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                }} onClick={() => { setShowAdd(false); resetForm(); }}>
                    <div className="med-modal-sheet" onClick={e => e.stopPropagation()} style={{
                        background: 'white', borderRadius: '28px 28px 0 0',
                        padding: '12px 20px 34px', maxHeight: '88vh', overflowY: 'auto',
                        boxShadow: '0 -12px 50px rgba(0,0,0,0.15)',
                    }}>
                        {/* Handle + title */}
                        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                            <div style={{ width: '40px', height: '4px', background: '#E2E4EA', borderRadius: '2px', margin: '4px auto 16px' }} />
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#1F2937' }}>
                                {editingId ? '✏️ Edit Medicine' : '💊 New Medicine'}
                            </h3>
                            <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#B0B5C0' }}>
                                {editingId ? 'Update your medication details' : 'Set up a new medication reminder'}
                            </p>
                        </div>

                        {/* Name */}
                        <label style={labelStyle}>Medicine Name *</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Paracetamol 500mg" autoFocus
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#6366F1'} onBlur={e => e.target.style.borderColor = '#ECEDF2'}
                        />

                        {/* Type Grid */}
                        <label style={labelStyle}>Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
                            {MED_TYPES.map(t => (
                                <button key={t.id} onClick={() => setMedType(t.id)} style={{
                                    padding: '12px 4px', borderRadius: '14px', cursor: 'pointer',
                                    border: medType === t.id ? '2px solid #6366F1' : '1.5px solid #ECEDF2',
                                    background: medType === t.id ? '#EEF2FF' : 'white',
                                    textAlign: 'center', transition: 'all 0.2s',
                                    boxShadow: medType === t.id ? '0 2px 8px rgba(99,102,241,0.12)' : 'none',
                                }}>
                                    <div style={{ fontSize: '1.3rem', marginBottom: '3px' }}>{t.emoji}</div>
                                    <span style={{
                                        fontSize: '0.62rem', fontWeight: '700',
                                        color: medType === t.id ? '#4338CA' : '#9CA3AF',
                                    }}>{t.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Dosage */}
                        <label style={labelStyle}>Dosage</label>
                        <input value={dosage} onChange={e => setDosage(e.target.value)} placeholder="e.g. 500mg, 1 tablet, 5ml"
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = '#6366F1'} onBlur={e => e.target.style.borderColor = '#ECEDF2'}
                        />

                        {/* Frequency */}
                        <label style={labelStyle}>Frequency</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                            {FREQUENCIES.map(f => (
                                <button key={f} onClick={() => setFrequency(f)} style={{
                                    padding: '9px 16px', borderRadius: '12px', cursor: 'pointer',
                                    border: frequency === f ? '2px solid #10B981' : '1.5px solid #ECEDF2',
                                    background: frequency === f ? '#ECFDF5' : 'white',
                                    fontWeight: '600', fontSize: '0.76rem',
                                    color: frequency === f ? '#059669' : '#6B7280',
                                    transition: 'all 0.2s',
                                    boxShadow: frequency === f ? '0 2px 8px rgba(16,185,129,0.1)' : 'none',
                                }}>
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Schedule */}
                        <label style={labelStyle}>When to take</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
                            {TIME_SLOTS.map(t => {
                                const sel = times.includes(t.id);
                                return (
                                    <button key={t.id} onClick={() => toggleTime(t.id)} style={{
                                        padding: '12px 6px', borderRadius: '14px', cursor: 'pointer',
                                        border: sel ? '2px solid #6366F1' : '1.5px solid #ECEDF2',
                                        background: sel ? '#EEF2FF' : 'white',
                                        fontWeight: '600', fontSize: '0.68rem', textAlign: 'center',
                                        color: sel ? '#4338CA' : '#9CA3AF',
                                        transition: 'all 0.2s',
                                        boxShadow: sel ? '0 2px 8px rgba(99,102,241,0.1)' : 'none',
                                    }}>
                                        <div style={{ fontSize: '1.1rem', marginBottom: '3px' }}>{t.emoji}</div>
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Notes */}
                        <label style={labelStyle}>Instructions (optional)</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)}
                            placeholder="e.g. Take with food, avoid dairy..."
                            rows="2" style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                            onFocus={e => e.target.style.borderColor = '#6366F1'} onBlur={e => e.target.style.borderColor = '#ECEDF2'}
                        />

                        {/* Submit */}
                        <button onClick={saveMedicine} style={{
                            width: '100%', padding: '16px', borderRadius: '16px',
                            border: 'none', cursor: name.trim() ? 'pointer' : 'not-allowed',
                            background: name.trim()
                                ? 'linear-gradient(135deg, #4338CA, #6366F1)'
                                : '#E5E7EB',
                            color: name.trim() ? 'white' : '#9CA3AF',
                            fontWeight: '800', fontSize: '0.92rem',
                            boxShadow: name.trim() ? '0 8px 28px rgba(67,56,202,0.35)' : 'none',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            letterSpacing: '0.02em',
                        }}>
                            {editingId ? '✓ Save Changes' : '+ Add Medicine'}
                        </button>
                    </div>
                </div>
            )}

            <BottomNavigation activeTab="home" onNavigate={onNavigate} />
        </div>
    );
};

/* ─── Shared styles ─── */
const labelStyle = {
    fontSize: '0.73rem', fontWeight: '700', color: '#4B5563',
    display: 'block', marginBottom: '7px', letterSpacing: '0.02em',
    textTransform: 'uppercase',
};
const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '14px',
    border: '2px solid #ECEDF2', background: '#FAFBFC',
    fontSize: '0.88rem', marginBottom: '18px', outline: 'none',
    boxSizing: 'border-box', fontWeight: '500',
    transition: 'border 0.25s, box-shadow 0.25s',
};

export default MedicineReminderView;
