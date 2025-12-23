import React, { useState, useEffect } from 'react';
import { RotateCcw, Loader2 } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const TITLE_IMG = 'https://i.postimg.cc/nrFpH8gQ/dmana-(1).png';
const BTN_EASY_IMG = 'https://i.postimg.cc/MpVqCtbx/facile.png';
const BTN_MEDIUM_IMG = 'https://i.postimg.cc/3x5HFmMp/intermedio.png';
const BTN_HARD_IMG = 'https://i.postimg.cc/tRsTr3f4/difficile.png';
const LOCK_IMG = 'https://i.postimg.cc/3Nz0wMj1/lucchetto.png';
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';
const BG_IMG = 'https://i.postimg.cc/6pBThyG1/sfondodama.jpg';
const GRANDFATHER_THINKING_IMG = 'https://i.postimg.cc/Cx4Jg8cB/nonno-pensante-(1)-(1).png';

type PieceColor = 'RED' | 'BLACK';
type PieceType = 'MAN' | 'KING';
type Piece = { color: PieceColor; type: PieceType } | null;
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface CheckersGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const CheckersGame: React.FC<CheckersGameProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [board, setBoard] = useState<Piece[]>(Array(64).fill(null));
  const [turn, setTurn] = useState<PieceColor>('RED'); 
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [jumpingPieceIdx, setJumpingPieceIdx] = useState<number | null>(null);
  
  // Stato per l'animazione della mossa avversaria
  const [aiMoving, setAiMoving] = useState<{ from: number, to: number } | null>(null);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

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
          initBoard();
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
      for (let i = 0; i < 64; i++) {
          const row = Math.floor(i / 8);
          const col = i % 8;
          if ((row + col) % 2 === 1) {
              if (row < 3) newBoard[i] = { color: 'BLACK', type: 'MAN' };
              if (row > 4) newBoard[i] = { color: 'RED', type: 'MAN' };
          }
      }
      setBoard(newBoard);
      setTurn('RED');
      setWinner(null);
      setSelectedIdx(null);
      setValidMoves([]);
      setIsThinking(false);
      setRewardGiven(false);
      setJumpingPieceIdx(null);
      setAiMoving(null);
  };

  useEffect(() => {
      if (difficulty) initBoard();
  }, [difficulty]);

  useEffect(() => {
      if (winner === 'RED' && !rewardGiven && onEarnTokens) {
          let reward = 5; 
          if (difficulty === 'MEDIUM') reward = 10;
          if (difficulty === 'HARD') reward = 15;
          onEarnTokens(reward);
          setUserTokens(prev => prev + reward);
          setRewardGiven(true);
      }
  }, [winner, rewardGiven, onEarnTokens, difficulty]);

  const getJumps = (idx: number, currentBoard: Piece[]) => {
      const piece = currentBoard[idx];
      if (!piece) return [];
      const jumps: number[] = [];
      const row = Math.floor(idx / 8);
      const col = idx % 8;
      const isKing = piece.type === 'KING';
      const directions = [];
      
      // In Dama Italiana, la dama può mangiare in tutte le direzioni.
      // Le pedine semplici mangiano solo in avanti (rispetto al loro colore).
      if (piece.color === 'RED' || isKing) directions.push([-1, -1], [-1, 1]); 
      if (piece.color === 'BLACK' || isKing) directions.push([1, -1], [1, 1]); 

      directions.forEach(([dr, dc]) => {
          const midR = row + dr; const midC = col + dc;
          const endR = row + (dr * 2); const endC = col + (dc * 2);
          if (endR >= 0 && endR < 8 && endC >= 0 && endC < 8) {
              const midPiece = currentBoard[midR * 8 + midC];
              const endPiece = currentBoard[endR * 8 + endC];
              
              // C'è un pezzo avversario da mangiare e la casella dopo è vuota
              if (midPiece && midPiece.color !== piece.color && !endPiece) {
                  // REGOLA SPECIALE: Una pedina semplice non può mangiare una superdama
                  if (piece.type === 'MAN' && midPiece.type === 'KING') {
                      return; 
                  }
                  jumps.push(endR * 8 + endC);
              }
          }
      });
      return jumps;
  };

  const getRegularMoves = (idx: number, currentBoard: Piece[]) => {
      const piece = currentBoard[idx];
      if (!piece) return [];
      const moves: number[] = [];
      const row = Math.floor(idx / 8);
      const col = idx % 8;
      const isKing = piece.type === 'KING';
      const directions = [];
      
      // I pezzi semplici si muovono solo in avanti. Le dame ovunque.
      if (piece.color === 'RED' || isKing) directions.push([-1, -1], [-1, 1]); 
      if (piece.color === 'BLACK' || isKing) directions.push([1, -1], [1, 1]); 

      directions.forEach(([dr, dc]) => {
          const r = row + dr; const c = col + dc;
          if (r >= 0 && r < 8 && c >= 0 && c < 8 && !currentBoard[r * 8 + c]) {
              moves.push(r * 8 + c);
          }
      });
      return moves;
  };

  const getMoves = (idx: number, currentBoard: Piece[]) => {
      return [...getJumps(idx, currentBoard), ...getRegularMoves(idx, currentBoard)];
  };

  const handleSelect = (idx: number) => {
      if (turn !== 'RED' || winner || isThinking || aiMoving) return;

      if (jumpingPieceIdx !== null && idx !== jumpingPieceIdx) return;

      if (board[idx]?.color === 'RED') {
          setSelectedIdx(idx);
          if (jumpingPieceIdx !== null) {
              setValidMoves(getJumps(idx, board));
          } else {
              setValidMoves(getMoves(idx, board));
          }
      } else {
          if (jumpingPieceIdx === null) {
              setSelectedIdx(null);
              setValidMoves([]);
          }
      }
  };

  const movePiece = (from: number, to: number) => {
      const newBoard = [...board];
      const piece = newBoard[from];
      if (!piece) return;

      const fromRow = Math.floor(from / 8);
      const fromCol = from % 8;
      const toRow = Math.floor(to / 8);
      const toCol = to % 8;
      
      const isJump = Math.abs(toRow - fromRow) === 2;

      if (isJump) {
          const midRow = (fromRow + toRow) / 2;
          const midCol = (fromCol + toCol) / 2;
          newBoard[midRow * 8 + midCol] = null; 
      }

      newBoard[to] = { ...piece }; 
      newBoard[from] = null;

      if (piece.color === 'RED' && toRow === 0) newBoard[to]!.type = 'KING';
      if (piece.color === 'BLACK' && toRow === 7) newBoard[to]!.type = 'KING';

      setBoard(newBoard);

      const redCount = newBoard.filter(p => p?.color === 'RED').length;
      const blackCount = newBoard.filter(p => p?.color === 'BLACK').length;

      if (blackCount === 0) {
          setWinner('RED');
          return;
      }
      if (redCount === 0) {
          setWinner('BLACK');
          return;
      }

      if (isJump) {
          const nextJumps = getJumps(to, newBoard);
          if (nextJumps.length > 0) {
              setJumpingPieceIdx(to);
              setSelectedIdx(to);
              setValidMoves(nextJumps);
              return;
          }
      }

      setJumpingPieceIdx(null);
      setSelectedIdx(null);
      setValidMoves([]);
      setTurn(prev => prev === 'RED' ? 'BLACK' : 'RED');
  };

  const aiMove = () => {
      setIsThinking(true);
      setTimeout(() => {
          let currentBoard = [...board];
          let aiJumpingIdx: number | null = null;
          let movedInThisTurn = false;

          const executeMove = () => {
              const pieces = [];
              for (let i = 0; i < 64; i++) {
                  if (currentBoard[i]?.color === 'BLACK') {
                      if (aiJumpingIdx === null || aiJumpingIdx === i) {
                          pieces.push(i);
                      }
                  }
              }

              let bestMove = null;
              let jumpsAvailable = [];
              let regularsAvailable = [];

              for (let i of pieces) {
                  const jumps = getJumps(i, currentBoard);
                  const regulars = getRegularMoves(i, currentBoard);
                  jumps.forEach(m => jumpsAvailable.push({ from: i, to: m }));
                  regulars.forEach(m => regularsAvailable.push({ from: i, to: m }));
              }

              if (jumpsAvailable.length > 0) {
                  bestMove = jumpsAvailable[Math.floor(Math.random() * jumpsAvailable.length)];
              } else if (regularsAvailable.length > 0 && aiJumpingIdx === null) {
                  bestMove = regularsAvailable[Math.floor(Math.random() * regularsAvailable.length)];
              }

              if (bestMove) {
                  // AVVIA ANIMAZIONE VISIVA
                  setIsThinking(false);
                  setAiMoving({ from: bestMove.from, to: bestMove.to });

                  // Aspetta che l'animazione finisca (800ms mossa + 200ms pausa)
                  setTimeout(() => {
                      const fromRow = Math.floor(bestMove.from / 8);
                      const toRow = Math.floor(bestMove.to / 8);
                      const isJump = Math.abs(toRow - fromRow) === 2;

                      const piece = currentBoard[bestMove.from];
                      if (isJump) {
                          const midRow = (fromRow + toRow) / 2;
                          const midCol = ((bestMove.from % 8) + (bestMove.to % 8)) / 2;
                          currentBoard[midRow * 8 + midCol] = null;
                      }
                      currentBoard[bestMove.to] = { ...piece! };
                      currentBoard[bestMove.from] = null;

                      if (piece && piece.color === 'BLACK' && toRow === 7) currentBoard[bestMove.to]!.type = 'KING';

                      movedInThisTurn = true;
                      setAiMoving(null);
                      setBoard([...currentBoard]); // Forza aggiornamento UI

                      if (isJump) {
                          const nextJumps = getJumps(bestMove.to, currentBoard);
                          if (nextJumps.length > 0) {
                              aiJumpingIdx = bestMove.to;
                              // Breve attesa tra i salti multipli
                              setTimeout(executeMove, 500);
                              return;
                          }
                      }
                      
                      // Fine turno AI
                      const redCount = currentBoard.filter(p => p?.color === 'RED').length;
                      if (redCount === 0) setWinner('BLACK');
                      else setTurn('RED');
                  }, 800);
              } else {
                  if (!movedInThisTurn) setWinner('RED');
                  setIsThinking(false);
              }
          };

          executeMove();
      }, 2000);
  };

  useEffect(() => {
      if (turn === 'BLACK' && !winner && !aiMoving) aiMove();
  }, [turn, winner]);

  const handleLevelSelect = (level: Difficulty) => {
      if (level === 'HARD' && !isHardUnlocked) {
          setShowUnlockModal(true);
          return;
      }
      setDifficulty(level);
  };

  const backToMenu = () => {
      setDifficulty(null);
      setBoard(Array(64).fill(null));
      setJumpingPieceIdx(null);
      setAiMoving(null);
  };

  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

  if (!difficulty) {
      return (
          <div className={wrapperStyle} style={{ backgroundImage: `url(${BG_IMG})` }}>
              <div className="absolute top-4 left-4 z-50">
                  <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                      <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" />
                  </button>
              </div>
              <div className="absolute top-4 right-4 z-50 pointer-events-none">
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg">
                      <span>{userTokens}</span> <span className="text-xl">🪙</span>
                  </div>
              </div>
              {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
              <div className="w-full h-full flex flex-col items-center justify-center p-4 pt-16">
                  <img src={TITLE_IMG} alt="Dama" className="w-72 md:w-96 h-auto mb-6 relative z-10 hover:scale-105 transition-transform duration-300" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
                  <div className="flex flex-col gap-4 items-center w-full relative z-10">
                      <button onClick={() => handleLevelSelect('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" /></button>
                      <button onClick={() => handleLevelSelect('MEDIUM')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto drop-shadow-md" /></button>
                      <div className="relative hover:scale-105 active:scale-95 transition-transform w-48">
                          <button onClick={() => handleLevelSelect('HARD')} className={`w-full ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}><img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-md" /></button>
                          {!isHardUnlocked && (
                              <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                                  <img src={LOCK_IMG} alt="Bloccato" className="w-12 h-12 drop-shadow-lg rotate-12" />
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )
  }

  const tokenReward = difficulty === 'EASY' ? 5 : difficulty === 'MEDIUM' ? 10 : 15;

  return (
    <div className={wrapperStyle} style={{ backgroundImage: `url(${BG_IMG})` }}>
        <div className="absolute top-4 left-4 z-50">
            <button onClick={backToMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                <img src={BTN_BACK_MENU_IMG} alt="Torna al Menu" className="h-12 w-auto drop-shadow-md" />
            </button>
        </div>
        <div className="absolute top-4 right-4 z-50 pointer-events-none"><div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg"><span>{userTokens}</span> <span className="text-xl">🪙</span></div></div>

        <div className="w-full h-full flex flex-col items-center justify-center p-2 relative z-10">
            <img src={TITLE_IMG} alt="Dama" className="h-20 md:h-28 w-auto mb-2 drop-shadow-md shrink-0" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
            <p className="text-white font-bold mb-2 bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm border border-white/20 shrink-0 text-sm md:text-base">{difficulty === 'EASY' ? 'Livello Facile' : (difficulty === 'MEDIUM' ? 'Livello Medio' : 'Livello Difficile')}</p>
            <div className="flex items-center gap-4 mb-2 bg-white px-6 py-2 rounded-full border-2 border-black relative shadow-lg shrink-0 scale-90 md:scale-100">
                <div className={`w-4 h-4 rounded-full ${turn === 'RED' ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}></div>
                <span className={`font-bold ${turn === 'RED' ? 'text-red-600' : 'text-slate-800'}`}>{turn === 'RED' ? (jumpingPieceIdx !== null ? 'Ancora tu!' : 'Tocca a te (Rossi)') : 'Avversario (Neri)'}</span>
            </div>

            <div className="bg-white/40 backdrop-blur-md p-3 md:p-4 rounded-[30px] border-4 border-white/50 shadow-2xl relative shrink-0">
                {isThinking && (
                    <div className="absolute -top-32 right-[-20px] md:-top-44 md:right-[-40px] z-[100] flex flex-col items-center animate-in fade-in zoom-in duration-500 pointer-events-none transform -rotate-6">
                        <span 
                            className="font-luckiest text-lg md:text-2xl text-yellow-300 uppercase whitespace-nowrap mb-[-25px] relative z-10 -translate-x-3"
                            style={{ 
                                textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                WebkitTextStroke: '1px black'
                            }}
                        >
                            mmmh sto pensando...
                        </span>
                        <img 
                            src={GRANDFATHER_THINKING_IMG} 
                            alt="Nonno che pensa" 
                            className="w-64 h-64 md:w-80 md:h-80 max-w-none object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
                        />
                    </div>
                )}
                <div className="grid grid-cols-8 grid-rows-8 w-[min(90vw,55vh)] h-[min(90vw,55vh)] md:w-[min(60vh,60vw)] md:h-[min(60vh,60vw)] border-4 border-amber-900 rounded-lg overflow-hidden bg-amber-100">
                    {board.map((piece, idx) => {
                        const row = Math.floor(idx / 8);
                        const col = idx % 8;
                        const isDark = (row + col) % 2 === 1;
                        const isValid = validMoves.includes(idx);
                        const isSelected = selectedIdx === idx;
                        const canBeSelected = jumpingPieceIdx === null || jumpingPieceIdx === idx;
                        
                        // Gestione animazione avversario
                        const isAiAnimatingFrom = aiMoving?.from === idx;
                        const isAiAnimatingTo = aiMoving?.to === idx;
                        
                        // Calcolo trasformazione per l'animazione
                        let transform = 'none';
                        let transition = 'none';
                        if (isAiAnimatingFrom) {
                            const toRow = Math.floor(aiMoving!.to / 8);
                            const toCol = aiMoving!.to % 8;
                            const dr = (toRow - row) * 100;
                            const dc = (toCol - col) * 100;
                            transform = `translate(${dc}%, ${dr}%)`;
                            transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        }

                        return (
                            <div key={idx} onClick={() => isValid ? movePiece(selectedIdx!, idx) : handleSelect(idx)} className={`relative flex items-center justify-center w-full h-full rounded-sm ${isDark ? 'bg-amber-500' : 'bg-amber-100'} ${isSelected ? 'ring-inset ring-4 ring-yellow-400 z-10' : ''} ${jumpingPieceIdx === idx ? 'ring-inset ring-2 ring-red-500 animate-pulse' : ''} ${!canBeSelected && piece?.color === 'RED' ? 'opacity-70' : ''}`}>
                                {isValid && !piece && <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full opacity-80 shadow-sm animate-pulse border-2 border-white" />}
                                
                                {/* Pezzo reale (nascosto se si sta muovendo da questa casella) */}
                                {piece && !isAiAnimatingTo && (
                                    <div 
                                        className={`
                                            w-[80%] h-[80%] rounded-full shadow-[inset_0_4px_4px_rgba(255,255,255,0.4),0_4px_4px_rgba(0,0,0,0.2)] 
                                            flex items-center justify-center border-4 relative
                                            ${piece.color === 'RED' ? 'bg-red-500 border-red-700' : 'bg-slate-800 border-black'}
                                            ${isAiAnimatingFrom ? 'z-50 shadow-2xl' : 'z-10'}
                                        `}
                                        style={{ transform, transition }}
                                    >
                                        {piece.type === 'KING' && <span className="text-yellow-400 text-lg md:text-2xl font-black drop-shadow-sm">👑</span>}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {winner && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                    <div className="bg-white p-8 rounded-[40px] text-center border-4 border-black max-w-sm w-full shadow-2xl relative flex flex-col items-center">
                        {winner === 'RED' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                        <h2 className="text-3xl font-black mb-4 text-boo-purple leading-tight">{winner === 'RED' ? 'HAI VINTO! 🎉' : 'HAI PERSO 🤖'}</h2>
                        {winner === 'RED' && <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">+{tokenReward} GETTONI! 🪙</div>}
                        <button onClick={initBoard} className="flex items-center justify-center gap-2 bg-boo-green text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 shadow-[4px_4px_0_black] w-full mb-3"><RotateCcw size={20} /> Rigioca</button>
                        <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform"><img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto" /></button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default CheckersGame;