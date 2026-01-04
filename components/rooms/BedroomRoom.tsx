
import React, { useState, useEffect } from 'react';
import { AppView } from '../../types';
import RoomLayout from './RoomLayout';
import StarMap from '../StarMap';
import ScratchCardGame from '../ScratchCardGame';
import SlingShotGame from '../SlingShotGame';
import GooseGame from '../GooseGame';
import { X, Target, Construction, Lock } from 'lucide-react';
import { addTokens } from '../../services/tokens';

const BAULE_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trunk-open-mobile.webp';
const BAULE_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trunk-open-desktop.webp';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const ICON_PARENTS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';
const IMG_LOCKED_GAMES = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/yesnoi.webp';

// --- TIPI ---
type BaulePoint = { x: number, y: number };
type BauleGameId = 'oca' | 'fionda' | 'gratta';

// --- COMPONENTE DI BLOCCO GIOCO ---
const LockedGamePopup: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white w-full max-sm rounded-[40px] border-8 border-orange-500 p-8 flex flex-col items-center text-center shadow-2xl relative">
            <button onClick={onBack} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110"><X size={24} strokeWidth={4}/></button>
            
            <div className="w-60 h-60 mb-4">
                <img src={IMG_LOCKED_GAMES} alt="Autorizzazione" className="w-full h-full object-contain" />
            </div>

            <h2 className="text-3xl font-black text-orange-600 mb-4 uppercase leading-tight font-luckiest">Gioco Bloccato!</h2>
            
            <p className="text-gray-600 font-bold mb-8 leading-relaxed">
                Chiedi a <span className="text-blue-600">Papà</span> o <span className="text-pink-500">Mamma</span> di attivare questo gioco nell'Area Genitori.
            </p>

            <button 
                onClick={() => window.dispatchEvent(new CustomEvent('triggerParentalGate'))}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 text-lg shadow-lg"
            >
                <img src={ICON_PARENTS} alt="" className="w-8 h-8 object-contain" />
                VAI DAI GENITORI
            </button>
        </div>
    </div>
);

// --- COMPONENTE BAULE ---
const BaulePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeSubGame, setActiveSubGame] = useState<BauleGameId | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('authorized_games_enabled') === 'true');

    useEffect(() => {
        const handleSettingsUpdate = () => {
            setIsAuthorized(localStorage.getItem('authorized_games_enabled') === 'true');
        };
        window.addEventListener('settingsChanged', handleSettingsUpdate);
        return () => window.removeEventListener('settingsChanged', handleSettingsUpdate);
    }, []);

    const handleEarnTokens = (amount: number) => {
        addTokens(amount);
    };
    
    const points = {
        oca: [
          { "x": 27.19, "y": 46.61 },
          { "x": 57.3, "y": 54.71 },
          { "x": 31.72, "y": 81.38 },
          { "x": 2.93, "y": 70.74 }
        ],
        fionda: [
          { "x": 58.1, "y": 42.57 },
          { "x": 81.56, "y": 37.62 },
          { "x": 96.75, "y": 50.21 },
          { "x": 80.22, "y": 57.4 }
        ],
        gratta: [
          { "x": 61.3, "y": 58 },
          { "x": 47.71, "y": 72.69 },
          { "x": 66.63, "y": 79.74 },
          { "x": 81.82, "y": 63.25 }
        ]
    };

    const getClipPath = (pts: BaulePoint[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    if (activeSubGame === 'gratta') {
        return <ScratchCardGame onBack={() => setActiveSubGame(null)} />;
    }

    if (activeSubGame === 'fionda') {
        if (!isAuthorized) {
            return <LockedGamePopup title="Tiro alla Fionda" onBack={() => setActiveSubGame(null)} />;
        }
        return <SlingShotGame onBack={() => setActiveSubGame(null)} onEarnTokens={handleEarnTokens} />;
    }

    if (activeSubGame === 'oca') {
        return <GooseGame onBack={() => setActiveSubGame(null)} />;
    }

    return (
        <div className="fixed inset-0 z-[90] bg-black flex flex-col items-center justify-center pt-[68px] md:pt-[106px] overflow-hidden animate-in fade-in duration-500">
            <div className="absolute inset-0 z-0">
                <img src={BAULE_BG_MOBILE} alt="" className="block md:hidden w-full h-full object-cover object-center pointer-events-none" />
                <img src={BAULE_BG_DESKTOP} alt="" className="hidden md:block w-full h-full object-cover object-center pointer-events-none" />
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

                <div onClick={() => setActiveSubGame('oca')} className="absolute inset-0 cursor-pointer group" style={{ clipPath: getClipPath(points.oca) }}>
                        <div className="w-full h-full opacity-0 group-hover:bg-white/10 transition-colors" />
                </div>
                <div onClick={() => setActiveSubGame('fionda')} className="absolute inset-0 cursor-pointer group" style={{ clipPath: getClipPath(points.fionda) }}>
                        <div className="w-full h-full opacity-0 group-hover:bg-white/10 transition-colors" />
                </div>
                <div onClick={() => setActiveSubGame('gratta')} className="absolute inset-0 cursor-pointer group" style={{ clipPath: getClipPath(points.gratta) }}>
                        <div className="w-full h-full opacity-0 group-hover:bg-white/10 transition-colors" />
                </div>
            </div>

            <button 
                onClick={onBack} 
                className="fixed top-28 right-4 z-[95] hover:scale-110 active:scale-95 transition-all outline-none"
            >
                <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl" />
            </button>
        </div>
    );
};

const UnderConstructionPage: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <div className="w-full h-full bg-white flex flex-col animate-in slide-in-from-right duration-300">
        <div className="bg-pink-500 p-4 md:p-6 flex items-center gap-4 border-b-4 border-pink-700 shrink-0 shadow-md">
            <button 
                onClick={onBack} 
                className="bg-white w-10 h-10 md:w-16 md:h-16 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-transform flex items-center justify-center text-black shadow-lg"
                title="Torna in Camera"
            >
                <X size={24} strokeWidth={4} className="text-black" />
            </button>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-sm">{title}</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-pink-50 relative overflow-hidden">
            <div className="absolute top-10 right-10 text-6xl opacity-10 animate-float">🧸</div>
            <div className="absolute bottom-10 left-10 text-6xl opacity-10 animate-float delay-700">🛌</div>
            <div className="w-40 h-40 md:w-64 md:h-64 mb-6 bg-white rounded-full flex items-center justify-center border-4 border-dashed border-pink-400 animate-pulse shadow-inner">
                <Construction size={70} className="text-pink-500" />
            </div>
            <h3 className="text-3xl md:text-6xl font-black text-gray-800 mb-4 uppercase tracking-tighter">In Costruzione! 🚧</h3>
            <p className="text-lg md:text-2xl font-bold text-gray-500 max-w-md leading-relaxed px-4">
                Stiamo preparando qualcosa di magico per questa sezione. <br/>
                <span className="text-boo-purple font-black">Torna a trovarci presto!</span> 👻
            </p>
            <button 
                onClick={onBack}
                className="mt-12 bg-pink-600 text-white font-black px-12 py-5 rounded-full border-4 border-black shadow-[6px_6px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-xl md:text-2xl uppercase"
            >
                TORNA IN CAMERA
            </button>
        </div>
    </div>
);

const BedroomRoom: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [activePage, setActivePage] = useState<{ id: string, label: string } | null>(null);

    const handleZoneClick = (id: string, label: string) => {
        if (id === 'telescopio') {
            setActivePage({ id: 'telescope', label: 'Mappa Stellare' });
        } else if (id === 'baule') {
            setActivePage({ id: 'baule', label: 'Baule dei Segreti' });
        } else if (id === 'sveglia') {
            setActivePage({ id: 'sveglia', label: 'Sveglia Birichina' });
        } else if (id === 'libri') {
            setView(AppView.BOOKS_LIST);
        } else if (id === 'sveglia_boo') {
            setView(AppView.SVEGLIA_BOO);
        }
    };

    const getClipPath = (points: {x: number, y: number}[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    if (activePage?.id === 'telescope') {
        return <StarMap onClose={() => setActivePage(null)} />;
    }

    if (activePage?.id === 'baule') {
        return <BaulePage onBack={() => setActivePage(null)} />;
    }

    if (activePage) {
        return <UnderConstructionPage title={activePage.label} onBack={() => setActivePage(null)} />;
    }

    // Zone cliccabili ufficiali della camera
    const ZONES_MOBILE = [
      { "id": "libri", "label": "I Miei Libri", "points": [ { "x": 73.56, "y": 72.55 }, { "x": 85.29, "y": 72.21 }, { "x": 80.76, "y": 81.57 }, { "x": 73.03, "y": 78.85 } ] },
      { "id": "sveglia", "label": "Sveglia Birichina", "points": [ { "x": 86.35, "y": 78.68 }, { "x": 98.88, "y": 79.53 }, { "x": 99.15, "y": 86.51 }, { "x": 85.02, "y": 84.81 } ] },
      { "id": "baule", "label": "Baule dei Segreti", "points": [ { "x": 24.25, "y": 65.91 }, { "x": 55.7, "y": 70.5 }, { "x": 56.77, "y": 84.81 }, { "x": 21.32, "y": 81.4 } ] },
      { "id": "telescopio", "label": "Mappa Stellare", "points": [ { "x": 37.85, "y": 40.7 }, { "x": 58.64, "y": 47.51 }, { "x": 50.91, "y": 59.78 }, { "x": 41.04, "y": 58.41 } ] },
      { "id": "sveglia_boo", "label": "Sveglia Boo Live", "points": [ { "x": 79.69, "y": 53.64 }, { "x": 73.56, "y": 59.09 }, { "x": 91.15, "y": 62.33 }, { "x": 98.08, "y": 55.35 } ] }
    ];

    const ZONES_DESKTOP = [
      { "id": "libri", "label": "I Miei Libri", "points": [ { "x": 59.74, "y": 78.31 }, { "x": 59.54, "y": 87.53 }, { "x": 61.85, "y": 90.46 }, { "x": 65.66, "y": 80.33 } ] },
      { "id": "sveglia", "label": "Sveglia Birichina", "points": [ { "x": 64.86, "y": 86.63 }, { "x": 64.55, "y": 94.28 }, { "x": 71.37, "y": 97.43 }, { "x": 71.77, "y": 87.98 } ] },
      { "id": "baule", "label": "Baule dei Segreti", "points": [ { "x": 45.31, "y": 68.86 }, { "x": 39.29, "y": 87.31 }, { "x": 46.81, "y": 99.23 }, { "x": 53.83, "y": 87.53 } ] },
      { "id": "telescopio", "label": "Mappa Stellare", "points": [ { "x": 46.41, "y": 39.15 }, { "x": 47.71, "y": 63.68 }, { "x": 52.23, "y": 63.91 }, { "x": 54.63, "y": 45.9 } ] },
      { "id": "sveglia_boo", "label": "Sveglia Boo Live", "points": [ { "x": 62.35, "y": 55.58 }, { "x": 60.95, "y": 60.98 }, { "x": 69.57, "y": 65.03 }, { "x": 71.47, "y": 57.83 } ] }
    ];

    return (
        <RoomLayout roomType={AppView.BOO_BEDROOM} setView={setView} disableHint={true}>
            <div className="absolute inset-0 z-10 md:hidden">
                {ZONES_MOBILE.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => handleZoneClick(z.id, z.label)} 
                        className="absolute inset-0 cursor-pointer" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
            
            <div className="absolute inset-0 z-10 hidden md:block">
                {ZONES_DESKTOP.map(z => (
                    <div 
                        key={z.id} 
                        onClick={() => handleZoneClick(z.id, z.label)} 
                        className="absolute inset-0 cursor-pointer" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
        </RoomLayout>
    );
};

export default BedroomRoom;
