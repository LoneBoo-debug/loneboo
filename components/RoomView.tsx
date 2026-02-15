
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { isNightTime } from '../services/weatherService';

// --- ASSET MAPPA ---
const HOUSE_MAP_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newmapscasaboonews445re3.webp';
const HOUSE_MAP_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newmapcasaboonughtsaqw.webp';

const HOUSE_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mappacasaboovoice44es.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };

// Aree cliccabili calibrate definitive
const HOUSE_ZONES: { id: AppView; points: Point[] }[] = [
    {
        id: AppView.BOO_KITCHEN,
        points: [{ "x": 3.2, "y": 14.99 }, { "x": 2.4, "y": 48.58 }, { "x": 43.73, "y": 48.43 }, { "x": 42.4, "y": 14.54 }]
    },
    {
        id: AppView.BOO_BEDROOM,
        points: [{ "x": 2.93, "y": 53.22 }, { "x": 2.67, "y": 81.86 }, { "x": 42.93, "y": 82.46 }, { "x": 42.93, "y": 53.22 }]
    },
    {
        id: AppView.BOO_LIVING_ROOM,
        points: [{ "x": 50.67, "y": 14.84 }, { "x": 51.2, "y": 50.82 }, { "x": 96.53, "y": 50.52 }, { "x": 96.27, "y": 15.59 }]
    },
    {
        id: AppView.BOO_BATHROOM,
        points: [{ "x": 69.07, "y": 56.37 }, { "x": 68.27, "y": 82.31 }, { "x": 96.8, "y": 82.16 }, { "x": 97.33, "y": 56.37 }]
    },
    {
        id: AppView.BOO_GARDEN,
        points: [{ "x": 3.73, "y": 90.4 }, { "x": 3.47, "y": 97.9 }, { "x": 40.8, "y": 98.65 }, { "x": 40.27, "y": 88.91 }]
    },
    {
        id: AppView.BOO_GARDEN,
        points: [{ "x": 69.6, "y": 89.51 }, { "x": 69.07, "y": 98.95 }, { "x": 97.07, "y": 98.35 }, { "x": 96.27, "y": 89.36 }]
    }
];

const RoomView: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentMapImage = useMemo(() => isNightTime(now) ? HOUSE_MAP_NIGHT : HOUSE_MAP_DAY, [now]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        
        const img = new Image();
        img.src = currentMapImage;
        img.onload = () => setIsLoaded(true);
        
        if (!audioRef.current) {
            audioRef.current = new Audio(HOUSE_MUSIC_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
        }

        if (isAudioOn && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }

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
            clearInterval(timer);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [currentMapImage]);

    const getClipPath = (points: Point[]) => {
        if (!points || points.length < 3) return 'none';
        return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <div className="fixed inset-0 z-0 bg-black overflow-hidden select-none touch-none animate-in fade-in duration-700">
             {!isLoaded && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-indigo-900">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Entro in casa...</span>
                </div>
            )}

            {/* Mini TV di Boo */}
            {isLoaded && isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img src={currentMapImage} alt="Casa di Boo" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} />
                
                {/* ZONE CLICCABILI CALIBRATE */}
                {isLoaded && HOUSE_ZONES.map((zone, idx) => (
                    <div 
                        key={`${zone.id}-${idx}`} 
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setView(zone.id);
                        }} 
                        className="absolute inset-0 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-colors z-10" 
                        style={{ clipPath: getClipPath(zone.points) }} 
                    />
                ))}
            </div>
        </div>
    );
};

export default RoomView;
