
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import DailyRewardsModal from './DailyRewardsModal';
import { monthNames } from '../services/calendarDatabase';
import { getWeatherForDate, isNightTime } from '../services/weatherService';

const DESKTOP_MAP_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mapdewsdsktp99i.webp';
const WIND_MAP_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bgventomaps.webp';
const RAIN_MAP_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bgpioggiamaps.webp';
const SNOW_MAP_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bgnevemaps.webp';

// Nuovi Asset Notturni
const NIGHT_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cittanottesoleaa.webp';
const NIGHT_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cittanottepioggia.webp';
const NIGHT_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cittanotteventoxxs.webp';
const NIGHT_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cittanottenevexx.webp';

const CALENDAR_ICON_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/477401351381209093.webp';

const CITY_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mappa+citt%C3%A0loneboovoice4re.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';
const SECOND_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/95391cac-6d62-412c-8e04-680ccb610133.mp3';
const SECOND_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpxynksh6c.mp4';

type Point = { x: number; y: number };

const MAP_AREAS_DESKTOP: Record<string, Point[]> = {
  "PLAY": [{ "x": 0.8, "y": 30.2 }, { "x": 10.83, "y": 36.39 }, { "x": 20.25, "y": 25.29 }, { "x": 14.84, "y": 18.01 }, { "x": 10.22, "y": 15.83 }, { "x": 2.71, "y": 17.65 }],
  "AI_MAGIC": [{ "x": 29.57, "y": 33.84 }, { "x": 28.87, "y": 18.74 }, { "x": 24.86, "y": 17.83 }, { "x": 25.06, "y": 29.66 }, { "x": 26.46, "y": 36.39 }],
  "BOOKS": [{ "x": 67.76, "y": 7.82 }, { "x": 67.96, "y": 23.84 }, { "x": 73.88, "y": 23.47 }, { "x": 76.18, "y": 21.83 }, { "x": 76.48, "y": 6.37 }, { "x": 73.88, "y": 3.46 }],
  "TALES": [{ "x": 86.21, "y": 29.66 }, { "x": 98.64, "y": 42.21 }, { "x": 99.14, "y": 16.56 }, { "x": 87.21, "y": 16.19 }],
  "FANART": [{ "x": 32.08, "y": 35.3 }, { "x": 43.1, "y": 39.85 }, { "x": 44.61, "y": 18.38 }, { "x": 32.88, "y": 18.01 }],
  "BOOKS_LIST": [{ "x": 58.34, "y": 16.19 }, { "x": 56.23, "y": 23.84 }, { "x": 55.93, "y": 34.21 }, { "x": 62.05, "y": 39.67 }, { "x": 66.26, "y": 36.21 }, { "x": 66.36, "y": 24.56 }, { "x": 64.66, "y": 19.29 }],
  "EMOTIONAL_GARDEN": [{ "x": 68.56, "y": 39.85 }, { "x": 61.85, "y": 54.4 }, { "x": 79.89, "y": 68.96 }, { "x": 77.39, "y": 41.3 }],
  "COMMUNITY": [{ "x": 45.81, "y": 39.3 }, { "x": 45.01, "y": 54.04 }, { "x": 50.52, "y": 58.77 }, { "x": 55.73, "y": 54.59 }, { "x": 55.33, "y": 39.48 }, { "x": 50.52, "y": 36.94 }],
  "SCHOOL": [{ "x": 27.37, "y": 46.58 }, { "x": 20.85, "y": 73.69 }, { "x": 26.36, "y": 80.6 }, { "x": 41.3, "y": 63.68 }, { "x": 36.79, "y": 47.85 }, { "x": 31.17, "y": 41.3 }],
  "COLORING": [{ "x": 32.48, "y": 77.69 }, { "x": 32.88, "y": 91.52 }, { "x": 37.29, "y": 96.43 }, { "x": 47.71, "y": 84.97 }, { "x": 47.81, "y": 72.6 }, { "x": 45.31, "y": 65.32 }],
  "VIDEOS": [{ "x": 57.34, "y": 58.41 }, { "x": 54.13, "y": 76.97 }, { "x": 61.75, "y": 85.7 }, { "x": 67.56, "y": 64.59 }, { "x": 61.45, "y": 58.77 }],
  "SOUNDS": [{ "x": 73.48, "y": 70.78 }, { "x": 65.16, "y": 78.24 }, { "x": 66.56, "y": 92.98 }, { "x": 73.38, "y": 98.07 }, { "x": 75.18, "y": 72.6 }],
  "CHAT": [{ "x": 54.53, "y": 87.52 }, { "x": 49.72, "y": 94.61 }, { "x": 50.02, "y": 98.98 }, { "x": 59.24, "y": 98.98 }, { "x": 58.24, "y": 88.06 }],
  "SOCIALS": [{ "x": 77.79, "y": 75.69 }, { "x": 78.09, "y": 92.98 }, { "x": 94.53, "y": 96.8 }, { "x": 98.94, "y": 83.88 }, { "x": 98.94, "y": 69.14 }, { "x": 94.43, "y": 63.86 }, { "x": 87.51, "y": 65.87 }],
  "BOO_GARDEN": [{ "x": 2, "y": 80.6 }, { "x": 2.71, "y": 94.98 }, { "x": 10.83, "y": 89.34 }, { "x": 8.42, "y": 77.33 }],
  "NEWSSTAND": [{ "x": 16.64, "y": 32.75 }, { "x": 16.94, "y": 49.31 }, { "x": 20.65, "y": 51.49 }, { "x": 24.66, "y": 47.49 }, { "x": 24.96, "y": 31.84 }, { "x": 20.95, "y": 29.66 }]
};

const AREA_MAPPING: Record<string, AppView> = {
    "PLAY": AppView.PLAY, "AI_MAGIC": AppView.AI_MAGIC, "BOOKS": AppView.BOOKS, "TALES": AppView.TALES, "FANART": AppView.FANART, "BOOKS_LIST": AppView.BOOKS_LIST, "EMOTIONAL_GARDEN": AppView.EMOTIONAL_GARDEN, "COMMUNITY": AppView.COMMUNITY, "SCHOOL": AppView.SCHOOL, "COLORING": AppView.COLORING, "VIDEOS": AppView.VIDEOS, "SOUNDS": AppView.SOUNDS, "CHAT": AppView.CHAT, "SOCIALS": AppView.SOCIALS, "BOO_GARDEN": AppView.BOO_GARDEN, "NEWSSTAND": AppView.NEWSSTAND
};

interface NewCityMapDesktopProps {
    setView: (view: AppView) => void;
}

const NewCityMapDesktop: React.FC<NewCityMapDesktopProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const [dialogueStep, setDialogueStep] = useState(0); 
    const [showDailyModal, setShowDailyModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = monthNames[today.getMonth()].slice(0, 3);
    
    const weather = getWeatherForDate(today);
    const isNight = isNightTime(today);

    const getBackgroundUrl = () => {
        if (isNight) {
            switch (weather) {
                case 'WIND': return NIGHT_WIND;
                case 'RAIN': return NIGHT_RAIN;
                case 'SNOW': return NIGHT_SNOW;
                default: return NIGHT_SUN;
            }
        } else {
            switch (weather) {
                case 'WIND': return WIND_MAP_URL;
                case 'RAIN': return RAIN_MAP_URL;
                case 'SNOW': return SNOW_MAP_URL;
                default: return DESKTOP_MAP_URL;
            }
        }
    };

    useEffect(() => {
        const img = new Image();
        img.src = getBackgroundUrl();
        img.onload = () => setIsLoaded(true);
        
        if (!audioRef.current) {
            audioRef.current = new Audio(CITY_VOICE_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setDialogueStep(prev => {
                    if (prev === 0) {
                        if (audioRef.current) {
                            audioRef.current.src = SECOND_VOICE_URL;
                            if (localStorage.getItem('loneboo_music_enabled') === 'true') {
                                audioRef.current.play().catch(e => console.log("Second audio blocked", e));
                            }
                        }
                        return 1;
                    } else {
                        setIsPlaying(false);
                        return prev;
                    }
                });
            });
        }

        if (isAudioOn) audioRef.current.play().catch(e => console.log("Audio play blocked", e));

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled) {
                if (audioRef.current?.paused) {
                    audioRef.current.play().catch(() => {});
                }
            } else {
                audioRef.current?.pause();
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        const timer = setTimeout(() => setIsLoaded(true), 2000);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const getPolygonPath = (pts: Point[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    return (
        <div className="relative w-full h-full bg-sky-500 overflow-hidden">
            {!isLoaded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-sky-400">
                    <img src={OFFICIAL_LOGO} alt="Loading" className="w-32 h-32 animate-spin-horizontal mb-4" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse">CARICAMENTO MAPPA...</span>
                </div>
            )}

            {isLoaded && isAudioOn && isPlaying && dialogueStep === 0 && (
                <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            {isLoaded && isAudioOn && isPlaying && dialogueStep === 1 && (
                <div className="absolute top-[280px] md:top-[420px] right-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={SECOND_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            {isLoaded && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowDailyModal(true); }}
                    className="absolute top-20 md:top-28 right-4 z-50 animate-in slide-in-from-right duration-700 hover:scale-110 active:scale-95 transition-transform outline-none"
                >
                    <div className="relative w-16 h-16 md:w-28 flex items-center justify-center">
                        <img src={CALENDAR_ICON_URL} alt="Calendario" className="w-full h-full object-contain drop-shadow-2xl" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-3 md:pt-6">
                            <span className="text-[10px] md:text-lg text-yellow-400 font-luckiest leading-none uppercase tracking-tighter mt-1" style={{ WebkitTextStroke: '1px black' }}>{currentMonth}</span>
                            <span className="text-red-600 font-black text-2xl md:text-5xl leading-none relative -top-1">{currentDay}</span>
                        </div>
                    </div>
                </button>
            )}
            
            <div className="relative w-full h-full">
                <img src={getBackgroundUrl()} alt="Nuova Mappa Desktop" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} />
                {isLoaded && Object.entries(MAP_AREAS_DESKTOP).map(([key, pts]) => {
                    const targetView = AREA_MAPPING[key];
                    if (!targetView) return null;
                    return <div 
                        key={key} 
                        onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setView(targetView);
                        }} 
                        className="absolute inset-0 cursor-pointer hover:bg-white/10 active:bg-white/20 transition-colors z-10" 
                        style={{ clipPath: getPolygonPath(pts) }} 
                        title={`Vai a ${key.replace('_', ' ')}`} 
                    />;
                })}
            </div>
            
            {showDailyModal && <DailyRewardsModal onClose={() => setShowDailyModal(false)} setView={setView} currentView={AppView.CITY_MAP} />}

            <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none opacity-20"><span className="text-white font-black text-xs uppercase tracking-[1em]">Lone Boo City</span></div>
        </div>
    );
};

export default NewCityMapDesktop;
