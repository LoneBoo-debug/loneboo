
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const GYM_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/paledstrschoolbg.webp';
const BTN_EXIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/exirfure773.webp';

interface SchoolGymProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const SchoolGym: React.FC<SchoolGymProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // --- COORDINATE DEFINITIVE FORNITE DALL'UTENTE ---
    const SPORT_ZONES: Record<string, Point[]> = {
        "basket": [
            { "x": 5.33, "y": 9.75 },
            { "x": 7.2, "y": 44.08 },
            { "x": 38.13, "y": 40.48 },
            { "x": 40.8, "y": 10.79 }
        ],
        "calcio": [
            { "x": 61.6, "y": 25.04 },
            { "x": 61.6, "y": 41.38 },
            { "x": 95.47, "y": 43.78 },
            { "x": 96.8, "y": 25.34 }
        ],
        "tennis": [
            { "x": 30.67, "y": 51.72 },
            { "x": 2.13, "y": 60.42 },
            { "x": 4.27, "y": 76.76 },
            { "x": 58.13, "y": 58.17 }
        ],
        "ginnastica": [
            { "x": 74.13, "y": 59.97 },
            { "x": 24.8, "y": 83.06 },
            { "x": 74.67, "y": 96.7 },
            { "x": 98.93, "y": 66.12 }
        ]
    };

    useEffect(() => {
        const img = new Image();
        img.src = GYM_BG;
        img.onload = () => setIsLoaded(true);
        const timer = setTimeout(() => setIsLoaded(true), 2500);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    const getClipPath = (pts: Point[]) => {
        if (pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneInteraction = (sport: string) => {
        switch(sport) {
            case 'basket': setView(AppView.SCHOOL_GYM_BASKET); break;
            case 'calcio': setView(AppView.SCHOOL_GYM_SOCCER); break;
            case 'tennis': setView(AppView.SCHOOL_GYM_TENNIS); break;
            case 'ginnastica': setView(AppView.SCHOOL_GYM_GYMNASTICS); break;
        }
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#1e40af] overflow-hidden touch-none overscroll-none select-none">
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blue-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Entro in palestra...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img 
                    src={GYM_BG} 
                    alt="Palestra della Scuola" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false}
                />
            </div>

            {/* AREE CLICCABILI DEFINITIVE */}
            {isLoaded && Object.entries(SPORT_ZONES).map(([sport, pts]) => (
                <div 
                    key={sport}
                    onClick={(e) => { e.stopPropagation(); handleZoneInteraction(sport); }}
                    className="absolute inset-0 z-10 cursor-pointer active:bg-white/10"
                    style={{ clipPath: getClipPath(pts) }}
                />
            ))}

            {isLoaded && (
                <>
                    {/* TASTO CHIUDI - DIMENSIONI RIDOTTE */}
                    <div className="absolute bottom-[4%] left-[4%] z-50 animate-in slide-in-from-bottom duration-500">
                        <button 
                            onClick={() => setView(AppView.SCHOOL)} 
                            className="hover:scale-110 active:scale-95 transition-all outline-none w-[18vw] md:w-[10vw] max-w-[160px]"
                        >
                            <img src={BTN_EXIT_IMG} alt="Esci" className="w-full h-auto drop-shadow-2xl" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SchoolGym;
