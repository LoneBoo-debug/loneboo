import React, { useState, useEffect } from 'react';
import { MEMORY_ICONS } from '../constants';
import { MemoryCard } from '../types';
import { RotateCcw, Trophy, Timer, Play, Lock } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lvl-easy.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lvl-medium.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lvl-hard.webp';
const MEMORY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/memory-bg.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const CARD_BACK_IMG = 'https://i.postimg.cc/tCZGcq9V/official.png';
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';
const BTN_RETRY_IMG = 'https://i.postimg.cc/Y0S1fsNj/tasto-riprova-(1).png';
const BTN_EXIT_GAME_IMG = 'https://i.postimg.cc/X7mwdxpc/tasto-esci-(1).png';
const DEFEAT_IMG = 'https://i.postimg.cc/9Q0569p7/sderfer-(1).png';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';

interface MemoryGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type GameState = 'MENU' | 'PLAYING' | 'WON' | 'GAME_OVER';

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState<MemoryCard | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<MemoryCard | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [currentTokens, setCurrentTokens] = useState(0);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      setCurrentTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  useEffect(() => { 
      if (showUnlockModal) { 
          const p = getProgress(); 
          setUserTokens(p.tokens); 
          setCurrentTokens(p.tokens); 
      } 
  }, [showUnlockModal]);

  const handleUnlockHard = () => { 
      if (unlockHardMode()) { 
          setIsHardUnlocked(true); 
          const p = getProgress(); 
          setUserTokens(p.tokens); 
          setCurrentTokens(p.tokens); 
          setShowUnlockModal(false); 
          initGame('HARD'); 
      } 
  };
  
  const handleOpenNewsstand = () => { 
      if (onOpenNewsstand) { 
          onOpenNewsstand(); 
          setShowUnlockModal(false); 
      } 
  };

  const shuffleCards = () => {
    const shuffledCards = [...MEMORY_ICONS, ...MEMORY_ICONS]
        .sort(() => Math.random() - 0.5)
        .map((icon, index) => ({ id: index, iconName: icon, isFlipped: false, isMatched: false }));
    setChoiceOne(null); 
    setChoiceTwo(null); 
    setCards(shuffledCards); 
    setTurns(0); 
    setRewardGiven(false);
  };

  const getInitialTime = (diff: Difficulty) => { 
      switch (diff) { 
          case 'EASY': return 60; 
          case 'MEDIUM': return 45; 
          case 'HARD': return 30; 
          default: return 60; 
      } 
  };

  const initGame = (diff: Difficulty) => {
      if (diff === 'HARD' && !isHardUnlocked) { 
          setShowUnlockModal(true); 
          return; 
      }
      setDifficulty(diff); 
      setTimeLeft(getInitialTime(diff)); 
      shuffleCards(); 
      setGameState('PLAYING');
  };

  const returnToMenu = () => { 
      setDifficulty(null); 
      setGameState('MENU'); 
  };

  useEffect(() => {
      let timer: any;
      if (gameState === 'PLAYING' && timeLeft > 0) { 
          timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000); 
      } else if (timeLeft === 0 && gameState === 'PLAYING') { 
          setGameState('GAME_OVER'); 
      }
      return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleChoice = (card: MemoryCard) => {
    if (choiceOne && choiceTwo) return;
    if (choiceOne && choiceOne.id === card.id) return;
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.iconName === choiceTwo.iconName) {
        setCards(prevCards => prevCards.map(card => { 
            if (card.iconName === choiceOne.iconName) { 
                return { ...card, isMatched: true, isFlipped: true }; 
            } 
            return card; 
        }));
        resetTurn();
      } else {
        setTimeout(() => { 
            setCards(prev => prev.map(c => (c.id === choiceOne.id || c.id === choiceTwo.id) ? { ...c, isFlipped: false } : c)); 
            resetTurn(); 
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => { 
      setChoiceOne(null); 
      setChoiceTwo(null); 
      setTurns(prevTurns => prevTurns + 1); 
      setDisabled(false); 
  };

  useEffect(() => { 
      if (cards.length > 0 && cards.every(c => c.isMatched) && gameState === 'PLAYING') { 
          setGameState('WON'); 
      } 
  }, [cards, gameState]);

  useEffect(() => {
      if (gameState === 'WON' && !rewardGiven && onEarnTokens && difficulty) {
          let reward = 0; 
          if (difficulty === 'EASY') reward = 5; 
          else if (difficulty === 'MEDIUM') reward = 10; 
          else if (difficulty === 'HARD') reward = 15;
          
          if (reward > 0) { 
              onEarnTokens(reward); 
              setRewardGiven(true); 
              setCurrentTokens(prev => prev + reward); 
          }
      }
  }, [gameState, rewardGiven, onEarnTokens, difficulty]);

  const wrapperStyle = "fixed inset-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={wrapperStyle}>
      {/* BACKGROUND IMAGE - FULL SCREEN & UNDER HEADER */}
      <img 
          src={MEMORY_BG} 
          alt="" 
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" 
          draggable={false}
      />

      {/* TOP HUD: BACK BUTTON AND TOKENS */}
      <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-auto">
          <div className="pointer-events-auto">
              {gameState === 'PLAYING' || gameState === 'WON' || gameState === 'GAME_OVER' ? (
                  <button onClick={returnToMenu} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                      <img src={BTN_BACK_MENU_IMG} alt="Menu" className="h-16 md:h-22 w-auto" />
                  </button>
              ) : (
                  <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                      <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 md:h-18 w-auto" />
                  </button>
              )}
          </div>

          <div className="pointer-events-auto">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                    <span>{currentTokens}</span> <span className="text-xl">🪙</span>
                </div>
          </div>
      </div>

      {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}

      {/* MAIN CONTAINER */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-44 md:pt-56 px-4">
          {gameState === 'MENU' && (
              <div className="flex flex-col items-center w-full animate-fade-in">
                  {/* AIRPLANE BOX BEHIND LEVELS */}
                  <div className="bg-white/20 backdrop-blur-[20px] p-6 md:p-10 rounded-[40px] border-4 border-white/40 shadow-2xl flex flex-col gap-4 items-center w-full max-w-[240px] md:max-w-[320px]">
                      <button onClick={() => initGame('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-full">
                          <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" />
                      </button>
                      <button onClick={() => initGame('MEDIUM')} className="hover:scale-105 active:scale-95 transition-transform w-full">
                          <img src={BTN_MEDIUM_IMG} alt="Medio" className="w-full h-auto drop-shadow-md" />
                      </button>
                      <div className="relative hover:scale-105 active:scale-95 transition-transform w-full">
                          <button onClick={() => initGame('HARD')} className={`w-full ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}>
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
                          Scegli un livello e sfida la tua memoria!
                      </p>
                  </div>
              </div>
          )}

          {gameState !== 'MENU' && (
            <div className="flex-1 w-full flex flex-col items-center justify-start min-h-0 pt-0">
                {/* GAME HUD (STAY COMPACT) */}
                <div className="flex items-center justify-between w-full max-w-md mb-4 bg-white/90 backdrop-blur-sm p-2 rounded-2xl border-4 border-black shadow-md relative z-10 shrink-0">
                    <div className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        Mosse: <span className="text-boo-purple text-xl">{turns}</span>
                    </div>
                    <div className={`flex items-center justify-center gap-2 text-xl font-black px-3 py-1 rounded-lg border-2 ${timeLeft <= 10 ? 'bg-red-100 text-red-600 border-red-500 animate-pulse' : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                        <Timer size={20} className={timeLeft <= 10 ? 'animate-bounce' : ''} />{timeLeft}s
                    </div>
                    <button onClick={() => initGame(difficulty!)} className="flex items-center justify-center gap-1 bg-boo-yellow text-black font-bold px-3 py-2 rounded-xl border-2 border-black hover:bg-yellow-300 active:translate-y-1 transition-all">
                        <RotateCcw size={18} />
                    </button>
                </div>

                <div className="relative w-full max-w-md aspect-square touch-manipulation p-1 max-h-[60vh]">
                    <div className="grid grid-cols-4 gap-2 w-full h-full">
                        {cards.map(card => {
                            const flipped = card.isFlipped || card.isMatched;
                            const isImage = card.iconName.startsWith('http') || card.iconName.startsWith('/') || card.iconName.startsWith('assets');
                            return (
                                <div 
                                    key={card.id} 
                                    className="relative w-full h-full cursor-pointer perspective-1000 group active:scale-95 transition-transform duration-100" 
                                    onPointerDown={() => !disabled && !flipped && gameState === 'PLAYING' && handleChoice(card)} 
                                    style={{ touchAction: 'manipulation' }}
                                >
                                    <div className={`w-full h-full relative transition-all duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
                                        <div className={`absolute inset-0 w-full h-full rounded-xl border-4 border-black bg-boo-purple flex items-center justify-center backface-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]`}>
                                            <img src={CARD_BACK_IMG} alt="?" className="w-2/3 h-2/3 object-contain opacity-90 drop-shadow-md" />
                                        </div>
                                        <div className={`absolute inset-0 w-full h-full rounded-xl border-4 border-black bg-white flex items-center justify-center backface-hidden rotate-y-180 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden ${card.isMatched ? 'bg-green-100 border-green-500' : ''}`}>
                                            {isImage ? (
                                                <img src={card.iconName} alt="Card" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl md:text-6xl select-none filter drop-shadow-sm">{card.iconName}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* END GAME MODALS */}
                    {(gameState === 'WON' || gameState === 'GAME_OVER') && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl animate-in zoom-in duration-300">
                            <div className="bg-white p-6 rounded-[30px] text-center border-4 border-black max-sm w-full shadow-2xl relative flex flex-col items-center">
                                {gameState === 'WON' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                                {gameState === 'WON' ? (
                                    <>
                                        <Trophy size={60} className="text-yellow-400 drop-shadow-lg mb-2 animate-bounce mx-auto" />
                                        <h2 className="text-3xl font-black text-black mb-2 drop-shadow-sm">Vittoria! 🎉</h2>
                                        <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-lg border-2 border-black mb-4 animate-pulse inline-block whitespace-nowrap">
                                            +{difficulty === 'HARD' ? 15 : (difficulty === 'MEDIUM' ? 10 : 5)} GETTONI! 🪙
                                        </div>
                                        <div className="flex flex-row gap-4 justify-center items-center w-full mt-2">
                                            <button onClick={() => initGame(difficulty!)} className="hover:scale-105 active:scale-95 transition-transform w-44">
                                                <img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" />
                                            </button>
                                            <button onClick={returnToMenu} className="hover:scale-105 active:scale-95 transition-transform w-28">
                                                <img src={BTN_EXIT_GAME_IMG} alt="Menu" className="w-full h-auto drop-shadow-xl" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-4 animate-in zoom-in duration-500">
                                            <img src={DEFEAT_IMG} alt="Tempo Scaduto" className="h-52 md:h-64 w-auto object-contain" />
                                        </div>
                                        <p className="font-bold text-gray-600 text-sm mb-6">Non sei stato abbastanza veloce!</p>
                                        <div className="flex flex-row gap-4 justify-center items-center w-full">
                                            <button onClick={() => initGame(difficulty!)} className="hover:scale-105 active:scale-95 transition-transform w-32">
                                                <img src={BTN_RETRY_IMG} alt="Riprova" className="w-full h-auto drop-shadow-xl" />
                                            </button>
                                            <button onClick={returnToMenu} className="hover:scale-105 active:scale-95 transition-transform w-32">
                                                <img src={BTN_EXIT_GAME_IMG} alt="Esci" className="w-full h-auto drop-shadow-xl" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
          )}
      </div>
      <style>{`
          .perspective-1000 { perspective: 1000px; } 
          .transform-style-3d { transform-style: preserve-3d; } 
          .backface-hidden { backface-visibility: hidden; } 
          .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default MemoryGame;