
import React, { useState, useEffect } from 'react';
import { RotateCcw, Settings, Loader2, LogOut, Trophy, Lock } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface TicTacToeProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const TicTacToeGame: React.FC<TicTacToeProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);

  // Lock State
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  // Sync tokens when modal shows up
  useEffect(() => {
      if (showUnlockModal) {
          const p = getProgress();
          setUserTokens(p.tokens);
      }
  }, [showUnlockModal]);

  const handleUnlockHard = () => {
      if (unlockHardMode()) {
          setIsHardUnlocked(true);
          const p = getProgress();
          setUserTokens(p.tokens);
          setShowUnlockModal(false);
          // Auto start hard game
          setDifficulty('HARD');
          resetGame();
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  const checkWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn || !difficulty || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'X'; // Player is X (Ghost)
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (!newBoard.includes(null)) {
      setWinner('draw');
    } else {
      setIsPlayerTurn(false);
    }
  };

  // AI Logic
  const getBestMove = (currentBoard: string[], diff: Difficulty) => {
      const availableMoves = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
      
      // EASY: 80% Random
      if (diff === 'EASY') {
          if (Math.random() > 0.2) {
              return availableMoves[Math.floor(Math.random() * availableMoves.length)];
          }
      }

      // MEDIUM: Mix of random and smart. 
      if (diff === 'MEDIUM') {
          // 40% chance to just play random
          if (Math.random() > 0.6) {
              return availableMoves[Math.floor(Math.random() * availableMoves.length)];
          }
      }

      const lines = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8],
          [0, 3, 6], [1, 4, 7], [2, 5, 8],
          [0, 4, 8], [2, 4, 6]
      ];

      // 1. ATTACK (Can I win?)
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (currentBoard[a] === 'O' && currentBoard[b] === 'O' && !currentBoard[c]) return c;
          if (currentBoard[a] === 'O' && currentBoard[c] === 'O' && !currentBoard[b]) return b;
          if (currentBoard[b] === 'O' && currentBoard[c] === 'O' && !currentBoard[a]) return a;
      }

      // 2. DEFENSE (Block Opponent)
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (currentBoard[a] === 'X' && currentBoard[b] === 'X' && !currentBoard[c]) return c;
          if (currentBoard[a] === 'X' && currentBoard[c] === 'X' && !currentBoard[b]) return b;
          if (currentBoard[b] === 'X' && currentBoard[c] === 'X' && !currentBoard[a]) return a;
      }

      // 3. STRATEGY (Center & Corners) - Mostly for HARD
      if (!currentBoard[4]) return 4;
      const corners = [0, 2, 6, 8].filter(i => !currentBoard[i]);
      if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner && difficulty) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        const moveIndex = getBestMove(board, difficulty);
        
        if (moveIndex !== undefined) {
          const newBoard = [...board];
          newBoard[moveIndex] = 'O'; 
          setBoard(newBoard);
          
          const gameWinner = checkWinner(newBoard);
          if (gameWinner) setWinner(gameWinner);
          else if (!newBoard.includes(null)) setWinner('draw');
          
          setIsPlayerTurn(true);
        }
        setIsThinking(false);
      }, 1500); // Delay
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board, difficulty]);

  // EARN TOKENS - BALANCED
  useEffect(() => {
      if (winner === 'X' && !rewardGiven && onEarnTokens) {
          let reward = 5; // Easy
          if (difficulty === 'MEDIUM') reward = 10;
          if (difficulty === 'HARD') reward = 20;
          
          onEarnTokens(reward);
          setRewardGiven(true);
      }
  }, [winner, rewardGiven, onEarnTokens, difficulty]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setIsThinking(false);
    setRewardGiven(false);
  };

  const handleLevelSelect = (level: Difficulty) => {
      if (level === 'HARD' && !isHardUnlocked) {
          setShowUnlockModal(true);
          return;
      }
      setDifficulty(level);
      resetGame();
  };

  const backToMenu = () => {
      setDifficulty(null);
      resetGame();
  };

  if (!difficulty) {
      return (
          <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in text-center min-h-[500px]">
              {showUnlockModal && (
                  <UnlockModal 
                      onClose={() => setShowUnlockModal(false)}
                      onUnlock={handleUnlockHard}
                      onOpenNewsstand={handleOpenNewsstand}
                      currentTokens={userTokens}
                  />
              )}

              <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-8 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>Tris Spettrale</h2>
              <div className="bg-white p-8 rounded-[40px] border-4 border-black shadow-xl w-full">
                  <p className="text-2xl font-bold text-gray-700 mb-6">Abilità Avversario</p>
                  <div className="flex flex-col gap-4">
                      <button onClick={() => handleLevelSelect('EASY')} className="bg-green-500 text-white text-xl font-black py-4 px-6 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2">SBADATA 😴</button>
                      <button onClick={() => handleLevelSelect('MEDIUM')} className="bg-yellow-400 text-black text-xl font-black py-4 px-6 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2">ATTENTA 🧐</button>
                      <button onClick={() => handleLevelSelect('HARD')} className={`text-white text-xl font-black py-4 px-6 rounded-2xl border-4 border-black transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 ${isHardUnlocked ? 'bg-purple-600 hover:scale-105' : 'bg-gray-400 hover:scale-[1.02] cursor-pointer'}`}>
                          {isHardUnlocked ? 'ESPERTA 🔮' : <><Lock/> BLOCCATO</>}
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  const tokenReward = difficulty === 'EASY' ? 5 : difficulty === 'MEDIUM' ? 10 : 20;

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in text-center">
      <div className="w-full flex justify-between items-center mb-4 px-2">
          <button onClick={backToMenu} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/40">
              <Settings size={20} />
          </button>
          <h2 className="text-4xl md:text-5xl font-black text-boo-orange drop-shadow-[3px_3px_0_black]" style={{ textShadow: "3px 3px 0px black" }}>Tris Spettrale</h2>
          <div className="w-9"></div> 
      </div>
      
      <p className="text-sm md:text-xl font-bold text-boo-yellow drop-shadow-md mb-8 whitespace-nowrap overflow-hidden text-ellipsis w-full px-2">
         {difficulty === 'EASY' ? 'Livello Facile' : (difficulty === 'MEDIUM' ? 'Livello Medio' : 'Livello Esperto')}
      </p>
      
      <div className="bg-white p-6 rounded-[30px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] relative overflow-hidden">
        
        {/* GAME OVER OVERLAY - NOW FIXED TO AVOID CLIPPING */}
        {winner && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                <div className="bg-white p-8 rounded-[40px] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] w-full max-w-sm text-center relative">
                    
                    {/* SAVE REMINDER */}
                    {winner === 'X' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

                    <div className="text-6xl md:text-7xl mb-4 animate-bounce">
                        {winner === 'X' ? '🏆' : (winner === 'O' ? '🎃' : '🤝')}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-black mb-2 drop-shadow-sm">
                        {winner === 'X' ? 'HAI VINTO!' : (winner === 'O' ? 'OH NO!' : 'PAREGGIO!')}
                    </h2>
                    
                    {winner === 'X' && (
                        <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">
                            +{tokenReward} GETTONI! 🪙
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-3 w-full">
                        <button onClick={resetGame} className="w-full bg-boo-green text-white font-black text-xl px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                            <RotateCcw size={20} /> GIOCA ANCORA
                        </button>
                        <button onClick={onBack} className="w-full bg-red-500 text-white font-black text-xl px-8 py-3 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                            <LogOut size={20} /> ESCI
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Turn Indicator */}
        <div className="flex justify-between mb-6 px-4 font-bold text-lg md:text-xl relative">
           <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border-2 transition-colors ${isPlayerTurn ? 'bg-purple-100 border-purple-400 text-boo-purple' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
               <span className="text-2xl">👻</span> Tu
           </div>
           
           {isThinking && (
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full border-2 border-yellow-400 z-10 animate-in fade-in zoom-in">
                   <Loader2 size={16} className="animate-spin text-yellow-700"/>
                   <span className="text-xs font-black text-yellow-700 whitespace-nowrap">Sto pensando...</span>
               </div>
           )}

           <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border-2 transition-colors ${!isPlayerTurn ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
               Strega <span className="text-2xl">🧙‍♀️</span>
           </div>
        </div>

        {/* Game Grid */}
        <div className="w-64 h-64 md:w-80 md:h-80 mx-auto">
            <div className="grid grid-cols-3 gap-3 w-full h-full">
            {board.map((cell, idx) => (
                <div key={idx} className="relative w-full h-full overflow-hidden rounded-xl border-4 border-gray-200">
                    <button
                        type="button"
                        onClick={() => handleClick(idx)}
                        disabled={!!cell || !!winner || !isPlayerTurn || isThinking}
                        className={`absolute inset-0 w-full h-full flex items-center justify-center transition-colors duration-200 ${cell ? 'bg-white cursor-default' : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'}`}
                        style={{ touchAction: 'manipulation' }}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            {cell === 'X' && <span className="text-5xl md:text-6xl animate-in zoom-in duration-300 drop-shadow-sm leading-none select-none">👻</span>}
                            {cell === 'O' && <span className="text-5xl md:text-6xl animate-in zoom-in duration-300 drop-shadow-sm leading-none select-none">🧙‍♀️</span>}
                        </div>
                    </button>
                </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToeGame;
