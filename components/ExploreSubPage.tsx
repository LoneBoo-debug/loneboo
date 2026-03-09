import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Settings, X, Crosshair, Map as MapIcon, Sparkles, Droplets, Wand2, Moon, Copy, Trash2, CheckCircle2 } from 'lucide-react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { getSubMusic, playSubMusic, pauseSubMusic } from '../services/bgMusic';

const EXPLORE_SUB_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esplrastoteraneird443.webp';
const BTN_BACK_SUB = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esicenigmi.webp';
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';
const EXPLORE_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diamond_tunes-spectral-resonance-269427.mp3';

interface ExploreSubPageProps {
    setView: (view: AppView) => void;
}

interface Point {
    x: number; // percentuale
    y: number; // percentuale
}

interface AreaConfig {
    id: AppView;
    label: string;
    points: Point[];
    icon: React.ReactNode;
}

const ExploreSubPage: React.FC<ExploreSubPageProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [musicEnabled, setMusicEnabled] = useState(() => localStorage.getItem('loneboo_sub_bg_music_enabled') !== 'false');
    const [zoomingTo, setZoomingTo] = useState<{ x: number, y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const areas = useMemo<AreaConfig[]>(() => [
        { 
            id: AppView.SUB_ATELIER_OSCURO, 
            label: "Atelier Oscuro", 
            points: [
                { "x": 4.266666666666667, "y": 41.07946026986507 },
                { "x": 3.733333333333334, "y": 80.95952023988005 },
                { "x": 27.200000000000003, "y": 70.31484257871064 },
                { "x": 26.666666666666668, "y": 41.97901049475262 }
            ], 
            icon: <Sparkles className="w-5 h-5" /> 
        },
        { 
            id: AppView.SUB_FIUME_SOTTERRANEO, 
            label: "Fiume Sotterraneo", 
            points: [
                { "x": 39.2, "y": 43.77811094452774 },
                { "x": 38.93333333333333, "y": 65.36731634182908 },
                { "x": 55.733333333333334, "y": 61.019490254872565 },
                { "x": 54.93333333333334, "y": 44.527736131934034 }
            ], 
            icon: <Droplets className="w-5 h-5" /> 
        },
        { 
            id: AppView.SUB_ARTI_MAGICHE, 
            label: "Arti Magiche", 
            points: [
                { "x": 81.06666666666666, "y": 44.22788605697151 },
                { "x": 80.80000000000001, "y": 72.26386806596702 },
                { "x": 95.73333333333333, "y": 83.95802098950524 },
                { "x": 96.8, "y": 43.32833583208396 }
            ], 
            icon: <Wand2 className="w-5 h-5" /> 
        },
        { 
            id: AppView.SUB_OSCURITA, 
            label: "Oscurità", 
            points: [
                { "x": 65.86666666666666, "y": 41.67916041979011 },
                { "x": 66.13333333333333, "y": 58.77061469265368 },
                { "x": 76.53333333333333, "y": 57.271364317841076 },
                { "x": 75.73333333333333, "y": 41.82908545727136 }
            ], 
            icon: <Moon className="w-5 h-5" /> 
        }
    ], []);

    useEffect(() => {
        const img = new Image();
        img.src = EXPLORE_SUB_BG;
        img.onload = () => setIsLoaded(true);
        window.scrollTo(0, 0);

        const handleAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_sub_bg_music_enabled') !== 'false';
            setMusicEnabled(enabled);
            if (enabled) playSubMusic();
            else pauseSubMusic();
        };
        window.addEventListener('loneboo_sub_music_changed', handleAudioChange);

        return () => {
            window.removeEventListener('loneboo_sub_music_changed', handleAudioChange);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            pauseSubMusic();
        };
    }, []);

    const toggleMusic = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextState = !musicEnabled;
        setMusicEnabled(nextState);
        localStorage.setItem('loneboo_sub_bg_music_enabled', String(nextState));
        window.dispatchEvent(new Event('loneboo_sub_music_changed'));
        if (nextState) playSubMusic();
        else pauseSubMusic();
    };

    useEffect(() => {
        if (isLoaded) {
            if (musicEnabled) playSubMusic();
            else pauseSubMusic();
        }
    }, [musicEnabled, isLoaded]);

    // Calcola il bounding box per rendere l'area cliccabile
    const getAreaStyle = (points: Point[]) => {
        if (points.length === 0) return { display: 'none' };
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        return {
            left: `${minX}%`,
            top: `${minY}%`,
            width: `${maxX - minX}%`,
            height: `${maxY - minY}%`
        };
    };

    const handleAreaClick = (area: AreaConfig) => {
        if (zoomingTo) return;

        if (area.id === AppView.SUB_OSCURITA) {
            // Punta all'estrema sinistra della zona cliccabile
            const targetX = 66.2;
            const targetY = 48.5;

            setZoomingTo({ x: targetX, y: targetY });

            // Attendi la fine dell'animazione (più lenta) prima di cambiare vista
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setView(area.id);
            }, 2500);
        } else {
            setView(area.id);
        }
    };

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 z-0 bg-slate-950 flex flex-col overflow-hidden select-none animate-in fade-in duration-1000"
            style={zoomingTo ? {
                transform: `scale(4) translate(${50 - zoomingTo.x}%, ${50 - zoomingTo.y}%)`,
                transition: 'transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: `${zoomingTo.x}% ${zoomingTo.y}%`
            } : {
                transition: 'transform 2.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <style>{`
                @keyframes pulse-soft {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
                .area-glow {
                    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
                    border: 1px solid rgba(168, 85, 247, 0.3);
                    background: rgba(168, 85, 247, 0.1);
                }
                .point-marker {
                    width: 12px;
                    height: 12px;
                    background: #a855f7;
                    border: 2px solid white;
                    border-radius: 50%;
                    position: absolute;
                    transform: translate(-50%, -50%);
                    z-index: 60;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                }
            `}</style>

            {/* LOADER */}
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">ESPLORO I SOTTERRANEI...</span>
                </div>
            )}

            {/* SFONDO FULL SCREEN */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={EXPLORE_SUB_BG} 
                    alt="Esplora i Sotterranei" 
                    className={`w-full h-full object-fill md:object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>

            {/* AREE CLICCABILI */}
            {isLoaded && !zoomingTo && areas.map((area: AreaConfig) => (
                <div
                    key={area.id}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAreaClick(area);
                    }}
                    className="absolute z-10 cursor-pointer transition-all duration-300 rounded-xl flex items-center justify-center bg-transparent"
                    style={getAreaStyle(area.points)}
                />
            ))}

            {/* HEADER CONTROLS (HUD) */}
            <div className="absolute top-[80px] md:top-[120px] left-6 right-6 z-50 flex justify-between items-start pointer-events-none">
                <button 
                    onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); 
                        pauseSubMusic();
                        setView(AppView.MAGIC_TOWER_SUB); 
                    }}
                    className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_BACK_SUB} alt="Indietro" className="w-20 h-20 md:w-32 h-auto drop-shadow-2xl" />
                </button>

                <div className="flex flex-col items-end gap-4 pointer-events-auto">
                    <button 
                        onClick={toggleMusic}
                        className={`hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
                    >
                        <img src={AUDIO_ICON_IMG} alt="Audio" className="w-14 h-14 md:w-20 h-auto drop-shadow-xl" />
                    </button>
                </div>
            </div>

            {/* MESSAGGIO AMBIENTALE */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none px-6">
                <div className="bg-black/40 backdrop-blur-sm border-2 border-white/10 px-6 py-3 rounded-full animate-pulse-soft">
                    <p className="text-blue-300 font-bold text-xs md:text-lg uppercase tracking-widest text-center">
                        Ascolta i sussurri delle antiche pietre...
                    </p>
                </div>
            </div>

            {/* TITOLO IN BASSO */}
            <div className="absolute bottom-4 left-6 opacity-30 pointer-events-none">
                <span className="text-white font-black text-[10px] uppercase tracking-[0.4em]">ESPLORAZIONE SOTTERRANEI</span>
            </div>

            {/* DISSOLVENZA VERSO IL NERO PER L'AREA OSCURITÀ */}
            <div 
                className={`fixed inset-0 z-[100] bg-black pointer-events-none transition-opacity duration-1000 ${zoomingTo ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

export default ExploreSubPage;
