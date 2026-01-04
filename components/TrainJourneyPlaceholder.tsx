
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
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-sky-900">
            
            {!isLoaded && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-sky-900/95 backdrop-blur-md">
                    <img 
                        src={OFFICIAL_LOGO} 
                        alt="Caricamento..." 
                        className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                    />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">
                        Sto Caricando...
                    </span>
                </div>
            )}

            {/* BACKGROUND IMAGES - FIXED AND COVERING FULL VIEWPORT */}
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
                {/* Overlay scurito leggero per far risaltare il testo bianco */}
                <div className="absolute inset-0 bg-black/5"></div>
            </div>
            
            {/* FLOATING CLOSE BUTTON (TOP RIGHT) */}
            <button 
                onClick={() => setView(AppView.SOCIALS)} 
                className="absolute top-20 md:top-28 right-4 z-50 bg-white w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-black shadow-2xl"
                title="Torna alla Stazione"
            >
                <X size={28} strokeWidth={4} />
            </button>

            {/* CENTERED CARTOON TEXT - NOW FIXED WITHOUT BOUNCE */}
            <div className="relative z-10 p-8 text-center pointer-events-none flex flex-col items-center justify-center h-full">
                <div className="transform transition-transform duration-500">
                    <h2 
                        className="text-5xl md:text-8xl font-luckiest text-white uppercase tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-tight"
                        style={{ 
                            WebkitTextStroke: '2px black',
                            textShadow: '8px 8px 0px black'
                        }}
                    >
                        BINARI IN <br/> COSTRUZIONE! 🚧
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default TrainJourneyPlaceholder;
