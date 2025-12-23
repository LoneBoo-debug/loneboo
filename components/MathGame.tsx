
import React, { useState, useEffect } from 'react';
import { Star, RotateCcw, ArrowLeft, Heart, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { getProgress } from '../services/tokens';

const TITLE_IMG = 'https://i.postimg.cc/HL6xQXjv/matem-(1).png';
// Direct link bypassing local registry for immediate visibility
const MATH_BG = 'https://i.postimg.cc/xT0wjp1F/sfondomath.jpg';
const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';

// Operation Button Images
const BTN_ADD_IMG = 'https://i.postimg.cc/zv4cBGfG/addizione.png';
const BTN_SUB_IMG = 'https://i.postimg.cc/pdGbvxKX/sottrazione.png';
const BTN_MUL_IMG = 'https://i.postimg.cc/k5hZZsdg/moltiplicazione.png';
const BTN_DIV_IMG = 'https://i.postimg.cc/dVsxVpsZ/divisione.png';

// Game Over Button Images
const BTN_RETRY_IMG = 'https://i.postimg.cc/Y0S1fsNj/tasto-riprova-(1).png';
const BTN_EXIT_GAME_IMG = 'https://i.postimg.cc/X7mwdxpc/tasto-esci-(1).png';

type OperationType = 'ADD' | 'SUB' | 'MUL' | 'DIV';

// Interface for props to include token earning
interface MathGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const MathGame: React.FC<MathGameProps> = ({ onBack, onEarnTokens }) => {
  const [selectedOp, setSelectedOp] = useState<OperationType | null>(null);
  
  const [question, setQuestion] = useState({ text: '', answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  
  // Game State
  const [score, setScore] = useState(0); // Counts correct answers
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [rewardGiven, setRewardGiven] = useState(false);
  
  // Token State
  const [currentTokens, setCurrentTokens] = useState(0);

  // Initialize tokens on mount
  useEffect(() => {
      try {
          const p = getProgress();
          setCurrentTokens(p ? p.tokens : 0);
      } catch (e) {
          console.error("Error loading tokens", e);
      }
  }, []);

  // Update tokens locally when reward is given to show instant feedback
  useEffect(() => {
      if (rewardGiven) {
          try {
              const p = getProgress();
              setCurrentTokens(p ? p.tokens : 0);
          } catch (e) {
              console.error("Error refreshing tokens", e);
          }
      }
  }, [rewardGiven]);

  // Difficulty logic based on score progression (optional scaling)
  const generateQuestion = () => {
    if (!selectedOp) return;

    let num1 = 0;
    let num2 = 0;
    let answer = 0;
    let text = "";

    // Increase difficulty slightly after 30 answers
    const rangeMultiplier = score > 30 ? 2 : 1;

    switch (selectedOp) {
        case 'ADD':
            num1 = Math.floor(Math.random() * (15 * rangeMultiplier)) + 1; 
            num2 = Math.floor(Math.random() * (10 * rangeMultiplier)) + 1; 
            answer = num1 + num2;
            text = `${num1} + ${num2} = ?`;
            break;

        case 'SUB':
            num1 = Math.floor(Math.random() * (15 * rangeMultiplier)) + 5; 
            num2 = Math.floor(Math.random() * num1);   
            answer = num1 - num2;
            text = `${num1} - ${num2} = ?`;
            break;

        case 'MUL':
            // Times tables 1-9 (1-12 for harder)
            const maxFactor = score > 50 ? 12 : 9;
            num1 = Math.floor(Math.random() * maxFactor) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
            answer = num1 * num2;
            text = `${num1} × ${num2} = ?`;
            break;

        case 'DIV':
            answer = Math.floor(Math.random() * 9) + 1; 
            num2 = Math.floor(Math.random() * 8) + 2;   
            num1 = answer * num2;                       
            text = `${num1} : ${num2} = ?`;
            break;
    }

    const optionsSet = new Set<number>();
    optionsSet.add(answer);

    while (optionsSet.size < 3) {
        const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const candidate = answer + offset;
        if (candidate >= 0 && !optionsSet.has(candidate)) {
            optionsSet.add(candidate);
        }
    }
    
    const opts = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    
    setQuestion({ text, answer });
    setOptions(opts);
    setFeedback(null);
  };

  useEffect(() => {
    if (selectedOp && !gameOver) {
        generateQuestion();
    }
  }, [selectedOp]);

  const handleAnswer = (val: number) => {
    if (gameOver) return;

    if (val === question.answer) {
      // CORRECT
      setScore(s => s + 1);
      setFeedback('correct');
      // Delay increased to 1.5s for better readability
      setTimeout(() => {
          setFeedback(null);
          generateQuestion();
      }, 1500);
    } else {
      // WRONG
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback('wrong');
      
      if (newLives === 0) {
          setTimeout(() => endGame(), 1000);
      } else {
          setTimeout(() => {
              setFeedback(null);
              generateQuestion(); 
          }, 1000);
      }
    }
  };

  const endGame = () => {
      setFeedback(null); // Force clear any feedback overlay to show Game Over screen
      setGameOver(true);
      
      // Calculate Reward
      let earned = 0;
      if (score >= 100) earned = 15;
      else if (score >= 50) earned = 10;
      else if (score >= 30) earned = 5;

      if (earned > 0 && onEarnTokens && !rewardGiven) {
          onEarnTokens(earned);
          // INSTANT UI UPDATE
          setCurrentTokens(prev => prev + earned);
          setRewardGiven(true);
      }
  };

  const handleSelectOp = (op: OperationType) => {
      setScore(0);
      setLives(3);
      setGameOver(false);
      setRewardGiven(false);
      setSelectedOp(op);
  };

  const restartGame = () => {
      if (selectedOp) handleSelectOp(selectedOp);
  };

  // --- SHARED WRAPPER STYLE (Fixed to ensure full screen coverage, NO SCROLL) ---
  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

  // --- MENU VIEW ---
  if (!selectedOp) {
      return (
        <div 
            className={wrapperStyle}
            style={{ backgroundImage: `url(${MATH_BG})` }}
        >
            {/* BACK BUTTON RESTORED */}
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

            {/* TOKEN HUD IN MENU */}
            <div className="absolute top-4 right-4 z-50">
               <div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg">
                   <span>{currentTokens}</span> <span className="text-xl">🪙</span>
               </div>
            </div>

            <div className="w-full h-full flex flex-col items-center justify-center p-4 pt-24">
                
                <img 
                    src={TITLE_IMG} 
                    alt="Matematica Magica" 
                    // Use stacked filters to create a thick, solid orange border + black outline
                    className="w-72 md:w-96 h-auto mb-8 hover:scale-105 transition-transform duration-300"
                    style={{
                        filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)'
                    }}
                />
                
                <div className="grid grid-cols-2 gap-y-4 gap-x-0 w-full max-w-md">
                    {/* ADDITION (Left) - Aligned Right to center */}
                    <button onClick={() => handleSelectOp('ADD')} className="hover:scale-105 active:scale-95 transition-transform drop-shadow-xl flex justify-end pr-3">
                        <img src={BTN_ADD_IMG} alt="Addizione" className="w-[75%] h-auto" />
                    </button>
                    {/* SUBTRACTION (Right) - Aligned Left to center */}
                    <button onClick={() => handleSelectOp('SUB')} className="hover:scale-105 active:scale-95 transition-transform drop-shadow-xl flex justify-start pl-3">
                        <img src={BTN_SUB_IMG} alt="Sottrazione" className="w-[75%] h-auto" />
                    </button>
                    {/* MULTIPLICATION (Left) - Aligned Right to center */}
                    <button onClick={() => handleSelectOp('MUL')} className="hover:scale-105 active:scale-95 transition-transform drop-shadow-xl flex justify-end pr-3">
                        <img src={BTN_MUL_IMG} alt="Moltiplicazione" className="w-[75%] h-auto" />
                    </button>
                    {/* DIVISION (Right) - Aligned Left to center */}
                    <button onClick={() => handleSelectOp('DIV')} className="hover:scale-105 active:scale-95 transition-transform drop-shadow-xl flex justify-start pl-3">
                        <img src={BTN_DIV_IMG} alt="Divisione" className="w-[75%] h-auto" />
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // --- GAME VIEW ---
  return (
    <div 
        className={wrapperStyle}
        style={{ backgroundImage: `url(${MATH_BG})` }}
    >
       <div className="w-full h-full flex flex-col items-center pt-4 pb-24 relative">
           
           {/* HEADER - REPLACED MENU BUTTON WITH EXIT BUTTON (Top Left) */}
           <div className="w-full max-w-xl flex justify-between items-center mb-4 px-4 z-10">
               <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform">
                   <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto drop-shadow-md" />
               </button>
               
               <img 
                   src={TITLE_IMG} 
                   alt="Matematica Magica" 
                   className="h-12 md:h-16 w-auto hidden sm:block"
                   style={{
                        filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 1px #000000)'
                   }}
               />

               <div className="w-12 hidden sm:block"></div>
           </div>

           {/* TOP RIGHT TOKEN COUNTER */}
           <div className="absolute top-4 right-4 z-50 pointer-events-none">
               <div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg">
                   <span>{currentTokens}</span> <span className="text-xl">🪙</span>
               </div>
           </div>

           {/* MAIN GAME BOX */}
           <div className="bg-white/40 backdrop-blur-md w-[95%] max-w-xl rounded-[40px] border-4 border-white/50 shadow-2xl overflow-hidden p-6 text-center relative flex flex-col items-center z-10 min-h-[300px] justify-center">
              
              {!gameOver ? (
                  <>
                    <h3 className="text-lg md:text-2xl font-black text-blue-900 mb-2 uppercase tracking-wide opacity-80 font-cartoon">
                        Qual è il risultato?
                    </h3>

                    <div className="mb-8 mt-2">
                        <div className="text-5xl md:text-7xl font-black text-blue-900 font-mono tracking-wider whitespace-nowrap drop-shadow-sm">
                        {question.text}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
                        {options.map((opt, idx) => (
                            <button
                            key={idx}
                            onClick={() => handleAnswer(opt)}
                            className="bg-white/80 hover:bg-white border-b-4 border-blue-300 active:border-b-0 active:translate-y-1 text-3xl md:text-4xl font-black text-blue-800 py-4 rounded-2xl transition-all shadow-md"
                            >
                            {opt}
                            </button>
                        ))}
                    </div>
                  </>
              ) : (
                  /* --- GAME OVER SCREEN --- */
                  <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in w-full">
                      
                      {score >= 30 ? (
                          // WIN / REWARD
                          <>
                            {/* REMOVED FLOATING TROPHY TO SAVE SPACE */}
                            <h3 className="text-3xl font-black text-green-700 mb-2">OTTIMO LAVORO!</h3>
                            <p className="text-gray-800 font-bold mb-4">Hai risposto a {score} domande.</p>
                            
                            <div className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xl border-4 border-white mb-6 shadow-md transform rotate-[-2deg]">
                                {score >= 100 ? '+15' : score >= 50 ? '+10' : '+5'} GETTONI! 🪙
                            </div>
                          </>
                      ) : (
                          // LOSE / NO REWARD
                          <>
                            <div className="text-6xl mb-2">😢</div>
                            <h3 className="text-3xl font-black text-gray-800 mb-2">PECCATO!</h3>
                            <p className="text-gray-700 font-bold mb-6 max-w-xs">
                                Hai totalizzato {score} punti.<br/>
                                Te ne servono <span className="text-red-600 bg-white/50 px-1 rounded">30</span> per vincere i gettoni.
                            </p>
                          </>
                      )}

                      {/* BUTTONS: RETRY & EXIT SIDE-BY-SIDE (ENLARGED) */}
                      <div className="flex justify-center gap-8 w-full mt-6">
                           <button 
                             onClick={restartGame}
                             className="hover:scale-110 active:scale-95 transition-transform"
                           >
                               <img src={BTN_RETRY_IMG} alt="Riprova" className="h-20 md:h-24 w-auto drop-shadow-2xl" />
                           </button>
                           <button 
                             onClick={onBack}
                             className="hover:scale-110 active:scale-95 transition-transform"
                           >
                               <img src={BTN_EXIT_GAME_IMG} alt="Esci" className="h-20 md:h-24 w-auto drop-shadow-2xl" />
                           </button>
                       </div>
                  </div>
              )}
              
              {/* FEEDBACK OVERLAYS */}
              {feedback === 'correct' && (
                 <div className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center text-white z-20 animate-in zoom-in duration-200 rounded-[35px]">
                    <CheckCircle size={80} className="mb-2 drop-shadow-md" />
                    <span className="text-4xl font-black drop-shadow-sm">ESATTO!</span>
                 </div>
              )}
              {feedback === 'wrong' && (
                 <div className="absolute inset-0 bg-red-500/90 flex flex-col items-center justify-center text-white z-20 animate-in shake duration-200 rounded-[35px]">
                    <XCircle size={80} className="mb-2 drop-shadow-md" />
                    <span className="text-4xl font-black drop-shadow-sm">SBAGLIATO!</span>
                    <span className="text-xl font-bold mt-2 opacity-90">{lives} vite rimaste</span>
                 </div>
              )}
           </div>

           {/* INFO HUD (BOTTOM CENTERED) - Raised position and style match */}
           <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[95%] max-w-xl z-50 pointer-events-none">
                <div className="bg-white/40 backdrop-blur-md p-3 rounded-[30px] border-4 border-white/50 shadow-xl flex items-center justify-between">
                    
                    {/* Left: Objectives */}
                    <div className="flex flex-col gap-1 text-xs md:text-sm font-black text-blue-900 pl-4 min-w-max">
                       <div className={`flex items-center gap-1 ${score >= 30 ? 'opacity-40' : ''}`}>
                           <span>30 Pti =</span> <span className="text-green-700">+5 🪙</span>
                       </div>
                       <div className={`flex items-center gap-1 ${score >= 50 ? 'opacity-40' : ''}`}>
                           <span>50 Pti =</span> <span className="text-green-700">+10 🪙</span>
                       </div>
                       <div className={`flex items-center gap-1 ${score >= 100 ? 'opacity-40' : ''}`}>
                           <span>100 Pti =</span> <span className="text-green-700">+15 🪙</span>
                       </div>
                    </div>

                    {/* Divider */}
                    <div className="w-0.5 h-12 bg-gray-400/30 rounded-full mx-2"></div>

                    {/* Middle: Lives (Horizontal with Label) */}
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">VITE</span>
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <Heart 
                                    key={i} 
                                    size={24} 
                                    className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-gray-200'} transition-colors drop-shadow-sm`} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-0.5 h-12 bg-gray-400/30 rounded-full mx-2"></div>

                    {/* Right: Level */}
                    <div className="flex flex-col items-center pr-4">
                        <span className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wide">LIVELLO</span>
                        <span className="text-3xl md:text-4xl font-black text-purple-600 leading-none drop-shadow-sm">{score}</span>
                    </div>
                </div>
           </div>

       </div>
    </div>
  );
};

export default MathGame;
