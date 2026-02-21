import React, { useState } from 'react';
import {
    IconHome, IconRecords, IconProfile, IconScan,
    IconMedicine, IconSearch, IconChevronLeft, IconSparkles,
    IconLaboratory, IconPrescription, IconScans, IconAssessments,
    IconFileText, IconBot, IconTrash, IconPlus
} from './Icons';
import BottomNavigation from './common/BottomNavigation';

const RecordsView = ({ documents, onBack, onAdd, onDelete, onNavigate, user, familyMembers = [], onTriggerAnalysis }) => {
    const [activeTab, setActiveTab] = useState('records');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');

    const [assessments, setAssessments] = useState([]);

    React.useEffect(() => {
        fetchAssessments();
        const interval = setInterval(fetchAssessments, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAssessments = async () => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/symptoms/assessment/assessment', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setAssessments(await response.json());
            }
        } catch (err) { console.error(err); }
    };

    const categories = [
        { name: 'All', icon: <IconRecords /> },
        { name: 'Laboratory', icon: <IconLaboratory /> },
        { name: 'Prescription', icon: <IconPrescription /> },
        { name: 'Scans', icon: <IconScans /> },
        { name: 'Assessments', icon: <IconAssessments /> },
        { name: 'Insurance', icon: <IconFileText /> },
        { name: 'Vitals', icon: <IconFileText /> },
        { name: 'Other', icon: <IconFileText /> }
    ];
    const [selectedFamily, setSelectedFamily] = useState('All');

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory || (selectedCategory === 'Other' && !['Laboratory', 'Prescription', 'Insurance', 'Scans', 'Vitals', 'Assessments'].includes(doc.category));
        const matchesFamily = selectedFamily === 'All' || (doc.familyMember || 'Myself') === selectedFamily;
        return matchesSearch && matchesCategory && matchesFamily;
    });

    const filteredAssessments = assessments.filter(a => {
        if (selectedCategory !== 'All' && selectedCategory !== 'Assessments') return false;
        return (a.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            onTriggerAnalysis(file);
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB limit.');
                return;
            }
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
            newWindow.document.write(`<iframe src="${url}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`);
        } else {
            alert("This document cannot be opened.");
        }
    };

    return (
        <div className="page-container" style={{ background: 'white' }}>
            <main className="scroll-content hide-scrollbar" style={{ padding: '0 20px 100px' }}>
                <header style={{ padding: '24px 0 0' }}>
                    <div className="flex-between" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0 }}>
                                <IconChevronLeft />
                            </button>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--premium-dark)' }}>Health Vault</h2>
                        </div>
                    </div>

                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Search your records..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field"
                            style={{ paddingLeft: '44px', background: '#F3F4F6', border: 'none', borderRadius: '14px' }}
                        />
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, color: 'var(--primary)' }}>
                            <IconSearch size={20} />
                        </span>
                    </div>

                    <div className="folder-grid">
                        {categories.map(cat => {
                            const isActive = selectedCategory === cat.name;
                            return (
                                <div
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`folder-item ${isActive ? 'active' : ''}`}
                                >
                                    <div className="folder-icon-wrapper">
                                        {cat.icon}
                                    </div>
                                    <span className="folder-label">{cat.name.toUpperCase()}</span>
                                </div>
                            );
                        })}
                    </div>
                </header>

                <div style={{ marginBottom: '24px' }}>
                    <div className="medical-card" style={{ background: 'var(--primary-subtle)', border: '1px solid var(--primary)', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                        <div className="flex-between" style={{ marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <IconSparkles />
                                <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', fontWeight: '800' }}>AI Report Analysis</h4>
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', background: 'white', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--primary)' }}>PREMIUM</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5', position: 'relative', zIndex: 1 }}>
                            Automatically summarize clinical findings and track key biomarkers over time.
                        </p>
                        <button onClick={() => onTriggerAnalysis(filteredDocs[0])} className="btn btn-primary" style={{ width: '100%', height: '44px', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>Analyze Latest</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="flex-between" style={{ padding: '0 4px', marginBottom: '4px' }}>
                        <span className="text-label" style={{ marginBottom: 0 }}>Clinical Records & Assessments</span>
                        <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <IconPlus size={16} /> Add File
                            <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept="image/*,application/pdf" />
                        </label>
                    </div>

                    {filteredAssessments.map((a, i) => (
                        <div key={a._id} className="medical-card" style={{ background: '#f8fafc', borderLeft: `4px solid ${a.risk_level === 'critical' ? 'var(--error)' : a.risk_level === 'high' ? '#f97316' : 'var(--primary)'}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div className="flex-between">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <IconBot />
                                    <h4 style={{ fontWeight: '800', fontSize: '0.95rem' }}>AI Health Assessment</h4>
                                </div>
                                <span style={{
                                    fontSize: '0.65rem', fontWeight: '800', padding: '4px 8px', borderRadius: '6px',
                                    background: a.risk_level === 'critical' ? 'var(--error)' : a.risk_level === 'high' ? '#f97316' : 'var(--primary)',
                                    color: 'white'
                                }}>
                                    {a.risk_level.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(a.createdAt).toLocaleDateString()} • Score: {a.risk_score}/100</p>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
                                <strong>Recommendations:</strong> {a.recommendations.slice(0, 2).join(', ')}...
                            </div>
                        </div>
                    ))}

                    {filteredDocs.length > 0 ? filteredDocs.map((doc, i) => {
                        const Icon = doc.category === 'Laboratory' ? IconLaboratory : doc.category === 'Prescription' ? IconPrescription : doc.category === 'Scans' ? IconScans : IconFileText;
                        const iconClass = doc.category === 'Laboratory' ? 'record-icon-lab' : doc.category === 'Prescription' ? 'record-icon-rx' : doc.category === 'Scans' ? 'record-icon-scan' : 'record-icon-default';

                        return (
                            <div key={doc._id || doc.id} className="medical-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div className="record-item" onClick={() => openDocument(doc)}>
                                    <div className={`record-icon-wrapper ${iconClass}`}>
                                        <Icon />
                                    </div>
                                    <div className="record-info">
                                        <h4 className="record-title">{doc.title}</h4>
                                        <div className="record-subtitle">
                                            <span>{doc.category || 'Record'}</span>
                                            <span>•</span>
                                            <span>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : doc.date}</span>
                                        </div>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(doc._id || doc.id); }} className="btn-ghost flex-center" style={{ width: '36px', height: '36px', borderRadius: '10px', color: 'var(--text-muted)' }}>
                                        <IconTrash size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    }) : (
                        <div style={{ textAlign: 'center', padding: '64px 20px' }}>
                            <div className="flex-center" style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.1, color: 'var(--primary)' }}>
                                <IconRecords />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', fontWeight: '800' }}>No records found</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload your medical reports to keep them safe and accessible.</p>
                        </div>
                    )}
                </div>
            </main>

            <BottomNavigation activeTab="records" onNavigate={onNavigate} />
        </div>
    );
};

export default RecordsView;
