import React, { useState, useEffect, useRef } from 'react';
import { IconHome, IconRecords, IconProfile, IconHospital, IconMedicine, IconLab, IconInsurance, IconQuery, IconStyles } from './Icons';

const Dashboard = ({ onNavigate, documents, onAdd, user }) => {
    const [activeTab, setActiveTab] = useState('home');
    const fileInputRef = useRef(null);

    const userName = (user && user.name) ? user.name : 'Guest User';
    const userInitials = (user && user.name) ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'G';

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newDoc = {
                    id: Date.now(),
                    title: file.name,
                    date: new Date().toISOString().split('T')[0],
                    size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                    category: 'Uploaded',
                    url: event.target.result
                };
                onAdd(newDoc);
            };
            reader.readAsDataURL(file);
        }
    };

    const openDocument = (doc) => {
        if (doc.url) {
            const newWindow = window.open();
            newWindow.document.write(`<iframe src="${doc.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
            alert("This document is a placeholder for the demo.");
        }
    };

    const IconStyles = () => null; // Icons are now global or handled via components, keeping for structure if needed but empty

    return (
        <div style={{ height: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header className="premium-header animate-slide-up" style={{ flexShrink: 0 }}>
                <div className="h-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--primary)' }}>📍</span> Mumbai Central
                    </div>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)'
                    }}>
                        🔔
                    </div>
                </div>

                <div onClick={() => onNavigate('profile')} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                    marginTop: '8px'
                }}>
                    <div>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Welcome back,</p>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: '4px 0' }}>{userName}</h3>
                    </div>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', fontWeight: '700', boxShadow: 'var(--shadow-md)'
                    }}>
                        {userInitials}
                    </div>
                </div>

                <div className="input-premium" style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'white'
                }}>
                    <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>🔍</span>
                    <input type="text" placeholder="Search medical services..." style={{
                        border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'var(--text-main)'
                    }} />
                </div>
            </header>

            <main style={{ flex: 1, overflowY: 'auto', padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                <section className="premium-card animate-fade" style={{
                    background: 'linear-gradient(135deg, var(--secondary) 0%, #4338ca 100%)',
                    color: 'white', padding: '24px', position: 'relative', overflow: 'hidden',
                    border: 'none', flexShrink: 0
                }} onClick={() => fileInputRef.current.click()}>
                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{
                            width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', marginBottom: '16px'
                        }}>📄</div>
                        <h4 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '4px' }}>Upload Records</h4>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Securely store your prescriptions and reports
                        </p>
                        <button style={{
                            background: 'white', color: 'var(--secondary)', border: 'none',
                            padding: '10px 20px', borderRadius: 'var(--radius-full)', fontWeight: '700',
                            fontSize: '0.9rem', cursor: 'pointer'
                        }}>Tap to Upload +</button>
                    </div>
                    {/* Decorative blobs */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ position: 'absolute', bottom: '-40px', left: '40%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                </section>

                <section className="animate-fade" style={{ animationDelay: '0.1s', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Medical Records</h3>
                        <span onClick={() => onNavigate('records')} style={{
                            color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer'
                        }}>See All</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {documents.map((doc, i) => (
                            <div key={i} className="premium-card" onClick={() => openDocument(doc)} style={{
                                padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer'
                            }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'var(--primary-light)', color: 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                }}>
                                    <IconRecords active={false} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{doc.title}</h4>
                                    <p style={{ fontSize: '0.85rem' }}>{doc.date} &bull; {doc.size}</p>
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>&rsaquo;</div>
                            </div>
                        ))}
                    </div>
                </section>



                {/* Spacer for bottom nav */}
                <div style={{ height: '120px', flexShrink: 0 }}></div>
            </main>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

            <nav className="bottom-nav-p">
                {[
                    { id: 'dashboard', label: 'Home', icon: <IconHome active={activeTab === 'dashboard' || activeTab === 'home'} /> },
                    { id: 'records', label: 'Records', icon: <IconRecords active={activeTab === 'records'} /> },
                    { id: 'profile', label: 'Profile', icon: <IconProfile active={activeTab === 'profile'} /> }
                ].map(tab => (
                    <div
                        key={tab.id}
                        className={`nav-item-p ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => { setActiveTab(tab.id); onNavigate(tab.id); }}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </div>
                ))}
            </nav>
        </div>
    );
};


export default Dashboard;
