import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import RobotHint from './RobotHint';
import { X, Trash2, Apple, Utensils, Clock, Sparkles, Smile, RefreshCw, Trophy, Camera, Droplets, Shirt } from 'lucide-react';
import { addTokens } from '../services/tokens';

// =================================================================================================
// 🏠 MAPPA DELLA CASA (DEFAULT EXPORT)
// =================================================================================================
const HOUSE_MAP_MOBILE = 'https://i.postimg.cc/9F308yt9/houseplanss-(1).png';
const HOUSE_MAP_DESKTOP = 'https://i.postimg.cc/7YLR63CN/hpuse169.jpg';

const ZONES_MOBILE = [
  { "id": AppView.BOO_GARDEN, "points": [ { "x": 6.13, "y": 78.43 }, { "x": 6.13, "y": 88.48 }, { "x": 32.78, "y": 88.12 }, { "x": 32.52, "y": 77.35 } ] },
  { "id": AppView.BOO_BEDROOM, "points": [ { "x": 9.86, "y": 45.41 }, { "x": 9.86, "y": 68.56 }, { "x": 36.51, "y": 68.74 }, { "x": 36.78, "y": 44.87 } ] },
  { "id": AppView.BOO_LIVING_ROOM, "points": [ { "x": 46.11, "y": 13.64 }, { "x": 48.77, "y": 45.76 }, { "x": 90.09, "y": 44.87 }, { "x": 88.49, "y": 16.15 } ] },
  { "id": AppView.BOO_BATHROOM, "points": [ { "x": 65.03, "y": 51.69 }, { "x": 64.5, "y": 68.74 }, { "x": 86.35, "y": 69.1 }, { "x": 88.22, "y": 51.51 } ] },
  { "id": AppView.BOO_KITCHEN, "points": [ { "x": 9.59, "y": 14.9 }, { "x": 8.53, "y": 38.94 }, { "x": 36.51, "y": 39.12 }, { "x": 37.58, "y": 15.61 } ] }
];

const ZONES_DESKTOP = [
  { "id": AppView.BOO_KITCHEN, "points": [ { "x": 26.96, "y": 13.73 }, { "x": 26.76, "y": 41.85 }, { "x": 44.11, "y": 42.53 }, { "x": 44.51, "y": 13.73 } ] },
  { "id": AppView.BOO_LIVING_ROOM, "points": [ { "x": 49.72, "y": 16.43 }, { "x": 49.72, "y": 47.48 }, { "x": 72.47, "y": 47.93 }, { "x": 72.77, "y": 14.63 } ] },
  { "id": AppView.BOO_BEDROOM, "points": [ { "x": 26.96, "y": 46.8 }, { "x": 27.27, "y": 72.46 }, { "x": 43.7, "y": 72.23 }, { "x": 43.7, "y": 46.35 } ] },
  { "id": AppView.BOO_BATHROOM, "points": [ { "x": 57.34, "y": 53.11 }, { "x": 57.34, "y": 72.46 }, { "x": 72.07, "y": 72.46 }, { "x": 72.57, "y": 52.66 } ] },
  { "id": AppView.BOO_GARDEN, "points": [ { "x": 58.44, "y": 78.53 }, { "x": 58.74, "y": 92.26 }, { "x": 97.43, "y": 92.03 }, { "x": 97.73, "y": 24.53 }, { "x": 76.88, "y": 22.28 }, { "x": 75.28, "y": 75.61 } ] }
];

const RoomView: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const imgM = new Image(); imgM.src = HOUSE_MAP_MOBILE;
        const imgD = new Image(); imgD.src = HOUSE_MAP_DESKTOP;
        imgM.onload = () => setIsLoaded(true);
        setTimeout(() => setIsLoaded(true), 2000);
        const timer = setTimeout(() => setShowHint(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    const getClipPath = (points: {x: number, y: number}[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    return (
        <div className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-indigo-900 overflow-hidden">
             {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-indigo-900/95 backdrop-blur-md">
                    <img 
                        src={OFFICIAL_LOGO} 
                        alt="Caricamento..." 
                        className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                        onError={(e) => { 
                            e.currentTarget.src = 'https://i.postimg.cc/tCZGcq9V/official.png'; 
                        }} 
                    />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">
                        Sto Caricando...
                    </span>
                </div>
            )}
            <RobotHint show={showHint} message="Tocca una stanza per entrare!" variant="GHOST" />
            <div className="block md:hidden w-full h-full relative">
                <img src={HOUSE_MAP_MOBILE} alt="" className="w-full h-full object-fill" />
                {ZONES_MOBILE.map(z => <div key={z.id} onClick={() => setView(z.id)} className="absolute inset-0 cursor-pointer" style={{ clipPath: getClipPath(z.points) }}></div>)}
            </div>
            <div className="hidden md:block w-full h-full relative">
                <img src={HOUSE_MAP_DESKTOP} alt="" className="w-full h-full object-fill" />
                {ZONES_DESKTOP.map(z => <div key={z.id} onClick={() => setView(z.id)} className="absolute inset-0 cursor-pointer hover:bg-white/10" style={{ clipPath: getClipPath(z.points) }}></div>)}
            </div>
        </div>
    );
};

export default RoomView;

// =================================================================================================
// 🍳 GIOCHI CUCINA (KITCHEN)
// =================================================================================================

export const MicrowaveGame: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-orange-500 p-10 max-w-sm w-full text-center">
            <h2 className="text-3xl font-black text-orange-600 mb-4">Mmmh che profumo! 🥯</h2>
            <p className="font-bold text-gray-500 mb-6">Il pane si sta scaldando nel microonde...</p>
            <div className="w-48 h-32 bg-gray-200 border-8 border-gray-400 rounded-xl mx-auto mb-8 flex items-center justify-center relative">
                 <div className="w-full h-1 bg-red-500 animate-pulse absolute"></div>
                 <span className="text-4xl">🥯</span>
            </div>
            <button onClick={onClose} className="bg-orange-500 text-white font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">CHIUDI</button>
        </div>
    </div>
);

export const RestaurantGame: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-yellow-400 p-10 max-w-sm w-full text-center">
            <h2 className="text-3xl font-black text-yellow-600 mb-4">Cesta della Frutta 🍎</h2>
            <p className="font-bold text-gray-500 mb-6">Scegli la tua merenda preferita!</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
                 <button className="bg-red-100 p-4 rounded-2xl border-2 border-red-300 text-4xl">🍎</button>
                 <button className="bg-yellow-100 p-4 rounded-2xl border-2 border-yellow-300 text-4xl">🍌</button>
                 <button className="bg-orange-100 p-4 rounded-2xl border-2 border-orange-300 text-4xl">🍊</button>
                 <button className="bg-purple-100 p-4 rounded-2xl border-2 border-purple-300 text-4xl">🍇</button>
            </div>
            <button onClick={onClose} className="bg-yellow-400 text-black font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">GNAM!</button>
        </div>
    </div>
);

export const PiggyGame: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-cyan-500 p-10 max-w-sm w-full text-center">
            <h2 className="text-3xl font-black text-cyan-600 mb-4">Frigo Ghiacciato! ❄️</h2>
            <p className="font-bold text-gray-500 mb-6">Il latte e lo yogurt sono freschissimi!</p>
            <div className="flex justify-center gap-4 mb-8">
                 <span className="text-6xl animate-bounce">🥛</span>
                 <span className="text-6xl animate-bounce delay-100">🍦</span>
            </div>
            <button onClick={onClose} className="bg-cyan-500 text-white font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">FREDDISSIMO!</button>
        </div>
    </div>
);

// =================================================================================================
// 🛌 GIOCHI CAMERA (BEDROOM)
// =================================================================================================

export const ClockGame: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-pink-500 p-10 max-w-sm w-full text-center">
            <Clock size={64} className="mx-auto mb-4 text-pink-500 animate-wiggle" />
            <h2 className="text-3xl font-black text-pink-600 mb-4">Driiiin! ⏰</h2>
            <p className="font-bold text-gray-500 mb-6">È ora di giocare o di fare la nanna?</p>
            <button onClick={onClose} className="bg-pink-500 text-white font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">SVEGLIA!</button>
        </div>
    </div>
);

export const MonsterMakeoverGame: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-purple-500 p-10 max-w-sm w-full text-center">
            <h2 className="text-3xl font-black text-purple-600 mb-4">Baule Magico 🧳</h2>
            <p className="font-bold text-gray-500 mb-6">Cosa nasconde Boo nel baule?</p>
            <div className="text-7xl mb-8">🎩✨</div>
            <button onClick={onClose} className="bg-purple-500 text-white font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">SCOPRI!</button>
        </div>
    </div>
);

// =================================================================================================
// 🛁 GIOCHI BAGNO (BATHROOM)
// =================================================================================================

export const MagicMirrorPlayer: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-cyan-400 p-10 max-w-sm w-full text-center">
            <div className="w-32 h-32 bg-cyan-100 rounded-full mx-auto mb-6 border-4 border-white shadow-inner flex items-center justify-center">
                <span className="text-6xl">✨</span>
            </div>
            <h2 className="text-3xl font-black text-cyan-600 mb-4">Specchio Magico</h2>
            <p className="font-bold text-gray-500 mb-8">Lavati i denti e guarda che bel sorriso!</p>
            <button onClick={onClose} className="bg-cyan-400 text-white font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">SORRIDI!</button>
        </div>
    </div>
);

export const SinkFloatGame: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-blue-500 p-10 max-w-sm w-full text-center">
            <Droplets size={64} className="mx-auto mb-4 text-blue-500 animate-bounce" />
            <h2 className="text-3xl font-black text-blue-600 mb-4">Splash! 🛁</h2>
            <p className="font-bold text-gray-500 mb-6">Galleggia o affonda? Facciamo un esperimento!</p>
            <button onClick={onClose} className="bg-blue-500 text-white font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">GIOCA</button>
        </div>
    </div>
);

export const BlobLineGame: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-green-400 p-10 max-w-sm w-full text-center">
            <h2 className="text-3xl font-black text-green-600 mb-4">Bolle di Sapone! 🫧</h2>
            <p className="font-bold text-gray-500 mb-6">Scoppia tutte le bolle colorate!</p>
            <div className="text-5xl flex justify-center gap-2 mb-8">🫧🫧🫧</div>
            <button onClick={onClose} className="bg-green-400 text-white font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">SCOPPIA!</button>
        </div>
    </div>
);

export const LaundrySortGame: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] border-8 border-gray-400 p-10 max-w-sm w-full text-center">
            <Shirt size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-3xl font-black text-gray-600 mb-4">Panni Sporchi! 🧺</h2>
            <p className="font-bold text-gray-500 mb-6">Dividi i vestiti bianchi da quelli colorati.</p>
            <button onClick={onClose} className="bg-gray-500 text-white font-black px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black]">ORDINA</button>
        </div>
    </div>
);