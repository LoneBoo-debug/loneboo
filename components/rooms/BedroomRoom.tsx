
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../../types';
import RoomLayout from './RoomLayout';
import StarMap from '../StarMap';
import ScratchCardGame from '../ScratchCardGame';
import SlingShotGame from '../SlingShotGame';
import GooseGame from '../GooseGame';
import { X } from 'lucide-react';
import { addTokens } from '../../services/tokens';

const BAULE_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trunk-open-mobile.webp';
const BAULE_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trunk-open-desktop.webp';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_PARENTS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';
const IMG_LOCKED_GAMES = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/yesnoi.webp';
const BTN_EXIT_GARDEN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/escicasagiardi77jy5tr.webp';

// Asset Audio e Video
const BEDROOM_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/camerettabboovoice4e.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number, y: number };
type BauleGameId = 'oca' | 'fionda' | 'gratta';

const BEDROOM_ZONES = [
  {
    "id": "libri",
    "points": [ { "x": 68, "y": 67.02 }, { "x": 67.2, "y": 73.61 }, { "x": 76.8, "y": 75.11 }, { "x": 82.93, "y": 68.07 } ]
  },
  {
    "id": "sveglia",
    "points": [ { "x": 82.4, "y": 72.11 }, { "x": 81.07, "y": 78.11 }, { "x": 97.87, "y": 79.76 }, { "x": 98.93, "y": 72.56 } ]
  },
  {
    "id": "baule",
    "points": [ { "x": 21.33, "y": 64.92 }, { "x": 21.07, "y": 73.91 }, { "x": 39.73, "y": 81.86 }, { "x": 57.07, "y": 77.96 }, { "x": 56.27, "y": 66.87 }, { "x": 35.47, "y": 61.77 } ]
  },
  {
    "id": "telescopio",
    "points": [ { "x": 27.73, "y": 37.93 }, { "x": 28.53, "y": 55.77 }, { "x": 49.33, "y": 58.02 }, { "x": 55.2, "y": 49.63 }, { "x": 48.27, "y": 38.23 } ]
  },
  {
    "id": "sveglia_boo",
    "points": [ { "x": 79.69, "y": 53.64 }, { "x": 73.56, "y": 59.09 }, { "x": 91.15, "y": 62.33 }, { "x": 98.08, "y": 55.35 } ]
  }
];

const LockedGamePopup: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white w-full max-sm rounded-[40px] border-8 border-orange-500 p-8 flex flex-col items-center text-center shadow-2xl relative">
            <button onClick={onBack} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110"><X size={24} strokeWidth={4}/></button>
            <div className="w-60 h-60 mb-4"><img src={IMG_LOCKED_GAMES} alt="Autorizzazione" className="w-full h-full object-contain" /></div>
            <h2 className="text-3xl font-black text-orange-600 mb-4 uppercase leading-tight font-luckiest">Gioco Bloccato!</h2>
            <p className="text-gray-600 font-bold mb-8 leading-relaxed">Chiedi a <span className="text-blue-600">Papà</span> o <span className="text-pink-500">Mamma</span> di attivare questo gioco nell'Area Genitori.</p>
            <button onClick={() => window.dispatchEvent(new CustomEvent('triggerParentalGate'))} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 text-lg shadow-lg"><img src={ICON_PARENTS} alt="" className="w-8 h-8 object-contain" />VAI DAI GENITORI</button>
        </div>
    </div>
);

const BaulePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeSubGame, setActiveSubGame] = useState<BauleGameId | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('authorized_games_enabled') === 'true');

    useEffect(() => {
        const handleSettingsUpdate = () => setIsAuthorized(localStorage.getItem('authorized_games_enabled') === 'true');
        window.addEventListener('settingsChanged', handleSettingsUpdate);
        return () => window.removeEventListener('settingsChanged', handleSettingsUpdate);
    }, []);

    const points = {
        oca: [{ "x": 27.19, "y": 46.61 }, { "x": 57.3, "y": 54.71 }, { "x": 31.72, "y": 81.38 }, { "x": 2.93, "y": 70.74 }],
        fionda: [{ "x": 58.1, "y": 42.57 }, { "x": 81.56, "y": 37.62 }, { "x": 96.75, "y": 50.21 }, { "x": 80.22, "y": 57.4 }],
        gratta: [{ "x": 61.3, "y": 58 }, { "x": 47.71, "y": 72.69 }, { "x": 66.63, "y": 79.74 }, { "x": 81.82, "y": 63.25 }]
    };
    const getClipPath = (pts: Point[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    if (activeSubGame === 'gratta') return <ScratchCardGame onBack={() => setActiveSubGame(null)} />;
    if (activeSubGame === 'fionda') {
        if (!isAuthorized) return <LockedGamePopup title="Tiro alla Fionda" onBack={() => setActiveSubGame(null)} />;
        return <SlingShotGame onBack={() => setActiveSubGame(null)} onEarnTokens={(a) => addTokens(a)} />;
    }
    if (activeSubGame === 'oca') return <GooseGame onBack={() => setActiveSubGame(null)} />;

    return (
        <div className="fixed inset-0 z-[90] bg-black flex flex-col items-center justify-center pt-[68px] md:pt-[106px] overflow-hidden animate-in fade-in duration-500">
            <div className="absolute inset-0 z-0">
                <img src={BAULE_BG_MOBILE} alt="" className="block md:hidden w-full h-full object-cover object-center pointer-events-none" />
                <img src={BAULE_BG_DESKTOP} alt="" className="hidden md:block w-full h-full object-cover object-center pointer-events-none" />
                <div onClick={() => setActiveSubGame('oca')} className="absolute inset-0 cursor-pointer group" style={{ clipPath: getClipPath(points.oca) }}><div className="w-full h-full opacity-0 group-hover:bg-white/10 transition-colors" /></div>
                <div onClick={() => setActiveSubGame('fionda')} className="absolute inset-0 cursor-pointer group" style={{ clipPath: getClipPath(points.fionda) }}><div className="w-full h-full opacity-0 group-hover:bg-white/10 transition-colors" /></div>
                <div onClick={() => setActiveSubGame('gratta')} className="absolute inset-0 cursor-pointer group" style={{ clipPath: getClipPath(points.gratta) }}><div className="w-full h-full opacity-0 group-hover:bg-white/10 transition-colors" /></div>
            </div>
            <button onClick={onBack} className="fixed top-28 right-4 z-[95] hover:scale-110 active:scale-95 transition-all outline-none"><img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl" /></button>
        </div>
    );
};

const BedroomRoom: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [activePage, setActivePage] = useState<{ id: string, label: string } | null>(null);
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(BEDROOM_MUSIC_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
        }

        if (isAudioOn) audioRef.current.play().catch(e => console.log("Audio play blocked", e));

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

    const handleZoneClick = (id: string) => {
        if (id === 'telescopio') setActivePage({ id: 'telescope', label: 'Mappa Stellare' });
        else if (id === 'baule') setActivePage({ id: 'baule', label: 'Baule dei Segreti' });
        else if (id === 'sveglia') setView(AppView.STOPWATCH_GAME);
        else if (id === 'libri') setView(AppView.TALES);
        else if (id === 'sveglia_boo') setView(AppView.SVEGLIA_BOO);
    };

    const getClipPath = (points: Point[]) => {
        if (!points || points.length < 3) return 'none';
        return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    if (activePage?.id === 'telescope') return <StarMap onClose={() => setActivePage(null)} />;
    if (activePage?.id === 'baule') return <BaulePage onBack={() => setActivePage(null)} />;

    return (
        <RoomLayout roomType={AppView.BOO_BEDROOM} setView={setView} disableHint={true}>
            {/* TASTO ESCI */}
            <div className="absolute top-28 md:top-40 left-1/2 -translate-x-1/2 z-50">
                <button 
                    onClick={() => setView(AppView.BOO_GARDEN)} 
                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_EXIT_GARDEN_IMG} alt="Torna in Giardino" className="h-12 md:h-16 w-auto drop-shadow-xl" />
                </button>
            </div>

            {/* MINI TV */}
            {isAudioOn && isPlaying && (
                <div className="absolute top-48 md:top-64 left-4 z-50 animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            {/* AREA CLICCABILE */}
            <div className="absolute inset-0 z-10">
                {BEDROOM_ZONES.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => handleZoneClick(z.id)} 
                        className="absolute inset-0 cursor-pointer active:bg-white/10" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
        </RoomLayout>
    );
};

export default BedroomRoom;
