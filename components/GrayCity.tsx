
import React, { useEffect, useState, useMemo } from 'react';
import { AppView } from '../types';
import CityExplorationModal from './CityExplorationModal';
import { isNightTime } from '../services/weatherService';

const CITY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rayciturybfgsh3isn2.webp';
const CITY_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/citygrigianight.webp';

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

const INTRO_TEXT = "Queste le sezioni principali di Città Grigia, induciamo motori e Gokart per competere al campionato nazionale.";

// MODIFICA TEMPORANEA: Imposta a true per attivare lo stato "In Costruzione"
const IS_UNDER_CONSTRUCTION = true;

const CLICKABLE_AREAS = {
  "Negozio di ricambi": {
    points: "78.93,30.88 65.33,42.73 90.67,48.88 98.13,36.13",
    itemIndex: 2
  },
  "Officina auto": {
    points: "17.6,38.83 15.47,47.83 39.2,53.37 61.6,44.98 31.2,33.73",
    itemIndex: 1
  },
  "Scuola di progettazione": {
    points: "72.53,54.57 59.2,59.22 55.73,67.02 86.67,75.41 99.2,70.61 97.33,61.92",
    itemIndex: 0
  },
  "Pista macchine": {
    points: "67.47,76.16 36.8,87.86 71.2,99.1 97.07,84.26",
    itemIndex: 3
  }
};

interface GrayCityProps {
    setView: (view: AppView) => void;
}

const GrayCity: React.FC<GrayCityProps> = ({ setView }) => {
    const [isExplorationOpen, setIsExplorationOpen] = useState(false);
    const [modalItems, setModalItems] = useState(EXPLORATION_ITEMS);
    const [now, setNow] = useState(new Date());

    const currentBg = useMemo(() => {
        return isNightTime(now) ? CITY_BG_NIGHT : CITY_BG;
    }, [now]);

    const handleAreaClick = (itemIndex: number) => {
        if (itemIndex === 0) {
            setView(AppView.GRAY_CITY_SCUOLA_PROGETTAZIONE);
            return;
        }
        if (itemIndex === 1) {
            setView(AppView.GRAY_CITY_OFFICINA);
            return;
        }
        if (itemIndex === 2) {
            setView(AppView.GRAY_CITY_NEGOZIO_RICAMBI);
            return;
        }
        if (itemIndex === 3) {
            setView(AppView.GRAY_CITY_PISTA_GOKART);
            return;
        }
        setModalItems([EXPLORATION_ITEMS[itemIndex]]);
        setIsExplorationOpen(true);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const timer = setInterval(() => setNow(new Date()), 60000);
        
        const handleToggleExploration = () => {
            setModalItems(EXPLORATION_ITEMS);
            setIsExplorationOpen(prev => !prev);
        };
        window.addEventListener('toggleCityExploration', handleToggleExploration);
        return () => {
            window.removeEventListener('toggleCityExploration', handleToggleExploration);
            clearInterval(timer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-slate-300">
            {/* Background Layer */}
            <img 
                src={currentBg} 
                alt="Città Grigia" 
                className="absolute inset-0 w-full h-full object-fill select-none animate-in fade-in duration-1000"
            />

            {/* CLICKABLE AREAS OVERLAY */}
            {!IS_UNDER_CONSTRUCTION && (
                <svg 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none" 
                    className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                >
                    {Object.entries(CLICKABLE_AREAS).map(([name, area]) => (
                        <polygon
                            key={name}
                            points={area.points}
                            className="pointer-events-auto fill-transparent hover:fill-yellow-400/20 cursor-pointer transition-colors duration-300"
                            onClick={() => handleAreaClick(area.itemIndex)}
                        >
                            <title>{name}</title>
                        </polygon>
                    ))}
                </svg>
            )}

            {/* MESSAGGIO CITTÀ IN COSTRUZIONE */}
            {IS_UNDER_CONSTRUCTION && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md border-4 border-yellow-400 px-8 py-6 rounded-[2rem] shadow-2xl animate-in zoom-in duration-500">
                        <h3 
                            className="font-luckiest text-white text-3xl md:text-5xl uppercase tracking-widest text-center"
                            style={{ textShadow: '2px 2px 0px black' }}
                        >
                            Città in <br className="md:hidden" /> costruzione
                        </h3>
                    </div>
                </div>
            )}

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
                headerDescription={modalItems.length > 1 ? INTRO_TEXT : undefined}
                items={modalItems}
            />
        </div>
    );
};

export default GrayCity;
