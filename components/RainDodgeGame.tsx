
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';

const GAME_WIDTH = 350;
const GAME_HEIGHT = 500;
const PLAYER_SIZE = 40;
const DROP_SIZE = 30;

const RainDodgeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const playerX = useRef(GAME_WIDTH / 2 - PLAYER_SIZE / 2);
  const drops = useRef<{x: number, y: number, speed: number}[]>([]);
  const requestRef = useRef<number>(0);
  const scoreRef = useRef(0);
  
  const isMovingLeft = useRef(false);
  const isMovingRight = useRef(false);

  const startGame = () => {
      setGameOver(false);
      setScore(0);
      scoreRef.current = 0;
      drops.current = [];
      playerX.current = GAME_WIDTH / 2 - PLAYER_SIZE / 2;
      setIsPlaying(true);
  };

  const updateGame = () => {
      if (!isPlaying || gameOver) return;

      if (isMovingLeft.current) playerX.current = Math.max(0, playerX.current - 5);
      if (isMovingRight.current) playerX.current = Math.min(GAME_WIDTH - PLAYER_SIZE, playerX.current + 5);

      if (Math.random() < 0.05 + (scoreRef.current * 0.0001)) { 
          drops.current.push({
              x: Math.random() * (GAME_WIDTH - DROP_SIZE),
              y: -DROP_SIZE,
              speed: 3 + Math.random() * 2 + (scoreRef.current * 0.005)
          });
      }

      const newDrops = [];
      for (let drop of drops.current) {
          drop.y += drop.speed;

          if (
              playerX.current < drop.x + DROP_SIZE &&
              playerX.current + PLAYER_SIZE > drop.x &&
              GAME_HEIGHT - 60 < drop.y + DROP_SIZE && 
              GAME_HEIGHT - 60 + PLAYER_SIZE > drop.y
          ) {
              setGameOver(true);
              setIsPlaying(false);
              return;
          }

          if (drop.y < GAME_HEIGHT) {
              newDrops.push(drop);
          } else {
              scoreRef.current += 1;
              setScore(scoreRef.current);
          }
      }
      drops.current = newDrops;

      requestRef.current = requestAnimationFrame(updateGame);
  };

  useEffect(() => {
      if (isPlaying && !gameOver) {
          requestRef.current = requestAnimationFrame(updateGame);
      }
      return () => {
          if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
  }, [isPlaying, gameOver]);

  const handleTouchStart = (dir: 'left' | 'right') => {
      if (dir === 'left') isMovingLeft.current = true;
      else isMovingRight.current = true;
  };
  const handleTouchEnd = () => {
      isMovingLeft.current = false;
      isMovingRight.current = false;
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
        <h2 className="text-4xl font-black text-boo-orange mb-4 drop-shadow-[2px_2px_0_black]" style={{ textShadow: "3px 3px 0px black" }}>
            Fuga dalla Pioggia
        </h2>

        <div className="relative bg-gray-900 border-4 border-black rounded-[20px] overflow-hidden shadow-2xl mb-4" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
            
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black"></div>

            <div className="absolute top-4 right-4 text-white font-black text-2xl z-20 drop-shadow-md">
                {score}
            </div>

            <div 
                className="absolute text-4xl z-10 transition-transform"
                style={{ 
                    left: isPlaying || gameOver ? playerX.current : GAME_WIDTH/2 - 20, 
                    bottom: 20,
                    width: PLAYER_SIZE,
                    height: PLAYER_SIZE
                }}
            >
                {gameOver ? '😵' : '👻'}
            </div>

            {drops.current.map((drop, i) => (
                <div 
                    key={i}
                    className="absolute text-2xl"
                    style={{ left: drop.x, top: drop.y }}
                >
                    💧
                </div>
            ))}

            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30">
                    <p className="text-white font-bold mb-4 text-center px-4">Evita le gocce! Usa le frecce.</p>
                    <button onClick={startGame} className="bg-green-500 text-white font-black px-8 py-3 rounded-full border-4 border-black hover:scale-105 active:scale-95 flex gap-2">
                        <Play fill="white" /> START
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 backdrop-blur-sm z-30 animate-in zoom-in">
                    <h3 className="text-4xl font-black text-white mb-2">GAME OVER</h3>
                    <p className="text-white text-xl font-bold mb-6">Punteggio: {score}</p>
                    <button onClick={startGame} className="bg-yellow-400 text-black font-black px-8 py-3 rounded-full border-4 border-black hover:scale-105 active:scale-95 flex gap-2 mb-4">
                        <RotateCcw /> RIPROVA
                    </button>
                    <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform">
                        <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto" />
                    </button>
                </div>
            )}
        </div>

        <div className="flex gap-4 w-full max-w-[350px]">
            <button 
                className="flex-1 bg-blue-500 text-white p-6 rounded-2xl border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 transition-all flex justify-center"
                onMouseDown={() => handleTouchStart('left')}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('left'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd(); }}
            >
                <ArrowLeft size={32} strokeWidth={4} />
            </button>
            <button 
                className="flex-1 bg-blue-500 text-white p-6 rounded-2xl border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 transition-all flex justify-center"
                onMouseDown={() => handleTouchStart('right')}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('right'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd(); }}
            >
                <ArrowRight size={32} strokeWidth={4} />
            </button>
        </div>
    </div>
  );
};

export default RainDodgeGame;
