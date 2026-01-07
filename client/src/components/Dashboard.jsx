import React, { useState, useEffect, useRef } from 'react';
import { IconHome, IconRecords, IconProfile, IconHospital, IconMedicine, IconLab, IconInsurance, IconQuery, IconStyles } from './Icons';

const Dashboard = ({ onNavigate, documents, onAdd }) => {
    const [activeTab, setActiveTab] = useState('home');
    const fileInputRef = useRef(null);

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

    const services = [
        { title: 'Doctors', icon: <IconHospital />, color: '#E3F2FD' },
        { title: 'Pharmacy', icon: <IconMedicine />, color: '#F3E5F5' },
        { title: 'Lab Tests', icon: <IconLab />, color: '#FFF3E0' },
        { title: 'Records', icon: <IconRecords active />, color: '#E8F5E9' },
        { title: 'Insurance', icon: <IconInsurance />, color: '#E0F2F1' },
        { title: 'Queries', icon: <IconQuery />, color: '#FFFDE7' }
    ];

    return (
        <div className="dash-root-p">
            <IconStyles />
            <header className="premium-header">
                <div className="h-top">
                    <div className="loc-p">📍 Mumbai Central</div>
                    <div className="notif">🔔</div>
                </div>
                <div className="h-user" onClick={() => onNavigate('profile')}>
                    <div className="u-text">
                        <p>Welcome back,</p>
                        <h3>John Smith</h3>
                    </div>
                    <div className="u-avatar-p">JS</div>
                </div>

                <div className="search-premium animate-fade">
                    <div className="search-inner glass">
                        <span>🔍</span>
                        <input type="text" placeholder="Search medical services..." />
                    </div>
                </div>
            </header>

            <main className="dash-main-p">
                <div className="mesh-bg"></div>

                <section className="upload-block-p animate-fade" style={{ animationDelay: '0.2s' }} onClick={() => fileInputRef.current.click()}>
                    <div className="u-block-inner glass">
                        <div className="u-icon-p">📄</div>
                        <div className="u-text-p">
                            <h4>Upload Medical Records</h4>
                            <p>Store your prescriptions and reports safely</p>
                        </div>
                        <div className="u-btn-p">Add +</div>
                    </div>
                </section>

                <section className="section-p animate-fade" style={{ animationDelay: '0.3s' }}>
                    <div className="s-head">
                        <h3>Medical Records</h3>
                        <span onClick={() => onNavigate('records')}>See All</span>
                    </div>
                    <div className="r-list-p">
                        {documents.map((doc, i) => (
                            <div key={i} className="r-card-p premium-card" onClick={() => openDocument(doc)}>
                                <div className="r-icon-p">
                                    <IconRecords active={false} />
                                </div>
                                <div className="r-text-p">
                                    <h4>{doc.title}</h4>
                                    <p>{doc.date} &bull; {doc.size}</p>
                                </div>
                                <div className="r-arrow">&rsaquo;</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />

            <nav className="bottom-nav-p glass">
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
                .dash-root-p { background: var(--apollo-bg); height: 100vh; display: flex; flex-direction: column; overflow: hidden; position: relative; }
                .mesh-bg { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--mesh-gradient); z-index: 0; pointer-events: none; }
                
                .premium-header { flex-shrink: 0;
                    background: var(--primary-gradient); 
                    padding: 30px 24px 70px 24px; 
                    color: white; 
                    border-radius: 0 0 40px 40px; 
                    position: relative;
                    z-index: 5;
                    box-shadow: 0 10px 30px rgba(2, 54, 61, 0.2);
                }
                .h-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .loc-p { font-size: 13px; font-weight: 500; opacity: 0.8; }
                .h-user { display: flex; align-items: center; gap: 15px; cursor: pointer; }
                .u-avatar-p { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 1px solid rgba(255,255,255,0.3); }
                .u-text p { opacity: 0.6; font-size: 14px; margin: 0; }
                .u-text h3 { font-size: 22px; font-weight: 700; margin: 0; }
                
                .search-premium { margin-top: 30px; }
                .search-inner { padding: 18px 20px; border-radius: 20px; display: flex; align-items: center; gap: 12px; }
                .search-inner input { background: none; border: none; outline: none; color: white; flex: 1; font-size: 16px; }
                .search-inner input::placeholder { color: rgba(255,255,255,0.5); }
                .search-inner span { font-size: 20px; }

                .dash-main-p { flex: 1; overflow-y: auto; padding: 0 24px; padding-bottom: 180px; margin-top: -35px; position: relative; z-index: 10; -webkit-overflow-scrolling: touch; }
                .dash-main-p::-webkit-scrollbar { display: none; }
                .section-p { margin-bottom: 32px; }
                .s-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .s-head h3 { font-size: 20px; font-weight: 700; color: var(--apollo-blue); }
                .s-head span { color: var(--apollo-orange); font-size: 14px; font-weight: 600; cursor: pointer; }
                
                .s-grid-p { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                .s-item-p { 
                    background: white; padding: 20px 10px; border-radius: 24px; 
                    display: flex; flex-direction: column; align-items: center; gap: 12px;
                    box-shadow: var(--shadow-soft); border: 1px solid var(--apollo-border);
                    transition: transform 0.1s ease; cursor: pointer;
                }
                .s-item-p:active { transform: scale(0.95); opacity: 0.8; }
                .s-icon-p { width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 26px; }
                .s-item-p span { font-size: 13px; font-weight: 600; color: #444; }

                .r-list-p { display: flex; flex-direction: column; gap: 12px; }
                .r-card-p { padding: 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; }
                .r-icon-p { width: 52px; height: 52px; background: #E0F2F1; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
                .r-text-p { flex: 1; }
                .r-text-p h4 { font-size: 16px; font-weight: 700; color: var(--apollo-blue); margin-bottom: 2px; }
                .r-text-p p { font-size: 13px; color: var(--apollo-text-light); }
                .r-arrow { font-size: 28px; color: #CCC; }

                .upload-block-p { margin-bottom: 32px; padding: 4px; }
                .u-block-inner { 
                    padding: 24px; border-radius: 28px; display: flex; align-items: center; gap: 16px; 
                    cursor: pointer; transition: transform 0.1s ease;
                    background: rgba(2, 54, 61, 0.03) !important;
                    border: 2px dashed rgba(2, 54, 61, 0.1) !important;
                }
                .u-block-inner:active { transform: scale(0.98); background: rgba(2, 54, 61, 0.05) !important; }
                .u-icon-p { width: 50px; height: 50px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: var(--shadow-soft); }
                .u-text-p { flex: 1; }
                .u-text-p h4 { font-size: 16px; font-weight: 700; color: var(--apollo-blue); margin: 0; }
                .u-text-p p { font-size: 13px; color: var(--apollo-text-light); margin: 4px 0 0 0; }
                .u-btn-p { background: var(--apollo-blue); color: white; padding: 10px 18px; border-radius: 12px; font-size: 14px; font-weight: 700; }

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

export default Dashboard;
