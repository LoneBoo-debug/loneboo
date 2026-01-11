
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const SCHOOL_FF_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuola+rpimopiano.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const BTN_OUT_SCHOOL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gjvjvkjv+(1)+(1).webp';

interface SchoolFirstFloorProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const SchoolFirstFloor: React.FC<SchoolFirstFloorProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    // --- COORDINATE DEFINITIVE ---
    const SAVED_ZONES: Record<string, Point[]> = {
        "1": [{"x":3.2,"y":20.98},{"x":3.73,"y":84.83},{"x":20.52,"y":76.59},{"x":21.32,"y":23.08}], 
        "2": [{"x":26.65,"y":25.03},{"x":27.19,"y":73.59},{"x":38.38,"y":68.5},{"x":38.38,"y":28.03}], 
        "3": [{"x":45.58,"y":28.78},{"x":45.31,"y":65.35},{"x":54.9,"y":60.85},{"x":55.17,"y":30.88}]
    };

    const SECOND_FLOOR_ZONE: Point[] = [
        {"x": 61.3, "y": 20.08}, {"x": 62.37, "y": 57.4}, {"x": 95.42, "y": 57.55}, {"x": 94.88, "y": 20.68}
    ];

    useEffect(() => {
        const img = new Image();
        img.src = SCHOOL_FF_BG;
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
        if (id === "1") setView(AppView.SCHOOL_FIRST_GRADE);
        else if (id === "2") setView(AppView.SCHOOL_SECOND_GRADE);
        else if (id === "3") setView(AppView.SCHOOL_THIRD_GRADE);
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#4c1d95] overflow-hidden touch-none overscroll-none select-none">
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Salgo al primo piano...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img src={SCHOOL_FF_BG} alt="" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
            </div>

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
                        onClick={(e) => { e.stopPropagation(); setView(AppView.SCHOOL_SECOND_FLOOR); }} 
                        className="absolute inset-0 z-10 cursor-pointer active:bg-white/10" 
                        style={{ clipPath: getClipPath(SECOND_FLOOR_ZONE) }} 
                    />
                </>
            )}

            {isLoaded && (
                <>
                    {/* TASTO ESCI DALLA SCUOLA IN BASSO A SINISTRA */}
                    <div className="absolute bottom-[4%] left-[4%] z-50">
                        <button 
                            onClick={() => setView(AppView.SCHOOL)} 
                            className="hover:scale-110 active:scale-95 transition-all w-[28vw] md:w-[15vw] max-w-[240px] outline-none"
                        >
                            <img src={BTN_OUT_SCHOOL_IMG} alt="Esci dalla scuola" className="w-full h-auto drop-shadow-2xl" />
                        </button>
                    </div>

                    {/* FUMETTO SUGGERIMENTO */}
                    <div className="absolute bottom-[6%] right-[5%] z-20 pointer-events-none">
                        <div className="bg-white/90 border-4 border-yellow-400 px-6 py-2 rounded-full shadow-2xl">
                            <span className="font-luckiest text-blue-900 text-xl md:text-3xl uppercase text-center block leading-tight">
                                Scegli un'aula <br className="md:hidden" /> o sali le scale!
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SchoolFirstFloor;
