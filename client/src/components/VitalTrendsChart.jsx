import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PremiumLock from './common/PremiumLock';
import { IconActivity, IconSparkles } from './Icons';

const VitalTrendsChart = ({ isPremium, onUpgrade, data }) => {
    const chartData = data && data.length > 0 ? data : [
        { name: 'Mon', value: 72 },
        { name: 'Tue', value: 75 },
        { name: 'Wed', value: 71 },
        { name: 'Thu', value: 73 },
        { name: 'Fri', value: 78 },
        { name: 'Sat', value: 74 },
        { name: 'Sun', value: 76 },
    ];

    return (
        <section className="anim-slide-up" style={{ animationDelay: '0.2s', marginBottom: '32px' }}>
            <div className="flex-between" style={{ marginBottom: '16px', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="flex-center" style={{ width: '32px', height: '32px', background: 'var(--primary-subtle)', borderRadius: '10px', color: 'var(--primary)' }}>
                        <IconActivity size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: 'var(--premium-dark)' }}>Pulse Intelligence</h3>
                </div>
                {isPremium && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--premium-gold)', fontSize: '0.75rem', fontWeight: '800' }}>
                        <IconSparkles size={14} /> LIVE ANALYTICS
                    </div>
                )}
            </div>

            <div className="medical-card" style={{ padding: '24px', background: 'white', height: '320px', borderRadius: '28px', border: '1px solid #F1F5F9', position: 'relative', overflow: 'hidden' }}>
                <div className="holographic-glow" style={{ opacity: 0.03 }} />

                <PremiumLock isPremium={isPremium} title="Advanced Pulse Analytics" onUpgrade={onUpgrade}>
                    <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: '700' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: '700' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid #F1F5F9',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                        background: 'rgba(255,255,255,0.95)',
                                        backdropFilter: 'blur(10px)',
                                        padding: '12px 16px',
                                        fontWeight: '800'
                                    }}
                                    itemStyle={{ color: 'var(--primary)', fontSize: '0.9rem' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="var(--primary)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorPulse)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </PremiumLock>
            </div>

            {!isPremium && (
                <div style={{ marginTop: '12px', padding: '0 8px', display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600' }}>
                    <span>Showing basic weekly overview</span>
                    <span style={{ opacity: 0.3 }}>•</span>
                    <span style={{ color: 'var(--primary)' }}>Upgrade for daily insights</span>
                </div>
            )}
        </section>
    );
};

export default VitalTrendsChart;
