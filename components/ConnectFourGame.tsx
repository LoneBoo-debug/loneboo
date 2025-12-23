
import React, { useState, useEffect } from 'react';
import { RotateCcw, Loader2, Lock } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const TITLE_IMG = 'https://i.postimg.cc/9XB05jLW/forza4-(1)-(1).png';
const BTN_EASY_IMG = 'https://i.postimg.cc/MpVqCtbx/facile.png';
const BTN_MEDIUM_IMG = 'https://i.postimg.cc/3x5HFmMp/intermedio.png';
const BTN_HARD_IMG = 'https://i.postimg.cc/tRsTr3f4/difficile.png';
const LOCK_IMG = 'https://i.postimg.cc/3Nz0wMj1/lucchetto.png'; // New Lock Image
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';
const BG_IMG = 'https://i.postimg.cc/x1ybhBKR/sfondof4dd.jpg';
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';

const ROWS = 6;
const COLS = 7;

type CellValue = 'RED' | 'YELLOW' | null;
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface ConnectFourProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const ConnectFourGame: React.FC<ConnectFourProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  // Initialize with a valid grid to prevent render crashes
  const [board, setBoard] = useState<CellValue[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [turn, setTurn] = useState<'RED' | 'YELLOW'>('RED');
  const [winner, setWinner] = useState<'RED' | 'YELLOW' | 'DRAW' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [rewardGiven, setRewardGiven] = useState(false);
  
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

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
          initGame();
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  const initGame = () => {
      const newBoard = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
      setBoard(newBoard);
      setTurn('RED');
      setWinner(null);
      setWinningCells([]);
      setIsThinking(false);
      setRewardGiven(false);
  };

  // Re-initialize when difficulty changes
  useEffect(() => {
      if (difficulty) initGame();
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

  const checkWin = (currentBoard: CellValue[][]): { winner: 'RED' | 'YELLOW' | null, cells: [number, number][] } => {
      // Check directions: horizontal, vertical, diagonal right, diagonal left
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
      
      for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
              const player = currentBoard[r][c];
              if (!player) continue;

              for (const [dr, dc] of directions) {
                  let cells: [number, number][] = [[r, c]];
                  for (let i = 1; i < 4; i++) {
                      const nr = r + dr * i;
                      const nc = c + dc * i;
                      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && currentBoard[nr][nc] === player) {
                          cells.push([nr, nc]);
                      } else {
                          break;
                      }
                  }
                  if (cells.length === 4) {
                      return { winner: player, cells };
                  }
              }
          }
      }
      return { winner: null, cells: [] };
  };

  const checkDraw = (currentBoard: CellValue[][]) => {
      return currentBoard[0].every(cell => cell !== null);
  };

  const dropPiece = (col: number, player: 'RED' | 'YELLOW', currentBoard: CellValue[][]): { success: boolean, row: number } => {
      for (let r = ROWS - 1; r >= 0; r--) {
          if (!currentBoard[r][col]) {
              currentBoard[r][col] = player;
              return { success: true, row: r };
          }
      }
      return { success: false, row: -1 };
  };

  const handleColumnClick = (col: number) => {
      if (winner || isThinking || turn !== 'RED') return;

      const newBoard = board.map(row => [...row]);
      const { success } = dropPiece(col, 'RED', newBoard);

      if (success) {
          setBoard(newBoard);
          const winResult = checkWin(newBoard);
          if (winResult.winner) {
              setWinner(winResult.winner);
              setWinningCells(winResult.cells);
          } else if (checkDraw(newBoard)) {
              setWinner('DRAW');
          } else {
              setTurn('YELLOW');
          }
      }
  };

  const getValidMoves = (currentBoard: CellValue[][]) => {
      if (!currentBoard || currentBoard.length === 0) return [];
      const moves = [];
      for (let c = 0; c < COLS; c++) {
          if (!currentBoard[0][c]) moves.push(c);
      }
      return moves;
  };

  // Simple AI
  useEffect(() => {
      if (turn === 'YELLOW' && !winner && difficulty && board.length > 0) {
          setIsThinking(true);
          const timer = setTimeout(() => {
              const newBoard = board.map(row => [...row]);
              let colToPlay = -1;
              const validMoves = getValidMoves(newBoard);

              if (validMoves.length === 0) {
                  setWinner('DRAW');
                  setIsThinking(false);
                  return;
              }

              // 1. Try to win
              for (const col of validMoves) {
                  const testBoard = newBoard.map(r => [...r]);
                  dropPiece(col, 'YELLOW', testBoard);
                  if (checkWin(testBoard).winner === 'YELLOW') {
                      colToPlay = col;
                      break;
                  }
              }

              // 2. Block player win
              if (colToPlay === -1 && (difficulty === 'MEDIUM' || difficulty === 'HARD')) {
                  for (const col of validMoves) {
                      const testBoard = newBoard.map(r => [...r]);
                      dropPiece(col, 'RED', testBoard);
                      if (checkWin(testBoard).winner === 'RED') {
                          colToPlay = col;
                          break;
                      }
                  }
              }

              // 3. Random or center bias
              if (colToPlay === -1) {
                  if (difficulty === 'HARD' && validMoves.includes(3) && Math.random() > 0.3) {
                      colToPlay = 3;
                  } else {
                      colToPlay = validMoves[Math.floor(Math.random() * validMoves.length)];
                  }
              }

              dropPiece(colToPlay, 'YELLOW', newBoard);
              setBoard(newBoard);
              
              const winResult = checkWin(newBoard);
              if (winResult.winner) {
                  setWinner(winResult.winner);
                  setWinningCells(winResult.cells);
              } else if (checkDraw(newBoard)) {
                  setWinner('DRAW');
              } else {
                  setTurn('RED');
              }
              setIsThinking(false);
          }, 1000);
          return () => clearTimeout(timer);
      }
  }, [turn, winner, difficulty, board]);

  const resetGame = () => {
      initGame();
  };

  const backToMenu = () => {
      setDifficulty(null);
      // Reset board to clean state but keep dimensions valid to prevent crash on quick re-render
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  };

  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

  if (!difficulty) {
      return (
          <div className={wrapperStyle} style={{ backgroundImage: `url(${BG_IMG})` }}>
              <div className="absolute top-4 left-4 z-50">
                  <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                      <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-16 w-auto drop-shadow-md" />
                  </button>
              </div>
              <div className="absolute top-4 right-4 z-50 pointer-events-none">
                  <div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg">
                      <span>{userTokens}</span> <span className="text-xl">🪙</span>
                  </div>
              </div>
              {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
              <div className="w-full h-full flex flex-col items-center justify-center p-4 pt-16">
                  <img src={TITLE_IMG} alt="Forza 4" className="w-72 md:w-96 h-auto mb-6 relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-300" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
                  <div className="flex flex-col gap-4 items-center w-full relative z-10">
                      <button onClick={() => setDifficulty('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" /></button>
                      <button onClick={() => setDifficulty('MEDIUM')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto drop-shadow-md" /></button>
                      <div className="relative hover:scale-105 active:scale-95 transition-transform w-48">
                          <button onClick={() => isHardUnlocked ? setDifficulty('HARD') : setShowUnlockModal(true)} className={`w-full ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}><img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-md" /></button>
                          {!isHardUnlocked && (
                              <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                                  <img src={LOCK_IMG} alt="Bloccato" className="w-12 h-12 drop-shadow-lg rotate-12" />
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      );
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

        {/* GAME CONTENT */}
        <div className="w-full h-full flex flex-col items-center justify-center pt-0 pb-20 relative z-10">
            <img 
                src={TITLE_IMG} 
                alt="Forza 4" 
                className="h-20 md:h-28 w-auto mb-2 drop-shadow-md" 
                style={{
                   filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)'
                }}
            />
            <p className="text-white font-bold mb-4 bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm border border-white/20">
                {difficulty === 'EASY' ? 'Livello Facile' : (difficulty === 'MEDIUM' ? 'Livello Medio' : 'Livello Maestro')}
            </p>
            <div className="bg-blue-600 p-3 rounded-[30px] border-4 border-blue-800 shadow-2xl relative">
                {isThinking && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full font-bold flex items-center gap-2 border-2 border-black z-10 animate-bounce">
                        <Loader2 className="animate-spin" size={16} /> Sto pensando...
                    </div>
                )}
                <div className="grid grid-cols-7 gap-2 bg-blue-500 p-2 rounded-xl">
                    {Array.from({ length: COLS }).map((_, c) => (
                        <div key={c} className="flex flex-col gap-2" onClick={() => handleColumnClick(c)}>
                            {Array.from({ length: ROWS }).map((_, r) => {
                                const cell = board[r]?.[c];
                                const isWinning = winningCells.some(([wr, wc]) => wr === r && wc === c);
                                return (
                                    <div key={`${r}-${c}`} className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-4 ${isWinning ? 'border-white animate-pulse' : 'border-blue-700'} flex items-center justify-center bg-blue-800 shadow-inner overflow-hidden cursor-pointer`}>
                                        {cell === 'RED' && <div className="w-full h-full bg-red-500 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300"></div>}
                                        {cell === 'YELLOW' && <div className="w-full h-full bg-yellow-400 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                    <div className="bg-white p-8 rounded-[40px] text-center border-4 border-black max-w-sm w-full shadow-2xl relative flex flex-col items-center">
                        {winner === 'RED' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                        <div className="text-6xl md:text-7xl mb-4 animate-bounce">{winner === 'RED' ? '🏆' : (winner === 'YELLOW' ? '🤖' : '🤝')}</div>
                        <h2 className="text-3xl font-black text-purple-600 drop-shadow-sm">{winner === 'RED' ? 'HAI VINTO! 🎉' : (winner === 'YELLOW' ? 'Ha vinto il computer!' : 'Pareggio!')}</h2>
                        {winner === 'RED' && <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">+{tokenReward} GETTONI! 🪙</div>}
                        <div className="flex flex-row gap-4 justify-center items-center w-full mt-2">
                            <button onClick={resetGame} className="hover:scale-105 active:scale-95 transition-transform w-44"><img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" /></button>
                            <button onClick={backToMenu} className="hover:scale-105 active:scale-95 transition-transform w-44"><img src={BTN_BACK_MENU_IMG} alt="Menu" className="w-full h-auto drop-shadow-xl" /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ConnectFourGame;
