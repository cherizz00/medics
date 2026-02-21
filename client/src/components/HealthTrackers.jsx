import React, { useState } from 'react';
import { IconHeart, IconPlus, IconFlask, IconThermometer } from './Icons';
import HeartRateMonitor from './HeartRateMonitor';


const HealthTrackers = ({ onAddVital, onNavigate }) => {
    return (
        <div id="health-trackers">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '16px', color: 'var(--premium-dark)' }}>Health Trackers</h3>
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
                    <div style={{ position: 'absolute', bottom: '40px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', opacity: 0.1, zIndex: 0 }}>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                            <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '8px', height: `${20 + Math.random() * 40}px`, background: 'var(--primary)', borderRadius: '4px' }}></div>
                                <span style={{ fontSize: '10px', fontWeight: '800' }}>{day}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#CBD5E1' }}>Ready to Measure</span>
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
                        onClick={() => onNavigate('heartrate')}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', borderRadius: '10px', height: 'auto' }}
                    >
                        Measure
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HealthTrackers;
