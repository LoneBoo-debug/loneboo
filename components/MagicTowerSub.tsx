import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppView, PlayerProgress } from '../types';
import { OFFICIAL_LOGO, ATELIER_COMBO_CSV_URL } from '../constants';
import { Compass, Puzzle, Gamepad2 } from 'lucide-react';
import { getProgress } from '../services/tokens';
import { playSubMusic, pauseSubMusic } from '../services/bgMusic';

const SUB_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sotterraneitorremoacighca.webp';
const BTN_BACK_TOWER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-tower.webp';
const BOO_BASE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boonudoede32ws34r.webp';
const NARRATOR_AUDIO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/86a36b68-0e67-42d3-bb94-820fc64dc4bd.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

const SPECIAL_OVERLAYS: Record<string, string> = {
    'S1': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sciarpacolorataboocaracters.webp',
    'S2': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cappelobeardnatalebbo5fr42.webp',
    'S3': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccahalloweenboocarxe4e3ws.webp',
    'S4': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boxcompete55rt44+(1).webp',
    'S5': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/completosera998gre.webp',
    'SUB_ELF_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elfatelierscoiru54.webp',
    'SUB_DEMOGORGON_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/demogorgoboo8ur.webp',
    'SUB_NINJA_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ninjiaboosocuteate44.webp',
    'SUB_ROBOT_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rbotoneboodww+(1).webp',
    'SUB_GLADIATOR_OUTFIT': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gladiatorboodnej33+(1).webp',
    'SUB_TSHIRT_RUDEN': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rudenfien4wsd.webp',
    'SUB_TSHIRT_MAGIC': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magictoeern4w.webp',
    'SUB_TSHIRT_ONEBOO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/onebootshirtue432.webp',
    'SUB_TSHIRT_COORAA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cooraaoscurobooe4.webp',
    'SUB_TSHIRT_LONEBOO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/loneboooscurotshirt.webp',
    'SUB_OBJ_CLOWN_NOSE': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nasorossoclownboo5.webp',
    'SUB_OBJ_NECKLACE': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/collanaboooscuro.webp',
    'SUB_OBJ_EYEPATCH': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bendaocchiboooscur.webp',
    'SUB_HAT_BASCO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bascooscuroboo5jen3.webp',
    'SUB_HAT_ELMO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elmooscuroboo54.webp',
    'SUB_HAT_MAGO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magoboooscuro6789.webp',
    'SUB_HAT_COWBOY': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cowboyoscuro44e23.webp'
};

const HIDES_BASE_CLOTHING = ['SUB_ELF_OUTFIT', 'SUB_DEMOGORGON_OUTFIT', 'SUB_NINJA_OUTFIT', 'SUB_ROBOT_OUTFIT', 'SUB_GLADIATOR_OUTFIT', 'S5'];

type Point = { x: number; y: number };
type AreaId = 'EXPLORE' | 'ENIGMAS' | 'GAMES';

const DEFAULT_COORDS: Record<AreaId, Point[]> = {
    EXPLORE: [
        { "x": 2.93, "y": 28.49 },
        { "x": 2.4, "y": 63.42 },
        { "x": 29.87, "y": 58.77 },
        { "x": 28.8, "y": 26.54 }
    ],
    ENIGMAS: [
        { "x": 38.4, "y": 32.68 },
        { "x": 38.93, "y": 59.22 },
        { "x": 65.6, "y": 58.92 },
        { "x": 65.87, "y": 31.93 }
    ],
    GAMES: [
        { "x": 74.13, "y": 32.53 },
        { "x": 73.87, "y": 59.97 },
        { "x": 98.67, "y": 62.52 },
        { "x": 98.4, "y": 31.48 }
    ]
};

// Coordinate definitive impostate tramite calibratore
const FIXED_CALIB = {
    booX: -23,
    booY: -3,
    booScale: 1.2,
    textX: 52,
    textY: 29,
    textSize: 1.0,
    textRotate: 1
};

interface MagicTowerSubProps {
    setView: (view: AppView) => void;
}

const MagicTowerSub: React.FC<MagicTowerSubProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress] = useState<PlayerProgress>(getProgress());
    const [comboMap, setComboMap] = useState<Record<string, string>>({});
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const [polygons] = useState<Record<AreaId, Point[]>>(() => {
        const saved = localStorage.getItem('magic_tower_sub_polygons_v2');
        return saved ? JSON.parse(saved) : DEFAULT_COORDS;
    });

    const AREA_CONFIG: Record<AreaId, { label: string, color: string, icon: any, view: AppView }> = {
        EXPLORE: { label: 'Esplora', color: '#3b82f6', icon: Compass, view: AppView.MAGIC_TOWER_SUB_EXPLORE },
        ENIGMAS: { label: 'Enigmi', color: '#8b5cf6', icon: Puzzle, view: AppView.MAGIC_TOWER_SUB_ENIGMAS },
        GAMES: { label: 'Giochi', color: '#10b981', icon: Gamepad2, view: AppView.MAGIC_TOWER_SUB_GAMES }
    };

    useEffect(() => {
        const fetchAtelierMap = async () => {
            try {
                const response = await fetch(ATELIER_COMBO_CSV_URL);
                if (response.ok) {
                    const text = await response.text();
                    const cleanText = text.replace(/\r/g, '');
                    const lines = cleanText.split('\n');
                    const map: Record<string, string> = {};
                    lines.slice(1).forEach(line => {
                        if (!line.trim()) return;
                        const separator = line.includes(';') ? ';' : ',';
                        const parts = line.split(separator).map(s => s.trim().replace(/^"|"$/g, ''));
                        if (parts.length >= 2) {
                            const [key, url] = parts;
                            if (key && url) map[key.toUpperCase()] = url;
                        }
                    });
                    setComboMap(map);
                }
            } catch (e) { console.error("Error fetching combo map:", e); }
        };
        fetchAtelierMap();

        const img = new Image();
        img.src = SUB_BG;
        if (img.complete) {
            setIsLoaded(true);
        } else {
            img.onload = () => setIsLoaded(true);
        }
        window.scrollTo(0, 0);

        if (!audioRef.current) {
            audioRef.current = new Audio(NARRATOR_AUDIO_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.6;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => setIsPlaying(false));
        }

        if (isAudioOn) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }

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

        return () => {
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const currentBooImage = useMemo(() => {
        const look = progress.equippedClothing;
        const isFullOutfitWorn = look.special5 && HIDES_BASE_CLOTHING.includes(look.special5);
        const isHeadOverlayWorn = look.special2 === 'S2' || look.special3 === 'S3' || look.special4 === 'S4' || isFullOutfitWorn || (look.hat && SPECIAL_OVERLAYS[look.hat]);
        const isBodyOverlayWorn = isFullOutfitWorn || (look.tshirt && SPECIAL_OVERLAYS[look.tshirt]);
        
        const effectiveHat = isHeadOverlayWorn ? undefined : look.hat;
        const effectiveTshirt = isBodyOverlayWorn ? undefined : look.tshirt;
        
        const activeIds = [effectiveTshirt, effectiveHat, look.glasses].filter(Boolean).map(id => (id as string).toUpperCase());
        if (activeIds.length === 0) return BOO_BASE;
        const currentKey = [...activeIds].sort().join('_');
        if (comboMap[currentKey]) return comboMap[currentKey];

        // Fallback: se la combo non esiste, prova a cercare i singoli pezzi in ordine di priorità
        // Includiamo anche i pezzi originali se quelli "effective" sono undefined (perché sono diventati overlay)
        const priorityOrder: (keyof typeof look)[] = ['glasses', 'hat', 'tshirt'];
        for (const key of priorityOrder) {
            const idToUse = look[key];
            const idStr = (idToUse as string | undefined)?.toUpperCase();
            if (idStr && comboMap[idStr]) return comboMap[idStr];
        }

        return BOO_BASE;
    }, [progress.equippedClothing, comboMap]);

    const specialOverlayImages = useMemo(() => {
        const layers: string[] = []; 
        const look = progress.equippedClothing;
        if (look.special5 && SPECIAL_OVERLAYS[look.special5]) layers.push(SPECIAL_OVERLAYS[look.special5]);
        
        const slots: (keyof typeof look)[] = ['glasses', 'tshirt', 'hat', 'special', 'special2', 'special3', 'special4'];
        slots.forEach(slot => {
            const id = look[slot];
            if (id && SPECIAL_OVERLAYS[id]) {
                layers.push(SPECIAL_OVERLAYS[id]);
            }
        });
        return layers;
    }, [progress.equippedClothing]);

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-slate-900 flex flex-col overflow-hidden select-none animate-in fade-in duration-1000">
            <style>{`
                .font-luckiest { font-family: 'Luckiest Guy', cursive; }
                .text-stroke-black { -webkit-text-stroke: 1.5px black; }
                @keyframes float-sub {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float-sub { animation: float-sub 3s ease-in-out infinite; }
            `}</style>

            {/* Loader rimosso per transizione immediata - lo sfondo ha un suo fade-in veloce */}

            {/* HEADER CONTROLS */}
            <div className="absolute top-[80px] md:top-[120px] left-6 z-50 pointer-events-none">
                {isLoaded && isAudioOn && isPlaying && (
                    <div className="animate-in zoom-in duration-500 pointer-events-auto">
                        <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-24 h-24 md:w-44 md:h-44">
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
            </div>

            <div className="absolute top-[80px] md:top-[120px] right-6 z-50 pointer-events-none">
                <button 
                    onClick={() => {
                        pauseSubMusic();
                        setView(AppView.AI_MAGIC);
                    }}
                    className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img 
                        src={BTN_BACK_TOWER} 
                        alt="Indietro" 
                        className="w-24 h-18 md:w-44 md:h-32 object-stretch drop-shadow-2xl" 
                    />
                </button>
            </div>

            {/* MAIN INTERACTIVE AREA */}
            <div className="relative w-full h-full">
                <img 
                    src={SUB_BG} 
                    alt="Sotterranei" 
                    className={`w-full h-full object-fill md:object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />

                {/* LAYER AREE CLICCABILI (NAVIGAZIONE) */}
                {Object.entries(AREA_CONFIG).map(([id, cfg]) => (
                    <div 
                        key={id}
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setView(cfg.view); 
                        }}
                        className="absolute inset-0 z-10 cursor-pointer active:bg-white/10 transition-colors"
                        style={{ clipPath: getClipPath(polygons[id as AreaId]) }}
                    />
                ))}

                {/* AREA BOO PERSONALIZZATO E SCRITTA NARRATIVA FISSA */}
                {isLoaded && (
                    <div className="absolute inset-0 z-40 w-full h-full pointer-events-none">
                        
                        {/* Boo Avatar (Animato) */}
                        <div 
                            className="absolute"
                            style={{ 
                                bottom: `${FIXED_CALIB.booY}%`, 
                                left: `${FIXED_CALIB.booX}%`,
                                transform: `scale(${FIXED_CALIB.booScale})`
                            }}
                        >
                            <div className="relative w-[28rem] h-[28rem] md:w-[55rem] md:h-[55rem] shrink-0 animate-float-sub">
                                <img 
                                    src={currentBooImage} 
                                    className="w-full h-full object-contain" 
                                    style={{ filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.4))' }}
                                    alt="Boo" 
                                />
                                {specialOverlayImages.map((src, idx) => (
                                    <img 
                                        key={idx} 
                                        src={src} 
                                        className="absolute inset-0 w-full h-full object-contain" 
                                        style={{ zIndex: 10 + idx, filter: 'drop-shadow(0 0 25px rgba(255,255,255,0.4))' }} 
                                        alt="" 
                                    />
                                ))}
                            </div>
                        </div>

                        {/* SCRITTA NARRATIVA (FISSA) */}
                        <div 
                            className="absolute pointer-events-auto"
                            style={{ 
                                bottom: `${FIXED_CALIB.textY}%`, 
                                left: `${FIXED_CALIB.textX}%`,
                                transform: `rotate(${FIXED_CALIB.textRotate}deg) scale(${FIXED_CALIB.textSize})`
                            }}
                        >
                            <div className="max-w-[220px] md:max-w-[600px]">
                                <p 
                                    className="font-luckiest text-yellow-400 text-xl md:text-6xl uppercase leading-tight text-stroke-black"
                                    style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}
                                >
                                    non preoccuparti sono qui con te, esploriamo insieme...
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MagicTowerSub;