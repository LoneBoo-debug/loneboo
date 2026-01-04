
import React from 'react';
import SoundLayout from './SoundLayout';
import { ANIMAL_SOUNDS } from '../../constants';

const ANIMAL_ORCHESTRA_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/orchestra-title.webp';
const ANIMAL_ORCHESTRA_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sforches.jpg';

const AnimalOrchestra: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const playSound = (src: string) => { const a = new Audio(src); a.play().catch(()=>{}); };
    
    return (
        <SoundLayout onBack={onBack} backgroundImage={ANIMAL_ORCHESTRA_BG} titleImage={ANIMAL_ORCHESTRA_TITLE_IMG}>
            {/* Grid impostata a 4 colonne fisse per creare 3 righe con i 12 animali */}
            <div className="grid grid-cols-4 gap-3 md:gap-8 w-full max-w-4xl px-4 py-8 mx-auto">
                {ANIMAL_SOUNDS.map((a) => (
                    <button 
                        key={a.id} 
                        onPointerDown={(e) => { e.preventDefault(); playSound(a.src); }} 
                        className="aspect-square flex items-center justify-center transform active:scale-95 transition-all group outline-none cursor-pointer p-2 md:p-4 bg-white/20 backdrop-blur-md rounded-2xl md:rounded-[2.5rem] border-2 border-white/30 shadow-xl hover:bg-white/30"
                    >
                         {/* Fixed: cast to any to allow access to optional 'img' property which is not explicitly defined in the inferred type from constants.ts */}
                         {(a as any).img ? (
                            <img 
                                src={(a as any).img} 
                                alt={a.label} 
                                className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform" 
                            />
                         ) : (
                            <span className="text-4xl md:text-8xl drop-shadow-xl group-hover:scale-110 transition-transform">
                                {a.emoji}
                            </span>
                         )}
                    </button>
                ))}
            </div>
        </SoundLayout>
    );
};

export default AnimalOrchestra;
