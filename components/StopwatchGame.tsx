import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppView } from '../types';
import { addTokens, getProgress } from '../services/tokens';
import { TOKEN_ICON_URL } from '../constants';
import TokenIcon from './TokenIcon';
import { Trophy, Volume2, VolumeX } from 'lucide-react';
import RobotHint from './RobotHint';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sopthrrtimer543dde3.webp';
const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

// Nuove immagini pulsanti
const BTN_VIA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/viatimer543dde+(1).webp';
const BTN_STOP_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stoptimendie544ed3+(1).webp';
const BTN_ANCORA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/riprovatimernd44rd+(1).webp';

// Audio Assets
const AUDIO_CLOCK_LOOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/clock-clock-sound-clock-clock-time-10343.mp3';
const AUDIO_FAIL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartoon-fail-trumpet-278822.mp3';
const AUDIO_WIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/11l-victory_trumpet-1749704498589-358767.mp3';

const StopwatchGame: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [targetTime, setTargetTime] = useState(0); // In centisecondi
    const [gameState, setGameState] = useState<'IDLE' | 'RUNNING' | 'FINISHED'>('IDLE');
    const [tokens, setTokens] = useState(0);
    const [hasWon, setHasWon] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('stopwatch_sound') !== 'false');
    
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const isRunningRef = useRef<boolean>(false);
    const lastElapsedRef = useRef<number>(0);

    // DOM Refs per aggiornamento ultra-rapido senza scatti
    const timerDisplayRef = useRef<HTMLDivElement>(null);

    // Audio Elements
    const clockAudio = useRef<HTMLAudioElement | null>(null);
    const winAudio = useRef<HTMLAudioElement | null>(null);
    const failAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize Audio
        clockAudio.current = new Audio(AUDIO_CLOCK_LOOP);
        clockAudio.current.loop = true;
        winAudio.current = new Audio(AUDIO_WIN);
        failAudio.current = new Audio(AUDIO_FAIL);

        setTokens(getProgress().tokens);
        generateTarget();

        return () => {
            isRunningRef.current = false;
            cancelAnimationFrame(requestRef.current);
            if (clockAudio.current) {
                clockAudio.current.pause();
                clockAudio.current = null;
            }
        };
    }, []);

    // Handle sound toggle logic for background loop
    useEffect(() => {
        if (clockAudio.current) {
            if (soundEnabled && gameState === 'RUNNING') {
                clockAudio.current.play().catch(e => console.log("Audio play blocked", e));
            } else {
                clockAudio.current.pause();
            }
        }
        localStorage.setItem('stopwatch_sound', String(soundEnabled));
    }, [soundEnabled, gameState]);

    const generateTarget = useCallback(() => {
        const min = 300;  // Minimo 3 secondi
        const max = 3000; // Massimo 30 secondi
        setTargetTime(Math.floor(Math.random() * (max - min + 1)) + min);
    }, []);

    const formatTime = (totalCentiseconds: number) => {
        const mins = Math.floor(totalCentiseconds / 6000);
        const secs = Math.floor((totalCentiseconds % 6000) / 100);
        const cents = totalCentiseconds % 100;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${cents.toString().padStart(2, '0')}`;
    };

    // Genera l'HTML delle cifre per l'aggiornamento diretto del DOM
    const getFixedTimeHTML = (timeStr: string) => {
        return timeStr.split('').map((char) => {
            const width = char === ':' ? '0.4em' : '0.8em';
            return `<span style="display: inline-block; text-align: center; width: ${width}">${char}</span>`;
        }).join('');
    };

    const updateTimer = (timestamp: number) => {
        if (!isRunningRef.current) return;
        
        const elapsed = Math.floor((timestamp - startTimeRef.current) / 10);
        
        if (elapsed >= 4500) {
            lastElapsedRef.current = 4500;
            isRunningRef.current = false;
            setGameState('FINISHED');
            setHasWon(false);
            if (soundEnabled && failAudio.current) failAudio.current.play().catch(() => {});
            return;
        }

        // Aggiorna direttamente il DOM per fluidità assoluta
        if (timerDisplayRef.current) {
            timerDisplayRef.current.innerHTML = getFixedTimeHTML(formatTime(elapsed));
        }
        
        lastElapsedRef.current = elapsed;
        requestRef.current = requestAnimationFrame(updateTimer);
    };

    const handleStart = () => {
        setHasWon(false);
        setGameState('RUNNING');
        isRunningRef.current = true;
        startTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(updateTimer);
        
        if (soundEnabled && clockAudio.current) {
            clockAudio.current.currentTime = 0;
            clockAudio.current.play().catch(e => console.log("Audio play blocked", e));
        }
    };

    const handleStop = () => {
        isRunningRef.current = false;
        cancelAnimationFrame(requestRef.current);
        setGameState('FINISHED');
        
        if (clockAudio.current) clockAudio.current.pause();

        const currentTime = lastElapsedRef.current;
        const diff = Math.abs(currentTime - targetTime);

        // Se lo scarto è entro i 20 centesimi (Aumentato da 10), forza il pareggio IDENTICO visivo
        if (diff <= 20) {
            // Sincronizzazione immediata del valore nel DOM
            if (timerDisplayRef.current) {
                timerDisplayRef.current.innerHTML = getFixedTimeHTML(formatTime(targetTime));
            }
            // Aggiorna il riferimento per eventuali render successivi
            lastElapsedRef.current = targetTime;
            
            setHasWon(true);
            const newTotal = addTokens(30);
            setTokens(newTotal);
            if (soundEnabled && winAudio.current) {
                winAudio.current.currentTime = 0;
                winAudio.current.play().catch(() => {});
            }
        } else {
            setHasWon(false);
            if (soundEnabled && failAudio.current) {
                failAudio.current.currentTime = 0;
                failAudio.current.play().catch(() => {});
            }
        }
    };

    const handleReset = () => {
        isRunningRef.current = false;
        cancelAnimationFrame(requestRef.current);
        setGameState('IDLE');
        setHasWon(false);
        lastElapsedRef.current = 0;
        generateTarget();
        if (clockAudio.current) clockAudio.current.pause();
    };

    // Calcolo differenza per feedback dinamico
    const isVeryClose = Math.abs(targetTime - lastElapsedRef.current) <= 100;

    return (
        <div className="fixed inset-0 z-0 bg-black flex flex-col items-center justify-start animate-in fade-in overflow-hidden select-none touch-none">
            <style>{`
                .lcd-container {
                    position: relative;
                    background: #050a05;
                    width: 280px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 16px;
                    box-shadow: inset 0 0 15px rgba(0,0,0,1), 0 0 0 4px #2a2a2a;
                    border: 4px solid #1a1a1a;
                    overflow: hidden;
                }
                @media (min-width: 768px) {
                    .lcd-container {
                        width: 420px;
                        height: 84px;
                    }
                }
                .lcd-font {
                    font-family: 'Share Tech Mono', monospace;
                    font-weight: 400;
                    letter-spacing: 0;
                    line-height: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .lcd-ghost {
                    position: absolute;
                    opacity: 0.04;
                    pointer-events: none;
                    color: white;
                    z-index: 5;
                }
                .lcd-actual {
                    position: relative;
                    z-index: 10;
                }
                .glow-red { 
                    color: #ff4d4d;
                    text-shadow: 0 0 5px rgba(255, 77, 77, 0.3); 
                }
                .glow-green { 
                    color: #4ade80;
                    text-shadow: 0 0 5px rgba(74, 222, 128, 0.3); 
                }
                @keyframes lcd-flash {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                .animate-flash { animation: lcd-flash 0.4s infinite; }
                
                .text-cartoon-yellow {
                    color: #facc15;
                    -webkit-text-stroke: 2px black;
                    text-shadow: 3px 3px 0px rgba(0,0,0,1);
                    font-family: 'Luckiest Guy', cursive;
                }
            `}</style>

            {/* BACKGROUND */}
            <img src={BG_URL} className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none" alt="" />

            {/* HEADER UI */}
            <div className="absolute top-20 md:top-28 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 pointer-events-none">
                <div className="flex items-center gap-4 pointer-events-auto">
                    <button onClick={() => setView(AppView.BOO_BEDROOM)} className="hover:scale-110 active:scale-95 transition-transform outline-none">
                        <img src={BTN_BACK_IMG} className="w-14 h-14 md:w-20 md:h-20 drop-shadow-xl" alt="Indietro" />
                    </button>
                    
                    <button 
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-14 h-14 md:w-20 md:h-20 rounded-full border-4 transition-all flex items-center justify-center shadow-xl active:scale-95 ${soundEnabled ? 'bg-yellow-400 border-yellow-600 text-black' : 'bg-slate-700 border-slate-900 text-slate-400'}`}
                    >
                        {soundEnabled ? <Volume2 size={28} strokeWidth={3} /> : <VolumeX size={28} strokeWidth={3} />}
                    </button>
                </div>

                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl pointer-events-auto">
                    <span>{tokens}</span> <TokenIcon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
            </div>

            {/* RobotHint FISSO DURANTE IL GIOCO */}
            <RobotHint 
                show={true} 
                message={"STOPPA IL TIMER\nAL MOMENTO GIUSTO\n(VINCI 30 GETTONI)"} 
                variant="YELLOW" 
            />

            {/* MAIN GAME AREA - Alzato per evitare sovrapposizioni con UI inferiore */}
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center px-4 pt-28 md:pt-32">
                
                {/* TARGET BOX */}
                <div className="w-[90%] max-w-md bg-yellow-400 rounded-[2.5rem] border-[6px] border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-1 mb-3 animate-in slide-in-from-top duration-700">
                    <span className="text-black font-black uppercase tracking-widest text-[10px] md:text-xs">OBIETTIVO</span>
                    <div className="lcd-container">
                        <div className="lcd-font text-4xl md:text-6xl lcd-ghost" dangerouslySetInnerHTML={{ __html: getFixedTimeHTML("88:88:88") }}></div>
                        <div className={`lcd-font text-4xl md:text-6xl glow-red lcd-actual ${hasWon ? 'animate-flash' : ''}`} dangerouslySetInnerHTML={{ __html: getFixedTimeHTML(formatTime(targetTime)) }}></div>
                    </div>
                </div>

                {/* MESSAGGI DI STATO - Spostati tra i due box per massima visibilità */}
                <div className="h-16 md:h-24 flex items-center justify-center w-full my-2">
                    {gameState === 'FINISHED' && (
                        <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                            {hasWon ? (
                                <div className="flex flex-col items-center">
                                    <p className="text-cartoon-yellow text-2xl md:text-5xl uppercase tracking-tighter text-center leading-tight whitespace-nowrap">
                                        CHE RIFLESSI! SEI UN FENOMENO!
                                    </p>
                                    <div className="bg-yellow-400 text-black font-black px-6 py-2 rounded-2xl border-4 border-black shadow-[4px_4px_0_black] animate-bounce flex items-center gap-2 text-lg md:text-xl mt-4">
                                        <Trophy size={20} /> +30 <TokenIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-cartoon-yellow text-3xl md:text-5xl uppercase tracking-tighter text-center">
                                    {isVeryClose ? "DAIII! PER POCHISSIMO!" : "QUASI, RIPROVA!"}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* RUNNING TIMER BOX */}
                <div className="w-[90%] max-w-md bg-yellow-400 rounded-[2.5rem] border-[6px] border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-1 animate-in slide-in-from-bottom duration-700">
                    <span className="text-black font-black uppercase tracking-widest text-[10px] md:text-xs">IL TUO TEMPO</span>
                    <div className="lcd-container">
                        <div className="lcd-font text-4xl md:text-6xl lcd-ghost" dangerouslySetInnerHTML={{ __html: getFixedTimeHTML("88:88:88") }}></div>
                        <div 
                            ref={timerDisplayRef}
                            className={`lcd-font text-4xl md:text-6xl glow-green lcd-actual ${hasWon ? 'animate-flash' : ''}`}
                            dangerouslySetInnerHTML={{ __html: getFixedTimeHTML(formatTime(lastElapsedRef.current)) }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* CONTROLS - Immagini S3 */}
            <div className="absolute bottom-12 left-8 md:left-16 z-[60]">
                {gameState === 'IDLE' && (
                    <button 
                        onClick={handleStart}
                        className="hover:scale-110 active:scale-95 transition-transform outline-none"
                    >
                        <img src={BTN_VIA_IMG} alt="VIA" className="w-24 h-auto md:w-36 drop-shadow-2xl" />
                    </button>
                )}

                {gameState === 'RUNNING' && (
                    <button 
                        onClick={handleStop}
                        className="hover:scale-110 active:scale-95 transition-transform outline-none"
                    >
                        <img src={BTN_STOP_IMG} alt="STOP" className="w-24 h-auto md:w-36 drop-shadow-2xl" />
                    </button>
                )}

                {gameState === 'FINISHED' && (
                    <button 
                        onClick={handleReset}
                        className="hover:scale-110 active:scale-95 transition-transform outline-none"
                    >
                        <img src={BTN_ANCORA_IMG} alt="ANCORA" className="w-24 h-auto md:w-36 drop-shadow-2xl" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default StopwatchGame;