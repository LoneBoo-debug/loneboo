
import React, { useState, useEffect, useRef } from 'react';
import SoundLayout from './SoundLayout';
import { CHARACTERS } from '../../services/databaseAmici';
import { Check, ChevronLeft, ChevronRight, Play, Square, Music } from 'lucide-react';

const CHOIR_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfoncorhus.webp';

const CONCERT_IMAGES: Record<string, string> = {
    'boo': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boocncer.webp',
    'pumpkin': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zucccncrt.webp',
    'gaia': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaiacncrt.webp',
    'andrea': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/andreacncrt.webp',
    'grufo': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grufocncrt.webp',
    'raffa': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/raffacncrt.webp',
    'batbeat': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/batcncrt.webp',
    'maragno': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/maragnocncrt.webp',
    'flora': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/floracncrt.webp',
    'marlo': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/marlocncrt.webp'
};

const CHOIR_SOUNDS: Record<string, { src: string }> = {
    'boo': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/spooky-cartoon-ghost-wooo-430234.mp3' },
    'pumpkin': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartoon-yay-140921.mp3' },
    'marlo': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartoon-hearts-overflow-36708.mp3' },
    'raffa': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/a-trombone-328860.mp3' },
    'gaia': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/three-random-tunesrr-girl-200030.mp3' },
    'grufo': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/owl-hooting-223549.mp3' },
    'andrea': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/happy-child-laughterhh-423432.mp3' },
    'batbeat': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cyber-punk-95771.mp3' },
    'flora': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magical-notification-tone-soft-fantasy-digital-alert-438278.mp3' },
    'maragno': { src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/080214_1920s-style-cartoon-motif-40399.mp3' }
};

const MUSIC_BASES = [
    { id: 'violin', label: 'Violino', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/violaddfret.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/violin-music-64019.mp3' },
    { id: 'bass', label: 'Contrabbasso', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/violinccrt.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/viola-starting-a-song-361765.mp3' },
    { id: 'piano', label: 'Piano', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pianoccrt.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/amazing-plan-183358.mp3' },
    { id: 'harp', label: 'Arpa', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/arpaccrtfd.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/magical-fantasy-celesta-410854.mp3' }
];

interface CharConfig {
    w: number;
    h: number;
    pb: number;
}

const INITIAL_CONFIGS: Record<string, CharConfig> = {
    'boo': { "w": 74, "h": 100, "pb": 76 },
    'pumpkin': { "w": 90, "h": 86, "pb": 66 },
    'batbeat': { "w": 99, "h": 100, "pb": 73 },
    'maragno': { "w": 78, "h": 73, "pb": 80 },
    'andrea': { "w": 110, "h": 97, "pb": 67 },
    'gaia': { "w": 120, "h": 120, "pb": 67 },
    'raffa': { "w": 135, "h": 148, "pb": 68 },
    'grufo': { "w": 103, "h": 93, "pb": 68 },
    'marlo': { "w": 110, "h": 88, "pb": 71 },
    'flora': { "w": 105, "h": 110, "pb": 73 }
};

const ChoirVoiceChanger: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [onStage, setOnStage] = useState<string[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedBase, setSelectedBase] = useState<string | null>(null);
    
    const audioElements = useRef<Record<string, HTMLAudioElement>>({});
    const baseAudioRef = useRef<HTMLAudioElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Effetto Coro Polifonico (Personaggi)
    useEffect(() => {
        if (isPlaying && onStage.length > 0) {
            onStage.forEach(id => {
                if (!audioElements.current[id]) {
                    const audio = new Audio(CHOIR_SOUNDS[id]?.src || CHOIR_SOUNDS['boo'].src);
                    audio.loop = true;
                    audio.volume = 0.4;
                    audio.play().catch(() => console.log("Interazione richiesta per audio " + id));
                    audioElements.current[id] = audio;
                } else {
                    audioElements.current[id].volume = 0.4;
                    if (audioElements.current[id].paused) audioElements.current[id].play().catch(() => {});
                }
            });

            Object.keys(audioElements.current).forEach(id => {
                if (!onStage.includes(id)) {
                    audioElements.current[id].pause();
                    audioElements.current[id].currentTime = 0;
                    delete audioElements.current[id];
                }
            });
        } else {
            Object.values(audioElements.current).forEach((audio: HTMLAudioElement) => {
                audio.pause();
                audio.currentTime = 0;
            });
            audioElements.current = {};
        }
    }, [isPlaying, onStage]);

    // Cleanup alla chiusura
    useEffect(() => {
        return () => {
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
                baseAudioRef.current = null;
            }
            // Explicitly type the iterator variable to fix the 'unknown' type error
            Object.values(audioElements.current).forEach((a: HTMLAudioElement) => a.pause());
        };
    }, []);

    const toggleBase = (base: typeof MUSIC_BASES[0]) => {
        if (selectedBase === base.id) {
            // Se è già selezionata, fermala
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
                baseAudioRef.current = null;
            }
            setSelectedBase(null);
        } else {
            // Se c'è un'altra base attiva, fermala
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
            }
            // Avvia la nuova base
            const audio = new Audio(base.src);
            audio.loop = true;
            audio.volume = 0.5;
            audio.play().catch(e => console.error("Errore audio base:", e));
            baseAudioRef.current = audio;
            setSelectedBase(base.id);
        }
    };

    const toggleCharacter = (id: string) => {
        if (isPlaying) return;
        if (onStage.includes(id)) {
            setOnStage(prev => prev.filter(item => item !== id));
        } else {
            if (onStage.length < 3) {
                setOnStage(prev => [...prev, id]);
            }
        }
    };

    const scrollLineup = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <SoundLayout onBack={onBack} backgroundImage={CHOIR_BG}>
            <div className="flex flex-col h-full w-full overflow-hidden relative">
                <style>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    @keyframes sway {
                        0%, 100% { transform: rotate(-3deg) translateX(-2px); }
                        50% { transform: rotate(3deg) translateX(2px); }
                    }
                    .animate-sway { animation: sway 1.5s ease-in-out infinite; }
                    @keyframes glow-select {
                        0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.6)); }
                        50% { filter: drop-shadow(0 0 15px rgba(255,255,255,0.9)); }
                    }
                    .animate-glow-select { animation: glow-select 1.5s infinite; }
                `}</style>

                {/* --- CONSOLE COMANDI (COLONNA A DESTRA) - RESTRUTTURATA --- */}
                <div className="fixed right-4 top-1/2 -translate-y-[80%] z-[60] flex flex-col gap-3 py-5 px-2 bg-black/30 backdrop-blur-xl border-4 border-white/10 rounded-[35px] shadow-2xl animate-in slide-in-from-right duration-700">
                    <div className="flex flex-col gap-4">
                        {MUSIC_BASES.map(base => (
                            <button
                                key={base.id}
                                onClick={() => toggleBase(base)}
                                className={`
                                    w-12 h-12 md:w-16 md:h-16 transition-all flex items-center justify-center outline-none
                                    ${selectedBase === base.id ? 'scale-125 animate-glow-select opacity-100' : 'opacity-60 hover:opacity-100 hover:scale-105'}
                                `}
                            >
                                <img 
                                    src={base.img} 
                                    alt={base.label} 
                                    className="w-full h-full object-contain drop-shadow-md" 
                                />
                            </button>
                        ))}
                    </div>

                    <div className="h-px w-full bg-white/20 mx-auto my-1"></div>

                    {/* IL TASTO PLAY CONTROLLA IL CORO (PERSONAGGI) */}
                    <button 
                        onClick={() => onStage.length > 0 && setIsPlaying(!isPlaying)}
                        disabled={onStage.length === 0}
                        className={`
                            w-12 h-12 md:w-16 md:h-16 rounded-full border-4 transition-all flex items-center justify-center shadow-xl
                            ${onStage.length === 0 ? 'opacity-30 grayscale cursor-not-allowed' : 'active:scale-95'}
                            ${isPlaying ? 'bg-red-500 border-white' : 'bg-green-500 border-white animate-pulse'}
                        `}
                    >
                        {isPlaying ? <Square size={24} fill="white" strokeWidth={0} /> : <Play size={28} fill="white" strokeWidth={0} className="ml-1" />}
                    </button>
                </div>
                
                {/* --- AREA PALCO (FLESSIBILE) --- */}
                <div className="flex-1 w-full flex items-center justify-center relative min-h-0">
                    <div className="absolute bottom-10 w-[70%] h-40 bg-gradient-to-t from-purple-900/50 to-transparent rounded-[100%] blur-3xl opacity-40"></div>
                    
                    <div className={`flex items-end justify-center gap-0 h-full w-full max-w-2xl px-4 z-10 pb-28 transition-transform duration-500 ${onStage.length === 3 ? '-translate-x-8 md:-translate-x-16' : ''}`}>
                        {onStage.map((id, index) => {
                            const char = CHARACTERS.find(c => c.id === id);
                            if (!char) return null;
                            const charImg = CONCERT_IMAGES[id] || char.image;
                            const config = INITIAL_CONFIGS[id];
                            
                            const isThreeMembers = onStage.length === 3;
                            const internalSpacing = isThreeMembers 
                                ? (index === 1 ? '-ml-2 md:-ml-4' : index === 2 ? '-ml-4 md:-ml-8' : '')
                                : '';

                            return (
                                <div 
                                    key={id} 
                                    onClick={() => toggleCharacter(id)}
                                    className={`relative flex flex-col items-center animate-in zoom-in duration-500 transition-all ${!isPlaying ? 'cursor-pointer hover:scale-105' : ''} ${internalSpacing}`}
                                    style={{ 
                                        paddingBottom: `${config.pb}px`,
                                        width: '100px'
                                    }}
                                >
                                    {!isPlaying && (
                                        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 bg-red-500 text-white font-black text-[7px] md:text-[8px] px-2 py-0.5 rounded-full shadow-lg z-20 border-2 border-white">
                                            TOGLI
                                        </div>
                                    )}
                                    <img 
                                        src={charImg} 
                                        alt={char.name} 
                                        className={`object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] ${isPlaying ? 'animate-sway' : 'brightness-75'}`} 
                                        style={{ 
                                            width: `${config.w * 1.0}px`,
                                            height: `${config.h * 1.0}px`
                                        }}
                                    />
                                    {isPlaying && (
                                        <div className="absolute bottom-12 w-16 h-2 bg-white/20 rounded-full blur-md animate-pulse"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- LINEUP PERSONAGGI (SOLLEVATA E COMPATTA) --- */}
                <div className="w-full shrink-0 flex justify-center pb-6 px-4">
                    <div className="w-full max-w-5xl bg-black/40 backdrop-blur-xl p-2 md:p-3 rounded-[35px] border-4 border-white/10 z-40 relative shadow-[0_-15px_30px_rgba(0,0,0,0.4)] max-h-[160px] md:max-h-[180px]">
                        <button 
                            onClick={() => scrollLineup('left')}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-md transition-all active:scale-90 border border-white/10 shadow-lg"
                        >
                            <ChevronLeft size={20} strokeWidth={4} />
                        </button>
                        
                        <button 
                            onClick={() => scrollLineup('right')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/30 p-2 rounded-full text-white backdrop-blur-md transition-all active:scale-90 border border-white/10 shadow-lg"
                        >
                            <ChevronRight size={20} strokeWidth={4} />
                        </button>

                        <div 
                            ref={scrollContainerRef}
                            className="w-full flex items-center justify-start gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-1 touch-pan-x snap-x scroll-smooth px-10 md:px-20"
                        >
                            {CHARACTERS.map(char => {
                                const active = onStage.includes(char.id);
                                const charImg = CONCERT_IMAGES[char.id] || char.image;
                                const isFull = onStage.length >= 3 && !active;

                                return (
                                    <button
                                        key={char.id}
                                        onClick={() => toggleCharacter(char.id)}
                                        disabled={isPlaying || isFull}
                                        className={`
                                            flex flex-col items-center shrink-0 transition-all duration-300 snap-center outline-none p-0.5
                                            ${active ? 'scale-90' : 'hover:scale-105 active:scale-95'}
                                            ${isFull || isPlaying ? 'opacity-20 grayscale' : 'opacity-100'}
                                        `}
                                    >
                                        <div className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center relative mb-0.5">
                                            <img 
                                                src={charImg} 
                                                alt={char.name} 
                                                className={`w-full h-full object-contain pointer-events-none drop-shadow-lg transition-all ${active ? 'brightness-125 scale-110' : ''}`} 
                                            />
                                            {active && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Check className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]" size={24} strokeWidth={5} />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-white font-black text-[7px] md:text-[10px] uppercase tracking-tighter truncate w-12 md:w-20 text-center drop-shadow-md">
                                            {char.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </SoundLayout>
    );
};

export default ChoirVoiceChanger;
