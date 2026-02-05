
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import RobotHint from './RobotHint';

const BOO_HOUSE_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/house-map-mobile.webp';
const BOO_HOUSE_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/house-map-desktop.webp';

// Asset Audio
const BTN_AUDIO_ON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/musicatiicaggdg3edcde+(1).webp';
const BTN_AUDIO_OFF = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/musicadisattivusns6hsg2+(1).webp';
const HOUSE_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mappacasaboovoice44es.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };
type HouseZone = {
    id: AppView;
    label: string;
    points: Point[];
};

// ZONE MOBILE (DEFINITIVE)
const ZONES_MOBILE: HouseZone[] = [
  { "id": AppView.BOO_GARDEN, "label": "Giardino SX", "points": [ { "x": 6.13, "y": 78.43 }, { "x": 6.13, "y": 88.48 }, { "x": 32.78, "y": 88.12 }, { "x": 32.52, "y": 77.35 } ] },
  { "id": AppView.BOO_GARDEN, "label": "Giardino DX", "points": [ { "x": 66.9, "y": 78.25 }, { "x": 67.16, "y": 87.94 }, { "x": 97.81, "y": 87.58 }, { "x": 97.81, "y": 78.25 } ] },
  { "id": AppView.BOO_BEDROOM, "label": "Camera", "points": [ { "x": 9.86, "y": 45.41 }, { "x": 9.86, "y": 68.56 }, { "x": 36.51, "y": 68.74 }, { "x": 36.78, "y": 44.87 } ] },
  { "id": AppView.BOO_LIVING_ROOM, "label": "Salotto", "points": [ { "x": 46.11, "y": 13.64 }, { "x": 48.77, "y": 45.76 }, { "x": 90.09, "y": 44.87 }, { "x": 88.49, "y": 16.15 } ] },
  { "id": AppView.BOO_BATHROOM, "label": "Bagno", "points": [ { "x": 65.03, "y": 51.69 }, { "x": 64.5, "y": 68.74 }, { "x": 86.35, "y": 69.1 }, { "x": 88.22, "y": 51.51 } ] },
  { "id": AppView.BOO_KITCHEN, "label": "Cucina", "points": [ { "x": 9.59, "y": 14.9 }, { "x": 8.53, "y": 38.94 }, { "x": 36.51, "y": 39.12 }, { "x": 37.58, "y": 15.61 } ] }
];

// ZONE DESKTOP (DEFINITIVE)
const ZONES_DESKTOP: HouseZone[] = [
  {
    "id": AppView.BOO_KITCHEN,
    "label": "Cucina",
    "points": [
      { "x": 26.96, "y": 13.73 },
      { "x": 26.76, "y": 41.85 },
      { "x": 44.11, "y": 42.53 },
      { "x": 44.51, "y": 13.73 }
    ]
  },
  {
    "id": AppView.BOO_LIVING_ROOM,
    "label": "Salotto",
    "points": [
      { "x": 49.72, "y": 16.43 },
      { "x": 49.72, "y": 47.48 },
      { "x": 72.47, "y": 47.93 },
      { "x": 72.77, "y": 14.63 }
    ]
  },
  {
    "id": AppView.BOO_BEDROOM,
    "label": "Camera",
    "points": [
      { "x": 26.96, "y": 46.8 },
      { "x": 27.27, "y": 72.46 },
      { "x": 43.7, "y": 72.23 },
      { "x": 43.7, "y": 46.35 }
    ]
  },
  {
    "id": AppView.BOO_BATHROOM,
    "label": "Bagno",
    "points": [
      { "x": 57.34, "y": 53.11 },
      { "x": 57.34, "y": 72.46 },
      { "x": 72.07, "y": 72.46 },
      { "x": 72.57, "y": 52.66 }
    ]
  },
  {
    "id": AppView.BOO_GARDEN,
    "label": "Giardino",
    "points": [
      { "x": 58.44, "y": 78.53 },
      { "x": 58.74, "y": 92.26 },
      { "x": 97.43, "y": 92.03 },
      { "x": 97.73, "y": 24.53 },
      { "x": 76.88, "y": 22.28 },
      { "x": 75.28, "y": 75.61 }
    ]
  }
];

interface BooHouseProps {
    setView: (view: AppView) => void;
    lastView?: AppView | null;
}

const BooHouse: React.FC<BooHouseProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showHint, setShowHint] = useState(false);
    
    // Gestione Audio sincronizzata
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Precaricamento sfondi
        const imgMobile = new Image();
        const imgDesktop = new Image();
        
        let loadedCount = 0;
        const checkLoad = () => {
            loadedCount++;
            if (loadedCount >= 1) setIsLoaded(true);
        };

        imgMobile.onload = checkLoad;
        imgDesktop.onload = checkLoad;
        imgMobile.src = BOO_HOUSE_MOBILE;
        imgDesktop.src = BOO_HOUSE_DESKTOP;

        // Inizializza Audio
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

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled && isLoaded) {
                audioRef.current?.play().catch(() => {});
                sessionStorage.setItem('heard_audio_house', 'true');
            } else {
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        window.scrollTo(0, 0);

        const loadTimer = setTimeout(() => {
            if (!isLoaded) setIsLoaded(true);
        }, 3000);

        return () => {
            clearTimeout(loadTimer);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [isLoaded]);

    // Logica intelligente per l'avvio automatico
    useEffect(() => {
        if (isLoaded && isAudioOn && audioRef.current) {
            const alreadyHeard = sessionStorage.getItem('heard_audio_house') === 'true';
            if (!alreadyHeard) {
                audioRef.current.play().catch(e => console.log("Audio play blocked", e));
                sessionStorage.setItem('heard_audio_house', 'true');
            }
        }
    }, [isLoaded, isAudioOn]);

    const toggleAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextState = !isAudioOn;
        setIsAudioOn(nextState);
        localStorage.setItem('loneboo_music_enabled', String(nextState));
        window.dispatchEvent(new Event('loneboo_audio_changed'));
    };

    const handleInteraction = () => {
        if (showHint) setShowHint(false); 
    };

    const handleNavigation = (target: AppView) => {
        sessionStorage.setItem('boo_house_visited', 'true');
        setView(target);
    };

    const getClipPath = (points: Point[]) => {
        if (!points || points.length < 3) return 'none';
        const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
        return `polygon(${poly})`;
    };

    const renderZones = (isDesktop: boolean) => {
        const activeZones = isDesktop ? ZONES_DESKTOP : ZONES_MOBILE;

        return activeZones.map((zone, index) => {
            if (!zone.points || zone.points.length < 3) return null;

            return (
                <div
                    key={`${isDesktop ? 'desk' : 'mob'}-${zone.id}-${index}`}
                    onClick={(e) => { e.stopPropagation(); handleNavigation(zone.id); }}
                    className="absolute inset-0 cursor-pointer group"
                    style={{ clipPath: getClipPath(zone.points) }}
                    title={`Vai a: ${zone.label}`}
                ></div>
            );
        });
    };

    return (
        <div 
            className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col"
            onClick={handleInteraction}
        >
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-orange-200/90 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                    <span className="text-white font-bold text-lg tracking-widest animate-pulse">STO CARICANDO...</span>
                </div>
            )}

            {isLoaded && (
                <div className="absolute top-20 md:top-28 right-4 z-[110] animate-in slide-in-from-right duration-700 pointer-events-auto">
                    <button onClick={toggleAudio} className="hover:scale-110 active:scale-95 transition-transform outline-none">
                        <img src={isAudioOn ? BTN_AUDIO_ON : BTN_AUDIO_OFF} alt="Musica" className="w-16 md:w-28 h-auto drop-shadow-lg" />
                    </button>
                </div>
            )}

            {isLoaded && isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            <div className="block md:hidden w-full h-full relative overflow-hidden">
                <div className="w-full h-full relative">
                    <img src={BOO_HOUSE_MOBILE} alt="" className={`w-full h-full object-fill transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                    {isLoaded && renderZones(false)}
                </div>
            </div>

            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <div className="w-full h-full relative">
                    <img src={BOO_HOUSE_DESKTOP} alt="" className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                    {isLoaded && renderZones(true)}
                </div>
            </div>
        </div>
    );
};

export default BooHouse;
