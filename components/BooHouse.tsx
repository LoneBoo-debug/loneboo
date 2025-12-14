
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { Loader2 } from 'lucide-react';
import RobotHint from './RobotHint';

const BOO_HOUSE_MOBILE = 'https://i.postimg.cc/9F308yt9/houseplanss-(1).png';
const BOO_HOUSE_DESKTOP = 'https://i.postimg.cc/7YLR63CN/hpuse169.jpg';

type Point = { x: number; y: number };
type HouseZone = {
    id: AppView;
    label: string;
    points: Point[];
};

// ZONE MOBILE (DEFINITIVE)
const ZONES_MOBILE: HouseZone[] = [
  { "id": AppView.BOO_GARDEN, "label": "Giardino SX", "points": [ { "x": 6.13, "y": 78.43 }, { "x": 6.13, "y": 88.48 }, { "x": 32.78, "y": 88.12 }, { "x": 32.52, "y": 77.35 } ] },
  { "id": AppView.BOO_GARDEN, "label": "Giardino DX", "points": [ { "x": 66.9, "y": 78.25 }, { "x": 67.16, "y": 87.94 }, { "x": 97.81, "y": 87.58 }, { "x": 97.81, "y": 78.25 } ] },
  { "id": AppView.BOO_BEDROOM, "label": "Camera", "points": [ { "x": 9.86, "y": 45.41 }, { "x": 9.86, "y": 68.56 }, { "x": 36.51, "y": 68.74 }, { "x": 36.78, "y": 44.87 } ] },
  { "id": AppView.BOO_LIVING_ROOM, "label": "Salotto", "points": [ { "x": 46.11, "y": 13.64 }, { "x": 48.77, "y": 45.76 }, { "x": 90.09, "y": 44.87 }, { "x": 88.49, "y": 16.15 } ] },
  { "id": AppView.BOO_BATHROOM, "label": "Bagno", "points": [ { "x": 65.03, "y": 51.69 }, { "x": 64.5, "y": 68.74 }, { "x": 86.35, "y": 69.1 }, { "x": 88.22, "y": 51.51 } ] },
  { "id": AppView.BOO_KITCHEN, "label": "Cucina", "points": [ { "x": 9.59, "y": 14.9 }, { "x": 8.53, "y": 38.94 }, { "x": 36.51, "y": 39.12 }, { "x": 37.58, "y": 15.61 } ] }
];

// ZONE DESKTOP (DEFINITIVE)
const ZONES_DESKTOP: HouseZone[] = [
  {
    "id": AppView.BOO_KITCHEN,
    "label": "Cucina",
    "points": [
      { "x": 26.96, "y": 13.73 },
      { "x": 26.76, "y": 41.85 },
      { "x": 44.11, "y": 42.53 },
      { "x": 44.51, "y": 13.73 }
    ]
  },
  {
    "id": AppView.BOO_LIVING_ROOM,
    "label": "Salotto",
    "points": [
      { "x": 49.72, "y": 16.43 },
      { "x": 49.72, "y": 47.48 },
      { "x": 72.47, "y": 47.93 },
      { "x": 72.77, "y": 14.63 }
    ]
  },
  {
    "id": AppView.BOO_BEDROOM,
    "label": "Camera",
    "points": [
      { "x": 26.96, "y": 46.8 },
      { "x": 27.27, "y": 72.46 },
      { "x": 43.7, "y": 72.23 },
      { "x": 43.7, "y": 46.35 }
    ]
  },
  {
    "id": AppView.BOO_BATHROOM,
    "label": "Bagno",
    "points": [
      { "x": 57.34, "y": 53.11 },
      { "x": 57.34, "y": 72.46 },
      { "x": 72.07, "y": 72.46 },
      { "x": 72.57, "y": 52.66 }
    ]
  },
  {
    "id": AppView.BOO_GARDEN,
    "label": "Giardino",
    "points": [
      { "x": 58.44, "y": 78.53 },
      { "x": 58.74, "y": 92.26 },
      { "x": 97.43, "y": 92.03 },
      { "x": 97.73, "y": 24.53 },
      { "x": 76.88, "y": 22.28 },
      { "x": 75.28, "y": 75.61 }
    ]
  }
];

interface BooHouseProps {
    setView: (view: AppView) => void;
    lastView?: AppView | null;
}

const BooHouse: React.FC<BooHouseProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showHint, setShowHint] = useState(false);
    
    useEffect(() => {
        const imgMobile = new Image();
        imgMobile.src = BOO_HOUSE_MOBILE;
        const imgDesktop = new Image();
        imgDesktop.src = BOO_HOUSE_DESKTOP;

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

        // Logic: Only show hint if user hasn't visited a room yet in this session
        const hasVisitedRoom = sessionStorage.getItem('boo_house_visited');
        let timer: ReturnType<typeof setTimeout>;

        if (!hasVisitedRoom) {
            timer = setTimeout(() => {
                setShowHint(true);
            }, 1000); 
        }

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleInteraction = () => {
        if (showHint) setShowHint(false); 
    };

    // Simple Navigation
    const handleNavigation = (target: AppView) => {
        sessionStorage.setItem('boo_house_visited', 'true');
        setView(target);
    };

    const getClipPath = (points: Point[]) => {
        if (!points || points.length < 3) return 'none';
        const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
        return `polygon(${poly})`;
    };

    const renderZones = (isDesktop: boolean) => {
        const activeZones = isDesktop ? ZONES_DESKTOP : ZONES_MOBILE;

        return activeZones.map((zone, index) => {
            if (!zone.points || zone.points.length < 3) return null;

            return (
                <div
                    key={`${isDesktop ? 'desk' : 'mob'}-${zone.id}-${index}`}
                    onClick={(e) => { e.stopPropagation(); handleNavigation(zone.id); }}
                    className="absolute inset-0 cursor-pointer group"
                    style={{ clipPath: getClipPath(zone.points) }}
                    title={`Vai a: ${zone.label}`}
                ></div>
            );
        });
    };

    return (
        <div 
            className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col"
            onClick={handleInteraction}
        >
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-orange-200 z-50">
                    <span className="text-white font-black text-2xl animate-pulse drop-shadow-md flex items-center gap-2">
                        <Loader2 className="animate-spin" /> Benvenuti a Casa Boo...
                    </span>
                </div>
            )}

            {/* ROBOT HINT */}
            <RobotHint 
                show={showHint} 
                message="Tocca una stanza per entrare!"
                variant="GHOST"
            />

            {/* --- MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative overflow-hidden">
                <div className="w-full h-full relative">
                    <img 
                        src={BOO_HOUSE_MOBILE} 
                        alt="Casa di Lone Boo Mobile" 
                        className={`w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        draggable={false}
                    />
                    {isLoaded && renderZones(false)}
                </div>
            </div>

            {/* --- DESKTOP (ORIZZONTALE 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <div className="w-full h-full relative">
                    <img 
                        src={BOO_HOUSE_DESKTOP} 
                        alt="Casa di Lone Boo Desktop" 
                        className={`absolute inset-0 w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        draggable={false}
                    />
                    {isLoaded && renderZones(true)}
                </div>
            </div>

        </div>
    );
};

export default BooHouse;
