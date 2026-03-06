
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import CityExplorationModal from './CityExplorationModal';

const CITY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rbcitybgroudn44.webp';
const CITY_NIGHT_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cityarcobalenonight.webp';

const EXPLORATION_ITEMS = [
    { image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rainbow_city_explore_1.webp', text: 'Vivi i colori infiniti della Città degli Arcobaleni!' },
    { image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rainbow_city_explore_2.webp', text: 'Cammina sulle nuvole colorate e scopri la magia ad ogni angolo.' }
];

interface Point { x: number; y: number }

type AreaId = 'SCUOLA_MEDIA' | 'ZOO_FANTASTICO' | 'ARTE_DISEGNO' | 'ALIMENTARI' | 'BURGER';

interface AreaConfig {
    id: AreaId;
    name: string;
    view: AppView;
    points: Point[];
}

const DEFAULT_AREAS: Record<AreaId, AreaConfig> = {
    SCUOLA_MEDIA: { 
        id: 'SCUOLA_MEDIA', 
        name: 'Scuola Media', 
        view: AppView.RAINBOW_CITY_SCUOLA_MEDIA, 
        points: [
            { "x": 2.13, "y": 58.02 },
            { "x": 1.6, "y": 72.86 },
            { "x": 13.87, "y": 77.36 },
            { "x": 45.6, "y": 68.07 },
            { "x": 45.33, "y": 53.07 },
            { "x": 27.73, "y": 45.13 }
        ] 
    },
    ZOO_FANTASTICO: { 
        id: 'ZOO_FANTASTICO', 
        name: 'Zoo Fantastico', 
        view: AppView.RAINBOW_CITY_ZOO, 
        points: [
            { "x": 65.07, "y": 69.87 },
            { "x": 36.53, "y": 85.46 },
            { "x": 83.47, "y": 99.1 },
            { "x": 98.67, "y": 77.51 },
            { "x": 97.33, "y": 92.65 },
            { "x": 82.4, "y": 73.76 },
            { "x": 92.53, "y": 76.01 }
        ] 
    },
    ARTE_DISEGNO: { 
        id: 'ARTE_DISEGNO', 
        name: 'Arte e Disegno', 
        view: AppView.RAINBOW_CITY_ARTE, 
        points: [
            { "x": 62.4, "y": 30.88 },
            { "x": 61.6, "y": 40.18 },
            { "x": 85.07, "y": 43.78 },
            { "x": 93.6, "y": 41.53 },
            { "x": 94.93, "y": 32.53 },
            { "x": 90.13, "y": 26.54 },
            { "x": 77.6, "y": 25.19 },
            { "x": 66.93, "y": 26.99 }
        ] 
    },
    ALIMENTARI: { 
        id: 'ALIMENTARI', 
        name: 'Alimentari Arcobaleno', 
        view: AppView.RAINBOW_CITY_ALIMENTARI, 
        points: [
            { "x": 1.87, "y": 30.58 },
            { "x": 2.13, "y": 37.93 },
            { "x": 13.07, "y": 41.53 },
            { "x": 42.93, "y": 35.68 },
            { "x": 42.93, "y": 27.89 },
            { "x": 17.07, "y": 21.59 }
        ] 
    },
    BURGER: { 
        id: 'BURGER', 
        name: 'Burger', 
        view: AppView.RAINBOW_CITY_BURGER, 
        points: [
            { "x": 64.53, "y": 56.97 },
            { "x": 64.53, "y": 64.92 },
            { "x": 86.93, "y": 70.46 },
            { "x": 98.67, "y": 66.27 },
            { "x": 99.2, "y": 57.42 },
            { "x": 77.87, "y": 53.37 }
        ] 
    }
};

interface RainbowCityProps {
    setView: (view: AppView) => void;
}

const RainbowCity: React.FC<RainbowCityProps> = ({ setView }) => {
    const [isExplorationOpen, setIsExplorationOpen] = useState(false);
    const [isNight, setIsNight] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);

        const checkTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTimeInMinutes = hours * 60 + minutes;

            const nightStart = 20 * 60 + 15; // 20:15
            const nightEnd = 6 * 60 + 30;   // 06:30

            // Se l'orario è dopo le 20:15 o prima delle 06:30 è notte
            if (currentTimeInMinutes >= nightStart || currentTimeInMinutes < nightEnd) {
                setIsNight(true);
            } else {
                setIsNight(false);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000); // Controlla ogni minuto
        
        const handleToggleExploration = () => {
            setIsExplorationOpen(prev => !prev);
        };
        window.addEventListener('toggleCityExploration', handleToggleExploration);

        return () => {
            window.removeEventListener('toggleCityExploration', handleToggleExploration);
            clearInterval(interval);
        };
    }, []);

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleAreaClick = (area: AreaConfig) => {
        if (area.points.length < 3) return;
        setView(area.view);
    };

    return (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-sky-300">
            {/* Background Layer */}
            <img 
                src={isNight ? CITY_NIGHT_BG : CITY_BG} 
                alt="Città degli Arcobaleni" 
                className="absolute inset-0 w-full h-full object-fill select-none animate-in fade-in duration-1000"
            />

            {/* CLICKABLE AREAS */}
            {Object.values(DEFAULT_AREAS).map(area => (
                area.points.length >= 3 && (
                    <div 
                        key={area.id}
                        onClick={(e) => { e.stopPropagation(); handleAreaClick(area); }}
                        className="absolute inset-0 z-10 cursor-pointer transition-colors hover:bg-white/10"
                        style={{ clipPath: getClipPath(area.points) }}
                    />
                )
            ))}

            {/* TITOLO CITTÀ IN BASSO A SINISTRA */}
            <div className="absolute bottom-8 left-8 z-10 pointer-events-none animate-in fade-in slide-in-from-left duration-1000">
                <h2 
                    className="font-luckiest text-red-500 text-3xl md:text-7xl uppercase tracking-tighter leading-none text-left"
                    style={{ 
                        WebkitTextStroke: '2px black',
                        textShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                    }}
                >
                    Città degli <br className="md:hidden" /> Arcobaleni
                </h2>
            </div>
            
            <CityExplorationModal 
                isOpen={isExplorationOpen} 
                onClose={() => setIsExplorationOpen(false)} 
                title="CITTÀ DEGLI ARCOBALENI"
                items={EXPLORATION_ITEMS}
            />
        </div>
    );
};

export default RainbowCity;
