
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { AppView } from '../types';
import CityExplorationModal from './CityExplorationModal';
import { isNightTime } from '../services/weatherService';
import { Copy, Trash2, Move, Crosshair } from 'lucide-react';

const CITY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mountaincufjr5tbgroudn66.webp';
const CITY_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/citymontagnenight.webp';

const AREAS = [
    "Osservatorio Astronomico",
    "Centro Meteo",
    "Laboratorio delle Acque",
    "Scavi Archeologici"
];

const EXPLORATION_ITEMS = [
    { image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mountain_city_explore_1.webp', text: 'Respira l\'aria fresca delle cime più alte!' },
    { image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mountain_city_explore_2.webp', text: 'Gli alberi qui nascondono segreti millenari.' }
];

interface MountainCityProps {
    setView: (view: AppView) => void;
}

const MountainCity: React.FC<MountainCityProps> = ({ setView }) => {
    const [isExplorationOpen, setIsExplorationOpen] = useState(false);
    const [now, setNow] = useState(new Date());
    
    const currentBg = useMemo(() => {
        return isNightTime(now) ? CITY_BG_NIGHT : CITY_BG;
    }, [now]);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const timer = setInterval(() => setNow(new Date()), 60000);
        
        const handleToggleExploration = () => {
            setIsExplorationOpen(prev => !prev);
        };
        window.addEventListener('toggleCityExploration', handleToggleExploration);
        return () => {
            window.removeEventListener('toggleCityExploration', handleToggleExploration);
            clearInterval(timer);
        };
    }, []);

    const CLICKABLE_AREAS = [
        {
            id: 'osservatorio',
            name: 'Osservatorio Astronomico',
            points: '21.07,11.39 8.8,29.69 50.93,30.28 35.73,10.94',
            view: AppView.MOUNTAIN_CITY_OSSERVATORIO
        },
        {
            id: 'meteo',
            name: 'Centro Meteo',
            points: '78.93,24.89 61.87,36.13 79.47,44.38 95.73,36.28',
            view: AppView.MOUNTAIN_CITY_CENTRO_METEO
        },
        {
            id: 'acque',
            name: 'Laboratorio delle Acque',
            points: '21.87,38.68 6.67,52.47 49.33,54.12 39.47,39.28',
            view: AppView.MOUNTAIN_CITY_LABORATORIO_ACQUE
        },
        {
            id: 'scavi',
            name: 'Scavi Archeologici',
            points: '78.13,71.96 54.13,81.86 77.33,94.45 98.4,83.36',
            view: AppView.MOUNTAIN_CITY_SCAVI_ARCHEOLOGICI
        }
    ];

    return (
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-emerald-500">
            {/* Background Layer */}
            <img 
                src={currentBg} 
                alt="Città delle Montagne" 
                className="absolute inset-0 w-full h-full object-fill select-none animate-in fade-in duration-1000"
            />

            {/* Clickable Areas Overlay */}
            <svg 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none" 
                className="absolute inset-0 w-full h-full z-10"
            >
                {CLICKABLE_AREAS.map(area => (
                    <polygon
                        key={area.id}
                        points={area.points}
                        className="fill-transparent hover:fill-white/20 cursor-pointer transition-colors duration-300"
                        onClick={() => setView(area.view)}
                    >
                        <title>{area.name}</title>
                    </polygon>
                ))}
            </svg>

            {/* TITOLO CITTÀ IN BASSO A SINISTRA */}
            <div className="absolute bottom-8 left-8 z-10 pointer-events-none animate-in fade-in slide-in-from-left duration-1000">
                <h2 
                    className="font-luckiest text-green-500 text-3xl md:text-7xl uppercase tracking-tighter leading-none text-left"
                    style={{ 
                        WebkitTextStroke: '2px black',
                        textShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                    }}
                >
                    Città delle <br className="md:hidden" /> Montagne
                </h2>
            </div>
            
            <CityExplorationModal 
                isOpen={isExplorationOpen} 
                onClose={() => setIsExplorationOpen(false)} 
                title="CITTÀ DELLE MONTAGNE"
                items={EXPLORATION_ITEMS}
            />
        </div>
    );
};

export default MountainCity;
