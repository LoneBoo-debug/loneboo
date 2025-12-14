import React, { useState, useEffect, useRef } from 'react';
import StoryDice from './StoryDice';
import MagicHunt from './MagicHunt';
import GhostPassport from './GhostPassport';
import MagicHat from './MagicHat';
import { ArrowLeft, Loader2 } from 'lucide-react';
import RobotHint from './RobotHint'; 

const TOWER_BG_MOBILE = 'https://i.postimg.cc/KY2JJg7L/torremagicddsjpeg.jpg';
const TOWER_BG_DESKTOP = 'https://i.postimg.cc/yxmrqxt3/magia169.jpg';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

// ZONE MOBILE CALIBRATE
const ZONES_MOBILE: ZoneConfig[] = [
  { "id": "dice", "points": [ { "x": 14.66, "y": 62.63 }, { "x": 6.66, "y": 76.09 }, { "x": 26.39, "y": 78.79 }, { "x": 31.72, "y": 68.38 } ] },
  { "id": "hunt", "points": [ { "x": 67.96, "y": 12.56 }, { "x": 57.3, "y": 28.54 }, { "x": 78.09, "y": 33.56 }, { "x": 85.55, "y": 15.61 } ] },
  { "id": "passport", "points": [ { "x": 27.99, "y": 54.74 }, { "x": 41.04, "y": 62.1 }, { "x": 62.63, "y": 60.84 }, { "x": 58.37, "y": 49.35 } ] },
  { "id": "hat", "points": [ { "x": 77.56, "y": 57.97 }, { "x": 78.09, "y": 71.61 }, { "x": 95.42, "y": 74.66 }, { "x": 95.68, "y": 57.79 } ] }
];

// ZONE DESKTOP DEFINITIVE
const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "dice", "points": [ { "x": 32.88, "y": 64.58 }, { "x": 32.18, "y": 78.08 }, { "x": 42.3, "y": 79.66 }, { "x": 42.4, "y": 65.48 } ] },
  { "id": "hunt", "points": [ { "x": 54.53, "y": 16.2 }, { "x": 54.33, "y": 30.38 }, { "x": 63.85, "y": 31.05 }, { "x": 63.35, "y": 11.25 } ] },
  { "id": "passport", "points": [ { "x": 41, "y": 52.43 }, { "x": 44.41, "y": 63.46 }, { "x": 54.43, "y": 62.33 }, { "x": 53.73, "y": 49.28 } ] },
  { "id": "hat", "points": [ { "x": 61.35, "y": 57.83 }, { "x": 61.55, "y": 71.33 }, { "x": 68.87, "y": 73.36 }, { "x": 67.66, "y": 57.83 } ] }
];

const MagicEye: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
      // Preload both images
      const imgMobile = new Image();
      imgMobile.src = TOWER_BG_MOBILE;
      const imgDesktop = new Image();
      imgDesktop.src = TOWER_BG_DESKTOP;

      let loadedCount = 0;
      const checkLoad = () => {
          loadedCount++;
          if (loadedCount >= 1) setIsLoaded(true);
      };

      imgMobile.onload = checkLoad;
      imgDesktop.onload = checkLoad;

      // Fallback
      setTimeout(() => setIsLoaded(true), 1500);

      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
          if (!activeGame) setShowHint(true);
      }, 5000); 

      return () => clearTimeout(timer);
  }, []);

  const handleInteraction = () => {
      if (showHint) setShowHint(false);
  };

  const handleZoneClick = (gameId: string) => {
      setShowHint(false);
      setActiveGame(gameId);
  };

  const getClipPath = (points: Point[]) => {
      if (!points || points.length < 3) return 'none';
      const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
      return `polygon(${poly})`;
  };

  if (activeGame) {
      return (
          <div className="w-full h-full bg-white overflow-y-auto animate-in slide-in-from-right duration-300 relative z-40">
              <div className="max-w-5xl mx-auto p-4 md:p-6 pb-24 min-h-full relative">
                  <div className="flex items-center justify-between mb-6 mt-2 sticky top-0 bg-white/90 backdrop-blur-sm z-40 p-2 rounded-xl border-b-2 border-gray-100 shadow-sm">
                      <button 
                          onClick={() => setActiveGame(null)}
                          className="flex items-center gap-2 bg-purple-600 text-white font-black px-4 py-2 md:px-6 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all text-sm md:text-base"
                      >
                          <ArrowLeft size={20} strokeWidth={3} /> TORNA ALLA TORRE
                      </button>
                      <h2 className="text-xl md:text-2xl font-black text-purple-800 uppercase hidden sm:block">
                          {activeGame === 'dice' ? 'Dadi delle Storie' : 
                           activeGame === 'hunt' ? 'Caccia Magica' : 
                           activeGame === 'passport' ? 'Passaporto Fantasma' : 'Cappello Magico'}
                      </h2>
                  </div>
                  <div className="animate-in zoom-in duration-300">
                      {activeGame === 'dice' && <StoryDice />}
                      {activeGame === 'hunt' && <MagicHunt />}
                      {activeGame === 'passport' && <GhostPassport />}
                      {activeGame === 'hat' && <MagicHat />}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div 
        className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col"
        onClick={handleInteraction}
    >
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-900 z-50">
                <span className="text-purple-300 font-black text-2xl animate-pulse flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Salgo sulla Torre...
                </span>
            </div>
        )}

        <RobotHint 
            show={showHint && isLoaded && !activeGame} 
            message="Tocca un oggetto e scopri la magia"
        />

        <div className="relative flex-1 w-full h-full overflow-hidden select-none">
            
            {/* --- MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={TOWER_BG_MOBILE} 
                    alt="Torre Magica Lone Boo Mobile" 
                    className={`w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {ZONES_MOBILE.map((zone, i) => (
                    <div
                        key={i}
                        onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }}
                        className="absolute inset-0 cursor-pointer"
                        style={{ clipPath: getClipPath(zone.points) }}
                    ></div>
                ))}
            </div>

            {/* --- DESKTOP (ORIZZONTALE 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={TOWER_BG_DESKTOP} 
                    alt="Torre Magica Lone Boo Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                
                {/* RENDER ZONE DESKTOP */}
                {ZONES_DESKTOP.map((zone, i) => (
                    <div
                        key={i}
                        onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }}
                        className="absolute inset-0 cursor-pointer"
                        style={{ clipPath: getClipPath(zone.points) }}
                    ></div>
                ))}
            </div>

        </div>
    </div>
  );
};

export default MagicEye;