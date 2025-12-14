
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { Loader2 } from 'lucide-react';
import { getChannelStatistics } from '../services/api';
import { getSocialStatsFromCSV } from '../services/data';
import { SOCIALS, SUPPORT_LINKS } from '../constants';
import RobotHint from './RobotHint'; 

const TRAIN_BG_MOBILE = 'https://i.postimg.cc/hjXYYZP2/f40f6e20-ff24-4e62-b204-bb61dd9b04e9.jpg';
const TRAIN_BG_DESKTOP = 'https://i.postimg.cc/fbvLbfdd/stazione-169.jpg';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };
type StatConfig = { id: string; top: string; left: string; width: string; height: string; color: string; glow: string; };

// ZONE MOBILE (CLICKABLE AREAS)
const ZONES_MOBILE: ZoneConfig[] = [
  { id: "Facebook", points: [{ x: 6.13, y: 23.15 }, { x: 4.26, y: 41.46 }, { x: 17.32, y: 42.71 }, { x: 17.59, y: 25.84 }] },
  { id: "YouTube", points: [{ x: 24.52, y: 29.25 }, { x: 24.25, y: 42.89 }, { x: 34.38, y: 43.61 }, { x: 34.91, y: 32.48 }] },
  { id: "TikTok", points: [{ x: 6.13, y: 49.35 }, { x: 6.13, y: 65.87 }, { x: 19.99, y: 63.89 }, { x: 18.66, y: 48.99 }] },
  { id: "Instagram", points: [{ x: 25.05, y: 49.35 }, { x: 23.99, y: 62.63 }, { x: 34.91, y: 60.12 }, { x: 34.91, y: 48.99 }] },
  { id: "Telegram", points: [{ x: 21.06, y: 84.53 }, { x: 20.26, y: 94.58 }, { x: 38.65, y: 94.76 }, { x: 37.58, y: 86.68 }] },
  { id: "X", points: [{ x: 41.31, y: 77.35 }, { x: 35.98, y: 80.76 }, { x: 50.64, y: 86.5 }, { x: 57.3, y: 81.3 }] }
];

// ZONE DESKTOP (CLICKABLE AREAS)
const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "Facebook", "points": [ { "x": 30.67, "y": 22.05 }, { "x": 30.07, "y": 42.08 }, { "x": 36.19, "y": 44.55 }, { "x": 36.49, "y": 25.88 } ] },
  { "id": "YouTube", "points": [ { "x": 37.99, "y": 28.35 }, { "x": 38.09, "y": 45.23 }, { "x": 43.3, "y": 46.13 }, { "x": 43.3, "y": 31.73 } ] },
  { "id": "TikTok", "points": [ { "x": 30.57, "y": 47.93 }, { "x": 30.37, "y": 68.63 }, { "x": 36.89, "y": 66.83 }, { "x": 36.89, "y": 49.28 } ] },
  { "id": "Instagram", "points": [ { "x": 38.29, "y": 49.05 }, { "x": 38.59, "y": 64.58 }, { "x": 43.3, "y": 62.56 }, { "x": 43, "y": 48.83 } ] },
  { "id": "Telegram", "points": [ { "x": 39.9, "y": 83.26 }, { "x": 36.49, "y": 90.23 }, { "x": 44.21, "y": 96.53 }, { "x": 46.71, "y": 89.33 } ] },
  { "id": "X", "points": [ { "x": 46.21, "y": 78.08 }, { "x": 44.21, "y": 82.81 }, { "x": 50.02, "y": 88.43 }, { "x": 52.93, "y": 81.68 } ] }
];

// STATS LOCATIONS (MOBILE)
const STATS_LOCATIONS_MOBILE: StatConfig[] = [
    { id: 'youtube', top: '15.25%', left: '45.31%', width: '14.4%', height: '3.6%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'instagram', top: '21.1%', left: '45.31%', width: '14.4%', height: '3.4%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'tiktok', top: '21.5%', left: '71.5%', width: '14.4%', height: '4.0%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'facebook', top: '15.4%', left: '71.43%', width: '14.4%', height: '4.0%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' }
];

// STATS LOCATIONS (DESKTOP)
const STATS_LOCATIONS_DESKTOP: StatConfig[] = [
    { id: 'youtube', top: '15.75%', left: '50.82%', width: '0.5%', height: '4.27%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'instagram', top: '20.03%', left: '50.92%', width: '0.2%', height: '5.4%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'tiktok', top: '20.03%', left: '56.33%', width: '12.13%', height: '5.4%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' },
    { id: 'facebook', top: '14.85%', left: '62.15%', width: '0.5%', height: '5.4%', color: 'text-yellow-500', glow: 'drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' }
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
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
      // Preload Both Images
      const imgMobile = new Image();
      imgMobile.src = TRAIN_BG_MOBILE;
      const imgDesktop = new Image();
      imgDesktop.src = TRAIN_BG_DESKTOP;

      let count = 0;
      const onLoad = () => {
          count++;
          if (count >= 1) setBgLoaded(true);
      };

      imgMobile.onload = onLoad;
      imgDesktop.onload = onLoad;
      
      // Fallback
      setTimeout(() => setBgLoaded(true), 2000);

      const fetchStats = async () => {
          const newStats = { ...stats };
          try {
              const ytData = await getChannelStatistics();
              if (ytData) newStats.youtube = ytData.subscriberCount;
          } catch (e) { newStats.youtube = "Err"; }
          const csvStats = await getSocialStatsFromCSV();
          if (csvStats) {
              newStats.instagram = csvStats.instagram || '0';
              newStats.tiktok = csvStats.tiktok || '0';
              newStats.facebook = csvStats.facebook || '0';
          }
          setStats(newStats);
      };
      fetchStats();

      const timer = setTimeout(() => {
          setShowHint(true);
      }, 5000);

      return () => clearTimeout(timer);
  }, []);

  const handleInteraction = () => {
      if (showHint) setShowHint(false);
  };

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

  // --- RENDER ---
  const renderInteractives = (isDesktop: boolean) => {
      const activeZones = isDesktop ? ZONES_DESKTOP : ZONES_MOBILE;
      const activeStats = isDesktop ? STATS_LOCATIONS_DESKTOP : STATS_LOCATIONS_MOBILE;
      
      return (
      <>
        {/* STATISTICHE (Counter Numbers) */}
        {activeStats.map((loc) => (
            <div
                key={loc.id}
                className="absolute flex items-center justify-center z-20 pointer-events-none"
                style={{ top: loc.top, left: loc.left, width: loc.width, height: loc.height }}
            >
                <span 
                    className={`font-mono font-bold leading-none ${loc.color} ${loc.glow}`}
                    style={{ fontSize: isDesktop ? 'min(2vw, 3vh)' : 'min(5vw, 4vh)', textShadow: '0 0 2px black' }}
                >
                    {/* @ts-ignore */}
                    {stats[loc.id]}
                </span>
            </div>
        ))}

        {/* CLICKABLE ZONES (Polygons) */}
        {activeZones.map((zone) => (
            <a
                key={zone.id}
                href={getSocialUrl(zone.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 cursor-pointer"
                style={{ clipPath: getClipPath(zone.points) }}
                title={`Vai a ${zone.id}`}
                onClick={() => setShowHint(false)}
            >
                {/* Click area */}
                <div className="w-full h-full"></div>
            </a>
        ))}
      </>
      );
  };

  return (
    <div 
        className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col"
        onClick={handleInteraction}
    >
        {!bgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
                <span className="text-white font-black text-2xl animate-pulse flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Arrivo in Stazione...
                </span>
            </div>
        )}

        <RobotHint 
            show={showHint && bgLoaded} 
            message="Tocca un logo e vai al social"
        />

        <div className="relative flex-1 w-full h-full overflow-hidden select-none">
            
            {/* --- MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={TRAIN_BG_MOBILE} 
                    alt="Stazione Lone Boo Mobile" 
                    className={`w-full h-full object-fill object-center animate-in fade-in duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {bgLoaded && renderInteractives(false)}
            </div>

            {/* --- DESKTOP (ORIZZONTALE 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={TRAIN_BG_DESKTOP} 
                    alt="Stazione Lone Boo Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center animate-in fade-in duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                
                {bgLoaded && renderInteractives(true)}
            </div>

        </div>
    </div>
  );
};

export default SocialHub;
    