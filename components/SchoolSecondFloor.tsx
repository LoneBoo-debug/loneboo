
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const SCHOOL_SF_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuola+secondopiano.webp';

interface SchoolSecondFloorProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const SchoolSecondFloor: React.FC<SchoolSecondFloorProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // --- COORDINATE DEFINITIVE FORNITE DALL'UTENTE ---
    const SAVED_ZONES: Record<string, Point[]> = {
        "4": [{"x":3.46,"y":21.28},{"x":4.53,"y":84.38},{"x":21.06,"y":80.19},{"x":20.79,"y":23.38}], 
        "5": [{"x":26.65,"y":25.33},{"x":27.72,"y":73.44},{"x":40.25,"y":68.05},{"x":40.51,"y":28.03}]
    };

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

    const handleZoneInteraction = (id: string) => {
        if (id === "4") setView(AppView.SCHOOL_FOURTH_GRADE);
        else if (id === "5") setView(AppView.SCHOOL_FIFTH_GRADE);
    };

    return (
        <div 
            className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#4c1d95] overflow-hidden touch-none overscroll-none select-none"
        >
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Salgo all'ultimo piano...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img src={SCHOOL_SF_BG} alt="" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* AREE INTERATTIVE ATTIVE */}
            {isLoaded && (
                <>
                    {Object.entries(SAVED_ZONES).map(([id, pts]) => pts.length > 0 && (
                        <div 
                            key={id} 
                            onClick={(e) => { e.stopPropagation(); handleZoneInteraction(id); }} 
                            className="absolute inset-0 z-10 cursor-pointer active:bg-white/10" 
                            style={{ clipPath: getClipPath(pts) }} 
                        />
                    ))}
                    <div 
                        onClick={(e) => { e.stopPropagation(); setView(AppView.SCHOOL_FIRST_FLOOR); }} 
                        className="absolute inset-0 z-10 cursor-pointer active:bg-white/10" 
                        style={{ clipPath: getClipPath(BACK_TO_FIRST_FLOOR_ZONE) }} 
                    />
                </>
            )}

            {/* UI STANDARD */}
            {isLoaded && (
                <div className="absolute bottom-[6%] right-[5%] z-20 pointer-events-none">
                    <div className="bg-white/90 border-4 border-yellow-400 px-6 py-2 rounded-full shadow-2xl">
                        <span className="font-luckiest text-blue-900 text-xl md:text-3xl uppercase tracking-tighter text-center block">
                            Scegli un'aula <br className="md:hidden" /> o torna giù!
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolSecondFloor;
