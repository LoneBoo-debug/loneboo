
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AppView } from '../types';
import { X, Timer, MapPin, Check, AlertCircle, ZoomIn, List, Info, ArrowUpRight, Sun, Cloud, CloudRain } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';
import { getProgress, spendTokens } from '../services/tokens';
import { isNightTime } from '../services/weatherService';
import DailyRewardsModal from './DailyRewardsModal';
import { monthNames } from '../services/calendarDatabase';

const MAP_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/biglietteriadovevai887xs32.webp';
const MAP_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/biglietterinotteasx.webp';
const TRAVEL_VIDEO_DAY_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trinasewsq.mp4';
const TRAVEL_VIDEO_NIGHT_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/viaggio+notte.mp4';
const TRAVEL_CENTER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trinviagibimbd45f42.webp';
const TRAIN_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/freesound_community-train-yokosuka-79155.mp3';
const CHIME_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/subway-station-chime-100558.mp3';
const BTN_PAY_AND_GO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/paga+e+parti44edfdsdcvfrd.webp';
const BTN_SECRET_MAP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/5t4rft5egr+(1)+(1).webp';
const IMG_ZOOMABLE_MAP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/caricsfondcittaaltre55tf4.webp';
const BTN_BACK_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tornacuty55frxxw21+(1).webp';
const BTN_RETURN_TO_CITY_GRAF = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bacdsthecity67676.webp';
const CLOCK_SCREEN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/schermosvegliatuagiornuere.webp';

// Asset Marlo Capostazione
const MARLO_STATION_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/marlocapostatione443.mp4';
const MARLO_STATION_AUDIO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/22e87f1b-5836-4444-9fd1-32cbeffe7de1.mp3';

// Asset Meteo
const ICON_WEATHER_SUNNY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/soleggiatoviaggio43ed23edc.webp';
const ICON_WEATHER_CLOUDY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvolosoviaggio883ujws.webp';
const ICON_WEATHER_RAINY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tempestaviaggio88.webp';

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

interface TrainJourneyPlaceholderProps {
    setView: (view: AppView) => void;
}

type Point = { x: number; y: number };

interface ZoneInfo {
    id: AppView;
    name: string;
    cost: number;
    points: Point[];
    labelPos: Point;
    ticketImg: string;
    duration: string;
    distance: string;
    travelTimeMs: number; 
    maxKm: number;
    maxMinutes: number; 
    pathPoints: Point[];
}

const FINAL_ZONES: ZoneInfo[] = [
    {
        id: AppView.RAINBOW_CITY,
        name: "Città degli Arcobaleni",
        cost: 0,
        points: [{ x: 52.24, y: 81.98 }, { x: 52.24, y: 92.18 }, { x: 95.68, y: 91.88 }, { x: 96.22, y: 82.13 }],
        labelPos: { x: 94, y: 93.5 },
        ticketImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bigliettocittaarcobaleni775f.webp',
        duration: "4 ore",
        distance: "55 km",
        travelTimeMs: 10000, 
        maxKm: 55,
        maxMinutes: 240,
        pathPoints: [
            {"x": 44.61,"y": 26.14},{"x": 48.98,"y": 26.98},{"x": 53.35,"y": 26.31},{"x": 55.98,"y": 24.62},{"x": 57.14,"y": 21.42},
            {"x": 57.14,"y": 19.56},{"x": 58.89,"y": 17.03},{"x": 62.39,"y": 16.02},{"x": 66.76,"y": 15.51},{"x": 71.14,"y": 15.18},
            {"x": 74.64,"y": 14.84},{"x": 79.88,"y": 15.18},{"x": 83.38,"y": 15.18},{"x": 86.3,"y": 15.68},{"x": 83.38,"y": 15.18},{"x": 86.3,"y": 15.68},{"x": 88.63,"y": 16.53},
            {"x": 90.38,"y": 17.2},{"x": 92.71,"y": 18.21},{"x": 95.63,"y": 18.72},{"x": 96.5,"y": 19.9},{"x": 96.21,"y": 23.27},
            {"x": 96.5,"y": 25.46},{"x": 97.38,"y": 27.82},{"x": 97.38,"y": 30.19},{"x": 97.08,"y": 33.56},{"x": 97.08,"y": 35.75},
            {"x": 97.08,"y": 37.44},{"x": 96.5,"y": 40.13},{"x": 96.5,"y": 41.65},{"x": 97.08,"y": 43.68},{"x": 97.08,"y": 45.19},
            {"x": 97.38,"y": 47.55},{"x": 97.38,"y": 48.9},{"x": 97.67,"y": 51.26},{"x": 96.5,"y": 52.78},{"x": 94.17,"y": 53.79},
            {"x": 91.25,"y": 55.31},{"x": 87.46,"y": 55.65},{"x": 84.84,"y": 56.16},{"x": 82.8,"y": 56.66},{"x": 79.59,"y": 57.34},
            {"x": 76.97,"y": 57.67},{"x": 74.93,"y": 58.85},{"x": 72.89,"y": 59.36},{"x": 70.85,"y": 60.88},{"x": 68.22,"y": 62.23},
            {"x": 65.6,"y": 63.74},{"x": 62.68,"y": 65.26},{"x": 60.35,"y": 67.12},{"x": 56.85,"y": 68.97},
            {"x": 53.94,"y": 69.31},{"x": 50.73,"y": 69.31},{"x": 46.65,"y": 69.31},{"x": 43.15,"y": 69.31},{"x": 40.52,"y": 70.83},
            {"x": 39.94,"y": 72.85},{"x": 39.94,"y": 74.87},{"x": 39.94,"y": 76.73},{"x": 38.78,"y": 78.75},{"x": 37.32,"y": 79.09},
            {"x": 36.15,"y": 80.27},{"x": 36.44,"y": 81.96},{"x": 38.19,"y": 83.98},{"x": 42.27,"y": 83.64},{"x": 47.23,"y": 84.65},
            {"x": 51.02,"y": 83.81},{"x": 53.64,"y": 83.64},{"x": 56.27,"y": 83.31},{"x": 59.48,"y": 82.97}
        ]
    },
    {
        id: AppView.GRAY_CITY,
        name: "Città Grigia",
        cost: 0,
        points: [{ x: 4, y: 68.35 }, { x: 3.73, y: 78.39 }, { x: 46.91, y: 78.69 }, { x: 47.17, y: 68.5 }],
        labelPos: { x: 45, y: 79.5 },
        ticketImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bigliettcittagrigidsk45.webp',
        duration: "1 ora",
        distance: "15 km",
        travelTimeMs: 10000,
        maxKm: 15,
        maxMinutes: 60,
        pathPoints: [
            {"x": 46.94,"y": 26.31},{"x": 49.85,"y": 27.15},{"x": 53.64,"y": 26.14},{"x": 55.98,"y": 24.62},{"x": 56.56,"y": 22.09},
            {"x": 57.14,"y": 19.73},{"x": 58.31,"y": 17.54},{"x": 61.52,"y": 17.03},{"x": 65.89,"y": 15.85},{"x": 69.39,"y": 15.51},
            {"x": 72.01,"y": 15.51},{"x": 74.93,"y": 14.84}
        ]
    },
    {
        id: AppView.MOUNTAIN_CITY,
        name: "Città delle Montagne",
        cost: 0,
        points: [{ x: 3.73, y: 81.98 }, { x: 4, y: 92.33 }, { x: 46.64, y: 92.48 }, { x: 47.17, y: 81.83 }],
        labelPos: { x: 45, y: 93.5 },
        ticketImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/biglietocittamontagnej55eed.webp',
        duration: "3 ore",
        distance: "45 km",
        travelTimeMs: 10000,
        maxKm: 45,
        maxMinutes: 180,
        pathPoints: [
            {"x": 47.81,"y": 25.8},{"x": 51.6,"y": 26.31},{"x": 56.56,"y": 24.96},{"x": 56.85,"y": 22.43},{"x": 56.85,"y": 19.39},
            {"x": 58.89,"y": 17.54},{"x": 62.68,"y": 15.85},{"x": 67.35,"y": 15.85},{"x": 73.47,"y": 15.18},{"x": 78.72,"y": 14.84},
            {"x": 83.38,"y": 15.51},{"x": 86.88,"y": 15.51},{"x": 91.84,"y": 17.03},{"x": 94.17,"y": 18.04},{"x": 96.5,"y": 19.73},
            {"x": 96.21,"y": 21.75},{"x": 96.5,"y": 24.28},{"x": 96.79,"y": 27.49},{"x": 96.5,"y": 30.86},{"x": 97.08,"y": 33.73},
            {"x": 96.21,"y": 36.59},{"x": 96.5,"y": 39.8},{"x": 97.08,"y": 42.66},{"x": 96.5,"y": 46.37},{"x": 96.5,"y": 48.74},
            {"x": 96.79,"y": 51.26},{"x": 94.17,"y": 52.95},{"x": 90.96,"y": 54.64},{"x": 87.46,"y": 55.65},{"x": 83.38,"y": 56.49},
            {"x": 80.17,"y": 57},{"x": 76.97,"y": 58.01},{"x": 72.01,"y": 59.87},{"x": 68.8,"y": 61.72},{"x": 65.6,"y": 63.91},
            {"x": 61.81,"y": 65.6},{"x": 59.48,"y": 67.28},{"x": 56.85,"y": 68.63},{"x": 52.77,"y": 69.81},{"x": 49.85,"y": 69.31},
            {"x": 44.9,"y": 68.97},{"x": 42.86,"y": 70.83},{"x": 37.32,"y": 72.68},{"x": 40.52,"y": 73.36},{"x": 39.07,"y": 76.39},
            {"x": 35.86,"y": 78.25},{"x": 31.2,"y": 78.41},{"x": 27.99,"y": 77.91},{"x": 25.95,"y": 76.22},{"x": 24.49,"y": 75.04},
            {"x": 20.7, "y": 73.69},{"x": 22.45,"y": 72.18},{"x": 22.74,"y": 70.49}
        ]
    },
    {
        id: AppView.LAKE_CITY,
        name: "Città dei Laghi",
        cost: 0,
        points: [{ x: 52.77, y: 68.2 }, { x: 52.77, y: 78.39 }, { x: 95.95, y: 78.54 }, { x: 96.22, y: 68.79 }],
        labelPos: { x: 94, y: 79.5 },
        ticketImg: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bigliecittadeilaghir43ws2.webp',
        duration: "1 ora 30 minuti",
        distance: "20 km",
        travelTimeMs: 10000,
        maxKm: 20,
        maxMinutes: 90,
        pathPoints: [
            {"x": 47.23,"y": 26.14},{"x": 51.6,"y": 26.48},{"x": 54.81,"y": 25.46},{"x": 55.98,"y": 23.61},{"x": 55.98,"y": 20.24},
            {"x": 57.73,"y": 17.88},{"x": 60.93,"y": 16.69},{"x": 65.01,"y": 15.85},{"x": 69.97,"y": 15.51},{"x": 74.93,"y": 15.51},
            {"x": 79.59,"y": 15.18},{"x": 83.09,"y": 15.68},{"x": 87.76,"y": 16.19},{"x": 89.5,"y": 17.03},{"x": 94.75,"y": 18.89},
            {"x": 95.63,"y": 19.56},{"x": 96.79,"y": 21.92},{"x": 95.04,"y": 24.79},{"x": 93,"y": 25.63},{"x": 90.38,"y": 27.32},
            {"x": 87.17,"y": 28.16},{"x": 83.67,"y": 30.35},{"x": 79.59,"y": 31.87},{"x": 77.55,"y": 33.05},{"x": 77.55,"y": 33.56},
            {"x": 74.05,"y": 34.91},{"x": 70.85,"y": 35.58},{"x": 67.06,"y": 36.93},{"x": 62.1,"y": 37.77},{"x": 59.48,"y": 39.12},
            {"x": 54.81,"y": 39.12},{"x": 52.77,"y": 41.32},{"x": 48.4,"y": 41.15},{"x": 45.77,"y": 40.3},{"x": 42.86,"y": 38.95}
        ]
    }
];

const MapImageModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isLegendExpanded, setIsLegendExpanded] = useState(false);

    return (
        <div className="fixed inset-0 z-[600] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
            <button className="absolute top-24 right-6 text-white bg-red-600 p-3 rounded-full border-4 border-white shadow-xl hover:scale-110 active:scale-95 transition-all z-10" onClick={onClose}>
                <X size={32} strokeWidth={4} />
            </button>
            
            <div className="relative bg-white p-4 rounded-[40px] border-8 border-yellow-400 shadow-2xl max-w-4xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="relative overflow-hidden rounded-2xl">
                    <img 
                        src={IMG_ZOOMABLE_MAP} 
                        alt="Mappa dei Percorsi" 
                        className="w-full h-auto block select-none"
                    />

                    {!isLegendExpanded && (
                        <div 
                            onClick={() => setIsLegendExpanded(true)}
                            className="absolute bottom-1 left-1 right-1 z-20 bg-black/80 backdrop-blur-md rounded-xl border-2 border-white/20 p-2 text-white shadow-2xl cursor-pointer hover:bg-black/90 active:scale-[0.99] transition-all group flex flex-row justify-between items-center"
                        >
                            <div className="flex flex-row gap-4 items-center overflow-hidden flex-1">
                                {FINAL_ZONES.map(z => (
                                    <div key={z.id} className="flex flex-col gap-0 border-r last:border-r-0 border-white/10 px-2 shrink-0">
                                        <span className="font-black text-[7px] md:text-[9px] uppercase text-blue-300 truncate max-w-[60px] md:max-w-[100px]">{z.name.replace('Città ', '')}</span>
                                        <div className="flex gap-2 text-[6px] md:text-[8px] font-bold opacity-60">
                                            <span>{z.distance}</span>
                                            <span>{z.cost}🪙</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 shrink-0 bg-blue-600 px-2 py-1 rounded-lg animate-pulse">
                                <Info size={12} />
                                <span className="text-[8px] md:text-[10px] font-black uppercase">Dettagli</span>
                            </div>
                        </div>
                    )}

                    {isLegendExpanded && (
                        <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in duration-300">
                            <div className="bg-black/40 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] border-4 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
                                <div className="bg-blue-600/80 p-3 md:p-4 flex justify-between items-center text-white shrink-0">
                                    <div className="flex items-center gap-2">
                                        <List size={20} className="text-yellow-400" />
                                        <h3 className="text-lg md:text-xl font-black uppercase tracking-widest">Tabella Percorsi</h3>
                                    </div>
                                    <button 
                                        onClick={() => setIsLegendExpanded(false)}
                                        className="bg-red-500 text-white p-1.5 rounded-full border-2 border-white hover:scale-110 active:scale-95 transition-all"
                                    >
                                        <X size={16} strokeWidth={4} />
                                    </button>
                                </div>

                                <div className="p-3 md:p-4 flex flex-col gap-2 bg-transparent">
                                    {FINAL_ZONES.map((z) => (
                                        <div key={z.id} className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border-2 border-white/10 shadow-md flex flex-row items-center justify-between group hover:bg-white/20 transition-all">
                                            <div className="flex flex-col text-left">
                                                <span className="text-[9px] font-black text-blue-400 uppercase leading-none mb-0.5 opacity-80">Direzione</span>
                                                <h4 className="text-base md:text-lg font-black text-white uppercase tracking-tight leading-tight">{z.name}</h4>
                                            </div>

                                            <div className="flex flex-row items-center gap-3 md:gap-4">
                                                <div className="flex flex-col items-center">
                                                    <MapPin size={14} className="text-orange-400 mb-0.5" />
                                                    <span className="text-[10px] md:text-xs font-black text-white/80">{z.distance}</span>
                                                </div>
                                                <div className="w-px h-6 bg-white/10"></div>
                                                <div className="flex flex-col items-center">
                                                    <Timer size={14} className="text-blue-300 mb-0.5" />
                                                    <span className="text-[10px] md:text-xs font-black text-white/80">{z.duration.split(' ')[0]}h</span>
                                                </div>
                                                <div className="w-px h-6 bg-white/10"></div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm mb-0.5">🪙</span>
                                                    <span className="text-[10px] md:text-xs font-black text-yellow-400">{z.cost}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-blue-600/20 p-2 text-center border-t border-white/10">
                                    <p className="text-[9px] md:text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                        Lone Boo Express • Magia in Movimento
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 font-black uppercase text-xs md:text-sm">
                    Ecco la mappa di tutti i percorsi magici!
                </div>
            </div>
        </div>
    );
};

const TrainJourneyPlaceholder: React.FC<TrainJourneyPlaceholderProps> = ({ setView }) => {
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    const [userTokens, setUserTokens] = useState(0);
    const [selectedZone, setSelectedZone] = useState<ZoneInfo | null>(null);
    const [showMapModal, setShowMapModal] = useState(false);
    const [showDailyModal, setShowDailyModal] = useState(false);
    
    const [isTraveling, setIsTraveling] = useState(false);
    const [travelKm, setTravelKm] = useState(0);
    const [travelTimeDisplay, setTravelTimeDisplay] = useState("0h 00m");
    
    // Gestione Audio Marlo
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isMarloTalking, setIsMarloTalking] = useState(false);
    
    const animationFrameRef = useRef<number | null>(null);
    const trainAudioRef = useRef<HTMLAudioElement | null>(null);
    const marloVoiceRef = useRef<HTMLAudioElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [isReturnTrip, setIsReturnTrip] = useState(false);

    const currentBg = useMemo(() => {
        return isNightTime(now) ? MAP_BG_NIGHT : MAP_BG;
    }, [now]);

    const travelVideoUrl = useMemo(() => {
        return isNightTime(now) ? TRAVEL_VIDEO_NIGHT_URL : TRAVEL_VIDEO_DAY_URL;
    }, [now]);

    // Formattazione data e ora per lo schermo della sveglia
    const dayNamesShort = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
    const currentDay = now.getDate();
    const currentDayName = dayNamesShort[now.getDay()];
    const currentMonthShort = monthNames[now.getMonth()].slice(0, 3).toUpperCase();
    const currentTimeStr = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    const currentDateStr = `${currentDayName} ${currentDay} ${currentMonthShort}`;

    // --- CALCOLO METEO ---
    const weatherData = useMemo(() => {
        const today = new Date();
        const days = [];
        const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
        
        for (let i = 2; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            
            let icon, labelPrefix;
            if (i === 2) { 
                icon = ICON_WEATHER_RAINY; 
                labelPrefix = "L'altro ieri"; 
            } else if (i === 1) { 
                icon = ICON_WEATHER_CLOUDY; 
                labelPrefix = "Ieri"; 
            } else { 
                icon = ICON_WEATHER_SUNNY; 
                labelPrefix = "Oggi"; 
            }

            days.push({
                label: labelPrefix,
                date: `${dayNames[d.getDay()]} ${d.getDate()}`,
                icon,
                type: i === 0 ? 'today' : 'past'
            });
        }
        return days;
    }, []); 

    useEffect(() => {
        const p = getProgress();
        setUserTokens(p.tokens);

        trainAudioRef.current = new Audio(TRAIN_SOUND_URL);
        trainAudioRef.current.loop = true;
        trainAudioRef.current.volume = 0.5;

        marloVoiceRef.current = new Audio(MARLO_STATION_AUDIO);
        marloVoiceRef.current.loop = false;
        marloVoiceRef.current.volume = 0.6;
        
        marloVoiceRef.current.onended = () => {
            setIsMarloTalking(false);
        };

        const targetCity = sessionStorage.getItem('train_target_city') as AppView;
        const returnFlag = sessionStorage.getItem('train_journey_return') === 'true';

        if (targetCity) {
            sessionStorage.removeItem('train_target_city');
            const targetZone = FINAL_ZONES.find(z => z.id === targetCity);
            if (targetZone) setSelectedZone(targetZone);
        } else if (returnFlag) {
            sessionStorage.removeItem('train_journey_return');
            setIsReturnTrip(true);
            const sourceCity = sessionStorage.getItem('train_journey_source_city') as AppView;
            sessionStorage.removeItem('train_journey_source_city');
            
            const sourceZone = FINAL_ZONES.find(z => z.id === sourceCity);
            if (sourceZone) {
                const returnZone: ZoneInfo = {
                    ...sourceZone,
                    id: AppView.SOCIALS, 
                    name: "CITTÀ COLORATA",
                    cost: 0,
                    travelTimeMs: 10000 
                };
                setSelectedZone(returnZone);
            }
        }

        const img = new Image(); 
        img.src = currentBg;
        img.onload = () => setIsLoaded(true);

        // Aggiorna l'orario ogni secondo per gestire il cambio giorno/notte e la sveglia
        const timeInterval = setInterval(() => setNow(new Date()), 1000);
        
        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => {
            clearTimeout(timer);
            clearInterval(timeInterval);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (trainAudioRef.current) {
                trainAudioRef.current.pause();
                trainAudioRef.current = null;
            }
            if (marloVoiceRef.current) {
                marloVoiceRef.current.pause();
                marloVoiceRef.current = null;
            }
        };
    }, [currentBg]);

    useEffect(() => {
        if (isAudioOn && isLoaded && !isTraveling) {
            setIsMarloTalking(true);
            if (marloVoiceRef.current) {
                marloVoiceRef.current.currentTime = 0;
                marloVoiceRef.current.play().catch(e => console.log("Voice blocked", e));
            }
        } else {
            setIsMarloTalking(false);
            if (marloVoiceRef.current) {
                marloVoiceRef.current.pause();
                marloVoiceRef.current.currentTime = 0;
            }
        }
    }, [isAudioOn, isLoaded, isTraveling]);

    const handlePurchase = () => {
        if (!selectedZone) return;
        if (userTokens >= selectedZone.cost) {
            if (selectedZone.cost > 0) spendTokens(selectedZone.cost);
            startTravelAnimation(selectedZone);
        }
    };

    const handleCancel = () => {
        const origin = sessionStorage.getItem('train_journey_origin') as AppView;
        sessionStorage.removeItem('train_journey_origin');
        sessionStorage.removeItem('train_target_city');
        sessionStorage.removeItem('train_journey_return');
        sessionStorage.removeItem('train_journey_source_city');
        if (origin) setView(origin);
        else setView(AppView.SOCIALS);
    };

    const handleBackToCity = () => {
        sessionStorage.removeItem('train_journey_origin');
        sessionStorage.removeItem('train_target_city');
        sessionStorage.removeItem('train_journey_return');
        sessionStorage.removeItem('train_journey_source_city');
        setView(AppView.CITY_MAP);
    };

    const startTravelAnimation = (zone: ZoneInfo) => {
        setIsTraveling(true);
        const startTime = performance.now();
        const duration = zone.travelTimeMs;
        let chimePlayed = false;

        if (trainAudioRef.current) {
            trainAudioRef.current.currentTime = 0;
            trainAudioRef.current.play().catch(e => console.error("Audio blocked", e));
        }

        const animate = (timestamp: number) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentKm = Math.floor(progress * zone.maxKm);
            setTravelKm(currentKm);

            const currentTotalMinutes = Math.floor(progress * zone.maxMinutes);
            const hours = Math.floor(currentTotalMinutes / 60);
            const mins = currentTotalMinutes % 60;
            setTravelTimeDisplay(`${hours}h ${mins.toString().padStart(2, '0')}m`);

            if (progress >= 0.95 && !chimePlayed) { 
                chimePlayed = true;
                const arrivalChime = new Audio(CHIME_SOUND_URL);
                arrivalChime.volume = 0.7;
                arrivalChime.play().catch(e => console.error("Chime blocked", e));
            }

            if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                if (trainAudioRef.current) trainAudioRef.current.pause();

                sessionStorage.removeItem('train_journey_origin');
                sessionStorage.removeItem('train_target_city');
                sessionStorage.removeItem('train_journey_return');
                sessionStorage.removeItem('train_journey_source_city');

                setTimeout(() => setView(zone.id), 100); 
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const getClipPath = (pts: Point[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    return (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-sky-900">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
            
            {!isLoaded && !isTraveling && (
                <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-sky-900 backdrop-blur-md">
                    <img 
                        src={OFFICIAL_LOGO} 
                        alt="Caricamento..." 
                        className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                    />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase text-center px-4">
                        Caricamento Biglietteria...
                    </span>
                </div>
            )}

            {/* MINI TV MARLO CAPOSTAZIONE */}
            {isLoaded && isMarloTalking && !isTraveling && (
                <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video 
                            src={MARLO_STATION_VIDEO} 
                            autoPlay 
                            loop={true} 
                            playsInline 
                            muted
                            className="w-full h-full object-cover" 
                            style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            {/* HUD SALDO GETTONI - Spostato a sinistra */}
            {!isTraveling && isLoaded && (
                <div className="fixed top-24 md:top-32 left-0 right-0 px-4 flex justify-start items-center z-50 pointer-events-none">
                    <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl shadow-black/50">
                        <span>{userTokens}</span> <span className="text-xl">🪙</span>
                    </div>
                </div>
            )}

            {/* SVEGLIA - LA TUA GIORNATA (IDENTICA AL GIARDINO) */}
            {isLoaded && !isTraveling && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowDailyModal(true); }}
                    className="absolute z-[70] transition-transform outline-none group hover:scale-105 active:scale-95"
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

            {isTraveling && selectedZone && (
                <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center animate-in fade-in duration-500 overflow-hidden bg-black">
                    <video 
                        ref={videoRef}
                        src={travelVideoUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        style={{ 
                            transform: 'translateZ(0)', 
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden'
                        }}
                    />

                    {/* HUD PROGRESSI SUPERIORE TRASLUCIDO */}
                    <div className="absolute top-[80px] md:top-[120px] left-4 right-4 z-40 flex flex-col items-center animate-in slide-in-from-top-4 duration-700">
                        <div className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-[2.5rem] p-4 md:p-6 shadow-2xl flex flex-col gap-3 w-full md:w-auto md:min-w-[550px]">
                            <div className="text-center border-b border-white/5 pb-2">
                                <h2 className="font-luckiest text-white text-lg md:text-2xl uppercase tracking-widest drop-shadow-[2px_2px_0px_black] opacity-70" style={{ WebkitTextStroke: '1px black' }}>
                                    {isReturnTrip ? 'BENTORNATI A...' : 'IN VIAGGIO VERSO...'}
                                </h2>
                                <h3 className="font-luckiest text-yellow-400 text-2xl md:text-5xl uppercase tracking-tighter drop-shadow-[4px_4px_0px_black] mt-1" style={{ WebkitTextStroke: '1.5px black' }}>
                                    {selectedZone.name}
                                </h3>
                            </div>
                            
                            <div className="flex flex-row justify-between items-center gap-4 md:gap-10 px-2">
                                <div className="flex-1 flex flex-col items-start">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-luckiest text-white text-3xl md:text-7xl uppercase leading-none drop-shadow-[3px_3px_0_black]" style={{ WebkitTextStroke: '1.5px black' }}>{travelKm}</span>
                                        <span className="font-luckiest text-blue-400 text-lg md:text-2xl uppercase" style={{ WebkitTextStroke: '1px black' }}>KM</span>
                                    </div>
                                </div>
                                <div className="w-px bg-white/10 rounded-full h-10 md:h-14 self-center mx-2"></div>
                                <div className="flex-1 flex flex-col items-end">
                                    <span className="font-luckiest text-white text-2xl md:text-5xl uppercase leading-none drop-shadow-[3px_3px_0_black]" style={{ WebkitTextStroke: '1.5px black' }}>{travelTimeDisplay}</span>
                                </div>
                            </div>
                        </div>

                        {/* BOX METEO ARRICCHITO - 3 GIORNI (FISSO) */}
                        <div className="mt-3 bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-[2rem] p-3 md:p-5 shadow-xl flex flex-col gap-4 w-full md:w-auto md:min-w-[550px] animate-in slide-in-from-top-2 duration-700 delay-300">
                            {/* Cronologia Meteo */}
                            <div className="flex justify-around items-center px-4">
                                {weatherData.map((day, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex flex-col items-center gap-1 transition-all duration-500 ${day.type === 'today' ? 'scale-110' : 'opacity-60'}`}
                                    >
                                        <div className="flex flex-col items-center leading-none mb-1">
                                            <span className="text-[9px] md:text-xs font-black text-yellow-400 uppercase tracking-tighter" style={{ WebkitTextStroke: '0.5px black' }}>{day.label}</span>
                                            <span className="text-[7px] md:text-[10px] font-bold text-yellow-300/80 uppercase" style={{ WebkitTextStroke: '0.3px black' }}>{day.date}</span>
                                        </div>
                                        <div className={`p-1 rounded-2xl border-2 ${day.type === 'today' ? 'bg-yellow-400/20 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'bg-white/5 border-white/10'}`}>
                                            <img 
                                                src={day.icon} 
                                                alt={day.label}
                                                className={`object-contain ${day.type === 'today' ? 'w-12 h-12 md:w-20 md:h-20' : 'w-8 h-8 md:w-14 md:h-14'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Testo Previsione - UNICA RIGA CON CITTA BIANCA E PIU GRANDE */}
                            <div className="flex flex-row items-center justify-center gap-2 border-t border-white/10 pt-3 flex-wrap">
                                <span className="font-luckiest text-yellow-400 text-xs md:text-2xl uppercase tracking-tight text-center" style={{ WebkitTextStroke: '1px black', textShadow: '2px 2px 0px black' }}>
                                    SI PREVEDE BEL TEMPO A
                                </span>
                                <span className="font-luckiest text-white text-base md:text-4xl uppercase tracking-tighter text-center" style={{ WebkitTextStroke: '1.5px black', textShadow: '3px 3px 0px black' }}>
                                    {selectedZone.name.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <p className="text-white/20 font-black text-[7px] md:text-[9px] uppercase tracking-[0.3em] mt-3">Sistemi di navigazione attivi • Lone Boo Express</p>
                    </div>
                </div>
            )}

            <div className={`absolute inset-0 z-0 ${isTraveling ? 'hidden' : 'block'}`}>
                <img src={currentBg} alt="" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />

                {isLoaded && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4 items-center">
                        <button onClick={handleBackToCity} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_RETURN_TO_CITY_GRAF} alt="Torna in Città" className="w-24 md:w-44 h-auto drop-shadow-2xl" />
                        </button>
                        
                        <button onClick={() => setShowMapModal(true)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_SECRET_MAP} alt="Mappa Segreta" className="w-20 md:w-32 h-auto drop-shadow-2xl animate-bounce-slow" />
                        </button>
                    </div>
                )}

                {isLoaded && FINAL_ZONES.map((zone) => (
                    <React.Fragment key={zone.id}>
                        <div onClick={(e) => { e.stopPropagation(); setSelectedZone(zone); }} className="absolute inset-0 z-10 cursor-pointer hover:bg-white/10 active:bg-white/20 transition-all" style={{ clipPath: getClipPath(zone.points) }} />
                        <div className="absolute z-20 pointer-events-none transform -translate-x-full -translate-y-full" style={{ left: `${zone.labelPos.x}%`, top: `${zone.labelPos.y}%` }}>
                            <div className="bg-white/95 backdrop-blur-sm border-2 border-orange-500 px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg flex items-center gap-1">
                                <span className="font-black text-[9px] md:text-sm text-orange-600 uppercase leading-none">Costo:</span>
                                <span className="font-black text-[10px] md:text-base text-black leading-none">{zone.cost}</span>
                                <span className="text-xs md:text-sm leading-none">🪙</span>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {selectedZone && !isTraveling && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={handleCancel}>
                    <div className="bg-white rounded-[40px] border-8 border-orange-500 p-6 md:p-8 w-full max-lg text-center shadow-2xl relative animate-in zoom-in duration-300 flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <button onClick={handleCancel} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 z-10"><X size={24} strokeWidth={4} /></button>

                        <div className="w-full flex flex-row items-center gap-4 md:gap-6 mb-8 text-left bg-slate-50 p-4 rounded-[30px] border-4 border-slate-100 shadow-inner">
                            <div className="w-32 md:w-44 shrink-0 flex items-center justify-center">
                                <img src={selectedZone.ticketImg} alt="Biglietto" className="w-full h-full object-contain drop-shadow-lg" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h2 className="text-blue-900 font-black uppercase text-[10px] md:text-xs tracking-tight leading-none mb-1">Biglietto di viaggio</h2>
                                <h3 className="text-orange-600 font-black text-lg md:text-2xl uppercase leading-tight mb-3 break-words overflow-visible">{selectedZone.name}</h3>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-gray-500"><Timer size={16} className="text-blue-400 shrink-0" /><span className="text-[11px] md:text-sm font-bold leading-none">Durata: <span className="text-slate-800">{selectedZone.duration}</span></span></div>
                                    <div className="flex items-center gap-2 text-gray-500"><MapPin size={16} className="text-blue-400 shrink-0" /><span className="text-[11px] md:text-sm font-bold leading-none">Distanza: <span className="text-slate-800">{selectedZone.distance}</span></span></div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-slate-100/50 rounded-2xl p-4 border-2 border-slate-200 mb-8 flex flex-col gap-2">
                            <div className="flex justify-between items-center"><span className="text-gray-400 font-bold uppercase text-xs">Prezzo Biglietto</span><span className="font-black text-lg">{selectedZone.cost} 🪙</span></div>
                            <div className="h-px bg-slate-200"></div>
                            <div className="flex justify-between items-center"><span className="text-gray-400 font-bold uppercase text-xs">I tuoi Gettoni</span><span className={`font-black text-lg ${userTokens >= selectedZone.cost ? 'text-green-600' : 'text-red-500'}`}>{userTokens} 🪙</span></div>
                        </div>

                        {userTokens >= selectedZone.cost ? (
                            <button onClick={handlePurchase} className="w-full hover:scale-105 active:scale-95 transition-all outline-none flex items-center justify-center"><img src={BTN_PAY_AND_GO} alt="PAGA E PARTI!" className="w-40 md:w-56 h-auto drop-shadow-xl" /></button>
                        ) : (
                            <div className="flex flex-row items-center gap-4 w-full justify-center"><img src={BTN_PAY_AND_GO} alt="PAGA E PARTI!" className="w-28 md:w-36 h-auto opacity-50 grayscale pointer-events-none" /><span className="text-red-500 font-black text-[10px] md:text-sm uppercase leading-tight text-left max-w-[120px]">Non hai abbastanza gettoni per questo viaggio!</span></div>
                        )}
                    </div>
                </div>
            )}

            {showMapModal && <MapImageModal onClose={() => setShowMapModal(false)} />}
            {showDailyModal && <DailyRewardsModal onClose={() => setShowDailyModal(false)} setView={setView} currentView={AppView.TRAIN_JOURNEY} />}
        </div>
    );
};

export default TrainJourneyPlaceholder;
