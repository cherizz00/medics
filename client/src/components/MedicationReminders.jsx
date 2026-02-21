import React, { useState, useEffect } from 'react';
import { IconPlus, IconCheck, IconMedicine, IconPremium } from './Icons';

const MedicationReminders = ({ isPremium, onUpgrade }) => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [newMed, setNewMed] = useState({ title: '', dosage: '', time: '', type: 'medication' });

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchReminders();
        const interval = setInterval(fetchReminders, 30000);
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => {
            clearInterval(interval);
            clearInterval(timeInterval);
        };
    }, []);


    const fetchReminders = async () => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/reminders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setReminders(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusInfo = (scheduledTime, status) => {
        if (status === 'taken') return { label: 'COMPLETED', color: '#059669', isPlusing: false };

        const scheduled = new Date(scheduledTime);
        const diffInMins = Math.floor((scheduled - currentTime) / (1000 * 60));

        if (diffInMins < -60) return { label: `OVERDUE ${Math.abs(Math.floor(diffInMins / 60))}H+`, color: '#DC2626', isPlusing: true };
        if (diffInMins < 0) return { label: `OVERDUE ${Math.abs(diffInMins)}M`, color: '#DC2626', isPlusing: true };
        if (diffInMins <= 5) return { label: 'DUE NOW', color: '#EA580C', isPlusing: true };
        if (diffInMins <= 60) return { label: `DUE IN ${diffInMins}M`, color: 'var(--primary)', isPlusing: false };

        return { label: 'UPCOMING', color: 'var(--text-muted)', isPlusing: false };
    };

    const displayedReminders = reminders.filter(r => r.status !== 'taken');

    const sortedReminders = [...displayedReminders].sort((a, b) => {
        const infoA = getStatusInfo(a.scheduled_time, a.status);
        const infoB = getStatusInfo(b.scheduled_time, b.status);

        const getPrio = (label) => {
            if (label.startsWith('OVERDUE')) return 3;
            if (label === 'DUE NOW') return 2;
            if (label.startsWith('DUE IN')) return 1;
            return 0;
        };

        return getPrio(infoB.label) - getPrio(infoA.label) || new Date(a.scheduled_time) - new Date(b.scheduled_time);
    });

    const handleAdd = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('medics_token');
            const now = new Date();
            const [hours, minutes] = newMed.time.split(':');
            now.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const response = await fetch('/api/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...newMed,
                    scheduled_time: now
                })
            });

            if (response.ok) {
                fetchReminders();
                setShowAdd(false);
                setNewMed({ title: '', dosage: '', time: '', type: 'medication' });
            } else {
                const data = await response.json();
                alert(`Failed to add reminder: ${data.message || response.statusText}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'taken' ? 'pending' : 'taken';

        setReminders(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));

        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch(`/api/reminders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                setReminders(prev => prev.map(r => r._id === id ? { ...r, status: currentStatus } : r));
                setError('Failed to update status');
            }
        } catch (err) {
            console.error(err);
            setReminders(prev => prev.map(r => r._id === id ? { ...r, status: currentStatus } : r));
        }
    };

    return (
        <section style={{ marginBottom: '32px' }}>
            <div className="flex-between" style={{ marginBottom: '18px', paddingLeft: '4px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--premium-dark)', letterSpacing: '-0.02em' }}>Daily Medications</h3>
                <button onClick={() => setShowAdd(!showAdd)} className="btn-ghost flex-center" style={{
                    width: '32px', height: '32px', borderRadius: '10px', padding: 0,
                    background: showAdd ? 'var(--text-muted)' : 'var(--primary-subtle)',
                    color: showAdd ? 'white' : 'var(--primary)', border: 'none'
                }}>
                    <IconPlus size={18} />
                </button>
            </div>

            {showAdd && (
                <div className="medical-card" style={{
                    marginBottom: '24px',
                    border: '1px solid #F1F5F9',
                    background: 'white',
                    padding: '24px',
                    borderRadius: '24px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)'
                }}>
                    <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div>
                            <label className="text-label" style={{ fontSize: '0.65rem' }}>MEDICINE NAME</label>
                            <input
                                type="text" placeholder="e.g. Paracetamol" required className="input-field"
                                value={newMed.title} onChange={e => setNewMed({ ...newMed, title: e.target.value })}
                                style={{ borderRadius: '14px', height: '52px', border: '1.5px solid #F1F5F9', fontSize: '0.95rem', fontWeight: '700' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="text-label" style={{ fontSize: '0.65rem' }}>DOSAGE</label>
                                <input
                                    type="text" placeholder="500mg" className="input-field"
                                    value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                                    style={{ borderRadius: '14px', height: '52px', border: '1.5px solid #F1F5F9', fontSize: '0.95rem', fontWeight: '700' }}
                                />
                            </div>
                            <div>
                                <label className="text-label" style={{ fontSize: '0.65rem' }}>TIME</label>
                                <input
                                    type="time" required className="input-field"
                                    value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })}
                                    style={{ borderRadius: '14px', height: '52px', border: '1.5px solid #F1F5F9', fontSize: '0.95rem', fontWeight: '700' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                width: '100%', height: '56px', fontWeight: '800', borderRadius: '16px',
                                background: 'var(--primary)',
                                boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.3)',
                                marginTop: '8px',
                                fontSize: '1rem'
                            }}
                        >
                            Set Reminder
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sortedReminders.length === 0 ? (
                    <div className="medical-card" style={{
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        background: '#FAFAFA',
                        border: '2px dashed #E2E8F0',
                        padding: '48px 32px',
                        borderRadius: '24px'
                    }}>
                        <div className="flex-center" style={{
                            width: '64px', height: '64px',
                            margin: '0 auto 16px',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.04)',
                            color: 'var(--primary)',
                            opacity: 0.8
                        }}>
                            <IconMedicine size={32} />
                        </div>
                        <h4 style={{ margin: '0 0 6px', color: 'var(--text-main)', fontWeight: '800' }}>All Caught Up</h4>
                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.8rem', opacity: 0.6 }}>Add a medicine to start tracking</p>
                    </div>
                ) : (
                    sortedReminders.map(rem => {
                        const info = getStatusInfo(rem.scheduled_time, rem.status);
                        return (
                            <div key={rem._id} className="medical-card flex-between" style={{
                                padding: '18px 20px',
                                background: rem.status === 'taken' ? '#F8FAFC' : 'white',
                                border: '1.5px solid',
                                borderColor: rem.status === 'taken' ? '#F1F5F9' : (info.isPlusing ? info.color + '33' : '#F1F5F9'),
                                borderRadius: '22px',
                                boxShadow: rem.status === 'taken' ? 'none' : '0 10px 15px -10px rgba(0,0,0,0.05)',
                                opacity: rem.status === 'taken' ? 0.7 : 1
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                    <div className="flex-center" style={{
                                        width: '52px', height: '52px', borderRadius: '15px',
                                        background: rem.status === 'taken' ? '#F1F5F9' : info.color + '15',
                                        color: rem.status === 'taken' ? 'var(--text-muted)' : info.color,
                                        position: 'relative'
                                    }}>
                                        <IconMedicine size={26} />
                                        {info.isPlusing && (
                                            <div style={{
                                                position: 'absolute', top: '-4px', right: '-4px',
                                                width: '12px', height: '12px', background: info.color,
                                                borderRadius: '50%', border: '2px solid white'
                                            }} />
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <h3 style={{
                                                margin: '0 0 2px', fontSize: '1rem', fontWeight: '800',
                                                color: rem.status === 'taken' ? 'var(--text-muted)' : 'var(--premium-dark)',
                                                textDecoration: rem.status === 'taken' ? 'line-through' : 'none'
                                            }}>{rem.title}</h3>
                                            {rem.status !== 'taken' && (
                                                <span style={{
                                                    fontSize: '0.6rem', background: info.color, color: 'white',
                                                    padding: '2px 6px', borderRadius: '6px', fontWeight: '900',
                                                    letterSpacing: '0.02em'
                                                }}>{info.label}</span>
                                            )}
                                        </div>
                                        <p style={{
                                            margin: 0, fontSize: '0.8rem',
                                            color: 'var(--text-secondary)',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{
                                                padding: '2px 8px',
                                                background: 'var(--primary-subtle)',
                                                borderRadius: '6px',
                                                fontSize: '0.7rem'
                                            }}>
                                                {new Date(rem.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span style={{ opacity: 0.5 }}>•</span>
                                            <span>{rem.dosage}</span>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggle(rem._id, rem.status)}
                                    className="flex-center"
                                    style={{
                                        width: '64px', height: '40px', borderRadius: '13px',
                                        border: 'none',
                                        background: rem.status === 'taken' ? 'var(--text-muted)' : 'var(--primary)',
                                        color: 'white', cursor: 'pointer', padding: 0,
                                        fontWeight: '800', fontSize: '0.8rem'
                                    }}
                                >
                                    {rem.status === 'taken' ? 'UNDO' : 'DONE'}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default MedicationReminders;
