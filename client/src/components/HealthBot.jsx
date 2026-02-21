import React, { useState, useEffect, useRef } from 'react';
import { IconBot, IconSparkles, IconPlus, IconClose } from './Icons';

/* ─── Inline Icons ─── */
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);
const MicIcon = ({ active }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#EF4444' : 'none'} stroke={active ? '#EF4444' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="1" width="6" height="11" rx="3" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
    </svg>
);
const AttachIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.49" />
    </svg>
);
const HeartPulseIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
        <polyline points="3 12 8 12 10 8 14 16 16 12 21 12" stroke="#818CF8" strokeWidth="1.5" />
    </svg>
);

/* ─── Suggestion Chips ─── */
const suggestions = [
    { emoji: '🩺', text: 'Check symptoms' },
    { emoji: '💊', text: 'Medicine info' },
    { emoji: '🏃', text: 'Fitness advice' },
    { emoji: '🧘', text: 'Mental wellness' },
];

const HealthBot = ({ onNavigate, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);

    /* ─── Speech Recognition Setup ─── */
    const toggleListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in this browser. Please use Chrome.');
            return;
        }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false;
        recognitionRef.current = recognition;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setInput(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            const container = messagesEndRef.current.parentNode;
            if (container) container.scrollTop = container.scrollHeight;
        }
    };

    useEffect(() => { setTimeout(scrollToBottom, 100); }, [messages, isTyping]);
    useEffect(() => { fetchSession(); }, []);

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

    const handleBookAppointment = async (doctor) => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/consultancy/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ doctorName: doctor.name, specialty: doctor.specialty })
            });
            if (response.ok) {
                setMessages(prev => [...prev, {
                    _id: Date.now(),
                    text: `✅ **Appointment Booked!** \n\nYou're all set with ${doctor.name}. I've added this to your calendar.`,
                    sender: 'bot', isSuccess: true
                }]);
            }
        } catch (err) { console.error(err); }
    };

    const handleSaveAssessment = async (sessionId) => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/symptoms/assessment/assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ sessionId })
            });
            if (response.ok) { alert('Assessment saved to your Health Vault!'); fetchSession(); }
            else { alert('Failed to save assessment'); }
        } catch (err) { console.error(err); }
    };

    const handleSend = async (overrideText) => {
        const userText = overrideText || input.trim();
        if (!userText) return;

        setMessages(prev => [...prev, { _id: Date.now(), text: userText, sender: 'user' }]);
        setInput('');
        setIsTyping(true);

        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/symptoms/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ text: userText })
            });

            if (response.ok) {
                const session = await response.json();
                setMessages(session.messages);

                let extraMessages = [];
                if (session.messages.length > 0) {
                    const lastBotMsg = session.messages[session.messages.length - 1];
                    const hasRisk = lastBotMsg.metadata && (lastBotMsg.metadata.riskScore >= 20 || lastBotMsg.metadata.symptom_detected);

                    if (hasRisk && session.status === 'active') {
                        extraMessages.push({
                            _id: 'save-trigger', sender: 'bot',
                            text: "Would you like to save this assessment to your Health Vault?",
                            isAction: true, sessionId: session._id
                        });
                    }
                    if (lastBotMsg.metadata && (lastBotMsg.metadata.riskScore >= 60 || lastBotMsg.metadata.booking_intent)) {
                        extraMessages.push({
                            _id: 'consult-trigger', sender: 'bot',
                            text: lastBotMsg.metadata.booking_intent
                                ? "I've found specialists in your area. Would you like to see available slots?"
                                : "Your symptoms suggest consulting a professional. I recommend booking an appointment.",
                            isConsultAction: true
                        });
                    }
                }
                if (extraMessages.length > 0) setMessages(prev => [...prev, ...extraMessages]);
            } else {
                setMessages(prev => [...prev, { _id: Date.now(), text: "I'm having trouble connecting. Please try again.", sender: 'bot' }]);
            }
        } catch (err) { console.error(err); }
        finally { setIsTyping(false); }
    };

    const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            background: '#F7F8FA', overflow: 'hidden',
        }}>
            {/* ─── Header ─── */}
            <div style={{
                padding: '14px 16px',
                background: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', gap: '12px',
                flexShrink: 0,
            }}>
                <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A55A2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <circle cx="12" cy="5" r="3" />
                        <path d="M12 8v3" />
                        <circle cx="8.5" cy="16" r="1.5" fill="#4A55A2" />
                        <circle cx="15.5" cy="16" r="1.5" fill="#4A55A2" />
                    </svg>
                    <div style={{
                        width: '10px', height: '10px',
                        background: '#22C55E', borderRadius: '50%',
                        border: '2px solid white',
                        position: 'absolute', bottom: '-1px', right: '-1px',
                    }} />
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1F2937' }}>
                        Dr. Coach AI
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#22C55E', fontWeight: '600' }}>
                        Online • Ready to help
                    </span>
                </div>
                {onClose && (
                    <button onClick={onClose} style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.06)', background: 'white',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#6B7280',
                    }}>
                        <IconClose size={18} />
                    </button>
                )}
            </div>

            {/* ─── Messages Area ─── */}
            <div style={{
                flex: 1, overflowY: 'auto', padding: '20px 16px',
                display: 'flex', flexDirection: 'column', gap: '12px',
                minHeight: 0,
            }}>
                {/* Empty State */}
                {messages.length === 0 && (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', flex: 1, padding: '20px',
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '24px',
                            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '20px',
                            boxShadow: '0 8px 24px rgba(99,102,241,0.1)',
                        }}>
                            <HeartPulseIcon />
                        </div>
                        <h3 style={{
                            fontSize: '1.15rem', fontWeight: '700', color: '#1F2937',
                            marginBottom: '6px', textAlign: 'center',
                        }}>
                            Hi, I'm Dr. Coach AI
                        </h3>
                        <p style={{
                            fontSize: '0.82rem', color: '#6B7280', textAlign: 'center',
                            lineHeight: '1.5', maxWidth: '280px', marginBottom: '28px',
                        }}>
                            Your personal health assistant. I can analyze symptoms, provide health insights, and connect you with doctors.
                        </p>

                        {/* Suggestion Chips */}
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: '8px',
                            justifyContent: 'center', maxWidth: '320px',
                        }}>
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(s.text)}
                                    style={{
                                        padding: '10px 16px',
                                        background: 'white',
                                        border: '1px solid rgba(0,0,0,0.08)',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontSize: '0.78rem',
                                        fontWeight: '500',
                                        color: '#374151',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                    }}
                                >
                                    <span>{s.emoji}</span> {s.text}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat Messages */}
                {messages.map((msg, i) => {
                    const isUser = msg.sender === 'user';
                    const isCritical = msg.metadata?.riskLevel === 'critical';

                    return (
                        <div key={msg._id || i} style={{
                            display: 'flex',
                            flexDirection: isUser ? 'row-reverse' : 'row',
                            gap: '8px',
                            alignItems: 'flex-end',
                        }}>
                            {/* Avatar */}
                            {!isUser && (
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A55A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="10" rx="2" />
                                        <circle cx="12" cy="5" r="3" />
                                        <path d="M12 8v3" />
                                    </svg>
                                </div>
                            )}

                            {/* Bubble */}
                            <div style={{
                                maxWidth: '78%',
                                padding: '12px 16px',
                                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                background: isUser
                                    ? 'linear-gradient(135deg, #4A55A2, #6366F1)'
                                    : msg.isSuccess ? '#ECFDF5' : isCritical ? '#FEF2F2' : 'white',
                                color: isUser ? 'white' : '#1F2937',
                                fontSize: '0.86rem',
                                lineHeight: '1.55',
                                whiteSpace: 'pre-wrap',
                                boxShadow: isUser
                                    ? '0 4px 14px rgba(74,85,162,0.25)'
                                    : '0 1px 4px rgba(0,0,0,0.04)',
                                border: isUser ? 'none'
                                    : msg.isSuccess ? '1px solid #A7F3D0'
                                        : isCritical ? '1px solid #FECACA'
                                            : '1px solid rgba(0,0,0,0.05)',
                            }}>
                                {msg.text}

                                {/* Doctor Card */}
                                {msg.metadata?.recommended_doctor && (
                                    <div style={{
                                        marginTop: '12px', padding: '12px', borderRadius: '14px',
                                        background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.06)',
                                    }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <img src={msg.metadata.recommended_doctor.image}
                                                alt={msg.metadata.recommended_doctor.name}
                                                style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: '700' }}>{msg.metadata.recommended_doctor.name}</h5>
                                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#4A55A2', fontWeight: '600' }}>{msg.metadata.recommended_doctor.specialty}</p>
                                                <p style={{ margin: 0, fontSize: '0.68rem', color: '#9CA3AF' }}>{msg.metadata.recommended_doctor.distance} away</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleBookAppointment(msg.metadata.recommended_doctor)}
                                            style={{
                                                width: '100%', padding: '10px', marginTop: '10px',
                                                borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                fontSize: '0.76rem', fontWeight: '700',
                                                background: isCritical ? '#EF4444' : '#4A55A2',
                                                color: 'white',
                                            }}
                                        >
                                            {isCritical ? '🆘 CALL AMBULANCE' : '📅 CONFIRM BOOKING'}
                                        </button>
                                    </div>
                                )}

                                {/* Critical Actions */}
                                {isCritical && (
                                    <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                                        <button style={{
                                            flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                                            background: '#EF4444', color: 'white', fontSize: '0.72rem',
                                            fontWeight: '700', cursor: 'pointer',
                                        }}>🚑 SOS</button>
                                        <button style={{
                                            flex: 1, padding: '10px', borderRadius: '10px',
                                            border: '1px solid #EF4444', background: 'white',
                                            color: '#EF4444', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer',
                                        }}>📍 NEARBY ER</button>
                                    </div>
                                )}

                                {/* Save Action */}
                                {msg.isAction && (
                                    <button onClick={() => handleSaveAssessment(msg.sessionId)}
                                        style={{
                                            width: '100%', padding: '10px', marginTop: '10px',
                                            borderRadius: '10px', border: '1px solid #4A55A2',
                                            background: 'rgba(74,85,162,0.05)', color: '#4A55A2',
                                            fontSize: '0.76rem', fontWeight: '700', cursor: 'pointer',
                                        }}
                                    >
                                        💾 Save to Vault
                                    </button>
                                )}

                                {/* Consult Action */}
                                {msg.isConsultAction && (
                                    <button onClick={() => { if (onClose) onClose(); if (onNavigate) onNavigate('consultancy'); }}
                                        style={{
                                            width: '100%', padding: '10px', marginTop: '10px',
                                            borderRadius: '10px', border: '1px solid #4A55A2',
                                            background: 'rgba(74,85,162,0.05)', color: '#4A55A2',
                                            fontSize: '0.76rem', fontWeight: '700', cursor: 'pointer',
                                        }}
                                    >
                                        🏥 Find Nearby Doctors
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                    <div style={{
                        display: 'flex', gap: '8px', alignItems: 'flex-end',
                    }}>
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A55A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="10" rx="2" />
                                <circle cx="12" cy="5" r="3" /><path d="M12 8v3" />
                            </svg>
                        </div>
                        <div style={{
                            padding: '14px 20px', borderRadius: '18px 18px 18px 4px',
                            background: 'white', border: '1px solid rgba(0,0,0,0.05)',
                            display: 'flex', gap: '5px', alignItems: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: '7px', height: '7px', borderRadius: '50%',
                                    background: '#9CA3AF',
                                    animation: `botPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                                }} />
                            ))}
                            <style>{`
                                @keyframes botPulse {
                                    0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
                                    30% { opacity: 1; transform: scale(1.1); }
                                }
                            `}</style>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ─── Input Area ─── */}
            <div style={{
                padding: '12px 16px calc(14px + env(safe-area-inset-bottom, 0px))',
                background: 'white',
                borderTop: '1px solid rgba(0,0,0,0.06)',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#F3F4F6', borderRadius: '16px',
                    padding: '4px 4px 4px 16px',
                }}>
                    <button onClick={() => { }} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '6px', display: 'flex', alignItems: 'center',
                        flexShrink: 0,
                    }}>
                        <AttachIcon />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        style={{
                            flex: 1, background: 'none', border: 'none', outline: 'none',
                            fontSize: '0.88rem', fontWeight: '400', color: '#1F2937',
                            padding: '10px 0',
                        }}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                    />
                    {input.trim() ? (
                        <button onClick={() => handleSend()} style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            border: 'none', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #4A55A2, #6366F1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(74,85,162,0.3)',
                            flexShrink: 0,
                            transition: 'all 0.2s',
                        }}>
                            <SendIcon />
                        </button>
                    ) : (
                        <button onClick={toggleListening} style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            border: 'none', cursor: 'pointer',
                            background: isListening ? 'rgba(239,68,68,0.1)' : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            position: 'relative',
                            transition: 'all 0.2s',
                        }}>
                            <MicIcon active={isListening} />
                            {isListening && (
                                <div style={{
                                    position: 'absolute', inset: '0',
                                    borderRadius: '12px',
                                    border: '2px solid #EF4444',
                                    animation: 'micPulse 1.5s ease-in-out infinite',
                                }} />
                            )}
                            <style>{`
                                @keyframes micPulse {
                                    0%, 100% { opacity: 1; transform: scale(1); }
                                    50% { opacity: 0.4; transform: scale(1.15); }
                                }
                            `}</style>
                        </button>
                    )}
                </div>
                <p style={{
                    textAlign: 'center', fontSize: '0.62rem', color: '#D1D5DB',
                    margin: '8px 0 0', fontWeight: '400',
                }}>
                    Powered by Medics AI • Not a substitute for professional diagnosis
                </p>
            </div>
        </div>
    );
};

export default HealthBot;
