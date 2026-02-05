
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { Check } from 'lucide-react';

const SCHOOL_FF_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pianischoolslsmnetray66tr+(2).webp';
const BTN_OUT_SCHOOL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ecifuorischool99saxwq123.webp';
const DISCLAIMER_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tgf65rfdxzaq10oo0o.webp';
const BTN_REOPEN_DISCLAIMER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/avvisodidatti55r3eco.webp';

// Asset Audio e Video
const SCHOOL_FLOOR_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/d7611de9-19ca-4a31-be35-45ad46be9ebf.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

interface SchoolFirstFloorProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const SchoolFirstFloor: React.FC<SchoolFirstFloorProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [showDisclaimer, setShowDisclaimer] = useState(() => {
        return localStorage.getItem('school_disclaimer_accepted') !== 'true';
    });

    const SAVED_ZONES: Record<string, Point[]> = {
        "1": [{"x":3.2,"y":20.98},{"x":3.73,"y":84.83},{"x":20.52,"y":76.59},{"x":21.32,"y":23.08}], 
        "2": [{"x":26.65,"y":25.03},{"x":27.19,"y":73.59},{"x":38.38,"y":68.5},{"x":38.38,"y":28.03}], 
        "3": [{"x":45.58,"y":28.78},{"x":45.31,"y":65.35},{"x":54.9,"y":60.85},{"x":55.17,"y":30.88}]
    };

    const SECOND_FLOOR_ZONE: Point[] = [{"x": 61.3, "y": 20.08}, {"x": 62.37, "y": 57.4}, {"x": 95.42, "y": 57.55}, {"x": 94.88, "y": 20.68}];

    useEffect(() => {
        const img = new Image();
        img.src = SCHOOL_FF_BG;
        img.onload = () => setIsLoaded(true);
        
        if (!audioRef.current) {
            audioRef.current = new Audio(SCHOOL_FLOOR_VOICE_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
        }

        if (isAudioOn && !showDisclaimer) audioRef.current.play().catch(e => console.log("Autoplay blocked", e));

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled && !showDisclaimer) audioRef.current?.play().catch(() => {});
            else {
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        const timer = setTimeout(() => setIsLoaded(true), 2500);
        window.scrollTo(0, 0);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [showDisclaimer]);

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
        localStorage.setItem('school_disclaimer_accepted', 'true');
        setShowDisclaimer(false);
        if (isAudioOn && audioRef.current) audioRef.current.play().catch(e => console.log(e));
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#4c1d95] overflow-hidden touch-none overscroll-none select-none">
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Salgo al primo piano...</span>
                </div>
            )}

            {/* Pulsante per riaprire il disclaimer - IN ALTO A DESTRA */}
            {isLoaded && !showDisclaimer && (
                <div className="absolute top-20 md:top-28 right-4 z-50 animate-in slide-in-from-right duration-500">
                    <button 
                        onClick={() => setShowDisclaimer(true)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_REOPEN_DISCLAIMER_IMG} alt="Avviso Didattico" className="w-16 h-16 md:w-24 md:h-24 drop-shadow-xl" />
                    </button>
                </div>
            )}

            {/* Mini TV di Boo - Posizionato a SINISTRA */}
            {isLoaded && !showDisclaimer && isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 z-0"><img src={SCHOOL_FF_BG} alt="" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} /></div>

            {isLoaded && (
                <>
                    {Object.entries(SAVED_ZONES).map(([id, pts]) => pts.length > 0 && (
                        <div key={id} onClick={(e) => { e.stopPropagation(); handleZoneInteraction(id); }} className={`absolute inset-0 z-10 ${showDisclaimer ? 'cursor-default' : 'cursor-pointer active:bg-white/10'}`} style={{ clipPath: getClipPath(pts) }} />
                    ))}
                    <div onClick={(e) => { e.stopPropagation(); if(!showDisclaimer) setView(AppView.SCHOOL_SECOND_FLOOR); }} className={`absolute inset-0 z-10 ${showDisclaimer ? 'cursor-default' : 'cursor-pointer active:bg-white/10'}`} style={{ clipPath: getClipPath(SECOND_FLOOR_ZONE) }} />
                </>
            )}

            {isLoaded && (
                <>
                    <div className="absolute bottom-[4%] left-[4%] z-50">
                        <button onClick={() => !showDisclaimer && setView(AppView.SCHOOL)} className={`transition-all w-[18vw] md:w-[10vw] max-w-[150px] outline-none ${showDisclaimer ? 'opacity-50 grayscale' : 'hover:scale-110 active:scale-95'}`}>
                            <img src={BTN_OUT_SCHOOL_IMG} alt="Esci dalla scuola" className="w-full h-auto drop-shadow-2xl" />
                        </button>
                    </div>
                    {!showDisclaimer && (
                        <div className="absolute bottom-[6%] right-[5%] z-20 pointer-events-none animate-in fade-in duration-500">
                            <div className="bg-white/90 border-4 border-yellow-400 px-6 py-2 rounded-full shadow-2xl"><span className="font-luckiest text-blue-900 text-xl md:text-3xl uppercase text-center block leading-tight">Scegli un'aula <br className="md:hidden" /> o sali le scale!</span></div>
                        </div>
                    )}
                </>
            )}

            {/* --- BOX DISCLAIMER OBBLIGATORIO --- */}
            {showDisclaimer && isLoaded && (
                <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] border-8 border-blue-600 p-6 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-w-lg w-full animate-in zoom-in duration-500 relative max-h-[85vh] flex flex-col overflow-hidden">
                        
                        {/* Header Modale */}
                        <div className="flex items-center gap-4 mb-6 shrink-0 border-b-4 border-blue-50 pb-4">
                            <div className="w-14 h-14 md:w-20 md:h-20 shrink-0 flex items-center justify-center">
                                <img src={DISCLAIMER_ICON_IMG} alt="Avviso" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="font-black text-blue-900 text-2xl md:text-3xl uppercase tracking-tight leading-none">Avviso Didattico</h3>
                                <p className="text-blue-500 font-bold text-xs md:text-sm uppercase tracking-widest mt-1">Leggere con attenzione</p>
                            </div>
                        </div>
                        
                        {/* Area Testo Scrollabile con formattazione seria ma accattivante */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                            <section className="bg-slate-50 p-4 rounded-2xl border-l-8 border-blue-500">
                                <p className="text-slate-800 font-bold text-base md:text-lg leading-relaxed text-justify">
                                    Le lezioni proposte all’interno di Scuola Arcobaleno sono progettate con l’obiettivo di favorire una <span className="text-blue-700 font-black">comprensione profonda e consapevole</span> dei concetti fondamentali, piuttosto che la semplice <span className="text-red-600 font-black">memorizzazione meccanica</span> di nozioni, elenchi o procedure.
                                </p>
                            </section>

                            <p className="text-slate-700 font-medium text-sm md:text-base leading-relaxed text-justify px-2">
                                I contenuti vengono presentati sotto forma di <span className="text-slate-900 font-black">sintesi guidate</span>, utilizzando un linguaggio chiaro e accessibile, adeguato all’età degli alunni, e un approccio narrativo e ragionato. Questo metodo aiuta i bambini a cogliere il significato degli argomenti trattati, a comprendere i collegamenti tra le idee e a sviluppare una visione più organica delle discipline.
                            </p>

                            <div className="bg-blue-600/5 p-4 rounded-2xl border-2 border-blue-100">
                                <p className="text-slate-800 font-bold text-sm md:text-base leading-relaxed text-justify">
                                    L’impostazione delle lezioni è pensata per <span className="text-blue-800 font-black">accompagnare e sostenere lo studio scolastico</span>, stimolando il pensiero logico, la capacità di riflessione e l’autonomia nello studio. Scuola Arcobaleno si propone come uno strumento di supporto che si integra con l’attività didattica tradizionale, <span className="text-blue-800 font-black">senza mai sostituirsi</span> ai libri di testo, agli insegnanti o ai percorsi educativi svolti in classe.
                                </p>
                            </div>

                            <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-justify px-2 border-l-4 border-slate-200">
                                Le materie e gli argomenti trattati nelle lezioni presenti nelle aule virtuali devono pertanto essere intesi <span className="text-slate-900 font-black">esclusivamente come complemento e integrazione</span> alle normali attività didattiche svolte a scuola. I contenuti non intendono in alcun modo sostituire, replicare o affiancare i programmi scolastici ufficiali ministeriali attualmente in vigore.
                            </p>

                            <section className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
                                <p className="text-slate-700 font-medium text-xs md:text-sm leading-relaxed text-justify italic">
                                    Alcune parti delle lezioni sono state sviluppate con il supporto dei più <span className="text-orange-700 font-bold">moderni strumenti di intelligenza artificiale</span>. Sebbene tali contenuti siano stati supervisionati e revisionati, è doveroso segnalare che potrebbero occasionalmente presentare imprecisioni o errori, per i quali si invita sempre al confronto con i materiali scolastici ufficiali e con il docente di riferimento.
                                </p>
                            </section>
                        </div>

                        {/* Footer Pulsante */}
                        <div className="mt-8 pt-4 border-t-2 border-slate-100 shrink-0">
                            <button 
                                onClick={handleAcceptDisclaimer} 
                                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl border-b-8 border-blue-800 hover:brightness-110 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3 text-xl shadow-xl"
                            >
                                <Check size={28} strokeWidth={4} /> HO CAPITO
                            </button>
                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-widest">Responsabilità Didattica • Lone Boo World</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolFirstFloor;
