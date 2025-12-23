
import React, { useState, useEffect } from 'react';
import { Trophy, Loader2, Lock } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const TITLE_IMG = 'https://i.postimg.cc/FK5XdRhP/grisefd-(1).png';
const BTN_EASY_IMG = 'https://i.postimg.cc/MpVqCtbx/facile.png';
const BTN_MEDIUM_IMG = 'https://i.postimg.cc/3x5HFmMp/intermedio.png';
const BTN_HARD_IMG = 'https://i.postimg.cc/tRsTr3f4/difficile.png';
const LOCK_IMG = 'https://i.postimg.cc/3Nz0wMj1/lucchetto.png'; // New Lock Image
const BG_IMG = 'https://i.postimg.cc/gjWwS6qL/sfondotris.jpg';

const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';
const WITCH_THINKING_IMG = 'https://i.postimg.cc/g2ykszNq/strega-pensante-(1)-(1).png';

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

  const updateScore = (gameWinner: string) => {
      if (gameWinner === 'X') {
          setSessionScore(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (gameWinner === 'O') {
          setSessionScore(prev => ({ ...prev, cpu: prev.cpu + 1 }));
      }
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn || !difficulty || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'X'; 
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

  const getBestMove = (currentBoard: string[], diff: Difficulty) => {
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
          if (currentBoard[a] === 'O' && currentBoard[b] === 'O' && !currentBoard[c]) return c;
          if (currentBoard[a] === 'O' && currentBoard[c] === 'O' && !currentBoard[b]) return b;
          if (currentBoard[b] === 'O' && currentBoard[c] === 'O' && !currentBoard[a]) return a;
      }
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (currentBoard[a] === 'X' && currentBoard[b] === 'X' && !currentBoard[c]) return c;
          if (currentBoard[a] === 'X' && currentBoard[c] === 'X' && !currentBoard[b]) return b;
          if (currentBoard[b] === 'X' && currentBoard[c] === 'X' && !currentBoard[a]) return a;
      }
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
      if (winner === 'X' && !rewardGiven && onEarnTokens) {
          let reward = 2; 
          if (difficulty === 'MEDIUM') reward = 5;
          if (difficulty === 'HARD') reward = 10;
          onEarnTokens(reward);
          setUserTokens(prev => prev + reward);
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

  const backToMenu = () => {
      setDifficulty(null);
      resetGame();
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
                  <img src={TITLE_IMG} alt="Tris Spettrale" className="w-72 md:w-96 h-auto mb-6 relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-300" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
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

  const tokenReward = difficulty === 'EASY' ? 2 : difficulty === 'MEDIUM' ? 5 : 10;

  return (
    <div className={wrapperStyle} style={{ backgroundImage: `url(${BG_IMG})` }}>
      <div className="absolute top-4 left-4 z-50">
          <button onClick={backToMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
              <img src={BTN_BACK_MENU_IMG} alt="Torna al Menu" className="h-12 w-auto drop-shadow-md" />
          </button>
      </div>
      {!winner && <div className="absolute top-4 right-4 z-50 pointer-events-none"><div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg"><span>{userTokens}</span> <span className="text-xl">🪙</span></div></div>}
      
      <div className="w-full h-full flex flex-col items-center justify-start pt-16 md:pt-20 pb-4 relative z-10">
        <img src={TITLE_IMG} alt="Tris Spettrale" className="h-24 md:h-36 w-auto mb-4 drop-shadow-lg animate-in slide-in-from-top-4" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
        <div className="flex justify-between items-center w-full max-w-sm px-6 mb-6">
            <div className={`flex flex-col items-center transition-all ${isPlayerTurn && !winner ? 'scale-110' : 'opacity-80 scale-90'}`}>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-purple-100 shadow-lg relative ${isPlayerTurn && !winner ? 'border-purple-500 ring-4 ring-purple-300' : 'border-gray-300'}`}><span className="text-4xl">👻</span><div className="absolute -bottom-2 -right-2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md">{sessionScore.player}</div></div>
                <span className="mt-2 font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/40 px-2 rounded-lg text-sm uppercase">TU</span>
            </div>

            <div className="text-center">
                <span className="text-4xl font-black text-white drop-shadow-[0_4px_0_black] italic">VS</span>
            </div>

            <div className={`flex flex-col items-center transition-all relative ${!isPlayerTurn && !winner ? 'scale-110' : 'opacity-80 scale-90'}`}>
                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-green-100 shadow-lg relative ${!isPlayerTurn && !winner ? 'border-green-500 ring-4 ring-green-300' : 'border-gray-300'}`}>
                    <span className="text-4xl">🧙‍♀️</span>
                    {isThinking && !winner && (
                        <div className="absolute top-1/2 left-[-180%] -translate-y-1/2 z-50 flex flex-col items-center animate-in fade-in zoom-in duration-500 pointer-events-none transform -rotate-6">
                            <span 
                                className="font-luckiest text-lg md:text-xl text-yellow-300 uppercase whitespace-nowrap mb-[-25px] relative z-10 -translate-x-3"
                                style={{ 
                                    textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                    WebkitTextStroke: '1px black'
                                }}
                            >
                                mmmh sto pensando...
                            </span>
                            <img 
                                src={WITCH_THINKING_IMG} 
                                alt="Strega che pensa" 
                                className="w-52 h-52 md:w-64 md:h-64 max-w-none object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
                            />
                        </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md z-40">{sessionScore.cpu}</div>
                </div>
                <span className="mt-2 font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] bg-black/40 px-2 rounded-lg text-sm uppercase">STREGA</span>
            </div>
        </div>

        <div className="w-72 h-72 md:w-80 md:h-80 mx-auto bg-black/20 backdrop-blur-sm p-3 rounded-[30px] shadow-2xl border-4 border-white/30 relative">
            <div className="grid grid-cols-3 gap-3 w-full h-full">
            {board.map((cell, idx) => (
                <div key={idx} className="relative w-full h-full">
                    <button type="button" onClick={() => handleClick(idx)} disabled={!!cell || !!winner || !isPlayerTurn || isThinking} className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-2xl shadow-inner border-2 border-white/20 transition-all duration-200 active:scale-95 ${cell ? 'bg-white/90 cursor-default' : 'bg-white/40 hover:bg-white/60 cursor-pointer'}`} style={{ touchAction: 'manipulation' }}>
                        <div className="w-full h-full flex items-center justify-center">
                            {cell === 'X' && <span className="text-5xl md:text-6xl animate-in zoom-in duration-300 drop-shadow-md leading-none select-none filter drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">👻</span>}
                            {cell === 'O' && <span className="text-5xl md:text-6xl animate-in zoom-in duration-300 drop-shadow-md leading-none select-none filter drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]">🧙‍♀️</span>}
                        </div>
                    </button>
                </div>
            ))}
            </div>
        </div>

        {!winner && <div className="mt-6 flex flex-col items-center animate-in slide-in-from-bottom-4"><div className="bg-yellow-400 text-black px-6 py-2 rounded-2xl border-4 border-black shadow-[4px_4px_0_black] flex items-center gap-2 transform -rotate-2"><Trophy size={20} /><span className="font-black text-sm md:text-base uppercase">Premio Vittoria: {tokenReward} Gettoni</span></div></div>}

        {winner && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                <div className="bg-white p-6 md:p-8 rounded-[40px] border-4 border-black shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-xs md:max-w-sm text-center relative flex flex-col items-center">
                    {winner === 'X' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                    <div className="text-6xl md:text-7xl mb-4 animate-bounce">{winner === 'X' ? '🏆' : (winner === 'O' ? '🧙‍♀️' : '🤝')}</div>
                    <h2 className="text-3xl md:text-4xl font-black text-black mb-2 drop-shadow-sm uppercase">{winner === 'X' ? 'HAI VINTO!' : (winner === 'O' ? 'LA STREGA VINCE!' : 'PAREGGIO!')}</h2>
                    {winner === 'X' && <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">+{tokenReward} GETTONI! 🪙</div>}
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

export default TicTacToeGame;
