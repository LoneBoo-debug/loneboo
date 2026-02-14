
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RotateCcw, Loader2 } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import { isNightTime } from '../services/weatherService';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const TITLE_IMG = 'https://i.postimg.cc/nrFpH8Q/dmana-(1).png';
const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/facilelogodsnaq.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediologjeidnuj4hedn.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/difficielrnfjn4edj.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp'; 
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';

// Nuovi Asset Sfondi
const BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/damadayesa.webp';
const BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/damanghtsa.webp';

const GRANDFATHER_THINKING_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grandpa-thinking.webp';
const VICTORY_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/victory-checkers.webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

// Musica di sottofondo
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfredsmusicalsfonbg.MP3';

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
  const [now, setNow] = useState(new Date());
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
  const [aiMoving, setAiMoving] = useState<{ from: number, to: number } | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Background dinamico basato sull'orario (20:15 - 06:45)
  const currentBg = useMemo(() => isNightTime(now) ? BG_NIGHT : BG_DAY, [now]);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);

      // Inizializza Audio
      bgMusicRef.current = new Audio(BG_MUSIC_URL);
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.4;

      // Timer per l'aggiornamento dell'orario
      const timeTimer = setInterval(() => setNow(new Date()), 60000);
      return () => {
          clearInterval(timeTimer);
          if (bgMusicRef.current) {
              bgMusicRef.current.pause();
              bgMusicRef.current = null;
          }
      };
  }, []);

  // Gestione musica basata sullo stato del gioco e del toggle
  useEffect(() => {
      if (bgMusicRef.current) {
          if (musicEnabled && difficulty && !winner) {
              bgMusicRef.current.play().catch(() => console.log("Musica bloccata dal browser"));
          } else {
              bgMusicRef.current.pause();
          }
      }
  }, [musicEnabled, difficulty, winner]);

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
          let reward = difficulty === 'HARD' ? 20 : (difficulty === 'MEDIUM' ? 10 : 5);
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
      if (piece.color === 'RED' || isKing) directions.push([-1, -1], [-1, 1]); 
      if (piece.color === 'BLACK' || isKing) directions.push([1, -1], [1, 1]); 

      directions.forEach(([dr, dc]) => {
          const endR = row + (dr * 2); const endC = col + (dc * 2);
          if (endR >= 0 && endR < 8 && endC >= 0 && endC < 8) {
              const midPiece = currentBoard[(row + dr) * 8 + (col + dc)];
              const endPiece = currentBoard[endR * 8 + endC];
              if (midPiece && midPiece.color !== piece.color && !endPiece) {
                  if (piece.type === 'MAN' && midPiece.type === 'KING') return; 
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
          setValidMoves(jumpingPieceIdx !== null ? getJumps(idx, board) : getMoves(idx, board));
      } else if (jumpingPieceIdx === null) {
          setSelectedIdx(null); setValidMoves([]);
      }
  };

  const movePiece = (from: number, to: number) => {
      const newBoard = [...board];
      const piece = newBoard[from];
      if (!piece) return;
      const fromRow = Math.floor(from / 8); const toRow = Math.floor(to / 8);
      const isJump = Math.abs(toRow - fromRow) === 2;

      if (isJump) {
          const midRow = (fromRow + toRow) / 2;
          const midCol = (from % 8 + to % 8) / 2;
          newBoard[midRow * 8 + midCol] = null; 
      }
      newBoard[to] = { ...piece }; newBoard[from] = null;
      if (piece.color === 'RED' && toRow === 0) newBoard[to]!.type = 'KING';
      if (piece.color === 'BLACK' && toRow === 7) newBoard[to]!.type = 'KING';
      setBoard(newBoard);

      if (newBoard.filter(p => p?.color === 'BLACK').length === 0) { setWinner('RED'); return; }
      if (newBoard.filter(p => p?.color === 'RED').length === 0) { setWinner('BLACK'); return; }

      if (isJump) {
          const nextJumps = getJumps(to, newBoard);
          if (nextJumps.length > 0) { setJumpingPieceIdx(to); setSelectedIdx(to); setValidMoves(nextJumps); return; }
      }
      setJumpingPieceIdx(null); setSelectedIdx(null); setValidMoves([]); setTurn(prev => prev === 'RED' ? 'BLACK' : 'RED');
  };

  const aiMove = () => {
      setIsThinking(true);
      setTimeout(() => {
          let currentBoard = [...board];
          let aiJumpingIdx: number | null = null;
          const executeMove = () => {
              const pieces = [];
              for (let i = 0; i < 64; i++) {
                  if (currentBoard[i]?.color === 'BLACK' && (aiJumpingIdx === null || aiJumpingIdx === i)) pieces.push(i);
              }
              let bestMove = null; let jumpsAvailable: any[] = []; let regularsAvailable: any[] = [];
              for (let i of pieces) {
                  getJumps(i, currentBoard).forEach(m => jumpsAvailable.push({ from: i, to: m }));
                  getRegularMoves(i, currentBoard).forEach(m => regularsAvailable.push({ from: i, to: m }));
              }
              if (jumpsAvailable.length > 0) bestMove = jumpsAvailable[Math.floor(Math.random() * jumpsAvailable.length)];
              else if (regularsAvailable.length > 0 && aiJumpingIdx === null) bestMove = regularsAvailable[Math.floor(Math.random() * regularsAvailable.length)];

              if (bestMove) {
                  setIsThinking(false); setAiMoving({ from: bestMove.from, to: bestMove.to });
                  setTimeout(() => {
                      const fRow = Math.floor(bestMove.from / 8); const tRow = Math.floor(bestMove.to / 8);
                      const isJ = Math.abs(tRow - fRow) === 2;
                      const p = currentBoard[bestMove.from];
                      if (isJ) { currentBoard[Math.floor((fRow + tRow) / 2) * 8 + Math.floor((bestMove.from % 8 + bestMove.to % 8) / 2)] = null; }
                      currentBoard[bestMove.to] = { ...p! }; currentBoard[bestMove.from] = null;
                      if (p && p.color === 'BLACK' && tRow === 7) currentBoard[bestMove.to]!.type = 'KING';
                      setAiMoving(null); setBoard([...currentBoard]);
                      if (isJ) {
                          const nextJ = getJumps(bestMove.to, currentBoard);
                          if (nextJ.length > 0) { aiJumpingIdx = bestMove.to; setTimeout(executeMove, 500); return; }
                      }
                      if (currentBoard.filter(p => p?.color === 'RED').length === 0) setWinner('BLACK'); else setTurn('RED');
                  }, 800);
              } else { setWinner('RED'); setIsThinking(false); }
          };
          executeMove();
      }, 2000);
  };

  useEffect(() => { if (turn === 'BLACK' && !winner && !aiMoving) aiMove(); }, [turn, winner]);

  const handleLevelSelect = (level: Difficulty) => {
      if (level === 'HARD' && !isHardUnlocked) { setShowUnlockModal(true); return; }
      setDifficulty(level);
  };

  const backToMenu = () => { setDifficulty(null); initBoard(); };

  const wrapperStyle = "fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={wrapperStyle}>
        <style>{`
            /* Effetto Sticker Cartoon */
            .sticker-btn {
                filter: 
                    drop-shadow(2px 2px 0px white) 
                    drop-shadow(-2px -2px 0px white) 
                    drop-shadow(2px -2px 0px white) 
                    drop-shadow(-2px 2px 0px white)
                    drop-shadow(0px 4px 8px rgba(0,0,0,0.3));
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .sticker-btn:active {
                transform: scale(0.92);
            }
            
            @keyframes float-btn {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            .animate-float-btn { animation: float-btn 3s ease-in-out infinite; }
        `}</style>

        {/* SFONDO A TUTTO SCHERMO DINAMICO */}
        <img 
            src={currentBg} 
            alt="" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" 
            draggable={false}
        />

        {/* TASTI NAVIGAZIONE IN ALTO A SINISTRA */}
        <div className="absolute top-[80px] md:top-[120px] left-4 z-[300] flex flex-col items-start gap-2 pointer-events-auto">
            <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto" />
            </button>
            {difficulty && (
                <button onClick={backToMenu} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                    <img src={BTN_BACK_MENU_IMG} alt="Torna al Menu" className="h-16 md:h-22 w-auto" />
                </button>
            )}
        </div>

        {/* SALDO GETTONI E AUDIO (ALTO A DESTRA) */}
        <div className="absolute top-[80px] md:top-[120px] right-4 z-[300] pointer-events-none flex flex-col items-end gap-3">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl pointer-events-auto">
                <span>{userTokens}</span> <span className="text-xl">🪙</span>
            </div>
            
            {/* Tasto Audio sotto i gettoni - Stessa logica di OddOneOut */}
            {difficulty && !winner && (
                <button 
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
                    title={musicEnabled ? "Spegni Musica" : "Accendi Musica"}
                >
                    <img src={AUDIO_ICON_IMG} alt="Audio" className="w-16 h-16 md:w-24 h-auto drop-shadow-xl" />
                </button>
            )}
        </div>

        {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
        
        {/* AREA CONTENUTO */}
        <div className="relative z-[110] w-full h-full flex flex-col items-center justify-start p-4 pt-44 md:pt-56">
            {!difficulty ? (
                <div className="flex flex-col items-center w-full animate-fade-in px-4">
                    <div className="flex flex-col gap-4 items-center w-full max-w-[220px] md:max-w-[280px]">
                        <button onClick={() => handleLevelSelect('EASY')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent">
                            <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" />
                        </button>
                        <button onClick={() => handleLevelSelect('MEDIUM')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent" style={{ animationDelay: '0.5s' }}>
                            <img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto drop-shadow-md" />
                        </button>
                        <div className="relative sticker-btn animate-float-btn w-full" style={{ animationDelay: '1s' }}>
                            <button onClick={() => handleLevelSelect('HARD')} className={`w-full outline-none border-none bg-transparent ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}>
                                <img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-md" />
                            </button>
                            {!isHardUnlocked && (
                                <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                                    <img src={LOCK_IMG} alt="Bloccato" className="w-10 h-10 drop-shadow-lg rotate-12" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/40 shadow-lg animate-in slide-in-from-top-4">
                        <p className="font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[2px_2px_0_black] text-sm md:text-xl" style={{ WebkitTextStroke: '1px black' }}>
                            Scegli un livello e sfida il nonno a Dama!
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-start min-h-0 pt-8 md:pt-14 px-2">
                    <div className="w-full max-w-[min(90vw,55vh)] md:max-w-[min(60vh,60vw)] flex justify-center mb-2">
                        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-1.5 rounded-full border-2 border-black relative shadow-lg shrink-0 scale-90 md:scale-100">
                            <div className={`w-4 h-4 rounded-full ${turn === 'RED' ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}></div>
                            <span className={`font-bold uppercase tracking-tight text-sm ${turn === 'RED' ? 'text-red-600' : 'text-slate-800'}`}>{turn === 'RED' ? (jumpingPieceIdx !== null ? 'Ancora tu!' : 'Tocca a te (Rossi)') : 'Nonno (Neri)'}</span>
                        </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-md p-3 md:p-4 rounded-[30px] border-4 border-white/50 shadow-2xl relative shrink-0">
                        {isThinking && (
                            <div className="absolute top-0 right-[-15px] md:right-[-30px] z-[200] flex flex-col items-center animate-in fade-in zoom-in duration-500 pointer-events-none transform -translate-y-[35%] -rotate-3">
                                <span className="font-luckiest text-sm md:text-xl text-yellow-300 uppercase whitespace-nowrap mb-[-15px] relative z-10 -translate-x-3" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', WebkitTextStroke: '1px black' }}>mmmh sto pensando...</span>
                                <img src={GRANDFATHER_THINKING_IMG} alt="Nonno pensa" className="w-56 h-56 md:w-72 md:h-72 max-w-none object-contain drop-shadow-xl" />
                            </div>
                        )}
                        <div className="grid grid-cols-8 grid-rows-8 w-[min(90vw,55vh)] h-[min(90vw,55vh)] md:w-[min(60vh,60vw)] md:h-[min(60vh,60vw)] border-4 border-amber-900 rounded-lg overflow-hidden bg-amber-100">
                            {board.map((piece, idx) => {
                                const row = Math.floor(idx / 8); const col = idx % 8;
                                const isDark = (row + col) % 2 === 1;
                                const isVal = validMoves.includes(idx); const isSel = selectedIdx === idx;
                                const isJump = jumpingPieceIdx === idx;
                                const isAiFrom = aiMoving?.from === idx;
                                let transform = 'none'; let transition = 'none';
                                if (isAiFrom) {
                                    const dr = (Math.floor(aiMoving!.to / 8) - row) * 100;
                                    const dc = (aiMoving!.to % 8 - col) * 100;
                                    transform = `translate(${dc}%, ${dr}%)`; transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                                }
                                return (
                                    <div key={idx} onClick={() => isVal ? movePiece(selectedIdx!, idx) : handleSelect(idx)} className={`relative flex items-center justify-center w-full h-full rounded-sm ${isDark ? 'bg-amber-500' : 'bg-amber-100'} ${isSel ? 'ring-inset ring-4 ring-yellow-400 z-10' : ''} ${isJump ? 'ring-inset ring-2 ring-red-500 animate-pulse' : ''}`}>
                                        {isVal && !piece && <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full opacity-80 shadow-sm animate-pulse border-2 border-white" />}
                                        {piece && (aiMoving === null || aiMoving.to !== idx) && (
                                            <div className={`w-[80%] h-[80%] rounded-full shadow-[inset_0_4px_4px_rgba(255,255,255,0.4),0_4px_4px_rgba(0,0,0,0.2)] flex items-center justify-center border-4 relative ${piece.color === 'RED' ? 'bg-red-500 border-red-700' : 'bg-slate-800 border-black'} ${isAiFrom ? 'z-50 shadow-2xl' : 'z-10'}`} style={{ transform, transition }}>
                                                {piece.type === 'KING' && <span className="text-yellow-400 text-lg md:text-2xl font-black drop-shadow-sm">👑</span>}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {winner && (
                        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                            <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 text-center shadow-2xl flex flex-col items-center max-sm w-full mx-auto relative overflow-hidden transform translate-y-10">
                                {winner === 'RED' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                                
                                <div className="mb-2">
                                    {winner === 'RED' ? (
                                        <div className="flex flex-col items-center">
                                            <img src={VICTORY_TITLE_IMG} alt="Hai Vinto" className="h-40 md:h-56 w-auto object-contain" />
                                            <p className="font-luckiest text-lg md:text-2xl text-boo-purple uppercase mt-2 whitespace-nowrap">HAI BATTUTO IL NONNO</p>
                                        </div>
                                    ) : (
                                        <h2 className="text-3xl font-black text-red-600 leading-tight uppercase">HAI PERSO 🤖</h2>
                                    )}
                                </div>

                                {winner === 'RED' && (
                                    <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap shadow-lg transform rotate-[-2deg]">
                                        +{difficulty === 'EASY' ? 5 : difficulty === 'MEDIUM' ? 10 : 20} GETTONI! 🪙
                                    </div>
                                )}

                                <div className="flex flex-row gap-4 w-full justify-center">
                                    <button onClick={initBoard} className="hover:scale-105 active:scale-95 transition-transform flex-1 max-w-[140px]">
                                        <img src={BTN_PLAY_AGAIN_IMG} alt="Rigioca" className="w-full h-auto drop-shadow-xl" />
                                    </button>
                                    <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform flex-1 max-w-[140px]">
                                        <img src={EXIT_BTN_IMG} alt="Esci" className="w-full h-auto drop-shadow-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default CheckersGame;
