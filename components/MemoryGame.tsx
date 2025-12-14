
import React, { useState, useEffect, useRef } from 'react';
import { MEMORY_ICONS, CHANNEL_LOGO } from '../constants';
import { MemoryCard } from '../types';
import { RotateCcw, Trophy, LogOut, Timer, Play } from 'lucide-react';
import SaveReminder from './SaveReminder';

// Add Interface for prop
interface MemoryGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

type GameState = 'START' | 'PLAYING' | 'WON' | 'GAME_OVER';

const MemoryGame: React.FC<MemoryGameProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState<MemoryCard | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<MemoryCard | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  
  // New States for Timer & Game Flow
  const [gameState, setGameState] = useState<GameState>('START');
  const [timeLeft, setTimeLeft] = useState(60);

  // Shuffle cards
  const shuffleCards = () => {
    // MEMORY_ICONS now contains Emojis directly
    const shuffledCards = [...MEMORY_ICONS, ...MEMORY_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, iconName: icon, isFlipped: false, isMatched: false }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setRewardGiven(false);
    setTimeLeft(60);
  };

  const startGame = () => {
      shuffleCards();
      setGameState('PLAYING');
  };

  // Timer Logic
  useEffect(() => {
      let timer: any;
      if (gameState === 'PLAYING' && timeLeft > 0) {
          timer = setInterval(() => {
              setTimeLeft((prev) => prev - 1);
          }, 1000);
      } else if (timeLeft === 0 && gameState === 'PLAYING') {
          setGameState('GAME_OVER');
      }
      return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Handle a choice
  const handleChoice = (card: MemoryCard) => {
    if (choiceOne && choiceOne.id === card.id) return; // Prevent double click
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.iconName === choiceTwo.iconName) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.iconName === choiceOne.iconName) {
              return { ...card, isMatched: true };
            }
            return card;
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  // Check Win Condition
  useEffect(() => {
      if (cards.length > 0 && cards.every(c => c.isMatched) && gameState === 'PLAYING') {
          setGameState('WON');
      }
  }, [cards, gameState]);

  // EARN TOKENS ON WIN (5 Tokens)
  useEffect(() => {
      if (gameState === 'WON' && !rewardGiven && onEarnTokens) {
          onEarnTokens(5);
          setRewardGiven(true);
      }
  }, [gameState, rewardGiven, onEarnTokens]);

  return (
    <div className="w-full h-full flex flex-col items-center select-none overflow-hidden">
      
      <h2 className="text-3xl md:text-5xl font-black text-boo-orange mb-2 relative z-10 shrink-0" style={{ textShadow: "3px 3px 0px black" }}>
          Memory Game
      </h2>

      {/* START SCREEN */}
      {gameState === 'START' && (
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="bg-white p-8 rounded-[40px] border-8 border-boo-purple shadow-2xl text-center max-w-md w-full animate-in zoom-in">
                <div className="text-6xl mb-4 animate-bounce">🧠</div>
                <h3 className="text-2xl font-black text-gray-800 mb-4 uppercase">Sei pronto?</h3>
                <p className="text-lg text-gray-600 font-bold mb-6 leading-relaxed">
                    Hai <span className="text-red-500 font-black">1 minuto</span> per trovare tutte le coppie e guadagnare <span className="text-yellow-500 font-black bg-black px-2 py-1 rounded-lg">5 gettoni</span>!
                </p>
                
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={startGame}
                        className="w-full bg-green-500 text-white font-black text-xl py-4 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-105"
                    >
                        <Play size={24} fill="currentColor" /> VIA!
                    </button>
                    <button 
                        onClick={onBack}
                        className="w-full bg-gray-200 text-gray-600 font-black text-xl py-4 rounded-xl border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={24} /> ESCI
                    </button>
                </div>
            </div>
          </div>
      )}

      {/* GAME BOARD */}
      {gameState !== 'START' && (
        <div className="flex-1 w-full flex flex-col items-center justify-center min-h-0">
            <div className="flex items-center justify-between w-full max-w-md mb-2 bg-white p-2 rounded-2xl border-4 border-black shadow-md relative z-10 shrink-0">
                <div className="text-lg font-bold text-gray-700 flex items-center gap-2 w-24">
                    Mosse: <span className="text-boo-purple text-xl">{turns}</span>
                </div>
                
                {/* TIMER DISPLAY */}
                <div className={`flex items-center justify-center gap-2 text-xl font-black px-3 py-1 rounded-lg border-2 w-32 ${timeLeft <= 10 ? 'bg-red-100 text-red-600 border-red-500 animate-pulse' : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                    <Timer size={20} className={timeLeft <= 10 ? 'animate-bounce' : ''} />
                    {timeLeft}s
                </div>

                <div className="w-24 flex justify-end">
                    <button 
                        onClick={startGame}
                        className="flex items-center justify-center gap-1 bg-boo-yellow text-black font-bold px-2 py-2 rounded-xl border-2 border-black hover:bg-yellow-300 active:translate-y-1 w-full text-sm"
                    >
                        <RotateCcw size={16} /> <span className="hidden sm:inline">Riavvia</span>
                    </button>
                </div>
            </div>

            {/* Game Board Container - Padded to prevent clipping */}
            <div className="relative w-full max-w-md aspect-square touch-manipulation p-1">
                
                {/* The Grid */}
                <div className="grid grid-cols-4 gap-2 w-full h-full">
                    {cards.map(card => {
                        const flipped = card === choiceOne || card === choiceTwo || card.isMatched;

                        return (
                            <div 
                                key={card.id} 
                                className="relative w-full h-full cursor-pointer perspective-1000 group active:scale-95 transition-transform duration-100"
                                onClick={() => !disabled && !flipped && gameState === 'PLAYING' && handleChoice(card)}
                                style={{ touchAction: 'manipulation' }}
                            >
                                <div className={`
                                    w-full h-full relative transition-all duration-500 transform-style-3d
                                    ${flipped ? 'rotate-y-180' : ''}
                                `}>
                                    {/* Front (Hidden state/Back of card design) */}
                                    <div className={`
                                        absolute inset-0 w-full h-full rounded-xl border-4 border-black bg-boo-purple flex items-center justify-center
                                        backface-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
                                    `}>
                                        <img 
                                            src={CHANNEL_LOGO} 
                                            alt="?" 
                                            className="w-2/3 h-2/3 object-contain opacity-90 drop-shadow-md" 
                                        />
                                    </div>

                                    {/* Back (Revealed Icon) */}
                                    <div className={`
                                        absolute inset-0 w-full h-full rounded-xl border-4 border-black bg-white flex items-center justify-center
                                        backface-hidden rotate-y-180 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
                                        ${card.isMatched ? 'bg-green-100 border-green-500' : ''}
                                    `}>
                                        <span className="text-4xl md:text-6xl select-none filter drop-shadow-sm">
                                            {card.iconName}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* GAME OVER / VICTORY OVERLAYS */}
                {(gameState === 'WON' || gameState === 'GAME_OVER') && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl animate-in zoom-in duration-300">
                        <div className="bg-white p-6 rounded-[30px] text-center border-4 border-black max-w-xs w-full shadow-2xl relative">
                            
                            {/* SAVE REMINDER ICON */}
                            {gameState === 'WON' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

                            {gameState === 'WON' ? (
                                <>
                                    <Trophy size={60} className="text-yellow-400 drop-shadow-lg mb-2 animate-bounce mx-auto" />
                                    <h2 className="text-3xl font-black text-black mb-2 drop-shadow-sm">Vittoria! 🎉</h2>
                                    <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-black text-lg border-2 border-black mb-4 animate-pulse inline-block whitespace-nowrap">
                                        +5 GETTONI! 🪙
                                    </div>
                                    <p className="font-bold text-gray-600 text-sm mb-4">Hai finito in {60 - timeLeft} secondi!</p>
                                </>
                            ) : (
                                <>
                                    <div className="text-6xl mb-4 animate-shake">⏰</div>
                                    <h2 className="text-3xl font-black text-red-500 mb-2 drop-shadow-sm">TEMPO SCADUTO!</h2>
                                    <p className="font-bold text-gray-600 text-sm mb-4">Non sei stato abbastanza veloce!</p>
                                </>
                            )}
                            
                            <div className="flex flex-col gap-2 w-full">
                                <button 
                                    onClick={startGame}
                                    className="w-full bg-boo-green text-white font-black text-lg px-6 py-2 rounded-full border-4 border-black shadow-[2px_2px_0_black] hover:scale-105 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    <RotateCcw size={18} /> GIOCA ANCORA
                                </button>
                                <button 
                                    onClick={onBack}
                                    className="w-full bg-red-500 text-white font-black text-lg px-6 py-2 rounded-full border-4 border-black shadow-[2px_2px_0_black] hover:scale-105 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18} /> ESCI
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
      
      {/* Simple CSS class for rotation logic support in JS without external css file */}
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
