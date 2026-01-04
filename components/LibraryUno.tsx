import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { CARDS_DATABASE } from '../services/cardsDatabase';

const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const TABLE_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflibretre.webp';

interface LibraryUnoProps {
    setView: (view: AppView) => void;
}

const LibraryUno: React.FC<LibraryUnoProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = TABLE_BG;
        img.onload = () => setIsLoaded(true);
    }, []);

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#0f172a] overflow-hidden touch-none overscroll-none select-none">
            <div className="absolute inset-0 z-0 opacity-30">
                <img src={TABLE_BG} alt="" className="w-full h-full object-fill" />
            </div>

            {/* TASTO CHIUDI */}
            <div className="absolute top-24 md:top-32 right-4 z-50">
                <button onClick={() => setView(AppView.LIBRARY_CARDS)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_BACK_IMG} alt="Esci" className="w-16 h-16 md:w-24 h-auto drop-shadow-2xl" />
                </button>
            </div>

            {/* AREA DI GIOCO UNO SKELETON */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                
                <div className="relative flex items-center justify-center gap-12">
                    {/* MAZZO COPERTO */}
                    <div className="w-24 h-36 md:w-36 md:h-52 bg-red-600 rounded-xl border-4 border-white shadow-2xl flex items-center justify-center transform -rotate-6">
                        <span className="text-white font-black text-3xl md:text-5xl">UNO</span>
                    </div>

                    {/* CARTA ATTUALE SCARTATA */}
                    <div className="w-24 h-36 md:w-36 md:h-52 bg-white/10 border-4 border-dashed border-white/30 rounded-xl flex items-center justify-center transform rotate-3">
                         <span className="text-white/20 font-black text-2xl uppercase">Scarto</span>
                    </div>
                </div>

                <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4">
                    <div className="bg-red-600 px-10 py-3 rounded-full border-4 border-white shadow-xl animate-pulse">
                        <span className="text-white font-black text-xl md:text-3xl uppercase tracking-tighter">Preparando le carte UNO!</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryUno;
