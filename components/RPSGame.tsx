
import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, ArrowRight, Star, LogOut } from 'lucide-react';

const choices = [
  { name: 'Sasso', emoji: '✊', beats: 'Forbice' },
  { name: 'Carta', emoji: '✋', beats: 'Sasso' },
  { name: 'Forbice', emoji: '✌️', beats: 'Carta' },
];

const TOTAL_ROUNDS = 5;
const TURNS_PER_ROUND = 5;

type GameState = 'PLAYING' | 'ROUND_OVER' | 'GAME_OVER';

interface RPSGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const RPSGame: React.FC<RPSGameProps> = ({ onBack, onEarnTokens }) => {
  // Game Flow State
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [gameState, setGameState] = useState<GameState>('PLAYING');

  // Animation State
  const [isShaking, setIsShaking] = useState(false);

  // Scores
  const [roundScore, setRoundScore] = useState({ player: 0, computer: 0 }); // Score within current round
  const [totalWins, setTotalWins] = useState({ player: 0, computer: 0 }); // Rounds won
  
  // Reward State
  const [rewardGiven, setRewardGiven] = useState(false);

  // Round Logic
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [turnResult, setTurnResult] = useState<string | null>(null);

  const handleChoice = (choiceName: string) => {
    // 1. Determine PC move immediately but don't show it yet
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    
    // 2. Start Animation
    setIsShaking(true);

    // 3. Wait 2 seconds for animation, then reveal and calculate
    setTimeout(() => {
        setIsShaking(false);
        setPlayerChoice(choiceName);
        setComputerChoice(randomChoice.name);

        let winner = 'draw';
        let resultMsg = "Pareggio! 😐";

        if (choiceName !== randomChoice.name) {
            const selected = choices.find(c => c.name === choiceName);
            if (selected?.beats === randomChoice.name) {
                winner = 'player';
                resultMsg = "Punto per te! 🎉";
                setRoundScore(s => ({ ...s, player: s.player + 1 }));
            } else {
                winner = 'computer';
                resultMsg = "Punto alla Zucca! 🎃";
                setRoundScore(s => ({ ...s, computer: s.computer + 1 }));
            }
        }
        setTurnResult(resultMsg);

        // Check Turn Limit
        if (currentTurn >= TURNS_PER_ROUND) {
            setTimeout(() => finishRound(winner), 1500);
        } else {
            setTimeout(nextTurn, 1500);
        }
    }, 2000); // 2 Seconds Animation Duration
  };

  const nextTurn = () => {
      setPlayerChoice(null);
      setComputerChoice(null);
      setTurnResult(null);
      setCurrentTurn(t => t + 1);
  };

  const finishRound = (lastWinner: string) => {
      // Calculate final score of the round including the very last move
      setRoundScore(prev => {
          // Note: state update is async, so we calculate final manually based on prev + last move
          const finalP = lastWinner === 'player' ? prev.player + 1 : prev.player;
          const finalC = lastWinner === 'computer' ? prev.computer + 1 : prev.computer;
          
          // Determine Round Winner
          if (finalP > finalC) {
              setTotalWins(w => ({ ...w, player: w.player + 1 }));
          } else if (finalC > finalP) {
              setTotalWins(w => ({ ...w, computer: w.computer + 1 }));
          }
          // Ties in rounds don't award points to either (or could split, but keeping simple)

          setGameState(currentRound >= TOTAL_ROUNDS ? 'GAME_OVER' : 'ROUND_OVER');
          return prev; // Return prev just to satisfy setter type, effectively not used as we change view
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

  // REWARD LOGIC
  useEffect(() => {
      if (gameState === 'GAME_OVER' && !rewardGiven && onEarnTokens) {
          // Check if player won the match (more rounds won than computer)
          if (totalWins.player > totalWins.computer) {
              onEarnTokens(5);
              setRewardGiven(true);
          }
      }
  }, [gameState, totalWins, rewardGiven, onEarnTokens]);

  // Render Game Over Content
  const renderGameOver = () => {
      const playerWon = totalWins.player > totalWins.computer;
      const isDraw = totalWins.player === totalWins.computer;

      return (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-300 rounded-[30px]">
              {playerWon ? (
                  <>
                    <Trophy size={80} className="text-yellow-400 drop-shadow-[0_0_20px_gold] animate-bounce mb-4" />
                    <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-1 drop-shadow-md">
                        SEI UN CAMPIONE! 🏆
                    </h2>
                    <p className="text-white text-lg font-bold mb-6">Hai sconfitto la Zucca!</p>
                    
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
                    <div className="text-6xl mb-4">🎃</div>
                    <h2 className="text-3xl font-black text-orange-500 text-center mb-1">OH NO!</h2>
                    <p className="text-white text-lg font-bold mb-6">La Zucca ha vinto il torneo.</p>
                  </>
              )}

              <div className="bg-white/10 p-3 rounded-xl border-2 border-white/20 mb-6 flex gap-8">
                  <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">I TUOI ROUND</p>
                      <p className="text-3xl font-black text-boo-purple">{totalWins.player}</p>
                  </div>
                  <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase font-bold">ROUND ZUCCA</p>
                      <p className="text-3xl font-black text-orange-500">{totalWins.computer}</p>
                  </div>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-xs">
                  <button 
                      onClick={resetGame}
                      className="w-full bg-boo-green text-white font-black text-lg px-6 py-2 rounded-full border-4 border-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                      <RefreshCw size={20} /> RIVINCITA
                  </button>
                  <button 
                      onClick={onBack}
                      className="w-full bg-red-500 text-white font-black text-lg px-6 py-2 rounded-full border-4 border-black shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                      <LogOut size={20} /> ESCI
                  </button>
              </div>
          </div>
      );
  };

  // Render Round Over
  const renderRoundOver = () => {
      const playerWonRound = roundScore.player > roundScore.computer;
      return (
          <div className="absolute inset-0 z-40 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in rounded-[30px]">
              <h2 className="text-2xl font-black text-gray-800 mb-1">ROUND {currentRound} FINITO</h2>
              <div className="text-5xl mb-2">{playerWonRound ? '🌟' : (roundScore.player === roundScore.computer ? '😐' : '🎃')}</div>
              <p className="text-lg font-bold text-gray-600 mb-6">
                  {playerWonRound ? 'Hai vinto questo round!' : (roundScore.player === roundScore.computer ? 'Pareggio!' : 'Ha vinto la Zucca!')}
              </p>
              
              <div className="flex gap-4 mb-6 text-xl font-black">
                  <span className="text-boo-purple">{roundScore.player}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-orange-500">{roundScore.computer}</span>
              </div>

              <button 
                  onClick={nextRound}
                  className="bg-boo-blue text-white font-black text-lg px-6 py-2 rounded-full border-4 border-black hover:scale-105 transition-all flex items-center gap-2"
              >
                  ROUND SUCCESSIVO <ArrowRight />
              </button>
          </div>
      );
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center animate-fade-in pb-2">
      <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-2 drop-shadow-md text-center" style={{ textShadow: "3px 3px 0px black" }}>
          Morra Mostruosa
      </h2>

      <div className="bg-white p-2 md:p-4 rounded-[30px] border-4 border-black shadow-[6px_6px_0px_0px_#F97316] w-full text-center relative overflow-hidden min-h-[350px] flex flex-col">
        
        {/* OVERLAYS */}
        {gameState === 'GAME_OVER' && renderGameOver()}
        {gameState === 'ROUND_OVER' && renderRoundOver()}

        {/* --- HEADER INFO --- */}
        <div className="flex justify-between items-center mb-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
             <div className="flex flex-col items-start">
                 <span className="text--[10px] font-bold text-gray-400 uppercase">ROUND</span>
                 <span className="text-lg font-black text-gray-800">{currentRound} / {TOTAL_ROUNDS}</span>
             </div>

             {/* Round Wins Dots */}
             <div className="flex gap-3">
                 <div className="flex flex-col items-center">
                     <span className="text-[9px] font-bold text-boo-purple uppercase">TU</span>
                     <div className="flex gap-1">
                         {[...Array(TOTAL_ROUNDS)].map((_, i) => (
                             <div key={i} className={`w-2 h-2 rounded-full border border-black ${i < totalWins.player ? 'bg-boo-purple' : 'bg-gray-200'}`}></div>
                         ))}
                     </div>
                 </div>
                 <div className="flex flex-col items-center">
                     <span className="text-[9px] font-bold text-orange-500 uppercase">ZUCCA</span>
                     <div className="flex gap-1">
                         {[...Array(TOTAL_ROUNDS)].map((_, i) => (
                             <div key={i} className={`w-2 h-2 rounded-full border border-black ${i < totalWins.computer ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
                         ))}
                     </div>
                 </div>
             </div>

             <div className="flex flex-col items-end">
                 <span className="text-[10px] font-bold text-gray-400 uppercase">SFIDA</span>
                 <span className="text-lg font-black text-gray-800">{currentTurn} / {TURNS_PER_ROUND}</span>
             </div>
        </div>

        {/* --- SCOREBOARD (Current Round) --- */}
        <div className="flex justify-center items-center gap-6 mb-2">
           <div className="flex flex-col items-center">
               <span className="text-2xl mb-1">👻</span>
               <span className="font-black text-3xl">{roundScore.player}</span>
           </div>
           
           <div className="text-gray-300 font-black text-xl">VS</div>
           
           <div className="flex flex-col items-center">
               <span className="text-2xl mb-1">🎃</span>
               <span className="font-black text-3xl">{roundScore.computer}</span>
           </div>
        </div>

        {/* --- GAME AREA --- */}
        <div className="flex-1 flex flex-col justify-center">
            {isShaking ? (
                // --- ANIMATION VIEW ---
                <div className="flex flex-col items-center justify-center animate-in fade-in duration-200">
                    <div className="flex items-center gap-4 md:gap-8 mb-4">
                        {/* Fists jumping towards each other */}
                        <div className="text-7xl md:text-9xl animate-bounce" style={{ animationDuration: '0.6s' }}>
                            🤜
                        </div>
                        <div className="text-7xl md:text-9xl animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0.1s' }}>
                            🤛
                        </div>
                    </div>
                    <p className="text-xl font-black text-boo-purple animate-pulse">Sasso... Carta... Forbice!</p>
                </div>
            ) : playerChoice ? (
                // --- RESULT VIEW ---
                <div className="animate-in zoom-in duration-200">
                    <p className="text-xl font-black text-gray-800 mb-4">{turnResult}</p>
                    
                    <div className="flex items-center justify-center gap-6 md:gap-12">
                        {/* Player Move */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-400">TU</span>
                            <div className="p-4 rounded-2xl border-4 border-boo-purple bg-purple-50 shadow-md">
                                <span className="text-5xl md:text-6xl filter drop-shadow-sm">
                                    {choices.find(c => c.name === playerChoice)?.emoji}
                                </span>
                            </div>
                        </div>

                        {/* Computer Move */}
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-400">ZUCCA</span>
                            <div className="p-4 rounded-2xl border-4 border-orange-500 bg-orange-50 shadow-md">
                                <span className="text-5xl md:text-6xl filter drop-shadow-sm">
                                    {choices.find(c => c.name === computerChoice)?.emoji}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // --- SELECTION VIEW ---
                <>
                    <p className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Fai la tua mossa!</p>
                    <div className="flex justify-center gap-2 md:gap-4 w-full px-2">
                    {choices.map((choice) => (
                        <button
                        key={choice.name}
                        onClick={() => handleChoice(choice.name)}
                        className="flex-1 flex flex-col items-center justify-center gap-1 p-2 md:p-4 rounded-xl border-2 border-gray-200 hover:border-boo-purple hover:bg-purple-50 transition-all active:scale-95"
                        style={{ touchAction: 'manipulation' }}
                        >
                        <span className="text-3xl sm:text-4xl md:text-5xl drop-shadow-sm leading-none">
                            {choice.emoji}
                        </span>
                        <span className="font-black text-[10px] md:text-xs text-gray-600 uppercase">{choice.name}</span>
                        </button>
                    ))}
                    </div>
                </>
            )}
        </div>

      </div>
    </div>
  );
};

export default RPSGame;
