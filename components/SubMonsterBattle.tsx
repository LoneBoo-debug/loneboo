
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX } from 'lucide-react';
import { AppView } from '../types';
import { addTokens, getTokens } from '../services/tokens';
import { pauseSubMusic } from '../services/bgMusic';
import { TOKEN_ICON_URL } from '../constants';
import TokenIcon from './TokenIcon';

const MONSTER_IMAGES = [
    'https://loneboo-images.s3.eu-south-1.amazonaws.com/mostro1.webp',
    'https://loneboo-images.s3.eu-south-1.amazonaws.com/mostro2.webp',
    'https://loneboo-images.s3.eu-south-1.amazonaws.com/mostro3.webp',
    'https://loneboo-images.s3.eu-south-1.amazonaws.com/mostro4.webp'
];

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/antromostrorocciasub.webp';
const BTN_BACK_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tastoescimonsterbattle.webp';
const PUNCH_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/universfield-punch-03-352040.mp3';
const BGM_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tunetank-epic-battle-music-347288.mp3';
const EARTHQUAKE_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/themediaguy-earthquake-rumble-amp-cracking-379298.mp3';
const GLASS_BREAK_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/charlie_raven-glass-breaking-93803.mp3';
const AUDIO_TOGGLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

const BROKEN_SCREEN_IMAGES = [
    'https://loneboo-images.s3.eu-south-1.amazonaws.com/1schermorotto.webp',
    'https://loneboo-images.s3.eu-south-1.amazonaws.com/2schermorotto.webp',
    'https://loneboo-images.s3.eu-south-1.amazonaws.com/3schermorotto.webp'
];

// Monster Layers
const MONSTER_BODY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mostronudobusto661.webp';
const ARM_L_SANO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sinistrosanomostro.webp';
const ARM_L_ROTTO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sinistrorottomonster44.webp';
const ARM_L_ATTACK = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pugnosinistromonster55.webp';
const ARM_R_SANO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/destrosanomonster55.webp';
const ARM_R_ROTTO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/destrorottomonster44.webp';
const ARM_R_ATTACK = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pugnodestromonster66.webp';
const LEG_L_SANA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sinistrasanamonstergamba.webp';
const LEG_L_ROTTA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gambasinistrarottamonste55.webp';
const LEG_R_SANA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gambadestrasanaonwste32.webp';
const LEG_R_ROTTA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gambadestrarotta.webp';
const MONSTER_STUPITO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mostrorottostupieto55.webp';
const MONSTER_LOST = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mostrolost3e44.webp';

const MAX_HP = 1000;
const LIMB_HP = 250;
const DAMAGE_PER_HIT = 25;

type LimbId = 'ARM_L' | 'ARM_R' | 'LEG_L' | 'LEG_R';

interface Point { x: number; y: number }

interface LimbState {
    id: LimbId;
    name: string;
    hp: number;
    destroyed: boolean;
    polygon: Point[];
}

const DEFAULT_LIMBS: Record<LimbId, Point[]> = {
    "ARM_L": [
        { "x": 33.6, "y": 38.68065967016492 },
        { "x": 27.46666666666667, "y": 41.97901049475262 },
        { "x": 25.333333333333336, "y": 46.92653673163419 },
        { "x": 24, "y": 52.7736131934033 },
        { "x": 24.8, "y": 58.920539730134934 },
        { "x": 28.799999999999997, "y": 59.37031484257871 },
        { "x": 32.266666666666666, "y": 59.220389805097454 },
        { "x": 33.33333333333333, "y": 56.22188905547226 },
        { "x": 34.4, "y": 47.82608695652174 },
        { "x": 37.333333333333336, "y": 43.62818590704648 }
    ],
    "ARM_R": [
        { "x": 64.8, "y": 38.3808095952024 },
        { "x": 71.73333333333333, "y": 41.52923538230884 },
        { "x": 74.4, "y": 44.677661169415295 },
        { "x": 77.06666666666668, "y": 48.125937031484256 },
        { "x": 77.60000000000001, "y": 52.623688155922046 },
        { "x": 75.73333333333333, "y": 55.62218890554723 },
        { "x": 75.2, "y": 58.920539730134934 },
        { "x": 71.2, "y": 60.26986506746626 },
        { "x": 68, "y": 59.52023988005997 },
        { "x": 65.60000000000001, "y": 56.67166416791605 },
        { "x": 65.60000000000001, "y": 47.52623688155922 },
        { "x": 64.53333333333333, "y": 47.676161919040474 },
        { "x": 64.8, "y": 44.07796101949025 }
    ],
    "LEG_L": [
        { "x": 40.266666666666666, "y": 54.72263868065967 },
        { "x": 38.666666666666664, "y": 57.721139430284865 },
        { "x": 37.333333333333336, "y": 61.91904047976012 },
        { "x": 34.93333333333333, "y": 67.61619190404798 },
        { "x": 32.800000000000004, "y": 69.11544227886057 },
        { "x": 40, "y": 69.56521739130434 },
        { "x": 45.06666666666666, "y": 68.36581709145428 },
        { "x": 46.400000000000006, "y": 63.26836581709146 },
        { "x": 46.400000000000006, "y": 58.620689655172406 },
        { "x": 47.46666666666667, "y": 55.472263868065966 }
    ],
    "LEG_R": [
        { "x": 52.26666666666666, "y": 56.52173913043478 },
        { "x": 60, "y": 53.67316341829086 },
        { "x": 62.4, "y": 56.67166416791605 },
        { "x": 62.4, "y": 58.920539730134934 },
        { "x": 63.733333333333334, "y": 62.518740629685155 },
        { "x": 65.06666666666666, "y": 65.6671664167916 },
        { "x": 68, "y": 68.06596701649175 },
        { "x": 60.53333333333333, "y": 69.11544227886057 },
        { "x": 56.266666666666666, "y": 68.06596701649175 }
    ]
};

interface SubMonsterBattleProps {
    setView: (view: AppView, skipAnim?: boolean) => void;
}

const SubMonsterBattle: React.FC<SubMonsterBattleProps> = ({ setView }) => {
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [gameState, setGameState] = useState<'INTRO' | 'READY' | 'GO' | 'PLAYING'>('INTRO');
    const [monsterHP, setMonsterHP] = useState(MAX_HP);
    const [playerHP, setPlayerHP] = useState(MAX_HP);
    const [timeLeft, setTimeLeft] = useState(120);
    const [winPhase, setWinPhase] = useState<'PLAYING' | 'STUPITO' | 'LOST'>('PLAYING');
    const [battlePhase, setBattlePhase] = useState<'PLAYER_ATTACK' | 'DISAPPEAR_1' | 'MONSTER_ATTACK' | 'DISAPPEAR_2'>('PLAYER_ATTACK');
    const [monsterAttackType, setMonsterAttackType] = useState<'LEFT' | 'RIGHT' | 'BODY' | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [hitsReceived, setHitsReceived] = useState(0);
    const [totalTokens, setTotalTokens] = useState(() => getTokens());
    const [winRewardPhase, setWinRewardPhase] = useState<'HIDDEN' | 'BANNER' | 'SHRINKING'>('HIDDEN');
    
    // Limb logic
    const [limbs, setLimbs] = useState<Record<LimbId, LimbState>>(() => {
        const saved = localStorage.getItem('monster_limbs_polygons');
        const polys = saved ? JSON.parse(saved) : DEFAULT_LIMBS;
        
        return {
            ARM_L: { id: 'ARM_L', name: 'Braccio Sinistro', hp: LIMB_HP, destroyed: false, polygon: polys.ARM_L },
            ARM_R: { id: 'ARM_R', name: 'Braccio Destro', hp: LIMB_HP, destroyed: false, polygon: polys.ARM_R },
            LEG_L: { id: 'LEG_L', name: 'Gamba Sinistra', hp: LIMB_HP, destroyed: false, polygon: polys.LEG_L },
            LEG_R: { id: 'LEG_R', name: 'Gamba Destra', hp: LIMB_HP, destroyed: false, polygon: polys.LEG_R },
        };
    });

    const limbsRef = useRef(limbs);
    useEffect(() => {
        limbsRef.current = limbs;
    }, [limbs]);

    const [isShaking, setIsShaking] = useState(false);
    const isGameOverRef = useRef(false);
    const punchAudio = useRef<HTMLAudioElement | null>(null);
    const bgmAudio = useRef<HTMLAudioElement | null>(null);
    const earthquakeAudio = useRef<HTMLAudioElement | null>(null);
    const glassBreakAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Image sequence logic: 4s each for the first 3
        const timers: NodeJS.Timeout[] = [];
        timers.push(setTimeout(() => setCurrentImgIdx(1), 4000));
        timers.push(setTimeout(() => setCurrentImgIdx(2), 8000));
        timers.push(setTimeout(() => {
            setCurrentImgIdx(3);
            setGameState('READY');
        }, 12000));
        return () => timers.forEach(t => clearTimeout(t));
    }, []);

    useEffect(() => {
        if (gameState === 'READY') {
            const timer = setTimeout(() => setGameState('GO'), 3000);
            return () => clearTimeout(timer);
        }
        if (gameState === 'GO') {
            const timer = setTimeout(() => setGameState('PLAYING'), 3000);
            return () => clearTimeout(timer);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'PLAYING' || isGameOver) return;
        
        const runPhase = async () => {
            const currentLimbs = limbsRef.current;
            const bothArmsDestroyed = currentLimbs.ARM_L.destroyed && currentLimbs.ARM_R.destroyed;
            
            // 1. PLAYER ATTACK (4s or 3s if arms destroyed)
            setBattlePhase('PLAYER_ATTACK');
            await new Promise(r => setTimeout(r, bothArmsDestroyed ? 3000 : 4000));
            if (isGameOverRef.current) return;

            // 2. DISAPPEAR 1 (2s)
            setBattlePhase('DISAPPEAR_1');
            await new Promise(r => setTimeout(r, 2000));
            if (isGameOverRef.current) return;

            // 3. MONSTER ATTACK
            const latestLimbs = limbsRef.current;
            const latestBothArmsDestroyed = latestLimbs.ARM_L.destroyed && latestLimbs.ARM_R.destroyed;
            
            let type: 'LEFT' | 'RIGHT' | 'BODY' = 'LEFT';
            if (latestBothArmsDestroyed) {
                type = 'BODY';
            } else if (latestLimbs.ARM_L.destroyed) {
                type = 'RIGHT';
            } else if (latestLimbs.ARM_R.destroyed) {
                type = 'LEFT';
            } else {
                type = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';
            }

            setMonsterAttackType(type);
            setBattlePhase('MONSTER_ATTACK');
            
            // Visual Feedback: Shake on monster hit
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 200);

            // Deal damage to player
            setPlayerHP(prev => {
                const next = Math.max(0, prev - 100);
                if (next <= 0) handleLose();
                return next;
            });
            
            setHitsReceived(prev => {
                const next = prev + 1;
                // Play glass break sound at 2, 5, and 9 hits
                if (next === 2 || next === 5 || next === 9) {
                    if (glassBreakAudio.current) {
                        glassBreakAudio.current.currentTime = 0;
                        glassBreakAudio.current.play().catch(e => console.log("Glass break play blocked", e));
                    }
                }
                return next;
            });

            // Audio Feedback: Monster Punch
            if (punchAudio.current) {
                punchAudio.current.currentTime = 0;
                punchAudio.current.play().catch(e => console.log("Audio play blocked", e));
            }
            
            await new Promise(r => setTimeout(r, 1000)); // Attack duration
            if (isGameOverRef.current) return;

            // 4. DISAPPEAR 2 (2s)
            setMonsterAttackType(null);
            setBattlePhase('DISAPPEAR_2');
            await new Promise(r => setTimeout(r, 2000));
            
            if (!isGameOverRef.current) runPhase();
        };

        runPhase();
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'PLAYING' || isGameOver) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleLose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [gameState, isGameOver]);

    useEffect(() => {
        // Stop general sub music
        pauseSubMusic();

        punchAudio.current = new Audio(PUNCH_SOUND_URL);
        bgmAudio.current = new Audio(BGM_URL);
        bgmAudio.current.volume = 0.9;
        earthquakeAudio.current = new Audio(EARTHQUAKE_SOUND_URL);
        glassBreakAudio.current = new Audio(GLASS_BREAK_SOUND_URL);
        bgmAudio.current.play().catch(e => console.log("BGM play blocked", e));

        return () => {
            if (punchAudio.current) {
                punchAudio.current.pause();
                punchAudio.current = null;
            }
            if (bgmAudio.current) {
                bgmAudio.current.pause();
                bgmAudio.current = null;
            }
            if (earthquakeAudio.current) {
                earthquakeAudio.current.pause();
                earthquakeAudio.current = null;
            }
            if (glassBreakAudio.current) {
                glassBreakAudio.current.pause();
                glassBreakAudio.current = null;
            }
            pauseSubMusic();
        };
    }, []);

    useEffect(() => {
        if (bgmAudio.current) {
            if (isAudioMuted) {
                bgmAudio.current.pause();
            } else {
                bgmAudio.current.play().catch(e => console.log("BGM play failed", e));
            }
        }
    }, [isAudioMuted]);

    useEffect(() => {
        // Update monster HP based on limb HPs
        const totalHP = Object.values(limbs).reduce((sum, limb) => sum + limb.hp, 0);
        setMonsterHP(totalHP);

        // Check for win condition
        if (totalHP <= 0 && winPhase === 'PLAYING' && gameState === 'PLAYING') {
            handleWin();
        }
    }, [limbs]);

    const handleWin = () => {
        setIsGameOver(true);
        isGameOverRef.current = true;
        setIsShaking(false);
        setWinPhase('STUPITO');
        setGameState('INTRO'); // Pause game logic

        if (earthquakeAudio.current) {
            earthquakeAudio.current.currentTime = 0;
            earthquakeAudio.current.play().catch(e => console.log("Earthquake play blocked", e));
        }
        
        // Shake for 3 seconds then crossfade
        setTimeout(() => {
            setWinPhase('LOST');
            setWinRewardPhase('BANNER');
            
            // Stay for 3 seconds then shrink
            setTimeout(() => {
                setWinRewardPhase('SHRINKING');
                
                // Animate token addition
                const startTokens = totalTokens;
                const endTokens = startTokens + 200;
                addTokens(200, 'Sconfitto Mostro');
                
                let current = startTokens;
                const interval = setInterval(() => {
                    current += 5;
                    if (current >= endTokens) {
                        setTotalTokens(endTokens);
                        clearInterval(interval);
                    } else {
                        setTotalTokens(current);
                    }
                }, 30);
            }, 3000);
        }, 3000);
    };

    const handleLose = () => {
        setIsGameOver(true);
        isGameOverRef.current = true;
        setIsShaking(false);
        setGameState('INTRO');
        setTimeout(() => {
            handleExit();
        }, 4000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleExit = () => {
        setView(AppView.SUB_OSCURITA, true);
    };

    const handleLimbClick = (id: LimbId) => {
        if (gameState !== 'PLAYING' || isGameOver) return;
        if (battlePhase !== 'PLAYER_ATTACK') return;
        
        // Visual Feedback: Shake
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 200);

        // Audio Feedback: Punch
        if (punchAudio.current) {
            punchAudio.current.currentTime = 0;
            punchAudio.current.play().catch(e => console.log("Audio play blocked", e));
        }

        setLimbs(prev => {
            const limb = prev[id];
            if (limb.destroyed) return prev;
            
            const newHP = Math.max(0, limb.hp - DAMAGE_PER_HIT);
            const destroyed = newHP <= 0;
            
            return {
                ...prev,
                [id]: { ...limb, hp: newHP, destroyed }
            };
        });
    };

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black overflow-hidden select-none">
            <div className={`w-full h-full flex flex-col relative ${isShaking ? 'animate-shake' : ''}`}>
                <style>{`
                @keyframes breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.03); }
                }
                .animate-breathe {
                    animation: breathe 4s ease-in-out infinite;
                }
                @keyframes shake {
                    0% { transform: translate(0, 0); }
                    25% { transform: translate(-5px, 5px); }
                    50% { transform: translate(5px, -5px); }
                    75% { transform: translate(-5px, -5px); }
                    100% { transform: translate(0, 0); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out;
                }
                .hp-bar-container {
                    background: rgba(0,0,0,0.6);
                    border: 2px solid rgba(255,255,255,0.2);
                    height: 24px;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                }
                .hp-bar-fill {
                    height: 100%;
                    transition: width 0.3s ease-out;
                }
                .limb-hp-bar {
                    position: absolute;
                    width: 60px;
                    height: 6px;
                    background: rgba(0,0,0,0.8);
                    border: 1px solid rgba(255,255,255,0.3);
                    border-radius: 3px;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 50;
                }
                .limb-hp-fill {
                    height: 100%;
                    background: #ef4444;
                    transition: width 0.2s ease-out;
                }
            `}</style>

            {/* PERMANENT BACKGROUND */}
            <img 
                src={BG_URL} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* MONSTER IMAGES WITH CROSSFADE (OVERLAY) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {currentImgIdx < 3 ? (
                        <motion.img
                            key={currentImgIdx}
                            src={MONSTER_IMAGES[currentImgIdx]}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                                opacity: 1, 
                                scale: currentImgIdx === 2 ? 1.08 : 1 
                            }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            transition={{ duration: 1.5 }}
                            className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-breathe"
                        />
                    ) : (
                        <motion.div 
                            key="monster-final"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5 }}
                            className={`relative w-full h-full flex items-center justify-center ${winPhase === 'STUPITO' ? 'animate-shake' : ''}`}
                        >
                            {winPhase === 'PLAYING' ? (
                                <div className="relative w-full h-full flex items-center justify-center animate-breathe">
                                    {/* Monster Visibility based on phase */}
                                    <AnimatePresence>
                                        {(battlePhase === 'PLAYER_ATTACK' || battlePhase === 'MONSTER_ATTACK') && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 1.1 }}
                                                className="relative w-full h-full flex items-center justify-center"
                                            >
                                                {battlePhase === 'PLAYER_ATTACK' ? (
                                                    <>
                                                        {/* Base Body */}
                                                        <img src={MONSTER_BODY} className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
                                                        
                                                        {/* Limbs */}
                                                        <img 
                                                            src={limbs.ARM_L.destroyed ? ARM_L_ROTTO : ARM_L_SANO} 
                                                            className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                                                        />
                                                        <img 
                                                            src={limbs.ARM_R.destroyed ? ARM_R_ROTTO : ARM_R_SANO} 
                                                            className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                                                        />
                                                        <img 
                                                            src={limbs.LEG_L.destroyed ? LEG_L_ROTTA : LEG_L_SANA} 
                                                            className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                                                        />
                                                        <img 
                                                            src={limbs.LEG_R.destroyed ? LEG_R_ROTTA : LEG_R_SANA} 
                                                            className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                                                        />
                                                    </>
                                                ) : (
                                                    /* Monster Attack Image */
                                                    <motion.div 
                                                        className="relative w-full h-full flex items-center justify-center"
                                                        animate={monsterAttackType === 'BODY' ? { scale: [1, 1.4, 1], y: [0, 50, 0] } : {}}
                                                        transition={{ duration: 0.6, ease: "easeInOut" }}
                                                    >
                                                        {/* Base Body during attack */}
                                                        <img src={MONSTER_BODY} className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]" />
                                                        
                                                        {/* Legs during attack */}
                                                        <img 
                                                            src={limbs.LEG_L.destroyed ? LEG_L_ROTTA : LEG_L_SANA} 
                                                            className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                                                        />
                                                        <img 
                                                            src={limbs.LEG_R.destroyed ? LEG_R_ROTTA : LEG_R_SANA} 
                                                            className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                                                        />

                                                        {/* The other arm (sane or broken) if not the one attacking */}
                                                        {(monsterAttackType === 'RIGHT' || monsterAttackType === 'BODY') && (
                                                            <img 
                                                                src={limbs.ARM_L.destroyed ? ARM_L_ROTTO : ARM_L_SANO} 
                                                                className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                                                            />
                                                        )}
                                                        {(monsterAttackType === 'LEFT' || monsterAttackType === 'BODY') && (
                                                            <img 
                                                                src={limbs.ARM_R.destroyed ? ARM_R_ROTTO : ARM_R_SANO} 
                                                                className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                                                            />
                                                        )}

                                                        {/* The Attacking Fist (only for LEFT/RIGHT) */}
                                                        {monsterAttackType !== 'BODY' && (
                                                            <img 
                                                                src={monsterAttackType === 'LEFT' ? ARM_L_ATTACK : ARM_R_ATTACK} 
                                                                className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,0,0,0.5)]" 
                                                            />
                                                        )}
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.img
                                    key={winPhase}
                                    src={winPhase === 'STUPITO' ? MONSTER_STUPITO : MONSTER_LOST}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 1.5 }}
                                    className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* READY / GO / LOSE OVERLAY */}
                <AnimatePresence>
                    {(gameState === 'READY' || gameState === 'GO' || (isGameOver && playerHP <= 0)) && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.2 }}
                            exit={{ opacity: 0, scale: 2 }}
                            className="absolute inset-0 z-[160] flex items-center justify-center pointer-events-none"
                        >
                            <h2 className={`font-luckiest tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] 
                                ${gameState === 'READY' ? 'text-8xl md:text-[12rem] text-yellow-400' : 
                                  gameState === 'GO' ? 'text-8xl md:text-[12rem] text-red-500' : 
                                  'text-4xl md:text-6xl text-red-600'}`}>
                                {gameState === 'READY' ? 'READY' : 
                                 gameState === 'GO' ? 'GO!' : 'HAI PERSO!'}
                            </h2>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CLICKABLE LIMBS (Only when playing) */}
                {gameState === 'PLAYING' && winPhase === 'PLAYING' && battlePhase === 'PLAYER_ATTACK' && Object.values(limbs).map(limb => (
                    !limb.destroyed && (
                        <div 
                            key={limb.id}
                            className="absolute inset-0 z-20 cursor-crosshair group"
                            style={{ clipPath: getClipPath(limb.polygon) }}
                            onClick={(e) => { e.stopPropagation(); handleLimbClick(limb.id); }}
                        >
                            {/* Limb HP Bar (Appears when hit or hovered) */}
                            {limb.hp < LIMB_HP && (
                                <div 
                                    className="limb-hp-bar"
                                    style={{ 
                                        left: `${limb.polygon[0]?.x}%`, 
                                        top: `${limb.polygon[0]?.y - 5}%`,
                                        transform: 'translate(-50%, -100%)'
                                    }}
                                >
                                    <div 
                                        className="limb-hp-fill" 
                                        style={{ width: `${(limb.hp / LIMB_HP) * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    )
                ))}
            </div>

            {/* HUD - TOP (STREET FIGHTER STYLE) */}
            <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-8 flex items-center gap-4">
                <div className="flex-1 flex flex-col items-end">
                    <div className="w-full max-w-[400px]">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-yellow-400 font-black italic text-xs md:text-sm uppercase tracking-tighter">Monster</span>
                            <span className="text-white font-mono text-[10px] opacity-60">{monsterHP}/{MAX_HP}</span>
                        </div>
                        <div className="hp-bar-container rounded-l-lg overflow-hidden">
                            <div 
                                className="hp-bar-fill bg-gradient-to-r from-red-600 to-yellow-500 float-right" 
                                style={{ width: `${(monsterHP / MAX_HP) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center min-w-[70px] md:min-w-[100px]">
                    <div className="bg-black/80 border-2 border-yellow-500/50 rounded-lg px-3 py-1 md:px-4 md:py-2 shadow-2xl">
                        <p className="text-yellow-400 text-xl md:text-3xl font-luckiest tracking-widest leading-none">{formatTime(timeLeft)}</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-start">
                    <div className="w-full max-w-[400px]">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-white font-mono text-[10px] opacity-60">{playerHP}/{MAX_HP}</span>
                            <span className="text-blue-400 font-black italic text-xs md:text-sm uppercase tracking-tighter">Player</span>
                        </div>
                        <div className="hp-bar-container rounded-r-lg overflow-hidden">
                            <div 
                                className="hp-bar-fill bg-gradient-to-l from-blue-600 to-cyan-400" 
                                style={{ width: `${(playerHP / MAX_HP) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTROLS - BOTTOM */}
            <div className="absolute bottom-6 left-6 right-6 z-40 flex justify-between items-end pointer-events-none">
                <button 
                    onClick={handleExit}
                    className="hover:scale-110 active:scale-95 transition-all outline-none group flex flex-col items-center pointer-events-auto"
                >
                    <img src={BTN_BACK_URL} alt="Esci" className="w-20 h-20 md:w-28 h-auto drop-shadow-2xl brightness-90 group-hover:brightness-110" />
                </button>

                {/* TOKEN BALANCE - BOTTOM CENTER */}
                <div className="flex flex-col items-center pointer-events-auto">
                    <div className="bg-black/80 border-2 border-yellow-500/30 rounded-xl px-3 py-1 flex items-center gap-2 shadow-2xl">
                        <TokenIcon className="w-5 h-5" />
                        <span className="text-white font-luckiest text-lg tracking-widest">{totalTokens}</span>
                    </div>
                </div>

                {/* AUDIO TOGGLE - BOTTOM RIGHT */}
                <button 
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className={`p-1 hover:scale-110 active:scale-95 transition-all outline-none pointer-events-auto ${isAudioMuted ? 'grayscale opacity-50' : ''}`}
                >
                    <img src={AUDIO_TOGGLE_IMG} alt="Audio Toggle" className="w-16 h-16 md:w-20 h-auto drop-shadow-xl" />
                </button>
            </div>

            {/* AMBIENT OVERLAY */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/20 z-20" />

            {/* BROKEN SCREEN EFFECT */}
            <div className="absolute inset-0 z-[150] pointer-events-none">
                {winPhase === 'PLAYING' && (
                    <>
                        {hitsReceived >= 9 ? (
                            <img src={BROKEN_SCREEN_IMAGES[2]} className="w-full h-full object-cover opacity-90" alt="Broken Screen 3" />
                        ) : hitsReceived >= 5 ? (
                            <img src={BROKEN_SCREEN_IMAGES[1]} className="w-full h-full object-cover opacity-90" alt="Broken Screen 2" />
                        ) : hitsReceived >= 2 ? (
                            <img src={BROKEN_SCREEN_IMAGES[0]} className="w-full h-full object-cover opacity-90" alt="Broken Screen 1" />
                        ) : null}
                    </>
                )}
            </div>

            {/* WIN REWARD OVERLAY */}
            <AnimatePresence>
                {winRewardPhase !== 'HIDDEN' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={
                            winRewardPhase === 'BANNER' 
                            ? { opacity: 1, scale: 1, y: 0 } 
                            : { opacity: 0, scale: 0.1, y: 300 } 
                        }
                        transition={{ 
                            duration: winRewardPhase === 'BANNER' ? 0.5 : 0.8,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 z-[160] flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div className="bg-black/80 backdrop-blur-md border-2 border-yellow-500 p-6 rounded-2xl flex flex-col items-center gap-2 shadow-[0_0_50px_rgba(234,179,8,0.4)] max-w-[300px]">
                            <h3 className="text-yellow-400 text-4xl font-luckiest tracking-widest drop-shadow-lg">VITTORIA!</h3>
                            <p className="text-white text-lg font-black uppercase tracking-tighter text-center">Hai vinto 200 gettoni!</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
    );
};

export default SubMonsterBattle;
