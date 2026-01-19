
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { Construction } from 'lucide-react';
import CityExplorationModal from './CityExplorationModal';

const CITY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cittagrigiasfondbg443.webp';

const EXPLORATION_ITEMS = [
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pogettazionecittagrigiade322.webp', 
        text: 'Questa è la scuola di progettazione, è qui che progettiamo i nostri veicoli sulla carta disegnandoli e facendo gli aggiustamenti prima di cominciare a costruirli.' 
    },
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/officinacittagrigia44e.webp', 
        text: "Nell'officina cominciamo l'assemblaggio dei nostri mezzi con degli esperti costruttori in campo meccanico." 
    },
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/negozioricambicitagrigia3e3.webp', 
        text: 'Questo è il negozio dove vi riforniamo di tutto quello che ci serve per completare i nostri capolavori.' 
    },
    { 
        image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pistagokartcittagrigia4dde.webp', 
        text: 'Questa è la nostra pista dove testiamo i prototipi costruiti per capire se funzionano a dovere o hanno bisogno di revisioni.' 
    }
];

const INTRO_TEXT = "Queste le sezioni principali di Città Grigia, dove costruiamo motori e Gokart per competere al campionato nazionale.";

interface GrayCityProps {
    setView: (view: AppView) => void;
}

const GrayCity: React.FC<GrayCityProps> = ({ setView }) => {
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
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-slate-300">
            {/* Background Layer */}
            <img 
                src={CITY_BG} 
                alt="Città Grigia" 
                className="absolute inset-0 w-full h-full object-fill select-none animate-in fade-in duration-1000"
            />

            {/* Banner Costruzione Centrale */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-6 pt-32">
                <div className="bg-white/80 backdrop-blur-md p-6 md:p-10 rounded-[3rem] border-8 border-yellow-400 shadow-2xl flex flex-col items-center text-center max-w-sm pointer-events-auto animate-in zoom-in duration-500">
                    <div className="w-20 h-20 md:w-32 md:h-32 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-dashed border-yellow-400 animate-pulse mb-4 shadow-inner">
                        <Construction size={50} className="text-yellow-600" />
                    </div>
                    <h3 className="text-2xl md:text-4xl font-black text-blue-900 uppercase mb-2 leading-tight font-luckiest" style={{ WebkitTextStroke: '1px black' }}>Città in Costruzione</h3>
                    <p className="text-gray-600 font-bold text-sm md:text-lg leading-snug">
                        Stiamo scaldando i motori! <br/> Torna presto a trovarci. 👻
                    </p>
                </div>
            </div>
            
            <CityExplorationModal 
                isOpen={isExplorationOpen} 
                onClose={() => setIsExplorationOpen(false)} 
                title="CITTÀ GRIGIA"
                headerDescription={INTRO_TEXT}
                items={EXPLORATION_ITEMS}
            />
        </div>
    );
};

export default GrayCity;
