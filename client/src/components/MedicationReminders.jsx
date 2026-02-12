import React, { useState, useEffect } from 'react';
import { IconPlus, IconCheck, IconMedicine, IconPremium } from './Icons';

const MedicationReminders = ({ isPremium, onUpgrade }) => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [newMed, setNewMed] = useState({ title: '', dosage: '', time: '', type: 'medication' });

    useEffect(() => {
        fetchReminders();
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

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!isPremium) {
            onUpgrade();
            return;
        }

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
                alert('Failed to add reminder.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'taken' ? 'pending' : 'taken';
            const token = localStorage.getItem('medics_token');
            const response = await fetch(`/api/reminders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchReminders();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="animate-fade" style={{ marginBottom: '24px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--premium-dark)' }}>Daily Medications</h3>
                <button onClick={() => setShowAdd(!showAdd)} className="btn-ghost flex-center" style={{
                    width: '36px', height: '36px', borderRadius: '12px', padding: 0, background: 'var(--primary-subtle)', color: 'var(--primary)'
                }}>
                    <IconPlus />
                </button>
            </div>

            {showAdd && (
                <form onSubmit={handleAdd} className="medical-card animate-fade" style={{ marginBottom: '24px', border: '1px solid var(--primary-subtle)', background: 'white' }}>
                    {!isPremium && (
                        <div style={{ marginBottom: '16px', background: 'var(--premium-gold)', color: 'white', padding: '12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconPremium size={16} />
                            <span>Pro Subscription Required</span>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            type="text" placeholder="Medicine Name (e.g. Paracetamol)" required className="input-field"
                            value={newMed.title} onChange={e => setNewMed({ ...newMed, title: e.target.value })}
                            style={{ borderRadius: '12px' }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text" placeholder="Dosage (e.g. 500mg)" className="input-field"
                                value={newMed.dosage} onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                                style={{ borderRadius: '12px' }}
                            />
                            <input
                                type="time" required className="input-field"
                                value={newMed.time} onChange={e => setNewMed({ ...newMed, time: e.target.value })}
                                style={{ borderRadius: '12px' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px', fontWeight: '900', borderRadius: '14px' }}>
                            {isPremium ? 'Set Reminder' : 'Upgrade to Set Reminders'}
                        </button>
                    </div>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reminders.length === 0 ? (
                    <div className="medical-card" style={{ textAlign: 'center', color: 'var(--text-muted)', borderStyle: 'dashed', padding: '32px 24px', borderRadius: '16px' }}>
                        <div className="flex-center" style={{ width: '48px', height: '48px', margin: '0 auto 12px', opacity: 0.3 }}>
                            <IconMedicine size={32} />
                        </div>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>No meds scheduled for today.</p>
                    </div>
                ) : (
                    reminders.map(rem => (
                        <div key={rem._id} className="medical-card flex-between" style={{
                            padding: '16px',
                            background: rem.status === 'taken' ? 'var(--bg-app)' : 'white',
                            opacity: rem.status === 'taken' ? 0.7 : 1,
                            borderColor: rem.status === 'taken' ? 'transparent' : 'var(--border)',
                            borderRadius: '16px',
                            boxShadow: rem.status === 'taken' ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="flex-center" style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: rem.status === 'taken' ? 'var(--primary)' : 'var(--primary-subtle)',
                                    color: rem.status === 'taken' ? 'white' : 'var(--primary)',
                                }}><IconMedicine size={24} /></div>
                                <div>
                                    <h4 style={{
                                        margin: '0 0 2px', fontSize: '1rem', fontWeight: '800',
                                        textDecoration: rem.status === 'taken' ? 'line-through' : 'none',
                                        color: 'var(--premium-dark)'
                                    }}>{rem.title}</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                        {new Date(rem.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {rem.dosage}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle(rem._id, rem.status)}
                                className="flex-center animate-pop"
                                style={{
                                    width: '36px', height: '36px', borderRadius: '12px',
                                    border: rem.status === 'taken' ? 'none' : '2.5px solid var(--primary-subtle)',
                                    background: rem.status === 'taken' ? 'var(--primary)' : 'transparent',
                                    color: 'white', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease'
                                }}
                            >
                                {rem.status === 'taken' ? <IconCheck size={20} /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-subtle)' }} />}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default MedicationReminders;
