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
        const url = doc.fileUrl || doc.url;
        if (url) {
            const newWindow = window.open();
            if (newWindow) {
                newWindow.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
            } else {
                alert("Please allow popups to view documents.");
            }
        } else {
            alert("This document cannot be opened at the moment.");
        }
    };


    const IconStyles = () => null; // Icons are now global or handled via components, keeping for structure if needed but empty

    return (
        <div className="page-container">
            <header className="premium-header anim-slide-up" style={{ flexShrink: 0 }}>

                <div className="h-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>📍</span> Mumbai Central
                    </div>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '14px', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)',
                        fontSize: '1.25rem'
                    }}>
                        🔔
                    </div>
                </div>

                <div onClick={() => onNavigate('profile')} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                    marginTop: '8px', marginBottom: '20px', gap: '16px'
                }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Welcome back,</p>
                        <h3 style={{
                            fontSize: '1.75rem', color: 'var(--text-main)', margin: '4px 0',
                            letterSpacing: '-0.03em', overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>{userName}</h3>
                    </div>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '20px',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.25rem', fontWeight: '800', boxShadow: 'var(--shadow-lg)',
                        flexShrink: 0
                    }}>
                        {userInitials}
                    </div>
                </div>


                <div className="input-premium" style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>🔍</span>
                        <input type="text" placeholder="Search doctors, meds, reports..." style={{
                            border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'var(--text-main)', background: 'transparent'
                        }} />
                    </div>
                </div>
            </header>

            <main className="scroll-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>



                <section className="premium-card anim-slide-up" style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    color: 'white', padding: '24px', position: 'relative', overflow: 'hidden',
                    border: 'none', flexShrink: 0, animationDelay: '0.1s'
                }} onClick={() => fileInputRef.current.click()}>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{
                            width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)',
                            borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.5rem', marginBottom: '16px'
                        }}>📄</div>
                        <h4 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '4px' }}>Upload Health Vault</h4>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Store your reports in a secure encrypted vault
                        </p>
                        <button style={{
                            background: 'white', color: 'var(--primary)', border: 'none',
                            padding: '12px 24px', borderRadius: 'var(--radius-full)', fontWeight: '800',
                            fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>+ Quick Upload</button>
                    </div>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                </section>

                <section className="anim-slide-up" style={{ animationDelay: '0.2s', flexShrink: 0 }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Recent Records</h3>
                        <span onClick={() => onNavigate('records')} style={{
                            color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer'
                        }}>View Vault</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {documents.map((doc, i) => (
                            <div key={doc._id || doc.id || i} className="premium-card" onClick={() => openDocument(doc)} style={{
                                padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer'
                            }}>
                                <div style={{
                                    width: '52px', height: '52px', borderRadius: '14px',
                                    background: i % 2 === 0 ? 'var(--primary-subtle)' : 'var(--accent-light)',
                                    color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                                    flexShrink: 0
                                }}>
                                    {i % 2 === 0 ? '📄' : '📜'}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{
                                        fontSize: '1rem', marginBottom: '4px', fontWeight: '700',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>{doc.title}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : (doc.date || 'Today')} &bull; {doc.size || '0.0 MB'}
                                    </p>
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '1.5rem', flexShrink: 0 }}>&rsaquo;</div>

                            </div>
                        ))}

                    </div>
                </section>




            </main>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

            <nav className="bottom-nav">
                {[
                    { id: 'dashboard', label: 'Home', icon: <IconHome active={activeTab === 'dashboard' || activeTab === 'home'} /> },
                    { id: 'records', label: 'Records', icon: <IconRecords active={activeTab === 'records'} /> },
                    { id: 'profile', label: 'Profile', icon: <IconProfile active={activeTab === 'profile'} /> }
                ].map(tab => (
                    <div
                        key={tab.id}
                        className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
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
