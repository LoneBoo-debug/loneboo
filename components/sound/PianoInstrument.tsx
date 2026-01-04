
import React, { useState, useRef, useEffect } from 'react';
import SoundLayout from './SoundLayout';

const PIANO_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/piano-title.webp';
const PIANO_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfpian.webp';
const ROTATE_HINT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ticonsig.webp';

type PianoEffect = 'CLASSIC' | 'GHOST' | 'MONSTER' | 'ROBOT' | 'ALIEN';

const PianoInstrument: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [effect, setEffect] = useState<PianoEffect>('CLASSIC');
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        document.body.classList.add('allow-landscape');
        return () => {
            document.body.classList.remove('allow-landscape');
        };
    }, []);

    const NOTES = [
        { note: 'C4', freq: 261.63, color: 'bg-red-500', label: 'Do' },
        { note: 'D4', freq: 293.66, color: 'bg-orange-500', label: 'Re' },
        { note: 'E4', freq: 329.63, color: 'bg-yellow-400', label: 'Mi' },
        { note: 'F4', freq: 349.23, color: 'bg-green-500', label: 'Fa' },
        { note: 'G4', freq: 392.00, color: 'bg-cyan-500', label: 'Sol' },
        { note: 'A4', freq: 440.00, color: 'bg-blue-500', label: 'La' },
        { note: 'B4', freq: 493.88, color: 'bg-purple-500', label: 'Si' },
        { note: 'C5', freq: 523.25, color: 'bg-red-400', label: 'Do' },
    ];

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        return audioCtxRef.current;
    };

    const playNote = (freq: number) => {
        const ctx = initAudio();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, now);
        
        if (effect === 'CLASSIC') {
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        } else if (effect === 'GHOST') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq * 0.8, now);
            osc.frequency.exponentialRampToValueAtTime(freq, now + 0.15);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        } else if (effect === 'MONSTER') {
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        } else if (effect === 'ROBOT') {
            osc.type = 'square';
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass'; filter.frequency.value = 1200; filter.Q.value = 15;
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
            osc.connect(filter).connect(gain).connect(ctx.destination);
            osc.start(now); osc.stop(now + 0.4); return;
        } else if (effect === 'ALIEN') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * 2, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.5);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        }
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + (effect === 'GHOST' ? 1.2 : 0.6));
    };

    const MODES = [
        { id: 'CLASSIC', label: 'CLASSICO', imgUrl: 'https://i.postimg.cc/tCzBwfT5/sounfdsu7.png', color: 'bg-blue-400' },
        { id: 'GHOST', label: 'FANTASMA', imgUrl: 'https://i.postimg.cc/mg86zqfJ/fnatsa.png', color: 'bg-purple-400' },
        { id: 'MONSTER', label: 'MOSTRO', imgUrl: 'https://i.postimg.cc/KYWqQMYw/mostro.png', color: 'bg-red-400' },
        { id: 'ROBOT', label: 'ROBOT', imgUrl: 'https://i.postimg.cc/1RwCc41C/robot.png', color: 'bg-cyan-400' },
        { id: 'ALIEN', label: 'ALIENO', imgUrl: 'https://i.postimg.cc/jj3991M6/alien.png', color: 'bg-green-400' }
    ];

    return (
        <SoundLayout onBack={onBack} titleImage={PIANO_TITLE_IMG} backgroundImage={PIANO_BG}>
            <div className="w-full flex flex-col items-center justify-start mt-4 overflow-visible">
                {/* 
                    CONSOLE PIANO: 
                    In landscape usiamo 'fixed inset-0 z-[200]' per coprire TUTTO (header app incluso)
                */}
                <div className="w-full bg-slate-300 p-4 md:p-8 rounded-[2rem] border-4 md:border-8 border-slate-400 shadow-2xl relative max-w-4xl landscape:fixed landscape:inset-0 landscape:z-[200] landscape:max-w-none landscape:h-full landscape:rounded-none landscape:border-0 landscape:flex landscape:flex-col landscape:justify-center">
                    
                    {/* Pulsante Esci solo per Landscape (poiché copriamo quello del layout) */}
                    <button 
                        onClick={onBack}
                        className="hidden landscape:flex absolute top-4 left-4 z-[210] bg-red-600 text-white font-black px-6 py-2 rounded-full border-4 border-white shadow-lg active:scale-95 items-center justify-center text-sm uppercase"
                    >
                        ESCI
                    </button>

                    <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-8 landscape:mb-2 gap-3 px-2">
                        <div className="bg-slate-900 px-6 py-2 rounded-xl border-4 border-slate-800 w-full md:w-64 text-center landscape:py-1">
                            <span className="font-mono text-cyan-400 text-sm font-bold uppercase animate-pulse">MODO: {effect}</span>
                        </div>
                        <div className="flex gap-2">
                            {MODES.map((m) => (
                                <button key={m.id} onClick={() => setEffect(m.id as PianoEffect)} className={`w-12 h-12 md:w-20 md:h-20 landscape:w-12 landscape:h-12 rounded-full border-4 border-black/20 shadow-lg flex items-center justify-center transition-all ${effect === m.id ? `${m.color} scale-110 ring-4 ring-white` : 'bg-slate-100 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}>
                                    <img src={m.imgUrl} className="w-[80%] h-[80%] object-contain" alt={m.label} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-32 md:h-64 landscape:flex-1 bg-slate-800 p-2 md:p-4 rounded-xl shadow-inner flex gap-2">
                        {NOTES.map((n, i) => (
                            <button key={i} onPointerDown={(e) => { e.preventDefault(); playNote(n.freq); }} className={`flex-1 h-full rounded-b-xl border-x border-b-[8px] border-black/20 active:scale-y-[0.97] origin-top transition-transform flex flex-col justify-end items-center pb-4 ${n.color} shadow-[inset_0_4px_0_rgba(255,255,255,0.4)]`}>
                                <span className="font-black text-white text-sm md:text-3xl landscape:text-2xl select-none uppercase">{n.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Immagine Suggerimento Rotazione */}
                <div className="mt-8 landscape:hidden text-center px-4 shrink-0">
                    <img 
                        src={ROTATE_HINT_IMG} 
                        alt="Suggerimento Rotazione" 
                        className="w-72 md:w-[550px] h-auto mx-auto drop-shadow-md"
                    />
                </div>
            </div>
        </SoundLayout>
    );
};

export default PianoInstrument;
