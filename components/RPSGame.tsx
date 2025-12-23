
import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, ArrowRight } from 'lucide-react';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const RPS_BG = 'https://i.postimg.cc/wvPQtn0v/sfondomorra.jpg';
const TITLE_IMG = 'https://i.postimg.cc/5yRWT94T/testomorr-(1).png';
const BTN_NEXT_ROUND_IMG = 'https://i.postimg.cc/XYkkds7t/proxround-(1)-(1).png';

// STYLE FOR NEON GREEN OUTLINE (FOLLOWS PNG BORDER)
const IMG_GLOW = 'drop-shadow(0 0 3px #39FF14) drop-shadow(0 0 6px #39FF14)';

// IMAGES FOR CHOICES
const choices = [
  { name: 'Sasso', img: 'https://i.postimg.cc/Lskz4nZw/pugddno-(1).png', beats: 'Forbice' },
  { name: 'Carta', img: 'https://i.postimg.cc/1XvBm4b1/mno-(1).png', beats: 'Sasso' },
  { name: 'Forbice', img: 'https://i.postimg.cc/5NZvww5J/forbix-(1).png', beats: 'Carta' },
];

const TOTAL_ROUNDS = 5;
const TURNS_PER_ROUND = 5;

type GameState = 'PLAYING' | 'ROUND_OVER' | 'GAME_OVER';

interface RPSGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const RPSGame: React.FC<RPSGameProps> = ({ onBack, onEarnTokens }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [isShaking, setIsShaking] = useState(false);
  const [roundScore, setRoundScore] = useState({ player: 0, computer: 0 });
  const [totalWins, setTotalWins] = useState({ player: 0, computer: 0 });
  const [rewardGiven, setRewardGiven] = useState(false);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [turnResult, setTurnResult] = useState<string | null>(null);

  const handleChoice = (choiceName: string) => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setIsShaking(true);

    setTimeout(() => {
        setIsShaking(false);
        setPlayerChoice(choiceName);
        setComputerChoice(randomChoice.name);

        let winner = 'draw';
        // Strings updated: Removed Emojis
        let resultMsg = "PAREGGIO!"; 

        if (choiceName !== randomChoice.name) {
            const selected = choices.find(c => c.name === choiceName);
            if (selected?.beats === randomChoice.name) {
                winner = 'player';
                resultMsg = "PUNTO PER TE!";
                setRoundScore(s => ({ ...s, player: s.player + 1 }));
            } else {
                winner = 'computer';
                resultMsg = "PUNTO AL MOSTRO!";
                setRoundScore(s => ({ ...s, computer: s.computer + 1 }));
            }
        }
        setTurnResult(resultMsg);

        if (currentTurn >= TURNS_PER_ROUND) {
            setTimeout(() => finishRound(winner), 1500);
        } else {
            setTimeout(nextTurn, 1500);
        }
    }, 2000); 
  };

  const nextTurn = () => {
      setPlayerChoice(null);
      setComputerChoice(null);
      setTurnResult(null);
      setCurrentTurn(t => t + 1);
  };

  const finishRound = (lastWinner: string) => {
      setRoundScore(prev => {
          const finalP = lastWinner === 'player' ? prev.player + 1 : prev.player;
          const finalC = lastWinner === 'computer' ? prev.computer + 1 : prev.computer;
          
          if (finalP > finalC) {
              setTotalWins(w => ({ ...w, player: w.player + 1 }));
          } else if (finalC > finalP) {
              setTotalWins(w => ({ ...w, computer: w.computer + 1 }));
          }

          setGameState(currentRound >= TOTAL_ROUNDS ? 'GAME_OVER' : 'ROUND_OVER');
          return prev; 
      });
  };

  const nextRound = () => {
      setCurrentRound(r => r + 1);
      setCurrentTurn(1);
      setRoundScore({ player: 0, computer: 0 });
      setPlayerChoice(null);
      setComputerChoice(null);
      setTurnResult(null);
      setGameState('PLAYING');
  };

  const resetGame = () => {
      setCurrentRound(1);
      setCurrentTurn(1);
      setRoundScore({ player: 0, computer: 0 });
      setTotalWins({ player: 0, computer: 0 });
      setPlayerChoice(null);
      setComputerChoice(null);
      setTurnResult(null);
      setRewardGiven(false);
      setGameState('PLAYING');
  };

  useEffect(() => {
      if (gameState === 'GAME_OVER' && !rewardGiven && onEarnTokens) {
          if (totalWins.player > totalWins.computer) {
              onEarnTokens(5);
              setRewardGiven(true);
          }
      }
  }, [gameState, totalWins, rewardGiven, onEarnTokens]);

  const renderGameOver = () => {
      const playerWon = totalWins.player > totalWins.computer;
      const isDraw = totalWins.player === totalWins.computer;

      return (
          <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300">
              {playerWon ? (
                  <>
                    <Trophy size={80} className="text-yellow-400 drop-shadow-[0_0_20px_gold] animate-bounce mb-4" />
                    <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-1 drop-shadow-md">
                        SEI UN CAMPIONE! 🏆
                    </h2>
                    <p className="text-white text-lg font-bold mb-6">Hai sconfitto il Mostro Sasso!</p>
                    
                    <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">
                        +5 GETTONI! 🪙
                    </div>
                  </>
              ) : isDraw ? (
                  <>
                    <div className="text-6xl mb-4">🤝</div>
                    <h2 className="text-3xl font-black text-white text-center mb-1">PAREGGIO!</h2>
                    <p className="text-white text-lg font-bold mb-6">Una sfida alla pari.</p>
                  </>
              ) : (
                  <>
                    <div className="text-6xl mb-4">👹</div>
                    <h2 className="text-3xl font-black text-orange-500 text-center mb-1">OH NO!</h2>
                    <p className="text-white text-lg font-bold mb-6">Il Mostro Sasso ha vinto.</p>
                  </>
              )}

              <div className="bg-white/10 p-3 rounded-xl border-2 border-white/20 mb-6 flex gap-8">
                  <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">ROUND MOSTRO</p>
                      <p className="text-3xl font-black text-orange-500">{totalWins.computer}</p>
                  </div>
                  <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">I TUOI ROUND</p>
                      <p className="text-3xl font-black text-boo-purple">{totalWins.player}</p>
                  </div>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-xs items-center">
                  <button onClick={resetGame} className="w-full bg-boo-green text-white font-black text-lg px-6 py-2 rounded-full border-4 border-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <RefreshCw size={20} /> RIVINCITA
                  </button>
                  <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform mt-2">
                      <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto" />
                  </button>
              </div>
          </div>
      );
  };

  const renderRoundOver = () => {
      const playerWonRound = roundScore.player > roundScore.computer;
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
              <div className="bg-black/70 backdrop-blur-md p-8 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full mx-4 text-center transform animate-in zoom-in duration-300 relative flex flex-col items-center gap-4">
                  
                  {/* TITOLO */}
                  <h2 
                      className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md font-cartoon"
                      style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
                  >
                      ROUND {currentRound} FINITO
                  </h2>
                  
                  {/* MESSAGGIO RISULTATO */}
                  <p className={`text-xl font-black uppercase mb-2 ${playerWonRound ? 'text-green-400' : (roundScore.player === roundScore.computer ? 'text-yellow-400' : 'text-red-400')}`} style={{ textShadow: '1px 1px 0 #000' }}>
                      {playerWonRound ? 'HAI VINTO IL ROUND!' : (roundScore.player === roundScore.computer ? 'PAREGGIO!' : 'IL MOSTRO VINCE!')}
                  </p>
                  
                  {/* PANNELLO RISULTATO (QUADRATI INCLINATI) */}
                  <div className="flex items-center justify-center gap-8 py-4 mb-4">
                      {/* MOSTRO */}
                      <div className="flex flex-col items-center">
                          <div className="bg-orange-500/90 border-4 border-white w-20 h-20 rounded-2xl shadow-lg transform -rotate-12 flex items-center justify-center">
                              <span className="font-black text-4xl text-white drop-shadow-md">{roundScore.computer}</span>
                          </div>
                          <span className="text-[10px] font-black text-white/80 mt-2 uppercase tracking-widest bg-black/40 px-2 rounded-full">Mostro</span>
                      </div>

                      <div className="text-white font-black text-2xl italic opacity-50">VS</div>

                      {/* TU */}
                      <div className="flex flex-col items-center">
                          <div className="bg-boo-purple/90 border-4 border-white w-20 h-20 rounded-2xl shadow-lg transform rotate-12 flex items-center justify-center">
                              <span className="font-black text-4xl text-white drop-shadow-md">{roundScore.player}</span>
                          </div>
                          <span className="text-[10px] font-black text-white/80 mt-2 uppercase tracking-widest bg-black/40 px-2 rounded-full">Tu</span>
                      </div>
                  </div>

                  {/* TASTO PROSSIMO ROUND */}
                  <button 
                      onClick={nextRound}
                      className="w-full hover:scale-105 active:scale-95 transition-all outline-none"
                  >
                      <img src={BTN_NEXT_ROUND_IMG} alt="Prossimo Round" className="w-full h-auto drop-shadow-xl" />
                  </button>
              </div>
          </div>
      );
  };

  // WRAPPER STYLE FOR FULL SCREEN
  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

  return (
    <div className={wrapperStyle} style={{ backgroundImage: `url(${RPS_BG})` }}>
      
      {/* BACK BUTTON */}
      <div className="absolute top-4 left-4 z-50">
          <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
              <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto drop-shadow-md" />
          </button>
      </div>

      <div className="w-full h-full flex flex-col items-center p-4 relative">
          
          {/* HEADER SECTION (Title + Round Info) - Shrink to fit */}
          <div className="w-full flex flex-col items-center shrink-0 z-10">
            {/* TITLE IMAGE */}
            <img 
                src={TITLE_IMG} 
                alt="Morra Mostruosa" 
                className="w-64 md:w-[400px] h-auto mb-2 mt-16 md:mt-12 hover:scale-105 transition-transform duration-300 relative z-10"
                style={{
                    filter: 'drop-shadow(0px 0px 4px #FF6600) drop-shadow(0px 0px 8px #FF6600) drop-shadow(0px 0px 2px #000)'
                }}
            />

            {/* INTEGRATED ROUND INDICATOR (No Box) */}
            <div className="flex justify-between items-end w-full max-w-lg mb-2 px-2">
                
                {/* MONSTER STATS (LEFT) */}
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-orange-500 uppercase drop-shadow-[0_1px_1px_black] bg-black/40 px-2 rounded-full mb-1">MOSTRO</span>
                    <div className="flex gap-1">
                        {[...Array(TOTAL_ROUNDS)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full border-2 border-black shadow-sm ${i < totalWins.computer ? 'bg-orange-500' : 'bg-white/50'}`}></div>
                        ))}
                    </div>
                </div>

                {/* ROUND TITLE (CENTER) */}
                <div className="flex flex-col items-center">
                    <h2 
                        className="text-3xl md:text-4xl font-black text-yellow-400 tracking-widest uppercase"
                        style={{ 
                            textShadow: '3px 3px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                            fontFamily: '"Titan One", cursive'
                        }}
                    >
                        ROUND {currentRound}
                    </h2>
                </div>

                {/* PLAYER STATS (RIGHT) */}
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-boo-purple uppercase drop-shadow-[0_1px_1px_black] bg-black/40 px-2 rounded-full mb-1">TU</span>
                    <div className="flex gap-1">
                        {[...Array(TOTAL_ROUNDS)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full border-2 border-black shadow-sm ${i < totalWins.player ? 'bg-boo-purple' : 'bg-white/50'}`}></div>
                        ))}
                    </div>
                </div>
            </div>
          </div>

          {/* MAIN GAME AREA - Flex 1 to take space, Center alignment */}
          <div className="flex-1 w-full flex flex-col justify-center items-center min-h-0 relative">
            
            {/* VS AREA */}
            <div className="flex justify-center items-center gap-4 md:gap-12 mb-4 shrink-0">
                {/* LEFT: MONSTER */}
                <div className="flex flex-col items-center">
                    <div className="bg-orange-500/80 backdrop-blur-sm border-4 border-white px-4 py-2 rounded-2xl shadow-lg transform -rotate-6">
                        <span className="font-black text-4xl md:text-5xl text-white drop-shadow-md">{roundScore.computer}</span>
                    </div>
                    <span className="text-xs font-black text-white bg-black/40 px-2 py-0.5 rounded-full mt-2">MOSTRO</span>
                </div>
                
                <div className="text-white font-black text-4xl italic drop-shadow-[0_4px_0_black]">VS</div>
                
                {/* RIGHT: PLAYER */}
                <div className="flex flex-col items-center">
                    <div className="bg-boo-purple/80 backdrop-blur-sm border-4 border-white px-4 py-2 rounded-2xl shadow-lg transform rotate-6">
                        <span className="font-black text-4xl md:text-5xl text-white drop-shadow-md">{roundScore.player}</span>
                    </div>
                    <span className="text-xs font-black text-white bg-black/40 px-2 py-0.5 rounded-full mt-2">TU</span>
                </div>
            </div>

            {/* GAMEPLAY / SELECTION AREA - Fixed Height Container to prevent layout jumps */}
            <div className="w-full flex justify-center items-center h-[280px] md:h-[350px]">
                {isShaking ? (
                    <div className="flex flex-col items-center justify-center animate-in fade-in duration-200">
                        <div className="flex items-center gap-4 md:gap-12 mb-4">
                            {/* SHAKING: Using Rock Image for both with NEON GLOW */}
                            <img 
                                src={choices[0].img} 
                                className="w-32 h-32 md:w-48 md:h-48 object-contain animate-bounce transform scale-x-[-1]" 
                                style={{ animationDuration: '0.6s', filter: IMG_GLOW }} 
                                alt="Shake Left" 
                            />
                            <img 
                                src={choices[0].img} 
                                className="w-32 h-32 md:w-48 md:h-48 object-contain animate-bounce" 
                                style={{ animationDuration: '0.6s', animationDelay: '0.1s', filter: IMG_GLOW }} 
                                alt="Shake Right" 
                            />
                        </div>
                        <p className="text-2xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-pulse">Sasso... Carta... Forbice!</p>
                    </div>
                ) : playerChoice ? (
                    <div className="animate-in zoom-in duration-200 w-full flex flex-col items-center">
                        
                        {/* RESULT TEXT - CARTOON STYLE, NO BOX, NO ICON */}
                        <div className="mb-8 animate-in zoom-in duration-300">
                            <h2 
                                className="text-4xl md:text-5xl font-black uppercase tracking-wider text-center animate-bounce"
                                style={{ 
                                    color: turnResult?.includes('TE') ? '#4ade80' : (turnResult?.includes('MOSTRO') ? '#ef4444' : '#fbbf24'),
                                    textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                    fontFamily: '"Titan One", cursive',
                                    WebkitTextStroke: '2px black'
                                }}
                            >
                                {turnResult}
                            </h2>
                        </div>

                        <div className="flex items-center justify-center gap-8 md:gap-16 w-full">
                            {/* RESULTS: Large Images with NEON GLOW */}
                            {/* Monster (Left) */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-32 h-32 md:w-48 md:h-48 transform -rotate-12 scale-110 transition-transform duration-500">
                                    <img 
                                        src={choices.find(c => c.name === computerChoice)?.img} 
                                        className="w-full h-full object-contain" 
                                        alt="Computer" 
                                        style={{ filter: IMG_GLOW }}
                                    />
                                </div>
                                <span className="text-xs font-black text-white bg-black/30 px-2 rounded-full mt-4">MOSTRO</span>
                            </div>

                            {/* Player (Right) */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-32 h-32 md:w-48 md:h-48 transform rotate-12 scale-110 transition-transform duration-500">
                                    <img 
                                        src={choices.find(c => c.name === playerChoice)?.img} 
                                        className="w-full h-full object-contain" 
                                        alt="Player" 
                                        style={{ filter: IMG_GLOW }}
                                    />
                                </div>
                                <span className="text-xs font-black text-white bg-black/30 px-2 rounded-full mt-4">TU</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center items-center gap-2 md:gap-8 w-full px-2">
                            {choices.map((choice) => (
                                <button 
                                    key={choice.name} 
                                    onClick={() => handleChoice(choice.name)} 
                                    className="flex-1 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-110 active:scale-95 group focus:outline-none"
                                    style={{ touchAction: 'manipulation' }}
                                >
                                    <img 
                                        src={choice.img} 
                                        alt={choice.name} 
                                        className="w-24 md:w-36 h-auto transition-all drop-shadow-xl" 
                                        style={{ filter: IMG_GLOW }}
                                    />
                                    <span 
                                        className={`font-black text-lg md:text-2xl uppercase tracking-wider mt-1 ${choice.name === 'Sasso' ? 'text-stone-300' : choice.name === 'Carta' ? 'text-yellow-300' : 'text-pink-400'}`}
                                        style={{ 
                                            textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                            fontFamily: '"Titan One", cursive',
                                            WebkitTextStroke: '1px black'
                                        }}
                                    >
                                        {choice.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
          </div>

          {/* FOOTER SECTION: Stats & Token Info */}
          <div className="w-full max-w-3xl shrink-0 mt-auto pb-2 flex items-end justify-between px-2 gap-2">
                {/* TURN COUNTER */}
                <div className="flex flex-col items-center bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-white/20 shadow-lg shrink-0">
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">SFIDA</span>
                    <span className="text-2xl font-black text-white leading-none drop-shadow-md">
                        {currentTurn}<span className="text-sm text-white/60">/{TURNS_PER_ROUND}</span>
                    </span>
                </div>

                {/* NEW TOKEN REWARD INFO BUBBLE */}
                <div className="bg-yellow-400 text-black border-2 border-black rounded-xl p-2 px-3 shadow-[4px_4px_0_black] flex-1 transform -rotate-1 animate-pulse flex items-center justify-center max-w-[200px]">
                    <p className="text-xs md:text-sm font-black text-center leading-tight">
                        Vinci 5 sfide <br/> <span className="text-base">= 5 GETTONI! 🪙</span>
                    </p>
                </div>
          </div>

          {/* OVERLAYS */}
          {gameState === 'GAME_OVER' && renderGameOver()}
          {gameState === 'ROUND_OVER' && renderRoundOver()}

      </div>
    </div>
  );
};

export default RPSGame;
