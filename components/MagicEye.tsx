
import React, { useState, useEffect } from 'react';
import { OFFICIAL_LOGO } from '../constants';
import StoryDice from './StoryDice';
import MagicHunt from './MagicHunt';
import GhostPassport from './GhostPassport';
import MagicHat from './MagicHat';
import RobotHint from './RobotHint'; 

const TOWER_BG_MOBILE = 'https://i.postimg.cc/KY2JJg7L/torremagicddsjpeg.jpg';
const TOWER_BG_DESKTOP = 'https://i.postimg.cc/yxmrqxt3/magia169.jpg';
const TOWER_ICON = 'https://i.postimg.cc/G2mVkBG8/torretr-(1).png';
const BTN_BACK_TOWER_IMG = 'https://i.postimg.cc/65YbdbPv/ornatorre-(1)-(1).png';
const BG_PASSPORT_GHOST = 'https://i.postimg.cc/sxR91466/passfants-(1).jpg';
const BG_MAGIC_HUNT = 'https://i.postimg.cc/DzmbRdLY/caccimagifd.jpg';
const BG_STORY_DICE = 'https://i.postimg.cc/nL82vGr7/gfddfg.jpg';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

const ZONES_MOBILE: ZoneConfig[] = [
  { "id": "dice", "points": [ { "x": 14.66, "y": 62.63 }, { "x": 6.66, "y": 76.09 }, { "x": 26.39, "y": 78.79 }, { "x": 31.72, "y": 68.38 } ] },
  { "id": "hunt", "points": [ { "x": 67.96, "y": 12.56 }, { "x": 57.3, "y": 28.54 }, { "x": 78.09, "y": 33.56 }, { "x": 85.55, "y": 15.61 } ] },
  { "id": "passport", "points": [ { "x": 27.99, "y": 54.74 }, { "x": 41.04, "y": 62.1 }, { "x": 62.63, "y": 60.84 }, { "x": 58.37, "y": 49.35 } ] },
  { "id": "hat", "points": [ { "x": 77.56, "y": 57.97 }, { "x": 78.09, "y": 71.61 }, { "x": 95.42, "y": 74.66 }, { "x": 95.68, "y": 57.79 } ] }
];

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
      const imgM = new Image(); imgM.src = TOWER_BG_MOBILE;
      const imgD = new Image(); imgD.src = TOWER_BG_DESKTOP;
      
      const timer = setTimeout(() => setIsLoaded(true), 800);
      const hintTimer = setTimeout(() => { if (!activeGame) setShowHint(true); }, 5000); 
      
      return () => {
          clearTimeout(timer);
          clearTimeout(hintTimer);
      };
  }, [activeGame]);

  const handleZoneClick = (gameId: string) => {
      setShowHint(false);
      setActiveGame(gameId);
  };

  const getClipPath = (points: Point[]) => {
      if (!points || points.length < 3) return 'none';
      return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
  };

  if (activeGame) {
      const bg = activeGame === 'passport' ? BG_PASSPORT_GHOST : (activeGame === 'hunt' ? BG_MAGIC_HUNT : BG_STORY_DICE);
      
      return (
          <div className="fixed inset-0 z-50 bg-black overflow-y-auto custom-scrollbar">
              {/* Sfondo fisso che copre tutto */}
              <img src={bg} alt="" className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none" />
              
              <div className="relative z-10 w-full min-h-full pb-20">
                  {/* Container tasto indietro con padding per scavalcare l'header */}
                  <div className="sticky top-0 left-0 w-full px-4 pt-[70px] md:pt-[110px] pb-4 flex justify-start z-[60] pointer-events-none">
                      <button 
                          onClick={() => setActiveGame(null)}
                          className="hover:scale-105 active:scale-95 transition-transform outline-none pointer-events-auto"
                      >
                          <img src={BTN_BACK_TOWER_IMG} alt="Torna" className="h-16 md:h-24 w-auto drop-shadow-lg" />
                      </button>
                  </div>

                  <div className="w-full px-2 md:px-4">
                      {activeGame === 'dice' && <StoryDice />}
                      {activeGame === 'hunt' && <MagicHunt onClose={() => setActiveGame(null)} />}
                      {activeGame === 'passport' && <GhostPassport />}
                      {activeGame === 'hat' && <MagicHat />}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="relative w-full h-[calc(100vh-68px)] md:h-[calc(100vh-106px)] bg-purple-900 overflow-hidden flex flex-col">
        {!isLoaded && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900">
                <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 animate-spin-horizontal mb-4" />
                <span className="text-white font-bold tracking-widest animate-pulse uppercase">STO CARICANDO...</span>
            </div>
        )}
        
        {isLoaded && (
            <div className="absolute top-4 left-4 z-30 pointer-events-none animate-in slide-in-from-left duration-700">
                <img src={TOWER_ICON} alt="Torre Magica" className="w-32 md:w-48 h-auto drop-shadow-xl" />
            </div>
        )}

        <RobotHint show={showHint} message="Tocca un oggetto magico!" />
        
        <div className="relative flex-1 w-full h-full overflow-hidden select-none">
            <div className="block md:hidden w-full h-full relative">
                <img src={TOWER_BG_MOBILE} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                {ZONES_MOBILE.map((zone, i) => (
                    <div key={i} onClick={() => handleZoneClick(zone.id)} className="absolute inset-0 cursor-pointer z-20" style={{ clipPath: getClipPath(zone.points) }}></div>
                ))}
            </div>
            <div className="hidden md:block w-full h-full relative">
                <img src={TOWER_BG_DESKTOP} alt="" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                {ZONES_DESKTOP.map((zone, i) => (
                    <div key={i} onClick={() => handleZoneClick(zone.id)} className="absolute inset-0 cursor-pointer z-20" style={{ clipPath: getClipPath(zone.points) }}></div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default MagicEye;
