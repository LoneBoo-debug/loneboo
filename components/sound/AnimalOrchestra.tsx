import React from 'react';
import SoundLayout from './SoundLayout';
import { ANIMAL_SOUNDS } from '../../constants';

const ANIMAL_ORCHESTRA_TITLE_IMG = 'https://i.postimg.cc/8cgM6SSX/Intorche-(1).png';

const AnimalOrchestra: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const playSound = (src: string) => { const a = new Audio(src); a.play().catch(()=>{}); };
    const colors = ['bg-pink-400/80', 'bg-cyan-400/80', 'bg-yellow-400/80', 'bg-green-400/80', 'bg-orange-400/80', 'bg-purple-400/80', 'bg-rose-400/80', 'bg-indigo-400/80'];
    
    return (
        <SoundLayout onBack={onBack} isAnimalMode={true} titleImage={ANIMAL_ORCHESTRA_TITLE_IMG}>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl px-4">
                {ANIMAL_SOUNDS.map((a, idx) => (
                    <button key={a.id} onPointerDown={(e) => { e.preventDefault(); playSound(a.src); }} className={`aspect-square rounded-full border-4 border-white/50 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center transform active:scale-90 transition-all ${colors[idx % colors.length]}`}>
                        <span className="text-5xl md:text-7xl mb-1">{a.emoji}</span>
                        <span className="font-black text-white text-[10px] md:text-xs uppercase drop-shadow-[1px_1px_0_black]">{a.label}</span>
                        <div className="absolute top-4 left-8 w-4 h-10 bg-white/20 rounded-full blur-[1px] -rotate-45"></div>
                    </button>
                ))}
            </div>
        </SoundLayout>
    );
};

export default AnimalOrchestra;