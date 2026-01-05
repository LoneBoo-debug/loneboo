
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';
import { AppView } from '../types';

// --- LAZY LOADING STRUMENTI ---
const PianoInstrument = lazy(() => import('./sound/PianoInstrument'));
const DjConsole = lazy(() => import('./sound/DjConsole'));
const DrumKit = lazy(() => import('./sound/DrumKit'));
const AnimalOrchestra = lazy(() => import('./sound/AnimalOrchestra'));
const ChoirVoiceChanger = lazy(() => import('./sound/ChoirVoiceChanger'));
const PlaceholderInstrument = lazy(() => import('./sound/PlaceholderInstrument'));

const DISCO_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/disco-mobile.webp';
const DISCO_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/disco-desktop.webp';
const BTN_EXIT_DISCO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/exitdiscocit.webp';

enum SoundMode {
    NONE = 'NONE',
    PIANO = 'PIANO',
    DJ = 'DJ',
    DRUMS = 'DRUMS',
    ANIMALS = 'ANIMALS',
    XYLOPHONE = 'XYLOPHONE',
    GUITAR = 'GUITAR',
    CHOIR = 'CHOIR',
    BONGO = 'BONGO'
}

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

const ZONES_MOBILE: ZoneConfig[] = [
  { "id": "Piano", "points": [ { "x": 8, "y": 51.87 }, { "x": 19.19, "y": 63.89 }, { "x": 51.97, "y": 51.69 }, { "x": 41.58, "y": 42.18 } ] },
  { "id": "Batteria", "points": [ { "x": 58.1, "y": 35.71 }, { "x": 59.43, "y": 53.12 }, { "x": 87.42, "y": 57.07 }, { "x": 88.22, "y": 32.12 } ] },
  { "id": "Effects/DJ", "points": [ { "x": 62.1, "y": 73.94 }, { "x": 67.43, "y": 82.38 }, { "x": 97.81, "y": 68.56 }, { "x": 88.75, "y": 62.28 } ] },
  { "id": "Animali", "points": [ { "x": 10.66, "y": 21.9 }, { "x": 18.39, "y": 32.66 }, { "x": 31.72, "y": 29.61 }, { "x": 24.25, "y": 18.49 } ] },
  { "id": "Chitarra", "points": [ { "x": 36.51, "y": 12.74 }, { "x": 36.78, "y": 34.28 }, { "x": 46.91, "y": 33.02 }, { "x": 40.25, "y": 13.1 } ] },
  { "id": "Coro", "points": [ { "x": 55.17, "y": 14.18 }, { "x": 55.17, "y": 26.2 }, { "x": 93.55, "y": 29.25 }, { "x": 87.95, "y": 14.54 } ] },
  { "id": "Xilofono", "points": [ { "x": 10.66, "y": 76.81 }, { "x": 3.73, "y": 80.4 }, { "x": 24.25, "y": 88.48 }, { "x": 28.25, "y": 84.71 } ] },
  { "id": "Bongo", "points": [ { "x": 30.92, "y": 88.12 }, { "x": 31.72, "y": 96.02 }, { "x": 38.11, "y": 96.55 }, { "x": 40.25, "y": 87.22 } ] }
];

const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "Piano", "points": [ { "x": 30.82, "y": 55.08 }, { "x": 36.35, "y": 66.88 }, { "x": 50.91, "y": 54.55 }, { "x": 46.28, "y": 45.64 } ] },
  { "id": "Batteria", "points": [ { "x": 53.4, "y": 36.72 }, { "x": 53.85, "y": 57.18 }, { "x": 67.73, "y": 59.8 }, { "x": 66.83, "y": 35.15 } ] },
  { "id": "Effects/DJ", "points": [ { "x": 54.75, "y": 76.32 }, { "x": 57.57, "y": 84.45 }, { "x": 71.69, "y": 71.08 }, { "x": 66.83, "y": 64.26 } ] },
  { "id": "Animali", "points": [ { "x": 32.06, "y": 23.61 }, { "x": 35.79, "y": 35.67 }, { "x": 42.33, "y": 31.47 }, { "x": 38.95, "y": 19.41 } ] },
  { "id": "Xilofono", "points": [ { "x": 32.74, "y": 78.16 }, { "x": 29.69, "y": 82.09 }, { "x": 39.06, "y": 90.22 }, { "x": 40.64, "y": 86.03 } ] },
  { "id": "Chitarra", "points": [ { "x": 28.45, "y": 24.65 }, { "x": 29.01, "y": 46.95 }, { "x": 33.3, "y": 46.16 }, { "x": 29.92, "y": 25.18 } ] },
  { "id": "Coro", "points": [ { "x": 51.36, "y": 14.43 }, { "x": 51.82, "y": 28.33 }, { "x": 70.78, "y": 30.42 }, { "x": 70.78, "y": 14.69 } ] },
  { "id": "Bongo", "points": [ { "x": 41.77, "y": 88.39 }, { "x": 42.11, "y": 97.04 }, { "x": 45.38, "y": 96.78 }, { "x": 45.95, "y": 87.6 } ] }
];

const SoundZone: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
  const [activeMode, setActiveMode] = useState<SoundMode>(SoundMode.NONE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
      const imgMobile = new Image(); imgMobile.src = DISCO_BG_MOBILE;
      const imgDesktop = new Image(); imgDesktop.src = DISCO_BG_DESKTOP;
      let loadedCount = 0;
      const checkLoad = () => { 
          loadedCount++; 
          if (loadedCount >= 1) setIsLoaded(true); 
      };
      imgMobile.onload = checkLoad; 
      imgDesktop.onload = checkLoad;
      
      setTimeout(() => setIsLoaded(true), 2000);
      window.scrollTo(0, 0);
  }, []); 

  const handleZoneClick = (zoneId: string) => {
      switch (zoneId) {
          case 'Piano': setActiveMode(SoundMode.PIANO); break;
          case 'Batteria': setActiveMode(SoundMode.DRUMS); break;
          case 'Effects/DJ': setActiveMode(SoundMode.DJ); break;
          case 'Animali': setActiveMode(SoundMode.ANIMALS); break;
          case 'Xilofono': setActiveMode(SoundMode.XYLOPHONE); break;
          case 'Chitarra': setActiveMode(SoundMode.GUITAR); break;
          case 'Coro': setActiveMode(SoundMode.CHOIR); break;
          case 'Bongo': setActiveMode(SoundMode.BONGO); break;
      }
  };

  const getClipPath = (points: Point[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

  if (activeMode !== SoundMode.NONE) {
      return (
          <Suspense fallback={
              <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gray-900">
                  <img src={OFFICIAL_LOGO} alt="" className="w-32 h-32 animate-spin-horizontal mb-6" onError={(e) => { e.currentTarget.src = 'https://i.postimg.cc/tCZGcq9V/official.png'; }} />
                  <span className="text-white font-black text-lg tracking-widest animate-pulse">ACCORDO GLI STRUMENTI...</span>
              </div>
          }>
              {activeMode === SoundMode.PIANO && <PianoInstrument onBack={() => setActiveMode(SoundMode.NONE)} />}
              {activeMode === SoundMode.DJ && <DjConsole onBack={() => setActiveMode(SoundMode.NONE)} />}
              {activeMode === SoundMode.DRUMS && <DrumKit onBack={() => setActiveMode(SoundMode.NONE)} />}
              {activeMode === SoundMode.ANIMALS && <AnimalOrchestra onBack={() => setActiveMode(SoundMode.NONE)} />}
              {activeMode === SoundMode.CHOIR && <ChoirVoiceChanger onBack={() => setActiveMode(SoundMode.NONE)} />}
              {activeMode === SoundMode.GUITAR && <PlaceholderInstrument title="Chitarra" onBack={() => setActiveMode(SoundMode.NONE)} />}
              {activeMode === SoundMode.XYLOPHONE && <PlaceholderInstrument title="Xilofono" onBack={() => setActiveMode(SoundMode.NONE)} />}
              {activeMode === SoundMode.BONGO && <PlaceholderInstrument title="Bongo" onBack={() => setActiveMode(SoundMode.NONE)} />}
          </Suspense>
      );
  }

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-indigo-900 overflow-hidden touch-none overscroll-none select-none">
        {!isLoaded && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-purple-900/95 backdrop-blur-md">
                <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                <span className="text-white font-bold text-lg tracking-widest animate-pulse uppercase">STO CARICANDO...</span>
            </div>
        )}

        <div className="relative w-full h-full overflow-hidden">
            {/* TASTO ESCI PER LA CITTÀ */}
            {isLoaded && (
                <div className="absolute top-20 md:top-28 left-4 z-50">
                    <button 
                        onClick={() => setView(AppView.CITY_MAP)}
                        className="hover:scale-105 active:scale-95 transition-transform outline-none drop-shadow-xl"
                    >
                        <img src={BTN_EXIT_DISCO} alt="Esci" className="h-16 md:h-24 w-auto" />
                    </button>
                </div>
            )}

            <div className="block md:hidden absolute inset-0 w-full h-full overflow-hidden">
                <img 
                    src={DISCO_BG_MOBILE} 
                    alt="Disco Zone Mobile" 
                    className={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false}
                />
                
                {isLoaded && (
                    <div className="absolute top-[68%] left-[47%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 w-full flex justify-center">
                        <span 
                            className="font-luckiest text-3xl sm:text-4xl text-white uppercase text-center transform -rotate-[38deg] transition-all duration-300"
                            style={{ WebkitTextStroke: '1.5px black' }}
                        >
                            Tocca uno <br/> strumento
                        </span>
                    </div>
                )}

                {isLoaded && ZONES_MOBILE.map(z => (
                    <div 
                        key={z.id} 
                        onClick={(e) => { e.stopPropagation(); handleZoneClick(z.id); }} 
                        className="absolute inset-0 cursor-pointer active:bg-white/10 z-20" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>

            <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
                <img 
                    src={DISCO_BG_DESKTOP} 
                    alt="Disco Zone Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false}
                />

                {isLoaded && (
                    <div className="absolute top-[70%] left-[47%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 w-full flex justify-center">
                        <span 
                            className="font-luckiest text-5xl lg:text-7xl text-white uppercase text-center transform -rotate-[38deg] transition-all duration-300"
                            style={{ WebkitTextStroke: '2.5px black' }}
                        >
                            Tocca uno strumento
                        </span>
                    </div>
                )}

                {isLoaded && ZONES_DESKTOP.map(z => (
                    <div 
                        key={z.id} 
                        onClick={(e) => { e.stopPropagation(); handleZoneClick(z.id); }} 
                        className="absolute inset-0 cursor-pointer hover:bg-white/10 z-20" 
                        style={{ clipPath: getClipPath(z.points) }}
                    ></div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default SoundZone;
