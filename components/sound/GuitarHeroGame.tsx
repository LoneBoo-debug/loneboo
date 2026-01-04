
import React, { useState, useEffect, useRef } from 'react';
import SoundLayout from './SoundLayout';
import { Play, RotateCcw, Star, Music } from 'lucide-react';

const BATBEAT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/batbeat.webp';
const GUITAR_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfchitsf.webp';

interface Note {
    id: number;
    lane: number;
    y: number;
    active: boolean;
}

const LANES = [
    { id: 0, color: 'bg-red-500', glow: 'shadow-[0_0_20px_#ef4444]', noteColor: '#ef4444' },
    { id: 1, color: 'bg-green-500', glow: 'shadow-[0_0_20px_#22c55e]', noteColor: '#22c55e' },
    { id: 2, color: 'bg-blue-500', glow: 'shadow-[0_0_20px_#3b82f6]', noteColor: '#3b82f6' }
];

const GuitarHeroGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [gameSpeed, setGameSpeed] = useState(4);
    const [isGameOver, setIsGameOver] = useState(false);

    const notesRef = useRef<Note[]>([]);
    const requestRef = useRef<number>(0);
    const lastSpawnTime = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Audio Engine per suoni di chitarra synth
    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    };

    const playGuitarNote = (freq: number) => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.4);
    };

    const spawnNote = () => {
        const lane = Math.floor(Math.random() * 3);
        notesRef.current.push({
            id: Date.now() + Math.random(),
            lane,
            y: -50,
            active: true
        });
    };

    const update = (time: number) => {
        if (!isPlaying || isGameOver) return;

        // Difficoltà progressiva
        const spawnInterval = Math.max(400, 1000 - (score * 5));
        const currentSpeed = 4 + (score * 0.05);
        setGameSpeed(currentSpeed);

        if (time - lastSpawnTime.current > spawnInterval) {
            spawnNote();
            lastSpawnTime.current = time;
        }

        const containerHeight = containerRef.current?.offsetHeight || 600;
        const hitZoneY = containerHeight * 0.85;

        const nextNotes: Note[] = [];
        notesRef.current.forEach(note => {
            note.y += currentSpeed;
            if (note.y > containerHeight) {
                if (note.active) {
                    setCombo(0);
                    setFeedback("MISS!");
                    setTimeout(() => setFeedback(null), 500);
                }
            } else {
                nextNotes.push(note);
            }
        });
        notesRef.current = nextNotes;

        requestRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(update);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, isGameOver]);

    const handleHit = (lane: number) => {
        if (!isPlaying) return;
        initAudio();
        
        const freqs = [329.63, 440.00, 523.25]; // E4, A4, C5
        playGuitarNote(freqs[lane]);

        const containerHeight = containerRef.current?.offsetHeight || 600;
        const hitZoneY = containerHeight * 0.85;
        const tolerance = 50;

        let hit = false;
        notesRef.current.forEach(note => {
            if (note.active && note.lane === lane) {
                const distance = Math.abs(note.y - hitZoneY);
                if (distance < tolerance) {
                    note.active = false;
                    hit = true;
                    setScore(s => s + 10);
                    setCombo(c => c + 1);
                    const feedbacks = ["GRANDE!", "ROCK!", "WOW!", "COOL!", "SUPER!"];
                    setFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
                    setTimeout(() => setFeedback(null), 500);
                }
            }
        });

        if (!hit) {
            setCombo(0);
        }
    };

    const startGame = () => {
        initAudio();
        setScore(0);
        setCombo(0);
        setIsGameOver(false);
        setFeedback(null);
        notesRef.current = [];
        setIsPlaying(true);
        lastSpawnTime.current = performance.now();
    };

    return (
        <SoundLayout onBack={onBack} backgroundImage={GUITAR_BG} titleText="Assolo con BatBeat">
            <div ref={containerRef} className="w-full h-full relative flex flex-col items-center overflow-hidden">
                <style>{`
                    .guitar-string {
                        background: linear-gradient(90deg, transparent 45%, rgba(255,255,255,0.4) 50%, transparent 55%);
                        width: 100%;
                        height: 100%;
                        position: absolute;
                    }
                    @keyframes note-pulse {
                        0%, 100% { transform: scale(1); filter: brightness(1); }
                        50% { transform: scale(1.1); filter: brightness(1.3); }
                    }
                    .animate-note { animation: note-pulse 0.5s infinite; }
                    @keyframes batbeat-vibe {
                        0%, 100% { transform: rotate(-5deg) translateY(0); }
                        50% { transform: rotate(5deg) translateY(-10px); }
                    }
                    .batbeat-animation { animation: batbeat-vibe 0.8s ease-in-out infinite; }
                `}</style>

                {/* BATBEAT CHARACTER */}
                <div className="absolute left-4 md:left-20 top-1/2 -translate-y-1/2 w-32 md:w-64 z-20 pointer-events-none">
                    <img src={BATBEAT_IMG} alt="BatBeat" className={`w-full h-auto drop-shadow-2xl ${isPlaying ? 'batbeat-animation' : ''}`} />
                    {feedback && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-black px-4 py-2 rounded-full border-4 border-black shadow-lg animate-bounce whitespace-nowrap z-50">
                            {feedback}
                        </div>
                    )}
                </div>

                {/* COMBO & SCORE DISPLAY */}
                <div className="absolute right-4 md:right-20 top-10 flex flex-col gap-2 z-30">
                    <div className="bg-black/60 backdrop-blur-md p-4 rounded-3xl border-4 border-purple-500 shadow-xl text-center">
                        <span className="block text-purple-300 text-xs font-black uppercase">Punti</span>
                        <span className="text-3xl font-black text-white">{score}</span>
                    </div>
                    {combo > 5 && (
                        <div className="bg-yellow-400 p-2 rounded-2xl border-4 border-black shadow-lg text-center animate-pulse">
                            <span className="block text-black text-[10px] font-black uppercase tracking-tighter">Combo</span>
                            <span className="text-xl font-black text-blue-900">x{combo}</span>
                        </div>
                    )}
                </div>

                {/* TRACK AREA */}
                <div className="relative w-72 md:w-96 h-full bg-black/40 backdrop-blur-sm border-x-4 border-white/20 shadow-2xl flex justify-around">
                    {/* LANES RENDERING */}
                    {LANES.map(lane => (
                        <div key={lane.id} className="relative w-full h-full border-r border-white/10 last:border-r-0">
                            <div className="guitar-string opacity-30"></div>
                            
                            {/* Target Circles */}
                            <div className={`absolute bottom-[12%] left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white/40 flex items-center justify-center`}>
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/20 opacity-30`}></div>
                            </div>
                        </div>
                    ))}

                    {/* FALLING NOTES */}
                    {notesRef.current.map(note => note.active && (
                        <div 
                            key={note.id}
                            className={`absolute w-14 h-14 md:w-18 md:h-18 rounded-full border-4 border-white shadow-lg animate-note z-40`}
                            style={{ 
                                left: `${(note.lane * 33.3) + 16.6}%`, 
                                top: note.y, 
                                backgroundColor: LANES[note.lane].noteColor,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            <div className="absolute inset-1 rounded-full border-2 border-white/40"></div>
                            <Star className="w-full h-full p-2 text-white/50" fill="currentColor" />
                        </div>
                    ))}
                </div>

                {/* HIT BUTTONS */}
                <div className="absolute bottom-6 w-72 md:w-96 flex justify-around z-50 px-2">
                    {LANES.map(lane => (
                        <button
                            key={lane.id}
                            onPointerDown={() => handleHit(lane.id)}
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-2xl transition-all active:scale-90 active:brightness-125 ${lane.color} ${lane.glow}`}
                        >
                            <Music className="w-full h-full p-6 text-white" fill="currentColor" />
                        </button>
                    ))}
                </div>

                {/* START / GAME OVER OVERLAY */}
                {!isPlaying && (
                    <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
                        <div className="bg-white p-8 rounded-[40px] border-8 border-purple-600 shadow-2xl text-center max-w-sm flex flex-col items-center animate-in zoom-in duration-300">
                            <img src={BATBEAT_IMG} alt="BatBeat" className="w-40 h-auto mb-6 drop-shadow-xl animate-float" />
                            <h2 className="text-3xl font-black text-purple-600 mb-2 uppercase tracking-tighter">PRONTO PER IL ROCK?</h2>
                            <p className="text-gray-600 font-bold mb-8 leading-snug">Prendi le note a tempo per fare l'assolo più pazzesco di Città Colorata!</p>
                            <button 
                                onClick={startGame}
                                className="bg-green-500 text-white font-black px-10 py-4 rounded-full border-4 border-black shadow-[6px_6px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-xl uppercase flex items-center gap-2"
                            >
                                <Play fill="currentColor" /> INIZIA!
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuitarHeroGame;
