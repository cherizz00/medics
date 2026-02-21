import React from 'react';
import {
    IconRecords, IconChevronLeft, IconClose, IconScan, IconBot,
    IconInsurance, IconLock, IconMedicine, IconHeart, IconActivity,
    IconThermometer, IconSparkles, IconSearch
} from './Icons';
import BottomNavigation from './common/BottomNavigation';
import { useLanguage } from '../LanguageContext';
import translations from '../translations';

/* ─── Inline SVG Icons for Explore ─── */
const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A6CF7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);
const ScanDocIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" /><path d="M12 3v18" />
    </svg>
);
const VaultIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);
const InsightsIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
    </svg>
);
const VitalsIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);
const BMIIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
);
const BPIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" />
    </svg>
);
const GlucoseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L6 8.5c-3.5 4-1 9.5 6 12.5 7-3 9.5-8.5 6-12.5L12 2z" />
    </svg>
);
const PillReminderIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.5 1.5l-8 8a5 5 0 007 7l8-8a5 5 0 00-7-7z" /><line x1="6" y1="12" x2="12" y2="6" />
    </svg>
);
const SleepIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);
const DoctorNetIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4A6CF7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
);
const CalendarIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const HistoryIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const ShieldCheckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
    </svg>
);
const SupportIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
);
const SyncIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
);
const RobotIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
    </svg>
);

/* ─── Section Component ─── */
const ExploreSection = ({ title, children }) => (
    <div style={{ marginBottom: '28px' }}>
        <h3 style={{
            fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)',
            marginBottom: '14px', letterSpacing: '-0.01em',
        }}>{title}</h3>
        <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
        }}>
            {children}
        </div>
    </div>
);

/* ─── Card Component ─── */
const ExploreCard = ({ icon, label, onClick, accent = '#4A6CF7' }) => (
    <button
        onClick={onClick}
        style={{
            background: 'white',
            borderRadius: '18px',
            padding: '20px 8px 16px',
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
            textAlign: 'center',
            minHeight: '100px',
        }}
    >
        <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: `${accent}0D`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {icon}
        </div>
        <span style={{
            fontSize: '0.74rem', fontWeight: '600', color: 'var(--text-main)',
            lineHeight: '1.3', display: 'block',
        }}>{label}</span>
    </button>
);

/* ─── Banner Card Component ─── */
const ExploreBanner = ({ icon, title, subtitle, onClick, accent = '#4A6CF7' }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%',
            background: 'white',
            borderRadius: '18px',
            padding: '18px 20px',
            border: '1px solid rgba(0,0,0,0.04)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '16px',
            transition: 'all 0.2s ease',
            textAlign: 'left',
        }}
    >
        <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: `${accent}0D`, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-main)', display: 'block' }}>{title}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{subtitle}</span>
        </div>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 5l4 4-4 4" /></svg>
    </button>
);


/* ─────────────────────────── */
const ExploreView = ({ onBack, onNavigate }) => {
    const { language } = useLanguage();
    const t = translations[language] || translations.English;

    return (
        <div className="page-container" style={{ background: '#F7F8FA' }}>
            {/* ─── Header ─── */}
            <div style={{
                padding: '16px 20px 0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={onBack} style={{
                        width: '38px', height: '38px', borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.06)', background: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-main)',
                    }}>
                        <IconChevronLeft size={20} />
                    </button>
                    <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        Explore Medics
                    </span>
                </div>
                <button onClick={onBack} style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.06)', background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: 'var(--text-muted)',
                }}>
                    <IconClose size={18} />
                </button>
            </div>

            {/* ─── Top accent bar ─── */}
            <div style={{
                height: '3px', margin: '12px 20px 0',
                background: 'linear-gradient(90deg, var(--primary), #818CF8, #EC4899)',
                borderRadius: '2px',
            }} />

            <main className="scroll-content hide-scrollbar" style={{ padding: '20px 20px 100px' }}>

                {/* ─── Organize Health Records ─── */}
                <ExploreSection title="Organize health records">
                    <ExploreCard icon={<UploadIcon />} label="Upload Records" accent="#4A6CF7" onClick={() => onNavigate('records')} />
                    <ExploreCard icon={<ScanDocIcon />} label="Scan Reports" accent="#6366F1" onClick={() => onNavigate('scanner')} />
                    <ExploreCard icon={<VaultIcon />} label="Secret Locker" accent="#EC4899" onClick={() => onNavigate('vault')} />
                </ExploreSection>

                {/* ─── Analyze Your Health ─── */}
                <ExploreSection title="Analyze your health">
                    <ExploreCard icon={<InsightsIcon />} label="Health Insights" accent="#F59E0B" onClick={() => onNavigate('insights')} />
                    <ExploreCard icon={<VitalsIcon />} label="All Vitals" accent="#10B981" onClick={() => onNavigate('trackers')} />
                    <ExploreCard icon={<RobotIcon />} label="AI Coach" accent="#8B5CF6" onClick={() => onNavigate('bot')} />
                </ExploreSection>

                {/* ─── Insurance ─── */}
                <div style={{ marginBottom: '28px' }}>
                    <h3 style={{
                        fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)',
                        marginBottom: '14px',
                    }}>Insurance - Secure your health</h3>
                    <ExploreBanner
                        icon={<ShieldCheckIcon />}
                        title="Insurance Center"
                        subtitle="Coverage, claims & policy insights"
                        accent="#F59E0B"
                        onClick={() => onNavigate('insurance')}
                    />
                </div>

                {/* ─── Doctor Network ─── */}
                <ExploreSection title="Doctor Network">
                    <ExploreCard icon={<DoctorNetIcon />} label="My Doctors" accent="#4A6CF7" onClick={() => onNavigate('consultancy')} />
                    <ExploreCard icon={<CalendarIcon />} label="Book Appointment" accent="#EC4899" onClick={() => onNavigate('consultancy')} />
                    <ExploreCard icon={<HistoryIcon />} label="Appointment History" accent="#64748B" onClick={() => onNavigate('consultancy')} />
                </ExploreSection>

                {/* ─── Track Your Health ─── */}
                <ExploreSection title="Track your health">
                    <ExploreCard icon={<BMIIcon />} label="BMI" accent="#8B5CF6" onClick={() => onNavigate('trackers')} />
                    <ExploreCard icon={<BPIcon />} label="Blood Pressure" accent="#EF4444" onClick={() => onNavigate('trackers')} />
                    <ExploreCard icon={<GlucoseIcon />} label="Blood Glucose" accent="#F59E0B" onClick={() => onNavigate('trackers')} />
                </ExploreSection>

                {/* ─── For Your Routine Needs ─── */}
                <ExploreSection title="For your routine needs">
                    <ExploreCard icon={<PillReminderIcon />} label="Medicine Reminder" accent="#10B981" onClick={() => onNavigate('medicine-reminder')} />
                    <ExploreCard icon={<SleepIcon />} label="Track Sleep" accent="#6366F1" onClick={() => onNavigate('trackers')} />
                    <ExploreCard icon={<VitalsIcon />} label="All Trackers" accent="#4A6CF7" onClick={() => onNavigate('trackers')} />
                </ExploreSection>

                {/* ─── Feeling Unwell ─── */}
                <div style={{ marginBottom: '28px' }}>
                    <h3 style={{
                        fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)',
                        marginBottom: '14px',
                    }}>Feeling unwell?</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <ExploreBanner
                            icon={<InsightsIcon />}
                            title="Health Risk Assessment"
                            subtitle="Evaluate your risks against common conditions"
                            accent="#F59E0B"
                            onClick={() => onNavigate('bot')}
                        />
                        <ExploreBanner
                            icon={<RobotIcon />}
                            title="Symptoms Checker"
                            subtitle="Quick check with our AI symptom checker"
                            accent="#8B5CF6"
                            onClick={() => onNavigate('bot')}
                        />
                    </div>
                </div>

                {/* ─── More on Medics ─── */}
                <ExploreSection title="More on Medics">
                    <ExploreCard icon={<SyncIcon />} label="Sync Health Data" accent="#14B8A6" onClick={() => onNavigate('records')} />
                    <ExploreCard icon={<SupportIcon />} label="Support Center" accent="#0EA5E9" onClick={() => onNavigate('faq')} />
                    <ExploreCard icon={<RobotIcon />} label="AI Assist Demo" accent="#8B5CF6" onClick={() => onNavigate('bot')} />
                </ExploreSection>

            </main>

            <BottomNavigation activeTab="home" onNavigate={onNavigate} />
        </div>
    );
};

export default ExploreView;
