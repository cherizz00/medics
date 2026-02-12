import React, { useState } from 'react';
import { IconActivity, IconHeart, IconSleep, IconMedicine, IconWater, IconSparkles, IconPlus, IconFlask, IconThermometer } from './Icons';
import HeartRateMonitor from './HeartRateMonitor';

const HealthTrackers = ({ onAddVital }) => {
    const [bmi, setBmi] = useState({ height: '', weight: '', result: null });
    const [bp, setBp] = useState({ systolic: '', diastolic: '', result: null });
    const [temp, setTemp] = useState('');
    const [sugar, setSugar] = useState('');

    const calculateBMI = () => {
        if (bmi.height && bmi.weight) {
            const h = bmi.height / 100;
            const val = (bmi.weight / (h * h)).toFixed(1);
            setBmi({ ...bmi, result: val });

            if (onAddVital) {
                onAddVital('bmi', val, 'kg/m²');
            }
        }
    };

    const logBP = () => {
        if (bp.systolic && bp.diastolic) {
            const val = `${bp.systolic}/${bp.diastolic}`;
            if (onAddVital) {
                onAddVital('bp', { systolic: bp.systolic, diastolic: bp.diastolic }, 'mmHg');
            }
            setBp({ ...bp, systolic: '', diastolic: '' });
        }
    };

    const logTemp = () => {
        if (temp) {
            if (onAddVital) onAddVital('temp', temp, '°F');
            setTemp('');
        }
    };

    const logSugar = () => {
        if (sugar) {
            if (onAddVital) onAddVital('blood_sugar', sugar, 'mg/dL');
            setSugar('');
        }
    };

    const [showSleepModal, setShowSleepModal] = useState(false);
    const [sleepData, setSleepData] = useState({ hours: 7, minutes: 0 });
    const [cycleDate, setCycleDate] = useState('');

    const logSleep = () => {
        const val = `${sleepData.hours}h ${sleepData.minutes}m`;
        if (onAddVital) {
            onAddVital('sleep', val, 'duration');
        }
        setShowSleepModal(false);
    };

    const [showHRMonitor, setShowHRMonitor] = useState(false);
    const [lastBpm, setLastBpm] = useState(null);

    const handleHRComplete = async (bpm) => {
        setLastBpm(bpm);
        setShowHRMonitor(false);
        if (onAddVital) {
            onAddVital('heart_rate', bpm, 'bpm');
        }

        try {
            const token = localStorage.getItem('medics_token');
            await fetch('/api/heart-rate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bpm })
            });
        } catch (err) { console.error(err); }
    };

    return (
        <div className="animate-fade" id="health-trackers">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: 'var(--premium-dark)' }}>Health Trackers</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {/* BMI Calculator */}
                <div className="medical-card" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="flex-center" style={{ width: '40px', height: '40px', background: 'var(--primary-subtle)', borderRadius: '12px', color: 'var(--primary)' }}>
                                <IconActivity />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>Body Mass Index</h4>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div>
                            <label className="text-label" style={{ fontSize: '0.65rem' }}>HEIGHT (CM)</label>
                            <input
                                type="number" placeholder="175" className="input-field"
                                value={bmi.height} onChange={e => setBmi({ ...bmi, height: e.target.value })}
                                style={{ borderRadius: '12px', background: '#F8FAFC' }}
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ fontSize: '0.65rem' }}>WEIGHT (KG)</label>
                            <input
                                type="number" placeholder="70" className="input-field"
                                value={bmi.weight} onChange={e => setBmi({ ...bmi, weight: e.target.value })}
                                style={{ borderRadius: '12px', background: '#F8FAFC' }}
                            />
                        </div>
                    </div>
                    <button onClick={calculateBMI} className="btn btn-primary" style={{ width: '100%', borderRadius: '12px', fontWeight: '800' }}>Calculate BMI</button>
                    {bmi.result && (
                        <div style={{ marginTop: '16px', textAlign: 'center', padding: '12px', background: 'var(--primary-subtle)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary)' }}>{bmi.result}</span> <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>kg/m²</span>
                        </div>
                    )}
                </div>

                {/* Vital Monitor */}
                <div className="medical-card" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="flex-center" style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#EF4444' }}>
                                <IconHeart />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>Blood Pressure</h4>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div>
                            <label className="text-label" style={{ fontSize: '0.65rem' }}>SYSTOLIC</label>
                            <input
                                type="number" placeholder="120" className="input-field"
                                value={bp.systolic} onChange={e => setBp({ ...bp, systolic: e.target.value })}
                                style={{ borderRadius: '12px', background: '#fff5f5' }}
                            />
                        </div>
                        <div>
                            <label className="text-label" style={{ fontSize: '0.65rem' }}>DIASTOLIC</label>
                            <input
                                type="number" placeholder="80" className="input-field"
                                value={bp.diastolic} onChange={e => setBp({ ...bp, diastolic: e.target.value })}
                                style={{ borderRadius: '12px', background: '#fff5f5' }}
                            />
                        </div>
                    </div>
                    <button onClick={logBP} className="btn btn-primary" style={{ width: '100%', background: '#EF4444', borderRadius: '12px', fontWeight: '800' }}>Log Pressure</button>
                </div>

                {/* Temperature Logger */}
                <div className="medical-card" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="flex-center" style={{ width: '40px', height: '40px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3B82F6' }}>
                                <IconThermometer />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>Temperature</h4>
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label className="text-label" style={{ fontSize: '0.65rem' }}>TEMPERATURE (°F)</label>
                        <input
                            type="number" placeholder="98.6" className="input-field"
                            value={temp} onChange={e => setTemp(e.target.value)}
                            style={{ borderRadius: '12px', background: '#F0F9FF' }}
                        />
                    </div>
                    <button onClick={logTemp} className="btn btn-primary" style={{ width: '100%', background: '#3B82F6', borderRadius: '12px', fontWeight: '800' }}>Log Temp</button>
                </div>

                {/* Blood Sugar Logger */}
                <div className="medical-card" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex-between" style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="flex-center" style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10B981' }}>
                                <IconFlask />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>Blood Sugar</h4>
                        </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label className="text-label" style={{ fontSize: '0.65rem' }}>GLUCOSE (MG/DL)</label>
                        <input
                            type="number" placeholder="110" className="input-field"
                            value={sugar} onChange={e => setSugar(e.target.value)}
                            style={{ borderRadius: '12px', background: '#F0FDF4' }}
                        />
                    </div>
                    <button onClick={logSugar} className="btn btn-primary" style={{ width: '100%', background: '#10B981', borderRadius: '12px', fontWeight: '800' }}>Log Sugar</button>
                </div>

                {/* Heart Rate Card - Eka Care High Fidelity Mirror */}
                <div className="medical-card" style={{ border: '1px solid #EEF2FF', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div className="flex-between" style={{ padding: '16px 20px', borderBottom: '1px solid #F8FAFC' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="flex-center" style={{ width: '32px', height: '32px', background: '#F8F1FF', borderRadius: '8px', color: 'var(--primary)' }}>
                                <IconHeart size={18} />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'var(--premium-dark)' }}>Heart Rate</h4>
                        </div>
                        <button className="btn-ghost" style={{ padding: 0, color: 'var(--primary)' }}>
                            <IconPlus size={20} />
                        </button>
                    </div>

                    <div style={{ flex: 1, padding: '32px 20px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
                        {/* Faint Bar Chart Empty State */}
                        <div style={{ position: 'absolute', bottom: '40px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', opacity: 0.1, zIndex: 0 }}>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                                <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '8px', height: `${20 + Math.random() * 40}px`, background: 'var(--primary)', borderRadius: '4px' }}></div>
                                    <span style={{ fontSize: '10px', fontWeight: '800' }}>{day}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            {lastBpm ? (
                                <>
                                    <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--premium-dark)' }}>{lastBpm}</span>
                                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '700', marginLeft: '4px' }}>BPM</span>
                                </>
                            ) : (
                                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#CBD5E1' }}>No data</span>
                            )}
                        </div>
                    </div>

                    <div style={{ background: '#F8F1FF', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconHeart size={14} color="var(--primary)" />
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600', lineHeight: '1.2' }}>
                                Measure your heart rate using phone camera
                            </p>
                        </div>
                        <button
                            onClick={() => setShowHRMonitor(true)}
                            className="btn btn-primary"
                            style={{ padding: '8px 16px', fontSize: '0.75rem', borderRadius: '10px', height: 'auto' }}
                        >
                            Measure
                        </button>
                    </div>
                </div>
            </div>

            {/* HR Monitor Modal */}
            {showHRMonitor && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                }} onClick={() => setShowHRMonitor(false)}>
                    <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px' }}>
                        <HeartRateMonitor onComplete={handleHRComplete} />
                        <button onClick={() => setShowHRMonitor(false)} className="btn btn-ghost" style={{ marginTop: '16px', width: '100%', color: 'white', fontWeight: '800' }}>Close Monitor</button>
                    </div>
                </div>
            )}

            {/* Daily Routines */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '32px 0 16px', color: 'var(--premium-dark)' }}>Instant Loggers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div className="medical-card" onClick={() => onAddVital && onAddVital('water', '250ml', 'volume')}
                    style={{ padding: '20px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                    <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px', color: '#3B82F6' }}><IconWater /></div>
                    <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block' }}>Hydrate</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>+250ml</span>
                    </div>
                </div>

                <div className="medical-card" onClick={() => setShowSleepModal(true)}
                    style={{ padding: '20px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                    <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '14px', color: '#8B5CF6' }}><IconSleep /></div>
                    <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block' }}>Sleep</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>Log Night</span>
                    </div>
                </div>

                <div className="medical-card" onClick={() => document.getElementById('medication-reminders')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ padding: '20px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '10px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                    <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '14px', color: '#EC4899' }}><IconMedicine /></div>
                    <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block' }}>Medicine</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>Reminders</span>
                    </div>
                </div>
            </div>

            {/* Sleep Modal */}
            {showSleepModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
                }} onClick={() => setShowSleepModal(false)}>
                    <div className="medical-card animate-fade" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '320px', padding: '32px 24px' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', textAlign: 'center', fontWeight: '900' }}>Log Sleep Time</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <input
                                    type="number" min="0" max="23" className="input-field"
                                    value={sleepData.hours} onChange={e => setSleepData({ ...sleepData, hours: e.target.value })}
                                    style={{ width: '80px', height: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', borderRadius: '14px' }}
                                />
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '800' }}>HOURS</div>
                            </div>
                            <span style={{ fontSize: '2rem', fontWeight: '900', transform: 'translateY(-10px)' }}>:</span>
                            <div style={{ textAlign: 'center' }}>
                                <input
                                    type="number" min="0" max="59" className="input-field"
                                    value={sleepData.minutes} onChange={e => setSleepData({ ...sleepData, minutes: e.target.value })}
                                    style={{ width: '80px', height: '60px', textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', borderRadius: '14px' }}
                                />
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '800' }}>MINUTES</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowSleepModal(false)} className="btn btn-ghost" style={{ flex: 1, fontWeight: '800' }}>Cancel</button>
                            <button onClick={logSleep} className="btn btn-primary" style={{ flex: 1, fontWeight: '800' }}>Log Sleep</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthTrackers;
