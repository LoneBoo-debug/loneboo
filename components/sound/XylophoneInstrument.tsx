
import React, { useState, useRef, useEffect } from 'react';
import SoundLayout from './SoundLayout';

const XYLOPHONE_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ilobtg554.webp';
const XYLOPHONE_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvladisco.webp';

interface XyloNote {
    id: string;
    freq: number;
    color: string;
    label: string;
    width: number; // Percentuale di larghezza per l'effetto ottico
}

const OCTAVE_1: XyloNote[] = [
    { id: 'c4', freq: 261.63, color: 'bg-red-500', label: 'DO', width: 100 },
    { id: 'd4', freq: 293.66, color: 'bg-orange-500', label: 'RE', width: 95 },
    { id: 'e4', freq: 329.63, color: 'bg-yellow-400', label: 'MI', width: 90 },
    { id: 'f4', freq: 349.23, color: 'bg-green-500', label: 'FA', width: 85 },
    { id: 'g4', freq: 392.00, color: 'bg-teal-500', label: 'SOL', width: 80 },
    { id: 'a4', freq: 440.00, color: 'bg-blue-500', label: 'LA', width: 75 },
    { id: 'b4', freq: 493.88, color: 'bg-purple-500', label: 'SI', width: 70 },
    { id: 'c5', freq: 523.25, color: 'bg-pink-500', label: 'DO', width: 65 },
];

const OCTAVE_2: XyloNote[] = [
    { id: 'c5_2', freq: 523.25, color: 'bg-red-400', label: 'DO', width: 65 },
    { id: 'd5', freq: 587.33, color: 'bg-orange-400', label: 'RE', width: 60 },
    { id: 'e5', freq: 659.25, color: 'bg-yellow-300', label: 'MI', width: 55 },
    { id: 'f5', freq: 698.46, color: 'bg-green-400', label: 'FA', width: 50 },
    { id: 'g5', freq: 783.99, color: 'bg-teal-400', label: 'SOL', width: 45 },
    { id: 'a5', freq: 880.00, color: 'bg-blue-400', label: 'LA', width: 40 },
    { id: 'b5', freq: 987.77, color: 'bg-purple-400', label: 'SI', width: 35 },
    { id: 'c6', freq: 1046.50, color: 'bg-pink-400', label: 'DO', width: 30 },
];

const XylophoneInstrument: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        return audioCtxRef.current;
    };

    const playNote = (note: XyloNote) => {
        const ctx = initAudio();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.6, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);

        setActiveNotes(prev => {
            const next = new Set(prev);
            next.add(note.id);
            return next;
        });
        setTimeout(() => {
            setActiveNotes(prev => {
                const next = new Set(prev);
                next.delete(note.id);
                return next;
            });
        }, 150);
    };

    const XyloRack = ({ notes, title }: { notes: XyloNote[], title: string }) => (
        <div className="flex flex-col items-center gap-2 flex-1 h-full max-w-[200px] md:max-w-[300px]">
            <div className="bg-amber-900/80 backdrop-blur-sm px-4 py-1 rounded-full border-2 border-amber-700 mb-2">
                <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest">{title}</span>
            </div>
            <div className="flex-1 w-full bg-amber-800/40 rounded-[2rem] p-4 flex flex-col-reverse justify-between items-center relative border-x-4 border-amber-900/50 shadow-2xl">
                <div className="absolute left-6 top-4 bottom-4 w-2 bg-amber-900 rounded-full opacity-60"></div>
                <div className="absolute right-6 top-4 bottom-4 w-2 bg-amber-900 rounded-full opacity-60"></div>

                {notes.map((n) => (
                    <button
                        key={n.id}
                        onPointerDown={(e) => { e.preventDefault(); playNote(n); }}
                        className={`
                            relative h-[10%] rounded-xl border-4 border-black/20 shadow-lg transition-all duration-75
                            ${n.color} 
                            ${activeNotes.has(n.id) ? 'scale-95 brightness-125 shadow-[0_0_20px_rgba(255,255,255,0.6)]' : 'hover:brightness-105'}
                        `}
                        style={{ width: `${n.width}%`, touchAction: 'none' }}
                    >
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black/20"></div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black/20"></div>
                        
                        <span className="font-black text-white text-[10px] md:text-xl drop-shadow-md select-none">{n.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <SoundLayout onBack={onBack} backgroundImage={XYLOPHONE_BG}>
            <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
                <div className="flex flex-row justify-center gap-4 md:gap-20 h-full max-h-[70vh] w-full max-w-5xl">
                    <XyloRack notes={OCTAVE_1} title="Bassi 🎵" />
                    <XyloRack notes={OCTAVE_2} title="Alti ✨" />
                </div>
            </div>
        </SoundLayout>
    );
};

export default XylophoneInstrument;
