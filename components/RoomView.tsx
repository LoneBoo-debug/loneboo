
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import RobotHint from './RobotHint';

// --- NUOVO ASSET MAPPA CASA (CORRETTO) ---
const HOUSE_MAP_IMAGE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bgdfre554de32.webp';

type Point = { x: number; y: number };

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
        const img = new Image();
        img.src = HOUSE_MAP_IMAGE;
        img.onload = () => setIsLoaded(true);
        // Fallback per garantire che lo spinner sparisca se il caricamento fallisce
        const timer = setTimeout(() => setIsLoaded(true), 3500);
        const hintTimer = setTimeout(() => setShowHint(true), 3000);
        return () => {
            clearTimeout(timer);
            clearTimeout(hintTimer);
        };
    }, []);

    const getClipPath = (points: Point[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    return (
        <div className="fixed inset-0 z-0 bg-black overflow-hidden select-none touch-none animate-in fade-in duration-700">
             {!isLoaded && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-indigo-900">
                    <img 
                        src={OFFICIAL_LOGO} 
                        alt="Caricamento..." 
                        className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                        onError={(e) => { 
                            e.currentTarget.src = 'https://i.postimg.cc/tCZGcq9V/official.png'; 
                        }} 
                    />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">
                        Entro in casa...
                    </span>
                </div>
            )}

            <RobotHint show={showHint && isLoaded} message="Tocca una stanza per entrare!" variant="GHOST" />

            {/* BACKGROUND IMAGE - FULL SCREEN */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <img 
                    src={HOUSE_MAP_IMAGE} 
                    alt="Casa di Boo" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />

                {/* CLICKABLE ZONES (DESKTOP) */}
                <div className="hidden md:block absolute inset-0 z-10">
                    {ZONES_DESKTOP.map(z => (
                        <div 
                            key={z.id} 
                            onClick={() => setView(z.id)} 
                            className="absolute inset-0 cursor-pointer hover:bg-white/10 transition-colors" 
                            style={{ clipPath: getClipPath(z.points) }}
                        ></div>
                    ))}
                </div>

                {/* CLICKABLE ZONES (MOBILE) */}
                <div className="block md:hidden absolute inset-0 z-10">
                    {ZONES_MOBILE.map(z => (
                        <div 
                            key={z.id} 
                            onClick={() => setView(z.id)} 
                            className="absolute inset-0 cursor-pointer active:bg-white/10" 
                            style={{ clipPath: getClipPath(z.points) }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomView;
