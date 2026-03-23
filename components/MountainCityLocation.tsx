
import React, { useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { ArrowLeft } from 'lucide-react';

interface MountainCityLocationProps {
    title: string;
    setView: (view: AppView) => void;
    bgImage?: string;
    minimal?: boolean;
}

const MountainCityLocation: React.FC<MountainCityLocationProps> = ({ title, setView, bgImage, minimal }) => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-emerald-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {bgImage && (
                <img 
                    src={bgImage} 
                    alt={title} 
                    className={`absolute inset-0 w-full h-full object-cover select-none ${minimal ? 'opacity-100' : 'opacity-60'}`}
                    referrerPolicy="no-referrer"
                />
            )}
            
            {minimal ? (
                <>
                    <div className="relative z-10 animate-in fade-in zoom-in duration-1000">
                        <h1 
                            className="font-luckiest text-white text-5xl md:text-8xl uppercase tracking-widest drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                            style={{ WebkitTextStroke: '2px rgba(0,0,0,0.3)' }}
                        >
                            SEZIONE IN ALLESTIMENTO
                        </h1>
                    </div>
                    
                    {/* Floating Back Button for minimal view */}
                    <button 
                        onClick={() => setView(AppView.MOUNTAIN_CITY)}
                        className="fixed top-6 left-6 z-50 hover:scale-110 active:scale-95 transition-all drop-shadow-2xl"
                    >
                        <img 
                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/uytornacitygfrd66.webp" 
                            alt="Indietro" 
                            className="w-16 md:w-24 h-auto rounded-2xl"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                </>
            ) : (
                <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-xl border-4 border-emerald-600 rounded-[3rem] p-8 flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in duration-500">
                    <img src={OFFICIAL_LOGO} alt="Boo" className="w-32 h-32 animate-bounce select-none" referrerPolicy="no-referrer" />
                    <h1 className="font-luckiest text-emerald-600 text-4xl uppercase tracking-widest leading-tight">{title}</h1>
                    <p className="text-emerald-800 font-medium text-lg italic">
                        Questa area della Città delle Montagne è in fase di allestimento... torna presto per esplorarla!
                    </p>
                    <button 
                        onClick={() => setView(AppView.MOUNTAIN_CITY)}
                        className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] transition-all active:translate-y-1 active:shadow-none flex items-center gap-2 uppercase tracking-widest"
                    >
                        <ArrowLeft strokeWidth={4} /> Torna in Città
                    </button>
                </div>
            )}
        </div>
    );
};

export default MountainCityLocation;
