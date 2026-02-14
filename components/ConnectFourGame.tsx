
import { getProgress, unlockHardMode } from '../services/tokens';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';
import { isNightTime } from '../services/weatherService';

const NEW_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/connect4.webp';
const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/facilelogodsnaq.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediologjeidnuj4hedn.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/difficielrnfjn4edj.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp'; 
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/forza4daysuna.webp';
const BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/forza4nighteere.webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const ZUCCOTTO_THINKING_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccotto-thinking.webp';
const ZUCCOTTO_WIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccotto-wins.webp';
const PLAYER_WIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/victory-hug.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

// Musica di sottofondo
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/backgroundmusicforvideos-cartoon-funny-music-452420.mp3';

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
  const [now, setNow] = useState(new Date());
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
  const [musicEnabled, setMusicEnabled] = useState(true);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Background dinamico basato sull'orario richiesto (20:15 - 06:45)
  const currentBg = useMemo(() => isNightTime(now) ? BG_NIGHT : BG_DAY, [now]);

  useEffect(() => {
      const timeTimer = setInterval(() => setNow(new Date()), 60000);
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);

      // Inizializza Audio
      bgMusicRef.current = new Audio(BG_MUSIC_URL);
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.4;

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
          setShowUnlockModal(false);
          setDifficulty('HARD');
          const p = getProgress();
          setUserTokens(p.tokens);
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
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
      setTurn('RED');
      setWinner(null);
      setWinningCells([]);
      setIsThinking(false);
      setRewardGiven(false);
      const p = getProgress();
      setUserTokens(p.tokens);
  };

  useEffect(() => {
      if (difficulty) initGame();
  }, [difficulty]);

  useEffect(() => {
      if (winner === 'RED' && !rewardGiven && onEarnTokens) {
          let reward = difficulty === 'HARD' ? 15 : (difficulty === 'MEDIUM' ? 10 : 5);
          onEarnTokens(reward);
          setRewardGiven(true);
          setUserTokens(prev => prev + reward);
      }
  }, [winner, rewardGiven, onEarnTokens, difficulty]);

  const checkWin = (currentBoard: CellValue[][]): { winner: 'RED' | 'YELLOW' | null, cells: [number, number][] } => {
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
              const player = currentBoard[r][c];
              if (!player) continue;
              for (const [dr, dc] of directions) {
                  let cells: [number, number][] = [[r, c]];
                  for (let i = 1; i < 4; i++) {
                      const nr = r + dr * i; const nc = c + dc * i;
                      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && currentBoard[nr][nc] === player) cells.push([nr, nc]);
                      else break;
                  }
                  if (cells.length === 4) return { winner: player, cells };
              }
          }
      }
      return { winner: null, cells: [] };
  };

  const checkDraw = (currentBoard: CellValue[][]) => currentBoard[0].every(cell => cell !== null);

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
          if (winResult.winner) { setWinner(winResult.winner); setWinningCells(winResult.cells); }
          else if (checkDraw(newBoard)) setWinner('DRAW');
          else setTurn('YELLOW');
      }
  };

  useEffect(() => {
      if (turn === 'YELLOW' && !winner && difficulty) {
          setIsThinking(true);
          const timer = setTimeout(() => {
              const newBoard = board.map(row => [...row]);
              const validMoves = [];
              for (let c = 0; c < COLS; c++) if (!newBoard[0][c]) validMoves.push(c);

              if (validMoves.length === 0) { setWinner('DRAW'); setIsThinking(false); return; }

              let colToPlay = -1;
              for (const col of validMoves) {
                  const testBoard = newBoard.map(r => [...r]);
                  dropPiece(col, 'YELLOW', testBoard);
                  if (checkWin(testBoard).winner === 'YELLOW') { colToPlay = col; break; }
              }
              if (colToPlay === -1 && (difficulty !== 'EASY')) {
                  for (const col of validMoves) {
                      const testBoard = newBoard.map(r => [...r]);
                      dropPiece(col, 'RED', testBoard);
                      if (checkWin(testBoard).winner === 'RED') { colToPlay = col; break; }
                  }
              }
              if (colToPlay === -1) colToPlay = validMoves[Math.floor(Math.random() * validMoves.length)];

              dropPiece(colToPlay, 'YELLOW', newBoard);
              setBoard(newBoard);
              const winResult = checkWin(newBoard);
              if (winResult.winner) { setWinner(winResult.winner); setWinningCells(winResult.cells); }
              else if (checkDraw(newBoard)) setWinner('DRAW');
              else setTurn('RED');
              setIsThinking(false);
          }, 3000);
          return () => clearTimeout(timer);
      }
  }, [turn, winner, difficulty, board]);

  const resetGame = () => initGame();
  const backToMenu = () => {
      setDifficulty(null);
      setWinner(null);
      setWinningCells([]);
  };

  const fullScreenWrapper = "fixed inset-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={fullScreenWrapper}>
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

        <img src={currentBg} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" />

        {/* TASTI NAVIGAZIONE IN ALTO A SINISTRA E SALDO GETTONI IN ALTO A DESTRA */}
        <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
            <div className="flex flex-col items-start gap-2 pointer-events-auto">
                <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none">
                    <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" />
                </button>
                {difficulty && (
                    <button onClick={backToMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                        <img src={BTN_BACK_MENU_IMG} alt="Torna ai Livelli" className="h-16 md:h-22 w-auto drop-shadow-md" />
                    </button>
                )}
            </div>

            <div className="pointer-events-auto flex flex-col items-end gap-3">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                    <span>{userTokens}</span> <span className="text-xl">🪙</span>
                </div>
                
                {/* Tasto Audio sotto i gettoni */}
                <button 
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
                    title={musicEnabled ? "Spegni Musica" : "Accendi Musica"}
                >
                    <img src={AUDIO_ICON_IMG} alt="Audio" className="w-16 h-16 md:w-24 h-auto drop-shadow-xl" />
                </button>
            </div>
        </div>

        {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}

        {!difficulty ? (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-4 pt-36 md:pt-48">
                {/* ISTRUZIONE SU DUE RIGHE IN UN BOX TRASLUCIDO - INGRANDITA */}
                <div className="bg-white/20 backdrop-blur-md px-8 py-5 rounded-[40px] border-4 border-white/40 shadow-2xl mb-10 animate-in slide-in-from-top-4 duration-500 max-w-[95%] md:max-w-xl">
                    <h2 
                        className="font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[3px_3px_0_black] text-xl sm:text-4xl md:text-[46px] leading-tight" 
                        style={{ WebkitTextStroke: '1.5px black' }}
                    >
                        Sfida <span className="text-yellow-300">Zuccotto</span><br />
                        e metti <span className="text-red-400">4 gettoni</span> in fila!
                    </h2>
                </div>

                <div className="flex flex-col gap-4 items-center w-full max-w-[220px] md:max-w-[280px]">
                    <button onClick={() => setDifficulty('EASY')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent">
                        <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto" />
                    </button>
                    <button onClick={() => setDifficulty('MEDIUM')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent" style={{ animationDelay: '0.5s' }}>
                        <img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto" />
                    </button>
                    <div className="relative sticker-btn animate-float-btn w-full" style={{ animationDelay: '1s' }}>
                        <button onClick={() => isHardUnlocked ? setDifficulty('HARD') : setShowUnlockModal(true)} className={`w-full outline-none border-none bg-transparent ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}>
                            <img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto" />
                        </button>
                        {!isHardUnlocked && (
                            <div className="absolute right-[-8px] top-[-8px] pointer-events-none z-20">
                                <img src={LOCK_IMG} alt="Bloccato" className="w-10 h-10 drop-shadow-lg rotate-12" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2 pt-32">
              {/* Tabellone */}
              <div className="bg-blue-600 p-2 md:p-4 rounded-[30px] border-4 md:border-8 border-blue-800 shadow-2xl relative">
                  {isThinking && (
                      <div className="absolute z-[100] animate-in zoom-in slide-in-from-bottom-10 duration-500 pointer-events-none" style={{ top: '-120px', left: '50%', transform: 'translateX(-50%)' }}>
                          <img src={ZUCCOTTO_THINKING_IMG} alt="Zuccotto pensa" className="h-auto drop-shadow-2xl" style={{ width: '162px' }} />
                      </div>
                  )}
                  <div className="grid grid-cols-7 gap-1 md:gap-3 bg-blue-500 p-2 rounded-xl">
                      {Array.from({ length: COLS }).map((_, c) => (
                          <div key={c} className="flex flex-col gap-1 md:gap-3" onClick={() => handleColumnClick(c)}>
                              {Array.from({ length: ROWS }).map((_, r) => {
                                  const cell = board[r]?.[c];
                                  const isWinning = winningCells.some(([wr, wc]) => wr === r && wc === c);
                                  return (
                                      <div key={`${r}-${c}`} className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 md:border-4 ${isWinning ? 'border-white animate-pulse' : 'border-blue-700'} flex items-center justify-center bg-blue-800 shadow-inner overflow-hidden cursor-pointer`}>
                                          {cell === 'RED' && <div className="w-full h-full bg-red-500 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300"></div>}
                                          {cell === 'YELLOW' && <div className="w-full h-full bg-yellow-400 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300"></div>}
                                      </div>
                                  );
                              })}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        )}

        {winner && (
            <div className="fixed inset-0 z-[110] flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-48 animate-in zoom-in duration-300">
                <div className="bg-white p-6 md:p-8 rounded-[40px] text-center border-4 border-black max-sm w-full shadow-2xl relative flex flex-col items-center transform translate-y-4">
                    {winner === 'RED' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                    <div className={`mb-4 flex items-center justify-center ${winner === 'DRAW' ? 'animate-bounce text-6xl md:text-7xl' : ''}`}>
                        {winner === 'RED' ? <img src={PLAYER_WIN_IMG} alt="Hai Vinto" className="w-44 h-44 md:w-64 md:h-64 object-contain" /> : (winner === 'YELLOW' ? <img src={ZUCCOTTO_WIN_IMG} alt="Zuccotto Vince" className="w-44 h-44 md:w-64 md:h-64 object-contain" /> : '🤝')}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-purple-600 drop-shadow-sm uppercase">{winner === 'RED' ? 'HAI VINTO!' : (winner === 'YELLOW' ? 'HA VINTO ZUCCOTTO!' : 'PAREGGIO!')}</h2>
                    <div className="flex flex-row gap-4 justify-center items-center w-full mt-2">
                        <button onClick={resetGame} className="hover:scale-105 active:scale-95 transition-transform w-44"><img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" /></button>
                        <button onClick={backToMenu} className="hover:scale-105 active:scale-95 transition-transform w-44"><img src={BTN_BACK_MENU_IMG} alt="Menu" className="w-full h-auto drop-shadow-xl" /></button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ConnectFourGame;
