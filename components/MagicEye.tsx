
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { OFFICIAL_LOGO } from '../constants';
import { AppView } from '../types';
import StoryDice from './StoryDice';
import MagicHunt from './MagicHunt';
import GhostPassport from './GhostPassport';
import MagicHat from './MagicHat';
import RobotHint from './RobotHint'; 
import { isNightTime } from '../services/weatherService';

const TOWER_BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torremoagicagiornides.webp';
const TOWER_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torremagicanottemnb.webp';

const BTN_BACK_TOWER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-tower.webp';
const BTN_BACK_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/waeedwed+(2)+(1)+(1).webp';

const BG_PASSPORT_GHOST = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfghtpasswde.webp';
const BG_MAGIC_HUNT = 'https://i.postimg.cc/DzmbRdLY/caccimagifd.jpg';
const BG_STORY_DICE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflancdadersdd.webp';
const BG_MAGIC_HAT = 'https://i.postimg.cc/X7VBMLG9/gfffsrr.jpg';

// Asset Audio e Video Ambientali
const AMBIENT_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torremagicaspeechboo4e4e4.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

const ZONES_DATA: ZoneConfig[] = [
  { "id": "dice", "points": [ { "x": 14.66, "y": 62.63 }, { "x": 6.66, "y": 76.09 }, { "x": 26.39, "y": 78.79 }, { "x": 31.72, "y": 68.38 } ] },
  { "id": "hunt", "points": [ { "x": 67.96, "y": 12.56 }, { "x": 57.3, "y": 28.54 }, { "x": 78.09, "y": 33.56 }, { "x": 85.55, "y": 15.61 } ] },
  { "id": "passport", "points": [ { "x": 27.99, "y": 54.74 }, { "x": 41.04, "y": 62.1 }, { "x": 62.63, "y": 60.84 }, { "x": 58.37, "y": 49.35 } ] },
  { "id": "hat", "points": [ { "x": 77.56, "y": 57.97 }, { "x": 78.09, "y": 71.61 }, { "x": 95.42, "y": 74.66 }, { "x": 95.68, "y": 57.79 } ] }
];

// Note: Le coordinate sono ora unificate per il nuovo sfondo
const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "dice", "points": [ { "x": 32.88, "y": 64.58 }, { "x": 32.18, "y": 78.08 }, { "x": 42.3, "y": 79.66 }, { "x": 42.4, "y": 65.48 } ] },
  { "id": "hunt", "points": [ { "x": 54.53, "y": 16.2 }, { "x": 54.33, "y": 30.38 }, { "x": 63.85, "y": 31.05 }, { "x": 63.35, "y": 11.25 } ] },
  { "id": "passport", "points": [ { "x": 41, "y": 52.43 }, { "x": 44.41, "y": 63.46 }, { "x": 54.43, "y": 62.33 }, { "x": 53.73, "y": 49.28 } ] },
  { "id": "hat", "points": [ { "x": 61.35, "y": 57.83 }, { "x": 61.55, "y": 71.33 }, { "x": 68.87, "y": 73.36 }, { "x": 67.66, "y": 57.83 } ] }
];

interface MagicEyeProps {
    setView: (view: AppView) => void;
}

const MagicEye: React.FC<MagicEyeProps> = ({ setView }) => {
  const [now, setNow] = useState(new Date());
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Stati per l'audio e video ambientale
  const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentBg = useMemo(() => {
    return isNightTime(now) ? TOWER_BG_NIGHT : TOWER_BG_DAY;
  }, [now]);

  useEffect(() => {
      // Monitoraggio orario per cambio sfondo
      const timeInterval = setInterval(() => setNow(new Date()), 60000);

      const img = new Image(); 
      img.src = currentBg;
      img.onload = () => setIsLoaded(true);

      // Inizializzazione Audio Ambientale
      if (!ambientAudioRef.current) {
          ambientAudioRef.current = new Audio(AMBIENT_VOICE_URL);
          ambientAudioRef.current.loop = false;
          ambientAudioRef.current.volume = 0.5;

          ambientAudioRef.current.addEventListener('play', () => setIsAmbientPlaying(true));
          ambientAudioRef.current.addEventListener('pause', () => setIsAmbientPlaying(false));
          ambientAudioRef.current.addEventListener('ended', () => {
              setIsAmbientPlaying(false);
              if (ambientAudioRef.current) ambientAudioRef.current.currentTime = 0;
          });
      }

      // Avvio automatico se l'audio è già attivo globalmente
      if (isAudioOn && !activeGame) {
          ambientAudioRef.current.play().catch(e => console.log("Ambient audio blocked", e));
      }

      // Listener per cambiamenti audio globali dall'header
      const handleGlobalAudioChange = () => {
          const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
          setIsAudioOn(enabled);
          if (enabled && !activeGame) {
              ambientAudioRef.current?.play().catch(() => {});
          } else {
              ambientAudioRef.current?.pause();
          }
      };
      window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

      const timer = setTimeout(() => setIsLoaded(true), 2500);
      
      return () => {
          clearInterval(timeInterval);
          clearTimeout(timer);
          window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
          if (ambientAudioRef.current) {
              ambientAudioRef.current.pause();
              ambientAudioRef.current.currentTime = 0;
          }
      };
  }, [activeGame, currentBg]);

  // Interrompe ambient quando si entra in un gioco
  useEffect(() => {
    if (activeGame) {
        ambientAudioRef.current?.pause();
    } else if (isAudioOn) {
        ambientAudioRef.current?.play().catch(() => {});
    }
  }, [activeGame, isAudioOn]);

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

        {/* MINI TV DI BOO - Sincronizzato con l'audio ambientale */}
        {isLoaded && isAudioOn && isAmbientPlaying && !activeGame && (
            <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                    <video 
                        src={BOO_TALK_VIDEO}
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover" 
                        style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                </div>
            </div>
        )}

        {/* TASTO ESCI PER LA CITTÀ - Posizionato al limite superiore */}
        {isLoaded && !activeGame && (
            <div className="absolute top-1 md:top-2 left-0 md:left-1 z-50 animate-in slide-in-from-left duration-500">
                <button 
                    onClick={() => setView(AppView.CITY_MAP)}
                    className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-2xl"
                >
                    <img src={BTN_BACK_CITY} alt="Torna in Città" className="h-64 md:h-[600px] w-auto drop-shadow-xl" />
                </button>
            </div>
        )}
        
        <RobotHint 
            show={isLoaded && !activeGame} 
            message="Tocca un oggetto magico e divertiti.." 
            variant="PURPLE"
        />
        
        <div className="relative w-full h-full overflow-hidden select-none">
            {/* --- MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={currentBg} 
                    alt="Torre Magica" 
                    className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false} 
                />
                {isLoaded && ZONES_DATA.map((zone, i) => (
                    <div key={i} onClick={() => handleZoneClick(zone.id)} className="absolute inset-0 cursor-pointer z-20" style={{ clipPath: getClipPath(zone.points) }}></div>
                ))}
            </div>

            {/* --- DESKTOP (ORIZZONTALE 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={currentBg} 
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
