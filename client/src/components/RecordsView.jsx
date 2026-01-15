import React, { useState } from 'react';
import { IconHome, IconRecords, IconProfile, IconStyles } from './Icons';

const RecordsView = ({ documents, onBack, onAdd, onDelete, onNavigate, user }) => {
    const [activeTab, setActiveTab] = useState('records');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Laboratory', 'Pharmacy', 'Radiology', 'General'];

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory || (selectedCategory === 'Laboratory' && doc.category === 'General');
        return matchesSearch && matchesCategory;
    });

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
            newWindow.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
            alert("This document cannot be opened at the moment.");
        }
    };


    return (
        <div className="page-container">


            <header className="premium-header anim-slide-up" style={{ paddingBottom: '12px' }}>
                <div className="h-top" style={{ marginBottom: '12px', gap: '12px' }}>
                    <button onClick={onBack} style={{
                        background: 'var(--bg-app)', border: '1px solid var(--border-subtle)',
                        width: '36px', height: '36px', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-main)', flexShrink: 0
                    }}>←</button>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '800', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Health Vault</h3>
                    <label style={{
                        width: '36px', height: '36px', background: 'var(--primary)', color: 'white', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(13, 148, 136, 0.3)', flexShrink: 0
                    }}>
                        <span>+</span>
                        <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                </div>


                <div className="input-premium" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'var(--text-main)', background: 'transparent' }}
                        />
                    </div>
                </div>

                <div className="pill-container" style={{ margin: '0 -24px', padding: '0 24px 8px 24px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`pill-tab ${selectedCategory === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <main className="scroll-content">

                <div className="scroll-area" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredDocs.length > 0 ? filteredDocs.map((doc, i) => (
                        <div key={doc._id || doc.id} className="premium-card animate-fade" style={{
                            padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', animationDelay: `${i * 0.05}s`
                        }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => openDocument(doc)}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'var(--primary-light)', color: 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                                    flexShrink: 0
                                }}>
                                    <IconRecords active={false} />
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{
                                        fontSize: '1rem', marginBottom: '4px', color: 'var(--text-main)',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>{doc.title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : doc.date} &bull; {doc.size || '0.0 MB'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => onDelete(doc._id || doc.id)} style={{
                                background: 'var(--error-bg)', color: 'var(--error)', border: 'none',
                                width: '36px', height: '36px', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                flexShrink: 0
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

export default RecordsView;
