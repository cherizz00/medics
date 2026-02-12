import React, { useState, useEffect } from 'react';
import { IconInsurance, IconLock, IconCheck, IconClose, IconAlert, IconChevronLeft } from './Icons';

const InsuranceView = ({ onBack }) => {
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInsight();
    }, []);

    const fetchInsight = async () => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/insurance', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setInsight(data);
            }
        } catch (err) { console.error(err); }
    };

    const handleAnalyze = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('policy', file);

        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/insurance/analyze', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setInsight(data);
            } else {
                alert('Analysis failed');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ background: 'var(--bg-app)', padding: '0 20px' }}>
            <header className="animate-fade" style={{ padding: '20px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0 }}>
                    <IconChevronLeft />
                </button>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: 'var(--premium-dark)' }}>Insurance Insights</h3>
            </header>

            <main className="scroll-content animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '120px' }}>
                {/* Premium Hero Card */}
                <div className="medical-card" style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: 'white', textAlign: 'left', padding: '32px 24px', border: 'none',
                    boxShadow: '0 12px 24px rgba(80, 66, 189, 0.2)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div className="holographic-glow" opacity="0.2" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                        <div className="flex-center" style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px' }}>
                            <IconInsurance size={24} />
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: '900', background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '99px', letterSpacing: '1px' }}>AI ANALYTICS</span>
                    </div>

                    <h4 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: '900', color: 'white', position: 'relative', zIndex: 1 }}>Smart Coverage Analysis</h4>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '28px', lineHeight: '1.5', position: 'relative', zIndex: 1 }}>Upload your insurance policy and let our AI extract benefits and identify hidden gaps.</p>

                    {!insight && !loading && (
                        <label className="btn" style={{
                            background: 'white', color: 'var(--primary)', display: 'inline-flex',
                            cursor: 'pointer', padding: '0 24px', height: '48px', alignItems: 'center',
                            borderRadius: '14px', fontWeight: '800', fontSize: '0.9rem', width: '100%', justifyContent: 'center',
                            position: 'relative', zIndex: 1
                        }}>
                            Upload Policy (PDF)
                            <input type="file" accept=".pdf" hidden onChange={handleAnalyze} />
                        </label>
                    )}
                    {loading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', position: 'relative', zIndex: 1 }}>
                            <div className="spin" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div>
                            Analyzing Benefits...
                        </div>
                    )}
                </div>

                {insight && (
                    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="medical-card" style={{ background: 'white', padding: '24px' }}>
                            <div className="flex-between" style={{ marginBottom: '20px' }}>
                                <div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Policy Provider</span>
                                    <h2 style={{ margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '900', color: 'var(--premium-dark)' }}>{insight.provider}</h2>
                                    <p style={{ color: 'var(--primary)', margin: '4px 0 0', fontSize: '0.85rem', fontWeight: '700' }}>{insight.policy_number}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Sum Insured</span>
                                    <span style={{ fontSize: '1.4rem', fontWeight: '950', color: 'var(--premium-dark)' }}>${insight.coverage_limit.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Gaps detected - Warning Banner Style */}
                        {insight.gaps && insight.gaps.length > 0 && (
                            <div className="medical-card" style={{ background: '#FFF7ED', border: '1px solid #FED7AA', padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9A3412', marginBottom: '12px' }}>
                                    <IconAlert size={20} />
                                    <h4 style={{ margin: 0, fontWeight: '900', fontSize: '1rem' }}>Coverage Gaps</h4>
                                </div>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#7C2D12', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '600' }}>
                                    {insight.gaps.map((gap, i) => <li key={i}>{gap}</li>)}
                                </ul>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            <div className="medical-card" style={{ padding: '24px', background: 'white' }}>
                                <h4 style={{ color: 'var(--success)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', fontSize: '1rem' }}>
                                    <div className="flex-center" style={{ width: '28px', height: '28px', background: '#DCFCE7', borderRadius: '8px', color: '#166534' }}>
                                        <IconCheck size={16} />
                                    </div>
                                    <span>Included Benefits</span>
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                    {insight.covered_items.map((item, i) => (
                                        <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700', padding: '8px 12px', background: 'var(--bg-app)', borderRadius: '10px' }}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="medical-card" style={{ padding: '24px', background: 'white' }}>
                                <h4 style={{ color: 'var(--error)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', fontSize: '1rem' }}>
                                    <div className="flex-center" style={{ width: '28px', height: '28px', background: '#FEE2E2', borderRadius: '8px', color: '#B91C1C' }}>
                                        <IconClose size={16} />
                                    </div>
                                    <span>Policy Exclusions</span>
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                    {insight.not_covered_items.map((item, i) => (
                                        <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700', padding: '8px 12px', background: 'var(--bg-app)', borderRadius: '10px' }}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setInsight(null)} className="btn btn-ghost" style={{
                            margin: '8px 0', width: '100%', height: '52px', fontWeight: '800', color: 'var(--text-muted)'
                        }}>Re-analyze Policy</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InsuranceView;
