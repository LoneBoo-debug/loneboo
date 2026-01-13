import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { Volume2, VolumeX, Settings, Copy, X, Move, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Plus, Minus, Mic, MicOff } from 'lucide-react';

const SOCCER_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/soccergym4453.webp';
const BTN_EXIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/polkiuj88+(1)+(1).webp';
const BTN_START_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/calcioindieir553f4.webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const BALL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/41932balldsed.webp';
const OPENING_MODAL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/portcaldjf44223.webp';

// --- ASSET PULSANTI E UI ---
const BTN_LEFT_IMG_SOCCER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/jgruhr75h5jt5.webp';
const BTN_CENTER_IMG_SOCCER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/centersarroed453.webp';
const BTN_RIGHT_IMG_SOCCER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/defresde543f453e.webp';
const ANDREA_UI_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/glhgkuf+(1)adrea.webp';
const ANDREA_SUCCESS_DRIB_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/andredribbkiok89.webp';
const ANDREA_WIN_GOAL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/exultadnre44+(1).webp';

// --- ASSET ROMUALDO ---
const ROMUALDO_GOALIE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/portiererond+(1).webp';
const ROMUALDO_DEF_LEFT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/okij887hhy65+(1).webp';
const ROMUALDO_DEF_CENTER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diferomugoal77+(1).webp';
const ROMUALDO_DEF_RIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rondjfek773jdkei4+(1)+(1).webp';

const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/football-sports-music-347944.mp3';
const GOAL_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/goal-2244502.mp3';
const WHISTLE_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/referee-whistle-blow-gymnasium-6320.mp3';

type Position = 'LEFT' | 'CENTER' | 'RIGHT';
type GamePhase = 'START' | 'DRIBBLING' | 'D_RESULT' | 'SHOOTING' | 'G_RESULT' | 'WON' | 'LOST';

interface Point { x: number; y: number; }

const POSITIONS: Record<string, Point> = {
    START: { x: 50, y: 85 },
    DRIBBLING: { x: 50, y: 72 }, 
    GOAL: { x: 50, y: 52 }      
};

interface CalibData { x: number; y: number; scale: number; }

const INITIAL_CALIB: Record<string, CalibData> = {
  "LEFT": { "x": -83, "y": -106.5, "scale": 14.5 },
  "CENTER": { "x": 1, "y": -107, "scale": 14.5 },
  "RIGHT": { "x": 83, "y": -109.5, "scale": 14.5 },
  "GOALIE_CENTER": { "x": 5, "y": -72, "scale": 9.5 },
  "GOALIE_LEFT": { "x": -100, "y": -72, "scale": 9.5 },
  "GOALIE_RIGHT": { "x": 110, "y": -72, "scale": 9.5 },
  "BALL_START": { "x": 30, "y": 30, "scale": 12 },
  "BALL_DL": { "x": -130, "y": -48, "scale": 10 },
  "BALL_DC": { "x": 5, "y": -33, "scale": 10 },
  "BALL_DR": { "x": 130, "y": -43, "scale": 10 },
  "BALL_GL": { "x": -130, "y": 0, "scale": 8 },
  "BALL_GC": { "x": 0, "y": 20, "scale": 8 },
  "BALL_GD": { "x": 120, "y": 5, "scale": 8 }
};

const SchoolGymSoccer: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [phase, setPhase] = useState<GamePhase>('START');
    const [score, setScore] = useState({ player: 0, opponent: 0 });
    const [message, setMessage] = useState('');
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [sfxEnabled, setSfxEnabled] = useState(true);
    const [isBallMoving, setIsBallMoving] = useState(false);
    const [ballHasArrived, setBallHasArrived] = useState(false);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const goalSfxRef = useRef<HTMLAudioElement | null>(null);
    const whistleSfxRef = useRef<HTMLAudioElement | null>(null);

    const [isCalibrating, setIsCalibrating] = useState(false);
    const [calibKey, setCalibKey] = useState<string>('CENTER');
    const [calibValues, setCalibValues] = useState(INITIAL_CALIB);
    const [vsClicks, setVsClicks] = useState(0);
    const [calibPanelPos, setCalibPanelPos] = useState({ x: 20, y: 150 });
    const isDraggingPanel = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const [currentBallState, setCurrentBallState] = useState<string>('BALL_START');
    const [currentOpponentState, setCurrentOpponentState] = useState<string>('CENTER');

    useEffect(() => {
        bgMusicRef.current = new Audio(BG_MUSIC_URL);
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.3;
        
        goalSfxRef.current = new Audio(GOAL_SOUND_URL);
        goalSfxRef.current.volume = 0.6;

        whistleSfxRef.current = new Audio(WHISTLE_SOUND_URL);
        whistleSfxRef.current.volume = 0.5;
        
        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
            if (goalSfxRef.current) {
                goalSfxRef.current.pause();
                goalSfxRef.current = null;
            }
            if (whistleSfxRef.current) {
                whistleSfxRef.current.pause();
                whistleSfxRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (bgMusicRef.current) {
            if (musicEnabled && phase !== 'START' && phase !== 'WON' && phase !== 'LOST' && !isCalibrating) {
                bgMusicRef.current.play().catch(() => {});
            } else {
                bgMusicRef.current.pause();
            }
        }
    }, [musicEnabled, phase, isCalibrating]);

    const playGoalSound = () => {
        if (sfxEnabled && goalSfxRef.current) {
            goalSfxRef.current.currentTime = 0;
            goalSfxRef.current.play().catch(() => {});
        }
    };

    const playWhistleSound = () => {
        if (sfxEnabled && whistleSfxRef.current) {
            whistleSfxRef.current.currentTime = 0;
            whistleSfxRef.current.play().catch(() => {});
        }
    };

    const handleDribble = (pos: Position) => {
        if (phase !== 'DRIBBLING' || isCalibrating) return;
        
        const aiOptions: Position[] = ['LEFT', 'CENTER', 'RIGHT'];
        const aiChoice = aiOptions[Math.floor(Math.random() * aiOptions.length)];
        
        setPhase('D_RESULT');
        setCurrentOpponentState(aiChoice);
        
        setIsBallMoving(true);
        setBallHasArrived(false);
        const ballKey = `BALL_D${pos === 'LEFT' ? 'L' : pos === 'CENTER' ? 'C' : 'R'}`;
        setCurrentBallState(ballKey);
        
        setTimeout(() => {
            setIsBallMoving(false);
            setBallHasArrived(true);
        }, 800);

        setTimeout(() => {
            if (pos === aiChoice) {
                setMessage('INTERCETTATA!');
                // Il punteggio non cambia durante il dribbling
                setTimeout(resetRound, 2000);
            } else {
                setMessage('DRIBBLING RIUSCITO!');
                setTimeout(() => {
                    setMessage('');
                    setPhase('SHOOTING');
                    setCurrentOpponentState('GOALIE_CENTER');
                    setBallHasArrived(false);
                    setCurrentBallState('BALL_DC'); 
                    setTimeout(playWhistleSound, 2000);
                }, 2000);
            }
        }, 1200);
    };

    const handleShoot = (pos: Position) => {
        if (phase !== 'SHOOTING' || isCalibrating) return;

        const aiOptions: Position[] = ['LEFT', 'CENTER', 'RIGHT'];
        const aiChoice = aiOptions[Math.floor(Math.random() * aiOptions.length)];

        setPhase('G_RESULT');
        
        const goalieTarget = `GOALIE_${aiChoice}`;
        setCurrentOpponentState(goalieTarget);
        
        setIsBallMoving(true);
        setBallHasArrived(false);
        const ballKey = `BALL_G${pos === 'LEFT' ? 'L' : pos === 'CENTER' ? 'C' : 'D'}`;
        setCurrentBallState(ballKey);
        
        setTimeout(() => {
            setIsBallMoving(false);
            setBallHasArrived(true);
        }, 800);

        setTimeout(() => {
            if (pos === aiChoice) {
                setMessage('PARATA!');
                // Romualdo prende un punto se para un tiro
                setScore(s => ({ ...s, opponent: s.opponent + 1 }));
                setTimeout(resetRound, 2000);
            } else {
                setMessage('Goal!!');
                playGoalSound();
                // Andrea prende un punto se segna
                setScore(s => ({ ...s, player: s.player + 1 }));
                setTimeout(resetRound, 3000);
            }
        }, 1200);
    };

    const resetRound = () => {
        setCurrentBallState('BALL_START');
        setCurrentOpponentState('CENTER');
        setBallHasArrived(false);
        setMessage('');
        setIsBallMoving(false);
        
        setScore(currentScore => {
            if (currentScore.player >= 10) setPhase('WON');
            else if (currentScore.opponent >= 10) setPhase('LOST');
            else setPhase('DRIBBLING');
            return currentScore;
        });
    };

    const startGame = () => {
        setScore({ player: 0, opponent: 0 });
        setPhase('DRIBBLING');
        setCurrentBallState('BALL_START');
        setCurrentOpponentState('CENTER');
        setBallHasArrived(false);
        setMessage('');
        setIsBallMoving(false);
        setTimeout(playWhistleSound, 2000);
    };

    const getOpponentImg = () => {
        const key = isCalibrating ? (calibKey.startsWith('BALL_') ? 'CENTER' : calibKey) : currentOpponentState;
        if (key.startsWith('GOALIE')) return ROMUALDO_GOALIE;
        if (key === 'LEFT') return ROMUALDO_DEF_LEFT;
        if (key === 'RIGHT') return ROMUALDO_DEF_RIGHT;
        return ROMUALDO_DEF_CENTER;
    };

    const handleVsClick = () => {
        const next = vsClicks + 1;
        if (next >= 5) {
            setIsCalibrating(!isCalibrating);
            setVsClicks(0);
        } else {
            setVsClicks(next);
        }
    };

    const updateCalib = (key: string, field: keyof CalibData, delta: number) => {
        setCalibValues(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: Number((prev[key][field] + delta).toFixed(2))
            }
        }));
    };

    const handlePanelMouseDown = (e: React.MouseEvent) => {
        isDraggingPanel.current = true;
        dragOffset.current = {
            x: e.clientX - calibPanelPos.x,
            y: e.clientY - calibPanelPos.y
        };
    };

    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDraggingPanel.current) {
                setCalibPanelPos({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
        };
        const handleGlobalMouseUp = () => {
            isDraggingPanel.current = false;
        };
        window.addEventListener('mousemove', handleGlobalMouseMove);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    const copyCalib = () => {
        const json = JSON.stringify(calibValues, null, 2);
        navigator.clipboard.writeText(json);
        alert("Configurazione copiata negli appunti!");
    };

    const getBasePos = (key: string) => {
        if (key.includes('_G')) return POSITIONS.GOAL;
        if (key.includes('_D')) return POSITIONS.DRIBBLING;
        return POSITIONS.START;
    };

    const isGoalCelebration = message === 'Goal!!';

    return (
        <div className="fixed inset-0 z-0 bg-sky-900 overflow-hidden touch-none select-none">
            <style>{`
                .lucky-font { font-family: 'Luckiest Guy', cursive; }
                .text-stroke { -webkit-text-stroke: 2px black; text-shadow: 4px 4px 0px rgba(0,0,0,0.3); }
                @keyframes ball-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes ball-bounce-once {
                    0%, 100% { transform: translate(-50%, -50%) scale(var(--s)) translate(var(--x), var(--y)); }
                    50% { transform: translate(-50%, -50%) scale(var(--s)) translate(var(--x), calc(var(--y) - 30px)); }
                }
                .animate-ball { animation: ball-spin 0.5s linear infinite; }
                .animate-bounce-arrival { animation: ball-bounce-once 0.4s ease-out 1; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

            {/* BACKGROUND */}
            <img src={SOCCER_BG} alt="" className="absolute inset-0 w-full h-full object-fill opacity-60" />

            {/* UI SUPERIORE */}
            <div className="relative z-50 w-full pt-[75px] md:pt-[105px] px-4 flex justify-between items-center pointer-events-none">
                <button 
                    onClick={() => setView(AppView.SCHOOL_GYM)} 
                    className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none w-[24vw] md:w-[12vw] max-w-[200px]"
                >
                    <img src={BTN_EXIT_IMG} alt="Torna" className="w-full h-auto drop-shadow-xl" />
                </button>

                <div 
                    onClick={handleVsClick}
                    className="pointer-events-auto cursor-pointer bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-2xl border-4 border-slate-700 shadow-2xl flex items-center gap-4 md:gap-6"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase opacity-60">ANDREA</span>
                        <span className="text-2xl md:text-4xl font-black text-blue-500">{score.player}</span>
                    </div>
                    <span className="text-yellow-400 font-black text-sm md:text-xl italic">VS</span>
                    <div className="flex flex-col items-center">
                        <span className="text-white font-black text-[8px] md:text-[10px] uppercase opacity-60">ROMUALDO</span>
                        <span className="text-2xl md:text-4xl font-black text-red-500">{score.opponent}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    <button onClick={() => setMusicEnabled(!musicEnabled)} className="bg-slate-800/80 p-2 rounded-xl border-2 border-slate-600 text-white shadow-xl active:scale-95">
                        {musicEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>
                    <button onClick={() => setSfxEnabled(!sfxEnabled)} className={`bg-slate-800/80 w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-slate-600 flex items-center justify-center shadow-xl active:scale-95 transition-all ${!sfxEnabled ? 'opacity-50 grayscale' : ''}`}>
                        <span className={`font-black text-xs md:text-sm uppercase ${sfxEnabled ? 'text-yellow-400' : 'text-gray-400'}`}>FX</span>
                    </button>
                </div>
            </div>

            {/* AREA DI GIOCO */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                
                {/* MESSAGGI CENTRALI */}
                {message && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] animate-in zoom-in duration-300`}>
                        {message === 'Goal!!' || message === 'PARATA!' ? (
                            <div className="flex flex-col items-center gap-4 md:gap-6 -translate-x-24 md:-translate-x-48">
                                <h2 className={`text-7xl md:text-[10rem] lucky-font text-stroke uppercase text-center whitespace-nowrap ${message === 'Goal!!' ? 'text-yellow-400' : 'text-red-500'}`}>
                                    {message}
                                </h2>
                            </div>
                        ) : message === 'INTERCETTATA!' ? (
                            <h2 className="text-4xl md:text-7xl lucky-font text-stroke uppercase text-center whitespace-nowrap text-red-500">
                                {message}
                            </h2>
                        ) : message === 'DRIBBLING RIUSCITO!' ? (
                            <div className="flex flex-col items-center gap-4 md:gap-6">
                                <img 
                                    src={ANDREA_SUCCESS_DRIB_IMG} 
                                    className="w-48 h-48 md:w-[480px] md:h-[480px] object-contain drop-shadow-2xl" 
                                    alt=""
                                />
                                <h2 className="text-5xl md:text-8xl lucky-font text-stroke uppercase text-center leading-none text-yellow-400">
                                    DRIBBLING<br/>RIUSCITO!
                                </h2>
                            </div>
                        ) : (
                            <h2 className="text-6xl md:text-9xl lucky-font text-stroke uppercase text-center whitespace-nowrap text-red-500">
                                {message}
                            </h2>
                        )}
                    </div>
                )}

                {/* ROMUALDO (AVVERSARIO) */}
                {(() => {
                    const key = isCalibrating ? (calibKey.startsWith('BALL_') ? 'CENTER' : calibKey) : currentOpponentState;
                    const base = key.startsWith('GOALIE') ? POSITIONS.GOAL : POSITIONS.DRIBBLING;
                    const c = calibValues[key] || INITIAL_CALIB['CENTER'];
                    return (
                        <div 
                            className="absolute z-20 transition-all duration-500 ease-out"
                            style={{ 
                                left: `${base.x}%`, 
                                top: `${base.y}%`,
                                transform: `translate(-50%, -50%) scale(${c.scale / 10}) translate(${c.x}px, ${c.y}px)`
                            }}
                        >
                            <img src={getOpponentImg()} className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-2xl" />
                        </div>
                    );
                })()}

                {/* ANDREA (GIOCATORE NEL CAMPO) */}
                {(() => {
                    // Nota: Utilizziamo le stesse coordinate di base ma con logica di transizione
                    // In questo componente Andrea è gestito all'interno della mascotte UI per semplicità visiva,
                    // ma qui aggiungiamo un'istanza nel campo se necessaria per la calibrazione futura.
                    // Per ora ricalibriamo la visualizzazione nel blocco dei controlli.
                    return null; 
                })()}

                {/* BALL */}
                {(() => {
                    // FIX: Replaced self-referential 'key' with 'calibKey' to avoid 'used before declaration' error
                    const key = isCalibrating ? (calibKey.startsWith('BALL_') ? calibKey : 'BALL_START') : currentBallState;
                    const base = getBasePos(key);
                    const c = calibValues[key] || INITIAL_CALIB['BALL_START'];
                    return (
                        <div 
                            className={`absolute z-40 transition-all duration-[800ms] linear ${isBallMoving ? 'animate-ball' : ''} ${ballHasArrived && !isCalibrating ? 'animate-bounce-arrival' : ''}`}
                            style={{ 
                                left: `${base.x}%`, 
                                top: `${base.y}%`, 
                                transform: `translate(-50%, -50%) scale(${c.scale / 10}) translate(${c.x}px, ${c.y}px)`,
                                // @ts-ignore - variabili CSS per l'animazione bounce
                                '--x': `${c.x}px`,
                                '--y': `${c.y}px`,
                                '--s': c.scale / 10
                            }}
                        >
                            <img src={BALL_IMG} className="w-12 h-12 md:w-20 md:h-20 drop-shadow-lg" />
                        </div>
                    );
                })()}
            </div>

            {/* CONTROLLI DI GIOCO */}
            {!isCalibrating && (
                <div className="absolute bottom-2 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none px-4">
                    <div className="flex items-center justify-center gap-4 md:gap-12 w-full max-w-5xl">
                        {/* GRUPPO PULSANTI SCELTA (A SINISTRA) */}
                        <div className="flex gap-4 md:gap-8 pointer-events-auto items-center mb-2">
                            {(['LEFT', 'CENTER', 'RIGHT'] as Position[]).map(pos => (
                                <button 
                                    key={pos} 
                                    onClick={() => phase === 'DRIBBLING' ? handleDribble(pos) : handleShoot(pos)} 
                                    className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-2xl"
                                >
                                    <img 
                                        src={pos === 'LEFT' ? BTN_LEFT_IMG_SOCCER : pos === 'CENTER' ? BTN_CENTER_IMG_SOCCER : BTN_RIGHT_IMG_SOCCER} 
                                        alt={pos} 
                                        className="w-16 h-16 md:w-32 md:h-32 object-contain"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* MASCOTTE DINAMICA (ANDREA) A DESTRA */}
                        <div className={`pointer-events-none shrink-0 transition-all duration-700 ease-in-out ${(phase === 'SHOOTING' || phase === 'G_RESULT') ? 'translate-y-[-160px] md:translate-y-[-280px] -translate-x-8 md:-translate-x-16 scale-90' : 'translate-y-4 scale-100'}`}>
                            <div className="relative w-32 md:w-72 h-auto flex justify-center items-center">
                                {/* Immagine Normale */}
                                <img 
                                    src={ANDREA_UI_IMG} 
                                    alt="Andrea" 
                                    className={`w-full h-auto drop-shadow-2xl transition-opacity duration-500 ${isGoalCelebration ? 'opacity-0' : 'opacity-100'}`} 
                                />
                                {/* Immagine Esultante (Crossfade) - Aumentata leggermente la scala a 1.45 */}
                                <img 
                                    src={ANDREA_WIN_GOAL_IMG} 
                                    alt="Andrea Vince" 
                                    className={`absolute inset-0 w-full h-auto drop-shadow-2xl transition-all duration-500 ${isGoalCelebration ? 'opacity-100 scale-[1.45]' : 'opacity-0 scale-100'}`} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CALIBRATORE FLOATING PANEL */}
            {isCalibrating && (
                <div 
                    className="fixed z-[200] bg-slate-800/95 border-4 border-yellow-500 rounded-3xl shadow-2xl overflow-hidden w-72 md:w-96 flex flex-col"
                    style={{ left: calibPanelPos.x, top: calibPanelPos.y }}
                >
                    <div 
                        onMouseDown={handlePanelMouseDown}
                        className="bg-slate-900 p-3 flex justify-between items-center cursor-move"
                    >
                        <span className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                            <Move size={14} className="text-yellow-500" /> Calibratore Pro
                        </span>
                        <button onClick={() => setIsCalibrating(false)} className="text-red-500 hover:scale-110"><X size={20} /></button>
                    </div>

                    <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto no-scrollbar pointer-events-auto">
                        <div className="flex flex-col gap-2">
                            <span className="text-white font-black text-[10px] uppercase opacity-50">Personaggi</span>
                            <div className="grid grid-cols-4 gap-1">
                                {['LEFT', 'CENTER', 'RIGHT', 'GOALIE_CENTER', 'GOALIE_LEFT', 'GOALIE_RIGHT'].map(k => (
                                    <button key={k} onClick={() => setCalibKey(k)} className={`text-[8px] font-black py-2 rounded-lg border-2 ${calibKey === k ? 'bg-yellow-400 border-yellow-600 text-black' : 'bg-slate-700 border-slate-600 text-white'}`}>
                                        {k.replace('GOALIE_', 'G_')}
                                    </button>
                                ))}
                            </div>
                            
                            <span className="text-white font-black text-[10px] uppercase opacity-50 mt-2">Palla</span>
                            <div className="grid grid-cols-4 gap-1">
                                {['BALL_START', 'BALL_DL', 'BALL_DC', 'BALL_DR', 'BALL_GL', 'BALL_GC', 'BALL_GD'].map(k => (
                                    <button key={k} onClick={() => setCalibKey(k)} className={`text-[7px] font-black py-2 rounded-lg border-2 ${calibKey === k ? 'bg-cyan-400 border-cyan-600 text-black' : 'bg-slate-700 border-slate-600 text-white'}`}>
                                        {k.replace('BALL_', '')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-black text-xs w-16">X: {calibValues[calibKey]?.x || 0}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => updateCalib(calibKey, 'x', -5)} className="bg-slate-700 p-1.5 rounded-lg text-white"><ChevronLeft size={16}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'x', -0.5)} className="bg-slate-700 p-1.5 rounded-lg text-white opacity-60"><ChevronLeft size={12}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'x', 0.5)} className="bg-slate-700 p-1.5 rounded-lg text-white opacity-60"><ChevronRight size={12}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'x', 5)} className="bg-slate-700 p-1.5 rounded-lg text-white"><ChevronRight size={16}/></button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white font-black text-xs w-16">Y: {calibValues[calibKey]?.y || 0}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => updateCalib(calibKey, 'y', -5)} className="bg-slate-700 p-1.5 rounded-lg text-white"><ChevronUp size={16}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'y', -0.5)} className="bg-slate-700 p-1.5 rounded-lg text-white opacity-60"><ChevronUp size={12}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'y', 0.5)} className="bg-slate-700 p-1.5 rounded-lg text-white opacity-60"><ChevronDown size={12}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'y', 5)} className="bg-slate-700 p-1.5 rounded-lg text-white"><ChevronDown size={16}/></button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white font-black text-xs w-16">SIZE: {calibValues[calibKey]?.scale || 0}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => updateCalib(calibKey, 'scale', -1)} className="bg-slate-700 p-1.5 rounded-lg text-white"><Minus size={16}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'scale', -0.1)} className="bg-slate-700 p-1.5 rounded-lg text-white opacity-60"><Minus size={12}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'scale', 0.1)} className="bg-slate-700 p-1.5 rounded-lg text-white opacity-60"><Plus size={12}/></button>
                                    <button onClick={() => updateCalib(calibKey, 'scale', 1)} className="bg-slate-700 p-1.5 rounded-lg text-white"><Plus size={16}/></button>
                                </div>
                            </div>
                        </div>

                        <button onClick={copyCalib} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 text-xs uppercase">
                            <Copy size={16} /> Copia JSON
                        </button>
                    </div>
                </div>
            )}

            {/* MODALI START E FINE */}
            {phase === 'START' && !isCalibrating && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white p-6 md:p-10 rounded-[40px] border-8 border-green-600 shadow-2xl text-center max-sm flex flex-col items-center pointer-events-auto">
                        <img src={OPENING_MODAL_IMG} alt="Soccer" className="w-48 h-48 md:w-64 md:h-64 object-contain mb-4 drop-shadow-xl" />
                        <h2 className="text-2xl md:text-3xl font-black text-blue-900 mb-2 uppercase leading-tight font-luckiest">Sfida a Calcio!</h2>
                        <p className="text-gray-600 font-bold mb-8 text-sm md:text-base px-2">Dribbla Romualdo e fai goal! Vince chi arriva a <span className="text-green-600">10 punti</span>.</p>
                        <button onClick={startGame} className="hover:scale-105 active:scale-95 transition-all outline-none">
                            <img src={BTN_START_IMG} alt="Inizia" className="w-32 md:w-48 h-auto drop-shadow-xl" />
                        </button>
                    </div>
                </div>
            )}

            {(phase === 'WON' || phase === 'LOST') && !isCalibrating && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in zoom-in duration-300">
                    <div className="bg-white rounded-[40px] border-8 border-yellow-400 p-6 md:p-8 w-full max-w-sm text-center shadow-2xl flex flex-col items-center relative pointer-events-auto">
                        <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 lucky-font text-stroke ${phase === 'WON' ? 'text-blue-500' : 'text-red-500'}`}>
                            {phase === 'WON' ? 'CAMPIONE!' : 'PECCATO!'}
                        </h2>
                        <p className="text-gray-600 font-bold mb-8 text-lg">{phase === 'WON' ? 'Hai vinto la partita!' : 'Romualdo ha vinto... riprova!'}</p>
                        <div className="flex gap-4">
                            <button onClick={startGame} className="hover:scale-105 active:scale-95 transition-all outline-none">
                                <img src={BTN_PLAY_AGAIN_IMG} alt="Rigioca" className="w-32 md:w-40 h-auto" />
                            </button>
                            <button onClick={() => setView(AppView.SCHOOL_GYM)} className="hover:scale-105 active:scale-95 transition-all outline-none">
                                <img src={BTN_EXIT_IMG} alt="Esci" className="w-32 md:w-40 h-auto" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolGymSoccer;