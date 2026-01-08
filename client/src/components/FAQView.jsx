import React, { useState } from 'react';
import { IconStyles } from './Icons';

const FAQView = ({ onBack }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            q: "Is my data secure?",
            a: "Yes. All your medical records are encrypted using military-grade AES-256 encryption. Only you have the private key to access them."
        },
        {
            q: "Who can see my records?",
            a: "By default, only you. You can grant temporary access to doctors or hospitals using the 'Shared Access' feature, which expires automatically."
        },
        {
            q: "How do I upload a prescription?",
            a: "Go to the Dashboard or Records tab, click the '+' button, and take a photo or upload a PDF of your doctor's prescription."
        },
        {
            q: "Can I download my reports by date?",
            a: "Yes. In the 'My Health Vault' section, you can filter documents by date and category, then download them to your device."
        },
        {
            q: "What if I lose my phone?",
            a: "Your data is stored in the cloud, not just on your phone. Simply log in on a new device to access your vault instantly."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
            <IconStyles />
            <header className="premium-header animate-slide-up">
                <div className="h-top">
                    <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Help & Support</h3>
                    <div className="p-bell" style={{ opacity: 0 }}>🔔</div>
                </div>
            </header>

            <main style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {faqs.map((item, i) => (
                    <div
                        key={i}
                        className={`premium-card animate-fade`}
                        style={{
                            padding: '20px', cursor: 'pointer', animationDelay: `${i * 0.05}s`,
                            background: activeIndex === i ? 'var(--bg-secondary)' : 'white',
                            borderColor: activeIndex === i ? 'var(--primary)' : 'var(--border)'
                        }}
                        onClick={() => toggleFAQ(i)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, flex: 1 }}>{item.q}</h4>
                            <span style={{
                                fontSize: '1.5rem', color: activeIndex === i ? 'var(--primary)' : 'var(--text-muted)',
                                transition: '0.3s', transform: activeIndex === i ? 'rotate(90deg)' : 'rotate(0deg)'
                            }}>›</span>
                        </div>
                        {activeIndex === i && (
                            <div className="animate-slide-up" style={{
                                fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: '1.6',
                                marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '12px'
                            }}>
                                {item.a}
                            </div>
                        )}
                    </div>
                ))}
            </main>
        </div>
    );
};

export default FAQView;
