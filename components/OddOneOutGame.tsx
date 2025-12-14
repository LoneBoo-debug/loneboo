
import React, { useState, useEffect } from 'react';
import { RotateCcw, Timer, LogOut, Trophy, Play } from 'lucide-react';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

interface OddOneOutProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const OddOneOutGame: React.FC<OddOneOutProps> = ({ onBack, onEarnTokens }) => {
  const [gridSize, setGridSize] = useState(2); 
  const [items, setItems] = useState<string[]>([]);
  const [oddIndex, setOddIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'>('START');
  const [rewardGiven, setRewardGiven] = useState(false);

  // Difficulty scaling: Time decreases as level increases
  const getTimeForLevel = (lvl: number) => {
      if (lvl > 20) return 4;
      if (lvl > 10) return 7;
      return 10;
  };

  const generateLevel = (currentLevel: number) => {
    // Grid Size Growth: starts at 2x2, caps at 6x6
    const size = Math.min(6, 2 + Math.floor((currentLevel - 1) / 5)); 
    setGridSize(size);
    
    const mainEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let oddEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    while (oddEmoji === mainEmoji) {
        oddEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    }

    const totalCells = size * size;
    const newOddIndex = Math.floor(Math.random() * totalCells);
    setOddIndex(newOddIndex);

    const newItems = Array(totalCells).fill(mainEmoji);
    newItems[newOddIndex] = oddEmoji;
    setItems(newItems);
    
    // Reset Timer
    setTimeLeft(getTimeForLevel(currentLevel));
  };

  const startGame = () => {
      setLevel(1);
      setScore(0);
      setRewardGiven(false);
      setGameState('PLAYING');
      generateLevel(1);
  };

  // Timer Logic
  useEffect(() => {
    let timer: any;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'PLAYING') {
      setGameState('GAME_OVER');
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  // Reward Logic
  useEffect(() => {
      if (gameState === 'VICTORY' && !rewardGiven && onEarnTokens) {
          onEarnTokens(5);
          setRewardGiven(true);
      }
  }, [gameState, rewardGiven, onEarnTokens]);

  const handleClick = (index: number) => {
    if (gameState !== 'PLAYING') return;

    if (index === oddIndex) {
      const nextLevel = level + 1;
      setScore(s => s + 10);
      
      if (nextLevel > 30) {
          setGameState('VICTORY');
      } else {
          setLevel(nextLevel);
          generateLevel(nextLevel);
      }
    } else {
      // Wrong click = penalty or game over? Let's subtract time for better flow
      setTimeLeft(prev => Math.max(0, prev - 2));
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-900 relative overflow-hidden">
       
       {/* HEADER */}
       <div className="w-full p-4 flex justify-between items-center z-10 shrink-0 bg-gray-800 border-b-4 border-gray-700">
           <button onClick={onBack} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20">
               <LogOut size={24} />
           </button>
           <h2 className="text-3xl md:text-4xl font-black text-boo-orange" style={{ textShadow: "2px 2px 0px black" }}>
               Trova l'Intruso
           </h2>
           <div className="w-10"></div>
       </div>

       {/* GAME CONTENT */}
       <div className="flex-1 w-full flex flex-col items-center justify-center p-4 min-h-0">
           
           {gameState === 'START' && (
               <div className="bg-white p-8 rounded-[40px] border-8 border-boo-purple shadow-2xl text-center max-w-md w-full animate-in zoom-in">
                   <div className="text-6xl mb-4 animate-bounce">🧐</div>
                   <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase">Aguzza la vista!</h3>
                   <p className="text-lg text-gray-600 font-bold mb-6 leading-relaxed">
                       Trova l'emoji diversa dalle altre.<br/>
                       Supera <span className="text-red-500 font-black">30 Livelli</span> per vincere <span className="text-yellow-500 font-black bg-black px-2 py-1 rounded-lg">5 gettoni</span>!
                   </p>
                   <button 
                       onClick={startGame}
                       className="w-full bg-green-500 text-white font-black text-xl py-4 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105"
                   >
                       <Play size={24} fill="currentColor" /> INIZIA
                   </button>
               </div>
           )}

           {gameState === 'PLAYING' && (
               <div className="w-full h-full max-w-4xl flex flex-col items-center">
                   {/* HUD */}
                   <div className="flex justify-between w-full mb-4 px-4">
                        <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl border-2 border-blue-400 shadow-md">
                            <span className="font-black text-sm uppercase tracking-wider">LIVELLO</span>
                            <span className="font-black text-2xl">{level}/30</span>
                        </div>
                        
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-md transition-colors ${timeLeft <= 3 ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-gray-700 border-gray-500'}`}>
                            <Timer size={24} className="text-white" />
                            <span className="font-black text-2xl text-white">{timeLeft}s</span>
                        </div>
                   </div>

                   {/* GRID - EXPANDED */}
                   <div className="flex-1 w-full flex items-center justify-center min-h-0">
                       <div 
                         className="grid gap-2 md:gap-3 p-2 bg-white/10 rounded-2xl border-4 border-white/20 shadow-xl aspect-square w-full max-h-[65vh] max-w-[65vh]"
                         style={{ 
                             gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
                         }}
                       >
                           {items.map((item, idx) => (
                               <button
                                    key={idx}
                                    onMouseDown={() => handleClick(idx)}
                                    onTouchStart={(e) => { e.preventDefault(); handleClick(idx); }}
                                    className="w-full h-full flex items-center justify-center bg-white rounded-xl md:rounded-2xl hover:bg-gray-100 border-b-4 border-gray-300 active:border-b-0 active:translate-y-1 active:bg-blue-100 transition-all shadow-sm"
                                    style={{ touchAction: 'manipulation' }}
                               >
                                   <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl select-none drop-shadow-sm pointer-events-none transform transition-transform active:scale-90">
                                       {item}
                                   </span>
                               </button>
                           ))}
                       </div>
                   </div>
               </div>
           )}

           {gameState === 'GAME_OVER' && (
               <div className="bg-white p-8 rounded-[40px] border-8 border-red-500 shadow-2xl text-center max-w-md w-full animate-in zoom-in">
                   <div className="text-6xl mb-4">⏰</div>
                   <h3 className="text-3xl font-black text-red-600 mb-2">TEMPO SCADUTO!</h3>
                   <p className="text-gray-600 font-bold mb-6">Sei arrivato al livello {level}. Riprova, puoi farcela!</p>
                   
                   <div className="flex flex-col gap-3">
                       <button onClick={startGame} className="w-full bg-yellow-400 text-black font-black text-xl py-3 rounded-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                           <RotateCcw size={20} /> RIPROVA
                       </button>
                       <button onClick={onBack} className="w-full bg-gray-200 text-gray-600 font-black text-xl py-3 rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                           <LogOut size={20} /> ESCI
                       </button>
                   </div>
               </div>
           )}

           {gameState === 'VICTORY' && (
               <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 shadow-2xl text-center max-w-md w-full animate-in zoom-in">
                   <Trophy size={80} className="text-yellow-400 mx-auto mb-4 animate-bounce drop-shadow-lg" />
                   <h3 className="text-3xl font-black text-purple-600 mb-2">INCREDIBILE!</h3>
                   <p className="text-gray-600 font-bold mb-6">Hai superato tutti i 30 livelli!</p>
                   
                   <div className="bg-yellow-100 text-yellow-800 px-6 py-3 rounded-2xl font-black text-2xl border-2 border-yellow-400 mb-8 inline-block animate-pulse">
                       +5 GETTONI! 🪙
                   </div>

                   <div className="flex flex-col gap-3">
                       <button onClick={startGame} className="w-full bg-green-500 text-white font-black text-xl py-3 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                           <RotateCcw size={20} /> GIOCA ANCORA
                       </button>
                       <button onClick={onBack} className="w-full bg-gray-200 text-gray-600 font-black text-xl py-3 rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                           <LogOut size={20} /> ESCI
                       </button>
                   </div>
               </div>
           )}

       </div>
    </div>
  );
};

export default OddOneOutGame;
