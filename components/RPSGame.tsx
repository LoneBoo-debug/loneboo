import React, { useState, useEffect } from 'react';
import { RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import { getProgress } from '../services/tokens';

const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const RPS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rps-morra-bg.webp';
const BTN_NEXT_ROUND_IMG = 'https://i.postimg.cc/XYkkds7t/proxround-(1)-(1).png';

const PLAYER_SCORE_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gfghgf-(1).webp';
const MONSTER_SCORE_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/monstffderd.webp';

// STYLE FOR NEON GREEN OUTLINE (FOLLOWS PNG BORDER)
const IMG_GLOW = 'drop-shadow(0 0 3px #39FF14) drop-shadow(0 0 6px #39FF14)';

// IMAGES FOR CHOICES
const choices = [
  { name: 'Sasso', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pugddno-(1).webp', beats: 'Forbice' },
  { name: 'Carta', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mno-(1).webp', beats: 'Sasso' },
  { name: 'Forbice', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/forbix-(1).webp', beats: 'Carta' },
];

const TOTAL_ROUNDS = 3;
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
  const [userTokens, setUserTokens] = useState(0);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
  }, []);

  const handleChoice = (choiceName: string) => {
    const randomChoice = choices[Math.floor(Math.random() * choices.length)];
    setIsShaking(true);

    setTimeout(() => {
        setIsShaking(false);
        setPlayerChoice(choiceName);
        setComputerChoice(randomChoice.name);

        let winner = 'draw';
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
              const amount = 5;
              onEarnTokens(amount);
              setRewardGiven(true);
              setUserTokens(prev => prev + amount);
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white/20 backdrop-blur-xl p-8 rounded-[40px] border-4 border-white/40 shadow-2xl max-sm w-full mx-4 text-center transform animate-in zoom-in duration-300 relative flex flex-col items-center gap-4">
                  
                  <h2 
                      className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-md font-cartoon"
                      style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
                  >
                      ROUND {currentRound} FINITO
                  </h2>
                  
                  <p className={`text-xl font-black uppercase mb-2 ${playerWonRound ? 'text-green-400' : (roundScore.player === roundScore.computer ? 'text-yellow-400' : 'text-red-400')}`} style={{ textShadow: '1px 1px 0 #000' }}>
                      {playerWonRound ? 'HAI VINTO IL ROUND!' : (roundScore.player === roundScore.computer ? 'PAREGGIO!' : 'IL MOSTRO VINCE!')}
                  </p>
                  
                  <div className="flex items-center justify-center gap-8 py-4 mb-4">
                      <div className="flex flex-col items-center">
                          <div className="bg-orange-500/90 border-4 border-white w-20 h-20 rounded-2xl shadow-lg transform -rotate-12 flex items-center justify-center">
                              <span className="font-black text-4xl text-white drop-shadow-md">{roundScore.computer}</span>
                          </div>
                          <span className="text-[10px] font-black text-white/80 mt-2 uppercase tracking-widest bg-black/40 px-2 rounded-full">Mostro</span>
                      </div>

                      <div className="text-white font-black text-2xl italic opacity-50">VS</div>

                      <div className="flex flex-col items-center">
                          <div className="bg-boo-purple/90 border-4 border-white w-20 h-20 rounded-2xl shadow-lg transform rotate-12 flex items-center justify-center">
                              <span className="font-black text-4xl text-white drop-shadow-md">{roundScore.player}</span>
                          </div>
                          <span className="text-[10px] font-black text-white/80 mt-2 uppercase tracking-widest bg-black/40 px-2 rounded-full">Tu</span>
                      </div>
                  </div>

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

  const wrapperStyle = "fixed inset-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={wrapperStyle}>
      <img 
          src={RPS_BG} 
          alt="" 
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" 
          draggable={false}
      />
      
      {/* HUD SUPERIORE: TASTO ESCI E SALDO GETTONI */}
      <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
          <div className="pointer-events-auto">
              <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                  <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto drop-shadow-md" />
              </button>
          </div>

          <div className="pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                  <span>{userTokens}</span> <span className="text-xl">🪙</span>
              </div>
          </div>
      </div>

      <div className="w-full h-full flex flex-col items-center p-4 relative z-10">
          
          <div className="w-full flex flex-col items-center shrink-0 z-10 pt-36 md:pt-48 lg:pt-52">
            <div className="flex justify-between items-end w-full max-w-lg mb-4 px-2">
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-orange-500 uppercase drop-shadow-[0_1px_1px_black] bg-black/40 px-2 rounded-full mb-1">MOSTRO</span>
                    <div className="flex gap-1">
                        {[...Array(TOTAL_ROUNDS)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full border-2 border-black shadow-sm ${i < totalWins.computer ? 'bg-orange-500' : 'bg-white/50'}`}></div>
                        ))}
                    </div>
                </div>

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

                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-boo-purple uppercase drop-shadow-[0_1px_1px_black] bg-black/40 px-2 rounded-full mb-1">TU</span>
                    <div className="flex gap-1">
                        {[...Array(TOTAL_ROUNDS)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full border-2 border-black shadow-sm ${i < totalWins.player ? 'bg-boo-purple' : 'bg-white/50'}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOX STILE AEREO SOTTO ROUND X CON ICONE PUNTEGGIO ULTERIORMENTE INGRANDITE */}
            <div className="bg-white/20 backdrop-blur-md rounded-[30px] border-4 border-white/40 shadow-xl p-3 md:p-6 flex items-center justify-center gap-4 md:gap-10 w-full max-w-lg">
                
                {/* GRUPPO PUNTEGGIO MOSTRO */}
                <div className="flex items-center gap-2">
                    <img src={MONSTER_SCORE_ICON} alt="Mostro" className="h-24 md:h-36 w-auto drop-shadow-md" />
                    <div className="flex flex-col items-center">
                        <div className="bg-orange-500/80 backdrop-blur-sm border-4 border-white px-4 py-2 rounded-2xl shadow-lg transform -rotate-6">
                            <span className="font-black text-4xl md:text-5xl text-white drop-shadow-md">{roundScore.computer}</span>
                        </div>
                        <span className="text-xs font-black text-white bg-black/40 px-2 py-0.5 rounded-full mt-2 uppercase">MOSTRO</span>
                    </div>
                </div>
                
                <div className="text-white font-black text-4xl italic drop-shadow-[0_4px_0_black]">VS</div>
                
                {/* GRUPPO PUNTEGGIO GIOCATORE */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                        <div className="bg-boo-purple/80 backdrop-blur-sm border-4 border-white px-4 py-2 rounded-2xl shadow-lg transform rotate-6">
                            <span className="font-black text-4xl md:text-5xl text-white drop-shadow-md">{roundScore.player}</span>
                        </div>
                        <span className="text-xs font-black text-white bg-black/40 px-2 py-0.5 rounded-full mt-2 uppercase">TU</span>
                    </div>
                    <img src={PLAYER_SCORE_ICON} alt="Tu" className="h-24 md:h-36 w-auto drop-shadow-md" />
                </div>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col justify-center items-center min-h-0 relative">
            <div className="w-full flex justify-center items-center h-[280px] md:h-[350px]">
                {isShaking ? (
                    <div className="flex flex-col items-center justify-center animate-in fade-in duration-200">
                        <div className="flex items-center gap-4 md:gap-12 mb-4">
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
                        <div className="mb-8 animate-in zoom-in duration-300">
                            <h2 
                                className="text-4xl md:text-5xl font-black uppercase tracking-wider text-center animate-bounce"
                                style={{ 
                                    color: 'white',
                                    textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                    fontFamily: '"Titan One", cursive',
                                    WebkitTextStroke: '2px black'
                                }}
                            >
                                {turnResult}
                            </h2>
                        </div>

                        <div className="flex items-center justify-center gap-8 md:gap-16 w-full">
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
                    <div className="bg-white/20 backdrop-blur-md rounded-[40px] border-4 border-white/40 shadow-xl p-4 md:p-8 flex justify-center items-center gap-2 md:gap-8 w-full max-w-xl mx-2">
                        {choices.map((choice) => (
                            <button 
                                key={choice.name} 
                                onClick={() => handleChoice(choice.name)} 
                                className="flex-1 flex flex-col items-center justify-center gap-2 transition-transform hover:scale-110 active:scale-95 group focus:outline-none"
                                style={{ touchAction: 'manipulation' }}
                            >
                                {/* CONTENITORE AD ALTEZZA FISSA PER LE IMMAGINI */}
                                <div className="w-24 md:w-36 h-24 md:h-36 flex items-center justify-center">
                                    <img 
                                        src={choice.img} 
                                        alt={choice.name} 
                                        className="max-w-full max-h-full transition-all drop-shadow-xl object-contain" 
                                        style={{ filter: IMG_GLOW }}
                                    />
                                </div>
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
                )}
            </div>
          </div>

          <div className="w-full max-w-3xl shrink-0 mt-auto pb-6 flex items-end justify-between px-2 gap-2">
                <div className="flex flex-col items-center bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-white/20 shadow-lg shrink-0">
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">SFIDA</span>
                    <span className="text-2xl font-black text-white leading-none drop-shadow-md">
                        {currentTurn}<span className="text-sm text-white/60">/{TURNS_PER_ROUND}</span>
                    </span>
                </div>

                <div className="bg-yellow-400 text-black border-2 border-black rounded-xl p-2 px-3 shadow-[4px_4px_0_black] flex-1 transform -rotate-1 animate-pulse flex items-center justify-center max-w-[200px]">
                    <p className="text-xs md:text-sm font-black text-center leading-tight">
                        Tocca la tua mossa <br/> <span className="text-base">e inizia a giocare!</span>
                    </p>
                </div>
          </div>

          {gameState === 'GAME_OVER' && renderGameOver()}
          {gameState === 'ROUND_OVER' && renderRoundOver()}

      </div>
    </div>
  );
};

export default RPSGame;