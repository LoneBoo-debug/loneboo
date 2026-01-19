
import React, { useState, useRef, useEffect } from 'react';
import SoundLayout from './SoundLayout';
import { ANIMAL_SOUNDS } from '../../constants';
import { Music } from 'lucide-react';

const ANIMAL_ORCHESTRA_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sforches.jpg';

const ANIMAL_BASES = [
    { id: 'base1', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base1+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/a-little-quirky-167769.mp3' },
    { id: 'base2', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base2+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/christmas-music-21048.mp3' },
    { id: 'base3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base3+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/amused-glances-hip-hop-dramedy-390990.mp3' },
    { id: 'base4', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base4+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quirky-edm-with-toy-sounds-silly-vocal-chops-371341.mp3' }
];

const AnimalOrchestra: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeBaseId, setActiveBaseId] = useState<string | null>(null);
    const baseAudioRef = useRef<HTMLAudioElement | null>(null);

    const playAnimalSound = (src: string) => { 
        const a = new Audio(src); 
        a.volume = 0.8;
        a.play().catch(() => {}); 
    };

    const toggleBase = (base: typeof ANIMAL_BASES[0]) => {
        if (activeBaseId === base.id) {
            // Se clicco la stessa, ferma tutto
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
                baseAudioRef.current = null;
            }
            setActiveBaseId(null);
        } else {
            // Se clicco una diversa, ferma la precedente e avvia la nuova
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
            }
            const audio = new Audio(base.src);
            audio.loop = true;
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Interazione richiesta per musica", e));
            baseAudioRef.current = audio;
            setActiveBaseId(base.id);
        }
    };

    // Cleanup alla chiusura della sezione
    useEffect(() => {
        return () => {
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
                baseAudioRef.current = null;
            }
        };
    }, []);
    
    return (
        <SoundLayout onBack={onBack} backgroundImage={ANIMAL_ORCHESTRA_BG}>
            {/* Contenitore principale senza scroll (overflow-hidden) e con layout flessibile */}
            <div className="w-full h-full max-w-4xl px-4 pt-20 md:pt-32 pb-6 mx-auto flex flex-col gap-4 md:gap-8 overflow-hidden">
                
                {/* GRID ANIMALI - Fissa */}
                <div className="grid grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                    {ANIMAL_SOUNDS.map((a) => (
                        <button 
                            key={a.id} 
                            onPointerDown={(e) => { e.preventDefault(); playAnimalSound(a.src); }} 
                            className="aspect-square flex items-center justify-center transform active:scale-90 transition-all group outline-none cursor-pointer p-2 md:p-4 bg-white/20 backdrop-blur-md rounded-2xl md:rounded-[2.5rem] border-2 border-white/30 shadow-xl hover:bg-white/30"
                        >
                             {(a as any).img ? (
                                <img 
                                    src={(a as any).img} 
                                    alt={a.label} 
                                    className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform" 
                                />
                             ) : (
                                <span className="text-4xl md:text-7xl lg:text-8xl drop-shadow-xl group-hover:scale-110 transition-transform">
                                    {a.emoji}
                                </span>
                             )}
                        </button>
                    ))}
                </div>

                {/* SEPARATORE BASI - Fisso */}
                <div className="flex items-center gap-4 py-1 md:py-2 opacity-80 shrink-0">
                    <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-white/30 rounded-full"></div>
                    <div className="flex items-center gap-2 px-4 py-1 bg-black/40 rounded-full border border-white/20">
                        <Music size={16} className="text-yellow-400" />
                        <span className="text-white font-black text-[10px] md:text-xs uppercase tracking-widest">Basi Musicali</span>
                    </div>
                    <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-white/30 rounded-full"></div>
                </div>

                {/* GRID BASI MUSICALI - Fissa */}
                <div className="grid grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                    {ANIMAL_BASES.map((base) => {
                        const isActive = activeBaseId === base.id;
                        return (
                            <button
                                key={base.id}
                                onClick={() => toggleBase(base)}
                                className={`
                                    relative aspect-square flex items-center justify-center rounded-2xl md:rounded-[2.5rem] border-4 transition-all duration-300 outline-none
                                    ${isActive 
                                        ? 'bg-yellow-400 border-white scale-110 shadow-[0_0_30px_rgba(253,224,71,0.6)] z-10' 
                                        : 'bg-white/10 border-white/10 hover:bg-white/20 hover:border-white/30'}
                                `}
                            >
                                <img 
                                    src={base.img} 
                                    alt={base.id} 
                                    className={`w-[85%] h-[85%] object-contain drop-shadow-xl transition-all ${isActive ? 'animate-pulse' : 'opacity-70 group-hover:opacity-100'}`} 
                                />
                                
                                {isActive && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-lg animate-bounce">
                                        <Music size={14} fill="currentColor" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </SoundLayout>
    );
};

export default AnimalOrchestra;
