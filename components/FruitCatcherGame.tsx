import React, { useState, useEffect, useRef } from 'react';
import { X, Store, ArrowLeft, Clock, Heart, Trophy, Volume2, VolumeX, Music, Zap } from 'lucide-react';
import { getFruitGameState, saveFruitGameState, FruitGameState, sellFruit, buyFruitUpgrade, FruitUpgrades } from '../services/fruitGameLogic';

const BG_MEADOW = 'https://i.postimg.cc/63vv9WmD/sfondfrut-(1).jpg';
const BOO_CHARACTER = 'https://i.postimg.cc/65NPhQsS/spaoiu-(1).png';
const ROUND_TIME = 60;
const BTN_START_IMG = 'https://i.postimg.cc/J0NhGGmX/hggf-(1).png';
const BTN_NEXT_LEVEL_IMG = 'https://i.postimg.cc/CKm96sNy/nexeree-(1).png';
const BTN_RETRY_IMG = 'https://i.postimg.cc/DwqT5GHw/riprofe-(1).png';
const BTN_GO_BARN_IMG = 'https://i.postimg.cc/7P3tn0Hz/fienid-(1)-(1).png';
const BARN_HEADER_IMG = 'https://i.postimg.cc/VNBQrTHT/fienilea-(1).png';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const BTN_SELL_ALL_IMG = 'https://i.postimg.cc/W33pwTrd/vendi-tutto-(1)-(1).png';
const ICON_UP_SPEED = 'https://i.postimg.cc/GtmMpgZG/velocitr-(1)-(1).png';
const ICON_UP_POWER = 'https://i.postimg.cc/5yrm2452/superfer-(1)-(1).png';
const ICON_UP_MAGNET = 'https://i.postimg.cc/rp2Q4wBr/calamita-(1)-(1).png';
const ICON_UP_SHIELD = 'https://i.postimg.cc/hGn1j3mw/sudied-(1)-(1).png';
const TITLE_LOGO_IMG = 'https://i.postimg.cc/DfQFBfmT/cacciafrutta-(1)-(1)-(1).png';

const IMG_GAME_OVER = 'https://i.postimg.cc/CKDvTHY3/gameover-(1).png';
const IMG_LEVEL_COMPLETED = 'https://i.postimg.cc/vHkLYgPY/livellocompleted-(1).png';

interface Entity {
    id: number;
    x: number;
    y: number;
    w: number;
    h: number;
    type: string;
    hp?: number;
    maxHp?: number;
    speed: number;
    emoji: string;
    isTrapped?: boolean; 
}

const FruitCatcherGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameState, setGameState] = useState<FruitGameState>(getFruitGameState());
    const [gameStatus, setGameStatus] = useState<'START' | 'PLAYING' | 'SUMMARY'>('START');
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [lives, setLives] = useState(3);
    const [isHit, setIsHit] = useState(false);
    const [isInvulnerable, setIsInvulnerable] = useState(false);
    const [roundLevel, setRoundLevel] = useState(getFruitGameState().reachedLevel || 1);
    
    const [sfxEnabled, setSfxEnabled] = useState(() => localStorage.getItem('fruit_sfx') !== 'false');
    const sfxEnabledRef = useRef(sfxEnabled);

    const [roundStats, setRoundStats] = useState({ 
        strawberries: 0, bananas: 0, grapes: 0, oranges: 0, apples: 0, pears: 0, pineapples: 0, watermelons: 0 
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const lastShotTime = useRef(0);
    const playerPos = useRef({ x: 0, y: 0 });
    const touchOffset = useRef({ x: 0, y: 0 }); 
    const isDragging = useRef(false);
    const bgY = useRef(0);
    const bgImgRef = useRef<HTMLImageElement | null>(null);
    const booImgRef = useRef<HTMLImageElement | null>(null);
    
    const fruitsRef = useRef<Entity[]>([]);
    const bubblesRef = useRef<Entity[]>([]);
    const shakeOffset = useRef({ x: 0, y: 0 });
    const hitEndTimeRef = useRef<number>(0);
    const invulnEndTimeRef = useRef<number>(0);

    const audioCtx = useRef<AudioContext | null>(null);

    const FRUIT_TYPES = [
        { key: 'strawberries', emoji: '🍓' },
        { key: 'bananas', emoji: '🍌' },
        { key: 'grapes', emoji: '🍇' },
        { key: 'oranges', emoji: '🍊' },
        { key: 'apples', emoji: '🍎' },
        { key: 'pears', emoji: '🍐' },
        { key: 'pineapples', emoji: '🍍' },
        { key: 'watermelons', emoji: '🍉' }
    ];

    const unlockAudioContext = async () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        if (audioCtx.current.state === 'suspended') {
            await audioCtx.current.resume();
        }
    };

    const playSfx = (type: 'SHOOT' | 'POP' | 'HURT') => {
        if (!sfxEnabledRef.current) return;
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioCtx.current;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (type === 'SHOOT') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        } else if (type === 'POP') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        } else if (type === 'HURT') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.5);
    };

    useEffect(() => {
        sfxEnabledRef.current = sfxEnabled;
        localStorage.setItem('fruit_sfx', String(sfxEnabled));
    }, [sfxEnabled]);

    useEffect(() => {
        const update = () => setGameState(getFruitGameState());
        window.addEventListener('fruitStateUpdated', update);
        
        const bg = new Image(); bg.src = BG_MEADOW; 
        bg.onload = () => { bgImgRef.current = bg; };
        const charImg = new Image();
        charImg.src = BOO_CHARACTER;
        charImg.onload = () => { booImgRef.current = charImg; };

        return () => window.removeEventListener('fruitStateUpdated', update);
    }, []);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        playerPos.current = { x: canvas.width / 2, y: canvas.height - 200 };
    };

    useEffect(() => {
        initCanvas();
        window.addEventListener('resize', initCanvas);
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => {
            window.removeEventListener('resize', initCanvas);
            cancelAnimationFrame(requestRef.current);
        };
    }, [gameStatus, isHit, isInvulnerable]);

    useEffect(() => {
        let timer: any;
        if (gameStatus === 'PLAYING' && timeLeft > 0 && !isHit) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if ((timeLeft === 0 || lives <= 0) && gameStatus === 'PLAYING') {
            // Nuova regola: vittoria se timeLeft è 0 e lives > 0
            if (timeLeft === 0 && lives > 0) {
                const nextLevel = roundLevel + 1;
                const updatedState = { ...getFruitGameState(), reachedLevel: nextLevel };
                saveFruitGameState(updatedState);
                setRoundLevel(nextLevel);
            }
            
            setGameStatus('SUMMARY');
            isDragging.current = false;
        }
        return () => clearInterval(timer);
    }, [gameStatus, timeLeft, lives, isHit, roundLevel]);

    const startRound = (mode: 'next' | 'restart' | 'initial') => {
        unlockAudioContext();
        const currentState = getFruitGameState();
        const currentReachedLevel = currentState.reachedLevel || 1;

        if (mode === 'initial') {
            setRoundLevel(currentReachedLevel);
        } else if (mode === 'next') {
            setRoundLevel(currentReachedLevel);
        } else if (mode === 'restart') {
            setRoundLevel(currentReachedLevel);
        }

        setLives(3);
        setRoundStats({ strawberries: 0, bananas: 0, grapes: 0, oranges: 0, apples: 0, pears: 0, pineapples: 0, watermelons: 0 });
        setTimeLeft(ROUND_TIME);
        setIsHit(false);
        setIsInvulnerable(false);
        hitEndTimeRef.current = 0;
        invulnEndTimeRef.current = 0;
        fruitsRef.current = [];
        bubblesRef.current = [];
        setGameStatus('PLAYING');
        bgY.current = 0;
    };

    const spawnFruit = (canvas: HTMLCanvasElement) => {
        if (Math.random() > 0.04) return;
        const rand = Math.random();
        
        const isMobile = window.innerWidth < 768;
        const fruitBaseSize = isMobile ? 42 : 60;
        
        const leftMargin = isMobile ? 40 : 60;
        const rightMargin = isMobile ? 20 : 40;
        const availableWidth = canvas.width - (leftMargin + rightMargin + fruitBaseSize);

        let type = 'strawberries'; let hp = 2; let emoji = '🍓'; let size = fruitBaseSize; let baseSpeed = 1.8;
        if (rand > 0.96) { type = 'watermelons'; hp = 7; emoji = '🍉'; baseSpeed = 1.0; }
        else if (rand > 0.90) { type = 'pineapples'; hp = 6; emoji = '🍍'; baseSpeed = 1.4; }
        else if (rand > 0.82) { type = 'pears'; hp = 5; emoji = '🍐'; baseSpeed = 1.6; }
        else if (rand > 0.74) { type = 'apples'; hp = 4; emoji = '🍎'; baseSpeed = 1.5; }
        else if (rand > 0.65) { type = 'oranges'; hp = 4; emoji = '🍊'; baseSpeed = 1.8; }
        else if (rand > 0.50) { type = 'grapes'; hp = 3; emoji = '🍇'; baseSpeed = 2.4; }
        else if (rand > 0.35) { type = 'bananas'; hp = 3; emoji = '🍌'; baseSpeed = 2.0; }

        const difficultyLevel = gameStatus === 'PLAYING' ? (roundLevel - 1 || 1) : roundLevel;
        const speedMultiplier = 1 + (difficultyLevel - 1) * 0.12;
        
        fruitsRef.current.push({
            id: Date.now() + Math.random(),
            x: leftMargin + Math.random() * availableWidth,
            y: -size, w: size, h: size, type, hp, maxHp: hp,
            speed: (baseSpeed + Math.random()) * speedMultiplier, emoji,
            isTrapped: false
        });
    };

    const shootBubble = () => {
        if (isHit) return;
        const now = Date.now();
        const interval = 450 - (gameState.upgrades.fireRate * 70);
        if (now - lastShotTime.current > interval) {
            bubblesRef.current.push({
                id: Date.now(), 
                x: playerPos.current.x + 23, 
                y: playerPos.current.y - 40,
                w: 25, h: 25, type: 'bubble', speed: 10, emoji: '🫧'
            });
            lastShotTime.current = now;
            playSfx('SHOOT');
        }
    };

    const handleHit = () => {
        if (isInvulnerable || isHit) return;
        setIsHit(true);
        setIsInvulnerable(false);
        setLives(prev => prev - 1);
        isDragging.current = false;
        playSfx('HURT');
        const now = Date.now();
        hitEndTimeRef.current = now + 2000;
        invulnEndTimeRef.current = now + 4000;
    };

    const gameLoop = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || isShopOpen) {
            requestRef.current = requestAnimationFrame(gameLoop);
            return;
        }
        const now = Date.now();
        if (isHit && now > hitEndTimeRef.current) { setIsHit(false); setIsInvulnerable(true); }
        if (isInvulnerable && now > invulnEndTimeRef.current) { setIsInvulnerable(false); }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (bgImgRef.current) {
            const img = bgImgRef.current;
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const drawW = img.width * scale; const drawH = img.height * scale;
            const offsetX = (canvas.width - drawW) / 2;
            if (gameStatus === 'PLAYING' && !isHit) {
                bgY.current += 2.0; if (bgY.current >= drawH) bgY.current = 0;
            }
            ctx.drawImage(img, offsetX, bgY.current, drawW, drawH);
            ctx.drawImage(img, offsetX, bgY.current - drawH, drawW, drawH);
        }
        
        if (gameStatus === 'PLAYING') {
            if (!isHit) {
                spawnFruit(canvas);
                if (isDragging.current) shootBubble();
                
                if (gameState.upgrades.magnet > 0) {
                    const magnetRadius = 150 + (gameState.upgrades.magnet * 60);
                    const magnetForce = 0.5 + (gameState.upgrades.magnet * 0.8);
                    
                    fruitsRef.current.forEach(f => {
                        if (!f.isTrapped) {
                            const dx = playerPos.current.x - (f.x + f.w/2);
                            const dy = playerPos.current.y - (f.y + f.h/2);
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            if (dist < magnetRadius) {
                                f.x += (dx / dist) * magnetForce;
                            }
                        }
                    });
                }

                bubblesRef.current.forEach((b, i) => {
                    b.y -= b.speed; if (b.y < -50) bubblesRef.current.splice(i, 1);
                });
                fruitsRef.current.forEach((f, i) => {
                    if (f.isTrapped) {
                        f.y -= f.speed * 2.5; 
                        if (f.y < -100) fruitsRef.current.splice(i, 1);
                    } else {
                        f.y += f.speed;
                        bubblesRef.current.forEach((b, bi) => {
                            const dist = Math.sqrt(Math.pow(b.x - (f.x + b.w/2), 2) + Math.pow(b.y - (f.y + f.h/2), 2));
                            if (dist < (f.w/2 + b.w/2)) {
                                bubblesRef.current.splice(bi, 1);
                                if (f.hp !== undefined) f.hp -= gameState.upgrades.power;
                                if (f.hp !== undefined && f.hp <= 0) {
                                    playSfx('POP');
                                    f.isTrapped = true; 
                                    setRoundStats(prev => {
                                        const next = { ...prev };
                                        // @ts-ignore
                                        next[f.type]++;
                                        return next;
                                    });
                                    const newState = { ...getFruitGameState() };
                                    // @ts-ignore
                                    newState.inventory[f.type]++;
                                    saveFruitGameState(newState);
                                }
                            }
                        });
                        if (!isInvulnerable && !isHit) {
                            const playerDist = Math.sqrt(Math.pow(playerPos.current.x - (f.x + f.w/2), 2) + Math.pow(playerPos.current.y - (f.y + f.h/2), 2));
                            if (playerDist < (40 + f.w/3)) { handleHit(); }
                        }
                        if (f.y > canvas.height + 100) fruitsRef.current.splice(i, 1);
                    }
                });
            } else {
                shakeOffset.current = { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 };
            }
        }

        bubblesRef.current.forEach(b => {
            ctx.save();
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(b.emoji, b.x, b.y);
            ctx.restore();
        });

        fruitsRef.current.forEach(f => {
            ctx.save();
            const centerX = f.x + f.w/2;
            const centerY = f.y + f.h/2;
            if (f.isTrapped) {
                const radius = f.w * 0.75;
                const grad = ctx.createRadialGradient(centerX - radius * 0.2, centerY - radius * 0.2, radius * 0.2, centerX, centerY, radius);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
                grad.addColorStop(0.5, 'rgba(170, 220, 255, 0.15)');
                grad.addColorStop(0.9, 'rgba(200, 240, 255, 0.4)');
                grad.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(centerX - radius * 0.4, centerY - radius * 0.4, radius * 0.25, radius * 0.12, -Math.PI / 4, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
                ctx.shadowBlur = 15;
                ctx.shadowColor = "white";
            }
            ctx.font = `${f.w}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(f.emoji, centerX, centerY);
            if (!f.isTrapped && f.hp && f.maxHp && f.maxHp > 1) {
                const barW = f.w;
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.fillRect(f.x, f.y - 10, barW, 6);
                ctx.fillStyle = f.hp <= 1 ? '#ef4444' : '#4ade80';
                ctx.fillRect(f.x, f.y - 10, barW * (f.hp / f.maxHp), 6);
            }
            ctx.restore();
        });

        if (gameStatus !== 'SUMMARY') {
            const isFlashing = isInvulnerable && Math.floor(now / 150) % 2 === 0;
            let shouldDraw = true;
            let currentShakeX = 0; let currentShakeY = 0;
            if (isHit) {
                const elapsed = 2000 - (hitEndTimeRef.current - now);
                if (elapsed < 500) { currentShakeX = shakeOffset.current.x; currentShakeY = shakeOffset.current.y; }
                else { shouldDraw = false; }
            } else if (isFlashing) { shouldDraw = false; }
            if (shouldDraw) {
                const charW = 70;
                const charH = 90;
                if (booImgRef.current) { 
                    ctx.drawImage(booImgRef.current, playerPos.current.x - (charW / 2) + currentShakeX, playerPos.current.y - (charH / 2) + currentShakeY, charW, charH); 
                } else { 
                    ctx.save();
                    ctx.font = '60px Arial'; 
                    ctx.textAlign = 'center'; 
                    ctx.textBaseline = 'middle';
                    ctx.fillText('👻', playerPos.current.x + currentShakeX, playerPos.current.y + currentShakeY); 
                    ctx.restore();
                }
            }
        }
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleInputStart = (e: any) => {
        if (e.target.closest('button') || e.target.closest('.ui-layer')) return;
        if (gameStatus !== 'PLAYING' || isHit) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const dist = Math.sqrt(Math.pow(x - playerPos.current.x, 2) + Math.pow(y - playerPos.current.y, 2));
        
        if (dist < 120) {
            isDragging.current = true;
            touchOffset.current = {
                x: x - playerPos.current.x,
                y: y - playerPos.current.y
            };
        }
    };

    const updatePlayerPos = (e: any) => {
        if (!isDragging.current || isHit) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const touchX = clientX - rect.left;
        const touchY = clientY - rect.top;

        playerPos.current.x = Math.max(45, Math.min(canvas.width - 45, touchX - touchOffset.current.x));
        playerPos.current.y = Math.max(100, Math.min(canvas.height - 125, touchY - touchOffset.current.y));
    };

    const hasWon = timeLeft === 0 && lives > 0;

    return (
        <div className="absolute inset-0 z-50 bg-green-900 flex flex-col animate-in fade-in overflow-hidden">
            <div className="ui-layer bg-amber-800/90 backdrop-blur-md p-3 border-b-4 border-black flex justify-between items-center z-20 shadow-xl shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="bg-red-500 text-white p-2 rounded-full border-2 border-black hover:scale-110 active:scale-95 transition-transform shadow-md">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="bg-yellow-400 px-3 py-1 rounded-full border-2 border-black font-black flex items-center gap-2 text-black shadow-sm text-xs md:text-sm">
                        {gameState.banknotes} 💵
                    </div>
                </div>
                <button onClick={() => { setIsShopOpen(true); }} className="bg-green-600 text-white px-3 py-1.5 rounded-xl border-2 border-black font-black flex items-center gap-2 shadow-[2px_2px_0_black] hover:scale-105 active:translate-y-0.5 transition-all text-xs">
                    <Store size={16} /> FIENILE
                </button>
            </div>

            <div ref={containerRef} className="flex-1 relative overflow-hidden bg-sky-200" onMouseDown={handleInputStart} onTouchStart={handleInputStart}>
                <canvas 
                    ref={canvasRef} 
                    className="w-full h-full block cursor-crosshair touch-none"
                    onMouseMove={(e) => updatePlayerPos(e)}
                    onMouseUp={() => isDragging.current = false}
                    onMouseLeave={() => isDragging.current = false}
                    onTouchMove={(e) => updatePlayerPos(e)}
                    onTouchEnd={() => isDragging.current = false}
                />

                {gameStatus === 'PLAYING' && (
                    <div className="ui-layer pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between z-40 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg pointer-events-auto">
                        <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-[60px]">
                            <div className={`flex items-center gap-1.5 transition-all ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                <Clock size={16} strokeWidth={3} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
                                <span className="text-lg font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{timeLeft}s</span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setSfxEnabled(!sfxEnabled); }}
                                className={`p-1.5 rounded-lg border border-black/20 transition-all active:scale-95 shadow-md ${sfxEnabled ? 'bg-cyan-400 text-black' : 'bg-gray-400 text-gray-200'}`}
                            >
                                {sfxEnabled ? <Volume2 size={14} strokeWidth={3} /> : <VolumeX size={14} strokeWidth={3} />}
                            </button>
                        </div>

                        <div className="flex-1 grid grid-cols-8 gap-0.5 md:gap-1 px-1 items-center justify-items-center">
                            {FRUIT_TYPES.map((fruit) => {
                                // @ts-ignore
                                const count = roundStats[fruit.key];
                                return (
                                    <div key={fruit.key} className={`flex flex-col items-center transition-all duration-300 ${count > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                                        <span className="text-xl md:text-2xl drop-shadow-md">{fruit.emoji}</span>
                                        <div className="text-yellow-400 text-sm md:text-lg font-black -mt-1 relative z-10 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-[70px]">
                            <div className="text-white font-black text-[10px] px-2 py-0.5 rounded-full bg-black/30 border border-white/10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] uppercase">
                                LIV {gameStatus === 'PLAYING' ? roundLevel : (hasWon ? roundLevel - 1 : roundLevel)}
                            </div>
                            <div className="flex gap-0.5">
                                {[...Array(3)].map((_, i) => (
                                    <Heart key={i} size={16} strokeWidth={3} className={`transition-all duration-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-400/50 fill-transparent'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {gameStatus === 'START' && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in z-30">
                        <div className="bg-white p-8 rounded-[40px] border-8 border-amber-900 shadow-2xl transform -rotate-1 max-w-md relative flex flex-col items-center">
                            <button onClick={onBack} className="absolute -top-6 -right-6 hover:scale-110 active:scale-95 transition-all outline-none z-10">
                                <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-xl" />
                            </button>
                            <img src={TITLE_LOGO_IMG} alt="Caccia alla Frutta" className="w-[115%] h-auto -mt-6 mb-6 drop-shadow-md" />
                            <p className="text-gray-600 font-bold mb-4 text-lg">Sei al livello <span className="text-purple-600">{roundLevel}</span></p>
                            <div className="text-gray-600 font-bold mb-8 text-lg leading-snug px-4">
                                Imprigiona i frutti con le bolle per venderli al fienile e aumentare la potenza di Boo!
                            </div>
                            <button onClick={() => startRound('initial')} className="hover:scale-105 active:scale-95 transition-all outline-none">
                                <img src={BTN_START_IMG} alt="Inizia" className="w-48 h-auto drop-shadow-xl" />
                            </button>
                        </div>
                    </div>
                )}

                {gameStatus === 'SUMMARY' && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in z-50 overflow-hidden">
                        <div className="bg-white rounded-[40px] border-8 border-amber-900 p-5 w-full max-w-md text-center shadow-2xl relative flex flex-col items-center">
                            <button onClick={onBack} className="absolute -top-4 -right-4 hover:scale-110 active:scale-95 transition-all outline-none z-10">
                                <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-xl" />
                            </button>
                            
                            <img 
                                src={hasWon ? IMG_LEVEL_COMPLETED : IMG_GAME_OVER} 
                                alt={hasWon ? 'Livello Completato' : 'Game Over'} 
                                className="h-48 md:h-80 w-auto mb-2 drop-shadow-lg" 
                            />

                            <h3 className={`text-2xl font-black mb-1 uppercase ${hasWon ? 'text-green-600' : 'text-red-600'}`}>
                                {hasWon ? 'Ottimo lavoro!' : 'Riprova ancora!'}
                            </h3>
                            <p className="text-gray-600 font-bold mb-3 text-sm">
                                {hasWon ? 'Hai catturato un bel po\' di frutta!' : 'Non mollare, Boo ha bisogno di te!'}
                            </p>

                            <div className="bg-amber-50 rounded-2xl p-3 border-4 border-amber-100 mb-4 grid grid-cols-4 gap-2 shadow-inner w-full">
                                {FRUIT_TYPES.map((item) => (
                                    <div key={item.key} className="bg-white p-1 rounded-lg border border-amber-100 flex flex-col items-center">
                                        <span className="text-xl">{item.emoji}</span>
                                        <span className="font-black text-gray-800 text-xs">x{roundStats[item.key as keyof typeof roundStats] || 0}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row gap-4 items-center justify-center w-full">
                                {hasWon ? (
                                    <button onClick={() => startRound('next')} className="hover:scale-105 active:scale-95 transition-all outline-none flex-1">
                                        <img src={BTN_NEXT_LEVEL_IMG} alt="Prossimo Livello" className="h-16 w-auto drop-shadow-xl mx-auto" />
                                    </button>
                                ) : (
                                    <button onClick={() => startRound('restart')} className="hover:scale-105 active:scale-95 transition-all outline-none flex-1">
                                        <img src={BTN_RETRY_IMG} alt="Ricomincia" className="h-16 w-auto drop-shadow-xl mx-auto" />
                                    </button>
                                )}
                                <button onClick={() => { setIsShopOpen(true); setGameStatus('START'); }} className="hover:scale-105 active:scale-95 transition-all outline-none flex-1">
                                    <img src={BTN_GO_BARN_IMG} alt="Vai al Fienile" className="h-14 w-auto drop-shadow-xl mx-auto" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isShopOpen && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] border-8 border-amber-900 p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto flex flex-col shadow-2xl relative">
                        <button onClick={() => setIsShopOpen(false)} className="absolute top-4 right-4 hover:scale-110 active:scale-95 transition-all outline-none z-10">
                            <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg" />
                        </button>
                        <div className="text-center mb-6 pt-4">
                            <img src={BARN_HEADER_IMG} alt="Il Fienile di Boo" className="h-16 md:h-24 w-auto mx-auto mb-2 drop-shadow-lg" />
                            <div className="bg-yellow-400 px-4 py-2 rounded-full border-2 border-black inline-flex items-center gap-2 font-black text-black shadow-md">
                                {gameState.banknotes} 💵
                            </div>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-3xl border-4 border-amber-200 mb-8 shadow-inner">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                {FRUIT_TYPES.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center p-2 bg-white rounded-2xl border-2 border-amber-100 shadow-sm">
                                        <span className="text-3xl mb-1">{item.emoji}</span>
                                        <span className="font-black text-amber-900">
                                            {item.key === 'strawberries' ? 2 : 
                                             item.key === 'bananas' ? 3 : 
                                             item.key === 'grapes' ? 7 : 
                                             item.key === 'oranges' ? 10 : 
                                             item.key === 'apples' ? 13 : 
                                             item.key === 'pears' ? 15 : 
                                             item.key === 'pineapples' ? 17 : 20} 💵
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">NEL CESTO: {gameState.inventory[item.key as keyof typeof gameState.inventory]}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => { const earned = sellFruit(); if (earned > 0) setGameState(getFruitGameState()); else alert("Il cesto è vuoto! 🍎"); }} className="w-full hover:scale-105 active:scale-95 transition-all outline-none flex items-center justify-center">
                                <img src={BTN_SELL_ALL_IMG} alt="Vendi Tutto" className="w-1/2 h-auto drop-shadow-xl" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                            {[
                                { id: 'fireRate', label: 'Velocità Bolle', img: ICON_UP_SPEED, color: 'bg-orange-500' },
                                { id: 'power', label: 'Super Forza', img: ICON_UP_POWER, color: 'bg-blue-500' },
                                { id: 'magnet', label: 'Calamita Frutta', img: ICON_UP_MAGNET, color: 'bg-purple-500' },
                                { id: 'shield', label: 'Scudo Magico', img: ICON_UP_SHIELD, color: 'bg-red-500' }
                            ].map((up) => {
                                const level = gameState.upgrades[up.id as keyof FruitUpgrades] as number;
                                const costs = [200, 500, 1200, 2500, 5000];
                                const cost = costs[level] || 0;
                                return (
                                    <div key={up.id} className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 flex flex-col shadow-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 flex items-center justify-center shrink-0"><img src={up.img} alt={up.label} className="w-full h-full object-contain" /></div>
                                            <span className="font-black text-gray-800 uppercase text-sm tracking-tight">{up.label}</span>
                                        </div>
                                        <div className="flex gap-1.5 mb-4 px-1">
                                            {[1,2,3,4,5].map(i => (<div key={i} className={`flex-1 h-3 rounded-full border border-black/10 ${i <= level ? up.color : 'bg-gray-200'}`}></div>))}
                                        </div>
                                        {level < 5 ? (
                                            <button onClick={() => { if (buyFruitUpgrade(up.id as any)) setGameState(getFruitGameState()); }} disabled={gameState.banknotes < cost} className={`py-2 rounded-xl font-black text-sm border-b-4 transition-all active:border-b-0 active:translate-y-1 ${gameState.banknotes >= cost ? 'bg-yellow-400 border-yellow-600 text-black shadow-md' : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'}`}>POTENZIA ({cost} 💵)</button>
                                        ) : (
                                            <div className="bg-green-100 text-green-700 py-2 rounded-xl text-center font-black text-sm border-2 border-green-200">MAX! ✨</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FruitCatcherGame;