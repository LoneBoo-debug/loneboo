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

const DJ_EFFECTS = [
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/explo.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/demdisco.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/campanello.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/doorbelldicscodd.jpg' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/papera+gommosa.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rubberdiscobell.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tromba+stadio.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stadiumhornsudsic.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/elastico.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rubberdisco55.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/blea.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tonguedicsco66.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/molla.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boingicsoc44.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boom+cartoon.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartoonexpldisco44.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ahia.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/hurtdiscodj33.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/campana.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gojingdisco55.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stromba.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/defetat+disco66.webp' },
    { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rutto.mp3', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/burpdisco77.webp' }
];

const DjConsole: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleSound = (base: DjBase) => {
        if (activeId === base.id) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            setActiveId(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(base.src);
        audio.loop = true;
        audio.volume = 0.25; 
        audio.play().catch(e => console.error("Errore riproduzione base:", e));
        audioRef.current = audio;
        setActiveId(base.id);
    };

    const playEffect = (src: string) => {
        const audio = new Audio(src);
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Errore effetto:", e));
    };

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
            {/* Alzato ulteriormente diminuendo i valori di top (da 10/14 a 6/10) */}
            <div className="absolute top-6 md:top-10 left-0 right-0 flex flex-col items-center p-4 z-40 gap-4 md:gap-6 overflow-y-auto max-h-[85vh] no-scrollbar">
                
                {/* BOX DELLE BASI */}
                <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/20 p-4 md:p-6 shadow-2xl animate-in slide-in-from-top duration-500 w-full max-w-6xl shrink-0">
                    <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-widest mb-4 opacity-70 text-center md:text-left">Seleziona Base</h3>
                    <div className="grid grid-cols-6 gap-1.5 md:gap-3 items-center justify-items-center">
                        {DJ_BASES.map((base) => (
                            <button
                                key={base.id}
                                onClick={() => toggleSound(base)}
                                className={`
                                    relative aspect-square w-full max-w-[160px] transition-all duration-300 outline-none
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

                {/* BOX DEGLI EFFETTI (12 TASTI) */}
                <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] border-2 border-white/20 p-4 md:p-6 shadow-2xl animate-in slide-in-from-top duration-700 w-full max-w-2xl shrink-0">
                    <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-widest mb-4 opacity-70 text-center md:text-left">Effetti Sonori</h3>
                    <div className="grid grid-cols-4 gap-3 md:gap-6 items-center justify-items-center">
                        {DJ_EFFECTS.map((effect, idx) => (
                            <button
                                key={idx}
                                onClick={() => playEffect(effect.src)}
                                className="w-full aspect-[3/4] flex items-center justify-center bg-yellow-400 border-b-4 border-yellow-600 rounded-xl md:rounded-2xl transition-all hover:scale-105 active:translate-y-1 active:border-b-0 shadow-lg group outline-none overflow-hidden"
                            >
                                {effect.img ? (
                                    <img src={effect.img} alt={`Effetto ${idx + 1}`} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-luckiest text-2xl md:text-4xl text-black drop-shadow-sm group-hover:scale-110 transition-transform">
                                        {idx + 1}
                                    </span>
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