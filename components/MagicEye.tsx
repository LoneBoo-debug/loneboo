import React, { useState, useEffect } from 'react';
import { OFFICIAL_LOGO } from '../constants';
import StoryDice from './StoryDice';
import MagicHunt from './MagicHunt';
import GhostPassport from './GhostPassport';
import MagicHat from './MagicHat';
import RobotHint from './RobotHint'; 

const TOWER_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tower-mobile.webp';
const TOWER_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tower-desktop.webp';
const BTN_BACK_TOWER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-tower.webp';
const BG_PASSPORT_GHOST = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfghtpasswde.webp';
const BG_MAGIC_HUNT = 'https://i.postimg.cc/DzmbRdLY/caccimagifd.jpg';
const BG_STORY_DICE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflancdadersdd.webp';
const BG_MAGIC_HAT = 'https://i.postimg.cc/X7VBMLG9/gfffsrr.jpg';

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

  useEffect(() => {
      const imgM = new Image(); imgM.src = TOWER_BG_MOBILE;
      const imgD = new Image(); imgD.src = TOWER_BG_DESKTOP;
      
      const checkLoaded = () => {
          setIsLoaded(true);
      };

      imgM.onload = checkLoaded;
      imgD.onload = checkLoaded;

      const timer = setTimeout(() => setIsLoaded(true), 2500);
      return () => clearTimeout(timer);
  }, []);

  const handleZoneClick = (gameId: string) => {
      setActiveGame(gameId);
  };

  const getClipPath = (points: Point[]) => {
      if (!points || points.length < 3) return 'none';
      return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
  };

  if (activeGame) {
      const bg = activeGame === 'passport' ? BG_PASSPORT_GHOST : 
                 activeGame === 'hunt' ? BG_MAGIC_HUNT : 
                 activeGame === 'hat' ? BG_MAGIC_HAT : 
                 BG_STORY_DICE;
      
      return (
          <div className="fixed inset-0 z-50 bg-black overflow-y-auto custom-scrollbar">
              <img src={bg} alt="" className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none" />
              
              <div className="relative z-10 w-full min-h-full pb-20">
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
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-purple-900 overflow-hidden touch-none overscroll-none select-none">
        {!isLoaded && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900/95 backdrop-blur-md">
                <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">STO CARICANDO...</span>
            </div>
        )}
        
        <RobotHint 
            show={isLoaded} 
            message="Tocca un oggetto magico e divertiti.." 
            variant="PURPLE"
        />
        
        <div className="relative w-full h-full overflow-hidden select-none">
            {/* --- MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={TOWER_BG_MOBILE} 
                    alt="Torre Magica" 
                    className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false} 
                />
                {isLoaded && ZONES_MOBILE.map((zone, i) => (
                    <div key={i} onClick={() => handleZoneClick(zone.id)} className="absolute inset-0 cursor-pointer z-20" style={{ clipPath: getClipPath(zone.points) }}></div>
                ))}
            </div>

            {/* --- DESKTOP (ORIZZONTALE 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={TOWER_BG_DESKTOP} 
                    alt="Torre Magica Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false} 
                />
                {isLoaded && ZONES_DESKTOP.map((zone, i) => (
                    <div key={i} onClick={() => handleZoneClick(zone.id)} className="absolute inset-0 cursor-pointer z-20" style={{ clipPath: getClipPath(zone.points) }}></div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default MagicEye;