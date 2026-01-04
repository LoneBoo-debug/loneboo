import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { Construction } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflibretre.webp';
const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

interface LibraryGamePlaceholderProps {
    title: string;
    setView: (view: AppView) => void;
}

const LibraryGamePlaceholder: React.FC<LibraryGamePlaceholderProps> = ({ title, setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = BG_URL;
        img.onload = () => setIsLoaded(true);
        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#3e2723] overflow-hidden touch-none overscroll-none select-none">
            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-amber-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Sto Caricando...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                <img 
                    src={BG_URL} 
                    alt="Sfondo Gioco" 
                    className={`w-full h-full object-fill object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false}
                />
            </div>

            {isLoaded && (
                <>
                    <div className="absolute top-24 md:top-32 right-4 z-50 animate-in slide-in-from-right-4 duration-500">
                        <button onClick={() => setView(AppView.LIBRARY_CARDS)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_BACK_IMG} alt="Chiudi" className="w-16 h-16 md:w-24 md:h-24 drop-shadow-2xl" />
                        </button>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center p-4">
                         <div className="bg-white/90 backdrop-blur-md p-10 md:p-16 rounded-[4rem] border-8 border-amber-600 shadow-2xl flex flex-col items-center text-center max-w-2xl animate-in zoom-in duration-500">
                             <div className="w-32 h-32 md:w-48 md:h-48 bg-amber-100 rounded-full flex items-center justify-center border-4 border-dashed border-amber-400 animate-pulse mb-8">
                                 <Construction size={70} className="text-amber-600" />
                             </div>
                             
                             <h2 className="text-4xl md:text-7xl font-black text-amber-900 uppercase tracking-tighter leading-none mb-4">{title}</h2>
                             
                             <p className="text-xl md:text-3xl font-bold text-amber-700 leading-tight">
                                Stiamo preparando le carte! <br/>
                                <span className="text-boo-purple font-black">Torna a trovarci presto!</span> 👻
                             </p>

                             <button 
                                onClick={() => setView(AppView.LIBRARY_CARDS)}
                                className="mt-12 bg-amber-600 text-white font-black px-12 py-4 rounded-full border-b-8 border-amber-800 hover:scale-105 active:translate-y-2 active:border-b-0 transition-all text-xl md:text-3xl uppercase tracking-widest"
                             >
                                INDIETRO
                             </button>
                         </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LibraryGamePlaceholder;