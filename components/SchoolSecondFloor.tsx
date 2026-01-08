import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const SCHOOL_SF_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuola+secondopiano.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

interface SchoolSecondFloorProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const SchoolSecondFloor: React.FC<SchoolSecondFloorProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    // --- AREAS DEFINITION ---
    const BACK_TO_FIRST_FLOOR_ZONE: Point[] = [
        {"x": 60.77, "y": 20.23},
        {"x": 59.7, "y": 58},
        {"x": 96.48, "y": 58.9},
        {"x": 95.68, "y": 20.23}
    ];

    useEffect(() => {
        const img = new Image();
        img.src = SCHOOL_SF_BG;
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
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Salgo all'ultimo piano...</span>
                </div>
            )}

            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={SCHOOL_SF_BG} 
                    alt="Scuola Secondo Piano" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false}
                />
            </div>

            {/* CLICKABLE ZONES (TORNA GIÙ) */}
            {isLoaded && (
                <div 
                    onClick={handleZoneClick}
                    className="absolute inset-0 z-10 cursor-pointer active:bg-white/10"
                    style={{ clipPath: getClipPath(BACK_TO_FIRST_FLOOR_ZONE) }}
                />
            )}

            {/* UI LAYER */}
            {isLoaded && (
                <>
                    {/* TASTO CHIUDI (TOP RIGHT ADATTIVO) */}
                    <div className="absolute top-[12%] right-[5%] z-50">
                        <button 
                            onClick={() => setView(AppView.SCHOOL_FIRST_FLOOR)} 
                            className="hover:scale-110 active:scale-95 transition-all outline-none w-[12vw] md:w-[6vw] max-w-[80px]"
                        >
                            <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-full h-auto drop-shadow-2xl" />
                        </button>
                    </div>

                    {/* FUMETTO FISSO IN BASSO A DESTRA (ABBASSATO AL 6%) */}
                    <div className="absolute bottom-[6%] right-[5%] z-20 pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-sm border-4 border-yellow-400 px-6 py-2 rounded-full shadow-2xl">
                            <span className="font-luckiest text-blue-900 text-xl md:text-3xl uppercase tracking-tighter">scegli un'aula o scendi giù</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SchoolSecondFloor;