
import React, { useState, useRef, useEffect } from 'react';
import SoundLayout from './SoundLayout';

const DJ_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/djconsobgdser.webp';

interface DjBase {
    id: number;
    img: string;
    src: string;
}

const DJ_BASES: DjBase[] = [
    { id: 1, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base1+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/high-end-hustle-fashion-luxury-disco-253184.mp3' },
    { id: 2, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base2+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/disco-fever-retro-disco-energetic-and-nostalgic-70s-vibe-rain-459307.mp3' },
    { id: 3, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base3+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/disco-90-121343.mp3' },
    { id: 4, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base4+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/italodisco-radio-jingle-our-soyuz-flies-cover-455775.mp3' },
    { id: 5, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base5+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dj-one-olistik-sound-project-patrizio-yoga-176595.mp3' },
    { id: 6, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/base6+(1).webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/oz-dance-olistik-sound-project-patrizio-yoga-116429.mp3' }
];

const DjConsole: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleSound = (base: DjBase) => {
        // Se lo stesso suono è attivo, lo fermiamo
        if (activeId === base.id) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setActiveId(null);
            return;
        }

        // Se c'è un altro suono attivo, fermiamolo prima
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Avviamo il nuovo suono con volume ridotto (0.25)
        const audio = new Audio(base.src);
        audio.loop = true;
        audio.volume = 0.25; // Volume ridotto ulteriormente del 15% circa rispetto a 0.3
        audio.play().catch(e => console.error("Errore riproduzione base:", e));
        audioRef.current = audio;
        setActiveId(base.id);
    };

    // Pulizia alla chiusura
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <SoundLayout onBack={onBack} backgroundImage={DJ_BG}>
            {/* BOX TRASLUCIDO PER I TASTI - SPOSTATO PIÙ IN ALTO (top-24 / top-32) */}
            <div className="absolute top-24 md:top-32 left-0 right-0 flex justify-center p-4 z-40">
                <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/20 p-4 md:p-6 shadow-2xl animate-in slide-in-from-top duration-500 w-full max-w-5xl">
                    <div className="grid grid-cols-6 gap-2 md:gap-6 items-center justify-items-center">
                        {DJ_BASES.map((base) => (
                            <button
                                key={base.id}
                                onClick={() => toggleSound(base)}
                                className={`
                                    relative aspect-square w-full max-w-[120px] transition-all duration-300 outline-none
                                    ${activeId === base.id ? 'scale-110 brightness-125' : 'hover:scale-105 active:scale-95 opacity-70 hover:opacity-100'}
                                `}
                            >
                                <img 
                                    src={base.img} 
                                    alt={`Base ${base.id}`} 
                                    className={`w-full h-full object-contain drop-shadow-xl ${activeId === base.id ? 'animate-pulse' : ''}`} 
                                />
                                
                                {activeId === base.id && (
                                    <div className="absolute -top-1 -right-1 bg-green-500 w-4 h-4 md:w-6 md:h-6 rounded-full border-2 border-white shadow-lg animate-bounce flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </SoundLayout>
    );
};

export default DjConsole;
