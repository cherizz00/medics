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
        <div className="page-container">

            <IconStyles />
            <header className="premium-header anim-slide-up">
                <div className="h-top" style={{ marginBottom: 0, gap: '16px' }}>
                    <button onClick={onBack} style={{
                        background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
                        width: '36px', height: '36px', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 style={{
                        fontSize: '1.2rem', margin: 0, fontWeight: '800',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
                    }}>Help & Support</h3>
                    <div style={{ width: 36, flexShrink: 0 }}></div>
                </div>
            </header>


            <main className="scroll-content" style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {faqs.map((item, i) => (
                    <div
                        key={i}
                        className="premium-card anim-slide-up"
                        style={{
                            padding: '20px', cursor: 'pointer', animationDelay: `${i * 0.05}s`,
                            background: activeIndex === i ? 'var(--primary-light)' : 'white',
                            borderColor: activeIndex === i ? 'var(--primary)' : 'var(--border-subtle)'
                        }}
                        onClick={() => toggleFAQ(i)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, flex: 1 }}>{item.q}</h4>
                            <span style={{
                                fontSize: '1.5rem', color: activeIndex === i ? 'var(--primary)' : 'var(--text-muted)',
                                transition: '0.3s', transform: activeIndex === i ? 'rotate(90deg)' : 'rotate(0deg)',
                                flexShrink: 0
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
