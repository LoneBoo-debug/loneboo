
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { X, Timer, MapPin, Check, AlertCircle, ZoomIn, List, Info, ArrowUpRight } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';
import { getProgress, spendTokens } from '../services/tokens';

const MAP_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/biglietteriadovevai887xs32.webp';
const TRAVEL_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/caricsfondcittaaltre55tf4.webp';
const TRAVEL_CENTER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trinviagibimbd45f42.webp';
const TRAIN_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/indian-train-sound-from-vestibule-realistic-interior-noise-314562.mp3';
const CHIME_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/subway-station-chime-100558.mp3';
const BTN_PAY_AND_GO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/payementbillet54r44.webp';
const BTN_SECRET_MAP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/5t4rft5egr+(1)+(1).webp';
const IMG_ZOOMABLE_MAP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/caricsfondcittaaltre55tf4.webp';
const BTN_BACK_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tornacuty55frxxw21+(1).webp';

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
        travelTimeMs: 6000, 
        maxKm: 55,
        maxMinutes: 240
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
        travelTimeMs: 6000, 
        maxKm: 15,
        maxMinutes: 60
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
        travelTimeMs: 6000, 
        maxKm: 45,
        maxMinutes: 180
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
        travelTimeMs: 6000, 
        maxKm: 20,
        maxMinutes: 90
    }
];

const MapImageModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isLegendExpanded, setIsLegendExpanded] = useState(false);

    return (
        <div className="fixed inset-0 z-[600] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
            {/* TASTO CHIUDI MODALE MAPPA */}
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

                    {/* BARRA LEGGENDA IN BASSO (VERSIONE MINI CLICCABILE) */}
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

                    {/* VERSIONE INGRANDITA AL CENTRO (TRASLUCIDA E COMPATTA) */}
                    {isLegendExpanded && (
                        <div className="absolute inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in duration-300">
                            <div className="bg-black/40 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] border-4 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
                                {/* Header Leggenda Traslucido */}
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

                                {/* Lista Dettagli Traslucida e più compatta */}
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
    const [isLoaded, setIsLoaded] = useState(false);
    const [userTokens, setUserTokens] = useState(0);
    const [selectedZone, setSelectedZone] = useState<ZoneInfo | null>(null);
    const [showMapModal, setShowMapModal] = useState(false);
    
    const [isTraveling, setIsTraveling] = useState(false);
    const [travelKm, setTravelKm] = useState(0);
    const [travelTimeDisplay, setTravelTimeDisplay] = useState("0h 00m");
    
    const travelTimerRef = useRef<number | null>(null);
    const trainAudioRef = useRef<HTMLAudioElement | null>(null);

    const [isReturnTrip, setIsReturnTrip] = useState(false);

    useEffect(() => {
        const p = getProgress();
        setUserTokens(p.tokens);

        // --- INIZIALIZZA AUDIO SUBITO PER GARANTIRE DISPONIBILITÀ ---
        trainAudioRef.current = new Audio(TRAIN_SOUND_URL);
        trainAudioRef.current.loop = true;
        trainAudioRef.current.volume = 0.5;

        const returnFlag = sessionStorage.getItem('train_journey_return') === 'true';
        if (returnFlag) {
            sessionStorage.removeItem('train_journey_return');
            setIsReturnTrip(true);
            const sourceCity = sessionStorage.getItem('train_journey_source_city') as AppView;
            sessionStorage.removeItem('train_journey_source_city');
            
            // Find stats from the city we are coming from
            const sourceZone = FINAL_ZONES.find(z => z.id === sourceCity);
            if (sourceZone) {
                const returnZone: ZoneInfo = {
                    ...sourceZone,
                    id: AppView.SOCIALS, // Arrivo alla STAZIONE
                    name: "CITTÀ COLORATA",
                    cost: 0
                };
                setSelectedZone(returnZone);
                // Avvia animazione dopo un brevissimo delay per sicurezza refs
                setTimeout(() => startTravelAnimation(returnZone), 50);
            }
        }

        const img = new Image(); 
        img.src = MAP_BG;
        img.onload = () => setIsLoaded(true);
        
        const travelImg = new Image();
        travelImg.src = TRAVEL_BG;

        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => {
            clearTimeout(timer);
            if (travelTimerRef.current) clearInterval(travelTimerRef.current);
            if (trainAudioRef.current) {
                trainAudioRef.current.pause();
                trainAudioRef.current = null;
            }
        };
    }, []);

    const handlePurchase = () => {
        if (!selectedZone) return;

        if (userTokens >= selectedZone.cost) {
            if (selectedZone.cost > 0) {
                spendTokens(selectedZone.cost);
            }
            startTravelAnimation(selectedZone);
        }
    };

    const startTravelAnimation = (zone: ZoneInfo) => {
        setIsTraveling(true);
        const startTime = Date.now();
        const duration = zone.travelTimeMs;

        // Avvia l'audio del treno
        if (trainAudioRef.current) {
            trainAudioRef.current.currentTime = 0;
            trainAudioRef.current.play().catch(e => console.error("Audio blocked", e));
        }

        travelTimerRef.current = window.setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentKm = Math.floor(progress * zone.maxKm);
            setTravelKm(currentKm);

            const currentTotalMinutes = Math.floor(progress * zone.maxMinutes);
            const hours = Math.floor(currentTotalMinutes / 60);
            const mins = currentTotalMinutes % 60;
            setTravelTimeDisplay(`${hours}h ${mins.toString().padStart(2, '0')}m`);

            if (progress >= 1) {
                if (travelTimerRef.current) clearInterval(travelTimerRef.current);
                
                // Ferma l'audio del treno all'arrivo
                if (trainAudioRef.current) {
                    trainAudioRef.current.pause();
                }

                // Avvia il chime di arrivo
                const arrivalChime = new Audio(CHIME_SOUND_URL);
                arrivalChime.volume = 0.7;
                arrivalChime.play().catch(e => console.error("Chime blocked", e));

                setTimeout(() => {
                    setView(zone.id);
                }, 100); 
            }
        }, 50);
    };

    const getClipPath = (pts: Point[]) => {
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-sky-900">
            
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

            {/* --- SCHERMATA DI VIAGGIO ANIMATA PROFESSIONALE --- */}
            {isTraveling && selectedZone && (
                <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <img 
                        src={TRAVEL_BG} 
                        alt="In viaggio" 
                        className="absolute inset-0 w-full h-full object-cover scale-110 animate-pulse-slow z-0"
                    />
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-0"></div>

                    {/* Intestazione Viaggio Superiore */}
                    <div className="absolute top-28 md:top-40 left-0 right-0 z-40 flex flex-col items-center text-center animate-in slide-in-from-top duration-700">
                        <h2 className="font-luckiest text-white text-xl md:text-3xl uppercase tracking-widest drop-shadow-[2px_2px_0px_black] opacity-80" style={{ WebkitTextStroke: '1px black' }}>
                            {isReturnTrip ? 'BENTORNATI A...' : 'IN VIAGGIO VERSO...'}
                        </h2>
                        <h3 className="font-luckiest text-yellow-400 text-3xl md:text-6xl uppercase tracking-tighter drop-shadow-[4px_4px_0px_black] mt-2 animate-bounce-slow" style={{ WebkitTextStroke: '1.5px black' }}>
                            {selectedZone.name}
                        </h3>
                    </div>

                    {/* Immagine Centrale - Aumentata e messa sotto i box UI (z-10) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center text-center animate-in zoom-in duration-1000">
                        <div className="w-[110vw] h-[110vw] md:w-[900px] md:h-[900px] flex items-center justify-center">
                            <img 
                                src={TRAVEL_CENTER_IMG} 
                                alt="Viaggiatore" 
                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.4)]" 
                            />
                        </div>
                    </div>

                    {/* PANNELLO DI BORDO (CRUSCOTTO) IN BASSO */}
                    <div className="absolute bottom-8 left-4 right-4 md:bottom-12 md:left-12 md:right-12 z-40 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-black/75 backdrop-blur-xl border-4 border-white/20 rounded-[2.5rem] p-4 md:p-6 shadow-2xl flex flex-col gap-3 w-full md:w-auto md:min-w-[550px]">
                            
                            {/* RIGA 1: Dati Previsti */}
                            <div className="flex flex-row justify-between items-center gap-4 md:gap-10 px-2 border-b border-white/10 pb-2">
                                <div className="flex items-center gap-2 text-blue-300 font-black text-[9px] md:text-sm uppercase tracking-widest opacity-80">
                                    <MapPin size={14} /> Distanza: <span className="text-white ml-0.5">{selectedZone.distance}</span>
                                </div>
                                <div className="flex items-center gap-2 text-orange-300 font-black text-[9px] md:text-sm uppercase tracking-widest opacity-80">
                                    <Timer size={14} /> Tempo: <span className="text-white ml-0.5">{selectedZone.duration}</span>
                                </div>
                            </div>

                            {/* RIGA 2: Contatori in tempo reale */}
                            <div className="flex flex-row justify-between items-end gap-4 md:gap-10 px-2">
                                <div className="flex-1 flex flex-col items-start">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-luckiest text-white text-4xl md:text-7xl uppercase leading-none drop-shadow-[3px_3px_0px_black]" style={{ WebkitTextStroke: '1.5px black' }}>
                                            {travelKm}
                                        </span>
                                        <span className="font-luckiest text-blue-400 text-xl md:text-3xl uppercase" style={{ WebkitTextStroke: '1px black' }}>KM</span>
                                    </div>
                                </div>

                                <div className="w-0.5 bg-white/20 rounded-full h-12 md:h-16 self-center"></div>

                                <div className="flex-1 flex flex-col items-end">
                                    <span className="font-luckiest text-white text-3xl md:text-6xl uppercase leading-none drop-shadow-[3px_3px_0_black]" style={{ WebkitTextStroke: '1.5px black' }}>
                                        {travelTimeDisplay}
                                    </span>
                                </div>
                            </div>

                        </div>
                        <p className="text-white/30 font-black text-[7px] md:text-[9px] uppercase tracking-[0.3em] mt-3">Sistemi di navigazione attivi • Lone Boo Express</p>
                    </div>
                </div>
            )}

            {/* BACKGROUND MAP */}
            <div className={`absolute inset-0 z-0 ${isTraveling ? 'hidden' : 'block'}`}>
                <img 
                    src={MAP_BG} 
                    alt="" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />

                {/* BOTTONE MAPPA SEGRETA A SINISTRA */}
                {isLoaded && (
                    <button 
                        onClick={() => setShowMapModal(true)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img 
                            src={BTN_SECRET_MAP} 
                            alt="Mappa Segreta" 
                            className="w-20 md:w-32 h-auto drop-shadow-2xl animate-bounce-slow" 
                        />
                    </button>
                )}

                {isLoaded && FINAL_ZONES.map((zone) => (
                    <React.Fragment key={zone.id}>
                        <div 
                            onClick={(e) => { e.stopPropagation(); setSelectedZone(zone); }}
                            className="absolute inset-0 z-10 cursor-pointer hover:bg-white/10 active:bg-white/20 transition-all"
                            style={{ clipPath: getClipPath(zone.points) }}
                        />
                        
                        <div 
                            className="absolute z-20 pointer-events-none transform -translate-x-full -translate-y-full"
                            style={{ left: `${zone.labelPos.x}%`, top: `${zone.labelPos.y}%` }}
                        >
                            <div className="bg-white/95 backdrop-blur-sm border-2 border-orange-500 px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg flex items-center gap-1">
                                <span className="font-black text-[9px] md:text-sm text-orange-600 uppercase leading-none">Costo:</span>
                                <span className="font-black text-[10px] md:text-base text-black leading-none">{zone.cost}</span>
                                <span className="text-xs md:text-sm leading-none">🪙</span>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
            
            {!isTraveling && (
                <div className="fixed top-24 md:top-32 left-0 right-0 px-4 flex justify-between items-center z-50 pointer-events-none">
                    <button 
                        onClick={() => setView(AppView.CITY_MAP)} 
                        className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Torna in Città"
                    >
                        <img 
                            src={BTN_BACK_CITY} 
                            alt="Torna in Città" 
                            className="w-24 md:w-36 h-auto drop-shadow-2xl" 
                        />
                    </button>

                    <div className="pointer-events-auto bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl shadow-black/50">
                        <span>{userTokens}</span> <span className="text-xl">🪙</span>
                    </div>
                </div>
            )}

            {selectedZone && !isTraveling && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedZone(null)}>
                    <div 
                        className="bg-white rounded-[40px] border-8 border-orange-500 p-6 md:p-8 w-full max-lg text-center shadow-2xl relative animate-in zoom-in duration-300 flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedZone(null)} 
                            className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 z-10"
                        >
                            <X size={24} strokeWidth={4} />
                        </button>

                        <div className="w-full flex flex-row items-center gap-4 md:gap-6 mb-8 text-left bg-slate-50 p-4 rounded-[30px] border-4 border-slate-100 shadow-inner">
                            <div className="w-32 md:w-44 shrink-0 flex items-center justify-center">
                                <img 
                                    src={selectedZone.ticketImg} 
                                    alt="Biglietto" 
                                    className="w-full h-full object-contain drop-shadow-lg" 
                                />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h2 className="text-blue-900 font-black uppercase text-[10px] md:text-xs tracking-tight leading-none mb-1">Biglietto di viaggio</h2>
                                <h3 className="text-orange-600 font-black text-lg md:text-2xl uppercase leading-tight mb-3 break-words overflow-visible">
                                    {selectedZone.name}
                                </h3>
                                
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Timer size={16} className="text-blue-400 shrink-0" />
                                        <span className="text-[11px] md:text-sm font-bold leading-none">Durata: <span className="text-slate-800">{selectedZone.duration}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin size={16} className="text-blue-400 shrink-0" />
                                        <span className="text-[11px] md:text-sm font-bold leading-none">Distanza: <span className="text-slate-800">{selectedZone.distance}</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-slate-100/50 rounded-2xl p-4 border-2 border-slate-200 mb-8 flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold uppercase text-xs">Prezzo Biglietto</span>
                                <span className="font-black text-lg">{selectedZone.cost} 🪙</span>
                            </div>
                            <div className="h-px bg-slate-200"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold uppercase text-xs">I tuoi Gettoni</span>
                                <span className={`font-black text-lg ${userTokens >= selectedZone.cost ? 'text-green-600' : 'text-red-500'}`}>{userTokens} 🪙</span>
                            </div>
                        </div>

                        {userTokens >= selectedZone.cost ? (
                            <button 
                                onClick={handlePurchase}
                                className="w-full hover:scale-105 active:scale-95 transition-all outline-none flex items-center justify-center"
                            >
                                <img src={BTN_PAY_AND_GO} alt="PAGA E PARTI!" className="w-48 md:w-64 h-auto drop-shadow-xl" />
                            </button>
                        ) : (
                            <div className="flex flex-row items-center gap-4 w-full justify-center">
                                <img src={BTN_PAY_AND_GO} alt="PAGA E PARTI!" className="w-32 md:w-44 h-auto opacity-50 grayscale pointer-events-none" />
                                <span className="text-red-500 font-black text-[10px] md:text-sm uppercase leading-tight text-left max-w-[120px]">
                                    Non hai abbastanza gettoni per questo viaggio!
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODALE MAPPA PERCORSI */}
            {showMapModal && (
                <MapImageModal onClose={() => setShowMapModal(false)} />
            )}
        </div>
    );
};

export default TrainJourneyPlaceholder;
