import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, RotateCcw, Trophy } from 'lucide-react';
import { getProgress } from '../services/tokens';

const GUESS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfindilnmnnnffsa.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const BTN_PROVA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tasto-prova-(1).webp';
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';

interface GuessNumberGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const GuessNumberGame: React.FC<GuessNumberGameProps> = ({ onBack, onEarnTokens }) => {
  const [target, setTarget] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Indovina il numero tra 1 e 100!');
  
  const [hintDirection, setHintDirection] = useState<'UP' | 'DOWN' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [history, setHistory] = useState<{val: number, hint: 'high'|'low'}[]>([]);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  
  const [currentTokens, setCurrentTokens] = useState(0);

  const MAX_ATTEMPTS = 5;

  useEffect(() => {
      try {
          const p = getProgress();
          setCurrentTokens(p ? p.tokens : 0);
      } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
      if (rewardGiven) {
          try {
              const p = getProgress();
              setCurrentTokens(p ? p.tokens : 0);
          } catch (e) { console.error(e); }
      }
  }, [rewardGiven]);

  const handleGuess = () => {
      const val = parseInt(guess);
      if (isNaN(val)) return;

      const currentAttempt = attempts + 1;
      setAttempts(currentAttempt);
      
      if (val === target) {
          setWon(true);
          setIsGameOver(true);
          setHintDirection(null);
          
          if (onEarnTokens && !rewardGiven) {
              onEarnTokens(10);
              setEarnedTokens(10);
              setRewardGiven(true);
              setCurrentTokens(prev => prev + 10);
          }
          setMessage(`🎉 MITICO! Era proprio il numero ${target}!`);

      } else {
          // Non ha indovinato
          if (currentAttempt >= MAX_ATTEMPTS) {
              // FINE TENTATIVI
              setWon(false);
              setIsGameOver(true);
              setHintDirection(null);
              setMessage(`Peccato! Il numero era ${target}.`);
          } else {
              // CONTINUA A GIOCARE CON SUGGERIMENTO
              if (val < target) {
                  setMessage('Troppo BASSO! Sali!');
                  setHintDirection('UP');
                  setHistory(prev => [{val, hint: 'low'}, ...prev]);
              } else {
                  setMessage('Troppo ALTO! Scendi!');
                  setHintDirection('DOWN');
                  setHistory(prev => [{val, hint: 'high'}, ...prev]);
              }
          }
      }
      setGuess('');
  };

  const resetGame = () => {
      setTarget(Math.floor(Math.random() * 100) + 1);
      setGuess('');
      setMessage('Indovina il numero tra 1 e 100!');
      setHintDirection(null);
      setAttempts(0);
      setWon(false);
      setIsGameOver(false);
      setHistory([]);
      setRewardGiven(false);
      setEarnedTokens(0);
  };

  const wrapperStyle = "fixed inset-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={wrapperStyle}>
      <img 
          src={GUESS_BG} 
          alt="" 
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" 
          draggable={false}
      />

      <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
          <div className="pointer-events-auto">
              <button 
                  onClick={onBack} 
                  className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation"
              >
                  <img 
                      src={EXIT_BTN_IMG} 
                      alt="Ritorna al Parco" 
                      className="h-12 w-auto" 
                  />
              </button>
          </div>

          <div className="pointer-events-auto">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                    <span>{currentTokens}</span> <span className="text-xl">🪙</span>
                </div>
          </div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-[132px] md:pt-[176px] px-4 overflow-hidden">
          <div className="w-full max-w-xl flex flex-col items-center relative z-10">
             
             {!isGameOver && (
                 <div className="w-full text-center animate-in slide-in-from-top-4 duration-500">
                     <p 
                        className="font-luckiest text-white uppercase tracking-wide leading-tight text-xl md:text-4xl"
                        style={{ 
                            WebkitTextStroke: '1.5px black',
                            textShadow: '3px 3px 0px rgba(0,0,0,0.5)'
                        }}
                     >
                         Indovina in <span className="text-yellow-400">5 tentativi</span> <br className="md:hidden" /> per vincere <span className="text-yellow-400">10 gettoni</span>!
                     </p>
                     <p 
                        className="font-luckiest text-white text-sm md:text-xl mt-1 uppercase tracking-widest flex items-center justify-center gap-1"
                        style={{ 
                            WebkitTextStroke: '1px black',
                            textShadow: '2px 2px 0px rgba(0,0,0,0.3)'
                        }}
                     >
                         Tentativo attuale: <span className="text-cyan-300 text-lg md:text-3xl ml-1">{attempts + 1}</span>
                     </p>

                     <div className="mt-0 min-h-[3rem] flex items-center justify-center w-full px-2 relative">
                        <div className="flex items-center gap-4 relative z-20">
                            <p 
                                className={`font-luckiest text-base md:text-2xl leading-tight text-center drop-shadow-md ${won ? 'text-green-500 animate-bounce' : 'text-white'}`}
                                style={{ 
                                    WebkitTextStroke: '1.2px black',
                                    textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                                }}
                            >
                                {message}
                            </p>
                            
                            {hintDirection === 'UP' && (
                                <div className="flex flex-col items-center animate-bounce scale-75 md:scale-90">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full border-4 border-red-600 flex items-center justify-center shadow-[0_4px_0_#991b1b]">
                                        <ArrowUp size={24} className="text-red-600" strokeWidth={4} />
                                    </div>
                                </div>
                            )}
                            
                            {hintDirection === 'DOWN' && (
                                <div className="flex flex-col items-center animate-bounce scale-75 md:scale-90">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full border-4 border-red-600 flex items-center justify-center shadow-[0_4px_0_#991b1b]">
                                        <ArrowDown size={24} className="text-red-600" strokeWidth={4} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
             )}

             {!isGameOver ? (
                 <div className="flex flex-col items-center mt-64 md:mt-80 w-full animate-fade-in px-4 shrink-0">
                     <div className="bg-white/20 backdrop-blur-[20px] py-2 px-6 md:py-3 md:px-8 rounded-[40px] border-4 border-white/40 shadow-2xl flex flex-row gap-6 items-center w-full max-w-[280px] md:max-w-[350px] justify-center">
                         <button 
                            onClick={handleGuess}
                            className="w-24 md:w-36 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shrink-0"
                         >
                             <img src={BTN_PROVA_IMG} alt="Prova" className="w-full h-auto drop-shadow-xl" />
                         </button>

                         <input 
                            type="number" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="?"
                            className="w-16 h-16 md:w-20 md:h-20 text-center text-3xl md:text-4xl font-black border-4 border-white rounded-2xl focus:border-orange-400 outline-none m-0 text-black bg-white/90 placeholder-gray-400 shadow-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shrink-0"
                            onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                         />
                     </div>
                 </div>
             ) : (
                 <div className="flex flex-col items-center w-full animate-in zoom-in shrink-0 mt-6 md:mt-10">
                     {won ? (
                         <div className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xl border-4 border-black mb-6 shadow-xl transform rotate-[-2deg] animate-pulse">
                             <Trophy className="inline mr-2" size={24} />
                             +10 GETTONI!
                         </div>
                     ) : (
                         <p 
                            className="font-luckiest text-white text-lg md:text-3xl leading-tight text-center drop-shadow-md mb-8 px-4"
                            style={{ 
                                WebkitTextStroke: '1.2px black',
                                textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
                            }}
                         >
                            PECCATO! Hai usato più di 5 tentativi.<br/>
                            <span className="text-gray-300 text-base md:text-xl">Niente gettoni questa volta.</span>
                         </p>
                     )}

                     <button 
                        onClick={resetGame}
                        className="hover:scale-105 active:scale-95 transition-transform w-full max-w-[130px] flex items-center justify-center mb-4"
                     >
                         <img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" />
                     </button>
                 </div>
             )}

             {!isGameOver && history.length > 0 && (
                 <div className="w-full mt-4 pt-2 border-t-4 border-white/20 max-w-md shrink-0">
                     <p className="text-white font-black text-xs uppercase tracking-widest mb-2 drop-shadow-md text-center" style={{ textShadow: '1px 1px 0 #000' }}>PRECEDENTI:</p>
                     <div className="flex flex-wrap justify-center gap-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                         {history.slice(0, 5).map((h, i) => (
                             <div key={i} className={`flex items-center gap-1 px-3 py-1 rounded-lg text-white font-black text-sm border-b-4 shadow-md animate-in slide-in-from-top-2 ${h.hint === 'low' ? 'bg-blue-500 border-blue-700' : 'bg-red-500 border-red-700'}`}>
                                 {h.val} {h.hint === 'low' ? <ArrowUp size={16} strokeWidth={4}/> : <ArrowDown size={16} strokeWidth={4}/>}
                             </div>
                         ))}
                     </div>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};

export default GuessNumberGame;