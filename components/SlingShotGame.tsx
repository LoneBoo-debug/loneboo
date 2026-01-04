
import { addTokens, getProgress } from '../services/tokens';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/game-slingshot-mobile.webp';
const BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/game-slingshot-desktop.webp';

const CAN_IMG = 'https://i.postimg.cc/T27xKDvK/baratt-(1)-(1)-(1).png'; 
const PROJECTILE_IMG = 'https://i.postimg.cc/3xJYNFdv/sass-(1).png'; 
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const BTN_PLAY_AGAIN = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';

interface Can {
    id: number;
    x: number;
    y: number;
    scale: number;
    isDown: boolean;
    row: number; 
    col: number;
    fallDir: number;
    fallRot: number;
}

interface SlingShotGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const SlingShotGame: React.FC<SlingShotGameProps> = ({ onBack, onEarnTokens }) => {
    const [cans, setCans] = useState<Can[]>([]);
    const [gameState, setGameState] = useState<'START' | 'PLAYING'>('START');
    const [shots, setShots] = useState(6);
    const [score, setScore] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);
    const [sfxEnabled, setSfxEnabled] = useState(true);

    const isDragging = useRef(false);
    const pullPos = useRef({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [projectile, setProjectile] = useState<{ x: number, y: number, z: number, vx: number, vy: number, vz: number } | null>(null);
    const audioCtx = useRef<AudioContext | null>(null);

    // Sincronizzazione iniziale e listener per aggiornamenti esterni
    const syncTokens = useCallback(() => {
        setTotalTokens(getProgress().tokens);
    }, []);

    useEffect(() => {
        syncTokens();
        window.addEventListener('progressUpdated', syncTokens);
        return () => window.removeEventListener('progressUpdated', syncTokens);
    }, [syncTokens]);

    // --- AUDIO ENGINE ---
    const playSfx = (type: 'LAUNCH' | 'HIT' | 'VICTORY') => {
        if (!sfxEnabled) return;
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioCtx.current;
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;

        if (type === 'LAUNCH') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.2);
        } else if (type === 'HIT') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(now + 0.15);
        } else if (type === 'VICTORY') {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.15);
                gain.gain.setValueAtTime(0, now + i * 0.15);
                gain.gain.linearRampToValueAtTime(0.3, now + i * 0.15 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
                osc.connect(gain).connect(ctx.destination);
                osc.start(now + i * 0.15);
                osc.stop(now + i * 0.15 + 0.5);
            });
        }
    };

    const initCans = useCallback(() => {
        const newCans: Can[] = [];
        for (let i = 0; i < 3; i++) {
            newCans.push({ id: i, x: 34 + (i * 16), y: 44, scale: 0.9, isDown: false, row: 0, col: i, fallDir: 0, fallRot: 0 });
        }
        for (let i = 0; i < 2; i++) {
            newCans.push({ id: 3 + i, x: 42 + (i * 16), y: 37.5, scale: 0.87, isDown: false, row: 1, col: i, fallDir: 0, fallRot: 0 });
        }
        newCans.push({ id: 5, x: 50, y: 31, scale: 0.84, isDown: false, row: 2, col: 0, fallDir: 0, fallRot: 0 });
        setCans(newCans);
        setScore(0);
        setShots(6);
        setGameState('PLAYING');
    }, []);

    useEffect(() => {
        if (gameState === 'START') initCans();
    }, [gameState, initCans]);

    const checkCascade = (currentCans: Can[]) => {
        let changed = false;
        const updated = currentCans.map(can => {
            if (can.isDown) return can;
            if (can.row === 1) {
                const supportLeft = currentCans.find(c => c.row === 0 && c.col === can.col);
                const supportRight = currentCans.find(c => c.row === 0 && c.col === can.col + 1);
                if (supportLeft?.isDown || supportRight?.isDown) {
                    changed = true;
                    const dir = (supportLeft?.isDown && !supportRight?.isDown) ? -1 : 
                                (!supportLeft?.isDown && supportRight?.isDown) ? 1 : 
                                (Math.random() > 0.5 ? 1 : -1);
                    return { ...can, isDown: true, fallDir: dir, fallRot: 180 + Math.random() * 360 };
                }
            }
            if (can.row === 2) {
                const supportLeft = currentCans.find(c => c.row === 1 && c.col === 0);
                const supportRight = currentCans.find(c => c.row === 1 && c.col === 1);
                if (supportLeft?.isDown || supportRight?.isDown) {
                    changed = true;
                    const dir = (supportLeft?.isDown && !supportRight?.isDown) ? -1 : 
                                (!supportLeft?.isDown && supportRight?.isDown) ? 1 : 
                                (Math.random() > 0.5 ? 1 : -1);
                    return { ...can, isDown: true, fallDir: dir, fallRot: 200 + Math.random() * 400 };
                }
            }
            return can;
        });
        if (changed) return checkCascade(updated);
        return updated;
    };

    useEffect(() => {
        if (!projectile) return;
        const interval = setInterval(() => {
            setProjectile(prev => {
                if (!prev) return null;
                const nextZ = prev.z + prev.vz;
                const nextX = prev.x + prev.vx;
                const nextY = prev.y + prev.vy;
                const nextVy = prev.vy + 0.16; 

                if (prev.z < 100 && nextZ >= 100) {
                    setCans(currentCans => {
                        let hitAny = false;
                        let withHits = currentCans.map(can => {
                            if (can.isDown) return can;
                            const dx = Math.abs(can.x - nextX);
                            const dy = Math.abs(can.y - nextY);
                            if (dx < 10 && dy < 10) {
                                hitAny = true;
                                return { 
                                    ...can, 
                                    isDown: true, 
                                    fallDir: nextX > can.x ? -1 : 1, 
                                    fallRot: 360 + Math.random() * 720 
                                };
                            }
                            return can;
                        });
                        
                        if (hitAny) {
                            playSfx('HIT');
                            const finalCans = checkCascade(withHits);
                            const newScore = finalCans.filter(c => c.isDown).length;
                            setScore(newScore);
                            if (newScore === 6) {
                                playSfx('VICTORY');
                                const bonus = 6;
                                // SALVATAGGIO DIRETTO
                                addTokens(bonus);
                                if (onEarnTokens) onEarnTokens(bonus);
                                syncTokens();
                            }
                            return finalCans;
                        }
                        return withHits;
                    });
                }

                if (nextZ > 180 || nextY > 100) {
                    setShots(s => {
                        const remaining = s - 1;
                        if (remaining === 0 && score < 6) {
                            if (score >= 3) {
                                const tokens = 2;
                                // SALVATAGGIO DIRETTO
                                addTokens(tokens);
                                if (onEarnTokens) onEarnTokens(tokens);
                                syncTokens();
                            }
                        }
                        return Math.max(0, remaining);
                    });
                    return null;
                }
                return { ...prev, x: nextX, y: nextY, z: nextZ, vy: nextVy };
            });
        }, 16); 
        return () => clearInterval(interval);
    }, [projectile, score, onEarnTokens, syncTokens]);

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (gameState !== 'PLAYING' || projectile || shots <= 0 || score === 6) return;
        if (e.cancelable) e.preventDefault();
        isDragging.current = true;
        const pos = 'touches' in e ? e.touches[0] : e;
        pullPos.current = { x: pos.clientX, y: pos.clientY };
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging.current) return;
        if (e.cancelable) e.preventDefault();
        const pos = 'touches' in e ? e.touches[0] : e;
        const dx = pos.clientX - pullPos.current.x;
        const dy = pos.clientY - pullPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100; 
        if (dist > maxDist) {
            const angle = Math.atan2(dy, dx);
            setDragOffset({ x: Math.cos(angle) * maxDist, y: Math.sin(angle) * maxDist });
        } else {
            setDragOffset({ x: dx, y: dy });
        }
    };

    const handleEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        playSfx('LAUNCH');
        const dist = Math.sqrt(dragOffset.x**2 + dragOffset.y**2);
        const power = dist / 100;
        const vx = (-dragOffset.x * 0.05); 
        const vy = (-dragOffset.y * 0.04) - 0.9; 
        const vz = 2.4 + (power * 1.6);
        setProjectile({ x: 79, y: 82.25, z: 0, vx, vy, vz });
        setDragOffset({ x: 0, y: 0 });
    };

    const isGameOver = shots === 0 || score === 6;

    // Helper to stop UI interaction from triggering the slingshot
    const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="fixed inset-0 z-[95] pt-[68px] md:pt-[106px] bg-slate-900 flex flex-col animate-in fade-in overflow-hidden select-none touch-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
            <style>{`
                @keyframes can-tumble {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                    20% { transform: translate(var(--dx), -30px) rotate(var(--dr20)); }
                    100% { transform: translate(var(--dx-final), 700px) rotate(var(--dr-final)); opacity: 0; }
                }
                .can-down { 
                    animation: can-tumble 1.5s forwards cubic-bezier(0.4, 0, 0.8, 0.4); 
                    pointer-events: none;
                    z-index: 10;
                }
                @keyframes pulse-gold {
                    0%, 100% { transform: scale(1); filter: brightness(1); }
                    50% { transform: scale(1.05); filter: brightness(1.2); }
                }
                .animate-pulse-gold { animation: pulse-gold 1s infinite; }
                
                @keyframes neon-flicker {
                    0%, 100% { opacity: 1; filter: brightness(1.2) drop-shadow(0 0 10px #FFD700); }
                    50% { opacity: 0.8; filter: brightness(1) drop-shadow(0 0 5px #FFA500); }
                }
                .neon-victory { 
                    animation: neon-flicker 0.4s infinite ease-in-out; 
                    font-family: 'Luckiest Guy', cursive;
                }
            `}</style>

            <div 
                className="relative w-full h-full overflow-hidden touch-none"
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
            >
                <img src={BG_MOBILE} draggable="false" className="absolute inset-0 w-full h-full object-cover block md:hidden pointer-events-none" alt="" />
                <img src={BG_DESKTOP} draggable="false" className="absolute inset-0 w-full h-full object-cover hidden md:block pointer-events-none" alt="" />
                
                {/* CONSOLE TASTI TOP RIGHT */}
                <div 
                    className="absolute top-4 right-4 z-[70] flex flex-col gap-4 items-center"
                    onMouseDown={stopPropagation}
                    onTouchStart={stopPropagation}
                >
                    <button 
                        onClick={onBack}
                        className="hover:scale-110 active:scale-95 transition-all outline-none pointer-events-auto"
                    >
                        <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-24 md:h-24 drop-shadow-xl" />
                    </button>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSfxEnabled(!sfxEnabled); }}
                        className="w-14 h-14 md:w-20 md:h-20 bg-yellow-400 border-4 md:border-8 border-slate-700 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all outline-none pointer-events-auto"
                    >
                        {sfxEnabled ? <Volume2 size={28} className="text-slate-800" /> : <VolumeX size={28} className="text-red-500" />}
                    </button>
                </div>

                {/* HUD BLOCK */}
                <div className="absolute bottom-[4%] left-4 flex flex-col gap-2 z-40 pointer-events-none w-28 md:w-40">
                    <div className="bg-gradient-to-b from-orange-400 to-orange-600 border-4 border-white p-2 rounded-2xl shadow-lg flex flex-col items-center justify-center w-full h-14 md:h-18">
                        <span className="text-xl md:text-2xl font-black text-white leading-none drop-shadow-md">{shots}</span>
                        <span className="text-[8px] md:text-[10px] font-black text-orange-100 uppercase mt-0.5 tracking-tighter">tentativi</span>
                    </div>
                    <div className="bg-gradient-to-b from-purple-500 to-purple-700 border-4 border-white p-2 rounded-2xl shadow-lg flex flex-col items-center justify-center w-full h-14 md:h-18">
                        <span className="text-[9px] md:text-[11px] font-black text-purple-100 uppercase mb-0.5">Punti</span>
                        <span className="text-xl md:text-2xl font-black text-white leading-none drop-shadow-md">{score}/6</span>
                    </div>
                    <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 border-4 border-white p-2 rounded-2xl shadow-lg flex flex-col items-center justify-center w-full h-14 md:h-18">
                        <span className="text-[8px] md:text-[10px] font-black text-yellow-900 uppercase mb-0.5">Gettoni</span>
                        <div className="flex items-center justify-center gap-1">
                            <span className="text-lg md:text-xl font-black text-black leading-none drop-shadow-sm">{totalTokens}</span>
                            <span className="text-sm">🪙</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); initCans(); }}
                        onMouseDown={stopPropagation}
                        onTouchStart={stopPropagation}
                        disabled={!isGameOver}
                        className={`transition-all outline-none pointer-events-auto mt-1 w-full ${isGameOver ? 'animate-pulse-gold opacity-100' : 'opacity-40 grayscale cursor-not-allowed'}`}
                    >
                        <img src={BTN_PLAY_AGAIN} alt="Gioca Ancora" className="w-full h-auto drop-shadow-md" />
                    </button>
                </div>

                {/* AREA BARATTOLI / SCRITTA VITTORIA */}
                <div className="absolute inset-0 pointer-events-none">
                    {cans.map(can => (
                        <div 
                            key={can.id} 
                            className={`absolute z-20 transition-all duration-300 ${can.isDown ? 'can-down' : ''}`} 
                            style={{ 
                                left: `${can.x}%`, 
                                top: `${can.y}%`, 
                                transform: `translate(-50%, -50%) scale(${can.scale})`, 
                                width: '55px', 
                                height: '65px',
                                // @ts-ignore
                                '--dx': `${can.fallDir * 40}px`,
                                // @ts-ignore
                                '--dx-final': `${can.fallDir * 250}px`,
                                // @ts-ignore
                                '--dr20': `${can.fallDir * 60}deg`,
                                // @ts-ignore
                                '--dr-final': `${can.fallDir * can.fallRot}deg`
                            }} 
                        >
                            <img src={CAN_IMG} alt="Barattolo" className="w-full h-full object-contain" />
                        </div>
                    ))}

                    {score === 6 && (
                        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] md:w-[50%] flex flex-col items-center justify-center animate-in zoom-in duration-700">
                             <div className="neon-victory text-center flex flex-col items-center">
                                <span className="text-3xl md:text-6xl text-yellow-400 uppercase tracking-tighter leading-none" style={{ WebkitTextStroke: '2px black', textShadow: '0 0 20px #FFD700' }}>
                                    COMPLIMENTI!
                                </span>
                                <span className="text-2xl md:text-5xl text-orange-400 uppercase tracking-widest mt-1" style={{ WebkitTextStroke: '1.5px black', textShadow: '0 0 15px #FF8C00' }}>
                                    MIRA INCREDIBILE!
                                </span>
                                <div className="mt-4 bg-black/60 px-6 py-2 rounded-full border-2 border-yellow-400 shadow-[0_0_15px_#FFD700]">
                                    <span className="text-lg md:text-2xl text-yellow-300 font-black uppercase">+1 GETTONE BONUS</span>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* PROIETTILE IN VOLO */}
                {projectile && (
                    <div 
                        className="absolute z-30 pointer-events-none" 
                        style={{ 
                            left: `${projectile.x}%`, 
                            top: `${projectile.y}%`, 
                            transform: `translate(-50%, -50%) scale(${1.5 * (1 - projectile.z / 180)})`, 
                            width: '40px', 
                            height: '40px' 
                        }}
                    >
                        <img src={PROJECTILE_IMG} alt="Sasso" className="w-full h-full object-contain drop-shadow-xl" />
                    </div>
                )}

                {/* AREA FIONDA */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 z-50 pointer-events-none flex justify-center">
                    <div className="relative w-72 h-full flex items-center justify-center">
                        {!projectile && shots > 0 && score < 6 && (
                            <div 
                                className="absolute z-[60]" 
                                style={{ 
                                    left: `calc(79% + ${dragOffset.x}px)`, 
                                    top: `calc(29% + ${dragOffset.y}px)`, 
                                    transform: 'translate(-50%, -50%)', 
                                    width: '40px', 
                                    height: '40px' 
                                }}
                            >
                                <img src={PROJECTILE_IMG} alt="Sasso Pronto" className="w-full h-full object-contain drop-shadow-lg" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlingShotGame;
