import React from 'react';
import { AppView } from '../types';

const BOOKS_LIST_BG = 'https://i.postimg.cc/Hxz5FTk4/lijuyhtg.jpg';

interface BooksListViewProps {
    setView: (view: AppView) => void;
}

const BooksListView: React.FC<BooksListViewProps> = ({ setView }) => {
    return (
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden">
            
            {/* BACKGROUND IMAGE - Full Screen Coverage */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                    src={BOOKS_LIST_BG} 
                    alt="Sfondo Libreria" 
                    className="w-full h-full object-cover object-center animate-fade-in"
                />
                {/* Overlay scurito leggero per leggibilità */}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* FLOATING CLOSE/BACK BUTTON - Custom Image (Increased size and lowered) */}
            <button 
                onClick={() => setView(AppView.BOOKS)} 
                className="absolute top-32 md:top-48 left-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                title="Torna alla Biblioteca"
            >
                <img 
                    src="https://i.postimg.cc/fLRS4WfC/tornbiblio-(1).png" 
                    alt="Torna alla Biblioteca" 
                    className="w-48 md:w-80 h-auto drop-shadow-2xl" 
                />
            </button>

            {/* CENTERED CARTOON TEXT */}
            <div className="relative z-10 p-8 text-center pointer-events-none flex flex-col items-center justify-center h-full max-w-2xl">
                <h2 
                    className="text-4xl md:text-7xl font-luckiest text-white uppercase tracking-tight drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] leading-tight animate-float"
                    style={{ 
                        WebkitTextStroke: '2px black',
                        textShadow: '6px 6px 0px black'
                    }}
                >
                    stiamo riempiendo <br/> gli scaffali
                </h2>
                
                {/* Optional decorative ghost emoji */}
                <div className="mt-8 text-6xl md:text-8xl animate-bounce">👻</div>
            </div>

        </div>
    );
};

export default BooksListView;