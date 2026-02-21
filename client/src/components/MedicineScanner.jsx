import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import { IconScan, IconMedicine, IconClose, IconArrowLeft } from './Icons';
import { MEDICINE_DATABASE } from '../data/medicineDb';

const MedicineScanner = ({ onBack, onAddToCart }) => {
    const webcamRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [detectedMeds, setDetectedMeds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [rawText, setRawText] = useState("");

    const captureAndScan = async () => {
        if (!webcamRef.current || analyzing) return;

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        setAnalyzing(true);
        try {
            const result = await Tesseract.recognize(imageSrc, "eng", {
                logger: (m) => console.log(m.status)
            });

            const extractedText = result.data.text.toLowerCase();
            setRawText(extractedText);

            const found = MEDICINE_DATABASE.filter((med) =>
                extractedText.includes(med.name.toLowerCase().split(' ')[0])
            );

            if (found.length > 0) {
                setDetectedMeds(found);
                setShowPopup(true);
                setScanning(false);
            }
        } catch (error) {
            console.error("OCR Error:", error);
        } finally {
            setAnalyzing(false);
        }
    };

    useEffect(() => {
        let interval;
        if (scanning) {
            interval = setInterval(() => {
                captureAndScan();
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [scanning, analyzing]);

    const handleConfirm = () => {
        onAddToCart(detectedMeds);
        setShowPopup(false);
        setDetectedMeds([]);
        setScanning(true);
    };

    return (
        <div className="scanner-view" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: '#000', zIndex: 1000, display: 'flex', flexDirection: 'column'
        }}>
            <div style={{
                padding: '20px', display: 'flex', alignItems: 'center', gap: '16px',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', color: 'white'
            }}>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'white', padding: 0 }}>
                    <IconArrowLeft />
                </button>
                <span style={{ fontWeight: '800' }}>Live Medicine Scanner</span>
            </div>

            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/png"
                    videoConstraints={{ facingMode: "environment" }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div style={{
                    position: 'absolute', top: '20%', left: '10%', right: '10%', bottom: '30%',
                    border: '2px solid rgba(255,255,255,0.3)', borderRadius: '24px',
                    boxShadow: '0 0 0 1000px rgba(0,0,0,0.5)'
                }}>
                    {scanning && <div className="scan-line" style={{ background: 'var(--primary)', height: '2px', width: '100%', position: 'absolute', top: 0, animation: 'scanMove 2s infinite linear' }} />}
                </div>

                {analyzing && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.7)', padding: '12px 24px', borderRadius: '12px', color: 'white',
                        fontSize: '0.8rem', fontWeight: '700'
                    }}>
                        Analyzing...
                    </div>
                )}
            </div>

            <div style={{
                padding: '32px 24px', background: 'white', borderRadius: '32px 32px 0 0',
                textAlign: 'center'
            }}>
                <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Align medicine name within the frame to scan
                </p>

                <button
                    onClick={() => setScanning(!scanning)}
                    className={`btn ${scanning ? 'btn-outlined' : 'btn-primary'}`}
                    style={{ width: '100%', height: '56px', borderRadius: '18px', fontSize: '1rem', fontWeight: '900' }}
                >
                    {scanning ? 'Stop Scanning' : 'Start Live Scan'}
                </button>
            </div>

            {showPopup && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div className="medical-card animate-scale" style={{ background: 'white', width: '100%', maxWidth: '360px', padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div className="flex-center" style={{ width: '44px', height: '44px', background: 'var(--primary-subtle)', color: 'var(--primary)', borderRadius: '12px' }}>
                                <IconMedicine />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>Medicine Found</h3>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            {detectedMeds.map((med, i) => (
                                <div key={i} style={{ padding: '12px', background: '#F8FAFC', borderRadius: '12px', marginBottom: '8px', border: '1px solid #E2E8F0' }}>
                                    <div className="flex-between">
                                        <span style={{ fontWeight: '800' }}>{med.name}</span>
                                        <span style={{ color: 'var(--primary)', fontWeight: '900' }}>₹{med.price}</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{med.instructions}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button onClick={() => { setShowPopup(false); setScanning(true); }} className="btn-outlined" style={{ borderRadius: '14px' }}>Decline</button>
                            <button onClick={handleConfirm} className="btn btn-primary" style={{ borderRadius: '14px' }}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes scanMove {
          from { top: 0; }
          to { top: 100%; }
        }
      ` }} />
        </div>
    );
};

export default MedicineScanner;
