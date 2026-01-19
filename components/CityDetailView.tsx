
import React, { useEffect } from 'react';
import { AppView } from '../types';
import { X, Construction, ArrowLeft } from 'lucide-react';

interface CityDetailViewProps {
    title: string;
    setView: (view: AppView) => void;
    bgColor?: string;
    bgImage?: string;
}

const CityDetailView: React.FC<CityDetailViewProps> = ({ title, setView, bgColor = "bg-white", bgImage }) => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden ${bgColor}`}>
            {/* BACKGROUND LAYER - Scivola sotto l'header */}
            {bgImage && (
                <img 
                    src={bgImage} 
                    alt={title} 
                    className="absolute inset-0 w-full h-full object-cover select-none"
                />
            )}
            
            {/* HEADER VISIBLE OVERLAY SPACING */}
            <div className="absolute top-[64px] md:top-[96px] inset-x-0 bottom-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-black/10 backdrop-blur-[2px]">
                <div className="bg-white/90 backdrop-blur-md p-8 md:p-12 rounded-[3rem] border-8 border-black/10 shadow-2xl animate-in zoom-in duration-500 max-w-2xl">
                    <div className="w-24 h-24 md:w-40 md:h-40 bg-blue-100 rounded-full flex items-center justify-center border-4 border-dashed border-blue-400 animate-pulse mb-8 mx-auto">
                        <Construction size={70} className="text-blue-600" />
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-cartoon text-blue-600 mb-4 uppercase tracking-tighter leading-none">{title}</h1>
                    <p className="text-xl md:text-3xl font-bold text-gray-500 mb-12">Questa magica città è ancora in costruzione! 🚧</p>
                    
                    <button 
                        onClick={() => setView(AppView.TRAIN_JOURNEY)} 
                        className="bg-blue-500 text-white font-black px-12 py-5 rounded-full border-4 border-black shadow-[6px_6px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-xl md:text-2xl flex items-center gap-3 uppercase"
                    >
                        <ArrowLeft strokeWidth={4} /> TORNA ALLA MAPPA
                    </button>
                </div>
            </div>

            {/* BOTTONE CHIUDI RAPIDO */}
            <button 
                onClick={() => setView(AppView.TRAIN_JOURNEY)}
                className="fixed top-24 md:top-32 right-4 z-50 bg-white w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all flex items-center justify-center text-black shadow-2xl"
            >
                <X size={32} strokeWidth={4} />
            </button>
        </div>
    );
};

export default CityDetailView;
