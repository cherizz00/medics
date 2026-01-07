import React, { useState } from 'react';
import { IconHome, IconRecords, IconProfile, IconStyles } from './Icons';

const RecordsView = ({ documents, onBack, onAdd, onDelete, onNavigate }) => {
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
        <div className="records-root-p">
            <IconStyles />
            <div className="mesh-bg"></div>
            <header className="records-header glass animate-fade">
                <button onClick={onBack} className="r-back">←</button>
                <h2>Health Records</h2>
                <label className="r-add-btn">
                    <span>+</span>
                    <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
            </header>

            <div className="records-body-p">
                <div className="search-bar-p animate-fade">
                    <div className="search-box-p glass">
                        <span>🔍</span>
                        <input
                            type="text"
                            placeholder="Search by report name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="records-list-p scroll-area">
                    {filteredDocs.length > 0 ? filteredDocs.map((doc, i) => (
                        <div key={doc.id} className="record-card-p premium-card animate-fade" style={{ animationDelay: `${i * 0.05}s` }}>
                            <div className="record-main-p" onClick={() => openDocument(doc)}>
                                <div className="record-icon-p">
                                    <IconRecords active={false} />
                                </div>
                                <div className="record-info-p">
                                    <h4>{doc.title}</h4>
                                    <p>{doc.date} &bull; {doc.size}</p>
                                </div>
                            </div>
                            <button className="delete-btn-p" onClick={() => onDelete(doc.id)}>
                                🗑️
                            </button>
                        </div>
                    )) : (
                        <div className="no-records">
                            <p>No records found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </div>

            <nav className="bottom-nav-p glass">
                {[
                    { id: 'dashboard', label: 'Home', icon: <IconHome active={false} /> },
                    { id: 'records', label: 'Records', icon: <IconRecords active={true} /> },
                    { id: 'profile', label: 'Profile', icon: <IconProfile active={false} /> }
                ].map(tab => (
                    <div
                        key={tab.id}
                        className={`nav-item-p ${tab.id === 'records' ? 'active' : ''}`}
                        onClick={() => onNavigate(tab.id)}
                    >
                        <span className="n-icon">{tab.icon}</span>
                        <span className="n-label">{tab.label}</span>
                    </div>
                ))}
            </nav>

            <style dangerouslySetInnerHTML={{
                __html: `
        .records-root-p { height: 100vh; background: var(--apollo-bg); display: flex; flex-direction: column; overflow: hidden; position: relative; }
        .mesh-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--mesh-gradient); z-index: 0; pointer-events: none; }
        
        .records-header { display: flex; align-items: center; justify-content: space-between; padding: 15px 24px; z-index: 100; border-radius: 0 0 24px 24px; background: rgba(255,255,255,0.8); }
        .records-header h2 { font-size: 18px; font-weight: 800; color: var(--apollo-blue); margin: 0; }
        .r-back { background: none; border: none; font-size: 26px; cursor: pointer; color: var(--apollo-blue); display: flex; align-items: center; }
        .r-add-btn { width: 36px; height: 36px; background: var(--apollo-orange); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; cursor: pointer; font-weight: 600; }

        .records-body-p { flex: 1; overflow-y: auto; padding: 24px; padding-bottom: 180px; scrollbar-width: none; position: relative; z-index: 1; -webkit-overflow-scrolling: touch; }
        .records-body-p::-webkit-scrollbar { display: none; }
        
        .search-bar-p { margin-bottom: 24px; }
        .search-box-p { padding: 16px; border-radius: 20px; display: flex; align-items: center; gap: 12px; border: 1px solid var(--apollo-border); }
        .search-box-p input { background: none; border: none; outline: none; color: var(--apollo-blue); flex: 1; font-size: 16px; font-weight: 500; }
        .search-box-p input::placeholder { color: #BBB; }
        
        .records-list-p { display: flex; flex-direction: column; gap: 12px; }
        .record-card-p { 
          padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .record-main-p { display: flex; align-items: center; gap: 12px; flex: 1; cursor: pointer; }
        .record-icon-p { width: 44px; height: 44px; background: #E0F2F1; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .record-info-p h4 { font-size: 15px; font-weight: 700; color: var(--apollo-blue); margin: 0; }
        .record-info-p p { font-size: 12px; color: var(--apollo-text-light); margin: 2px 0 0 0; }
        
        .delete-btn-p { 
          background: #FFF5F5; color: #FF5252; border: none; width: 36px; height: 36px; 
          border-radius: 12px; display: flex; align-items: center; justify-content: center; 
          cursor: pointer; font-size: 16px; transition: transform 0.1s ease;
        }
        .delete-btn-p:active { background: #FFEAEA; transform: scale(0.9); }
        .bottom-nav-p { 
            position: fixed; bottom: 24px; left: 24px; right: 24px; height: 72px; 
            display: flex !important; flex-direction: row !important;
            justify-content: space-around; align-items: center;
            background: rgba(2, 54, 61, 0.9) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 24px; z-index: 1000;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
            padding: 0 10px;
        }
        .nav-item-p { 
            display: flex !important; flex-direction: column !important; 
            align-items: center; justify-content: center;
            color: rgba(255,255,255,0.5); cursor: pointer; 
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); 
            flex: 1; height: 100%; position: relative;
        }
        .nav-item-p.active { color: white !important; }
        .nav-item-p.active::after {
            content: ''; position: absolute; top: 10px; width: 40px; height: 40px;
            background: var(--apollo-orange); border-radius: 12px; z-index: -1;
            opacity: 0.2; filter: blur(10px); animation: pulse 2s infinite;
        }
        .n-icon { font-size: 24px; margin-bottom: 2px; transition: inherit; z-index: 1; }
        .n-label { font-size: 10px; font-weight: 700; transition: inherit; letter-spacing: 0.5px; opacity: 0.8; z-index: 1; }
        .nav-item-p.active .n-label { opacity: 1; transform: translateY(-1px); }
        .nav-item-p.active .n-icon { transform: translateY(-2px); }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.2); opacity: 0.3; }
            100% { transform: scale(1); opacity: 0.2; }
        }

        /* Native App Feel */
        * { -webkit-tap-highlight-color: transparent; user-select: none; }
        input { user-select: text; }
      `}} />
        </div>
    );
};

export default RecordsView;
