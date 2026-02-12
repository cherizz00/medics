import React, { useState, useEffect, useRef } from 'react';
import { IconBot, IconSparkles, IconPlus } from './Icons';

const HealthBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        fetchSession();
    }, []);

    const fetchSession = async () => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/symptoms/session', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const session = await response.json();
                setMessages(session.messages || []);
            }
        } catch (err) { console.error(err); }
    };

    const handleSaveAssessment = async (sessionId) => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/symptoms/assessment/assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId })
            });

            if (response.ok) {
                alert('Assessment saved to your Health Vault!');
                fetchSession(); // Refresh to show completed state or clear
            } else {
                alert('Failed to save assessment');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userText = input;

        const tempMsg = { _id: Date.now(), text: userText, sender: 'user' };
        setMessages(prev => [...prev, tempMsg]);
        setInput('');

        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/symptoms/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: userText })
            });

            if (response.ok) {
                const session = await response.json();
                setMessages(session.messages);

                if (session.risk_score > 0 && session.status === 'active') {
                    setMessages(prev => [...prev, {
                        _id: 'save-trigger',
                        sender: 'bot',
                        text: "Would you like to save this assessment to your Health Vault for future reference?",
                        isAction: true,
                        sessionId: session._id
                    }]);
                }

            } else {
                setMessages(prev => [...prev, { _id: Date.now(), text: "I'm having trouble connecting right now. Please try again later.", sender: 'bot' }]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="medical-card animate-fade" style={{ height: '480px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: 'none', background: 'white', boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1)' }}>
            <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="holographic-glow" style={{ opacity: 0.3 }} />
                <div className="flex-center" style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', position: 'relative', zIndex: 1 }}>
                    <IconBot />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'white' }}>Dr. Coach AI</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '6px', height: '6px', background: '#34D399', borderRadius: '50%', boxShadow: '0 0 8px #34D399' }} />
                        <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.9 }}>Always Active</p>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#F8FAFC' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.5 }}>
                        <div className="flex-center" style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--primary)' }}>
                            <IconSparkles />
                        </div>
                        <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Hello! I'm your AI health assistant. <br /> How can I help you today?</p>
                    </div>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className="animate-fade" style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.sender === 'user' ? 'var(--primary)' : 'white',
                        color: msg.sender === 'user' ? 'white' : 'var(--text-main)',
                        padding: '12px 16px',
                        borderRadius: '18px',
                        borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                        borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px',
                        maxWidth: '85%',
                        whiteSpace: 'pre-wrap',
                        fontSize: '0.88rem',
                        boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 2px 8px rgba(0,0,0,0.04)',
                        border: msg.sender === 'user' ? 'none' : '1px solid var(--border)',
                        lineHeight: '1.5'
                    }}>
                        {msg.text}
                        {msg.isAction && (
                            <button
                                onClick={() => handleSaveAssessment(msg.sessionId)}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '10px', fontSize: '0.75rem', marginTop: '12px', background: 'white', color: 'var(--primary)', border: '1px solid var(--primary)' }}
                            >
                                SAVE TO VAULT
                            </button>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '16px', background: 'white', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Describe your symptoms..."
                    className="input-field"
                    style={{ flex: 1, padding: '12px 20px', borderRadius: '14px', background: '#F1F5F9', border: 'none' }}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="btn btn-primary flex-center"
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        padding: 0,
                        minWidth: '48px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                >
                    <IconSparkles />
                </button>
            </div>
        </div>
    );
};

export default HealthBot;
