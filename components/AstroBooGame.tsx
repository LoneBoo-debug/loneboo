
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, LogOut, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

const AstroBooGame: React.FC<{ onBack: () => void, onEarnTokens?: (n:number)=>void }> = ({ onBack, onEarnTokens }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  
  // Responsive Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const gameWidth = useRef(0);
  const gameHeight = useRef(0);

  // Game State
  // Positions are percentage based (0-100) or relative to game dimensions
  const playerX = useRef(50); // Percent
  const bullets = useRef<{x: number, y: number, active: boolean}[]>([]);
  const enemies = useRef<{x: number, y: number, type: string, active: boolean}[]>([]);
  const enemyDir = useRef(1);
  const enemySpeed = useRef(0.5); // Percent per frame
  
  const requestRef = useRef<number>(0);
  const lastShot = useRef(0);
  
  // Controls
  const isMovingLeft = useRef(false);
  const isMovingRight = useRef(false);
  const isShooting = useRef(false);

  useEffect(() => {
      // Init Dimensions
      if (containerRef.current) {
          gameWidth.current = containerRef.current.offsetWidth;
          gameHeight.current = containerRef.current.offsetHeight;
      }
      const handleResize = () => {
          if (containerRef.current) {
              gameWidth.current = containerRef.current.offsetWidth;
              gameHeight.current = containerRef.current.offsetHeight;
          }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initGame = () => {
      playerX.current = 50;
      bullets.current = [];
      enemies.current = [];
      enemyDir.current = 1;
      enemySpeed.current = 0.2; // Slower speed in %
      
      // Spawn Grid (Relative positions)
      const rows = 4;
      const cols = 6;
      const startY = 10; // %
      const startX = 10; // %
      const gapX = 14; // %
      const gapY = 8; // %

      const arts = ['👾', '👽', '🛸', '🎃', '🦇'];

      for(let r=0; r<rows; r++) {
          for(let c=0; c<cols; c++) {
              enemies.current.push({
                  x: startX + c * gapX,
                  y: startY + r * gapY,
                  type: arts[r % arts.length],
                  active: true
              });
          }
      }

      setScore(0);
      setGameOver(false);
      setWon(false);
      setIsPlaying(true);
  };

  const update = (time: number) => {
      if (!isPlaying || gameOver || won) return;

      // 1. Move Player (Speed is relative)
      if (isMovingLeft.current) playerX.current = Math.max(5, playerX.current - 1.5);
      if (isMovingRight.current) playerX.current = Math.min(95, playerX.current + 1.5);

      // 2. Shoot
      if (isShooting.current && time - lastShot.current > 300) {
          bullets.current.push({
              x: playerX.current,
              y: 85, // Player height approx
              active: true
          });
          lastShot.current = time;
      }

      // 3. Move Bullets (Upwards in %)
      bullets.current.forEach(b => {
          b.y -= 2;
          if (b.y < 0) b.active = false;
      });

      // 4. Move Enemies
      let hitWall = false;
      let livingEnemies = 0;
      let lowestEnemyY = 0;

      enemies.current.forEach(e => {
          if (!e.active) return;
          livingEnemies++;
          e.x += enemySpeed.current * enemyDir.current;
          lowestEnemyY = Math.max(lowestEnemyY, e.y);

          if (e.x <= 2 || e.x >= 98) {
              hitWall = true;
          }
      });

      if (hitWall) {
          enemyDir.current *= -1;
          enemies.current.forEach(e => e.y += 4); // Drop down %
          enemySpeed.current += 0.05; 
      }

      // 5. Collisions (Simple Box in %)
      // Hitbox approx: 8% width, 6% height
      const HIT_W = 8;
      const HIT_H = 6;

      bullets.current.forEach(b => {
          if (!b.active) return;
          enemies.current.forEach(e => {
              if (!e.active) return;
              if (
                  b.x > e.x - HIT_W/2 && b.x < e.x + HIT_W/2 &&
                  b.y > e.y - HIT_H/2 && b.y < e.y + HIT_H/2
              ) {
                  e.active = false;
                  b.active = false;
                  setScore(s => s + 10);
              }
          });
      });

      // 6. Game State
      if (livingEnemies === 0) {
          setWon(true);
          setIsPlaying(false);
          if(onEarnTokens) onEarnTokens(50);
      } else if (lowestEnemyY >= 85) {
          setGameOver(true);
          setIsPlaying(false);
      }

      bullets.current = bullets.current.filter(b => b.active);
      requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
      if (isPlaying) requestRef.current = requestAnimationFrame(update);
      return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, gameOver, won]);

  return (
    <div className="flex flex-col items-center h-full w-full bg-black touch-none">
        {/* Top Bar */}
        <div className="flex justify-between w-full items-center p-2 bg-gray-900 border-b border-gray-700 shrink-0 z-20">
            <button onClick={onBack} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"><ArrowLeft /></button>
            <h2 className="text-xl md:text-2xl font-black text-purple-400 uppercase tracking-widest">Astro Boo</h2>
            <div className="text-white font-mono font-bold text-lg bg-purple-900/50 px-3 py-1 rounded-lg border border-purple-500">{score}</div>
        </div>

        {/* Game Area - Flexible */}
        {/* ADDED min-h-0 to fix flexbox collapsing */}
        <div ref={containerRef} className="relative flex-1 w-full overflow-hidden bg-black min-h-0">
            
            {/* Stars */}
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {isPlaying && (
                <>
                    {/* Player */}
                    <div className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75" style={{ left: `${playerX.current}%`, top: '90%' }}>
                        🚀
                    </div>
                    
                    {/* Bullets */}
                    {bullets.current.map((b, i) => (
                        <div key={`b-${i}`} className="absolute w-2 h-4 bg-yellow-400 rounded-full shadow-[0_0_5px_yellow] transform -translate-x-1/2" style={{ left: `${b.x}%`, top: `${b.y}%` }}></div>
                    ))}

                    {/* Enemies */}
                    {enemies.current.map((e, i) => e.active && (
                        <div key={`e-${i}`} className="absolute text-2xl md:text-3xl transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${e.x}%`, top: `${e.y}%` }}>
                            {e.type}
                        </div>
                    ))}
                </>
            )}

            {/* Overlays */}
            {!isPlaying && !gameOver && !won && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30">
                    <div className="text-8xl mb-4 animate-bounce">👽</div>
                    <button onClick={initGame} className="bg-purple-600 text-white font-black px-10 py-4 rounded-full border-4 border-white hover:scale-105 active:scale-95 flex items-center gap-2 text-xl shadow-[0_0_20px_purple]">
                        <Play fill="white" /> START
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 z-30 animate-in zoom-in">
                    <h3 className="text-4xl font-black text-white mb-2">GAME OVER</h3>
                    <p className="text-white text-xl font-bold mb-6">Punteggio: {score}</p>
                    <button onClick={initGame} className="bg-yellow-400 text-black font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105">RIPROVA</button>
                </div>
            )}

            {won && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/90 z-30 animate-in zoom-in">
                    <div className="text-6xl mb-2">🏆</div>
                    <h3 className="text-4xl font-black text-white mb-2">VITTORIA!</h3>
                    <button onClick={initGame} className="bg-yellow-400 text-black font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105">GIOCA ANCORA</button>
                </div>
            )}
        </div>

        {/* Controls - Fixed at bottom */}
        <div className="flex gap-2 w-full p-2 bg-gray-900 border-t border-gray-700 shrink-0 h-24">
            <button 
                className="flex-1 bg-gray-800 text-white rounded-xl border-b-4 border-gray-950 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center active:bg-gray-700"
                onMouseDown={() => isMovingLeft.current = true}
                onMouseUp={() => isMovingLeft.current = false}
                onMouseLeave={() => isMovingLeft.current = false}
                onTouchStart={(e) => { e.preventDefault(); isMovingLeft.current = true; }}
                onTouchEnd={(e) => { e.preventDefault(); isMovingLeft.current = false; }}
            >
                <ArrowLeft size={32} />
            </button>
            
            <button 
                className="flex-[1.5] bg-red-600 text-white rounded-xl border-b-4 border-red-900 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center shadow-[0_0_15px_red] active:bg-red-500"
                onMouseDown={() => isShooting.current = true}
                onMouseUp={() => isShooting.current = false}
                onMouseLeave={() => isShooting.current = false}
                onTouchStart={(e) => { e.preventDefault(); isShooting.current = true; }}
                onTouchEnd={(e) => { e.preventDefault(); isShooting.current = false; }}
            >
                <Zap size={40} fill="white" />
            </button>

            <button 
                className="flex-1 bg-gray-800 text-white rounded-xl border-b-4 border-gray-950 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center active:bg-gray-700"
                onMouseDown={() => isMovingRight.current = true}
                onMouseUp={() => isMovingRight.current = false}
                onMouseLeave={() => isMovingRight.current = false}
                onTouchStart={(e) => { e.preventDefault(); isMovingRight.current = true; }}
                onTouchEnd={(e) => { e.preventDefault(); isMovingRight.current = false; }}
            >
                <ArrowRight size={32} />
            </button>
        </div>
    </div>
  );
};

export default AstroBooGame;
