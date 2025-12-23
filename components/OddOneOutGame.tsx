
import React, { useState, useEffect } from 'react';
import { RotateCcw, Timer, Trophy, Play, Settings, Lock, Brain, Zap, ArrowLeft } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];
const TITLE_IMG = 'https://i.postimg.cc/MZcdc8G6/intru-(1).png';
const BTN_EASY_IMG = 'https://i.postimg.cc/MpVqCtbx/facile.png';
const BTN_MEDIUM_IMG = 'https://i.postimg.cc/3x5HFmMp/intermedio.png';
const BTN_HARD_IMG = 'https://i.postimg.cc/tRsTr3f4/difficile.png';
const LOCK_IMG = 'https://i.postimg.cc/3Nz0wMj1/lucchetto.png'; // New Lock Image
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';
const BTN_RETRY_IMG = 'https://i.postimg.cc/Y0S1fsNj/tasto-riprova-(1).png';
const BTN_EXIT_GAME_IMG = 'https://i.postimg.cc/X7mwdxpc/tasto-esci-(1).png';
const BG_IMG = 'https://i.postimg.cc/DZxTQwLB/sfondotrovalintrusodef.jpg';
const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface OddOneOutProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const OddOneOutGame: React.FC<OddOneOutProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gridSize, setGridSize] = useState(2); 
  const [items, setItems] = useState<string[]>([]);
  const [oddIndex, setOddIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'>('MENU');
  const [rewardGiven, setRewardGiven] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  useEffect(() => { if (showUnlockModal) { const p = getProgress(); setUserTokens(p.tokens); } }, [showUnlockModal]);

  const handleUnlockHard = () => { if (unlockHardMode()) { setIsHardUnlocked(true); const p = getProgress(); setUserTokens(p.tokens); setShowUnlockModal(false); startGame('HARD', true); } };
  const handleOpenNewsstand = () => { if (onOpenNewsstand) { onOpenNewsstand(); setShowUnlockModal(false); } };
  const getInitialTime = (diff: Difficulty) => { switch (diff) { case 'EASY': return 60; case 'MEDIUM': return 45; case 'HARD': return 30; default: return 60; } };

  const generateLevel = (currentLevel: number) => {
    const size = Math.min(6, 2 + Math.floor((currentLevel - 1) / 5)); 
    setGridSize(size);
    const mainEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let oddEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    while (oddEmoji === mainEmoji) { oddEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]; }
    const totalCells = size * size;
    const newOddIndex = Math.floor(Math.random() * totalCells);
    setOddIndex(newOddIndex);
    const newItems = Array(totalCells).fill(mainEmoji);
    newItems[newOddIndex] = oddEmoji;
    setItems(newItems);
  };

  const startGame = (diff: Difficulty, forceStart = false) => {
      if (diff === 'HARD' && !isHardUnlocked && !forceStart) { setShowUnlockModal(true); return; }
      setDifficulty(diff); setLevel(1); setRewardGiven(false); setEarnedTokens(0); setGameState('PLAYING'); setTimeLeft(getInitialTime(diff));
  };

  useEffect(() => { if (gameState === 'PLAYING') { generateLevel(level); } }, [gameState]);

  useEffect(() => {
    let timer: any;
    if (gameState === 'PLAYING' && timeLeft > 0) { timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000); } else if (timeLeft === 0 && gameState === 'PLAYING') { setGameState('GAME_OVER'); }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
      const isWin = gameState === 'VICTORY';
      const isGameOver = gameState === 'GAME_OVER';
      if ((isWin || (isGameOver && level >= 20)) && !rewardGiven && onEarnTokens && difficulty) {
          let reward = 0;
          if (difficulty === 'EASY') reward = 5; else if (difficulty === 'MEDIUM') reward = 10; else if (difficulty === 'HARD') reward = 15;
          if (reward > 0) { onEarnTokens(reward); setEarnedTokens(reward); setRewardGiven(true); setUserTokens(prev => prev + reward); }
      }
  }, [gameState, rewardGiven, onEarnTokens, difficulty, level]);

  const handleClick = (index: number) => {
    if (gameState !== 'PLAYING') return;
    if (index === oddIndex) {
      const nextLevel = level + 1;
      if (nextLevel > 30) { setGameState('VICTORY'); } else { setLevel(nextLevel); generateLevel(nextLevel); }
    } else { setTimeLeft(prev => Math.max(0, prev - 3)); }
  };

  const returnToMenu = () => { setGameState('MENU'); setDifficulty(null); };

  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-y-auto bg-cover bg-center z-[60]";

  if (gameState === 'MENU') {
      return (
          <div className={wrapperStyle} style={{ backgroundImage: `url(${BG_IMG})` }}>
               <div className="absolute top-4 left-4 z-50"><button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"><img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" /></button></div>
               <div className="absolute top-4 right-4 z-50 pointer-events-none"><div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg"><span>{userTokens}</span> <span className="text-xl">🪙</span></div></div>
               {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
               <div className="w-full h-full flex flex-col items-center justify-center p-4 pt-16">
                   <img src={TITLE_IMG} alt="Trova l'Intruso" className="w-72 md:w-96 h-auto mb-6 relative z-10 hover:scale-105 transition-transform duration-300" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
                   <div className="flex flex-col gap-4 items-center w-full relative z-10">
                       <p className="text-gray-800 font-black mb-2 text-sm drop-shadow-sm bg-white/80 px-4 py-1 rounded-full border-2 border-white shadow-md">Regola: Arriva al <span className="text-red-600 font-black">Livello 20</span> per vincere i gettoni! 🪙</p>
                       <button onClick={() => startGame('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" /></button>
                       <button onClick={() => startGame('MEDIUM')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_MEDIUM_IMG} alt="Medio" className="w-full h-auto drop-shadow-md" /></button>
                       <div className="relative hover:scale-105 active:scale-95 transition-transform w-48">
                           <button onClick={() => startGame('HARD')} className={`w-full ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}><img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-md" /></button>
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

  return (
    <div className={wrapperStyle} style={{ backgroundImage: `url(${BG_IMG})` }}>
        <div className="absolute top-4 right-4 z-50 pointer-events-none"><div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg"><span>{userTokens}</span> <span className="text-xl">🪙</span></div></div>
        <div className="w-full flex justify-between items-center mb-2 px-4 pt-4 z-10 relative">
            <button onClick={returnToMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"><img src={BTN_BACK_MENU_IMG} alt="Menu" className="h-12 w-auto drop-shadow-md" /></button>
            <img src={TITLE_IMG} alt="Trova l'Intruso" className="h-12 md:h-16 w-auto drop-shadow-md hidden sm:block" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 2px #000000)' }} />
            <div className="w-9 hidden sm:block"></div> 
        </div>
        <div className="flex-1 w-full flex flex-col items-center justify-center p-2 min-h-0 relative z-10">
            {gameState === 'PLAYING' && (
               <div className="w-full h-full max-w-4xl flex flex-col items-center justify-center">
                   <div className="flex justify-between w-full mb-6 px-4 max-w-md">
                        <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl border-2 border-blue-400 shadow-lg"><span className="font-black text-sm uppercase tracking-wider">LIV</span><span className="font-black text-2xl">{level}/30</span></div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-lg transition-colors ${timeLeft <= 5 ? 'bg-red-600 border-red-400 animate-pulse' : 'bg-gray-800 border-gray-600'}`}><Timer size={24} className="text-white" /><span className="font-black text-2xl text-white">{timeLeft}s</span></div>
                   </div>
                   <div className="flex-1 w-full flex items-center justify-center min-h-0">
                       <div className="grid gap-2 md:gap-3 p-3 bg-white/40 rounded-[30px] border-4 border-white/50 shadow-2xl aspect-square w-full max-h-[60vh] max-w-[60vh] backdrop-blur-md" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                           {items.map((item, idx) => (
                               <button key={idx} onMouseDown={() => handleClick(idx)} onTouchStart={(e) => { e.preventDefault(); handleClick(idx); }} className="w-full h-full flex items-center justify-center bg-white rounded-xl md:rounded-2xl hover:bg-blue-50 border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 active:bg-blue-100 transition-all shadow-md overflow-hidden" style={{ touchAction: 'manipulation' }}>
                                   <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl select-none drop-shadow-sm pointer-events-none transform transition-transform active:scale-95">{item}</span>
                               </button>
                           ))}
                       </div>
                   </div>
               </div>
            )}
            {gameState === 'GAME_OVER' && (
               <div className="bg-white p-8 rounded-[40px] border-8 border-red-500 shadow-2xl text-center max-w-md w-full animate-in zoom-in relative">
                   {onOpenNewsstand && earnedTokens > 0 && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                   <div className="text-6xl mb-4 animate-bounce">⏰</div>
                   <h3 className="text-3xl font-black text-red-600 mb-2">TEMPO SCADUTO!</h3>
                   <p className="text-gray-600 font-bold mb-6 text-lg">Sei arrivato al livello {level}.</p>
                   {earnedTokens > 0 ? <div className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xl border-4 border-black mb-6 animate-pulse inline-block whitespace-nowrap shadow-lg transform rotate-[-2deg]">+{earnedTokens} GETTONI! 🪙</div> : <p className="text-sm font-bold text-gray-500 mb-6 bg-gray-100 p-3 rounded-xl">Raggiungi il livello 20 per vincere!</p>}
                   <div className="flex flex-row gap-4 justify-center items-center mt-4"><button onClick={() => startGame(difficulty!)} className="hover:scale-105 active:scale-95 transition-transform w-36"><img src={BTN_RETRY_IMG} alt="Riprova" className="w-full h-auto drop-shadow-xl" /></button><button onClick={returnToMenu} className="hover:scale-105 active:scale-95 transition-transform w-36"><img src={BTN_EXIT_GAME_IMG} alt="Esci" className="w-full h-auto drop-shadow-xl" /></button></div>
               </div>
            )}
            {gameState === 'VICTORY' && (
               <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 shadow-2xl text-center max-w-md w-full animate-in zoom-in relative">
                   {onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                   <Trophy size={80} className="text-yellow-400 mx-auto mb-4 animate-bounce drop-shadow-lg" />
                   <h3 className="text-4xl font-black text-purple-600 mb-2 drop-shadow-sm">INCREDIBILE!</h3>
                   <p className="text-gray-600 font-bold mb-6 text-lg">Hai completato tutti i 30 livelli!</p>
                   <div className="bg-yellow-100 text-yellow-800 px-8 py-4 rounded-2xl font-black text-3xl border-4 border-yellow-400 mb-8 inline-block animate-pulse shadow-lg transform rotate-2">+{earnedTokens} GETTONI! 🪙</div>
                   <div className="flex flex-col gap-3 items-center"><button onClick={returnToMenu} className="hover:scale-105 active:scale-95 transition-transform w-full max-w-[150px]"><img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" /></button></div>
               </div>
            )}
        </div>
    </div>
  );
};

export default OddOneOutGame;
