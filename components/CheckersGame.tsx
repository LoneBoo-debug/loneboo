
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Loader2, LogOut, Lock, Settings } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

type Piece = { player: 'red' | 'black'; isKing: boolean } | null;
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface CheckersGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const CheckerPieceIcon: React.FC<{ player: 'red' | 'black'; isKing: boolean }> = ({ player, isKing }) => {
    const isPlayer = player === 'red';
    const fill = isPlayer ? '#FFFFFF' : '#991B1B'; 
    const stroke = isPlayer ? '#2563EB' : '#FECACA'; 
    const crownColor = isPlayer ? '#2563EB' : '#FFFFFF';

    return (
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-md transition-transform hover:scale-105">
            <circle cx="50" cy="50" r="45" fill={fill} stroke={stroke} strokeWidth="5" />
            <circle cx="50" cy="50" r="35" fill="none" stroke={stroke} strokeWidth="2" opacity="0.3" />
            <circle cx="50" cy="50" r="20" fill="none" stroke={stroke} strokeWidth="2" opacity="0.3" />
            {isKing && (
                <path d="M30 62 L30 42 L40 52 L50 32 L60 52 L70 42 L70 62 Z" fill={crownColor} stroke={stroke} strokeWidth="2" strokeLinejoin="round" className="drop-shadow-sm" />
            )}
        </svg>
    );
};

const CheckersGame: React.FC<CheckersGameProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [board, setBoard] = useState<Piece[]>([]);
  const [turn, setTurn] = useState<'red' | 'black'>('red'); 
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [winner, setWinner] = useState<'red' | 'black' | 'draw' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  
  // Lock State
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Timer Ref for cleanup
  const aiTimerRef = useRef<any>(null);

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
          setDifficulty('HARD');
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  const initBoard = () => {
    const newBoard: Piece[] = Array(64).fill(null);
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if ((r + c) % 2 === 1) {
                const idx = r * 8 + c;
                if (r < 3) {
                    newBoard[idx] = { player: 'black', isKing: false }; 
                } else if (r > 4) {
                    newBoard[idx] = { player: 'red', isKing: false };
                }
            }
        }
    }
    setBoard(newBoard);
    setTurn('red');
    setWinner(null);
    setSelectedIdx(null);
    setValidMoves([]);
    setIsThinking(false);
    setRewardGiven(false);
  };

  useEffect(() => {
    if (difficulty) initBoard();
    return () => {
        if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    }
  }, [difficulty]);

  useEffect(() => {
      window.scrollTo(0, 0);
  }, []);

  // REWARD LOGIC
  useEffect(() => {
      if (winner === 'red' && !rewardGiven && onEarnTokens) {
          let reward = 5; // Easy
          if (difficulty === 'MEDIUM') reward = 10;
          if (difficulty === 'HARD') reward = 20;
          
          onEarnTokens(reward);
          setRewardGiven(true);
      }
  }, [winner, rewardGiven, onEarnTokens, difficulty]);

  const getValidMoves = (idx: number, currentBoard: Piece[], player: 'red' | 'black') => {
    const piece = currentBoard[idx];
    if (!piece || piece.player !== player) return [];

    const moves: number[] = [];
    const size = 8;
    const directions = piece.isKing ? [-1, 1] : (player === 'red' ? [-1] : [1]);

    directions.forEach(rowDir => {
        [-1, 1].forEach(colDir => { 
            const targetRow = Math.floor(idx / size) + rowDir;
            const targetCol = (idx % size) + colDir;
            const targetIdx = targetRow * size + targetCol;

            if (targetRow >= 0 && targetRow < size && targetCol >= 0 && targetCol < size) {
                if (!currentBoard[targetIdx]) {
                    moves.push(targetIdx);
                } else if (currentBoard[targetIdx]?.player !== player) {
                    const enemyPiece = currentBoard[targetIdx];
                    if (!piece.isKing && enemyPiece?.isKing) return;

                    const jumpRow = targetRow + rowDir;
                    const jumpCol = targetCol + colDir;
                    const jumpIdx = jumpRow * size + jumpCol;
                    if (jumpRow >= 0 && jumpRow < size && jumpCol >= 0 && jumpCol < size && !currentBoard[jumpIdx]) {
                        moves.push(jumpIdx);
                    }
                }
            }
        });
    });
    return moves;
  };

  const handleSelect = (idx: number) => {
    if (turn !== 'red' || winner || isThinking) return;
    const piece = board[idx];
    if (piece?.player === 'red') {
        setSelectedIdx(idx);
        setValidMoves(getValidMoves(idx, board, 'red'));
    }
  };

  const movePiece = (fromIdx: number, toIdx: number, currentBoard: Piece[]) => {
      const newBoard = [...currentBoard];
      const piece = newBoard[fromIdx];
      if (!piece) return newBoard;

      newBoard[toIdx] = piece;
      newBoard[fromIdx] = null;

      const row = Math.floor(toIdx / 8);
      if ((piece.player === 'red' && row === 0) || (piece.player === 'black' && row === 7)) {
          newBoard[toIdx] = { ...piece, isKing: true };
      }

      if (Math.abs(toIdx - fromIdx) > 9) {
          const midIdx = (fromIdx + toIdx) / 2;
          newBoard[midIdx] = null;
      }
      return newBoard;
  };

  const handleMove = (toIdx: number) => {
    if (selectedIdx === null || !validMoves.includes(toIdx)) return;

    const newBoard = movePiece(selectedIdx, toIdx, board);
    setBoard(newBoard);
    setSelectedIdx(null);
    setValidMoves([]);
    setTurn('black');
  };

  useEffect(() => {
    if (turn === 'black' && !winner && difficulty) {
        setIsThinking(true);
        if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
        
        aiTimerRef.current = setTimeout(() => {
            const aiMoves: { from: number, to: number, score: number }[] = [];
            
            board.forEach((piece, idx) => {
                if (piece?.player === 'black') {
                    const moves = getValidMoves(idx, board, 'black');
                    moves.forEach(to => {
                        let score = 0;
                        if (Math.abs(to - idx) > 9) score += 10;
                        if (difficulty === 'EASY') score += Math.random() * 5;
                        if (difficulty === 'HARD') {
                             if (Math.floor(to / 8) === 7) score += 5;
                        }
                        aiMoves.push({ from: idx, to, score });
                    });
                }
            });

            if (aiMoves.length > 0) {
                aiMoves.sort((a, b) => b.score - a.score);
                const bestMove = aiMoves[0];
                const newBoard = movePiece(bestMove.from, bestMove.to, board);
                setBoard(newBoard);
                setTurn('red');
            } else {
                setWinner('red');
            }
            setIsThinking(false);
        }, 2000); 
    }
    
    // Cleanup on unmount/re-render handled by ref
    return () => {
        if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    }
  }, [turn, winner, difficulty, board]);

  useEffect(() => {
      if (turn === 'red' && !winner) {
          const redPieces = board.filter(p => p?.player === 'red').length;
          const blackPieces = board.filter(p => p?.player === 'black').length;
          
          if (blackPieces === 0) setWinner('red');
          if (redPieces === 0) setWinner('black');
          
          const hasMoves = board.some((p, i) => p?.player === 'red' && getValidMoves(i, board, 'red').length > 0);
          if (redPieces > 0 && !hasMoves) setWinner('black');
      }
  }, [turn, board]);

  const handleLevelSelect = (level: Difficulty) => {
      if (level === 'HARD' && !isHardUnlocked) {
          setShowUnlockModal(true);
          return;
      }
      setDifficulty(level);
  };

  const backToMenu = () => {
      setDifficulty(null);
      initBoard();
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

              <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-8 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>Dama Spettrale</h2>
              <div className="bg-white p-8 rounded-[40px] border-4 border-black shadow-xl w-full">
                  <p className="text-2xl font-bold text-gray-700 mb-6">Abilità Avversario</p>
                  <div className="flex flex-col gap-4">
                      <button onClick={() => handleLevelSelect('EASY')} className="bg-green-500 text-white text-xl font-black py-4 px-6 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2">PRINCIPIANTE 😊</button>
                      <button onClick={() => handleLevelSelect('MEDIUM')} className="bg-yellow-400 text-black text-xl font-black py-4 px-6 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2">ESPERTO 😎</button>
                      <button onClick={() => handleLevelSelect('HARD')} className={`text-white text-xl font-black py-4 px-6 rounded-2xl border-4 border-black transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 ${isHardUnlocked ? 'bg-red-600 hover:scale-105' : 'bg-gray-400 hover:scale-[1.02] cursor-pointer'}`}>
                          {isHardUnlocked ? 'MAESTRO 🤓' : <><Lock size={24}/> BLOCCATO</>}
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  const tokenReward = difficulty === 'EASY' ? 5 : difficulty === 'MEDIUM' ? 10 : 20;

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in w-full">
      <div className="w-full flex justify-between items-center mb-4 px-2">
          <button onClick={backToMenu} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/40">
              <Settings size={20} />
          </button>
          <h2 className="text-4xl md:text-5xl font-black text-boo-orange drop-shadow-[3px_3px_0_black]" style={{ textShadow: "3px 3px 0px black" }}>Dama</h2>
          <div className="w-9"></div> 
      </div>

      <p className="text-sm md:text-xl font-bold text-boo-yellow drop-shadow-md mb-4 whitespace-nowrap overflow-hidden text-ellipsis w-full px-2 text-center">
         {difficulty === 'EASY' ? 'Livello Principiante' : (difficulty === 'MEDIUM' ? 'Livello Esperto' : 'Livello Maestro')}
      </p>
      
      <div className="flex items-center gap-4 mb-4 bg-white px-6 py-2 rounded-full border-2 border-black shadow-md relative">
         <div className={`w-4 h-4 rounded-full ${turn === 'red' ? 'bg-blue-600 animate-pulse' : 'bg-red-600'}`}></div>
         <span className={`font-bold text-sm md:text-base ${turn === 'red' ? 'text-blue-600' : 'text-red-600'}`}>
             {turn === 'red' ? 'Tocca a te (Blu)' : 'Avversario (Rosso)'}
         </span>
      </div>

      <div className="bg-black p-1 md:p-3 rounded-xl border-4 border-black shadow-2xl overflow-hidden relative">
          {/* THINKING BUBBLE - Top Center of Board */}
          {isThinking && (
             <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-red-500 shadow-lg animate-in zoom-in fade-in">
                 <Loader2 size={18} className="animate-spin text-red-500" />
                 <span className="text-sm font-black text-red-600 uppercase tracking-wide">Sto pensando...</span>
             </div>
          )}

          <div className="grid grid-cols-8 grid-rows-8 w-[95vw] h-[95vw] max-w-[500px] max-h-[500px] shrink-0 border-2 border-amber-900/50">
              {board.map((piece, idx) => {
                  const row = Math.floor(idx / 8);
                  const col = idx % 8;
                  const isDark = (row + col) % 2 === 1;
                  const isSelected = selectedIdx === idx;
                  const isValidMove = validMoves.includes(idx);

                  return (
                      <div 
                        key={idx}
                        onClick={() => isValidMove ? handleMove(idx) : handleSelect(idx)}
                        className={`relative flex items-center justify-center w-full h-full ${isDark ? 'bg-[#8B4513]' : 'bg-[#F5DEB3]'} ${isValidMove ? 'cursor-pointer' : ''}`}
                      >
                          {isValidMove && <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full opacity-60 animate-pulse z-10" />}
                          {piece && (
                              <div className={`w-full h-full flex items-center justify-center ${isSelected ? 'ring-inset ring-4 ring-yellow-400 rounded-full' : ''}`}>
                                  <CheckerPieceIcon player={piece.player} isKing={piece.isKing} />
                              </div>
                          )}
                      </div>
                  );
              })}
          </div>
      </div>
      
      <p className="text-white/80 text-xs font-bold mt-2">
         Regola: La pedina semplice non può mangiare la Dama.
      </p>

      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
           <div className="bg-white p-8 rounded-[40px] text-center border-4 border-black max-w-sm w-full shadow-2xl relative">
              {/* SAVE REMINDER */}
              {winner === 'red' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

              <h2 className="text-3xl font-black mb-4 text-boo-purple">
                  {winner === 'red' ? 'HAI VINTO! 🎉' : 'Ha vinto l\'avversario 🤖'}
              </h2>
              {winner === 'red' && (
                  <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">
                      +{tokenReward} GETTONI! 🪙
                  </div>
              )}
              <div className="flex flex-col gap-4">
                  <button onClick={initBoard} className="flex items-center justify-center gap-2 bg-boo-green text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 shadow-[4px_4px_0_black]">
                      <RotateCcw size={20} /> Rigioca
                  </button>
                  <button onClick={onBack} className="flex items-center justify-center gap-2 bg-red-500 text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 shadow-[4px_4px_0_black]">
                      <LogOut size={20} /> Esci
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CheckersGame;
