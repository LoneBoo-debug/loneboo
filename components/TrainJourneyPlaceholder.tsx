
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { X } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';

const MAP_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/train-journey-mobile.webp';
const MAP_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/train-journey-desktop.webp';

interface TrainJourneyPlaceholderProps {
    setView: (view: AppView) => void;
}

const TrainJourneyPlaceholder: React.FC<TrainJourneyPlaceholderProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const imgM = new Image(); imgM.src = MAP_BG_MOBILE;
        const imgD = new Image(); imgD.src = MAP_BG_DESKTOP;
        
        let count = 0;
        const check = () => {
            count++;
            if (count >= 1) setIsLoaded(true);
        };
        
        imgM.onload = check;
        imgD.onload = check;
        
        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-sky-900">
            
            {!isLoaded && (
                <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-sky-900 backdrop-blur-md">
                    <img 
                        src={OFFICIAL_LOGO} 
                        alt="Caricamento..." 
                        className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                    />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">
                        Pronti a partire...
                    </span>
                </div>
            )}

            {/* BACKGROUND IMAGES */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                    src={MAP_BG_MOBILE} 
                    alt="" 
                    className={`block md:hidden w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <img 
                    src={MAP_BG_DESKTOP} 
                    alt="" 
                    className={`hidden md:block w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>
            
            {/* BOTTONE CHIUDI */}
            <button 
                onClick={() => setView(AppView.SOCIALS)} 
                className="absolute top-24 md:top-32 right-4 z-50 bg-white w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-black shadow-2xl"
                title="Torna alla Stazione"
            >
                <X size={32} strokeWidth={4} />
            </button>

            {/* TESTO IN COSTRUZIONE */}
            <div className="relative z-10 p-8 text-center pointer-events-none flex flex-col items-center justify-center h-full">
                <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[3rem] border-8 border-yellow-400 shadow-2xl animate-in zoom-in duration-500">
                    <h2 
                        className="text-4xl md:text-8xl font-luckiest text-red-600 uppercase tracking-tighter leading-tight mb-4"
                        style={{ 
                            WebkitTextStroke: '2px black',
                            textShadow: '4px 4px 0px rgba(0,0,0,0.2)'
                        }}
                    >
                        BINARI IN <br/> COSTRUZIONE! 🚧
                    </h2>
                    <p className="text-lg md:text-3xl font-black text-sky-800 uppercase tracking-wide">
                        Lone Boo sta preparando <br/> un viaggio magico per te!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrainJourneyPlaceholder;
