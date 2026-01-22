
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
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
                    className="font-luckiest text-white text-3xl md:text-7xl uppercase tracking-tighter leading-none text-left"
                    style={{ 
                        WebkitTextStroke: '2px black',
                        textShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                    }}
                >
                    Città <br className="md:hidden" /> Grigia
                </h2>
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
