
import React, { useState, useEffect, useRef } from 'react';
import { Play, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const LOGICAL_WIDTH = 1000;
const LOGICAL_HEIGHT = 1000;
const PADDLE_W = 200;
const PADDLE_H = 30;
const BALL_R = 20;

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

const BooBreakerGame: React.FC<{ onBack: () => void, onEarnTokens?: (n:number)=>void }> = ({ onBack, onEarnTokens }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  const stateRef = useRef({
      paddleX: LOGICAL_WIDTH / 2 - PADDLE_W / 2,
      ball: { x: LOGICAL_WIDTH / 2, y: LOGICAL_HEIGHT - 100, dx: 0, dy: 0 },
      bricks: [] as { x: number, y: number, w: number, h: number, color: string, active: boolean }[],
      movingLeft: false,
      movingRight: false,
      launched: false
  });

  useEffect(() => {
      const resize = () => {
          if (canvasRef.current && containerRef.current) {
              canvasRef.current.width = LOGICAL_WIDTH;
              canvasRef.current.height = LOGICAL_HEIGHT;
          }
      };
      window.addEventListener('resize', resize);
      resize();
      return () => window.removeEventListener('resize', resize);
  }, []);

  const initGame = () => {
      const bricks = [];
      const rows = 5;
      const cols = 5;
      const padding = 20;
      const brickW = (LOGICAL_WIDTH - (padding * (cols + 1))) / cols;
      const brickH = 50;

      for(let r=0; r<rows; r++) {
          for(let c=0; c<cols; c++) {
              bricks.push({
                  x: padding + c * (brickW + padding),
                  y: 100 + r * (brickH + padding),
                  w: brickW,
                  h: brickH,
                  color: COLORS[r % COLORS.length],
                  active: true
              });
          }
      }

      stateRef.current = {
          paddleX: LOGICAL_WIDTH / 2 - PADDLE_W / 2,
          ball: { x: LOGICAL_WIDTH / 2, y: LOGICAL_HEIGHT - 100, dx: 8, dy: -8 },
          bricks: bricks,
          movingLeft: false,
          movingRight: false,
          launched: false
      };

      setScore(0);
      setGameOver(false);
      setWon(false);
      setIsPlaying(true);
  };

  const update = () => {
      if (!isPlaying || gameOver || won) return;
      const state = stateRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!ctx || !canvas) return;

      if (state.movingLeft) state.paddleX = Math.max(0, state.paddleX - 15);
      if (state.movingRight) state.paddleX = Math.min(LOGICAL_WIDTH - PADDLE_W, state.paddleX + 15);

      if (state.launched) {
          state.ball.x += state.ball.dx;
          state.ball.y += state.ball.dy;

          if (state.ball.x + BALL_R > LOGICAL_WIDTH || state.ball.x - BALL_R < 0) state.ball.dx *= -1;
          if (state.ball.y - BALL_R < 0) state.ball.dy *= -1;
          
          const paddleY = LOGICAL_HEIGHT - 60;
          if (
              state.ball.dy > 0 &&
              state.ball.y + BALL_R >= paddleY &&
              state.ball.y - BALL_R <= paddleY + PADDLE_H &&
              state.ball.x >= state.paddleX &&
              state.ball.x <= state.paddleX + PADDLE_W
          ) {
              state.ball.dy = -Math.abs(state.ball.dy); 
              const hitPoint = state.ball.x - (state.paddleX + PADDLE_W / 2);
              state.ball.dx = hitPoint * 0.15; 
          }

          if (state.ball.y - BALL_R > LOGICAL_HEIGHT) {
              setGameOver(true);
              setIsPlaying(false);
          }

          let activeBricks = 0;
          state.bricks.forEach(b => {
              if (!b.active) return;
              activeBricks++;
              if (
                  state.ball.x > b.x && state.ball.x < b.x + b.w &&
                  state.ball.y > b.y && state.ball.y < b.y + b.h
              ) {
                  state.ball.dy *= -1;
                  b.active = false;
                  setScore(s => s + 10);
              }
          });

          if (activeBricks === 0) {
              setWon(true);
              setIsPlaying(false);
              if(onEarnTokens) onEarnTokens(50);
          }

      } else {
          state.ball.x = state.paddleX + PADDLE_W / 2;
          state.ball.y = LOGICAL_HEIGHT - 80;
      }

      ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

      state.bricks.forEach(b => {
          if (b.active) {
              ctx.fillStyle = b.color;
              ctx.fillRect(b.x, b.y, b.w, b.h);
          }
      });

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(state.paddleX, LOGICAL_HEIGHT - 60, PADDLE_W, PADDLE_H);

      ctx.beginPath();
      ctx.arc(state.ball.x, state.ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.closePath();

      requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
      if (isPlaying) requestRef.current = requestAnimationFrame(update);
      return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, gameOver, won]);

  const handleLaunch = () => {
      if (!stateRef.current.launched && isPlaying) {
          stateRef.current.launched = true;
      }
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-slate-900 touch-none">
        <div className="flex justify-between w-full items-center p-2 bg-slate-800 border-b border-slate-700 shrink-0 z-20">
            <h2 className="text-xl font-black text-blue-400 uppercase tracking-widest pl-4">Boo Breaker</h2>
            <div className="text-white font-mono font-bold text-lg bg-blue-900/50 px-3 py-1 rounded-lg border border-blue-500">{score}</div>
        </div>

        <div ref={containerRef} className="relative flex-1 w-full bg-slate-900 flex items-center justify-center overflow-hidden p-2 min-h-0">
            <canvas 
                ref={canvasRef} 
                className="block max-w-full max-h-full object-contain shadow-2xl border-4 border-slate-700 rounded-xl bg-black"
                onClick={handleLaunch} 
            />
            
            {!isPlaying && !gameOver && !won && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30">
                    <button onClick={initGame} className="bg-blue-500 text-white font-black px-10 py-4 rounded-full border-4 border-white hover:scale-105 active:scale-95 flex items-center gap-2 text-xl shadow-[0_0_20px_blue]">
                        <Play fill="white" /> START
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 z-30 animate-in zoom-in">
                    <h3 className="text-4xl font-black text-white mb-2">PERSO!</h3>
                    <p className="text-white text-xl font-bold mb-6">Score: {score}</p>
                    <button onClick={initGame} className="bg-yellow-400 text-black font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 flex items-center gap-2">
                        <RotateCcw size={20} /> RIPROVA
                    </button>
                </div>
            )}

            {won && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/90 z-30 animate-in zoom-in">
                    <div className="text-6xl mb-2">✨</div>
                    <h3 className="text-4xl font-black text-white mb-2">VITTORIA!</h3>
                    <button onClick={initGame} className="bg-yellow-400 text-black font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105">LIVELLO SUCCESSIVO</button>
                </div>
            )}
        </div>

        <div className="flex gap-2 w-full p-2 bg-slate-800 border-t border-slate-700 shrink-0 h-24">
            <button 
                className="flex-1 bg-slate-700 text-white rounded-xl border-b-4 border-slate-900 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center active:bg-slate-600"
                onMouseDown={() => stateRef.current.movingLeft = true}
                onMouseUp={() => stateRef.current.movingLeft = false}
                onMouseLeave={() => stateRef.current.movingLeft = false}
                onTouchStart={(e) => { e.preventDefault(); stateRef.current.movingLeft = true; }}
                onTouchEnd={(e) => { e.preventDefault(); stateRef.current.movingLeft = false; }}
            >
                <ArrowLeft size={40} />
            </button>
            
            <button 
                className="flex-1 bg-slate-700 text-white rounded-xl border-b-4 border-slate-900 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center active:bg-slate-600"
                onMouseDown={() => stateRef.current.movingRight = true}
                onMouseUp={() => stateRef.current.movingRight = false}
                onMouseLeave={() => stateRef.current.movingRight = false}
                onTouchStart={(e) => { e.preventDefault(); stateRef.current.movingRight = true; }}
                onTouchEnd={(e) => { e.preventDefault(); stateRef.current.movingRight = false; }}
            >
                <ArrowRight size={40} />
            </button>
        </div>
        
        {isPlaying && !stateRef.current.launched && !gameOver && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <p className="text-white font-black text-lg animate-pulse drop-shadow-md bg-black/50 px-4 py-2 rounded-full">TOCCA LO SCHERMO</p>
            </div>
        )}
    </div>
  );
};

export default BooBreakerGame;
