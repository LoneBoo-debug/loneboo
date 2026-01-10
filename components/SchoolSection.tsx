import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const SCHOOL_SPLASH_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/splashscreeschoolarco.webp';
const BTN_BACK_CITY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trneds.png';

interface SchoolSectionProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const SchoolSection: React.FC<SchoolSectionProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    // --- AREAS DEFINITION ---
    const FIRST_FLOOR_ZONE: Point[] = [
        { "x": 29.85, "y": 31.77 },
        { "x": 28.25, "y": 67.15 },
        { "x": 73.03, "y": 67.6 },
        { "x": 72.23, "y": 31.32 }
    ];

    useEffect(() => {
        const img = new Image();
        img.src = SCHOOL_SPLASH_BG;
        img.onload = () => setIsLoaded(true);
        const timer = setTimeout(() => setIsLoaded(true), 2500);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    const getClipPath = (pts: Point[]) => {
        if (pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setView(AppView.SCHOOL_FIRST_FLOOR);
    };

    return (
        <div 
            className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#4c1d95] overflow-hidden touch-none overscroll-none select-none"
        >
            
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900/95 backdrop-blur-md">
                    <img 
                        src={OFFICIAL_LOGO} 
                        alt="Caricamento..." 
                        className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                    />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Apro la Scuola...</span>
                </div>
            )}

            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={SCHOOL_SPLASH_BG} 
                    alt="Scuola di Lone Boo" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false}
                />
            </div>

            {/* CLICKABLE ZONES (INGRESSO SCUOLA) */}
            {isLoaded && (
                <div 
                    onClick={handleZoneClick}
                    className="absolute inset-0 z-10 cursor-pointer active:bg-white/10"
                    style={{ clipPath: getClipPath(FIRST_FLOOR_ZONE) }}
                />
            )}

            {/* UI LAYER */}
            {isLoaded && (
                <>
                    {/* TASTO TORNA IN CITTÀ (IN BASSO A SINISTRA) */}
                    <div 
                        className="absolute bottom-[4%] left-[4%] z-40 pointer-events-auto w-[28vw] md:w-[15vw] max-w-[240px]"
                    >
                        <button 
                            onClick={() => setView(AppView.CITY_MAP)}
                            className="w-full hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                            <img 
                                src={BTN_BACK_CITY_IMG} 
                                alt="Torna in Città" 
                                className="w-full h-auto drop-shadow-2xl"
                            />
                        </button>
                    </div>

                    {/* FUMETTO FISSO IN BASSO A DESTRA */}
                    <div className="absolute bottom-[15%] right-[5%] z-20 pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-sm border-4 border-yellow-400 px-6 py-2 rounded-full shadow-2xl">
                            <span className="font-luckiest text-blue-900 text-xl md:text-3xl uppercase tracking-tighter">Entra a Scuola!</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SchoolSection;