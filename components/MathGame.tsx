
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Star, RotateCcw, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { getProgress, addTokens } from '../services/tokens';
import { isNightTime } from '../services/weatherService';
import { TOKEN_ICON_URL } from '../constants';
import TokenIcon from './TokenIcon';

const MATH_BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/operamateredef55day.webp';
const MATH_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/opraatenight.webp';

const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/operads-(1)-(1).webp';

const BTN_ADD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/addizz+(1).webp';
const BTN_SUB_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sottrxsa+(1).webp';
const BTN_MUL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/moltopldfe+(1).webp';
const BTN_DIV_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/divifder+(1).webp';

const BTN_RETRY_IMG = 'https://i.postimg.cc/Y0S1fsNj/tasto-riprova-(1).png';
const BTN_EXIT_GAME_IMG = 'https://i.postimg.cc/X7mwdxpc/tasto-esci-(1).png';

// Asset per il feedback
const IMG_CORRECT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giustoiconerde.webp';
const IMG_WRONG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sbagliatoiconfhdhe.webp';
const SFX_CORRECT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/11l-victory_trumpet-1749704498589-358767.mp3';
const SFX_WRONG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartoon-fail-trumpet-278822.mp3';

type OperationType = 'ADD' | 'SUB' | 'MUL' | 'DIV';

interface MathGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

// Added export to MathGame to resolve the import error in PlayZone.tsx
export const MathGame: React.FC<MathGameProps> = ({ onBack, onEarnTokens }) => {
  const [now, setNow] = useState(new Date());
  const [selectedOp, setSelectedOp] = useState<OperationType | null>(null);
  const [question, setQuestion] = useState({ text: '', answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0); 
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [sessionTokens, setSessionTokens] = useState(0); 
  const [milestonesReached, setMilestonesReached] = useState<number[]>([]);
  const [currentTokens, setCurrentTokens] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [showRewardAnim, setShowRewardAnim] = useState<number | null>(null);

  const audioCorrect = useRef<HTMLAudioElement | null>(null);
  const audioWrong = useRef<HTMLAudioElement | null>(null);

  const currentBg = useMemo(() => isNightTime(now) ? MATH_BG_NIGHT : MATH_BG_DAY, [now]);

  const refreshTokens = useCallback(() => {
      const p = getProgress();
      setCurrentTokens(p ? p.tokens : 0);
  }, []);

  useEffect(() => {
      const timeTimer = setInterval(() => setNow(new Date()), 60000);
      refreshTokens();
      window.addEventListener('progressUpdated', refreshTokens);

      audioCorrect.current = new Audio(SFX_CORRECT);
      audioWrong.current = new Audio(SFX_WRONG);

      return () => {
          clearInterval(timeTimer);
          window.removeEventListener('progressUpdated', refreshTokens);
          audioCorrect.current?.pause();
          audioWrong.current?.pause();
      };
  }, [refreshTokens]);

  const generateQuestion = useCallback((clearFeedback = true) => {
    if (!selectedOp) return;
    let num1 = 0, num2 = 0, answer = 0, text = "";
    const rangeMultiplier = score > 30 ? 2 : 1;

    switch (selectedOp) {
        case 'ADD':
            num1 = Math.floor(Math.random() * (15 * rangeMultiplier)) + 1; 
            num2 = Math.floor(Math.random() * (10 * rangeMultiplier)) + 1; 
            answer = num1 + num2; text = `${num1} + ${num2} = ?`;
            break;
        case 'SUB':
            num1 = Math.floor(Math.random() * (15 * rangeMultiplier)) + 5; 
            num2 = Math.floor(Math.random() * num1);   
            answer = num1 - num2; text = `${num1} - ${num2} = ?`;
            break;
        case 'MUL':
            const maxFactor = score > 50 ? 12 : 9;
            num1 = Math.floor(Math.random() * maxFactor) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
            answer = num1 * num2; text = `${num1} × ${num2} = ?`;
            break;
        case 'DIV':
            answer = Math.floor(Math.random() * 9) + 1; 
            num2 = Math.floor(Math.random() * 8) + 2;   
            num1 = answer * num2; text = `${num1} : ${num2} = ?`;
            break;
    }

    const optionsSet = new Set<number>();
    optionsSet.add(answer);
    while (optionsSet.size < 3) {
        const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const candidate = answer + offset;
        if (candidate >= 0 && !optionsSet.has(candidate)) optionsSet.add(candidate);
    }
    const opts = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    setQuestion({ text, answer });
    setOptions(opts);
    if (clearFeedback) setFeedback(null);
    setIsLocked(false);
  }, [selectedOp, score]);

  useEffect(() => {
    if (selectedOp && !gameOver && !feedback) {
        generateQuestion();
    }
  }, [selectedOp, gameOver, generateQuestion]);

  const handleAnswer = (val: number) => {
    if (gameOver || isLocked) return;
    setIsLocked(true);

    if (val === question.answer) {
      const newScore = score + 1;
      setScore(newScore);
      setFeedback('correct');
      if (audioCorrect.current) {
          audioCorrect.current.currentTime = 0;
          audioCorrect.current.play().catch(() => {});
      }

      // --- LOGICA PREMI REAL-TIME ---
      let rewardToGrant = 0;
      if (newScore === 10 && !milestonesReached.includes(10)) {
          rewardToGrant = 5;
          setMilestonesReached(prev => [...prev, 10]);
      } else if (newScore === 30 && !milestonesReached.includes(30)) {
          rewardToGrant = 15; // +15 per arrivare a 20 totali (5+15)
          setMilestonesReached(prev => [...prev, 30]);
      } else if (newScore === 40 && !milestonesReached.includes(40)) {
          rewardToGrant = 30; // +30 per arrivare a 50 totali (20+30)
          setMilestonesReached(prev => [...prev, 40]);
      } else if (newScore > 40 && (newScore - 40) % 2 === 0) {
          rewardToGrant = 1;
      }

      if (rewardToGrant > 0) {
          addTokens(rewardToGrant);
          setSessionTokens(prev => prev + rewardToGrant);
          setShowRewardAnim(rewardToGrant);
          setTimeout(() => setShowRewardAnim(null), 1500);
      }

      setTimeout(() => { 
        setFeedback(null);
        generateQuestion(false); 
      }, 2000);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback('wrong');
      if (audioWrong.current) {
          audioWrong.current.currentTime = 0;
          audioWrong.current.play().catch(() => {});
      }
      
      if (newLives === 0) {
        setTimeout(() => setGameOver(true), 2000);
      } else {
        setTimeout(() => { 
          setFeedback(null);
          generateQuestion(false); 
        }, 2000);
      }
    }
  };

  const handleSelectOp = (op: OperationType) => {
      setScore(0); setLives(3); setGameOver(false); setSessionTokens(0); setMilestonesReached([]); setSelectedOp(op);
  };

  const restartGame = () => { if (selectedOp) handleSelectOp(selectedOp); };

  const textStrokeStyle = { WebkitTextStroke: '1.2px black' };

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none">
        <img src={currentBg} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" />
        
        {/* HUD SUPERIORE */}
        <div className="absolute top-[20px] left-4 right-4 z-[1300] flex justify-between items-center pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
                <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                    <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-10 md:h-12 w-auto" />
                </button>
                {selectedOp && (
                    <button onClick={() => setSelectedOp(null)} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                        <img src={BTN_BACK_MENU_IMG} alt="Menu" className="h-10 md:h-12 w-auto" />
                    </button>
                )}
            </div>

            <div className="pointer-events-auto">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                    <span>{currentTokens}</span> <TokenIcon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
            </div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-4 pt-44 md:pt-56">
            {!selectedOp ? (
                <div className="flex flex-col items-center w-full animate-fade-in">
                    <div className="bg-white/20 backdrop-blur-md px-8 py-5 rounded-[40px] border-4 border-white/40 shadow-2xl mb-10 animate-in slide-in-from-top-4 duration-500 max-w-xl">
                        <h2 className="font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[2px_2px_0_black] text-2xl md:text-4xl" style={textStrokeStyle}>
                            Allenati con la <span className="text-yellow-300">MATEMATICA MAGICA</span>!
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-[200px] md:max-w-sm w-full">
                        <button onClick={() => handleSelectOp('ADD')} className="hover:scale-105 active:scale-95 transition-transform"><img src={BTN_ADD_IMG} alt="Addizione" className="w-full h-auto drop-shadow-lg" /></button>
                        <button onClick={() => handleSelectOp('SUB')} className="hover:scale-105 active:scale-95 transition-transform"><img src={BTN_SUB_IMG} alt="Sottrazione" className="w-full h-auto drop-shadow-lg" /></button>
                        <button onClick={() => handleSelectOp('MUL')} className="hover:scale-105 active:scale-95 transition-transform"><img src={BTN_MUL_IMG} alt="Moltiplicazione" className="w-full h-auto drop-shadow-lg" /></button>
                        <button onClick={() => handleSelectOp('DIV')} className="hover:scale-105 active:scale-95 transition-transform"><img src={BTN_DIV_IMG} alt="Divisione" className="w-full h-auto drop-shadow-lg" /></button>
                    </div>
                </div>
            ) : !gameOver ? (
                <div className="w-full max-w-3xl flex flex-col items-center animate-in zoom-in duration-300">
                    {/* STATS HUD */}
                    <div className="flex justify-around w-full mt-4 mb-6 px-4 items-center bg-black/30 backdrop-blur-md rounded-2xl border-2 border-white/20 p-3 shadow-lg">
                        <div className="flex gap-1.5">
                            {[...Array(3)].map((_, i) => (
                                <Heart key={i} size={22} className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500 opacity-50'} transition-all`} />
                            ))}
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-white font-black text-[10px] uppercase opacity-70">Punti</span>
                            <span className="text-2xl font-black text-yellow-400 drop-shadow-sm leading-none">{score}</span>
                        </div>
                    </div>

                    {/* QUESTION AREA */}
                    <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border-8 border-blue-500 shadow-2xl text-center w-full relative mb-6">
                        {feedback === 'correct' && <img src={IMG_CORRECT} className="absolute -top-8 -right-8 w-20 md:w-28 animate-in zoom-in" alt="Giusto!" />}
                        {feedback === 'wrong' && <img src={IMG_WRONG} className="absolute -top-8 -right-8 w-20 md:w-28 animate-in zoom-in" alt="Sbagliato!" />}
                        
                        {showRewardAnim && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                                <div className="bg-yellow-400 text-black px-6 py-2 rounded-2xl font-black text-2xl border-4 border-black animate-bounce shadow-xl flex items-center gap-2">
                                    +{showRewardAnim} <TokenIcon className="w-8 h-8" />
                                </div>
                            </div>
                        )}

                        <h3 className="text-5xl md:text-8xl font-luckiest text-blue-900 uppercase tracking-tighter" style={textStrokeStyle}>
                            {question.text}
                        </h3>
                    </div>

                    {/* OPTIONS */}
                    <div className="grid grid-cols-3 gap-4 md:gap-6 w-full">
                        {options.map((opt, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => handleAnswer(opt)}
                                disabled={isLocked}
                                className={`
                                    bg-white hover:bg-blue-50 py-4 md:py-5 rounded-[1.5rem] border-b-8 border-blue-200 
                                    active:border-b-0 active:translate-y-2 transition-all shadow-xl
                                    font-luckiest text-3xl md:text-6xl text-blue-600
                                    ${isLocked && opt === question.answer && feedback === 'correct' ? 'bg-green-100 border-green-500 text-green-600 scale-105' : ''}
                                    ${isLocked && opt !== question.answer && feedback === 'wrong' ? 'bg-red-100 border-red-500 text-red-600 opacity-50' : ''}
                                `}
                                style={textStrokeStyle}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-8 md:p-12 rounded-[40px] border-8 border-yellow-400 shadow-2xl text-center max-w-md w-full animate-in zoom-in">
                    <img src={score >= 10 ? IMG_CORRECT : IMG_WRONG} alt="" className="h-40 md:h-56 mx-auto mb-6 object-contain" />
                    <h3 className="text-4xl font-black text-blue-900 mb-2 uppercase">GARA FINITA!</h3>
                    <p className="text-xl font-bold text-gray-600 mb-4">Punteggio: <span className="text-3xl text-blue-600 font-black">{score}</span></p>
                    
                    <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-200 mb-8">
                        <p className="text-yellow-800 font-black uppercase text-sm mb-1">Gettoni vinti in questa sessione</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-4xl font-black text-black">{sessionTokens}</span>
                            <TokenIcon className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button onClick={restartGame} className="flex-1 hover:scale-105 active:scale-95 transition-transform"><img src={BTN_RETRY_IMG} alt="Riprova" className="w-full h-auto drop-shadow-xl" /></button>
                        <button onClick={() => setSelectedOp(null)} className="flex-1 hover:scale-105 active:scale-95 transition-transform"><img src={BTN_EXIT_GAME_IMG} alt="Esci" className="w-full h-auto drop-shadow-xl" /></button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default MathGame;
