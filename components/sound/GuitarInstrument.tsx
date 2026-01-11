
import React, { useRef, useEffect, useState } from 'react';
import SoundLayout from './SoundLayout';

const GUITAR_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/guitardisco4311.webp';
const GUITAR_SAMPLE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/a3-101081.mp3';

interface NotePos {
    label: string;
    rate: number;
    color: string;
    top: number;
    left: number;
}

// Note con le coordinate calibrate fornite dall'utente
const NOTES: NotePos[] = [
    { label: 'DO', rate: 0.5946, color: 'text-red-500', top: 3.51, left: 50.40 },
    { label: 'RE', rate: 0.6674, color: 'text-orange-500', top: 10.17, left: 50.40 },
    { label: 'MI', rate: 0.7491, color: 'text-yellow-400', top: 17.01, left: 50.40 },
    { label: 'FA', rate: 0.7937, color: 'text-green-500', top: 23.84, left: 50.67 },
    { label: 'SOL', rate: 0.8908, color: 'text-cyan-500', top: 31.24, left: 50.93 },
    { label: 'LA', rate: 1.0000, color: 'text-blue-500', top: 38.08, left: 50.67 },
    { label: 'SI', rate: 1.1224, color: 'text-purple-500', top: 45.84, left: 50.40 },
    { label: 'DO', rate: 1.1892, color: 'text-pink-500', top: 52.13, left: 50.13 },
    { label: 'RE', rate: 1.3348, color: 'text-red-400', top: 59.52, left: 49.87 },
    { label: 'MI', rate: 1.4983, color: 'text-orange-400', top: 66.73, left: 50.40 },
];

const GuitarInstrument: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sampleBufferRef = useRef<AudioBuffer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Refs per gestire lo swipe senza ripetizioni fastidiose
    const isPointerDown = useRef(false);
    const lastPlayedNoteIndex = useRef<number | null>(null);

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
                const response = await fetch(GUITAR_SAMPLE_URL);
                const arrayBuffer = await response.arrayBuffer();
                const ctx = initAudio();
                const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
                sampleBufferRef.current = decodedBuffer;
                setIsLoading(false);
            } catch (e) {
                console.error("Errore caricamento chitarra:", e);
            }
        };
        loadSample();
    }, []);

    const playNote = (rate: number, index: number) => {
        if (!sampleBufferRef.current || isLoading) return;
        
        // Evita di suonare la stessa nota più volte se il dito si muove dentro lo stesso tasto
        if (lastPlayedNoteIndex.current === index) return;
        lastPlayedNoteIndex.current = index;

        const ctx = initAudio();
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = sampleBufferRef.current;
        source.playbackRate.value = rate;
        
        gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        
        source.connect(gainNode).connect(ctx.destination);
        source.start(0);
    };

    const handlePointerDown = (rate: number, index: number) => {
        isPointerDown.current = true;
        playNote(rate, index);
    };

    const handlePointerEnter = (rate: number, index: number) => {
        // Suona solo se il puntatore/dito è premuto (per lo swipe)
        if (isPointerDown.current) {
            playNote(rate, index);
        }
    };

    const handlePointerUpGlobal = () => {
        isPointerDown.current = false;
        lastPlayedNoteIndex.current = null;
    };

    useEffect(() => {
        window.addEventListener('pointerup', handlePointerUpGlobal);
        return () => window.removeEventListener('pointerup', handlePointerUpGlobal);
    }, []);

    return (
        <SoundLayout onBack={onBack} backgroundImage={GUITAR_BG}>
            <div className="w-full h-full relative overflow-hidden touch-none select-none">
                
                {isLoading && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                        <div className="bg-black/60 px-6 py-2 rounded-full border border-white/20 animate-pulse">
                            <span className="text-white font-black text-xs uppercase tracking-widest">Caricamento suoni... 🎸</span>
                        </div>
                    </div>
                )}

                {/* AREA NOTE */}
                <div className="absolute inset-0 z-10 w-full h-full">
                    {NOTES.map((note, idx) => (
                        <button
                            key={`${note.label}-${idx}`}
                            onPointerDown={() => handlePointerDown(note.rate, idx)}
                            onPointerEnter={() => handlePointerEnter(note.rate, idx)}
                            className={`
                                absolute transform -translate-x-1/2 -translate-y-1/2
                                font-luckiest text-[5vh] md:text-[7vh] transition-all duration-75 outline-none
                                select-none leading-none z-20 hover:scale-110 active:scale-90
                                ${note.color}
                            `}
                            style={{
                                top: `${note.top}%`,
                                left: `${note.left}%`,
                                WebkitTextStroke: 'min(0.2vh, 2px) black',
                                textShadow: 'min(0.4vh, 4px) min(0.4vh, 4px) 0px rgba(0,0,0,0.5)',
                                touchAction: 'none'
                            }}
                        >
                            {note.label}
                        </button>
                    ))}
                </div>

                {!isLoading && (
                    <div className="absolute bottom-[5vh] left-0 right-0 text-center pointer-events-none">
                        <p className="font-luckiest text-white text-[3vh] md:text-[4vh] uppercase drop-shadow-lg" style={{ WebkitTextStroke: '1px black' }}>
                            Tocca o striscia per suonare! 🎸
                        </p>
                    </div>
                )}
            </div>
        </SoundLayout>
    );
};

export default GuitarInstrument;
