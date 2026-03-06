
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';

interface SubFiumeSotterraneoProps {
    setView: (view: AppView) => void;
}

const SubFiumeSotterraneo: React.FC<SubFiumeSotterraneoProps> = ({ setView }) => {
    const [showLanding, setShowLanding] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const VIDEO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Image+to+video+%E4%B8%A8+la+mia+barca+continua+il+percorso+nel+fiume+sotterraneo+dentro+.mp4';
    const LANDING_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fiumesotteraanlandingpage.webp';
    const BTN_BACK_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esicenigmi.webp';

    useEffect(() => {
        // Pre-caricamento dell'immagine di landing
        const img = new Image();
        img.src = LANDING_IMG;
    }, []);

    const handleVideoEnd = () => {
        setShowLanding(true);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden select-none">
            {!showLanding ? (
                <div className="relative w-full h-full flex items-center justify-center">
                    <video
                        ref={videoRef}
                        src={VIDEO_URL}
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        className="w-full h-full object-cover"
                    />
                    {/* Pulsante Salta (opzionale, ma utile per UX) */}
                    <button 
                        onClick={() => setShowLanding(true)}
                        className="absolute bottom-10 right-10 bg-black/50 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black/70 transition-all"
                    >
                        Salta
                    </button>
                </div>
            ) : (
                <div className="relative w-full h-full animate-in fade-in duration-1000">
                    <img 
                        src={LANDING_IMG} 
                        alt="Fiume Sotterraneo" 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Pulsante Esci in alto a sinistra */}
                    <div className="absolute top-6 left-6 z-50">
                        <button 
                            onClick={() => setView(AppView.MAGIC_TOWER_SUB_EXPLORE)}
                            className="hover:scale-110 active:scale-95 transition-all outline-none"
                        >
                            <img src={BTN_BACK_URL} alt="Esci" className="w-20 h-20 md:w-32 h-auto drop-shadow-2xl" />
                        </button>
                    </div>

                    {/* Overlay decorativo per atmosfera */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
                </div>
            )}
        </div>
    );
};

export default SubFiumeSotterraneo;
