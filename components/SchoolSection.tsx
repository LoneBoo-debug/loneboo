
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { getWeatherForDate, isNightTime } from '../services/weatherService';
import DailyRewardsModal from './DailyRewardsModal';
import { monthNames } from '../services/calendarDatabase';

const SCHOOL_SPLASH_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scoolentrancearaindows33wa.webp';
const SCHOOL_SPLASH_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolapiggoaera.webp';
const SCHOOL_SPLASH_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolaventoerssa.webp';
const SCHOOL_SPLASH_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolaneveaaoseoa.webp';

const SCHOOL_NIGHT_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolanottesolexaz.webp';
const SCHOOL_NIGHT_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolanottepioggiaes.webp';
const SCHOOL_NIGHT_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolanotteventoxsa.webp';
const SCHOOL_NIGHT_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolanottenevexxz.webp';

const BTN_BACK_CITY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vai+icitt%C3%A0schollong877webswq.webp';
const BTN_GYM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/viainpalestrschoolnwespng55r4.webp';
const CLOCK_SCREEN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/schermosvegliatuagiornuere.webp';

const SCHOOL_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolarcobalenovoiceboo6tr4.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

// Parametri sveglia consolidati
const CLOCK_STYLE = {
    top: 56,
    right: 4,
    iconSize: 82,
    timeSize: 23,
    dateSize: 13,
    paddingTop: 0,
    iconScaleY: 0.74
};

interface SchoolSectionProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

const SchoolSection: React.FC<SchoolSectionProps> = ({ setView }) => {
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const [showDailyModal, setShowDailyModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const todayWeather = useMemo(() => getWeatherForDate(now), [now]);

    // Formattazione data e ora per lo schermo della sveglia
    const dayNamesShort = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
    const currentDay = now.getDate();
    const currentDayName = dayNamesShort[now.getDay()];
    const currentMonthShort = monthNames[now.getMonth()].slice(0, 3).toUpperCase();
    const currentTimeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const currentDateStr = `${currentDayName} ${currentDay} ${currentMonthShort}`;

    const currentBg = useMemo(() => {
        const isNight = isNightTime(now);
        if (isNight) {
            switch (todayWeather) {
                case 'RAIN': return SCHOOL_NIGHT_RAIN;
                case 'WIND': return SCHOOL_NIGHT_WIND;
                case 'SNOW': return SCHOOL_NIGHT_SNOW;
                default: return SCHOOL_NIGHT_SUN;
            }
        } else {
            switch (todayWeather) {
                case 'RAIN': return SCHOOL_SPLASH_RAIN;
                case 'WIND': return SCHOOL_SPLASH_WIND;
                case 'SNOW': return SCHOOL_SPLASH_SNOW;
                default: return SCHOOL_SPLASH_SUN;
            }
        }
    }, [todayWeather, now]);

    const FIRST_FLOOR_ZONE: Point[] = [
        { "x": 29.85, "y": 31.77 },
        { "x": 28.25, "y": 67.15 },
        { "x": 73.03, "y": 67.6 },
        { "x": 72.23, "y": 31.32 }
    ];

    // Inizializzazione Audio al montaggio
    useEffect(() => {
        if (!audioRef.current) {
            const audio = new Audio(SCHOOL_VOICE_URL);
            audio.loop = false;
            audio.volume = 1.0;
            audio.preload = "auto";
            
            audio.addEventListener('play', () => setIsPlaying(true));
            audio.addEventListener('pause', () => setIsPlaying(false));
            audio.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
            audioRef.current = audio;
        }

        const timeTimer = setInterval(() => setNow(new Date()), 1000);
        
        return () => {
            clearInterval(timeTimer);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    // Gestione tentativi di riproduzione
    const tryPlayAudio = () => {
        const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
        if (enabled && audioRef.current) {
            audioRef.current.load();
            audioRef.current.play()
                .catch(e => {
                    console.warn("Audio intro blocked by browser. Interaction needed.", e);
                });
        }
    };

    // Effetto per il caricamento dell'immagine e trigger audio
    useEffect(() => {
        const img = new Image();
        img.src = currentBg;
        img.onload = () => {
            setIsLoaded(true);
            tryPlayAudio();
        };
        img.onerror = () => {
            setIsLoaded(true);
            tryPlayAudio();
        };

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled) {
                tryPlayAudio();
            } else {
                audioRef.current?.pause();
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);
        
        return () => {
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
        };
    }, [currentBg]);

    const handleScreenTouch = () => {
        if (isAudioOn && !isPlaying) {
            tryPlayAudio();
        }
    };

    const getClipPath = (pts: Point[]) => {
        if (pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleZoneClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setView(AppView.SCHOOL_FIRST_FLOOR);
    };

    const handleExit = () => {
        const origin = sessionStorage.getItem('school_origin') as AppView;
        if (origin && Object.values(AppView).includes(origin)) {
            setView(origin);
        } else {
            setView(AppView.CITY_MAP);
        }
        sessionStorage.removeItem('school_origin');
    };

    return (
        <div 
            className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#4c1d95] overflow-hidden touch-none overscroll-none select-none"
            onClick={handleScreenTouch}
        >
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Apro la Scuola...</span>
                </div>
            )}

            {isLoaded && isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            {/* SVEGLIA - LA TUA GIORNATA (STESSA DEL GIARDINO) */}
            {isLoaded && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowDailyModal(true); }}
                    className="absolute z-50 transition-transform outline-none group hover:scale-105 active:scale-95"
                    style={{ 
                        top: `${CLOCK_STYLE.top}px`, 
                        right: `${CLOCK_STYLE.right}px`
                    }}
                >
                    <div 
                        className="relative flex items-center justify-center"
                        style={{ width: `${CLOCK_STYLE.iconSize}px`, height: `${CLOCK_STYLE.iconSize}px` }}
                    >
                        <img 
                            src={CLOCK_SCREEN_IMG} 
                            alt="Sveglia" 
                            className="w-full h-full object-contain drop-shadow-2xl" 
                            style={{ transform: `scaleY(${CLOCK_STYLE.iconScaleY})` }}
                        />
                        
                        <div 
                            className="absolute inset-0 flex flex-col items-center justify-center"
                            style={{ paddingTop: `${CLOCK_STYLE.paddingTop}px` }}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span 
                                    className="font-luckiest text-orange-500 leading-none drop-shadow-sm"
                                    style={{ 
                                        WebkitTextStroke: '0.5px #431407',
                                        fontSize: `${CLOCK_STYLE.timeSize}px`
                                    }}
                                >
                                    {currentTimeStr}
                                </span>
                                <span 
                                    className="font-luckiest text-orange-500 uppercase tracking-tighter leading-none mt-0.5 opacity-90"
                                    style={{ 
                                        WebkitTextStroke: '0.3px #431407',
                                        fontSize: `${CLOCK_STYLE.dateSize}px`
                                    }}
                                >
                                    {currentDateStr}
                                </span>
                            </div>
                        </div>
                    </div>
                </button>
            )}

            <div className="absolute inset-0 z-0">
                <img src={currentBg} alt="Scuola di Lone Boo" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} />
            </div>

            {isLoaded && (
                <div onClick={handleZoneClick} className="absolute inset-0 z-10 cursor-pointer active:bg-white/10" style={{ clipPath: getClipPath(FIRST_FLOOR_ZONE) }} />
            )}

            {isLoaded && (
                <>
                    <div className="absolute bottom-[4%] left-[4%] z-40 pointer-events-auto w-[18vw] md:w-[10vw] max-w-[160px]">
                        <button onClick={handleExit} className="w-full hover:scale-105 active:scale-95 transition-all outline-none">
                            <img src={BTN_BACK_CITY_IMG} alt="Torna" className="w-full h-auto drop-shadow-2xl" />
                        </button>
                    </div>
                    <div className="absolute bottom-[4%] right-[4%] z-40 pointer-events-auto w-[18vw] md:w-[10vw] max-w-[160px]">
                        <button onClick={() => setView(AppView.SCHOOL_GYM)} className="w-full hover:scale-105 active:scale-95 transition-all outline-none">
                            <img src={BTN_GYM_IMG} alt="Vai in Palestra" className="w-full h-auto drop-shadow-2xl" />
                        </button>
                    </div>
                </>
            )}

            {showDailyModal && <DailyRewardsModal onClose={() => setShowDailyModal(false)} setView={setView} currentView={AppView.SCHOOL} />}
        </div>
    );
};

export default SchoolSection;
