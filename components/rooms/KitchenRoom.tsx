import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../../types';
import RoomLayout from './RoomLayout';
import { Construction, X } from 'lucide-react';
import FruitCatcherGame from '../FruitCatcherGame';
import RecyclingGame from '../RecyclingGame';
import TetrisGame from '../TetrisGame';
import PopcornGame from '../PopcornGame';

const ZONES_MOBILE = [
  { id: "spazzatura", label: "Riciclo", points: [{ x: 11.46, y: 54.16 }, { x: 19.19, y: 65.22 }, { x: 1.87, y: 79.36 }, { x: 0, y: 60.29 }] },
  { id: "microonde", label: "Microonde", points: [{ x: 16.26, y: 43.43 }, { x: 15.72, y: 49.22 }, { x: 29.85, y: 49.39 }, { x: 30.92, y: 42.75 }] },
  { id: "frutta", label: "Cesta Frutta", points: [{ x: 41.58, y: 49.39 }, { x: 42.64, y: 59.78 }, { x: 58.37, y: 60.29 }, { x: 60.5, y: 49.39 }] },
  { id: "frigorifero", label: "Frigorifero", points: [{ x: 87.69, y: 36.96 }, { x: 86.09, y: 76.12 }, { x: 98.61, y: 84.13 }, { "x": 98.08, "y": 36.61 }] }
];

const ZONES_DESKTOP = [
  { id: "spazzatura", label: "Riciclo", points: [{ "x": 25.66, "y": 66.38 }, { "x": 25.86, "y": 89.33 }, { "x": 37.49, "y": 71.11 }, { "x": 35.08, "y": 56.26 }] },
  { id: "microonde", label: "Microonde", points: [{ "x": 36.09, "y": 42.75 }, { "x": 36.19, "y": 49.73 }, { "x": 42.5, "y": 49.95 }, { "x": 42.5, "y": 42.08 }] },
  { id: "frutta", label: "Cesta Frutta", points: [{ "x": 46.81, "y": 51.53 }, { "x": 47.41, "y": 64.36 }, { "x": 53.13, "y": 64.81 }, { "x": 54.13, "y": 51.31 }] },
  { id: "frigorifero", label: "Frigorifero", points: [{ "x": 66.16, "y": 34.2 }, { "x": 65.36, "y": 84.16 }, { "x": 74.18, "y": 95.63 }, { "x": 81.8, "y": 35.1 }] }
];

const KITCHEN_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/d4db425c-801c-44ab-8093-c43590f687e7.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

const UnderConstructionPage: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="w-full h-full bg-white flex flex-col animate-in slide-in-from-right duration-300">
        <div className="bg-yellow-400 p-4 md:p-6 flex items-center gap-4 border-b-4 border-black shrink-0 shadow-md">
            <button 
                onClick={onBack} 
                className="bg-white w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-transform flex items-center justify-center text-black shadow-lg"
                title="Torna in Cucina"
            >
                <X size={24} strokeWidth={4} className="text-black" />
            </button>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-black drop-shadow-sm">{title}</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 relative overflow-hidden">
            <div className="absolute top-10 right-10 text-6xl opacity-10 animate-float">👻</div>
            <div className="absolute bottom-10 left-10 text-6xl opacity-10 animate-float delay-700">👻</div>
            <div className="w-40 h-40 md:w-64 md:h-64 mb-6 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-dashed border-yellow-400 animate-pulse shadow-inner">
                <Construction size={70} className="text-yellow-600" />
            </div>
            <h3 className="text-3xl md:text-6xl font-black text-gray-800 mb-4 uppercase tracking-tighter">In Costruzione! 🚧</h3>
            <p className="text-lg md:text-2xl font-bold text-gray-500 max-w-md leading-relaxed px-4">
                Stiamo preparando qualcosa di magico per questa sezione. <br/>
                <span className="text-boo-purple font-black">Torna a trovarci presto!</span> 👻
            </p>
            <button 
                onClick={onBack}
                className="mt-12 bg-blue-500 text-white font-black px-12 py-5 rounded-full border-4 border-black shadow-[6px_6px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-xl md:text-2xl uppercase"
            >
                TORNA IN CUCINA
            </button>
        </div>
    </div>
);

const KitchenRoom: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [activePageId, setActivePageId] = useState<string | null>(null);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setIsLoaded(true);
        if (!audioRef.current) {
            audioRef.current = new Audio(KITCHEN_VOICE_URL);
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
            if (enabled && isLoaded && !activePageId) {
                audioRef.current?.play().catch(() => {});
                sessionStorage.setItem('heard_audio_kitchen', 'true');
            } else {
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
    }, [isLoaded, activePageId]);

    // Logica intelligente audio
    useEffect(() => {
        if (isLoaded && isAudioOn && audioRef.current && !activePageId) {
            const alreadyHeard = sessionStorage.getItem('heard_audio_kitchen') === 'true';
            if (!alreadyHeard) {
                audioRef.current.play().catch(e => console.log("Audio play blocked", e));
                sessionStorage.setItem('heard_audio_kitchen', 'true');
            }
        }
    }, [isLoaded, isAudioOn, activePageId]);

    const getClipPath = (points: {x: number, y: number}[]) => {
        const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
        return `polygon(${poly})`;
    };

    if (activePageId === 'frutta') {
        return <FruitCatcherGame onBack={() => setActivePageId(null)} />;
    }

    if (activePageId === 'spazzatura') {
        return <RecyclingGame onBack={() => setActivePageId(null)} />;
    }

    if (activePageId === 'frigorifero') {
        return <TetrisGame onBack={() => setActivePageId(null)} />;
    }

    if (activePageId === 'microonde') {
        return <PopcornGame onBack={() => setActivePageId(null)} />;
    }

    const activePage = [...ZONES_MOBILE, ...ZONES_DESKTOP].find(z => z.id === activePageId);

    if (activePageId && activePage) {
        return <UnderConstructionPage title={activePage.label} onBack={() => setActivePageId(null)} />;
    }

    return (
        <RoomLayout 
            roomType={AppView.BOO_KITCHEN} 
            setView={setView} 
            hintMessage="Tocca gli oggetti!" 
            hintVariant="YELLOW"
        >
            {isAudioOn && isPlaying && (
                <div className="absolute top-48 md:top-64 left-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}
            <div className="absolute inset-0 z-10 md:hidden">
                {ZONES_MOBILE.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => setActivePageId(z.id)} 
                        className="absolute inset-0 cursor-pointer active:bg-white/10" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
            <div className="absolute inset-0 z-10 hidden md:block">
                {ZONES_DESKTOP.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => setActivePageId(z.id)} 
                        className="absolute inset-0 cursor-pointer hover:bg-white/10 transition-colors" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
        </RoomLayout>
    );
};

export default KitchenRoom;
