
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { isNightTime } from '../services/weatherService';

const SCHOOL_SF_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfsecondfloorschool567990er.webp';
const SCHOOL_SF_NIGHT_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/secondopianoscuolanotte.webp';

// Asset Audio e Video
const SCHOOL_FLOOR_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/e6201c78-2a97-40a8-9bf4-29fbce108801.mp3';
const SECOND_AUDIO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/4cbd48eb-289c-443d-ba47-c36b82a7711a.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

interface SchoolSecondFloorProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const ZONES: Record<string, Point[]> = {
  "4": [
    { "x": 3.46, "y": 21.28 },
    { "x": 4.53, "y": 84.38 },
    { "x": 21.06, "y": 80.19 },
    { "x": 20.79, "y": 23.38 }
  ],
  "5": [
    { "x": 26.65, "y": 25.33 },
    { "x": 27.72, "y": 73.44 },
    { "x": 40.25, "y": 68.05 },
    { "x": 40.51, "y": 28.03 }
  ],
  "BACK": [
    { "x": 63.43, "y": 21.73 },
    { "x": 64.23, "y": 61.45 },
    { "x": 97.55, "y": 61.75 },
    { "x": 97.28, "y": 21.58 }
  ],
  "ARCHIVE": [
    { "x": 43.44, "y": 29.23 },
    { "x": 43.71, "y": 69.54 },
    { "x": 58.37, "y": 64 },
    { "x": 57.57, "y": 31.03 }
  ]
};

const SchoolSecondFloor: React.FC<SchoolSecondFloorProps> = ({ setView }) => {
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [currentStep, setCurrentStep] = useState(0); // 0: pronto, 1: audio1, 2: audio2, 3: finito
    
    const audio1Ref = useRef<HTMLAudioElement | null>(null);
    const audio2Ref = useRef<HTMLAudioElement | null>(null);

    const currentBg = useMemo(() => {
        return isNightTime(now) ? SCHOOL_SF_NIGHT_BG : SCHOOL_SF_BG;
    }, [now]);

    // Inizializzazione Audio Objects
    useEffect(() => {
        const img = new Image();
        img.src = currentBg;
        img.onload = () => setIsLoaded(true);

        if (!audio1Ref.current) {
            audio1Ref.current = new Audio(SCHOOL_FLOOR_VOICE_URL);
            audio1Ref.current.volume = 0.5;
            audio1Ref.current.onended = () => {
                setCurrentStep(2);
            };
        }

        if (!audio2Ref.current) {
            audio2Ref.current = new Audio(SECOND_AUDIO_URL);
            audio2Ref.current.volume = 0.4;
            audio2Ref.current.onended = () => {
                setCurrentStep(3);
            };
        }

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        return () => {
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            audio1Ref.current?.pause();
            audio2Ref.current?.pause();
            if (audio1Ref.current) audio1Ref.current.onended = null;
            if (audio2Ref.current) audio2Ref.current.onended = null;
        };
    }, [currentBg]);

    // Aggiorna l'orario ogni minuto per gestire il cambio giorno/notte
    useEffect(() => {
        const timeTimer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timeTimer);
    }, []);

    // Gestore della riproduzione basato sullo stato isAudioOn e currentStep
    useEffect(() => {
        if (!isLoaded) return;

        // Se l'audio globale è spento, ferma tutto
        if (!isAudioOn) {
            audio1Ref.current?.pause();
            audio2Ref.current?.pause();
            return;
        }

        // Se l'audio globale è acceso, gestisci la sequenza
        if (currentStep === 0) {
            setCurrentStep(1); // Inizia la sequenza
        } else if (currentStep === 1) {
            audio1Ref.current?.play().catch(e => console.log("Audio 1 blocked", e));
            audio2Ref.current?.pause();
        } else if (currentStep === 2) {
            audio1Ref.current?.pause();
            audio2Ref.current?.play().catch(e => console.log("Audio 2 blocked", e));
        } else if (currentStep === 3) {
            audio1Ref.current?.pause();
            audio2Ref.current?.pause();
        }
    }, [isLoaded, isAudioOn, currentStep]);

    const getClipPath = (pts: Point[]) => {
        if (pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneInteraction = (id: string) => {
        if (id === "4") setView(AppView.SCHOOL_FOURTH_GRADE);
        else if (id === "5") setView(AppView.SCHOOL_FIFTH_GRADE);
        else if (id === "BACK") setView(AppView.SCHOOL_FIRST_FLOOR);
        else if (id === "ARCHIVE") setView(AppView.SCHOOL_ARCHIVE);
    };

    // La mini TV è visibile se l'audio è ON e stiamo ancora riproducendo uno dei due step
    const isBooTalking = isAudioOn && (currentStep === 1 || currentStep === 2);

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

            {/* Mini TV di Boo - Visibile solo durante il parlato sequenziale */}
            {isLoaded && isBooTalking && (
                <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video 
                            src={BOO_TALK_VIDEO} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover" 
                            style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 z-0">
                <img 
                    src={currentBg} 
                    alt="" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                />
            </div>

            {/* AREE INTERATTIVE */}
            {isLoaded && (
                <>
                    {(Object.entries(ZONES) as [string, Point[]][]).map(([id, pts]) => (
                        <div 
                            key={id} 
                            onClick={(e) => { e.stopPropagation(); handleZoneInteraction(id); }} 
                            className="absolute inset-0 z-10 cursor-pointer active:bg-white/10" 
                            style={{ clipPath: getClipPath(pts) }} 
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default SchoolSecondFloor;
