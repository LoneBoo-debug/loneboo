
import React, { useState, useEffect } from 'react';
import { RotateCcw, Loader2, LogOut, Lock, Settings } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';
type Piece = { type: PieceType; color: PieceColor } | null;
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface ChessGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

// --- CLASSIC CHESS ICONS (Standard Recognizable Shapes) ---
const ChessPieceIcon: React.FC<{ type: PieceType; color: PieceColor }> = ({ type, color }) => {
    // FORCE COLORS
    const isPlayer = color === 'w'; // White/Blue
    
    // Player: White Fill with Thick Blue Stroke
    // PC: Dark Red Fill with Red Stroke
    const fill = isPlayer ? '#FFFFFF' : '#991B1B'; 
    const stroke = isPlayer ? '#2563EB' : '#FECACA'; 
    
    const props = {
        fill,
        stroke,
        strokeWidth: "2",
        strokeLinecap: "round" as "round",
        strokeLinejoin: "round" as "round",
        className: "w-full h-full drop-shadow-sm"
    };

    switch (type) {
        case 'p': return ( <svg viewBox="0 0 45 45" {...props}><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" /></svg> );
        case 'r': return ( <svg viewBox="0 0 45 45" {...props}><g transform="translate(0,0)"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt" /><path d="M34 14l-3 3H14l-3-3" /><path d="M31 17v12.5H14V17" strokeLinecap="butt" strokeLinejoin="miter" /><path d="M31 29.5l1.5 2.5h-20l1.5-2.5" /><path d="M11 14h23" fill="none" strokeLinejoin="miter" /></g></svg> );
        case 'n': return ( <svg viewBox="0 0 45 45" {...props}><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" /><path d="M24 18c.38 2.32-4.68 1.97-5 0 0-3.5 3-5.5 5-5.5 3.5 0 4 3 4 5.5 0 4.5-3.5 4.5-4 4.5m-5 4c-5.5 0-9 2-8 10h16" /></svg> );
        case 'b': return ( <svg viewBox="0 0 45 45" {...props}><g transform="translate(0,0)"><path d="M9 36c3.39-.97 9.11-1.45 13.5-1.45 4.38 0 10.11.48 13.5 1.45" /><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" /><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" /><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" strokeLinejoin="miter" /></g></svg> );
        case 'q': return ( <svg viewBox="0 0 45 45" {...props}><g transform="translate(0,0)"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM10.5 20.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM38.5 20.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" /><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-5.5-13.5V25l-7-11z" /><path d="M9 26c0 2 1.5 2 2.5 4 1 2.5 1.5 4.5 2.5 6.5s2 3 5.5 3.5 5.5 3.5 8.5 3.5c3 0 6-1 8.5-3.5s4.5-1 5.5-3.5 2.5-4.5 2.5-6.5c1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" /><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" /></g></svg> );
        case 'k': return ( <svg viewBox="0 0 45 45" {...props}><g transform="translate(0,0)"><path d="M22.5 11.63V6M20 8h5" fill="none" /><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" /><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-5 5.5-5 5.5l-6 6h-13l-6-6s-1-6.5-5-5.5c-3 6 6 10.5 6 10.5v7" /><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" fill="none" /></g></svg> );
        default: return null;
    }
};

const ChessGame: React.FC<ChessGameProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [board, setBoard] = useState<Piece[]>([]);
  const [turn, setTurn] = useState<PieceColor>('w'); // White (Blue) = Player
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [legalMoves, setLegalMoves] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [inCheck, setInCheck] = useState<PieceColor | null>(null);
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
          setDifficulty('HARD');
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  // Initial Setup
  const initBoard = () => {
    const newBoard: Piece[] = Array(64).fill(null);
    const setupRow = (row: number, color: PieceColor, pieces: PieceType[]) => {
      pieces.forEach((p, i) => { newBoard[row * 8 + i] = { type: p, color }; });
    };
    
    const backRow: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    const pawnRow: PieceType[] = Array(8).fill('p');

    setupRow(0, 'b', backRow); // PC (Red)
    setupRow(1, 'b', pawnRow);
    setupRow(6, 'w', pawnRow); // Player (Blue)
    setupRow(7, 'w', backRow);

    setBoard(newBoard);
    setTurn('w');
    setWinner(null);
    setInCheck(null);
    setSelectedIdx(null);
    setLegalMoves([]);
    setIsThinking(false);
    setRewardGiven(false);
  };

  useEffect(() => {
    if (difficulty) initBoard();
  }, [difficulty]);

  // REWARD LOGIC
  useEffect(() => {
      if (winner === 'w' && !rewardGiven && onEarnTokens) {
          let reward = 5; // Easy
          if (difficulty === 'MEDIUM') reward = 10;
          if (difficulty === 'HARD') reward = 20;
          
          onEarnTokens(reward);
          setRewardGiven(true);
      }
  }, [winner, rewardGiven, onEarnTokens, difficulty]);

  // --- LOGIC: MOVES ---
  const getPseudoMoves = (idx: number, currentBoard: Piece[], color: PieceColor) => {
    const piece = currentBoard[idx];
    if (!piece || piece.color !== color) return [];
    
    const moves: number[] = [];
    const row = Math.floor(idx / 8);
    const col = idx % 8;

    const addMove = (r: number, c: number) => {
       if (r >= 0 && r < 8 && c >= 0 && c < 8) {
           const targetIdx = r * 8 + c;
           const targetPiece = currentBoard[targetIdx];
           if (!targetPiece) {
               moves.push(targetIdx);
               return true; // Continue sliding
           } else if (targetPiece.color !== color) {
               moves.push(targetIdx); // Capture
               return false; // Stop sliding
           }
       }
       return false; // Stop/Invalid
    };

    if (piece.type === 'p') {
        const dir = color === 'w' ? -1 : 1;
        // Forward 1
        if (row + dir >= 0 && row + dir < 8 && !currentBoard[(row + dir) * 8 + col]) {
            moves.push((row + dir) * 8 + col);
            // Forward 2 (start)
            if ((color === 'w' && row === 6) || (color === 'b' && row === 1)) {
                if (!currentBoard[(row + dir * 2) * 8 + col]) moves.push((row + dir * 2) * 8 + col);
            }
        }
        // Capture Diagonal
        [[dir, -1], [dir, 1]].forEach(([dr, dc]) => {
            const r = row + dr, c = col + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const target = currentBoard[r * 8 + c];
                if (target && target.color !== color) moves.push(r * 8 + c);
            }
        });
    } else {
        const directions = {
            'r': [[0,1], [0,-1], [1,0], [-1,0]],
            'b': [[1,1], [1,-1], [-1,1], [-1,-1]],
            'q': [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]],
            'n': [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]],
            'k': [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]
        };
        // @ts-ignore
        const dirs = directions[piece.type];
        // @ts-ignore
        dirs.forEach(([dr, dc]) => {
            if (piece.type === 'n' || piece.type === 'k') {
                addMove(row + dr, col + dc);
            } else {
                let r = row + dr, c = col + dc;
                while (addMove(r, c)) {
                    r += dr; c += dc;
                }
            }
        });
    }
    return moves;
  };

  const isSquareAttacked = (targetIdx: number, currentBoard: Piece[], attackerColor: PieceColor) => {
      for (let i = 0; i < 64; i++) {
          const piece = currentBoard[i];
          if (piece && piece.color === attackerColor) {
              const moves = getPseudoMoves(i, currentBoard, attackerColor);
              if (moves.includes(targetIdx)) return true;
          }
      }
      return false;
  };

  const findKing = (currentBoard: Piece[], color: PieceColor) => {
      return currentBoard.findIndex(p => p?.type === 'k' && p.color === color);
  };

  const getLegalMoves = (idx: number, currentBoard: Piece[]) => {
      const piece = currentBoard[idx];
      if (!piece) return [];
      
      const pseudoMoves = getPseudoMoves(idx, currentBoard, piece.color);
      const legalMoves = pseudoMoves.filter(toIdx => {
          const tempBoard = [...currentBoard];
          tempBoard[toIdx] = tempBoard[idx];
          tempBoard[idx] = null;
          
          const kingIdx = findKing(tempBoard, piece.color);
          if (kingIdx === -1) return false; 
          const opponentColor = piece.color === 'w' ? 'b' : 'w';
          return !isSquareAttacked(kingIdx, tempBoard, opponentColor);
      });
      return legalMoves;
  };

  const isCheckmate = (currentBoard: Piece[], color: PieceColor) => {
      const kingIdx = findKing(currentBoard, color);
      const opponentColor = color === 'w' ? 'b' : 'w';
      if (!isSquareAttacked(kingIdx, currentBoard, opponentColor)) return false; 

      for (let i = 0; i < 64; i++) {
          if (currentBoard[i]?.color === color) {
              if (getLegalMoves(i, currentBoard).length > 0) return false; 
          }
      }
      return true; 
  };

  // --- PLAYER ACTIONS ---
  const handleSelect = (idx: number) => {
      if (turn === 'w' && board[idx]?.color === 'w' && !winner && !isThinking) {
          setSelectedIdx(idx);
          setLegalMoves(getLegalMoves(idx, board));
      }
  };

  const handleMove = (toIdx: number) => {
      if (selectedIdx === null) return;
      
      const newBoard = [...board];
      newBoard[toIdx] = newBoard[selectedIdx];
      newBoard[selectedIdx] = null;
      
      // Promotion (Auto Queen)
      if (newBoard[toIdx]?.type === 'p' && (Math.floor(toIdx / 8) === 0 || Math.floor(toIdx / 8) === 7)) {
          // @ts-ignore
          newBoard[toIdx].type = 'q';
      }

      setBoard(newBoard);
      setSelectedIdx(null);
      setLegalMoves([]);
      
      if (isCheckmate(newBoard, 'b')) {
          setWinner('w');
          return;
      }
      
      const blackKing = findKing(newBoard, 'b');
      if (isSquareAttacked(blackKing, newBoard, 'w')) setInCheck('b');
      else setInCheck(null);

      setTurn('b');
  };

  // --- AI ENGINE ---
  const getPieceValue = (p: Piece) => {
      if (!p) return 0;
      const values = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
      return values[p.type];
  };

  const getPositionBonus = (idx: number) => {
      const r = Math.floor(idx / 8);
      const c = idx % 8;
      if ((r === 3 || r === 4) && (c === 3 || c === 4)) return 3;
      if (r >= 2 && r <= 5 && c >= 2 && c <= 5) return 1;
      return 0;
  };

  useEffect(() => {
    if (turn === 'b' && !winner && difficulty) {
        setIsThinking(true);
        const aiTimer = setTimeout(() => {
            const allMoves: { from: number, to: number, score: number }[] = [];

            board.forEach((piece, idx) => {
                if (piece?.color === 'b') {
                    const moves = getLegalMoves(idx, board);
                    moves.forEach(to => {
                        const tempBoard = [...board];
                        const capturedPiece = tempBoard[to];
                        tempBoard[to] = tempBoard[idx];
                        tempBoard[idx] = null;

                        let score = 0;
                        if (capturedPiece) score += getPieceValue(capturedPiece) * 10;
                        score += getPositionBonus(to);

                        if (difficulty === 'EASY') score += Math.random() * 50; 
                        else if (difficulty === 'MEDIUM') {
                            if (isSquareAttacked(to, tempBoard, 'w')) score -= getPieceValue(piece);
                        } 
                        else if (difficulty === 'HARD') {
                            let maxPlayerResponse = 0;
                            for(let i=0; i<64; i++) {
                                if (tempBoard[i]?.color === 'w') {
                                    const pMoves = getPseudoMoves(i, tempBoard, 'w');
                                    pMoves.forEach(pm => {
                                        const target = tempBoard[pm];
                                        if (target && target.color === 'b') {
                                            const val = getPieceValue(target);
                                            if (val > maxPlayerResponse) maxPlayerResponse = val;
                                        }
                                    });
                                }
                            }
                            score -= (maxPlayerResponse * 10);
                            const whiteKing = findKing(tempBoard, 'w');
                            if (isSquareAttacked(whiteKing, tempBoard, 'b')) score += 15;
                        }

                        allMoves.push({ from: idx, to, score });
                    });
                }
            });

            if (allMoves.length > 0) {
                allMoves.sort((a, b) => b.score - a.score);
                const topMoves = allMoves.filter(m => m.score >= allMoves[0].score - 5);
                const bestMove = topMoves[Math.floor(Math.random() * topMoves.length)];
                
                const newBoard = [...board];
                newBoard[bestMove.to] = newBoard[bestMove.from];
                newBoard[bestMove.from] = null;
                
                if (newBoard[bestMove.to]?.type === 'p' && Math.floor(bestMove.to / 8) === 7) {
                    // @ts-ignore
                    newBoard[bestMove.to].type = 'q';
                }

                setBoard(newBoard);
                
                if (isCheckmate(newBoard, 'w')) {
                    setWinner('b');
                } else {
                    const whiteKing = findKing(newBoard, 'w');
                    if (isSquareAttacked(whiteKing, newBoard, 'b')) setInCheck('w');
                    else setInCheck(null);
                    setTurn('w');
                }
            } else {
                if (inCheck === 'b') setWinner('w');
                else setWinner('w'); 
            }
            setIsThinking(false);
        }, 2500); // 2.5 seconds delay
        return () => clearTimeout(aiTimer);
    }
  }, [turn, winner, difficulty, board]);

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
          <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in text-center">
              {showUnlockModal && (
                  <UnlockModal 
                      onClose={() => setShowUnlockModal(false)}
                      onUnlock={handleUnlockHard}
                      onOpenNewsstand={handleOpenNewsstand}
                      currentTokens={userTokens}
                  />
              )}

              <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-8 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>
                  Scacchi
              </h2>
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
            <h2 className="text-4xl md:text-5xl font-black text-boo-orange drop-shadow-[3px_3px_0_black]" style={{ textShadow: "3px 3px 0px black" }}>Scacchi</h2>
            <div className="w-9"></div> 
        </div>

        <p className="text-sm md:text-xl font-bold text-boo-yellow drop-shadow-md mb-4 whitespace-nowrap overflow-hidden text-ellipsis w-full px-2 text-center">
            {difficulty === 'EASY' ? 'Livello Principiante' : (difficulty === 'MEDIUM' ? 'Livello Esperto' : 'Livello Maestro')}
        </p>
        
        <div className="flex items-center gap-4 mb-4 bg-white px-6 py-2 rounded-full border-2 border-black relative">
            <div className={`w-4 h-4 rounded-full ${turn === 'w' ? 'bg-blue-600 animate-pulse' : 'bg-red-600'}`}></div>
            <span className={`font-bold ${turn === 'w' ? 'text-blue-600' : 'text-red-600'}`}>
                {turn === 'w' ? 'Tocca a te (Blu)' : 'Avversario (Rosso)'}
            </span>
            {inCheck && <span className="text-red-600 font-black animate-pulse bg-red-100 px-2 rounded">SCACCO!</span>}
        </div>

        <div className="bg-black p-1 md:p-3 rounded-xl border-4 border-black shadow-2xl overflow-hidden relative">
            {/* THINKING BUBBLE - Top Center of Board */}
            {isThinking && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-red-500 shadow-lg animate-in zoom-in fade-in">
                     <Loader2 size={18} className="animate-spin text-red-500" />
                     <span className="text-sm font-black text-red-600 uppercase tracking-wide">Sto pensando...</span>
                 </div>
             )}

            <div className="grid grid-cols-8 grid-rows-8 w-[95vw] h-[95vw] max-w-[500px] max-h-[500px] shrink-0 border-2 border-black bg-[#F5DEB3]">
                {board.map((piece, idx) => {
                    const row = Math.floor(idx / 8);
                    const col = idx % 8;
                    const isDark = (row + col) % 2 === 1;
                    const isValid = legalMoves.includes(idx);
                    const isSelected = selectedIdx === idx;
                    const isKingInDanger = piece?.type === 'k' && piece?.color === inCheck;
                    
                    return (
                        <div 
                            key={idx}
                            onClick={() => isValid ? handleMove(idx) : handleSelect(idx)}
                            className={`
                                relative flex items-center justify-center w-full h-full
                                ${isDark ? 'bg-[#8B4513]' : 'bg-[#F5DEB3]'}
                                ${isSelected ? 'ring-inset ring-4 ring-yellow-400 z-10' : ''}
                                ${isKingInDanger ? 'bg-red-500 animate-pulse' : ''}
                            `}
                        >
                            {isValid && !piece && <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full opacity-80 shadow-sm animate-pulse" />}
                            {isValid && piece && <div className="absolute inset-0 border-4 border-red-500 opacity-80 z-20" />}
                            {piece && (
                                <div className="w-[90%] h-[90%] transition-transform hover:scale-105 flex items-center justify-center">
                                    <ChessPieceIcon type={piece.type} color={piece.color} />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>

        {winner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                <div className="bg-white p-8 rounded-[40px] text-center border-4 border-black max-w-sm w-full shadow-2xl relative">
                    
                    {/* SAVE REMINDER */}
                    {winner === 'w' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

                    <h2 className="text-3xl font-black mb-4 text-boo-purple leading-tight">
                        {winner === 'w' ? 'SCACCO MATTO! 🎉' : 'SCACCO MATTO 🤖'}
                    </h2>
                    {winner === 'w' && (
                        <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">
                            +{tokenReward} GETTONI! 🪙
                        </div>
                    )}
                    <p className="text-lg font-bold text-gray-600 mb-6">
                         {winner === 'w' ? 'Hai Vinto!' : 'Ha vinto l\'avversario'}
                    </p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={initBoard}
                            className="flex items-center justify-center gap-2 bg-boo-green text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 shadow-[4px_4px_0_black]"
                        >
                            <RotateCcw size={20} /> Rigioca
                        </button>
                        <button 
                            onClick={onBack}
                            className="flex items-center justify-center gap-2 bg-red-500 text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 shadow-[4px_4px_0_black]"
                        >
                            <LogOut size={20} /> Esci
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ChessGame;
