import React, { useState } from 'react';
import { IconHome, IconRecords, IconProfile, IconStyles } from './Icons';

const RecordsView = ({ documents, onBack, onAdd, onDelete, onNavigate, user }) => {
    const [activeTab, setActiveTab] = useState('records');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            alert("This is a placeholder document.");
        }
    };

    return (
        <div style={{ paddingBottom: '100px', background: 'var(--bg-app)', minHeight: '100vh' }}>
            <header className="premium-header animate-slide-up">
                <div className="h-top">
                    <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>←</button>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Health Records</h3>
                    <label style={{
                        width: '36px', height: '36px', background: 'var(--primary)', color: 'white', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', cursor: 'pointer'
                    }}>
                        <span>+</span>
                        <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                </div>

                <div className="input-premium" style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'white', marginTop: '12px'
                }}>
                    <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by report name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'var(--text-main)' }}
                    />
                </div>
            </header>

            <main style={{ padding: '24px' }}>
                <div className="scroll-area" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredDocs.length > 0 ? filteredDocs.map((doc, i) => (
                        <div key={doc.id} className="premium-card animate-fade" style={{
                            padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', animationDelay: `${i * 0.05}s`
                        }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => openDocument(doc)}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'var(--primary-light)', color: 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                                }}>
                                    <IconRecords active={false} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '4px', color: 'var(--text-main)' }}>{doc.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{doc.date} &bull; {doc.size}</p>
                                </div>
                            </div>
                            <button onClick={() => onDelete(doc.id)} style={{
                                background: 'var(--error-bg)', color: 'var(--error)', border: 'none',
                                width: '36px', height: '36px', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                            }}>
                                🗑️
                            </button>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            <p>No records found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </main>

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

export default RecordsView;
