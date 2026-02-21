import React, { useState, useEffect } from 'react';
import { IconCheck, IconClose, IconPremium, IconSparkles } from './Icons';

const StoryViewer = ({ stories, startIndex, onClose, isPremium, onUpgrade }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (progress < 100) {
            interval = setInterval(() => {
                setProgress(prev => prev + 1);
            }, 5000);
        } else {
            handleNext();
        }
        return () => clearInterval(interval);
    }, [progress, currentIndex]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0);
        }
    };

    const currentStory = stories[currentIndex];
    const isLocked = currentStory.is_premium && !isPremium;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'black', zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
            <div style={{
                position: 'absolute', top: '12px', left: '0', width: '100%',
                display: 'flex', gap: '6px', padding: '0 12px', zIndex: 1010
            }}>
                {stories.map((s, i) => (
                    <div key={i} style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', background: 'white',
                            width: i < currentIndex ? '100%' : (i === currentIndex ? `${progress}%` : '0%'),
                            boxShadow: i === currentIndex ? '0 0 8px rgba(255,255,255,0.8)' : 'none'
                        }}></div>
                    </div>
                ))}
            </div>

            <div style={{
                position: 'absolute', top: '24px', right: '12px', zIndex: 1010,
                color: 'white', padding: '12px', cursor: 'pointer',
                background: 'rgba(0,0,0,0.3)', borderRadius: '50%', display: 'flex'
            }} onClick={onClose}>
                <IconClose color="white" size={24} />
            </div>

            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img
                    src={currentStory.content_url}
                    alt={currentStory.title}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        filter: isLocked ? 'blur(25px) brightness(0.7)' : 'none'
                    }}
                />

                {isLocked && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.4)', color: 'white', textAlign: 'center', padding: '32px'
                    }}>

                        <div style={{
                            width: '80px', height: '80px', background: 'var(--premium-gold)',
                            borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '24px', boxShadow: '0 15px 30px rgba(234, 179, 8, 0.4)',
                            position: 'relative'
                        }}>
                            <IconPremium size={40} />
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'white' }}>
                                <IconSparkles size={24} />
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.75rem', fontWeight: '900', margin: '0 0 12px', letterSpacing: '-0.02em' }}>Premium Story</h3>
                        <p style={{ marginBottom: '32px', fontSize: '1rem', opacity: 0.9, fontWeight: '600', maxWidth: '240px', lineHeight: '1.5' }}>
                            Join Medics Pro to witness this exclusive health insight.
                        </p>

                        <button onClick={onUpgrade} className="btn" style={{
                            background: 'white', color: 'black', border: 'none', padding: '16px 32px',
                            borderRadius: '16px', fontWeight: '900', fontSize: '1rem',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            Unlock Pro Features
                        </button>
                    </div>
                )}
            </div>

            {!isLocked && (
                <div style={{
                    position: 'absolute', bottom: '0', left: '0', width: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '60px 24px 48px', color: 'white',
                    zIndex: 1010
                }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '800' }}>{currentStory.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.8, fontWeight: '500', lineHeight: '1.4' }}>{currentStory.description}</p>
                </div>
            )}

            <div style={{ position: 'absolute', top: '0', left: '0', width: '40%', height: '100%', zIndex: 1005 }} onClick={handlePrev}></div>
            <div style={{ position: 'absolute', top: '0', right: '0', width: '40%', height: '100%', zIndex: 1005 }} onClick={handleNext}></div>
        </div>
    );
};

export default StoryViewer;
