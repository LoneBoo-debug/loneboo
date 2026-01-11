
import React, { useState, useRef, useEffect } from 'react';
import SoundLayout from './SoundLayout';
import { Music, Music2 } from 'lucide-react';

const BONGO_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bongobtr443.webp';
const BONGO_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bfgr5543+(1).webp';
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/marimbamagic-9922.mp3';
const BONGO_SAMPLE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartoon-bonk-sfx-424181.mp3';

interface BongoConfig {
    id: string;
    size: string;
    rate: number; // Fattore di velocità (1.0 = normale, 2.0 = acuto, 0.5 = grave)
}

const BONGOS: BongoConfig[] = [
    { id: 'b1', size: 'w-14 h-14 md:w-20 md:h-20', rate: 1.8 }, // Più piccolo -> Più acuto
    { id: 'b2', size: 'w-16 h-16 md:w-24 md:h-24', rate: 1.5 },
    { id: 'b3', size: 'w-20 h-20 md:w-28 md:h-28', rate: 1.3 },
    { id: 'b4', size: 'w-24 h-24 md:w-32 md:h-32', rate: 1.1 },
    { id: 'b5', size: 'w-28 h-28 md:w-36 md:h-36', rate: 0.9 },
    { id: 'b6', size: 'w-32 h-32 md:w-40 md:h-40', rate: 0.75 },
    { id: 'b7', size: 'w-36 h-36 md:w-48 md:h-48', rate: 0.6 },
    { id: 'b8', size: 'w-44 h-44 md:w-60 md:h-60', rate: 0.45 }, // Più grande -> Più grave
];

const BongoInstrument: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const sampleBufferRef = useRef<AudioBuffer | null>(null);
    
    const [hitId, setHitId] = useState<string | null>(null);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [isLoadingSample, setIsLoadingSample] = useState(true);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        return audioCtxRef.current;
    };

    // Pre-caricamento del campione audio
    useEffect(() => {
        const loadSample = async () => {
            try {
                const response = await fetch(BONGO_SAMPLE_URL);
                const arrayBuffer = await response.arrayBuffer();
                const ctx = initAudio();
                const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
                sampleBufferRef.current = decodedBuffer;
                setIsLoadingSample(false);
            } catch (e) {
                console.error("Errore caricamento campione bongo:", e);
            }
        };
        loadSample();
    }, []);

    const toggleMusic = () => {
        if (!bgMusicRef.current) {
            bgMusicRef.current = new Audio(BG_MUSIC_URL);
            bgMusicRef.current.loop = true;
        }

        // Abbassiamo il volume della base musicale
        bgMusicRef.current.volume = 0.25;

        if (isMusicPlaying) {
            bgMusicRef.current.pause();
        } else {
            bgMusicRef.current.play().catch(e => console.log("Music blocked", e));
        }
        setIsMusicPlaying(!isMusicPlaying);
    };

    const playBongo = (config: BongoConfig) => {
        if (!sampleBufferRef.current) return;
        
        const ctx = initAudio();
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = sampleBufferRef.current;
        
        // Modulazione Pitch tramite velocità
        source.playbackRate.value = config.rate;
        
        // Alziamo il volume dei bonghi per farli risaltare sopra la base
        gainNode.gain.setValueAtTime(1.5, ctx.currentTime);
        
        source.connect(gainNode).connect(ctx.destination);
        source.start(0);

        setHitId(config.id);
        setTimeout(() => setHitId(null), 100);
    };

    useEffect(() => {
        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
        };
    }, []);

    return (
        <SoundLayout onBack={onBack} backgroundImage={BONGO_BG}>
            {/* Tasto Musica in alto a destra */}
            <div className="fixed top-20 md:top-28 right-4 z-50">
                <button 
                    onClick={toggleMusic}
                    className={`p-4 rounded-full border-4 border-white shadow-2xl transition-all active:scale-90 ${isMusicPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}
                >
                    {isMusicPlaying ? <Music2 size={28} className="text-white" /> : <Music size={28} className="text-white/50" />}
                </button>
            </div>

            <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto no-scrollbar p-4 pb-24 md:pb-32">
                {isLoadingSample && (
                    <div className="mt-20 bg-black/40 px-6 py-2 rounded-full border border-white/20 animate-pulse">
                        <span className="text-white font-bold text-sm uppercase tracking-widest">Accordatura bongo...</span>
                    </div>
                )}

                <div className={`flex flex-wrap justify-center items-center gap-3 md:gap-8 max-w-7xl mt-16 md:mt-32 transition-opacity duration-500 ${isLoadingSample ? 'opacity-30' : 'opacity-100'}`}>
                    {BONGOS.map((b) => (
                        <div key={b.id} className="flex flex-col items-center">
                            <button
                                onPointerDown={(e) => { e.preventDefault(); playBongo(b); }}
                                disabled={isLoadingSample}
                                className={`
                                    relative ${b.size} transition-all duration-75 outline-none
                                    ${hitId === b.id ? 'scale-90 brightness-125' : 'hover:scale-105 active:scale-95'}
                                    ${isLoadingSample ? 'cursor-wait' : 'cursor-pointer'}
                                `}
                                style={{ touchAction: 'none' }}
                            >
                                <img 
                                    src={BONGO_IMG} 
                                    alt="Bongo" 
                                    className="w-full h-full object-contain" 
                                    style={{ 
                                        filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.4))'
                                    }}
                                />
                                {hitId === b.id && (
                                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-30"></div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 md:mt-20 shrink-0">
                    <p className="font-luckiest text-white text-xl md:text-5xl uppercase text-center drop-shadow-lg" style={{ WebkitTextStroke: '1.5px black' }}>
                        Tocca i bongo per suonare! 🥁
                    </p>
                    <p className="text-white/60 font-bold text-center mt-2 text-xs md:text-lg uppercase tracking-widest">
                        Ogni bongo ha il suo suono magico
                    </p>
                </div>
            </div>
        </SoundLayout>
    );
};

export default BongoInstrument;
