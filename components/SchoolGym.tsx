
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { isNightTime } from '../services/weatherService';

const GYM_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newgymoalester554re32.webp';
const GYM_NIGHT_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/palestra+nottess.webp';
const BTN_EXIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ecifuorischool99saxwq123.webp';

// Asset Audio e Video
const GYM_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/palestraarcobalenovoiceboo3w3w.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };

// --- COORDINATE DEFINITIVE CALIBRATE ---
const INITIAL_ZONES: Record<string, Point[]> = {
  "basket": [
    { "x": 4, "y": 10.19 },
    { "x": 18.12, "y": 36.42 },
    { "x": 44.51, "y": 34.92 },
    { "x": 41.04, "y": 12.44 }
  ],
  "calcio": [
    { "x": 54.9, "y": 18.59 },
    { "x": 50.91, "y": 30.43 },
    { "x": 75.43, "y": 38.37 },
    { "x": 98.35, "y": 34.92 },
    { "x": 90.35, "y": 16.04 }
  ],
  "tennis": [
    { "x": 28.25, "y": 56.21 },
    { "x": 69.03, "y": 65.35 },
    { "x": 98.88, "y": 52.01 },
    { "x": 95.95, "y": 43.02 },
    { "x": 70.9, "y": 41.82 }
  ],
  "ginnastica": [
    { "x": 30.12, "y": 63.1 },
    { "x": 3.2, "y": 77.04 },
    { "x": 47.97, "y": 97.12 },
    { "x": 93.55, "y": 81.98 },
    { "x": 71.96, "y": 68.79 }
  ]
};

interface SchoolGymProps {
    setView: (view: AppView) => void;
}

const SchoolGym: React.FC<SchoolGymProps> = ({ setView }) => {
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentBg = useMemo(() => isNightTime(now) ? GYM_NIGHT_BG : GYM_BG, [now]);

    useEffect(() => {
        const timeTimer = setInterval(() => setNow(new Date()), 60000);
        
        const img = new Image();
        img.src = currentBg;
        img.onload = () => setIsLoaded(true);
        
        if (!audioRef.current) {
            audioRef.current = new Audio(GYM_VOICE_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
        }

        if (isAudioOn) audioRef.current.play().catch(e => console.log("Autoplay blocked", e));

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled) audioRef.current?.play().catch(() => {});
            else {
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        return () => {
            clearInterval(timeTimer);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [currentBg]);

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
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
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blue-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Entro in palestra...</span>
                </div>
            )}

            {/* Mini TV di Boo - Posizionato a SINISTRA */}
            {isLoaded && isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            {/* MAIN INTERACTIVE CONTAINER */}
            <div className="absolute inset-0 z-0">
                {/* BACKGROUND */}
                <img 
                    src={currentBg} 
                    alt="Palestra della Scuola" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false} 
                />
                
                {/* VISUALIZZATORE AREE (Interattive) */}
                {isLoaded && Object.entries(INITIAL_ZONES).map(([sport, pts]) => (
                    <div 
                        key={sport} 
                        onClick={(e) => { e.stopPropagation(); handleZoneInteraction(sport); }} 
                        className="absolute inset-0 z-10 cursor-pointer pointer-events-auto active:bg-white/10" 
                        style={{ 
                            clipPath: getClipPath(pts)
                        }} 
                    />
                ))}
            </div>

            {/* Bottom Bar Controls */}
            {isLoaded && (
                <div className="absolute bottom-[4%] left-0 right-0 flex justify-between items-end px-[4%] z-40 animate-in slide-in-from-bottom duration-500 pointer-events-none">
                    <button 
                        onClick={() => setView(AppView.SCHOOL)} 
                        className="hover:scale-110 active:scale-95 transition-all outline-none w-[18vw] md:w-[10vw] max-w-[160px] pointer-events-auto"
                    >
                        <img src={BTN_EXIT_IMG} alt="Esci" className="w-full h-auto drop-shadow-xl" />
                    </button>
                    <div /> {/* Spacer per mantenere il layout */}
                </div>
            )}
        </div>
    );
};

export default SchoolGym;
