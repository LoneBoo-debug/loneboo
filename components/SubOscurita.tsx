
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { pauseSubMusic, playSubMusic } from '../services/bgMusic';

const HORROR_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nastelbom-horror-thriller-376319.mp3';
const ANIMATION_VIDEO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scivolapozzorurne.mp4';
const STATIC_BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newosbscury5t43.webp';
const ILLUMINATED_BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/oscutillumina4e3.webp';
const AUDIO_ICON_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';
const BTN_EXIT_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esicenigmi.webp';
const BTN_TORCH_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torciilluminaoscurenj45.webp';

interface SubOscuritaProps {
    setView: (view: AppView, skipAnim?: boolean) => void;
    initialPhase?: Phase;
}

type Phase = 'BLACK' | 'ANIMATION' | 'STATIC';
type AreaId = 'POTERE_MAGICO' | 'SCONFIGGI_MOSTRO' | 'RISALI_SUPERFICIE';
interface Point { x: number; y: number }

const DEFAULT_POLYGONS: Record<AreaId, Point[]> = {
    POTERE_MAGICO: [
        { "x": 5.6, "y": 44.83 },
        { "x": 5.07, "y": 59.82 },
        { "x": 26.13, "y": 58.47 },
        { "x": 24.53, "y": 44.08 }
    ],
    SCONFIGGI_MOSTRO: [
        { "x": 73.87, "y": 43.03 },
        { "x": 73.33, "y": 59.07 },
        { "x": 93.6, "y": 61.47 },
        { "x": 93.6, "y": 40.03 }
    ],
    RISALI_SUPERFICIE: [
        { "x": 40, "y": 42.88 },
        { "x": 39.47, "y": 58.77 },
        { "x": 60.27, "y": 58.77 },
        { "x": 60.53, "y": 41.53 }
    ]
};

const SubOscurita: React.FC<SubOscuritaProps> = ({ setView, initialPhase = 'BLACK' }) => {
    const [phase, setPhase] = useState<Phase>(initialPhase);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_sub_bg_music_enabled') !== 'false');
    const [isIlluminated, setIsIlluminated] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [polygons] = useState<Record<AreaId, Point[]>>(() => {
        const saved = localStorage.getItem('sub_oscurita_polygons');
        return saved ? JSON.parse(saved) : DEFAULT_POLYGONS;
    });

    useEffect(() => {
        // Stop underground music
        pauseSubMusic();

        // Setup horror music
        audioRef.current = new Audio(HORROR_MUSIC_URL);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.6;

        if (isAudioOn) {
            audioRef.current.play().catch(e => console.log("Horror music blocked", e));
        }

        // Transition to animation after 3 seconds of black screen
        let timer: any;
        if (phase === 'BLACK') {
            timer = setTimeout(() => {
                setPhase('ANIMATION');
            }, 3000);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleAudio = () => {
        const nextState = !isAudioOn;
        setIsAudioOn(nextState);
        localStorage.setItem('loneboo_sub_bg_music_enabled', String(nextState));
        if (nextState) {
            audioRef.current?.play().catch(() => {});
        } else {
            audioRef.current?.pause();
        }
    };

    const handleExit = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        playSubMusic();
        setView(AppView.MAGIC_TOWER_SUB_EXPLORE);
    };

    // Calibrator Logic
    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleAreaClick = (id: AreaId) => {
        console.log(`Clicked area: ${id}`);
        
        if (id === 'POTERE_MAGICO') {
            setView(AppView.SUB_OSCURITA_POTERE);
        } else if (id === 'SCONFIGGI_MOSTRO') {
            setView(AppView.SUB_OSCURITA_MOSTRO);
        } else if (id === 'RISALI_SUPERFICIE') {
            setView(AppView.SUB_OSCURITA_SUPERFICIE);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[150] bg-black flex flex-col overflow-hidden select-none"
        >
            {phase === 'BLACK' && (
                <div className="absolute inset-0 bg-black z-[160]" />
            )}

            {phase === 'ANIMATION' && (
                <video 
                    src={ANIMATION_VIDEO_URL}
                    autoPlay
                    playsInline
                    onEnded={() => setPhase('STATIC')}
                    className="absolute inset-0 w-full h-full object-cover z-[160]"
                />
            )}

            {phase === 'STATIC' && (
                <div className="absolute inset-0 z-[160] animate-in fade-in duration-500">
                    <img 
                        src={isIlluminated ? ILLUMINATED_BG_URL : STATIC_BG_URL} 
                        alt="Oscurità" 
                        className="w-full h-full object-cover transition-all duration-700"
                    />

                    {/* CLICKABLE AREAS */}
                    {Object.entries(polygons).map(([id, pts]) => (
                        <div 
                            key={id}
                            onClick={(e) => { e.stopPropagation(); handleAreaClick(id as AreaId); }}
                            className="absolute inset-0 z-20 cursor-pointer hover:bg-white/5 transition-colors"
                            style={{ clipPath: getClipPath(pts) }}
                        />
                    ))}

                    {/* UI CONTROLS */}
                    <div className="absolute top-6 left-6 z-[170] flex items-center gap-4 pointer-events-auto">
                    </div>

                    <div className="absolute top-6 right-6 z-[170] flex flex-col items-center gap-4 pointer-events-auto">
                        <button 
                            onClick={toggleAudio}
                            className={`hover:scale-110 active:scale-95 transition-all outline-none ${!isAudioOn ? 'grayscale opacity-60' : ''}`}
                        >
                            <img src={AUDIO_ICON_URL} alt="Audio" className="w-14 h-14 md:w-20 h-auto drop-shadow-xl" />
                        </button>
                        <button 
                            onClick={() => setIsIlluminated(!isIlluminated)}
                            className="hover:scale-110 active:scale-95 transition-all outline-none group"
                        >
                            <img 
                                src={BTN_TORCH_URL} 
                                alt="Torcia" 
                                className={`w-12 h-12 md:w-16 h-auto drop-shadow-2xl transition-all ${isIlluminated ? 'brightness-125' : 'brightness-75'}`} 
                            />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubOscurita;
