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
                        <h3>{userName}</h3>
                    </div>
                    <div className="u-avatar-p">{userInitials}</div>
                </div>

                <div className="search-premium animate-fade">
                    <div className="search-inner glass">
                        <span>🔍</span>
                        <input type="text" placeholder="Search medical services..." />
                    </div>
                </div>
            </header>

            <main className="dash-main-p">

                <section className="upload-block-p animate-fade" style={{ animationDelay: '0.1s' }} onClick={() => fileInputRef.current.click()}>
                    <div className="u-block-inner glass">
                        <div className="u-icon-p">📄</div>
                        <div className="u-text-p">
                            <h4>Upload Medical Records</h4>
                            <p>Store your prescriptions and reports safely</p>
                        </div>
                        <div className="u-btn-p">Add +</div>
                    </div>
                </section>


                <section className="section-p animate-fade" style={{ animationDelay: '0.2s' }}>
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
                .dash-root-p { background: var(--bg-primary); height: 100vh; display: flex; flex-direction: column; overflow: hidden; position: relative; }
                
                .premium-header { 
                    flex-shrink: 0;
                    background: white; 
                    padding: 40px 24px 20px 24px; 
                    position: relative;
                    z-index: 20;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }
                .h-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .loc-p { font-size: 14px; font-weight: 600; color: var(--text-header); }
                .h-user { display: flex; align-items: center; gap: 12px; cursor: pointer; }
                .u-avatar-p { width: 44px; height: 44px; background: var(--primary-light); color: var(--primary); border-radius: 22px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; }
                .u-text p { color: var(--text-muted); font-size: 14px; margin: 0; }
                .u-text h3 { font-size: 20px; font-weight: 700; margin: 0; color: var(--text-header); }
                
                .search-premium { margin-top: 24px; }
                .search-inner { background: var(--bg-secondary); border: 1px solid var(--border); padding: 14px 20px; border-radius: 24px; display: flex; align-items: center; gap: 12px; }
                .search-inner input { background: none; border: none; outline: none; color: var(--text-header); flex: 1; font-size: 15px; }
                .search-inner input::placeholder { color: var(--text-muted); }
                .search-inner span { font-size: 18px; opacity: 0.5; }

                .dash-main-p { flex: 1; overflow-y: auto; padding: 24px; padding-bottom: 120px; position: relative; z-index: 10; }
                .dash-main-p::-webkit-scrollbar { display: none; }
                
                .section-p { margin-bottom: 32px; }
                .s-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .s-head h3 { font-size: 18px; font-weight: 700; color: var(--text-header); }
                .s-head span { color: var(--primary); font-size: 14px; font-weight: 600; cursor: pointer; }
                
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

                .upload-block-p { margin-bottom: 32px; }
                .u-block-inner { 
                    padding: 24px; border-radius: 24px; display: flex; align-items: center; gap: 16px; 
                    cursor: pointer; transition: var(--transition);
                    background: var(--primary-light);
                    border: 1px solid rgba(25, 154, 142, 0.1);
                }
                .u-block-inner:active { transform: scale(0.98); }
                .u-icon-p { width: 48px; height: 48px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: var(--primary); box-shadow: var(--shadow-sm); }
                .u-text-p { flex: 1; }
                .u-text-p h4 { font-size: 16px; font-weight: 700; color: var(--primary); margin: 0; }
                .u-text-p p { font-size: 13px; color: var(--primary); opacity: 0.8; margin: 4px 0 0 0; }
                .u-btn-p { background: var(--primary); color: white; padding: 10px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; }

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
        </div>
    );
};

export default Dashboard;
