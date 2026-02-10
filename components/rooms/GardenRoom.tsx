
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../../types';
import RoomLayout from './RoomLayout';
import DailyRewardsModal from '../DailyRewardsModal';
import { monthNames } from '../../services/calendarDatabase';
import { getWeatherForDate } from '../../services/weatherService';

const GARDEN_BG_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boohousemobiledefnewmao776gbs11.webp';
const GARDEN_BG_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/casaventobg.webp';
const GARDEN_BG_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cadapigoggisbg.webp';
const GARDEN_BG_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/casanevebge.webp';

const BTN_CITY_GO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartelvaicitygardenboo77y6t+(1).webp';
const WELCOME_SIGN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/benveniduuej33+(1)+(1).webp';
const CALENDAR_ICON_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/477401351381209093.webp';

// Asset Audio
const GARDEN_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giardinoboovoice66.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };

const HOUSE_ENTRANCE_AREA: Point[] = [
    { "x": 26.65, "y": 38.07 },
    { "x": 25.32, "y": 55.91 },
    { "x": 50.11, "y": 59.95 },
    { "x": 52.24, "y": 37.62 }
];

const GardenRoom: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showDailyModal, setShowDailyModal] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = monthNames[today.getMonth()].slice(0, 3);
    const todayWeather = getWeatherForDate(today);

    const getGardenBackground = () => {
        switch (todayWeather) {
            case 'WIND': return GARDEN_BG_WIND;
            case 'RAIN': return GARDEN_BG_RAIN;
            case 'SNOW': return GARDEN_BG_SNOW;
            default: return GARDEN_BG_SUN;
        }
    };

    useEffect(() => {
        const bgUrl = getGardenBackground();
        const img = new Image();
        img.src = bgUrl;
        img.onload = () => setIsLoaded(true);

        if (!audioRef.current) {
            audioRef.current = new Audio(GARDEN_MUSIC_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.6;
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
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const getPolygonPath = (pts: Point[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    return (
        <RoomLayout roomType={AppView.BOO_GARDEN} setView={setView} disableHint={true}>
            <div className="w-full h-full relative overflow-hidden">
                {/* Override background image dynamicamente */}
                <div className="absolute inset-0 z-0">
                    <img src={getGardenBackground()} alt="Garden" className="w-full h-full object-fill" />
                </div>
                
                {isAudioOn && isPlaying && (
                    <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                        <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                            <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                )}

                {/* TASTO CALENDARIO GIORNALIERO */}
                <button 
                    onClick={() => setShowDailyModal(true)}
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

                <div className="absolute left-6 top-[60%] -translate-y-1/2 z-20 pointer-events-none animate-in slide-in-from-left duration-1000">
                    <img src={WELCOME_SIGN} alt="Benvenuto" className="w-44 md:w-96 h-auto drop-shadow-2xl" />
                </div>

                <div onClick={() => setView(AppView.BOO_HOUSE)} className="absolute inset-0 z-30 cursor-pointer active:bg-white/10 transition-colors" style={{ clipPath: getPolygonPath(HOUSE_ENTRANCE_AREA) }} />

                <div className="absolute bottom-6 right-6 z-40">
                    <button onClick={(e) => { e.stopPropagation(); setView(AppView.CITY_MAP); }} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_CITY_GO} alt="Città" className="w-32 md:w-56 h-auto drop-shadow-2xl" />
                    </button>
                </div>

                {showDailyModal && <DailyRewardsModal onClose={() => setShowDailyModal(false)} setView={setView} currentView={AppView.BOO_GARDEN} />}
            </div>
        </RoomLayout>
    );
};

export default GardenRoom;
