import React, { useState } from 'react';
import { IconHome, IconRecords, IconProfile, IconStyles } from './Icons';

const RecordsView = ({ documents, onBack, onAdd, onDelete, onNavigate, user }) => {
    const [activeTab, setActiveTab] = useState('records');
    const [searchQuery, setSearchQuery] = useState('');

    const userInitials = (user && user.name) ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'G';

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
        <div className="records-root-p">
            <IconStyles />
            <header className="premium-header">
                <div className="h-top">
                    <button onClick={onBack} className="r-back">←</button>
                    <h3>Health Records</h3>
                    <label className="r-add-btn">
                        <span>+</span>
                        <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                    </label>
                </div>

                <div className="search-premium animate-fade">
                    <div className="search-inner glass">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by report name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <main className="dash-main-p">

                <div className="r-list-p scroll-area">
                    {filteredDocs.length > 0 ? filteredDocs.map((doc, i) => (
                        <div key={doc.id} className="r-card-p animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="r-main-content-p" style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }} onClick={() => openDocument(doc)}>
                                <div className="r-icon-p">
                                    <IconRecords active={false} />
                                </div>
                                <div className="r-text-p">
                                    <h4>{doc.title}</h4>
                                    <p>{doc.date} &bull; {doc.size}</p>
                                </div>
                            </div>
                            <button className="delete-btn-p" onClick={() => onDelete(doc.id)} style={{ background: '#FFF5F5', color: '#FF5252', border: 'none', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                🗑️
                            </button>
                        </div>
                    )) : (
                        <div className="no-records" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
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
                        <span className="n-icon">{tab.icon}</span>
                        <span className="n-label">{tab.label}</span>
                    </div>
                ))}
            </nav>

            <style dangerouslySetInnerHTML={{
                __html: `
                .records-root-p { background: var(--bg-primary); height: 100vh; display: flex; flex-direction: column; overflow: hidden; position: relative; }
                
                .premium-header { 
                    flex-shrink: 0;
                    background: white; 
                    padding: 40px 24px 20px 24px; 
                    position: relative;
                    z-index: 20;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }
                .h-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .r-back { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-header); display: flex; align-items: center; padding: 0; }
                .premium-header h3 { font-size: 20px; font-weight: 700; color: var(--text-header); margin: 0; }
                .r-add-btn { width: 36px; height: 36px; background: var(--primary); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; font-weight: 600; }

                .search-premium { margin-top: 24px; }
                .search-inner { background: var(--bg-secondary); border: 1px solid var(--border); padding: 14px 20px; border-radius: 24px; display: flex; align-items: center; gap: 12px; }
                .search-inner input { background: none; border: none; outline: none; color: var(--text-header); flex: 1; font-size: 15px; }
                .search-inner input::placeholder { color: var(--text-muted); }
                .search-inner span { font-size: 18px; opacity: 0.5; }

                .dash-main-p { flex: 1; overflow-y: auto; padding: 24px; padding-bottom: 120px; position: relative; z-index: 10; }
                .dash-main-p::-webkit-scrollbar { display: none; }
                
                .r-list-p { display: flex; flex-direction: column; gap: 16px; }
                .r-card-p { 
                    padding: 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; 
                    background: white; border: 1px solid var(--border); border-radius: 20px;
                    transition: var(--transition);
                }
                .r-card-p:active { transform: scale(0.98); border-color: var(--primary); }
                .r-icon-p { width: 48px; height: 48px; background: var(--bg-secondary); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .r-text-p { flex: 1; }
                .r-text-p h4 { font-size: 16px; font-weight: 600; color: var(--text-header); margin-bottom: 4px; }
                .r-text-p p { font-size: 13px; color: var(--text-body); }
                .r-arrow { font-size: 24px; color: var(--text-muted); }

                .bottom-nav-p { 
                    position: fixed; bottom: 0; left: 0; right: 0; height: 80px; 
                    display: flex; justify-content: space-around; align-items: center;
                    background: white; border-top: 1px solid var(--border); z-index: 1000;
                    padding: 0 20px;
                }
                .nav-item-p { 
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    color: var(--text-muted); cursor: pointer; transition: var(--transition); flex: 1;
                }
                .nav-item-p.active { color: var(--primary); }
                .n-icon { font-size: 24px; margin-bottom: 4px; }
                .n-label { font-size: 11px; font-weight: 600; }
                * { -webkit-tap-highlight-color: transparent; user-select: none; }
                input { user-select: text; }
      `}} />
        </div >
    );
};

export default RecordsView;
