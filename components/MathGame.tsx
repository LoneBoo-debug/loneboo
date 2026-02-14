
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Star, RotateCcw, Heart, CircleCheck, CircleX } from 'lucide-react';
import { getProgress } from '../services/tokens';
import { isNightTime } from '../services/weatherService';

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

const MathGame: React.FC<MathGameProps> = ({ onBack, onEarnTokens }) => {
  const [now, setNow] = useState(new Date());
  const [selectedOp, setSelectedOp] = useState<OperationType | null>(null);
  const [question, setQuestion] = useState({ text: '', answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0); 
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [currentTokens, setCurrentTokens] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const audioCorrect = useRef<HTMLAudioElement | null>(null);
  const audioWrong = useRef<HTMLAudioElement | null>(null);

  // Background dinamico basato sull'orario richiesto (20:15 - 06:45)
  const currentBg = useMemo(() => isNightTime(now) ? MATH_BG_NIGHT : MATH_BG_DAY, [now]);

  useEffect(() => {
      const timeTimer = setInterval(() => setNow(new Date()), 60000);
      
      try {
          const p = getProgress();
          setCurrentTokens(p ? p.tokens : 0);
      } catch (e) { console.error(e); }

      // Inizializza audio
      audioCorrect.current = new Audio(SFX_CORRECT);
      audioWrong.current = new Audio(SFX_WRONG);

      return () => {
          clearInterval(timeTimer);
          audioCorrect.current?.pause();
          audioWrong.current?.pause();
      };
  }, []);

  useEffect(() => {
      if (rewardGiven) {
          try {
              const p = getProgress();
              setCurrentTokens(p ? p.tokens : 0);
          } catch (e) { console.error(e); }
      }
  }, [rewardGiven]);

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

  const endGame = useCallback(() => {
      setFeedback(null);
      setGameOver(true);
      let earned = 0;
      if (score >= 100) earned = 15; else if (score >= 50) earned = 10; else if (score >= 30) earned = 5;
      if (earned > 0 && onEarnTokens && !rewardGiven) {
          onEarnTokens(earned);
          setCurrentTokens(prev => prev + earned);
          setRewardGiven(true);
      }
  }, [score, onEarnTokens, rewardGiven]);

  const handleAnswer = (val: number) => {
    if (gameOver || isLocked) return;
    
    setIsLocked(true);

    if (val === question.answer) {
      setScore(s => s + 1);
      setFeedback('correct');
      if (audioCorrect.current) {
          audioCorrect.current.currentTime = 0;
          audioCorrect.current.play().catch(() => {});
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
        setTimeout(() => endGame(), 2000);
      } else {
        setTimeout(() => { 
          setFeedback(null);
          generateQuestion(false); 
        }, 2000);
      }
    }
  };

  const handleSelectOp = (op: OperationType) => {
      setScore(0); setLives(3); setGameOver(false); setRewardGiven(false); setSelectedOp(op);
  };

  const restartGame = () => { if (selectedOp) handleSelectOp(selectedOp); };

  const wrapperStyle = "fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  const opColorClass = selectedOp === 'ADD' ? 'text-red-600' :
                       selectedOp === 'SUB' ? 'text-blue-600' :
                       selectedOp === 'MUL' ? 'text-yellow-400' :
                       'text-green-600';

  const textStrokeStyle = { WebkitTextStroke: '1.2px black' };

  return (
    <div className={wrapperStyle}>
        <img src={currentBg} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" draggable={false} />

        {/* HUD FISSA: TASTO ESCI E SALDO GETTONI */}
        <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
            <div className="pointer-events-auto">
                <button onClick={selectedOp && !gameOver ? () => setSelectedOp(null) : onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                    <img 
                        src={selectedOp && !gameOver ? BTN_BACK_MENU_IMG : EXIT_BTN_IMG} 
                        alt="Indietro" 
                        className={selectedOp && !gameOver ? "h-14 md:h-20 w-auto" : "h-12 md:h-16 w-auto"} 
                    />
                </button>
            </div>

            <div className="pointer-events-auto">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                    <span>{currentTokens}</span> <span className="text-xl">🪙</span>
                </div>
            </div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-4 pt-52 md:pt-64">
            {!selectedOp ? (
                <div className="flex flex-col items-center w-full animate-fade-in px-4">
                    <div className="mb-8 md:mb-12 animate-in slide-in-from-bottom-4">
                        <p className="font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[2px_2px_0_black] text-xl md:text-3xl" style={{ WebkitTextStroke: '1.5px black' }}>
                            Scegli un'operazione e sfida i numeri!
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 items-center w-full max-w-[200px] md:max-w-[280px]">
                        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
                            <button onClick={() => handleSelectOp('ADD')} className="hover:scale-105 active:scale-95 transition-transform drop-shadow-2xl outline-none">
                                <img src={BTN_ADD_IMG} alt="Addizione" className="w-full h-auto" />
                            </button>
                            <button onClick={() => handleSelectOp('SUB')} className="hover:scale-105 active:scale-95 transition-transform drop-shadow-2xl outline-none">
                                <img src={BTN_SUB_IMG} alt="Sottrazione" className="w-full h-auto" />
                            </button>
                            <button onClick={() => handleSelectOp('MUL')} className="hover:scale-105 active:scale-95 transition-transform drop-shadow-2xl outline-none">
                                <img src={BTN_MUL_IMG} alt="Moltiplicazione" className="w-full h-auto" />
                            </button>
                            <button onClick={() => handleSelectOp('DIV')} className="hover:scale-105 active:scale-95 transition-transform drop-shadow-2xl outline-none">
                                <img src={BTN_DIV_IMG} alt="Divisione" className="w-full h-auto" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : !gameOver ? (
                <div className="w-full h-full flex flex-col items-center pt-0 px-4">
                    {/* Box Domanda - Rimosso overflow-hidden per far uscire le icone */}
                    <div className="bg-white/40 backdrop-blur-md w-full max-w-xl rounded-[40px] border-4 border-white/50 shadow-2xl p-4 md:p-6 text-center relative font-luckiest flex flex-col items-center min-h-[180px] md:min-h-[220px] justify-center">
                        <h3 className={`text-lg md:text-2xl font-black ${opColorClass} mb-1 uppercase tracking-wide`} style={textStrokeStyle}>Qual è il risultato?</h3>
                        <div className="mb-4 mt-1">
                            <div className={`text-5xl md:text-7xl font-black ${opColorClass} tracking-wider whitespace-nowrap drop-shadow-sm`} style={textStrokeStyle}>{question.text}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
                            {options.map((opt, idx) => (
                                <button key={idx} onClick={() => handleAnswer(opt)} disabled={isLocked} className={`bg-white/80 hover:bg-white border-b-4 border-black/10 active:border-b-0 active:translate-y-1 text-3xl md:text-4xl font-black ${opColorClass} py-3 md:py-4 rounded-2xl transition-all shadow-md ${isLocked ? 'opacity-50 grayscale' : ''}`} style={textStrokeStyle}>{opt}</button>
                            ))}
                        </div>
                        
                        {/* Overlay Feedback - Modificato per uscire dal box */}
                        {feedback === 'correct' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
                                <div className="animate-in zoom-in duration-300 scale-125 md:scale-150">
                                    <img src={IMG_CORRECT} alt="Corretto" className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
                                    <div className="bg-green-500 text-white px-4 py-1 rounded-full font-black text-xl md:text-2xl uppercase tracking-tighter border-2 border-white shadow-xl -mt-4 transform -rotate-3 text-center">ESATTO!</div>
                                </div>
                            </div>
                        )}
                        {feedback === 'wrong' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
                                <div className="animate-in zoom-in duration-300 scale-125 md:scale-150">
                                    <img src={IMG_WRONG} alt="Sbagliato" className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
                                    <div className="bg-red-500 text-white px-4 py-1 rounded-full font-black text-xl md:text-2xl uppercase tracking-tighter border-2 border-white shadow-xl -mt-4 transform rotate-3 text-center">OPS!</div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-4 w-full max-w-xl">
                        <div className="bg-white/40 backdrop-blur-md p-3 rounded-[30px] border-4 border-white/50 shadow-xl flex items-center justify-between">
                            <div className="flex flex-col gap-0.5 text-[10px] md:text-sm font-black text-blue-900 pl-4 min-w-max">
                                <div className={`flex items-center gap-1 ${score >= 30 ? 'opacity-40' : ''}`}><span>30 Pti =</span> <span className="text-green-700">+5 🪙</span></div>
                                <div className={`flex items-center gap-1 ${score >= 50 ? 'opacity-40' : ''}`}><span>50 Pti =</span> <span className="text-green-700">+10 🪙</span></div>
                                <div className={`flex items-center gap-1 ${score >= 100 ? 'opacity-40' : ''}`}><span>100 Pti =</span> <span className="text-green-700">+15 🪙</span></div>
                            </div>
                            <div className="w-0.5 h-10 md:h-12 bg-gray-400/30 rounded-full mx-2"></div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] md:text-xs font-bold text-gray-700 uppercase mb-1">VITE</span>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="transition-colors">
                                            <Star key={i} size={24} className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-gray-200'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="w-0.5 h-10 md:h-12 bg-gray-400/30 rounded-full mx-2"></div>
                            <div className="flex flex-col items-center pr-4">
                                <span className="text-[10px] md:text-xs font-bold text-gray-700 uppercase">PUNTEGGIO</span>
                                <span className="text-3xl md:text-4xl font-black text-purple-600 leading-none">{score}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 shadow-2xl text-center max-sm w-[90%] animate-in zoom-in flex flex-col items-center z-[100]">
                    <h3 className="text-3xl font-black text-red-600 mb-4 uppercase">Gioco Finito!</h3>
                    <p className="text-gray-700 font-bold mb-6 text-lg">Hai totalizzato {score} punti.</p>
                    {score >= 30 && <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse">+ {score >= 100 ? 15 : score >= 50 ? 10 : 5} GETTONI! 🪙</div>}
                    <div className="flex gap-4 w-full">
                        <button onClick={restartGame} className="flex-1 hover:scale-105 active:scale-95 transition-transform"><img src={BTN_RETRY_IMG} alt="Riprova" className="w-full h-auto" /></button>
                        <button onClick={() => setSelectedOp(null)} className="flex-1 hover:scale-105 active:scale-95 transition-transform"><img src={BTN_EXIT_GAME_IMG} alt="Menu" className="w-full h-auto" /></button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default MathGame;
