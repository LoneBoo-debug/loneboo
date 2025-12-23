
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, LogOut } from 'lucide-react';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';

const GRAVITY = 0.6;        
const JUMP_FORCE = -9;      
const SPEED_START = 3;      
const SPEED_INC = 0.0005;   
const TARGET_FPS = 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

const GROUND_VARIANTS = ['🪨', '🎃', '🪵', '🌵', '🔥', '📦'];
const AIR_VARIANTS = ['🦇', '🐝', '🦉', '🎈', '🛸', '👻'];

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'GROUND' | 'AIR';
  emoji: string;
  passed: boolean;
}

interface BooRunnerProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const BooRunnerGame: React.FC<BooRunnerProps> = ({ onBack, onEarnTokens }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER'>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [rewardGiven, setRewardGiven] = useState(false);

  const isMountedRef = useRef(true);

  const stateRef = useRef({
    playing: false,
    speed: SPEED_START,
    score: 0,
    lastSpawn: 0,
    width: 800, 
    height: 400, 
    groundY: 350,
    nextSpawnDelay: 0,
    lastFrameTime: 0 
  });

  const playerRef = useRef({
    x: 50,
    y: 310, 
    vy: 0,
    width: 40,
    height: 40,
    grounded: false,
    rotation: 0
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { 
        isMountedRef.current = false;
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    try {
        const saved = localStorage.getItem('booRunnerHighScore');
        if (saved) setHighScore(parseInt(saved) || 0);
    } catch (e) { }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!isMountedRef.current) return;
      const canvas = canvasRef.current;
      if (canvas) {
        const parent = canvas.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          const w = Math.floor(Math.max(10, rect.width));
          const h = Math.floor(Math.max(10, rect.height));
          
          canvas.width = w;
          canvas.height = h;
          stateRef.current.width = w;
          stateRef.current.height = h;
          stateRef.current.groundY = h - 50;
          
          if (!stateRef.current.playing) {
             playerRef.current.y = stateRef.current.groundY - playerRef.current.height;
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 50);
    setTimeout(handleResize, 500);

    if (gameState === 'START') {
       requestAnimationFrame(drawFrame);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [gameState]);

  const startGame = () => {
    const safeGroundY = stateRef.current.groundY > 0 ? stateRef.current.groundY : 350;
    const startY = safeGroundY - 40;

    stateRef.current = {
      ...stateRef.current,
      playing: true,
      speed: SPEED_START,
      score: 0,
      lastSpawn: performance.now(),
      nextSpawnDelay: 0,
      lastFrameTime: 0
    };
    
    playerRef.current = {
      x: 50,
      y: startY,
      vy: 0,
      width: 40,
      height: 40,
      grounded: true,
      rotation: 0
    };

    obstaclesRef.current = [];
    
    if (isMountedRef.current) {
        setGameState('PLAYING');
        setScore(0);
        setRewardGiven(false);
    }

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const jump = () => {
    if (!stateRef.current.playing) return;
    if (playerRef.current.grounded) {
      playerRef.current.vy = JUMP_FORCE;
      playerRef.current.grounded = false;
    }
  };

  const gameOver = () => {
    stateRef.current.playing = false;
    
    const finalScore = Math.floor(stateRef.current.score);
    if (isMountedRef.current) {
        setGameState('GAME_OVER');
        if (!rewardGiven && onEarnTokens) {
            if (finalScore > 50) onEarnTokens(20);
            else if (finalScore > 20) onEarnTokens(10);
            else if (finalScore > 5) onEarnTokens(2);
            setRewardGiven(true);
        }
    }
    
    if (finalScore > highScore) {
      if (isMountedRef.current) setHighScore(finalScore);
      try {
          localStorage.setItem('booRunnerHighScore', finalScore.toString());
      } catch (e) { /* ignore */ }
    }
    
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    drawFrame();
  };

  const spawnObstacle = (timestamp: number) => {
    const timeSinceLast = timestamp - stateRef.current.lastSpawn;
    const delay = (Number.isFinite(stateRef.current.nextSpawnDelay) && stateRef.current.nextSpawnDelay > 0) 
        ? stateRef.current.nextSpawnDelay 
        : 2000;

    if (timeSinceLast > delay) {
       const type = Math.random() > 0.7 ? 'AIR' : 'GROUND'; 
       const w = 40;
       const h = type === 'GROUND' ? 50 : 40; 
       
       const emoji = type === 'GROUND' 
          ? GROUND_VARIANTS[Math.floor(Math.random() * GROUND_VARIANTS.length)]
          : AIR_VARIANTS[Math.floor(Math.random() * AIR_VARIANTS.length)];

       let y = 0;
       if (type === 'GROUND') {
           y = stateRef.current.groundY - h + 5;
       } else {
           y = stateRef.current.groundY - 85; 
       }

       obstaclesRef.current.push({
           x: stateRef.current.width,
           y: y,
           width: w,
           height: h,
           type: type,
           emoji: emoji,
           passed: false
       });
       stateRef.current.lastSpawn = timestamp;
       
       const currentSpeed = stateRef.current.speed;
       const currentScore = stateRef.current.score;

       const difficultyReduction = Math.min(currentScore * 5, 200); 
       const minDistancePx = 550 - difficultyReduction; 

       const minDelayMs = (minDistancePx / currentSpeed) * 16.66;
       const randomBuffer = Math.random() * 600;

       stateRef.current.nextSpawnDelay = minDelayMs + randomBuffer;
    }
  };

  const updatePhysics = () => {
    const player = playerRef.current;
    const ground = stateRef.current.groundY;

    player.vy += GRAVITY;
    if (player.vy > 10) player.vy = 10;
    
    player.y += player.vy;

    if (player.y + player.height >= ground) {
      player.y = ground - player.height;
      player.vy = 0;
      player.grounded = true;
      player.rotation = 0; 
    } else {
      player.grounded = false;
      player.rotation += 5; 
    }

    if (stateRef.current.speed < 8) {
        stateRef.current.speed += SPEED_INC;
    }

    const obsToRemove: number[] = [];
    obstaclesRef.current.forEach((obs, index) => {
        obs.x -= stateRef.current.speed;

        const padding = 10; 
        if (
            player.x + padding < obs.x + obs.width - padding &&
            player.x + player.width - padding > obs.x + padding &&
            player.y + padding < obs.y + obs.height - padding &&
            player.y + player.height - padding > obs.y + padding
        ) {
            gameOver();
        }

        if (!obs.passed && obs.x + obs.width < player.x) {
            obs.passed = true;
            stateRef.current.score += 1;
            if (isMountedRef.current) {
                setScore(Math.floor(stateRef.current.score));
            }
        }

        if (obs.x < -100) {
            obsToRemove.push(index);
        }
    });

    for (let i = obsToRemove.length - 1; i >= 0; i--) {
        obstaclesRef.current.splice(obsToRemove[i], 1);
    }
  };

  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height, groundY } = stateRef.current;

    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) return;

    try {
        try {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#38BDF8'); 
            gradient.addColorStop(1, '#E0F2FE');
            ctx.fillStyle = gradient;
        } catch (e) {
            ctx.fillStyle = '#38BDF8';
        }
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '60px Arial';
        ctx.fillText('☁️', 80, 80);
        ctx.fillText('☁️', width * 0.7, 100);
        ctx.font = '80px Arial';
        ctx.fillText('☀️', width - 80, 80);

        ctx.fillStyle = '#15803D'; 
        const groundH = Math.max(0, height - groundY);
        ctx.fillRect(0, groundY, width, groundH);
        ctx.fillStyle = '#14532D'; 
        ctx.fillRect(0, groundY, width, 10);

        obstaclesRef.current.forEach(obs => {
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const cx = obs.x + obs.width / 2;
            const cy = obs.y + obs.height / 2;
            
            ctx.save();
            ctx.translate(cx, cy);
            if (obs.type === 'AIR') {
                const wiggle = Math.sin(Date.now() / 100) * 0.1;
                ctx.rotate(wiggle);
            }
            ctx.fillText(obs.emoji, 0, 0);
            ctx.restore();
        });

        const p = playerRef.current;
        ctx.save();
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        
        const rot = Math.min(Math.max(p.vy * 3, -25), 25);
        const rotationRad = (rot * Math.PI) / 180;
        ctx.rotate(rotationRad);
        
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stateRef.current.playing ? '👻' : '😵', 0, 0);
        ctx.restore();
    } catch (e) {
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(0, 0, width, height);
    }
  };

  const gameLoop = (timestamp: number) => {
    if (!isMountedRef.current) return;
    
    if (stateRef.current.lastFrameTime === 0) {
        stateRef.current.lastFrameTime = timestamp;
    }
    
    const elapsed = timestamp - stateRef.current.lastFrameTime;

    if (elapsed > FRAME_INTERVAL) {
        stateRef.current.lastFrameTime = timestamp - (elapsed % FRAME_INTERVAL);
        try {
            if (stateRef.current.playing) {
                updatePhysics();
                spawnObstacle(timestamp);
                drawFrame();
            }
        } catch (e) { }
    }
    
    if (stateRef.current.playing) {
        requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-sky-300 touch-none">
        
        <div className="w-full flex justify-between items-center p-2 bg-sky-400 border-b-4 border-black shrink-0 z-20 shadow-md">
             <h2 className="text-xl md:text-3xl font-black text-white drop-shadow-[2px_2px_0_black] uppercase tracking-widest pl-4" style={{ textShadow: "2px 2px 0px black" }}>
                Boo Runner
             </h2>

             <div className="flex flex-col items-end">
                 <div className="text-white font-mono font-black text-lg leading-none">{score}</div>
                 <div className="text-[10px] text-sky-800 font-bold uppercase">Record: {highScore}</div>
             </div>
        </div>

        <div className="flex-1 w-full relative min-h-0 overflow-hidden bg-sky-300">
            
            <canvas 
                ref={canvasRef}
                className="block w-full h-full touch-none cursor-pointer"
                onMouseDown={jump}
                onTouchStart={(e) => { e.preventDefault(); jump(); }}
            />

            {gameState === 'START' && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
                    <p className="text-white font-black text-2xl mb-4 drop-shadow-md text-center px-4 animate-bounce">
                        Tocca per saltare!
                    </p>
                    <button 
                        onClick={startGame} 
                        className="bg-green-500 text-white font-black px-10 py-4 rounded-full border-4 border-white shadow-[0_0_20px_black] hover:scale-105 active:translate-y-1 transition-all flex items-center gap-2 text-xl"
                    >
                        <Play fill="white" /> INIZIA
                    </button>
                </div>
            )}

            {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30 backdrop-blur-sm animate-in zoom-in">
                    <h3 className="text-5xl font-black text-red-500 mb-2 drop-shadow-[2px_2px_0_white]">CRASH!</h3>
                    <p className="text-white text-2xl font-bold mb-8">Punti: {score}</p>
                    <div className="flex flex-col gap-4 w-64 items-center">
                        <button 
                            onClick={startGame} 
                            className="w-full bg-yellow-400 text-black font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 active:translate-y-1 shadow-[4px_4px_0_black] flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={20} /> RIPROVA
                        </button>
                        <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform">
                            <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};

export default BooRunnerGame;
