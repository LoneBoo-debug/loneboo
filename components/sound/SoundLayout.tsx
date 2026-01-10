
import React from 'react';
import { AppView } from '../../types';

const BTN_BACK_DISCO_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-disco.webp';
const ANIMAL_ORCHESTRA_BG = 'https://i.postimg.cc/P5XJ9qyR/sfondorch.jpg';

interface SoundLayoutProps {
    onBack: () => void;
    children: React.ReactNode;
    isAnimalMode?: boolean;
    backgroundImage?: string;
    titleImage?: string;
    titleText?: string;
}

const SoundLayout: React.FC<SoundLayoutProps> = ({ onBack, children, isAnimalMode = false, backgroundImage, titleImage, titleText }) => {
    const finalBg = backgroundImage || (isAnimalMode ? ANIMAL_ORCHESTRA_BG : null);

    return (
        <div className={`fixed inset-0 animate-in fade-in z-0 landscape:z-[150] ${!finalBg ? 'bg-gray-900/95 backdrop-blur-sm' : 'bg-black'}`}>
            {finalBg && (
                <img src={finalBg} className="absolute inset-0 w-full h-full object-cover z-0 opacity-80" alt="" />
            )}
            
            {/* Pulsante Indietro - Nascosto in landscape per non interferire con la console immersiva */}
            <div className="fixed top-20 md:top-28 left-4 z-50 landscape:hidden">
                <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform outline-none drop-shadow-xl">
                    <img src={BTN_BACK_DISCO_IMG} alt="Indietro" className="h-16 md:h-24 w-auto" />
                </button>
            </div>

            <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
                {/* Header Titolo - Sollevato riducendo il pt (precedentemente 56/72) */}
                <div className="w-full flex flex-col items-center pt-36 md:pt-48 px-4 shrink-0 pointer-events-none landscape:hidden">
                    {titleImage && (
                        <img src={titleImage} alt={titleText || "Strumento"} className="w-64 md:w-[500px] h-auto mb-2 md:mb-4 drop-shadow-lg animate-in zoom-in shrink-0" />
                    )}
                    {titleText && !titleImage && (
                        <h2 className="text-center text-3xl md:text-5xl font-black text-pink-500 mb-4 drop-shadow-md uppercase tracking-tight shrink-0" style={{ WebkitTextStroke: '2px black' }}>
                            {titleText}
                        </h2>
                    )}
                </div>

                {/* Area Contenuto Strumento */}
                <div className="flex-1 w-full relative overflow-visible">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SoundLayout;
