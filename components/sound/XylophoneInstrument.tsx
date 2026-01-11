
import React, { useState, useRef, useEffect } from 'react';
import SoundLayout from './SoundLayout';

const XYLOPHONE_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ilobtg554.webp';
const SAMPLE_DO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/xylophone-c3-87468.mp3';

interface XyloNote {
    id: string;
    rate: number; // Fattore di modulazione
    img: string;
    label: string;
    width: number; // Percentuale di larghezza
}

// Scala Ottava Bassa (C3 - B3)
const LOW_SCALE: XyloNote[] = [
    { id: 'l_c3', rate: 1.0, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/doxile44.webp', label: 'DO', width: 90 },
    { id: 'l_d3', rate: 1.122, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rexil342.webp', label: 'RE', width: 84 },
    { id: 'l_e3', rate: 1.260, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mixil431+(1).webp', label: 'MI', width: 78 },
    { id: 'l_f3', rate: 1.335, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/faxil443+(1).webp', label: 'FA', width: 72 },
    { id: 'l_g3', rate: 1.498, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/solxil876+(1).webp', label: 'SOL', width: 66 },
    { id: 'l_a3', rate: 1.682, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/laxil990+(1).webp', label: 'LA', width: 60 },
    { id: 'l_b3', rate: 1.888, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sixil876+(1).webp', label: 'SI', width: 54 },
];

// Scala Ottava Alta (C4 - B4)
const HIGH_SCALE: XyloNote[] = [
    { id: 'h_c4', rate: 2.0, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/doxile44.webp', label: 'DO', width: 90 },
    { id: 'h_d4', rate: 2.244, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rexil342.webp', label: 'RE', width: 84 },
    { id: 'h_e4', rate: 2.520, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mixil431+(1).webp', label: 'MI', width: 78 },
    { id: 'h_f4', rate: 2.670, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/faxil443+(1).webp', label: 'FA', width: 72 },
    { id: 'h_g4', rate: 2.996, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/solxil876+(1).webp', label: 'SOL', width: 66 },
    { id: 'h_a4', rate: 3.364, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/laxil990+(1).webp', label: 'LA', width: 60 },
    { id: 'h_b4', rate: 3.776, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sixil876+(1).webp', label: 'SI', width: 54 },
];

const XylophoneInstrument: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sampleBufferRef = useRef<AudioBuffer | null>(null);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        return audioCtxRef.current;
    };

    useEffect(() => {
        const loadSample = async () => {
            try {
                const response = await fetch(SAMPLE_DO_URL);
                const arrayBuffer = await response.arrayBuffer();
                const ctx = initAudio();
                const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
                sampleBufferRef.current = decodedBuffer;
                setIsLoading(false);
            } catch (e) {
                console.error("Errore caricamento xilofono:", e);
            }
        };
        loadSample();
    }, []);

    const playNote = (note: XyloNote) => {
        if (!sampleBufferRef.current || isLoading) return;
        
        const ctx = initAudio();
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = sampleBufferRef.current;
        source.playbackRate.value = note.rate;
        
        gainNode.gain.setValueAtTime(0.7, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        
        source.connect(gainNode).connect(ctx.destination);
        source.start(0);

        setActiveNoteId(note.id);
        setTimeout(() => setActiveNoteId(null), 150);
    };

    const renderScale = (scale: XyloNote[]) => (
        <div className="relative flex-1 h-full flex flex-col-reverse items-center justify-between py-2">
            {/* Supporti verticali della scala */}
            <div className="absolute left-[22%] top-0 bottom-0 w-2 md:w-4 bg-amber-950/30 rounded-full blur-[1px]"></div>
            <div className="absolute right-[22%] top-0 bottom-0 w-2 md:w-4 bg-amber-950/30 rounded-full blur-[1px]"></div>

            {scale.map((note) => (
                <button
                    key={note.id}
                    onPointerDown={(e) => { e.preventDefault(); playNote(note); }}
                    className={`
                        relative h-[12%] transition-all duration-75 outline-none flex items-center justify-center
                        ${activeNoteId === note.id ? 'scale-95 brightness-125' : 'hover:scale-[1.02] active:scale-95'}
                    `}
                    style={{ 
                        width: `${note.width}%`, 
                        touchAction: 'none' 
                    }}
                >
                    <img 
                        src={note.img} 
                        alt={note.label} 
                        className="w-full h-full object-fill"
                        style={{
                            filter: activeNoteId === note.id 
                                ? 'drop-shadow(0 0 20px rgba(255, 255, 255, 1)) drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))' 
                                : 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.6))'
                        }}
                    />
                </button>
            ))}
        </div>
    );

    return (
        <SoundLayout onBack={onBack} backgroundImage={XYLOPHONE_BG}>
            <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-4">
                
                {isLoading && (
                    <div className="bg-black/40 px-6 py-2 rounded-full border border-white/20 animate-pulse mb-2 z-50">
                        <span className="text-white font-black text-xs uppercase tracking-widest">Accordatura... 🎵</span>
                    </div>
                )}

                {/* Doppia Scala Affiancata */}
                <div className={`relative w-full max-w-5xl h-[65vh] md:h-[70vh] flex flex-row items-center justify-center gap-4 md:gap-12 transition-opacity duration-500 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
                    
                    {/* OTTAVA BASSA */}
                    <div className="flex-1 h-full flex flex-col items-center">
                        <span className="font-luckiest text-white/40 text-[10px] md:text-sm uppercase mb-1">Ottava Bassa</span>
                        {renderScale(LOW_SCALE)}
                    </div>

                    {/* OTTAVA ALTA */}
                    <div className="flex-1 h-full flex flex-col items-center">
                        <span className="font-luckiest text-white/40 text-[10px] md:text-sm uppercase mb-1">Ottava Alta</span>
                        {renderScale(HIGH_SCALE)}
                    </div>

                </div>

                <div className="mt-4 md:mt-6 shrink-0">
                    <p className="font-luckiest text-white text-lg md:text-3xl uppercase text-center drop-shadow-lg" style={{ WebkitTextStroke: '1px black' }}>
                        Suona con due mani! ✨
                    </p>
                </div>
            </div>
        </SoundLayout>
    );
};

export default XylophoneInstrument;
