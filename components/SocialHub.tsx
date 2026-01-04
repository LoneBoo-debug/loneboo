
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { getChannelStatistics } from '../services/api';
import { getSocialStatsFromCSV } from '../services/data';
import { SOCIALS, SUPPORT_LINKS, OFFICIAL_LOGO } from '../constants';

const TRAIN_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/station-mobile.webp';
const TRAIN_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/station-desktop.webp';
const BTN_BACK_CITY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-station-back.webp';
const BTN_PARTI_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-station-depart.webp';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };
type StatConfig = { id: string; top: string; left: string; width: string; height: string; color: string; glow: string; };

// ZONE MOBILE (AREE CLICCABILI)
const ZONES_MOBILE: ZoneConfig[] = [
  { id: "Facebook", points: [{ x: 6.13, y: 23.15 }, { x: 4.26, y: 41.46 }, { x: 17.32, y: 42.71 }, { x: 17.59, y: 25.84 }] },
  { id: "YouTube", points: [{ x: 24.52, y: 29.25 }, { x: 24.25, y: 42.89 }, { x: 34.38, y: 43.61 }, { "x": 34.91, "y": 32.48 }] },
  { id: "TikTok", points: [{ x: 6.13, y: 49.35 }, { x: 6.13, y: 65.87 }, { x: 19.99, y: 63.89 }, { x: 18.66, y: 48.99 }] },
  { id: "Instagram", points: [{ x: 25.05, y: 49.35 }, { x: 23.99, y: 62.63 }, { x: 34.91, y: 60.12 }, { x: 34.91, y: 48.99 }] }
];

// ZONE DESKTOP (AREE CLICCABILI)
const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "Facebook", "points": [ { "x": 30.67, "y": 22.05 }, { "x": 30.07, "y": 42.08 }, { "x": 36.19, "y": 44.55 }, { "x": 36.49, "y": 25.88 } ] },
  { "id": "YouTube", "points": [ { "x": 37.99, "y": 28.35 }, { "x": 38.09, "y": 45.23 }, { "x": 43.3, "y": 46.13 }, { "x": 43.3, "y": 31.73 } ] },
  { "id": "TikTok", "points": [ { "x": 30.57, "y": 47.93 }, { "x": 30.37, "y": 68.63 }, { "x": 36.89, "y": 66.83 }, { "x": 36.89, "y": 49.28 } ] },
  { "id": "Instagram", "points": [ { "x": 38.29, "y": 49.05 }, { "x": 38.59, "y": 64.58 }, { "x": 43.3, "y": 62.56 }, { "x": 43, "y": 48.83 } ] }
];

// POSIZIONAMENTO STATISTICHE (MOBILE)
const STATS_LOCATIONS_MOBILE: StatConfig[] = [
    { id: 'youtube', top: '15.25%', left: '45.31%', width: '14.4%', height: '3.6%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'instagram', top: '21.1%', left: '45.31%', width: '14.4%', height: '3.4%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'tiktok', top: '21.5%', left: '71.5%', width: '14.4%', height: '4.0%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'facebook', top: '15.4%', left: '71.43%', width: '14.4%', height: '4.0%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' }
];

// POSIZIONAMENTO STATISTICHE (DESKTOP)
const STATS_LOCATIONS_DESKTOP: StatConfig[] = [
    { id: 'youtube', top: '14.8%', left: '50.3%', width: '10%', height: '4.27%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'instagram', top: '19.8%', left: '50.3%', width: '10%', height: '5.4%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'tiktok', top: '20.2%', left: '71.5%', width: '10%', height: '5.4%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'facebook', top: '15.0%', left: '71.5%', width: '10%', height: '5.4%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' }
];

type SocialStatsState = {
    youtube: string;
    instagram: string;
    tiktok: string;
    facebook: string;
};

const SocialHub: React.FC<{ setView?: (view: AppView) => void }> = ({ setView }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [stats, setStats] = useState<SocialStatsState>({ youtube: '...', instagram: '...', tiktok: '...', facebook: '...' });

  useEffect(() => {
      // Pre-caricamento sfondi
      const imgMobile = new Image(); imgMobile.src = TRAIN_BG_MOBILE;
      const imgDesktop = new Image(); imgDesktop.src = TRAIN_BG_DESKTOP;
      
      const checkLoad = () => {
          setBgLoaded(true);
      };

      imgMobile.onload = checkLoad;
      imgDesktop.onload = checkLoad;
      
      // Timer di sicurezza: se dopo 2 secondi l'immagine non ha caricato, mostriamo comunque la pagina
      const safetyTimer = setTimeout(() => {
          setBgLoaded(true);
      }, 2000);

      const fetchStats = async () => {
          const newStats = { ...stats };
          try {
              const ytData = await getChannelStatistics();
              if (ytData) newStats.youtube = ytData.subscriberCount;
          } catch (e) { newStats.youtube = "Err"; }
          
          try {
              const csvStats = await getSocialStatsFromCSV();
              if (csvStats) {
                  newStats.instagram = csvStats.instagram || '0';
                  newStats.tiktok = csvStats.tiktok || '0';
                  newStats.facebook = csvStats.facebook || '0';
              }
          } catch (e) {}
          setStats(newStats);
      };
      
      fetchStats();
      return () => {
          clearTimeout(safetyTimer);
      };
  }, []);

  const getClipPath = (points: {x: number, y: number}[]) => {
      if (!points || points.length < 3) return 'none';
      const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
      return `polygon(${poly})`;
  };

  const getSocialUrl = (id: string) => {
      let social = SOCIALS.find(s => s.platform.toLowerCase() === id.toLowerCase());
      if (!social) {
          social = SUPPORT_LINKS.find(s => s.platform.toLowerCase() === id.toLowerCase());
      }
      return social ? social.url : '#';
  };

  const renderInteractives = (isDesktop: boolean) => {
      const activeZones = isDesktop ? ZONES_DESKTOP : ZONES_MOBILE;
      const activeStats = isDesktop ? STATS_LOCATIONS_DESKTOP : STATS_LOCATIONS_MOBILE;
      
      return (
      <>
        {activeStats.map((loc) => (
            <div
                key={loc.id}
                className="absolute flex items-center justify-center z-20 pointer-events-none"
                style={{ top: loc.top, left: loc.left, width: loc.width, height: loc.height }}
            >
                <span 
                    className={`font-mono font-black leading-none ${loc.color} ${loc.glow}`}
                    style={{ fontSize: isDesktop ? 'min(1.8vw, 2.5vh)' : 'min(4.5vw, 3.5vh)', textShadow: '0 0 4px black' }}
                >
                    {/* @ts-ignore */}
                    {stats[loc.id]}
                </span>
            </div>
        ))}

        {activeZones.map((zone) => (
            <a
                key={zone.id}
                href={getSocialUrl(zone.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 cursor-pointer z-30"
                style={{ clipPath: getClipPath(zone.points) }}
                title={`Vai a ${zone.id}`}
            >
                <div className="w-full h-full"></div>
            </a>
        ))}
      </>
      );
  };

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-10 bg-indigo-900 overflow-hidden touch-none overscroll-none select-none">
        {!bgLoaded && (
            <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-indigo-950 backdrop-blur-md">
                <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">
                    Arrivo in Stazione...
                </span>
            </div>
        )}

        <div className="relative w-full h-full overflow-hidden">
            {/* PULSANTI DI NAVIGAZIONE */}
            {setView && bgLoaded && (
                <>
                    <button 
                        onClick={() => setView(AppView.CITY_MAP)}
                        className="absolute bottom-4 left-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Torna in città"
                    >
                        <img 
                            src={BTN_BACK_CITY_IMG} 
                            alt="Torna in città" 
                            className="w-32 md:w-56 h-auto drop-shadow-xl" 
                        />
                    </button>

                    <button 
                        onClick={() => setView(AppView.TRAIN_JOURNEY)}
                        className="absolute bottom-4 right-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Inizia il viaggio"
                    >
                        <img 
                            src={BTN_PARTI_IMG} 
                            alt="Parti" 
                            className="w-40 md:w-64 h-auto drop-shadow-xl" 
                        />
                    </button>
                </>
            )}

            {/* SFONDI MOBILE/DESKTOP */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={TRAIN_BG_MOBILE} 
                    alt="Stazione Lone Boo Mobile" 
                    className={`w-full h-full object-fill object-center transition-opacity duration-700 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {bgLoaded && renderInteractives(false)}
            </div>

            <div className="hidden md:block w-full h-full relative">
                <img 
                    src={TRAIN_BG_DESKTOP} 
                    alt="Stazione Lone Boo Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-700 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {bgLoaded && renderInteractives(true)}
            </div>
        </div>
    </div>
  );
};

export default SocialHub;
