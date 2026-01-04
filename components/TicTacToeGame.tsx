import React, { useState, useEffect } from 'react';
import { Trophy, Loader2, Lock } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/game-tris.webp';
const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lvl-easy.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lvl-medium.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lvl-hard.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp'; 
const BG_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tribhggroudd.webp';

const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const WITCH_THINKING_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/witch-thinking.webp';
const PLAYER_AVATAR_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/girlthinkticerd.webp';
const VICTORY_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/triswingirl.webp';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface TicTacToeProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const TicTacToeGame: React.FC<TicTacToeProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [sessionScore, setSessionScore] = useState({ player: 0, cpu: 0 });
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  const handleUnlockHard = () => {
      if (unlockHardMode()) {
          setIsHardUnlocked(true);
          const p = getProgress();
          setUserTokens(p.tokens);
          setShowUnlockModal(false);
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

  const checkWinner = (squares: (string | null)[]) => {
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

  const updateScore = (gameWinner: string) => {
      if (gameWinner === 'O') {
          setSessionScore(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (gameWinner === 'X') {
          setSessionScore(prev => ({ ...prev, cpu: prev.cpu + 1 }));
      }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn || !difficulty || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'O'; 
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      updateScore(gameWinner);
    } else if (!newBoard.includes(null)) {
      setWinner('draw');
    } else {
      setIsPlayerTurn(false);
    }
  };

  const getBestMove = (currentBoard: (string | null)[], diff: Difficulty) => {
      const availableMoves = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
      
      if (diff === 'EASY') {
          if (Math.random() > 0.2) return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
      if (diff === 'MEDIUM') {
          if (Math.random() > 0.6) return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }

      const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (currentBoard[a] === 'X' && currentBoard[b] === 'X' && !currentBoard[c]) return c;
          if (currentBoard[a] === 'X' && currentBoard[c] === 'X' && !currentBoard[b]) return b;
          if (currentBoard[b] === 'X' && currentBoard[c] === 'X' && !currentBoard[a]) return a;
      }
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (currentBoard[a] === 'O' && currentBoard[b] === 'O' && !currentBoard[c]) return c;
          if (currentBoard[a] === 'O' && currentBoard[c] === 'O' && !currentBoard[b]) return b;
          if (currentBoard[b] === 'O' && currentBoard[c] === 'O' && !currentBoard[a]) return a;
      }
      if (!currentBoard[4]) return 4;
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner && difficulty) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        const moveIndex = getBestMove(board, difficulty);
        if (moveIndex !== undefined) {
          const newBoard = [...board];
          newBoard[moveIndex] = 'X'; 
          setBoard(newBoard);
          const gameWinner = checkWinner(newBoard);
          if (gameWinner) { setWinner(gameWinner); updateScore(gameWinner); }
          else if (!newBoard.includes(null)) setWinner('draw');
          setIsPlayerTurn(true);
        }
        setIsThinking(false);
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board, difficulty]);

  useEffect(() => {
    if (winner === 'O' && !rewardGiven && onEarnTokens) {
      const amount = 5;
      onEarnTokens(amount);
      setRewardGiven(true);
      setUserTokens(prev => prev + amount);
    }
  }, [winner, rewardGiven, onEarnTokens]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setIsThinking(false);
    setRewardGiven(false);
  };

  const backToMenu = () => {
      setDifficulty(null);
      resetGame();
  };

  const renderTitle = () => {
    const levelLabel = difficulty === 'EASY' ? 'LIVELLO FACILE' : (difficulty === 'MEDIUM' ? 'LIVELLO MEDIO' : 'SFIDA DIFFICILE');

    return (
        <div className="absolute top-[80px] md:top-[120px] left-0 right-0 flex flex-col items-center z-50 pointer-events-none px-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <img 
                src={TITLE_IMG} 
                alt="Tris Spettrale" 
                className="h-14 md:h-28 w-auto object-contain drop-shadow-xl mb-0 translate-x-6 md:translate-x-12" 
            />
            <div className={`bg-white/20 backdrop-blur-md px-4 py-1 rounded-[20px] border-2 border-white/40 shadow-xl mt-3 ${difficulty ? 'rounded-full' : 'rounded-[20px]'}`}>
                <h1 
                    className={`font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[2px_2px_0_black] ${difficulty ? 'text-xs md:text-xl whitespace-nowrap' : 'text-lg md:text-4xl'}`}
                    style={{ WebkitTextStroke: '1.2px black', lineHeight: '1.1' }}
                >
                    {difficulty ? levelLabel : "GIOCA CONTRO LA STREGA"}
                </h1>
            </div>
        </div>
    );
  };

  const fullScreenWrapper = "fixed inset-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={fullScreenWrapper}>
      <img src={BG_IMG} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" />

      {/* TASTI NAVIGAZIONE IN ALTO A SINISTRA E SALDO GETTONI IN ALTO A DESTRA */}
      <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
          <div className="flex flex-col items-start gap-2 pointer-events-auto">
              <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none">
                  <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" />
              </button>
              {difficulty && (
                <button onClick={backToMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                    <img src={BTN_BACK_MENU_IMG} alt="Torna al Menu" className="h-16 md:h-22 w-auto drop-shadow-md" />
                </button>
              )}
          </div>

          <div className="pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                  <span>{userTokens}</span> <span className="text-xl">🪙</span>
              </div>
          </div>
      </div>

      {renderTitle()}

      {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-64 md:pt-80 pb-4">
        {difficulty === null ? (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                <div className="bg-white/20 backdrop-blur-[20px] p-6 md:p-8 rounded-[40px] border-4 border-white/40 shadow-2xl flex flex-col gap-4 items-center w-full max-w-[220px] md:max-w-[280px] mt-24 md:mt-32">
                    <button onClick={() => setDifficulty('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-full">
                      <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" />
                    </button>
                    <button onClick={() => setDifficulty('MEDIUM')} className="hover:scale-105 active:scale-95 transition-transform w-full">
                      <img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto drop-shadow-md" />
                    </button>
                    <div className="relative hover:scale-105 active:scale-95 transition-transform w-full">
                        <button onClick={() => isHardUnlocked ? setDifficulty('HARD') : setShowUnlockModal(true)} className={`w-full ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}>
                          <img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-md" />
                        </button>
                        {!isHardUnlocked && (
                            <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                                <img src={LOCK_IMG} alt="Bloccato" className="w-12 h-12 drop-shadow-lg rotate-12" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
          <>
            <div className="flex justify-between items-center w-full max-w-sm px-6 mb-6">
                <div className={`flex flex-col items-center transition-all relative bg-black/20 backdrop-blur-sm p-3 rounded-[25px] ${!isPlayerTurn && !winner ? 'scale-110' : 'opacity-80 scale-90'}`}>
                    <div className={`relative ${!isPlayerTurn && !winner ? 'drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]' : ''}`}>
                        <img src={WITCH_THINKING_IMG} alt="Strega" className="w-20 h-20 md:w-28 md:h-28 object-contain" />
                        {isThinking && !winner && (
                            <div className="absolute top-1/2 left-[-30px] md:left-[-70px] -translate-y-1/2 z-50 flex flex-col items-center animate-in fade-in zoom-in duration-500 pointer-events-none transform -rotate-3">
                                <span className="font-luckiest text-lg md:text-xl text-yellow-300 uppercase whitespace-nowrap mb-[-25px] relative z-10 translate-x-8" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', WebkitTextStroke: '1px black' }}>mmmh sto pensando...</span>
                                <img src={WITCH_THINKING_IMG} alt="Strega" className="w-52 h-52 md:w-64 md:h-64 object-contain" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md z-40">{sessionScore.cpu}</div>
                    </div>
                </div>
                <div className="text-center"><span className="text-4xl font-black text-white drop-shadow-[0_4px_0_black] italic">VS</span></div>
                <div className={`flex flex-col items-center transition-all bg-black/20 backdrop-blur-sm p-3 rounded-[25px] ${isPlayerTurn && !winner ? 'scale-110' : 'opacity-80 scale-90'}`}>
                    <div className={`relative ${isPlayerTurn && !winner ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]' : ''}`}>
                        <img src={PLAYER_AVATAR_IMG} alt="Tu" className="w-20 h-20 md:w-28 md:h-28 object-contain" />
                        <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md">{sessionScore.player}</div>
                    </div>
                </div>
            </div>
            <div className="w-80 h-80 md:w-[440px] md:h-[440px] mx-auto bg-black/20 backdrop-blur-sm p-3 rounded-[30px] shadow-2xl border-4 border-white/30 relative">
                <div className="grid grid-cols-3 gap-3 w-full h-full">
                {board.map((cell, idx) => (
                    <div key={idx} className="relative w-full h-full">
                        <button type="button" onClick={() => handleClick(idx)} disabled={!!cell || !!winner || !isPlayerTurn || isThinking} className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-2xl shadow-inner border-2 border-white/20 transition-all duration-200 active:scale-95 ${cell ? 'bg-white/10 cursor-default' : 'bg-white/40 hover:bg-white/60 cursor-pointer'}`} style={{ touchAction: 'manipulation' }}>
                            <div className="w-full h-full flex items-center justify-center">
                                {cell === 'X' && <span className="text-7xl md:text-8xl font-luckiest text-red-600 animate-in zoom-in duration-300 drop-shadow-[3px_3px_0_black]" style={{ WebkitTextStroke: '2px black' }}>X</span>}
                                {cell === 'O' && <span className="text-7xl md:text-8xl font-luckiest text-blue-500 animate-in zoom-in duration-300 drop-shadow-[3px_3px_0_black]" style={{ WebkitTextStroke: '2px black' }}>O</span>}
                            </div>
                        </button>
                    </div>
                ))}
                </div>
            </div>
          </>
        )}
      </div>

      {/* MODALE DI FINE PARTITA */}
      {winner && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-blue-600/90 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
            <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 text-center shadow-2xl flex flex-col items-center max-sm w-full mx-auto relative overflow-hidden">
                {winner === 'O' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                
                {winner === 'O' ? (
                    <>
                        <img src={VICTORY_HEADER_IMG} alt="Vittoria" className="w-48 h-auto mb-4 drop-shadow-xl" />
                        <div className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-2xl border-2 border-black mb-8 shadow-lg">+5 🪙</div>
                    </>
                ) : winner === 'X' ? (
                    <>
                        <img src={WITCH_THINKING_IMG} alt="La Strega Vince" className="w-48 h-auto mb-4 drop-shadow-xl" />
                        <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-2 uppercase text-center leading-none">HA VINTO LA STREGA!</h2>
                        <p className="text-gray-600 font-bold mb-8 text-center">Riprova, non farti battere!</p>
                    </>
                ) : (
                    <>
                        <div className="text-8xl mb-4">🤝</div>
                        <h2 className="text-3xl md:text-4xl font-black text-blue-600 mb-2 uppercase text-center leading-none">PAREGGIO!</h2>
                        <p className="text-gray-600 font-bold mb-8 text-center">Siete stati bravissimi entrambi!</p>
                    </>
                )}
                
                <div className="flex flex-row gap-4 w-full justify-center">
                    <button 
                        onClick={resetGame} 
                        className="hover:scale-105 active:scale-95 transition-all outline-none flex-1 max-w-[160px]"
                    >
                        <img src={BTN_PLAY_AGAIN_IMG} alt="Rigioca" className="w-full h-auto drop-shadow-lg" />
                    </button>
                    <button 
                        onClick={backToMenu} 
                        className="hover:scale-105 active:scale-95 transition-all outline-none flex-1 max-w-[160px]"
                    >
                        <img src={BTN_BACK_MENU_IMG} alt="Livelli" className="w-full h-auto drop-shadow-lg" />
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToeGame;