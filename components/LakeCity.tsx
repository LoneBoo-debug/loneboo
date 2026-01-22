
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import CityExplorationModal from './CityExplorationModal';

const CITY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/leghicitybgder55tgf.webp';

const EXPLORATION_ITEMS = [
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/acquariocitalaghi5533.webp', 
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
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/museocaqauanrt55fwsw11a.webp', 
        text: "Esplora il Museo dell'Acqua, un luogo dove la storia e la natura dei nostri laghi si fondono in un'esperienza unica." 
    }
];

const INTRO_TEXT = "Benvenuti a Città dei Laghi, una perla incastonata tra acque cristalline e una natura rigogliosa tutta da scoprire.";

interface LakeCityProps {
    setView: (view: AppView) => void;
}

const LakeCity: React.FC<LakeCityProps> = ({ setView }) => {
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
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-blue-400">
            {/* Background Layer */}
            <img 
                src={CITY_BG} 
                alt="Città dei Laghi" 
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

            {/* TITOLO CITTÀ IN BASSO A DESTRA */}
            <div className="absolute bottom-8 right-8 z-10 pointer-events-none animate-in fade-in slide-in-from-right duration-1000">
                <h2 
                    className="font-luckiest text-sky-300 text-3xl md:text-7xl uppercase tracking-tighter leading-none text-right"
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
