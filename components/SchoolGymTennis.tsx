
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const TENNIS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tennisgymschoo543.webp';
const BTN_EXIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/polkiuj88+(1)+(1).webp';

interface SchoolGymTennisProps {
    setView: (view: AppView) => void;
}

const SchoolGymTennis: React.FC<SchoolGymTennisProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = TENNIS_BG;
        img.onload = () => setIsLoaded(true);
        const timer = setTimeout(() => setIsLoaded(true), 2500);
        window.scrollTo(0, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#ea580c] overflow-hidden touch-none overscroll-none select-none flex flex-col">
            
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-orange-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Preparo il campo...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                <img 
                    src={TENNIS_BG} 
                    alt="Area Tennis" 
                    className={`w-full h-full object-fill object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false}
                />
            </div>

            {isLoaded && (
                <>
                    {/* TASTO CHIUDI - IN ALTO A SINISTRA SOTTO L'HEADER */}
                    <div className="absolute top-[75px] md:top-[110px] left-[4%] z-50 animate-in slide-in-from-top duration-500">
                        <button 
                            onClick={() => setView(AppView.SCHOOL_GYM)} 
                            className="hover:scale-110 active:scale-95 transition-all outline-none w-[24vw] md:w-[12vw] max-w-[200px]"
                        >
                            <img 
                                src={BTN_EXIT_IMG} 
                                alt="Torna in Palestra" 
                                className="w-full h-auto drop-shadow-2xl" 
                            />
                        </button>
                    </div>

                    {/* CONTENUTO placeholder per il gioco */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-[20vh] pointer-events-none">
                         <div className="animate-in slide-in-from-bottom-10 duration-700">
                             <p 
                                className="text-yellow-300 font-luckiest text-3xl md:text-7xl uppercase tracking-widest text-center"
                                style={{ 
                                    WebkitTextStroke: '2px black',
                                    textShadow: '4px 4px 0px black'
                                }}
                             >
                                CAMPO DA TENNIS <br/> IN ARRIVO! 🎾
                             </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SchoolGymTennis;
