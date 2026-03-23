
import React, { useEffect, useState, useMemo } from 'react';
import { AppView } from '../types';
import CityExplorationModal from './CityExplorationModal';
import { isNightTime } from '../services/weatherService';

const CITY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lakebgroundcuty543.webp';
const CITY_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/citylaghinight.webp';

const EXPLORATION_ITEMS = [
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/acquyariumsofodneo.webp', 
        text: 'Benvenuti nel maestoso Acquario di Città dei Laghi, dove potrai incontrare pesci magici e creature acquatiche straordinarie!' 
    },
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lgopescscita7uhd5ts.webp', 
        text: 'Il faro della città illumina le acque del lago ogni notte, guidando i pescatori e creando riflessi incantevoli.' 
    },
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/molocittaloagheuj6650ijx.webp', 
        text: "Passeggia lungo il molo principale, respira l'aria fresca e goditi la vista mozzafiata sulle montagne circostanti." 
    },
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_in+questa+immagine+rendi+la+va_490680446169284616.webp', 
        text: "Esplora il Museo dell'Acqua, un luogo dove la storia e la natura dei nostri laghi si fondono in un'esperienza unica." 
    }
];

const INTRO_TEXT = "Benvenuti a Città dei Laghi, una perla incastonata tra acque cristalline e una natura rigogliosa tutta da scoprire.";

const CLICKABLE_AREAS = [
    {
        id: 'Acquario',
        view: AppView.LAKE_CITY_ACQUARIO,
        points: [
            { x: 0.27, y: 34.78 },
            { x: 0.8, y: 55.02 },
            { x: 35.73, y: 55.32 },
            { x: 37.33, y: 32.08 }
        ]
    },
    {
        id: 'Museo Acquatico',
        view: AppView.LAKE_CITY_MUSEO,
        points: [
            { x: 53.87, y: 37.18 },
            { x: 56, y: 60.27 },
            { x: 96.8, y: 61.47 },
            { x: 95.73, y: 33.28 }
        ]
    },
    {
        id: 'Lago di Pesca',
        view: AppView.LAKE_CITY_LAGO,
        points: [
            { x: 0.53, y: 59.97 },
            { x: 0.8, y: 80.81 },
            { x: 33.33, y: 78.41 },
            { x: 34.67, y: 57.12 }
        ]
    },
    {
        id: 'Molo',
        view: AppView.LAKE_CITY_MOLO,
        points: [
            { x: 34.13, y: 81.11 },
            { x: 34.4, y: 96.4 },
            { x: 88.8, y: 96.55 },
            { x: 88.8, y: 77.21 }
        ]
    }
];

interface LakeCityProps {
    setView: (view: AppView) => void;
}

const LakeCity: React.FC<LakeCityProps> = ({ setView }) => {
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

    return (
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-blue-400">
            {/* Background Layer */}
            <img 
                src={currentBg} 
                alt="Città dei Laghi" 
                className="absolute inset-0 w-full h-full object-fill select-none animate-in fade-in duration-1000"
            />

            {/* Clickable Areas Overlay */}
            <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {CLICKABLE_AREAS.map((area) => (
                    <polygon
                        key={area.id}
                        points={area.points.map(p => `${p.x},${p.y}`).join(' ')}
                        className="fill-transparent hover:fill-white/10 cursor-pointer pointer-events-auto transition-colors"
                        onClick={() => setView(area.view)}
                    >
                        <title>{area.id}</title>
                    </polygon>
                ))}
            </svg>

            {/* TITOLO CITTÀ IN ALTO A SINISTRA */}
            <div className="absolute top-14 left-6 z-10 pointer-events-none animate-in fade-in slide-in-from-left duration-1000">
                <h2 
                    className="font-luckiest text-sky-300 text-3xl md:text-7xl uppercase tracking-tighter leading-none text-left"
                    style={{ 
                        WebkitTextStroke: '2px black',
                        textShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                    }}
                >
                    Città <br className="md:hidden" /> dei Laghi
                </h2>
            </div>
            
            <CityExplorationModal 
                isOpen={isExplorationOpen} 
                onClose={() => setIsExplorationOpen(false)} 
                title="CITTÀ DEI LAGHI"
                headerDescription={INTRO_TEXT}
                items={EXPLORATION_ITEMS}
            />
        </div>
    );
};

export default LakeCity;
