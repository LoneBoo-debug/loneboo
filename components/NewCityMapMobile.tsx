
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import DailyRewardsModal from './DailyRewardsModal';
import { monthNames } from '../services/calendarDatabase';
import { getWeatherForDate, isNightTime } from '../services/weatherService';

const MOBILE_MAP_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/defnewsdesd.webp';
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

const MAP_AREAS: Record<string, Point[]> = {
  "PLAY": [{ "x": 2.67, "y": 13.18 }, { "x": 2.4, "y": 27.41 }, { "x": 37.07, "y": 24.71 }, { "x": 29.07, "y": 10.93 }],
  "AI_MAGIC": [{ "x": 44.54, "y": 25.61 }, { "x": 55.48, "y": 27.71 }, { "x": 54.94, "y": 9.58 }, { "x": 44.54, "y": 9.58 }],
  "BOOKS": [{ "x": 77.08, "y": 12.73 }, { "x": 61.34, "y": 13.03 }, { "x": 61.34, "y": 24.56 }, { "x": 76.55, "y": 23.66 }],
  "TALES": [{ "x": 81.08, "y": 20.82 }, { "x": 75.75, "y": 28.75 }, { "x": 97.08, "y": 39.84 }, { "x": 98.68, "y": 20.97 }],
  "FANART": [{ "x": 0.8, "y": 29.8 }, { "x": 25.87, "y": 31.15 }, { "x": 30.14, "y": 41.63 }, { "x": 1.6, "y": 41.33 }],
  "BOOKS_LIST": [{ "x": 63.21, "y": 28.6 }, { "x": 58.68, "y": 38.34 }, { "x": 76.28, "y": 41.18 }, { "x": 78.15, "y": 31 }],
  "EMOTIONAL_GARDEN": [{ "x": 88.82, "y": 40.59 }, { "x": 71.75, "y": 49.27 }, { "x": 98.42, "y": 57.36 }, { "x": 99.22, "y": 42.53 }],
  "COMMUNITY": [{ "x": 40.27, "y": 40.29 }, { "x": 39.47, "y": 51.97 }, { "x": 61.34, "y": 51.52 }, { "x": 58.68, "y": 39.54 }],
  "SCHOOL": [{ "x": 4.27, "y": 64.7 }, { "x": 31.47, "y": 55.56 }, { "x": 16.54, "y": 42.68 }, { "x": 0.53, "y": 49.87 }],
  "COLORING": [{ "x": 24.54, "y": 75.48 }, { "x": 47.21, "y": 69.19 }, { "x": 40.81, "y": 56.46 }, { "x": 15.2, "y": 64.7 }],
  "VIDEOS": [{ "x": 55.74, "y": 63.5 }, { "x": 68.01, "y": 69.04 }, { "x": 82.41, "y": 56.31 }, { "x": 68.55, "y": 51.37 }],
  "SOUNDS": [{ "x": 77.08, "y": 72.03 }, { "x": 93.08, "y": 75.93 }, { "x": 98.68, "y": 63.35 }, { "x": 86.95, "y": 58.71 }],
  "CHAT": [{ "x": 50.14, "y": 71.14 }, { "x": 50.14, "y": 79.52 }, { "x": 65.08, "y": 78.17 }, { "x": 64.28, "y": 69.79 }],
  "SOCIALS": [{ "x": 48.81, "y": 85.81 }, { "x": 64.01, "y": 97.94 }, { "x": 98.42, "y": 91.8 }, { "x": 88.55, "y": 76.83 }],
  "BOO_GARDEN": [{ "x": 1.87, "y": 86.86 }, { "x": 4, "y": 96.15 }, { "x": 22.67, "y": 91.95 }, { "x": 18.67, "y": 83.12 }],
  "NEWSSTAND": [{ "x": 30.41, "y": 28.75 }, { "x": 32.01, "y": 39.54 }, { "x": 46.67, "y": 37.14 }, { "x": 42.41, "y": 27.56 }]
};

interface NewCityMapMobileProps {
    setView: (view: AppView) => void;
}

const NewCityMapMobile: React.FC<NewCityMapMobileProps> = ({ setView }) => {
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
                default: return MOBILE_MAP_URL;
            }
        }
    };

    useEffect(() => {
        const bgUrl = getBackgroundUrl();
        const img = new Image();
        img.src = bgUrl;
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

        // Ridotto il timeout di sicurezza a 800ms
        const timer = setTimeout(() => setIsLoaded(true), 800);
        
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
        <div className="relative w-full h-full bg-sky-400 overflow-hidden">
            {!isLoaded && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-sky-400">
                    <img src={OFFICIAL_LOGO} alt="Loading" className="w-24 h-24 animate-spin-horizontal mb-4" />
                    <span className="text-white font-black text-sm tracking-widest animate-pulse">CARICAMENTO MAPPA...</span>
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
                <div className="absolute top-[160px] md:top-[240px] right-4 z-50 animate-in zoom-in duration-500">
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
            
            <img src={getBackgroundUrl()} alt="Mappa Mobile" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} />

            {isLoaded && Object.entries(MAP_AREAS).map(([viewKey, pts]) => (
                <div 
                    key={viewKey} 
                    onPointerDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setView(viewKey as AppView);
                    }} 
                    className="absolute inset-0 cursor-pointer active:bg-white/10 transition-colors z-10" 
                    style={{ clipPath: getPolygonPath(pts) }} 
                    aria-label={`Vai a ${viewKey}`} 
                />
            ))}
            
            {showDailyModal && <DailyRewardsModal onClose={() => setShowDailyModal(false)} setView={setView} currentView={AppView.CITY_MAP} />}

            <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none opacity-20"><span className="text-white font-black text-[10px] uppercase tracking-[1em]">Lone Boo City</span></div>
        </div>
    );
};

export default NewCityMapMobile;
