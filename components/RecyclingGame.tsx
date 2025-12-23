import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Recycle, RotateCcw, Sparkles, Check, Volume2, VolumeX, Zap, Store } from 'lucide-react';
import { addTokens, getProgress } from '../services/tokens';
import { RECYCLE_DATABASE, RecycleItem, BinType } from '../services/dbRecycle';

const BG_KITCHEN = 'https://i.postimg.cc/tTtyjxgs/cuxdfr.jpg';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const TITLE_GAME_IMG = 'https://i.postimg.cc/R0xrWzpz/testric.png';
const IMG_LOST_HEADER = 'https://i.postimg.cc/KcQy0zQj/csmione-(1).png';

const BTN_RETRY_IMG_LOST = 'https://i.postimg.cc/65vxt0tQ/riptrgr.png';
const BTN_EXIT_IMG_LOST = 'https://i.postimg.cc/ydLs3YbX/tornscuc.png';

// PREMI ASSOCIATI AI MATERIALI
const RECYCLED_REWARDS: Record<BinType, { name: string, icon: string, color: string, desc: string }[]> = {
    PAPER: [
        { name: 'Libro Nuovo!', icon: '📖', color: 'text-blue-600', desc: 'Dalla tua carta è nato un libro di favole!' },
        { name: 'Aereoplanino!', icon: '✈️', color: 'text-sky-500', desc: 'Hai creato un aereo di carta super veloce!' }
    ],
    PLASTIC: [
        { name: 'Maglietta Bio!', icon: '👕', color: 'text-orange-500', desc: 'Dalla plastica abbiamo creato una maglietta!' },
        { name: 'Occhiali Fighi!', icon: '🕶️', color: 'text-pink-500', desc: 'Hai riciclato la plastica in occhiali da sole!' }
    ],
    GLASS: [
        { name: 'Vaso Magico!', icon: '🏺', color: 'text-amber-600', desc: 'Il vetro è diventato un bellissimo vaso!' },
        { name: 'Specchio!', icon: '🪞', color: 'text-cyan-400', desc: 'Il vetro è tornato a splendere come uno specchio!' }
    ],
    ORGANIC: [
        { name: 'Concime per Fiori!', icon: '🌸', color: 'text-green-600', desc: 'L\'organico aiuterà i fiori a crescere!' },
        { name: 'Mela Matura!', icon: '🍎', color: 'text-red-500', desc: 'Hai nutrito la terra e ora è nata una mela!' }
    ]
};

const BINS = [
    { 
        type: 'PAPER' as BinType, 
        label: 'CARTA', 
        icon: 'https://i.postimg.cc/cHxczKzF/carta-(1)-(1).png', 
        btnIcon: 'https://i.postimg.cc/CxfYZ5cS/cartascr-(1).png',
        light: 'bg-blue-300' 
    },
    { 
        type: 'PLASTIC' as BinType, 
        label: 'PLASTICA', 
        icon: 'https://i.postimg.cc/0jNcz6dH/plaseed-(1)-(1).png', 
        btnIcon: 'https://i.postimg.cc/fyLQMRV1/plastcscr-(1).png',
        light: 'bg-yellow-200' 
    },
    { 
        type: 'GLASS' as BinType, 
        label: 'VETRO', 
        icon: 'https://i.postimg.cc/rFPYt9HK/dfjh-(1)-(1).png', 
        btnIcon: 'https://i.postimg.cc/9ft6T7TJ/vetrscr-(1).png',
        light: 'bg-green-300' 
    },
    { 
        type: 'ORGANIC' as BinType, 
        label: 'ORGANICO', 
        icon: 'https://i.postimg.cc/Gt0m2YCw/ltgrt-(1)-(1).png', 
        btnIcon: 'https://i.postimg.cc/Y0VZkfKC/orgscr-(1).png',
        light: 'bg-amber-400' 
    }
];

const RecyclingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [currentItem, setCurrentItem] = useState<RecycleItem | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [totalTokens, setTotalTokens] = useState(0);
    const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'RECYCLING' | 'REWARD' | 'GAME_OVER'>('START');
    const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
    const [reward, setReward] = useState<any>(null);
    const [binLevels, setBinLevels] = useState<Record<BinType, number>>({
        PAPER: 0, PLASTIC: 0, GLASS: 0, ORGANIC: 0
    });
    
    // Animazione Monitor
    const [isZooming, setIsZooming] = useState(false);
    const [showName, setShowName] = useState(false);

    const [sfxEnabled, setSfxEnabled] = useState(true);
    const audioCtx = useRef<AudioContext | null>(null);

    useEffect(() => {
        setTotalTokens(getProgress().tokens);
    }, []);

    const playSfx = async (type: 'WIN' | 'FAIL' | 'MAGIC') => {
        if (!sfxEnabled) return;
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioCtx.current;
        
        // Assicuriamoci che il contesto sia sempre attivo per evitare cali di volume/qualità
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (type === 'WIN') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(900, now);
            gain.gain.setValueAtTime(0.3, now); // Volume leggermente aumentato e fisso
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'FAIL') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
            gain.gain.setValueAtTime(0.3, now); // Volume coerente con WIN
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'MAGIC') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.8);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc.connect(gain).connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.8);
        }
    };

    const startGame = () => {
        setScore(0);
        setLives(3);
        setFeedback(null);
        setIsZooming(false);
        setShowName(false);
        setTotalTokens(getProgress().tokens);
        setBinLevels({ PAPER: 0, PLASTIC: 0, GLASS: 0, ORGANIC: 0 });
        pickNextItem(true);
        setGameState('PLAYING');
    };

    const pickNextItem = (isFirst: boolean = false) => {
        let nextItem: RecycleItem;
        do {
            nextItem = RECYCLE_DATABASE[Math.floor(Math.random() * RECYCLE_DATABASE.length)];
        } while (currentItem && nextItem.id === currentItem.id);

        setIsZooming(true);
        setShowName(false);
        setCurrentItem({ ...nextItem, id: Date.now() });

        // Timeline Animazione:
        // 0-2s: Zoom immagine
        // 2s: Fine zoom e apparizione immediata del testo
        setTimeout(() => {
            setIsZooming(false); 
            setShowName(true); 
        }, 2000);
    };

    const handleSort = (binType: BinType) => {
        if (gameState !== 'PLAYING' || feedback || !showName) return;

        if (currentItem?.type === binType) {
            setFeedback('CORRECT');
            setScore(s => s + 1);
            setBinLevels(prev => ({ ...prev, [binType]: Math.min(5, prev[binType] + 1) }));
            playSfx('WIN');
            setTimeout(() => {
                setFeedback(null);
                pickNextItem();
            }, 800);
        } else {
            setFeedback('WRONG');
            const newLives = lives - 1;
            setLives(newLives);
            playSfx('FAIL');
            if (newLives <= 0) {
                setTimeout(() => setGameState('GAME_OVER'), 800);
            } else {
                setTimeout(() => {
                    setFeedback(null);
                    pickNextItem();
                }, 800);
            }
        }
    };

    const startRecycling = (type: BinType) => {
        setBinLevels(prev => ({ ...prev, [type]: 0 }));
        setGameState('RECYCLING');
        playSfx('MAGIC');
        setTimeout(() => {
            const possibleRewards = RECYCLED_REWARDS[type];
            const randomReward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
            setReward(randomReward);
            setGameState('REWARD');
            const newTotal = addTokens(3); 
            setTotalTokens(newTotal);
        }, 2500);
    };

    return (
        <div className="absolute inset-0 z-50 bg-[#1a2e1a] flex flex-col items-center overflow-hidden font-sans select-none pt-8 md:pt-12">
            <style>{`
                @keyframes super-zoom-in {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-super-zoom {
                    animation: super-zoom-in 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>

            <div className="absolute inset-0 z-0">
                <img src={BG_KITCHEN} className="w-full h-full object-cover blur-md opacity-30" alt="" />
            </div>

            {/* HEADER UI */}
            <div className="relative z-30 w-full h-[12vh] md:h-[15vh] flex justify-between items-end p-4 shrink-0 pointer-events-none mt-4 md:mt-6">
                <button onClick={onBack} className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_CLOSE_IMG} className="w-12 h-12 md:w-16 md:h-16 drop-shadow-xl" alt="Chiudi" />
                </button>
                
                <div className="flex gap-2 pointer-events-auto">
                    <div className="bg-white/90 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border-4 border-green-600 shadow-2xl flex items-center gap-2 md:gap-3">
                        <div className="flex gap-0.5 md:gap-1">
                            {[...Array(3)].map((_, i) => (
                                <Recycle key={i} size={18} className={`transition-all duration-300 ${i < lives ? 'text-green-600 fill-green-600' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <div className="w-px h-5 bg-gray-300"></div>
                        <span className="font-black text-green-700 text-xs md:text-lg">PUNTI: {score}</span>
                        <div className="w-px h-5 bg-gray-300"></div>
                        <button onClick={() => setSfxEnabled(!sfxEnabled)} className="text-green-600 hover:text-green-400 transition-colors">
                            {sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                        <div className="w-px h-5 bg-gray-300"></div>
                        <div className="flex items-center gap-1 bg-yellow-400 px-2 py-0.5 rounded-lg border-2 border-yellow-600 shadow-sm">
                             <span className="font-black text-[10px] md:text-sm text-yellow-900">{totalTokens}</span>
                             <span className="text-xs md:text-sm">🪙</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AREA DI GIOCO */}
            <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-start p-2 relative z-10 overflow-hidden">
                
                {gameState === 'START' && (
                    <div className="bg-white p-6 md:p-10 rounded-[40px] border-8 border-green-600 shadow-2xl text-center animate-in zoom-in max-w-md mt-6 flex flex-col items-center">
                        <img src={TITLE_GAME_IMG} alt="Gioco Riciclo" className="w-full max-w-[280px] md:max-w-[320px] h-auto mb-6 drop-shadow-md" />
                        <p className="text-lg md:text-xl font-bold text-gray-500 mb-6 max-w-sm mx-auto leading-tight">
                            Smista i rifiuti per riempire i bidoni e trasformarli in regali magici! ♻️
                        </p>
                        
                        <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 p-3 rounded-2xl mb-8 flex items-center gap-3">
                            <div className="bg-yellow-400 p-2 rounded-full text-black shrink-0 shadow-sm"><Store size={18}/></div>
                            <p className="text-[10px] md:text-xs text-yellow-800 font-bold text-left leading-tight">
                                Guadagna gettoni d'oro per comprare i pacchetti di figurine nell'<strong>Edicola in Città</strong>! 🪙
                            </p>
                        </div>

                        <button 
                            onClick={startGame}
                            className="bg-green-500 text-white font-black px-10 py-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-xl uppercase"
                        >
                            ATTIVA!
                        </button>
                    </div>
                )}

                {gameState === 'PLAYING' && currentItem && (
                    <div className="w-full h-full flex flex-col justify-start items-center gap-4 py-2">
                        
                        <img src={TITLE_GAME_IMG} alt="" className="w-64 md:w-80 lg:w-[380px] h-auto drop-shadow-sm mb-1 shrink-0" />

                        {/* CONSOLE SUPERIORE (IL MONITOR) */}
                        <div className="bg-slate-700 p-3 md:p-4 rounded-[35px] border-4 md:border-8 border-slate-800 shadow-[0_8px_0_0_#0f172a] flex flex-row gap-3 md:gap-6 items-center shrink-0 h-[28vh] w-full">
                            <div className="relative aspect-square h-full bg-slate-900 rounded-2xl border-4 md:border-6 border-slate-600 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                                
                                {/* CONTENUTO MONITOR */}
                                <div className={`flex flex-col items-center w-full h-full justify-center relative`}>
                                    {currentItem.image ? (
                                        <img 
                                            key={currentItem.id} // Forza il re-mount per riavviare l'animazione zoom
                                            src={currentItem.image} 
                                            alt={currentItem.name} 
                                            className="w-full h-full object-cover animate-super-zoom" 
                                        />
                                    ) : (
                                        <span className="text-[50px] md:text-[80px] mb-1 drop-shadow-2xl animate-float">{currentItem.icon}</span>
                                    )}
                                    
                                    {/* NOME OGGETTO - Arial, Giallo Intenso, Grande, Appare subito dopo lo zoom */}
                                    <div className={`absolute bottom-0 left-0 right-0 p-1.5 text-center pointer-events-none z-30 transition-opacity duration-300 ${showName ? 'opacity-100' : 'opacity-0'}`}>
                                        <span 
                                            className="text-[14px] md:text-[24px] font-black uppercase tracking-tight block leading-none"
                                            style={{ 
                                                fontFamily: 'Arial, sans-serif',
                                                color: '#FFEA00', 
                                                textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                                WebkitTextStroke: '1.2px black'
                                            }}
                                        >
                                            {currentItem.name}
                                        </span>
                                    </div>
                                </div>

                                {/* PICCOLO FEEDBACK GRAFICO IN ALTO A DESTRA */}
                                {feedback === 'CORRECT' && (
                                    <div className="absolute top-2 right-2 z-50 animate-in zoom-in">
                                        <div className="w-8 h-8 md:w-12 md:h-12 bg-green-500 rounded-full border-2 md:border-4 border-white flex items-center justify-center shadow-lg">
                                            <Check size={24} className="text-white" strokeWidth={5} />
                                        </div>
                                    </div>
                                )}
                                {feedback === 'WRONG' && (
                                    <div className="absolute top-2 right-2 z-50 animate-in zoom-in">
                                        <div className="w-8 h-8 md:w-12 md:h-12 bg-red-500 rounded-full border-2 md:border-4 border-white flex items-center justify-center shadow-lg">
                                            <X size={24} className="text-white" strokeWidth={5} />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none z-20"></div>
                            </div>

                            <div className="flex-1 flex flex-col gap-1.5 md:gap-2 h-full items-center justify-center py-1">
                                {BINS.map((bin, index) => (
                                    <React.Fragment key={bin.type}>
                                        <button
                                            onClick={() => handleSort(bin.type)}
                                            className="w-full h-[20%] flex flex-row items-center justify-center transition-all group active:scale-90 outline-none"
                                        >
                                            <img 
                                                src={bin.btnIcon} 
                                                className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
                                                alt={bin.label} 
                                            />
                                        </button>
                                        {index < BINS.length - 1 && <div className="w-[85%] h-[1px] bg-white/20 shrink-0" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* STAZIONE BIDONI */}
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-[35px] border-4 border-white/20 shadow-2xl flex flex-row justify-center gap-2 md:gap-6 shrink-0 h-[26vh] w-full">
                            {BINS.map(bin => {
                                const level = binLevels[bin.type];
                                const isFull = level >= 5;
                                return (
                                    <div key={bin.type} className="flex flex-col items-center justify-between h-full w-1/4 max-w-[110px]">
                                        <div className="flex items-end gap-1 h-[65%] w-full">
                                            <div className="flex-1 h-full flex flex-col items-center justify-center relative">
                                                <img 
                                                    src={bin.icon} 
                                                    className={`w-full h-full object-contain drop-shadow-xl ${bin.type === 'ORGANIC' ? 'scale-y-[1.08] scale-x-[0.92]' : 'scale-[1.02]'}`} 
                                                    alt="" 
                                                />
                                                {isFull && <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" size={20} />}
                                            </div>
                                            <div className="w-3 md:w-5 h-full bg-slate-800 rounded-full border-2 border-slate-600 p-0.5 flex flex-col-reverse gap-0.5 shadow-inner shrink-0">
                                                {[...Array(5)].map((_, i) => (
                                                    <div 
                                                        key={i} 
                                                        className={`flex-1 w-full rounded-full transition-all duration-500 ${i < level ? bin.light : 'bg-slate-700/30'}`}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="h-[25%] w-full flex justify-center items-center">
                                            {isFull ? (
                                                <button 
                                                    onClick={() => startRecycling(bin.type)}
                                                    className="bg-yellow-400 hover:bg-yellow-300 text-black w-full h-full rounded-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all shadow-lg flex items-center justify-center"
                                                >
                                                    <Recycle size={18} className="animate-spin-slow" />
                                                </button>
                                            ) : (
                                                <div className="w-7 h-7 rounded-lg bg-slate-800/20 border border-white/5 flex items-center justify-center">
                                                    <Zap size={12} className="text-white/10" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* MODALI RISULTATI */}
                {gameState === 'RECYCLING' && (
                    <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl animate-in fade-in">
                        <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-full border-8 border-white/30 flex items-center justify-center relative overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.4)]">
                            <Recycle size={150} className="text-white animate-spin-slow opacity-80" />
                            <Sparkles className="absolute top-10 left-10 text-yellow-300 animate-pulse" size={40} />
                            <Sparkles className="absolute bottom-20 right-10 text-cyan-300 animate-pulse" size={50} />
                        </div>
                        <h3 className="mt-8 text-2xl md:text-4xl font-black text-white uppercase animate-pulse" style={{ textShadow: '4px 4px 0px black' }}>Magia...</h3>
                    </div>
                )}

                {/* MODALE REWARD */}
                {gameState === 'REWARD' && reward && (
                    <div className="bg-white p-6 md:p-10 rounded-[50px] border-8 border-yellow-400 shadow-2xl text-center animate-in zoom-in max-w-sm w-full relative">
                        <h3 className="text-3xl font-black text-blue-600 mb-2 uppercase tracking-tight">EVVIVA!</h3>
                        <p className="text-gray-600 font-bold mb-6 text-sm leading-tight">{reward.desc}</p>
                        <div className="bg-slate-50 rounded-[30px] p-6 border-4 border-dashed border-gray-200 mb-6 flex flex-col items-center shadow-inner">
                            <span className="text-[100px] mb-2 drop-shadow-2xl animate-float">{reward.icon}</span>
                            <span className={`text-2xl font-black uppercase ${reward.color}`}>{reward.name}</span>
                        </div>
                        <div className="bg-yellow-400 text-black py-2.5 px-6 rounded-2xl font-black border-4 border-black mb-6 inline-block animate-pulse text-xl shadow-md">+3 🪙</div>
                        <button onClick={() => setGameState('PLAYING')} className="w-full bg-green-500 text-white font-black py-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 transition-all text-xl uppercase">CONTINUA</button>
                    </div>
                )}

                {/* GAME OVER */}
                {gameState === 'GAME_OVER' && (
                    <div className="bg-white p-10 rounded-[50px] border-8 border-red-500 shadow-2xl text-center animate-in zoom-in w-full max-w-md">
                        <div className="w-60 h-60 md:w-80 md:h-80 mx-auto mb-6">
                            <img src={IMG_LOST_HEADER} className="w-full h-full object-contain drop-shadow-md" alt="" />
                        </div>
                        <h3 className="text-3xl font-black text-red-600 mb-4 uppercase">OPS!</h3>
                        <p className="text-lg font-bold text-gray-500 mb-8 leading-snug">Hai fatto qualche errore...<br/>Riprova!</p>
                        <div className="flex flex-row gap-4 justify-center items-center w-full">
                            <button onClick={startGame} className="hover:scale-110 active:scale-95 transition-all outline-none">
                                <img src={BTN_RETRY_IMG_LOST} alt="Riprova" className="h-32 md:h-48 w-auto drop-shadow-xl" />
                            </button>
                            <button onClick={() => onBack()} className="hover:scale-110 active:scale-95 transition-all outline-none">
                                <img src={BTN_EXIT_IMG_LOST} alt="Esci" className="h-32 md:h-48 w-auto drop-shadow-xl" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecyclingGame;