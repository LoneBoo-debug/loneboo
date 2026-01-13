import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { Shield, Star, Swords, ShieldAlert, Check, Volume2, VolumeX, X, Trophy, Dumbbell, Timer } from 'lucide-react';
import { addTokens } from '../services/tokens';

const BASKET_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bsktscholgym8822.webp';
const BTN_EXIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/polkiuj88+(1)+(1).webp';
const BTN_START_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/inziiadadfoed453.webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';

// --- ASSET VITTORIA FINALE ---
const IMG_GAIA_WIN_HEADER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaiawindseer4533+(1).webp';
const IMG_GIORDANO_WIN_HEADER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/jordewin543.webp';

// --- ASSET PERSONAGGI E MODALI ---
const PLAYER_IDLE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/jdjdd+(1).webp'; // Gaia
const OPPONENT_IDLE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/resystrd+(1).webp'; // Giordano

const IMG_STOPPATA_GIORDANO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stopatagiordnabs44+(1).webp';
const IMG_BLOCK_GAIA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/blcokgaiavfd541.webp';
const IMG_CANESTRO_GAIA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/oiuhojk+(1).webp';
const IMG_CANESTRO_GIORDANO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ghdejhejdn+(1).webp';

const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/instagram-reels-basketball-music-286233.mp3';
const DRIBBLING_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/basketball-67403.mp3';

type MoveId = 'LEFT' | 'CENTER' | 'RIGHT';

const GAIA_OFFENSE_MOVES: Record<MoveId, string> = {
    LEFT: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ladestrgsia+(1).webp',
    CENTER: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cen+tralgaia+bsake44+(1).webp',
    RIGHT: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/refrefref+(1)4454.webp'
};

const GAIA_DEFENSE_MOVES: Record<MoveId, string> = {
    LEFT: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ChatGPT+Image+12+gen+2026%2C+10_54_37+(1).webp',
    CENTER: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nygh654ffr54+(1).webp',
    RIGHT: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/utyuuytg88yg+(1).webp'
};

const GIORDANO_OFFENSE_MOVES: Record<MoveId, string> = {
    LEFT: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/juhy778yg+(1).webp',
    CENTER: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/jyuju778+(1).webp',
    RIGHT: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ukikju999iju+(1).webp'
};

const GIORDANO_DEFENSE_MOVES: Record<MoveId, string> = {
    LEFT: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sinisgiordanva66.webp',
    CENTER: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/centergiorda66+(1).webp',
    RIGHT: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giordversosix+(1).webp'
};

const LANE_POSITIONS: Record<MoveId, string> = {
    LEFT: 'left-[15%] md:left-[20%]',
    CENTER: 'left-[50%]',
    RIGHT: 'left-[85%] md:left-[80%]'
};

const WINNING_SCORE = 10;

// --- CALIBRAZIONE DEFINITIVA ---
interface CalibParams { scale: number; x: number; y: number; }
type CalibSet = Record<MoveId, CalibParams>;

const CALIB_DATA: Record<string, CalibSet> = {
    'GAIA_OFF': {
      "LEFT": { "scale": 1.4, "x": 19, "y": 34 },
      "CENTER": { "scale": 1.5, "x": 0, "y": 39 },
      "RIGHT": { "scale": 3.2, "x": -11, "y": 12 }
    },
    'GAIA_DEF': {
      "LEFT": { "scale": 1.5, "x": 43, "y": 0 },
      "CENTER": { "scale": 1.4, "x": 1, "y": -2 },
      "RIGHT": { "scale": 2, "x": -18, "y": 0 }
    },
    'GIORDANO_OFF': {
      "LEFT": { "scale": 1.8, "x": 34, "y": 7 },
      "CENTER": { "scale": 1.5, "x": 4, "y": 40 },
      "RIGHT": { "scale": 2.8, "x": -5, "y": 15 }
    },
    'GIORDANO_DEF': {
      "LEFT": { "scale": 1.5, "x": 35, "y": 0 },
      "CENTER": { "scale": 1.4, "x": 0, "y": 0 },
      "RIGHT": { "scale": 3.2, "x": -19, "y": 0 }
    }
};

const SchoolGymBasket: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'ANIMATING' | 'RESOLUTION' | 'WON' | 'LOST'>('START');
    const [turn, setTurn] = useState<'PLAYER' | 'AI'>('PLAYER'); 
    const [scores, setScores] = useState({ gaia: 0, giordano: 0 });
    
    const [lastPlayerMove, setLastPlayerMove] = useState<MoveId | null>(null);
    const [lastAiMove, setLastAiMove] = useState<MoveId | null>(null);
    const [flickerMove, setFlickerMove] = useState<MoveId>('CENTER');
    const [isActionSuccess, setIsActionSuccess] = useState<boolean | null>(null);
    const [isFlickering, setIsFlickering] = useState(false);
    const [flickerOpacity, setFlickerOpacity] = useState(1);
    
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [sfxEnabled, setSfxEnabled] = useState(true);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const dribbleSfxRef = useRef<HTMLAudioElement | null>(null);

    // Inizializzazione Musica e SFX
    useEffect(() => {
        bgMusicRef.current = new Audio(BG_MUSIC_URL);
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.4;

        dribbleSfxRef.current = new Audio(DRIBBLING_SOUND_URL);
        dribbleSfxRef.current.loop = true;
        dribbleSfxRef.current.volume = 0.25;

        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
            if (dribbleSfxRef.current) {
                dribbleSfxRef.current.pause();
                dribbleSfxRef.current = null;
            }
        };
    }, []);

    // Controllo riproduzione suoni (Musica e Palleggio)
    useEffect(() => {
        const isGameRunning = gameState !== 'START' && gameState !== 'WON' && gameState !== 'LOST';
        
        if (bgMusicRef.current) {
            if (musicEnabled && isGameRunning) {
                bgMusicRef.current.play().catch(e => console.log("Audio play blocked", e));
            } else {
                bgMusicRef.current.pause();
            }
        }

        if (dribbleSfxRef.current) {
            if (sfxEnabled && isGameRunning) {
                dribbleSfxRef.current.play().catch(e => console.log("SFX play blocked", e));
            } else {
                dribbleSfxRef.current.pause();
            }
        }
    }, [musicEnabled, sfxEnabled, gameState]);

    // Gestione Spostamento "Sequenziale" durante animazione (Pattugliamento 4 secondi)
    useEffect(() => {
        let cycleInterval: any;
        const runCycle = async () => {
            if (!isFlickering) return;
            const sequence: MoveId[] = ['LEFT', 'CENTER', 'RIGHT', 'CENTER'];
            let step = 0;
            cycleInterval = setInterval(async () => {
                setFlickerOpacity(0);
                setTimeout(() => {
                    setFlickerMove(sequence[step % sequence.length]);
                    step++;
                    setFlickerOpacity(1);
                }, 250);
            }, 800); 
        };
        if (isFlickering) runCycle(); else setFlickerOpacity(1);
        return () => clearInterval(cycleInterval);
    }, [isFlickering]);

    const handleAction = (moveId: MoveId) => {
        if (gameState !== 'PLAYING') return;

        const aiOptions: MoveId[] = ['LEFT', 'CENTER', 'RIGHT'];
        const aiMove = aiOptions[Math.floor(Math.random() * aiOptions.length)];
        
        setLastPlayerMove(moveId);
        setLastAiMove(aiMove);
        setGameState('ANIMATING');
        setIsFlickering(true);

        setTimeout(() => {
            setIsFlickering(false);
            setFlickerOpacity(0);
            setTimeout(() => {
                setFlickerMove(aiMove); // L'IA si ferma sulla sua scelta finale
                setFlickerOpacity(1);

                setTimeout(() => {
                    const success = turn === 'PLAYER' ? (moveId !== aiMove) : (aiMove !== moveId);
                    setIsActionSuccess(success);
                    setGameState('RESOLUTION');

                    setTimeout(() => {
                        if (turn === 'PLAYER') {
                            if (success) {
                                setScores(prev => {
                                    const newGaia = prev.gaia + 1;
                                    if (newGaia >= WINNING_SCORE) setGameState('WON');
                                    else { setGameState('PLAYING'); setLastPlayerMove(null); setLastAiMove(null); }
                                    return { ...prev, gaia: newGaia };
                                });
                            } else {
                                setTurn('AI'); setGameState('PLAYING'); setLastPlayerMove(null); setLastAiMove(null);
                            }
                        } else {
                            if (success) {
                                setScores(prev => {
                                    const newGiordano = prev.giordano + 1;
                                    if (newGiordano >= WINNING_SCORE) setGameState('LOST');
                                    else { setGameState('PLAYING'); setLastPlayerMove(null); setLastAiMove(null); }
                                    return { ...prev, giordano: newGiordano };
                                });
                            } else {
                                setTurn('PLAYER'); setGameState('PLAYING'); setLastPlayerMove(null); setLastAiMove(null);
                            }
                        }
                        setIsActionSuccess(null);
                    }, 3000); 

                }, 2000); 
            }, 50); 
        }, 3200); 
    };

    const startNewGame = () => {
        setScores({ gaia: 0, giordano: 0 });
        setTurn('PLAYER');
        setGameState('PLAYING');
        setIsActionSuccess(null);
        setLastPlayerMove(null);
        setLastAiMove(null);
    };

    // --- LOGICA DI VISUALIZZAZIONE ---
    let attackerImg: string;
    let defenderImg: string;
    let attackerParams: CalibParams;
    let defenderParams: CalibParams;
    let currentAttackerLane: MoveId;
    let currentDefenderLane: MoveId;
    let defenderOpacity = 1;

    if (turn === 'PLAYER') {
        // Gaia attacca (Giocatore), Giordano difende (IA)
        currentAttackerLane = lastPlayerMove || 'CENTER';
        // Se sta animando, Giordano (difensore) si muove
        currentDefenderLane = isFlickering ? flickerMove : (lastAiMove || 'CENTER');
        defenderOpacity = isFlickering ? flickerOpacity : 1;

        attackerImg = GAIA_OFFENSE_MOVES[currentAttackerLane];
        attackerParams = CALIB_DATA['GAIA_OFF'][currentAttackerLane];
        defenderImg = GIORDANO_DEFENSE_MOVES[currentDefenderLane];
        defenderParams = CALIB_DATA['GIORDANO_DEF'][currentDefenderLane];
    } else {
        // Giordano attacca (IA), Gaia difende (Giocatore)
        // Se sta animando, Giordano (attaccante) si muove
        currentAttackerLane = isFlickering ? flickerMove : (lastAiMove || 'CENTER');
        currentDefenderLane = lastPlayerMove || 'CENTER'; 
        
        attackerImg = GIORDANO_OFFENSE_MOVES[currentAttackerLane];
        attackerParams = CALIB_DATA['GIORDANO_OFF'][currentAttackerLane];
        defenderImg = GAIA_DEFENSE_MOVES[currentDefenderLane];
        defenderParams = CALIB_DATA['GAIA_DEF'][currentDefenderLane];
    }

    return (
        <div className="fixed inset-0 z-0 bg-slate-900 overflow-hidden touch-none select-none flex flex-col h-screen">
            <style>{`
                @keyframes bounce-in {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes player-fixed-once {
                    0%, 100% { transform: translate(-50%, 0); }
                }
                .animate-pop { animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .animate-fixed-once { animation: player-fixed-once 3s forwards; }
                .text-stroke { -webkit-text-stroke: 2px black; text-shadow: 4px 4px 0px rgba(0,0,0,0.3); }
                .lcd-glow-blue { text-shadow: 0 0 15px rgba(59, 130, 246, 0.8); }
                .lcd-glow-red { text-shadow: 0 0 15px rgba(239, 68, 68, 0.8); }
                .lcd-glow-yellow { text-shadow: 0 0 10px rgba(234, 179, 8, 0.8); }
                .lcd-font { font-family: 'Courier New', monospace; font-weight: 900; }
                .lucky-font { font-family: 'Luckiest Guy', cursive; }
                .no-slide { transition: opacity 0.4s ease-in-out, left 0s, transform 0s !important; }
            `}</style>

            <img src={BASKET_BG} alt="" className="absolute inset-0 w-full h-full object-fill opacity-40" />

            {/* UI SUPERIORE: TABELLONE SEGNAPUNTI PROFESSIONALE COMPATTO */}
            <div className="relative z-50 w-full pt-[75px] md:pt-[105px] px-4 flex justify-between items-start pointer-events-none">
                <div className="flex gap-2 pointer-events-auto shrink-0">
                    <button onClick={() => setView(AppView.SCHOOL_GYM)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_EXIT_IMG} alt="Torna" className="w-[22vw] md:w-[10vw] max-w-[180px] h-auto drop-shadow-xl object-contain" />
                    </button>
                </div>

                {/* TABELLONE CENTRALE COMPATTO - Larghezza ridotta min-w */}
                <div className="pointer-events-auto bg-slate-900 border-x-4 border-b-4 border-slate-700 rounded-b-3xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center overflow-hidden min-w-[160px] md:min-w-[260px]">
                    {/* gap ridotto da gap-4 md:gap-8 a gap-2 md:gap-4 */}
                    <div className="flex items-stretch p-2 md:p-3 gap-2 md:gap-4 bg-black w-full justify-center">
                        {/* GAIA SCORE */}
                        <div className="flex flex-col items-center min-w-[55px] md:min-w-[80px]">
                            <div className="flex items-center gap-1.5 mb-1">
                                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${turn === 'PLAYER' ? 'bg-blue-500 animate-pulse' : 'bg-slate-800'}`}></div>
                                <span className="text-white font-black text-[8px] md:text-xs uppercase tracking-tight">GAIA</span>
                            </div>
                            <div className="bg-slate-950 px-2 py-0.5 md:py-1 rounded-lg border border-blue-900 shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
                                <span className="text-xl md:text-4xl text-blue-500 lcd-font lcd-glow-blue leading-none">{scores.gaia.toString().padStart(2, '0')}</span>
                            </div>
                        </div>

                        {/* VS AREA */}
                        <div className="flex items-center justify-center shrink-0">
                            <span className="text-yellow-500 font-black text-[10px] md:text-lg italic lcd-font drop-shadow-md">VS</span>
                        </div>

                        {/* GIORDANO SCORE */}
                        <div className="flex flex-col items-center min-w-[55px] md:min-w-[80px]">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-white font-black text-[8px] md:text-xs uppercase tracking-tight">GIORDANO</span>
                                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${turn === 'AI' ? 'bg-red-500 animate-pulse' : 'bg-slate-800'}`}></div>
                            </div>
                            <div className="bg-slate-950 px-2 py-0.5 md:py-1 rounded-lg border border-red-900 shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
                                <span className="text-xl md:text-4xl text-red-600 lcd-font lcd-glow-red leading-none">{scores.giordano.toString().padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="pointer-events-auto shrink-0 flex items-start gap-2 pt-2">
                    <button onClick={() => setMusicEnabled(!musicEnabled)} className="bg-slate-900/60 p-2 md:p-3 rounded-xl border-2 border-slate-700 shadow-xl flex items-center justify-center backdrop-blur-sm active:scale-95 transition-all">
                        {musicEnabled ? <Volume2 size={22} className="text-yellow-400" /> : <VolumeX size={22} className="text-gray-400" />}
                    </button>
                    <button onClick={() => setSfxEnabled(!sfxEnabled)} className={`bg-slate-900/60 w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-slate-700 flex items-center justify-center shadow-xl backdrop-blur-sm active:scale-95 transition-all ${!sfxEnabled ? 'opacity-50 grayscale' : ''}`}>
                        <span className={`font-black text-xs md:text-sm uppercase ${sfxEnabled ? 'text-yellow-400' : 'text-gray-400'}`}>FX</span>
                    </button>
                </div>
            </div>

            {/* AREA CENTRALE */}
            <div className="flex-1 relative flex items-center justify-center p-2 min-h-0">
                {(gameState === 'ANIMATING' || gameState === 'RESOLUTION' || gameState === 'WON' || gameState === 'LOST') && (lastPlayerMove) ? (
                    <div className="absolute inset-0 z-30 pointer-events-none">
                        {/* Personaggio Giocatore (Sempre fermo nella scelta) */}
                        <div className={`absolute bottom-0 transform -translate-x-1/2 animate-fixed-once z-50 ${LANE_POSITIONS[currentAttackerLane]}`}>
                            <img 
                                src={attackerImg} 
                                className={`w-64 h-64 md:w-[480px] md:h-[480px] object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]`}
                                style={{ 
                                    transform: `scale(${attackerParams.scale}) translate(${attackerParams.x}px, ${attackerParams.y}px)`, 
                                    opacity: (turn === 'AI' && isFlickering) ? flickerOpacity : 1,
                                    transition: 'none !important' 
                                }}
                            />
                        </div>
                        {/* Personaggio IA (Giordano - Si muove se isFlickering) */}
                        <div className={`absolute bottom-20 transform -translate-x-1/2 z-40 ${LANE_POSITIONS[currentDefenderLane]} no-slide`} style={{ opacity: defenderOpacity, transform: `translate(-50%, 0) scale(${defenderParams.scale}) translate(${defenderParams.x}px, ${defenderParams.y}px)` }}>
                            <img src={defenderImg} className={`w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-2xl brightness-75`} style={{ transition: 'none !important' }} />
                        </div>
                    </div>
                ) : (
                    <div className={`w-full max-w-4xl flex justify-around items-end relative h-64 md:h-[500px] transition-opacity duration-300 ${gameState === 'ANIMATING' ? 'opacity-0' : 'opacity-100'}`}>
                        <div className={`transition-all duration-500 flex flex-col items-center ${turn === 'PLAYER' ? 'scale-110' : 'scale-90 opacity-80'}`}>
                            <img src={PLAYER_IDLE} alt="Gaia" className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-xl" />
                            <span className="bg-blue-600 text-white px-4 py-1 rounded-full font-black text-[10px] md:text-sm mt-2 shadow-md uppercase tracking-tight">TU (GAIA)</span>
                        </div>
                        <div className={`transition-all duration-500 flex flex-col items-center ${turn === 'AI' ? 'scale-110' : 'scale-90 opacity-80'}`}>
                            <img src={OPPONENT_IDLE} alt="Giordano" className="w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-xl" />
                            <span className="bg-red-600 text-white px-4 py-1 rounded-full font-black text-[10px] md:text-sm mt-2 shadow-md uppercase tracking-tight font-sans">GIORDANO</span>
                        </div>
                    </div>
                )}

                {/* FEEDBACK RESOLUTION */}
                {gameState === 'RESOLUTION' && isActionSuccess !== null && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
                        <div className="animate-pop text-center bg-black/20 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 border-4 border-white/30 flex flex-col items-center">
                            {!isActionSuccess ? (
                                <>
                                    <img src={turn === 'PLAYER' ? IMG_STOPPATA_GIORDANO : IMG_BLOCK_GAIA} alt="Stoppata" className="w-64 md:w-[450px] h-auto drop-shadow-2xl mb-4" />
                                    <h2 className="text-6xl md:text-9xl lucky-font uppercase text-yellow-400 text-stroke">STOPPATA!</h2>
                                </>
                            ) : (
                                <>
                                    <img src={turn === 'PLAYER' ? IMG_CANESTRO_GAIA : IMG_CANESTRO_GIORDANO} alt="Canestro" className="w-64 md:w-[450px] h-auto drop-shadow-2xl mb-4" />
                                    <h2 className={`text-6xl md:text-9xl lucky-font uppercase text-stroke text-yellow-400`}>CANESTRO!</h2>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* COMANDI */}
            <div className={`relative z-40 p-4 md:p-6 flex flex-col items-center gap-2 transition-transform duration-500 ${gameState === 'PLAYING' ? 'translate-y-0' : 'translate-y-full opacity-0'}`}>
                <h3 className="text-yellow-400 font-black text-2xl md:text-5xl uppercase tracking-tighter lucky-font text-stroke mb-4">
                    {turn === 'PLAYER' ? 'Scegli il tiro' : 'Dove difendi?'}
                </h3>
                <div className="grid grid-cols-3 gap-4 md:gap-10 w-full max-w-3xl items-center justify-items-center">
                    {turn === 'PLAYER' ? (
                        Object.entries(GAIA_OFFENSE_MOVES).map(([key, img]) => (
                            <button key={key} onClick={() => handleAction(key as MoveId)} className="relative hover:scale-110 active:scale-95 transition-all outline-none flex flex-col items-center group w-full">
                                <div className="h-20 md:h-36 w-full flex items-center justify-center overflow-hidden">
                                    <img src={img} className="h-full w-auto object-contain drop-shadow-2xl" />
                                </div>
                            </button>
                        ))
                    ) : (
                        Object.entries(GAIA_DEFENSE_MOVES).map(([key, img]) => (
                            <button key={key} onClick={() => handleAction(key as MoveId)} className="relative hover:scale-110 active:scale-95 transition-all outline-none flex flex-col items-center group w-full">
                                <div className="h-20 md:h-36 w-full flex items-center justify-center overflow-hidden">
                                    <img src={img} className="h-full w-auto object-contain drop-shadow-2xl" />
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* MODALE START */}
            {gameState === 'START' && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 animate-in fade-in">
                    <div className="bg-white p-6 md:p-8 rounded-[40px] border-8 border-orange-500 shadow-2xl text-center max-sm flex flex-col items-center">
                        <div className="flex gap-4 mb-4">
                            <img src={PLAYER_IDLE} alt="Gaia" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
                            <img src={OPPONENT_IDLE} alt="Giordano" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-blue-900 mb-2 uppercase leading-tight font-luckiest">Sfida a Basket!</h2>
                        <p className="text-gray-600 font-bold mb-6 text-sm md:text-base px-2">Chi arriva prima a <span className="text-orange-500">10 canestri</span> vince la partita!</p>
                        <button onClick={startNewGame} className="hover:scale-105 active:scale-95 transition-all outline-none w-32 md:w-40">
                            <img src={BTN_START_IMG} alt="Inizia" className="w-full h-auto drop-shadow-xl" />
                        </button>
                    </div>
                </div>
            )}

            {/* MODALE VITTORIA FINALE */}
            {(gameState === 'WON' || gameState === 'LOST') && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 animate-in zoom-in duration-300">
                    <div className="bg-white rounded-[40px] border-8 border-yellow-400 p-8 w-full max-sm text-center shadow-[0_0_50px_rgba(251,191,36,0.6)] flex flex-col items-center relative">
                        
                        <div className="mb-6 transform hover:scale-105 transition-transform">
                             <img 
                                src={gameState === 'WON' ? IMG_GAIA_WIN_HEADER : IMG_GIORDANO_WIN_HEADER} 
                                alt="Vittoria" 
                                className="h-56 md:h-80 w-auto object-contain drop-shadow-xl" 
                             />
                        </div>

                        <h2 
                            className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2 lucky-font text-stroke"
                            style={{ color: gameState === 'WON' ? '#3b82f6' : '#ef4444' }}
                        >
                            {gameState === 'WON' ? 'Gaia vince' : 'Giordano vince'}
                        </h2>
                        
                        <p className="text-gray-600 font-bold mb-8 text-lg md:text-xl">
                            {gameState === 'WON' 
                                ? 'Sei stata bravissima! Hai vinto la sfida!' 
                                : 'Giordano ha vinto questa volta... riprova!'}
                        </p>

                        <div className="flex gap-4 w-full items-center justify-center">
                            <button 
                                onClick={startNewGame}
                                className="flex-1 transition-all hover:scale-105 active:scale-95 outline-none"
                            >
                                <img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-lg" />
                            </button>
                            <button 
                                onClick={() => setView(AppView.SCHOOL_GYM)}
                                className="flex-1 transition-all hover:scale-105 active:scale-95 outline-none"
                            >
                                <img src={BTN_EXIT_IMG} alt="Palestra" className="w-full h-auto drop-shadow-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolGymBasket;