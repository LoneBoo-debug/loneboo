
import React, { useState, useRef, useEffect } from 'react';
import SoundLayout from './SoundLayout';

const BONGO_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bongobtr443.webp';

interface BongoConfig {
    id: string;
    size: string; // Tailwind size class
    pitch: number;
    color: string;
    label: string;
}

const BONGOS: BongoConfig[] = [
    { id: 'b1', size: 'w-20 h-20 md:w-28 md:h-28', pitch: 520, color: 'from-amber-100 to-amber-300', label: 'MINI ✨' },
    { id: 'b2', size: 'w-24 h-24 md:w-32 md:h-32', pitch: 440, color: 'from-amber-200 to-amber-400', label: 'PICCOLO 🥁' },
    { id: 'b3', size: 'w-28 h-28 md:w-36 md:h-36', pitch: 370, color: 'from-amber-300 to-amber-500', label: 'MEDIO-P 🎵' },
    { id: 'b4', size: 'w-32 h-32 md:w-40 md:h-40', pitch: 300, color: 'from-amber-400 to-amber-600', label: 'MEDIO 🎶' },
    { id: 'b5', size: 'w-36 h-36 md:w-44 md:h-44', pitch: 240, color: 'from-amber-500 to-amber-700', label: 'MEDIO-G 🔉' },
    { id: 'b6', size: 'w-40 h-40 md:w-48 md:h-48', pitch: 180, color: 'from-amber-600 to-amber-800', label: 'GRANDE 🔊' },
    { id: 'b7', size: 'w-44 h-44 md:w-52 md:h-52', pitch: 130, color: 'from-amber-700 to-amber-900', label: 'EXTRA 🌟' },
    { id: 'b8', size: 'w-48 h-48 md:w-60 md:h-60', pitch: 85, color: 'from-stone-700 to-stone-900', label: 'GIGA 💥' },
];

const BongoInstrument: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [hitId, setHitId] = useState<string | null>(null);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        return audioCtxRef.current;
    };

    const playBongo = (config: BongoConfig) => {
        const ctx = initAudio();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(config.pitch, now);
        // Pitch drop tipico delle percussioni a pelle
        osc.frequency.exponentialRampToValueAtTime(config.pitch * 0.5, now + 0.1);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.8, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(filter).connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);

        setHitId(config.id);
        setTimeout(() => setHitId(null), 100);
    };

    return (
        <SoundLayout onBack={onBack} backgroundImage={BONGO_BG}>
            <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto no-scrollbar p-4 pb-24 md:pb-32">
                <div className="flex flex-wrap justify-center items-end gap-3 md:gap-8 max-w-7xl mt-4 md:mt-10">
                    {BONGOS.map((b) => (
                        <div key={b.id} className="flex flex-col items-center gap-3">
                            <button
                                onPointerDown={(e) => { e.preventDefault(); playBongo(b); }}
                                className={`
                                    relative ${b.size} rounded-full border-4 md:border-8 border-amber-900 shadow-2xl transition-all duration-75 outline-none
                                    bg-gradient-to-b ${b.color}
                                    ${hitId === b.id ? 'scale-90 brightness-125' : 'hover:scale-105 active:scale-95'}
                                `}
                                style={{ touchAction: 'none' }}
                            >
                                {/* Texture pelle del bongo */}
                                <div className="absolute inset-2 rounded-full border-2 border-amber-800/20 opacity-30"></div>
                                <div className="absolute inset-4 rounded-full border border-amber-800/10 opacity-20"></div>
                                
                                {/* Riflesso luce */}
                                <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/20 rounded-full blur-md"></div>
                                
                                {hitId === b.id && (
                                    <div className="absolute inset-0 bg-white/30 rounded-full animate-ping opacity-50"></div>
                                )}
                            </button>
                            <div className="bg-black/40 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full border border-white/20">
                                <span className="text-white font-black text-[8px] md:text-xs uppercase tracking-tighter whitespace-nowrap">{b.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-10 md:mt-16 shrink-0">
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
