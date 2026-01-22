
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { Check } from 'lucide-react';

const SCHOOL_FF_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuola+rpimopiano.webp';
const BTN_OUT_SCHOOL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gjvjvkjv+(1)+(1).webp';
const DISCLAIMER_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tgf65rfdxzaq10oo0o.webp';

interface SchoolFirstFloorProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const SchoolFirstFloor: React.FC<SchoolFirstFloorProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    // Inizializza showDisclaimer controllando se è già stato accettato in questa sessione
    const [showDisclaimer, setShowDisclaimer] = useState(() => {
        return sessionStorage.getItem('school_disclaimer_accepted') !== 'true';
    });

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
        if (showDisclaimer) return;
        if (id === "1") setView(AppView.SCHOOL_FIRST_GRADE);
        else if (id === "2") setView(AppView.SCHOOL_SECOND_GRADE);
        else if (id === "3") setView(AppView.SCHOOL_THIRD_GRADE);
    };

    const handleAcceptDisclaimer = () => {
        sessionStorage.setItem('school_disclaimer_accepted', 'true');
        setShowDisclaimer(false);
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
                            className={`absolute inset-0 z-10 ${showDisclaimer ? 'cursor-default' : 'cursor-pointer active:bg-white/10'}`} 
                            style={{ clipPath: getClipPath(pts) }} 
                        />
                    ))}
                    <div 
                        onClick={(e) => { e.stopPropagation(); if(!showDisclaimer) setView(AppView.SCHOOL_SECOND_FLOOR); }} 
                        className={`absolute inset-0 z-10 ${showDisclaimer ? 'cursor-default' : 'cursor-pointer active:bg-white/10'}`} 
                        style={{ clipPath: getClipPath(SECOND_FLOOR_ZONE) }} 
                    />
                </>
            )}

            {isLoaded && (
                <>
                    {/* TASTO ESCI DALLA SCUOLA IN BASSO A SINISTRA */}
                    <div className="absolute bottom-[4%] left-[4%] z-50">
                        <button 
                            onClick={() => !showDisclaimer && setView(AppView.SCHOOL)} 
                            className={`transition-all w-[28vw] md:w-[15vw] max-w-[240px] outline-none ${showDisclaimer ? 'opacity-50 grayscale' : 'hover:scale-110 active:scale-95'}`}
                        >
                            <img src={BTN_OUT_SCHOOL_IMG} alt="Esci dalla scuola" className="w-full h-auto drop-shadow-2xl" />
                        </button>
                    </div>

                    {/* FUMETTO SUGGERIMENTO */}
                    {!showDisclaimer && (
                        <div className="absolute bottom-[6%] right-[5%] z-20 pointer-events-none animate-in fade-in duration-500">
                            <div className="bg-white/90 border-4 border-yellow-400 px-6 py-2 rounded-full shadow-2xl">
                                <span className="font-luckiest text-blue-900 text-xl md:text-3xl uppercase text-center block leading-tight">
                                    Scegli un'aula <br className="md:hidden" /> o sali le scale!
                                </span>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* --- BOX DISCLAIMER OBBLIGATORIO --- */}
            {showDisclaimer && isLoaded && (
                <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[2px] flex items-start justify-start p-4 pt-24 md:pt-32">
                    <div className="bg-white rounded-[2.5rem] border-8 border-blue-600 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-sm md:max-w-md animate-in slide-in-from-left duration-500 relative max-h-[75vh] flex flex-col">
                        <div className="flex items-center gap-3 mb-4 shrink-0">
                            <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 flex items-center justify-center">
                                <img 
                                    src={DISCLAIMER_ICON_IMG} 
                                    alt="Avviso" 
                                    className="w-full h-full object-contain drop-shadow-sm" 
                                />
                            </div>
                            <h3 className="font-black text-blue-900 text-lg md:text-xl uppercase tracking-tight leading-none">Avviso Didattico</h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
                            <p className="text-slate-800 font-bold text-sm md:text-lg leading-relaxed mb-4 text-justify">
                                Le lezioni proposte nell’app sono pensate per favorire la comprensione dei concetti fondamentali, più che la memorizzazione meccanica di informazioni, elenchi o procedure.
                                <br/><br/>
                                I contenuti vengono presentati come sintesi guidate, con un linguaggio accessibile e un approccio narrativo e ragionato, per aiutare l’alunno a cogliere il significato degli argomenti e i collegamenti tra le idee.
                                <br/><br/>
                                Questo metodo accompagna lo studio scolastico, sostenendo lo sviluppo del pensiero logico, della capacità di riflessione e di una comprensione consapevole, in integrazione con i programmi e i materiali adottati a scuola.
                            </p>
                            <p className="text-slate-600 font-bold text-xs md:text-base leading-relaxed mb-8 text-justify opacity-80">
                                Le materie e gli argomenti trattati nelle lezioni all'interno delle aule sono da intendersi esclusivamente come complemento e integrazione alle normali attività didattiche reali. Non intendono in alcun modo sostituire o affiancare i programmi scolastici ufficiali ministeriali attualmente in vigore.
                            </p>
                        </div>

                        <button 
                            onClick={handleAcceptDisclaimer}
                            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl border-b-6 border-blue-800 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-lg shadow-lg shrink-0"
                        >
                            <Check size={24} strokeWidth={4} /> HO CAPITO
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolFirstFloor;
