import React, { useState, useEffect, useRef } from 'react';
import { Store, ArrowLeft, Clock, Heart, Volume2, VolumeX } from 'lucide-react';
import { getFruitGameState, saveFruitGameState, FruitGameState, sellFruit, buyFruitUpgrade, FruitUpgrades } from '../services/fruitGameLogic';

const BG_MEADOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fruit-bg.webp';
const BOO_CHARACTER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boo-shooter.webp';
const ROUND_TIME = 60;
const BTN_START_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/startfruit.webp';
const BTN_NEXT_LEVEL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fruit-next.webp';
const BTN_RETRY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fruit-retry.webp';
const BTN_GO_BARN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fruit-go-barn.webp';
const BARN_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/barn-header.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const BTN_SELL_ALL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-sell-all.webp';
const ICON_UP_SPEED = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/up-speed.webp';
const ICON_UP_POWER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/up-power.webp';
const ICON_UP_MAGNET = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/up-magnet.webp';
const ICON_UP_SHIELD = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/up-shield.webp';
const TITLE_LOGO_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fruit-hunt.webp';

const IMG_GAME_OVER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gameover-fruit.webp';
const IMG_LEVEL_COMPLETED = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fruit-win.webp';

// Costanti per il controllo del framerate (60 FPS fissi)
const TARGET_FPS = 60;
const FRAME_DURATION = 1000 / TARGET_FPS;

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
    const lastFrameTime = useRef<number>(0); // Per controllo velocità su mobile 120Hz
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
        setRoundLevel(currentReachedLevel);
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
        lastFrameTime.current = performance.now();
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

        const difficultyLevel = roundLevel || 1;
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

    const gameLoop = (timestamp: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || isShopOpen) {
            requestRef.current = requestAnimationFrame(gameLoop);
            return;
        }

        // --- SINCRONIZZAZIONE VELOCITÀ GIOCO ---
        const elapsed = timestamp - lastFrameTime.current;
        if (elapsed < FRAME_DURATION && gameStatus === 'PLAYING') {
            requestRef.current = requestAnimationFrame(gameLoop);
            return;
        }
        lastFrameTime.current = timestamp;

        const now = Date.now();
        if (isHit && now > hitEndTimeRef.current) { setIsHit(false); setIsInvulnerable(true); }
        if (isInvulnerable && now > invulnEndTimeRef.current) { setIsInvulnerable(false); }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // DISEGNO SFONDO A TUTTO SCHERMO
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
                            if (dist < magnetRadius) { f.x += (dx / dist) * magnetForce; }
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
                            const playerDist = Math.sqrt(Math.pow(playerPos.current.x - (f.x + f.w/3), 2) + Math.pow(playerPos.current.y - (f.y + f.h/3), 2));
                            // Riduzione area di collisione da 40 a 25 per facilitare il passaggio tra i frutti
                            if (playerDist < (25 + f.w/3)) { handleHit(); }
                        }
                        if (f.y > canvas.height + 100) fruitsRef.current.splice(i, 1);
                    }
                });
            } else {
                shakeOffset.current = { x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15 };
            }
        }

        bubblesRef.current.forEach(b => {
            ctx.save(); ctx.font = '24px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(b.emoji, b.x, b.y); ctx.restore();
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
                ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
            }
            ctx.font = `${f.w}px Arial`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(f.emoji, centerX, centerY);
            if (!f.isTrapped && f.hp && f.maxHp && f.maxHp > 1) {
                const barW = f.w; ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(f.x, f.y - 10, barW, 6);
                ctx.fillStyle = f.hp <= 1 ? '#ef4444' : '#4ade80'; ctx.fillRect(f.x, f.y - 10, barW * (f.hp / f.maxHp), 6);
            }
            ctx.restore();
        });

        if (gameStatus !== 'SUMMARY') {
            const isFlashing = isInvulnerable && Math.floor(now / 150) % 2 === 0;
            let shouldDraw = true;
            let currentShakeX = 0; let currentShakeY = 0;
            if (isHit) {
                const elapsedHurt = 2000 - (hitEndTimeRef.current - now);
                if (elapsedHurt < 500) { currentShakeX = shakeOffset.current.x; currentShakeY = shakeOffset.current.y; }
                else { shouldDraw = false; }
            } else if (isFlashing) { shouldDraw = false; }
            if (shouldDraw) {
                // Riduzione larghezza Boo da 70 a 50 per scivolare meglio tra i frutti
                const charW = 50; const charH = 90;
                if (booImgRef.current) { 
                    ctx.drawImage(booImgRef.current, playerPos.current.x - (charW / 2) + currentShakeX, playerPos.current.y - (charH / 2) + currentShakeY, charW, charH); 
                } else { 
                    ctx.save(); ctx.font = '60px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('👻', playerPos.current.x + currentShakeX, playerPos.current.y + currentShakeY); ctx.restore();
                }
            }
        }
        requestRef.current = requestAnimationFrame(gameLoop);
    };

    const handleInputStart = (e: any) => {
        if (e.target.closest('button') || e.target.closest('.ui-layer')) return;
        if (gameStatus !== 'PLAYING' || isHit) return;
        const canvas = canvasRef.current; if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left; const y = clientY - rect.top;
        const dist = Math.sqrt(Math.pow(x - playerPos.current.x, 2) + Math.pow(y - playerPos.current.y, 2));
        if (dist < 120) {
            isDragging.current = true;
            touchOffset.current = { x: x - playerPos.current.x, y: y - playerPos.current.y };
        }
    };

    const updatePlayerPos = (e: any) => {
        if (!isDragging.current || isHit) return;
        const canvas = canvasRef.current; if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const touchX = clientX - rect.left; const touchY = clientY - rect.top;
        playerPos.current.x = Math.max(45, Math.min(canvas.width - 45, touchX - touchOffset.current.x));
        playerPos.current.y = Math.max(100, Math.min(canvas.height - 125, touchY - touchOffset.current.y));
    };

    const hasWon = timeLeft === 0 && lives > 0;

    return (
        <div className="fixed inset-0 z-0 bg-sky-200 flex flex-col animate-in fade-in overflow-hidden">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
            
            {/* FLOATING GAME UI - Posizionata sotto l'header globale */}
            <div className="ui-layer absolute top-20 md:top-28 left-0 right-0 p-3 md:p-6 flex justify-between items-center z-50 pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto">
                    <button onClick={onBack} className="bg-red-500 text-white p-2 md:p-3 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-transform shadow-xl">
                        <ArrowLeft size={24} strokeWidth={3} />
                    </button>
                </div>
                {/* Saldo banconote posizionato a destra al posto del tasto fienile */}
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border-4 border-black font-black flex items-center gap-2 text-black shadow-xl text-sm md:text-lg pointer-events-auto">
                    {gameState.banknotes} 💵
                </div>
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
                    <div className="ui-layer pointer-events-none absolute bottom-6 left-4 right-4 flex items-center justify-between z-40 bg-black/40 backdrop-blur-md border-4 border-white/20 rounded-[2.5rem] p-3 shadow-2xl pointer-events-auto max-w-2xl mx-auto">
                        <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-[80px]">
                            <div className={`flex items-center gap-2 transition-all ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                <Clock size={20} strokeWidth={4} className="drop-shadow-md" />
                                <span className="text-2xl font-black drop-shadow-md">{timeLeft}s</span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setSfxEnabled(!sfxEnabled); }}
                                className={`p-2 rounded-xl border-2 border-black/20 transition-all active:scale-95 shadow-md ${sfxEnabled ? 'bg-cyan-400 text-black' : 'bg-gray-400 text-gray-200'}`}
                            >
                                {sfxEnabled ? <Volume2 size={18} strokeWidth={3} /> : <VolumeX size={18} strokeWidth={3} />}
                            </button>
                        </div>

                        <div className="flex-1 grid grid-cols-8 gap-1 md:gap-3 px-2 w-full items-center justify-items-center">
                            {FRUIT_TYPES.map((fruit) => {
                                // @ts-ignore
                                const count = roundStats[fruit.key];
                                return (
                                    <div key={fruit.key} className={`flex flex-col items-center transition-all duration-300 ${count > 0 ? 'opacity-100 scale-110' : 'opacity-15 scale-75'}`}>
                                        <span className="text-2xl md:text-3xl drop-shadow-md">{fruit.emoji}</span>
                                        <div className="text-yellow-400 text-[10px] md:text-base font-black -mt-1 relative z-10 text-center drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{count}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-[90px]">
                            <div className="text-white font-black text-[10px] px-3 py-1 rounded-full bg-black/30 border-2 border-white/20 drop-shadow-md uppercase mb-1">
                                LIV {roundLevel}
                            </div>
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <Heart key={i} size={22} strokeWidth={3} className={`transition-all duration-300 drop-shadow-md ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-400/50 fill-transparent'}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {gameStatus === 'START' && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in z-50">
                        <div className="bg-white p-8 rounded-[40px] border-8 border-amber-900 shadow-2xl transform -rotate-1 max-w-md relative flex flex-col items-center">
                            <button onClick={onBack} className="absolute -top-6 -right-6 hover:scale-110 active:scale-95 transition-all outline-none z-10">
                                <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-xl" />
                            </button>
                            <img src={TITLE_LOGO_IMG} alt="Caccia alla Frutta" className="w-[115%] h-auto -mt-6 mb-6 drop-shadow-md" />
                            <p className="text-gray-600 font-bold mb-4 text-xl">Livello Attuale: <span className="text-purple-600 font-black">{roundLevel}</span></p>
                            <p className="text-gray-600 font-bold mb-8 text-lg leading-snug px-4">
                                Imprigiona i frutti con le bolle per venderli al fienile e aumentare la potenza di Boo!
                            </p>
                            <button onClick={() => startRound('initial')} className="hover:scale-105 active:scale-95 transition-all outline-none">
                                <img src={BTN_START_IMG} alt="Inizia" className="w-56 h-auto drop-shadow-xl" />
                            </button>
                        </div>
                    </div>
                )}

                {gameStatus === 'SUMMARY' && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in z-[60] overflow-hidden">
                        <div className="bg-white rounded-[40px] border-8 border-amber-900 p-6 w-full max-w-md text-center shadow-2xl relative flex flex-col items-center">
                            <button onClick={onBack} className="absolute -top-4 -right-4 hover:scale-110 active:scale-95 transition-all outline-none z-10">
                                <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-18 md:h-18 object-contain drop-shadow-xl" />
                            </button>
                            <img src={hasWon ? IMG_LEVEL_COMPLETED : IMG_GAME_OVER} alt="" className="h-48 md:h-72 w-auto mb-2 drop-shadow-lg" />
                            <h3 className={`text-3xl font-black mb-1 uppercase ${hasWon ? 'text-green-600' : 'text-red-600'}`}>
                                {hasWon ? 'Ottimo lavoro!' : 'Riprova ancora!'}
                            </h3>
                            <div className="bg-amber-50 rounded-3xl p-4 border-4 border-amber-100 mb-6 grid grid-cols-4 gap-2 shadow-inner w-full">
                                {FRUIT_TYPES.map((item) => (
                                    <div key={item.key} className="bg-white p-1 rounded-xl border-2 border-amber-100 flex flex-col items-center">
                                        <span className="text-2xl">{item.emoji}</span>
                                        <span className="font-black text-gray-800 text-sm">x{roundStats[item.key as keyof typeof roundStats] || 0}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row gap-4 items-center justify-center w-full">
                                {hasWon ? (
                                    <button onClick={() => startRound('next')} className="hover:scale-105 active:scale-95 transition-all outline-none flex-1">
                                        <img src={BTN_NEXT_LEVEL_IMG} alt="Prossimo Livello" className="h-16 md:h-24 w-auto drop-shadow-xl mx-auto" />
                                    </button>
                                ) : (
                                    <button onClick={() => startRound('restart')} className="hover:scale-105 active:scale-95 transition-all outline-none flex-1">
                                        <img src={BTN_RETRY_IMG} alt="Ricomincia" className="h-20 w-auto drop-shadow-xl mx-auto" />
                                    </button>
                                )}
                                <button onClick={() => { setIsShopOpen(true); setGameStatus('START'); }} className="hover:scale-105 active:scale-95 transition-all outline-none flex-1">
                                    <img src={BTN_GO_BARN_IMG} alt="Vai al Fienile" className="h-16 w-auto drop-shadow-xl mx-auto" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isShopOpen && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] border-8 border-amber-900 p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col shadow-2xl relative">
                        <button onClick={() => setIsShopOpen(false)} className="absolute top-4 right-4 hover:scale-110 active:scale-95 transition-all outline-none z-10">
                            <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg" />
                        </button>
                        <div className="text-center mb-4 pt-4">
                            <img src={BARN_HEADER_IMG} alt="Il Fienile di Boo" className="h-16 md:h-22 w-auto mx-auto mb-2 drop-shadow-lg" />
                            <div className="bg-yellow-400 px-6 py-2 rounded-full border-4 border-black inline-flex items-center gap-2 font-black text-black shadow-md text-xl">
                                {gameState.banknotes} 💵
                            </div>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-3xl border-4 border-amber-200 mb-8 shadow-inner">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                {FRUIT_TYPES.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center p-2 bg-white rounded-2xl border-2 border-amber-100 shadow-sm">
                                        <span className="text-4xl mb-1">{item.emoji}</span>
                                        <span className="font-black text-amber-900">
                                            {item.key === 'strawberries' ? 2 : 
                                             item.key === 'bananas' ? 3 : 
                                             item.key === 'grapes' ? 7 : 
                                             item.key === 'oranges' ? 10 : 
                                             item.key === 'apples' ? 13 : 
                                             item.key === 'pears' ? 15 : 
                                             item.key === 'pineapples' ? 17 : 20} 💵
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">IN CESTO: {gameState.inventory[item.key as keyof typeof gameState.inventory]}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => { const earned = sellFruit(); if (earned > 0) setGameState(getFruitGameState()); else alert("Il cesto è vuoto! 🍎"); }} className="w-full hover:scale-105 active:scale-95 transition-all outline-none flex items-center justify-center">
                                <img src={BTN_SELL_ALL_IMG} alt="Vendi Tutto" className="w-1/2 md:w-1/4 h-auto drop-shadow-xl" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                            {[
                                { id: 'fireRate', label: 'Velocità Bolle', img: ICON_UP_SPEED, color: 'bg-orange-500' },
                                { id: 'power', label: 'Super Forza', img: ICON_UP_POWER, color: 'bg-blue-500' },
                                { id: 'magnet', label: 'Calamita Frutta', img: ICON_UP_MAGNET, color: 'bg-purple-500' },
                                { id: 'shield', label: 'Scudo Magico', img: ICON_UP_SHIELD, color: 'bg-red-500' }
                            ].map((up) => {
                                const upLevel = gameState.upgrades[up.id as keyof FruitUpgrades] as number;
                                const costs = [200, 500, 1200, 2500, 5000];
                                const upCost = costs[upLevel] || 0;
                                return (
                                    <div key={up.id} className="bg-gray-50 p-4 rounded-3xl border-2 border-gray-200 flex flex-col shadow-sm">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-14 h-14 flex items-center justify-center shrink-0"><img src={up.img} alt={up.label} className="w-full h-full object-contain" /></div>
                                            <span className="font-black text-gray-800 uppercase text-base tracking-tight">{up.label}</span>
                                        </div>
                                        <div className="flex gap-1.5 mb-4 px-1">
                                            {[1,2,3,4,5].map(lv => (<div key={lv} className={`flex-1 h-3.5 rounded-full border border-black/10 ${lv <= upLevel ? up.color : 'bg-gray-200'}`}></div>))}
                                        </div>
                                        {upLevel < 5 ? (
                                            <button onClick={() => { if (buyFruitUpgrade(up.id as any)) setGameState(getFruitGameState()); }} disabled={gameState.banknotes < upCost} className={`py-3 rounded-2xl font-black text-sm md:text-base border-b-6 transition-all active:border-b-0 active:translate-y-1 ${gameState.banknotes >= upCost ? 'bg-yellow-400 border-yellow-600 text-black shadow-md' : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'}`}>POTENZIA ({upCost} 💵)</button>
                                        ) : (
                                            <div className="bg-green-100 text-green-700 py-3 rounded-2xl text-center font-black text-lg border-2 border-green-200">MAX! ✨</div>
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