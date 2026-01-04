import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflibretre.webp';
const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trnbibloihh.webp';

// Asset miniature per i giochi
const IMG_SCOPA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scopaminiatu.webp';
const IMG_UNO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/unominiaueea.webp';
const IMG_SOLITARIO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/solitaminiau.webp';

interface LibraryCardsViewProps {
    setView: (view: AppView) => void;
}

const LibraryCardsView: React.FC<LibraryCardsViewProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = BG_URL;
        img.onload = () => setIsLoaded(true);
        const timer = setTimeout(() => setIsLoaded(true), 2500);
        return () => clearTimeout(timer);
    }, []);

    const buttons = [
        { id: AppView.LIBRARY_SCOPA, img: IMG_SCOPA, alt: 'Scopa' },
        { id: AppView.LIBRARY_UNO, img: IMG_UNO, alt: 'Uno' },
        { id: AppView.LIBRARY_SOLITARIO, img: IMG_SOLITARIO, alt: 'Solitario' }
    ];

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#3e2723] overflow-hidden touch-none overscroll-none select-none">
            <style>{`
                @keyframes slide-down-hook {
                    0% { transform: translateY(-100%); }
                    60% { transform: translateY(0); }
                    80% { transform: translateY(-10px); }
                    100% { transform: translateY(0); }
                }
                .animate-slide-down-hook {
                    animation: slide-down-hook 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>

            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-amber-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Sto Caricando...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
                <img 
                    src={BG_URL} 
                    alt="Area Carte" 
                    className={`w-full h-full object-fill object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    draggable={false}
                />
            </div>

            {isLoaded && (
                <>
                    {/* TASTO INDIETRO - AGGANCIATO AL BORDO SUPERIORE (top-0) E SCIVOLA SOTTO HEADER (z-50 < z-100) */}
                    <div className="absolute top-0 left-4 md:left-8 z-50 animate-slide-down-hook">
                        <button 
                            onClick={() => setView(AppView.BOOKS)} 
                            className="hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                            <img 
                                src={BTN_BACK_IMG} 
                                alt="Torna alla Biblioteca" 
                                className="w-32 md:w-48 h-auto drop-shadow-2xl" 
                            />
                        </button>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 md:gap-12 px-4">
                        
                        {/* GRIGLIA MINIATURE - DIMENSIONI RIDOTTE E SENZA BORDI */}
                        <div className="flex flex-row justify-center items-center gap-6 md:gap-16 w-full max-w-5xl">
                            {buttons.map((btn) => (
                                <button
                                    key={btn.id}
                                    onClick={() => setView(btn.id)}
                                    className="relative transition-all hover:scale-110 active:scale-95 outline-none group flex-1 max-w-[140px] md:max-w-[240px]"
                                >
                                    <img 
                                        src={btn.img} 
                                        alt={btn.alt} 
                                        className="w-full h-auto drop-shadow-2xl" 
                                    />
                                </button>
                            ))}
                        </div>
                        
                        {/* SCRITTA IN STILE CARTOON GIALLA CON BORDO NERO */}
                        <div className="animate-in slide-in-from-bottom-4 duration-700">
                             <p 
                                className="text-yellow-400 font-luckiest text-3xl md:text-7xl uppercase tracking-widest"
                                style={{ 
                                    WebkitTextStroke: '2px black',
                                    textShadow: '4px 4px 0px black'
                                }}
                             >
                                SCEGLI UN GIOCO
                             </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LibraryCardsView;