import React, { useState, useEffect, useRef } from 'react';
import {
    IconChevronLeft, IconSearch, IconMapPin, IconStar,
    IconDoctor, IconSparkles, IconPhone, IconChevronRight,
    IconHeart, IconMedicine, IconVitals, IconHistory
} from './Icons';
import BottomNavigation from './common/BottomNavigation';

const ConsultancyView = ({ onBack, onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [doctors, setDoctors] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: 'All', icon: <IconDoctor size={18} /> },
        { name: 'General Physician', icon: <IconDoctor size={18} /> },
        { name: 'Cardiologist', icon: <IconHeart size={18} /> },
        { name: 'Dermatologist', icon: <IconSparkles size={18} /> },
        { name: 'Pediatrician', icon: <IconMedicine size={18} /> },
        { name: 'Neurologist', icon: <IconVitals size={18} /> }
    ];

    const CoachBanner = () => {
        return (
            <div style={{ marginBottom: '28px' }}>
                <div
                    className="medical-card"
                    style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                        border: 'none',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px -10px rgba(80, 66, 189, 0.3)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                            <IconSparkles color="white" size={20} />
                        </div>
                        <h4 style={{ color: 'white', fontWeight: '900', margin: 0, letterSpacing: '0.02em', fontSize: '1.1rem' }}>Dr. Coach Personal Recommendation</h4>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: '1.6', margin: 0, position: 'relative', zIndex: 1, fontWeight: '500' }}>
                        Based on your recent heart rate variability and activity levels, we recommend consulting a **Cardiologist** for an optimized performance profile.
                    </p>
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchDoctors();
        fetchBookings();
    }, [searchQuery, selectedCategory]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/consultancy/my-bookings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setBookings(await response.json());
            }
        } catch (err) { console.error(err); }
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory !== 'All') params.append('category', selectedCategory);

            const response = await fetch(`/api/consultancies?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
            }
        } catch (err) {
            console.error('Fetch Doctors Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async (doc) => {
        try {
            const token = localStorage.getItem('medics_token');
            const response = await fetch('/api/consultancy/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorName: doc.name,
                    specialty: doc.specialty
                })
            });
            if (response.ok) {
                alert('Booking Confirmed! You have received a new token.');
                fetchBookings();
            } else {
                alert('Failed to book appointment. Please try again.');
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="page-container" style={{ background: '#F8FAFC' }}>
            <main className="scroll-content hide-scrollbar" style={{ padding: '0 20px 100px' }}>
                <header style={{ padding: '24px 0', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={onBack} className="btn-ghost flex-center" style={{ width: '44px', height: '44px', borderRadius: '14px', padding: 0 }}>
                        <IconChevronLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, color: 'var(--premium-dark)' }}>Consult Doctors</h2>
                </header>

                <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <input
                        type="text"
                        placeholder="Search doctors, specialities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '52px', height: '56px', background: 'white', border: '1px solid #E2E8F0', borderRadius: '18px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', fontWeight: '600' }}
                    />
                    <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
                        <IconSearch size={22} />
                    </span>
                </div>

                <div className="hide-scrollbar" style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '32px', padding: '4px 0' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                borderRadius: '16px',
                                border: 'none',
                                background: selectedCategory === cat.name ? 'var(--primary)' : 'white',
                                color: selectedCategory === cat.name ? 'white' : 'var(--text-secondary)',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap',
                                boxShadow: selectedCategory === cat.name ? '0 12px 24px rgba(80, 66, 189, 0.25)' : '0 4px 12px rgba(0,0,0,0.04)'
                            }}
                        >
                            <span style={{ opacity: selectedCategory === cat.name ? 1 : 0.7 }}>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                <CoachBanner />

                {bookings.length > 0 && (
                    <div style={{ marginBottom: '32px' }}>
                        <div className="flex-between" style={{ padding: '0 4px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--premium-dark)' }}>My Active Tokens</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>{bookings.length} TOTAL</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {bookings.map((booking, i) => (
                                <div key={booking._id} className="medical-card" style={{
                                    background: 'white',
                                    border: '1px solid #E2E8F0',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div className="flex-center" style={{
                                        width: '48px', height: '48px', background: '#F0FDF4', color: '#166534',
                                        borderRadius: '12px', flexShrink: 0
                                    }}>
                                        <IconHistory size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="flex-between">
                                            <h5 style={{ margin: 0, fontWeight: '800', fontSize: '0.9rem' }}>{booking.doctor_name}</h5>
                                            <span style={{ fontSize: '0.7rem', fontWeight: '950', background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '8px' }}>
                                                {booking.token_id}
                                            </span>
                                        </div>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>{booking.specialty}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="flex-between" style={{ padding: '0 4px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--premium-dark)' }}>Nearby Consultancies</h3>
                        <button
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=doctors+near+me ${searchQuery ? '+ ' + searchQuery : ''}`, '_blank')}
                            style={{
                                border: 'none',
                                background: 'none',
                                color: 'var(--primary)',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                            }}
                        >
                            VIEW MAP
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div className="spinner" style={{ margin: '0 auto' }}></div>
                            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Finding best doctors...</p>
                        </div>
                    ) : doctors.length > 0 ? (
                        doctors.map((doc, i) => (
                            <div key={doc.id} className="medical-card" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={doc.image} alt={doc.name} style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: 'white', borderRadius: '50%', padding: '3px', boxShadow: 'var(--shadow-sm)' }}>
                                            <div style={{ width: '10px', height: '10px', background: '#22C55E', borderRadius: '50%' }} />
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="flex-between">
                                            <h4 style={{ fontWeight: '800', fontSize: '1.05rem', margin: '0 0 2px' }}>{doc.name}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF9C3', padding: '2px 8px', borderRadius: '6px' }}>
                                                <IconStar size={12} fill="#CA8A04" stroke="#CA8A04" />
                                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#854D0E' }}>{doc.rating}</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', margin: '0 0 8px' }}>{doc.specialty}</p>

                                        <div
                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.name + ' ' + doc.location)}`, '_blank')}
                                            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', cursor: 'pointer' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                <IconMapPin size={14} />
                                                <span>{doc.distance}</span>
                                            </div>
                                            <span style={{ color: '#CBD5E1' }}>•</span>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.location}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <button className="btn-outlined" style={{ height: '40px', fontSize: '0.85rem', borderRadius: '12px' }}>
                                        <IconPhone size={16} style={{ marginRight: '8px' }} /> Call
                                    </button>
                                    <button
                                        onClick={() => handleBook(doc)}
                                        className="btn btn-primary"
                                        style={{ height: '40px', fontSize: '0.85rem', borderRadius: '12px' }}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <div className="flex-center" style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.1, color: 'var(--primary)' }}>
                                <IconDoctor />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>No doctors found</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>
            </main>

            <BottomNavigation activeTab="consult" onNavigate={onNavigate} />
        </div>
    );
};

export default ConsultancyView;
