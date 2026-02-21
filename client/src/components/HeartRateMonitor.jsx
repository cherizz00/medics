import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IconHeart, IconActivity, IconChevronLeft, IconSparkles } from './Icons';

const HeartRateMonitor = ({ onSave, onComplete, onBack }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [bpm, setBpm] = useState(0);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [stability, setStability] = useState(0);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Position your finger over the camera');
    const [waveform, setWaveform] = useState(new Array(50).fill(0));

    const dataPoints = useRef([]);
    const lastPeakTime = useRef(0);
    const beatIntervals = useRef([]);
    const stabilityRef = useRef(0);
    const streamRef = useRef(null);
    const rafId = useRef(null);

    const onResult = onSave || onComplete;

    const startCamera = async () => {
        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }

            let stream;
            const constraints = {
                video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
            };

            try {
                stream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (e) {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;

                try {
                    await videoRef.current.play();
                } catch (playError) {
                    console.error('Video play error:', playError);
                }

                setIsMonitoring(true);
                setError('');

                const tracks = stream.getVideoTracks();
                if (tracks.length > 0) {
                    const track = tracks[0];
                    const capabilities = track.getCapabilities?.() || {};
                    if (capabilities.torch) {
                        await track.applyConstraints({ advanced: [{ torch: true }] }).catch(err => console.warn('Torch failed:', err));
                    }
                }
            }
        } catch (err) {
            console.error('Camera Error:', err);
            setError('Camera access denied or device unavailable.');
            setStatus('Hardware error');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.applyConstraints({ advanced: [{ torch: false }] }).catch(() => { });
                track.stop();
            });
            streamRef.current = null;
        }
        if (rafId.current) cancelAnimationFrame(rafId.current);
        setIsMonitoring(false);
    };

    const processFrame = useCallback(() => {
        if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const video = videoRef.current;

        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let redSum = 0;
            let greenSum = 0;
            for (let i = 0; i < data.length; i += 4) {
                redSum += data[i];
                greenSum += data[i + 1];
            }

            const avgRed = redSum / (data.length / 4);
            const avgGreen = greenSum / (data.length / 4);

            const signalValue = (avgGreen * 0.7 + avgRed * 0.3);
            const now = Date.now();

            dataPoints.current.push({ val: signalValue, time: now });
            if (dataPoints.current.length > 200) dataPoints.current.shift();

            if (dataPoints.current.length > 15) {
                const windowSize = 40;
                const recent = dataPoints.current.slice(-windowSize);
                const avg = recent.reduce((sum, p) => sum + p.val, 0) / recent.length;
                const currentDetrended = signalValue - avg;

                setWaveform(prev => {
                    const next = [...prev, currentDetrended];
                    if (next.length > 50) next.shift();
                    return next;
                });

                const lastValDetrended = (dataPoints.current[dataPoints.current.length - 2]?.val || 0) - avg;
                const prevValDetrended = (dataPoints.current[dataPoints.current.length - 3]?.val || 0) - avg;

                const dynamicThreshold = Math.max(0.1, avg * 0.001);

                if (lastValDetrended > prevValDetrended && lastValDetrended > currentDetrended && lastValDetrended > dynamicThreshold) {
                    const timeSinceLast = now - lastPeakTime.current;

                    if (lastPeakTime.current === 0) {
                        lastPeakTime.current = now;
                    } else if (timeSinceLast > 330 && timeSinceLast < 1500) {
                        const instantBpm = 60000 / timeSinceLast;
                        beatIntervals.current.push(instantBpm);
                        if (beatIntervals.current.length > 8) beatIntervals.current.shift();

                        const medBpm = [...beatIntervals.current].sort((a, b) => a - b)[Math.floor(beatIntervals.current.length / 2)];
                        setBpm(Math.round(medBpm));
                        lastPeakTime.current = now;

                        stabilityRef.current = Math.min(100, stabilityRef.current + 4);
                        setStability(stabilityRef.current);
                    } else if (timeSinceLast >= 1500) {
                        lastPeakTime.current = now;
                    }
                }
            }

            if (avgRed < 15 && avgGreen < 15) {
                setStatus('Place finger over the camera lens');
                stabilityRef.current = Math.max(0, stabilityRef.current - 1);
                setStability(stabilityRef.current);
            } else if (stabilityRef.current < 100) {
                setStatus('Analyzing pulse... Keep steady');
            } else {
                setStatus('Signal stable, measuring...');
            }
        } catch (e) {
        }

        if (streamRef.current) {
            rafId.current = requestAnimationFrame(processFrame);
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    useEffect(() => {
        if (isMonitoring) {
            rafId.current = requestAnimationFrame(processFrame);
            return () => cancelAnimationFrame(rafId.current);
        }
    }, [isMonitoring, processFrame]);

    const handleSave = () => {
        if (bpm > 40 && onResult) {
            onResult(bpm);
            stopCamera();
            if (onBack) onBack();
        }
    };

    return (
        <div className="page-container" style={{ background: '#0F172A', color: 'white', overflow: 'hidden' }}>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>

                <div className="flex-between" style={{ marginBottom: '32px', zIndex: 10 }}>
                    {onBack && (
                        <button onClick={() => { stopCamera(); onBack(); }} className="btn-ghost" style={{ color: 'white' }}>
                            <IconChevronLeft /> Back
                        </button>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818CF8' }}>
                        <IconSparkles size={18} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.1em' }}>AI VITALS</span>
                    </div>
                </div>

                <div className="flex-center" style={{ flex: 1, flexDirection: 'column', gap: '30px' }}>

                    <div style={{ position: 'relative', width: '240px', height: '240px' }}>
                        <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', height: '40px', display: 'flex', alignItems: 'flex-end', gap: '2px', opacity: 0.5 }}>
                            {waveform.map((h, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    height: `${Math.min(100, Math.max(5, 20 + h * 10))}%`,
                                    background: '#818CF8',
                                    borderRadius: '2px',
                                    transition: 'height 0.1s ease'
                                }} />
                            ))}
                        </div>

                        <svg width="240" height="240" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#818CF8" strokeWidth="6"
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * stability / 100)}
                                style={{ transition: 'stroke-dashoffset 0.5s ease', strokeLinecap: 'round' }}
                            />
                        </svg>

                        <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />

                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)', background: 'black',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <canvas ref={canvasRef} width="80" height="80" style={{
                                width: '100%', height: '100%', objectFit: 'cover',
                                opacity: isMonitoring ? 1 : 0, transition: 'opacity 0.5s ease',
                                filter: 'brightness(1.2) contrast(1.1)'
                            }} />

                            {isMonitoring && stability > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    animation: bpm > 0 ? 'pulse 0.8s infinite' : 'none',
                                    color: bpm > 0 ? '#F43F5E' : 'rgba(255,255,255,0.4)'
                                }}>
                                    <IconHeart size={32} />
                                </div>
                            )}
                        </div>

                        <div className="flex-center" style={{ position: 'absolute', top: '-60px', left: 0, right: 0, flexDirection: 'column' }}>
                            <h2 style={{ fontSize: '3.5rem', fontWeight: '900', margin: '4px 0', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>{bpm || '--'}</h2>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>BPM</span>
                        </div>
                    </div>

                    <div className="glass-card" style={{
                        width: '100%', padding: '24px', textAlign: 'center',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                        <p style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: stability > 50 ? 'white' : 'rgba(255,255,255,0.6)' }}>
                            {error || status}
                        </p>
                        <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>
                            {error ? 'Try checking your browser camera permissions settings.' : 'Cover the back camera lens with your finger and keep still.'}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', paddingBottom: '10px' }}>
                    <button
                        onClick={handleSave}
                        disabled={stability < 60 || bpm < 40}
                        className="btn btn-primary"
                        style={{
                            width: '100%', height: '64px', borderRadius: '20px',
                            fontSize: '1.1rem', fontWeight: '900',
                            background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
                            opacity: (stability < 60 || bpm < 40) ? 0.5 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {stability < 100 && stability >= 60 ? 'Save Current BPM' : (stability < 60 ? `Analyzing... ${stability}%` : 'Save Analysis')}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                        Ensure your finger is placed exactly over the lens. Works best with flash.
                    </p>
                </div>

            </div>

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
export default HeartRateMonitor;
