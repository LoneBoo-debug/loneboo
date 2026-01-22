
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import CityExplorationModal from './CityExplorationModal';

const CITY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cittaarcobanleodn55fe32.webp';

const EXPLORATION_ITEMS = [
    { image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rainbow_city_explore_1.webp', text: 'Vivi i colori infiniti della Città degli Arcobaleni!' },
    { image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rainbow_city_explore_2.webp', text: 'Cammina sulle nuvole colorate e scopri la magia ad ogni angolo.' }
];

interface RainbowCityProps {
    setView: (view: AppView) => void;
}

const RainbowCity: React.FC<RainbowCityProps> = ({ setView }) => {
    const [isExplorationOpen, setIsExplorationOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const handleToggleExploration = () => {
            setIsExplorationOpen(prev => !prev);
        };
        window.addEventListener('toggleCityExploration', handleToggleExploration);
        return () => window.removeEventListener('toggleCityExploration', handleToggleExploration);
    }, []);

    return (
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-sky-300">
            {/* Background Layer */}
            <img 
                src={CITY_BG} 
                alt="Città degli Arcobaleni" 
                className="absolute inset-0 w-full h-full object-fill select-none animate-in fade-in duration-1000"
            />

            {/* SCRITTA CENTRALE IN PREPARAZIONE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <h3 
                    className="font-luckiest text-white text-5xl md:text-9xl uppercase tracking-tighter text-center leading-none"
                    style={{ 
                        WebkitTextStroke: '2px black',
                        textShadow: '6px 6px 0px rgba(0,0,0,0.3)'
                    }}
                >
                    Città in <br className="md:hidden" /> preparazione
                </h3>
            </div>

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
