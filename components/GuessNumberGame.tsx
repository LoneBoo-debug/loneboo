
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, RotateCcw, Trophy } from 'lucide-react';
import { getProgress } from '../services/tokens';

const TITLE_IMG = 'https://i.postimg.cc/NfwZ80Sc/indonum-(1).png';
const GUESS_BG = 'https://i.postimg.cc/nVwNV707/Hailuo-Image-creami-una-immagine-per-uno-sf-457359369918926849.jpg';
const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const BTN_PROVA_IMG = 'https://i.postimg.cc/hGbTFBM2/tasto-prova-(1).png';
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';

interface GuessNumberGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const GuessNumberGame: React.FC<GuessNumberGameProps> = ({ onBack, onEarnTokens }) => {
  const [target, setTarget] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Indovina il numero tra 1 e 100!');
  
  // New state to track visual hint direction
  const [hintDirection, setHintDirection] = useState<'UP' | 'DOWN' | null>(null);

  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState<{val: number, hint: 'high'|'low'}[]>([]);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  
  // Token State
  const [currentTokens, setCurrentTokens] = useState(0);

  useEffect(() => {
      try {
          const p = getProgress();
          setCurrentTokens(p ? p.tokens : 0);
      } catch (e) { console.error(e); }
  }, []);

  // Update tokens locally when reward is given
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
          setHintDirection(null);
          
          if (currentAttempt <= 5) {
              if (onEarnTokens && !rewardGiven) {
                  onEarnTokens(10);
                  setEarnedTokens(10);
                  setRewardGiven(true);
                  // INSTANT UI UPDATE
                  setCurrentTokens(prev => prev + 10);
              }
              setMessage(`🎉 MITICO! Era proprio il numero ${target}!`);
          } else {
              setMessage(`👏 Bravo! Era il numero ${target}!`);
          }

      } else if (val < target) {
          setMessage('Troppo BASSO! Prova a salire.');
          setHintDirection('UP');
          setHistory(prev => [{val, hint: 'low'}, ...prev]);
      } else {
          setMessage('Troppo ALTO! Scendi un po\'.');
          setHintDirection('DOWN');
          setHistory(prev => [{val, hint: 'high'}, ...prev]);
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
      setHistory([]);
      setRewardGiven(false);
      setEarnedTokens(0);
  };

  // WRAPPER STYLE FOR FULL SCREEN (NO SCROLL)
  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

  return (
    <div 
        className={wrapperStyle}
        style={{ backgroundImage: `url(${GUESS_BG})` }}
    >
      {/* BACK BUTTON */}
      <div className="absolute top-4 left-4 z-50">
          <button 
              onClick={onBack} 
              className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
              <img 
                  src={EXIT_BTN_IMG} 
                  alt="Ritorna al Parco" 
                  className="h-12 w-auto drop-shadow-md" 
              />
          </button>
      </div>

      {/* TOP RIGHT TOKEN COUNTER */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none">
           <div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg">
               <span>{currentTokens}</span> <span className="text-xl">🪙</span>
           </div>
      </div>

      {/* MAIN CONTAINER - FLEX CENTERED, NO SCROLL */}
      <div className="w-full h-full flex flex-col items-center justify-center relative p-4 pb-16">
          
          {/* HEADER IMAGE - Enlarged */}
          <img 
               src={TITLE_IMG} 
               alt="Indovina il Numero" 
               className="h-28 md:h-40 w-auto mb-6 relative z-10 hover:scale-105 transition-transform duration-300 shrink-0"
               style={{
                   filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)'
               }}
           />

          {/* INTEGRATED GAME AREA */}
          <div className="w-[95%] max-w-xl flex flex-col items-center relative z-10">
             
             {!won && (
                 <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border-4 border-orange-500 mb-4 w-full shadow-[0_4px_0_#c2410c] transform rotate-[-1deg] max-w-sm shrink-0">
                     <p className="text-orange-900 font-bold text-xs md:text-sm text-center leading-tight">
                         Indovina in <span className="text-red-600 font-black">5 tentativi</span> per vincere <span className="text-black font-black">10 gettoni</span>!
                     </p>
                     <p className="text-gray-600 text-[10px] font-bold mt-0.5 uppercase tracking-wide text-center">
                         Tentativo attuale: <span className="text-blue-600 text-lg font-black">{attempts + 1}</span>
                     </p>
                 </div>
             )}

             {/* MESSAGE AREA WITH CARTOON ICONS */}
             <div className="mb-6 min-h-[5rem] flex items-center justify-center w-full px-2 shrink-0 relative">
                 <div className="flex items-center gap-4 relative z-20">
                     <p 
                        className={`text-xl md:text-3xl font-black leading-tight text-center drop-shadow-md ${won ? 'text-green-500 animate-bounce' : 'text-red-600'}`}
                        style={{ textShadow: '2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff' }}
                     >
                         {message}
                     </p>
                     
                     {/* Dynamic Cartoon Icons for Hints */}
                     {hintDirection === 'UP' && (
                         <div className="flex flex-col items-center animate-bounce">
                             <div className="w-14 h-14 bg-yellow-400 rounded-full border-4 border-red-600 flex items-center justify-center shadow-[0_4px_0_#991b1b]">
                                <ArrowUp size={36} className="text-red-600" strokeWidth={4} />
                             </div>
                             <span className="bg-red-600 text-white text-[10px] font-black px-2 rounded-full -mt-2 z-10 border-2 border-white shadow-sm">SALI!</span>
                         </div>
                     )}
                     
                     {hintDirection === 'DOWN' && (
                         <div className="flex flex-col items-center animate-bounce">
                             <div className="w-14 h-14 bg-yellow-400 rounded-full border-4 border-red-600 flex items-center justify-center shadow-[0_4px_0_#991b1b]">
                                <ArrowDown size={36} className="text-red-600" strokeWidth={4} />
                             </div>
                             <span className="bg-red-600 text-white text-[10px] font-black px-2 rounded-full -mt-2 z-10 border-2 border-white shadow-sm">SCENDI!</span>
                         </div>
                     )}
                 </div>
             </div>

             {!won ? (
                 <div className="flex gap-4 justify-center items-center mb-6 w-full max-w-xs shrink-0">
                     {/* INPUT */}
                     <input 
                        type="number" 
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="?"
                        // [appearance:textfield] and inner/outer spin-button removal hides the arrows
                        className="w-20 h-20 text-center text-3xl md:text-4xl font-black border-4 border-white rounded-2xl focus:border-orange-400 outline-none m-0 text-black bg-white/90 placeholder-gray-400 shadow-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                     />
                     {/* BUTTON IMAGE */}
                     <button 
                        onClick={handleGuess}
                        className="flex-1 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
                     >
                         <img src={BTN_PROVA_IMG} alt="Prova" className="w-[75%] h-auto drop-shadow-xl" />
                     </button>
                 </div>
             ) : (
                 <div className="flex flex-col items-center w-full animate-in zoom-in shrink-0">
                     
                     {earnedTokens > 0 ? (
                         <div className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xl border-4 border-black mb-6 shadow-xl transform rotate-[-2deg] animate-pulse">
                             <Trophy className="inline mr-2" size={24} />
                             +10 GETTONI!
                         </div>
                     ) : (
                         <div className="bg-white/90 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm border-4 border-gray-300 mb-6 shadow-lg text-center transform rotate-1">
                             Peccato! Hai usato più di 5 tentativi.<br/>Niente gettoni questa volta.
                         </div>
                     )}

                     <button 
                        onClick={resetGame}
                        className="hover:scale-105 active:scale-95 transition-transform w-full max-w-[130px] flex items-center justify-center mb-4"
                     >
                         <img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" />
                     </button>
                 </div>
             )}

             {history.length > 0 && (
                 <div className="w-full mt-0 pt-2 border-t-4 border-white/20 max-w-md shrink-0">
                     <p className="text-white font-black text-xs uppercase tracking-widest mb-2 drop-shadow-md text-center" style={{ textShadow: '1px 1px 0 #000' }}>PRECEDENTI:</p>
                     <div className="flex flex-wrap justify-center gap-2 max-h-[100px] overflow-y-auto">
                         {history.slice(0, 8).map((h, i) => (
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
