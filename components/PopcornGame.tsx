
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { addTokens } from '../services/tokens';
import { X, Timer, Volume2, VolumeX, RotateCcw, AlertCircle } from 'lucide-react';

const BG_MICROWAVE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfcucinapopcorngamens3w2.webp'; 
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const HEADER_MODAL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/popcornboomomdali8u7y.webp';
const BTN_START_GAME_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/iniziapopcornboosa1q.webp';

const IMG_WHITE_POPCORN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/popcornbiancobom321.webp';
const IMG_BLACK_POPCORN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/popcornbnneriboom2w2w.webp';
const GAME_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/house-beat-259068.mp3';

const IMG_LEVEL_UP_THERMO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pocpcorntempesale4de.webp';
const BTN_NEXT_LEVEL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/livellosuccepopocorneboom2wsa.webp';
const BTN_RETRY_LEVEL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/provadinuovpopcornboom4e3e.webp';

const LEVEL_DURATION = 60; 
const MAX_LEVEL = 30;
const POINTS_FOR_TOKENS = 20;
const MIN_SCORE_TO_PASS = 10;
const TARGET_FPS = 60;
const REF_FRAME_TIME = 1000 / TARGET_FPS; // ~16.66ms

interface Popcorn {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    type: 'WHITE' | 'BURNT';
    active: boolean;
}

const PopcornGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'LEVEL_UP' | 'LEVEL_FAILED' | 'VICTORY'>('START');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [tokensWon, setTokensWon] = useState(0);
    const [whiteCaughtTotal, setWhiteCaughtTotal] = useState(0);
    const [timeLeft, setTimeLeft] = useState(LEVEL_DURATION);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const popcornsRef = useRef<Popcorn[]>([]);
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const audioCtx = useRef<AudioContext | null>(null);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    const whitePopcornImg = useRef<HTMLImageElement | null>(null);
    const blackPopcornImg = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        whitePopcornImg.current = new Image();
        whitePopcornImg.current.src = IMG_WHITE_POPCORN;
        blackPopcornImg.current = new Image();
        blackPopcornImg.current.src = IMG_BLACK_POPCORN;

        // Inizializzazione musica di sottofondo
        bgMusicRef.current = new Audio(GAME_MUSIC_URL);
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.4;

        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
        };
    }, []);

    // Gestione muting musica in base allo stato soundEnabled
    useEffect(() => {
        if (bgMusicRef.current) {
            bgMusicRef.current.muted = !soundEnabled;
        }
    }, [soundEnabled]);

    const playSfx = useCallback((type: 'POP' | 'FAIL') => {
        if (!soundEnabled) return;
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioCtx.current;
        if (ctx.state === 'suspended') ctx.resume();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        if (type === 'POP') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150 + Math.random() * 100, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.2);
        }
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    }, [soundEnabled]);

    const initCanvas = () => {
        if (canvasRef.current && containerRef.current) {
            canvasRef.current.width = containerRef.current.offsetWidth;
            canvasRef.current.height = containerRef.current.offsetHeight;
        }
    };

    useEffect(() => {
        initCanvas();
        window.addEventListener('resize', initCanvas);
        return () => window.removeEventListener('resize', initCanvas);
    }, []);

    const spawnPopcorn = (canvas: HTMLCanvasElement) => {
        const speedFactor = 1 + (level - 1) * 0.005;
        const burntProb = Math.min(0.12 + (level * 0.003), 0.3);
        const type = Math.random() > burntProb ? 'WHITE' : 'BURNT';
        
        popcornsRef.current.push({
            id: Date.now() + Math.random(),
            x: canvas.width / 2,
            y: canvas.height * 0.50, 
            vx: (Math.random() - 0.5) * 3 * speedFactor, 
            vy: (Math.random() * -5 - 3) * speedFactor, 
            size: Math.random() * 15 + 38,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 4, 
            type,
            active: true
        });
    };

    const update = (time: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || gameState !== 'PLAYING') return;

        if (!lastTimeRef.current) {
            lastTimeRef.current = time;
            requestRef.current = requestAnimationFrame(update);
            return;
        }
        
        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;

        const timeFactor = Math.min(deltaTime / REF_FRAME_TIME, 2.0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < (0.035 + (level * 0.001)) * timeFactor) spawnPopcorn(canvas);

        popcornsRef.current.forEach((p) => {
            if (!p.active) return;

            p.x += p.vx * timeFactor;
            p.y += p.vy * timeFactor;
            p.vy += 0.12 * timeFactor; 
            p.rotation += p.rotationSpeed * timeFactor;

            if (p.x < 20 || p.x > canvas.width - 20) p.vx *= -0.5;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            
            const img = p.type === 'WHITE' ? whitePopcornImg.current : blackPopcornImg.current;
            if (img && img.complete) {
                ctx.shadowColor = 'rgba(0,0,0,0.1)';
                ctx.shadowBlur = 4;
                ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
            }
            
            ctx.restore();

            if (p.y > canvas.height + 100) p.active = false;
        });

        popcornsRef.current = popcornsRef.current.filter(p => p.active);
        requestRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        if (gameState === 'PLAYING') {
            lastTimeRef.current = 0; 
            requestRef.current = requestAnimationFrame(update);
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleLevelEnd();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => {
                cancelAnimationFrame(requestRef.current);
                clearInterval(timer);
            };
        }
    }, [gameState]);

    const handleLevelEnd = () => {
        // Interrompiamo la musica alla fine del livello
        if (bgMusicRef.current) bgMusicRef.current.pause();

        setScore(currentScore => {
            if (currentScore >= MIN_SCORE_TO_PASS) {
                if (level >= MAX_LEVEL) setGameState('VICTORY');
                else setGameState('LEVEL_UP');
            } else {
                setGameState('LEVEL_FAILED');
            }
            return currentScore;
        });
    };

    const startLevel = (isRestart = false) => {
        if (!isRestart && gameState === 'LEVEL_UP') setLevel(l => l + 1);
        setScore(0);
        setTimeLeft(LEVEL_DURATION);
        popcornsRef.current = [];
        setGameState('PLAYING');

        // Avvio musica di sottofondo
        if (bgMusicRef.current) {
            bgMusicRef.current.currentTime = 0;
            bgMusicRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
    };

    const handlePopcornClick = (clientX: number, clientY: number) => {
        if (gameState !== 'PLAYING') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        for (let i = popcornsRef.current.length - 1; i >= 0; i--) {
            const p = popcornsRef.current[i];
            const dist = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
            
            if (p.active && dist < (p.size * 1.5)) { 
                p.active = false;
                
                if (p.type === 'WHITE') {
                    playSfx('POP');
                    setScore(s => s + 1);
                    setWhiteCaughtTotal(prev => {
                        const next = prev + 1;
                        if (next > 0 && next % POINTS_FOR_TOKENS === 0) {
                            addTokens(2);
                            setTokensWon(tw => tw + 2);
                        }
                        return next;
                    });
                } else {
                    playSfx('FAIL');
                    setScore(s => Math.max(0, s - 1));
                }
                break;
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[150] bg-slate-900 flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-500">
            {/* Sfondo */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img src={BG_MICROWAVE} className="w-full h-full object-cover opacity-60" alt="" />
            </div>

            {/* HUD */}
            <div className="relative z-30 w-full p-4 md:p-8 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-3 pointer-events-auto">
                    <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_CLOSE_IMG} className="w-14 h-14 md:w-20 h-auto drop-shadow-xl" alt="Chiudi" />
                    </button>
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="bg-blue-500 text-white p-3 rounded-full border-4 border-black hover:scale-110 active:scale-95 shadow-lg">
                        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                </div>

                {gameState === 'PLAYING' && (
                    <div className="flex flex-col items-center gap-2">
                        <div className={`bg-white border-4 border-black px-6 py-2 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top ${timeLeft <= 10 ? 'text-red-600' : 'text-black'}`}>
                            <Timer className={timeLeft <= 10 ? 'animate-pulse' : ''} />
                            <span className="font-luckiest text-2xl md:text-4xl">{timeLeft}s</span>
                        </div>
                        <div className="bg-purple-600 border-4 border-black px-4 py-1 rounded-xl shadow-lg">
                            <span className="font-black text-white text-xs uppercase tracking-widest">LIVELLO {level}</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3 items-end pointer-events-auto">
                    <div className="bg-white px-4 py-2 rounded-2xl border-4 border-black shadow-xl flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🍿</span>
                            <span className="font-luckiest text-xl md:text-3xl text-gray-800">{score}</span>
                        </div>
                        <span className="text-[8px] font-black text-gray-400 uppercase leading-none">Punteggio Netto</span>
                    </div>
                    <div className="bg-yellow-400 px-4 py-2 rounded-2xl border-4 border-black shadow-xl flex items-center gap-2">
                        <span className="text-xl">🪙</span>
                        <span className="font-black text-sm md:text-lg text-black">+{tokensWon}</span>
                    </div>
                </div>
            </div>

            {/* AREA DI GIOCO */}
            <div 
                ref={containerRef} 
                className="flex-1 w-full relative cursor-crosshair z-20"
                onMouseDown={(e) => handlePopcornClick(e.clientX, e.clientY)}
                onTouchStart={(e) => handlePopcornClick(e.touches[0].clientX, e.touches[0].clientY)}
            >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            </div>

            {/* MODALI */}
            {gameState === 'START' && (
                <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white p-6 rounded-[3rem] border-8 border-yellow-400 shadow-2xl text-center max-sm flex flex-col items-center">
                        <img src={HEADER_MODAL_IMG} className="w-full h-auto mb-2 drop-shadow-md" alt="Popcorn Boom!" />
                        <div className="bg-blue-50 p-4 rounded-2xl mb-4 space-y-1.5 border-2 border-blue-100">
                             <p className="text-gray-700 font-bold leading-tight flex items-center justify-center gap-1">
                                Prendi i popcorn 
                                <img src={IMG_WHITE_POPCORN} className="w-6 h-6 object-contain" alt="bianchi" /> 
                                bianchi!
                             </p>
                             <p className="text-red-500 font-black text-xs uppercase flex items-center justify-center gap-1">
                                Evita quelli neri 
                                <img src={IMG_BLACK_POPCORN} className="w-6 h-6 object-contain" alt="neri" />
                                o perdi punti!
                             </p>
                             <p className="text-gray-800 font-black text-base">Minimo {MIN_SCORE_TO_PASS} per passare!</p>
                        </div>
                        <button onClick={() => startLevel(true)} className="hover:scale-105 active:scale-95 transition-all outline-none">
                            <img src={BTN_START_GAME_IMG} alt="Inizia" className="w-36 h-auto drop-shadow-xl" />
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'LEVEL_UP' && (
                <div className="absolute inset-0 z-50 bg-white flex items-center justify-center p-6 animate-in zoom-in duration-500">
                    <div className="text-center flex flex-col items-center max-w-sm">
                        <h2 className="text-3xl md:text-5xl font-luckiest text-blue-600 mb-6 uppercase" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>LIVELLO {level} COMPLETATO!</h2>
                        <img src={IMG_LEVEL_UP_THERMO} alt="Temperatura che sale" className="w-64 h-auto mb-6 drop-shadow-lg" />
                        <p className="text-gray-700 text-lg md:text-2xl font-bold mb-10 leading-tight px-4">Adesso la temperatura comincia ad aumentare tieniti pronto...</p>
                        <button onClick={() => startLevel()} className="hover:scale-110 active:scale-95 transition-all outline-none group">
                            <img src={BTN_NEXT_LEVEL_IMG} alt="Prossimo Livello" className="w-48 h-auto drop-shadow-2xl" />
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'LEVEL_FAILED' && (
                <div className="absolute inset-0 z-50 bg-red-600/90 flex items-center justify-center p-6 animate-in zoom-in">
                    <div className="bg-white p-10 rounded-[3rem] border-8 border-black shadow-2xl text-center max-md flex flex-col items-center">
                        <AlertCircle size={80} className="text-red-500 mb-4" />
                        <h2 className="text-3xl md:text-4xl font-luckiest text-red-600 mb-2 uppercase">NON ABBASTANZA!</h2>
                        <p className="text-gray-600 font-bold mb-4">Hai fatto solo <span className="text-2xl text-black">{score}</span> popcorn netti.</p>
                        <p className="text-gray-500 text-sm mb-8 italic">Ne servono almeno {MIN_SCORE_TO_PASS} per passare!</p>
                        <button onClick={() => startLevel(true)} className="hover:scale-110 active:scale-95 transition-all outline-none group">
                            <img src={BTN_RETRY_LEVEL_IMG} alt="Riprova" className="w-48 h-auto drop-shadow-2xl" />
                        </button>
                    </div>
                </div>
            )}

            {gameState === 'VICTORY' && (
                <div className="absolute inset-0 z-50 bg-yellow-400 flex items-center justify-center p-6 animate-in zoom-in">
                    <div className="bg-white p-10 rounded-[4rem] border-8 border-black shadow-2xl text-center max-w-2xl flex flex-col items-center">
                        <div className="text-8xl mb-6">🏆</div>
                        <h2 className="text-4xl md:text-6xl font-luckiest text-blue-600 mb-6 uppercase">CAMPIONE DEI POPCORN!</h2>
                        <p className="text-xl md:text-3xl font-bold text-gray-700 mb-8 leading-relaxed">Incredibile! Hai superato tutti i 30 livelli. <br/> Ora puoi rilassarti e gustare i tuoi popcorn raccolti! 🍿✨</p>
                        <div className="bg-blue-100 p-6 rounded-3xl border-4 border-blue-500 mb-8 w-full">
                            <div className="flex justify-center gap-12">
                                <div className="flex flex-col items-center"><span className="text-4xl">🍿</span><span className="font-luckiest text-3xl">{whiteCaughtTotal}</span><span className="text-[10px] font-black uppercase">Totali presi</span></div>
                                <div className="flex flex-col items-center"><span className="text-4xl">🪙</span><span className="font-luckiest text-3xl">{tokensWon}</span><span className="text-[10px] font-black uppercase">Vinti</span></div>
                            </div>
                        </div>
                        <button onClick={onBack} className="bg-green-500 text-white font-black px-12 py-5 rounded-full border-4 border-black shadow-[6px_6px_0_black] hover:scale-105 active:translate-y-1 transition-all text-2xl uppercase">RITORNA IN CUCINA</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopcornGame;
