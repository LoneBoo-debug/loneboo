
import React, { useState, useEffect } from 'react';
import { Star, RotateCcw, ArrowLeft, Plus, Minus, X as MulIcon, Divide, Trophy, LogOut } from 'lucide-react';
import { CHANNEL_LOGO } from '../constants';

type OperationType = 'ADD' | 'SUB' | 'MUL' | 'DIV';

// Define Prizes/Milestones
const PRIZES = [
  { score: 30, emoji: '🍬', name: 'Dolcetto', color: 'bg-pink-100 border-pink-400 text-pink-600' },
  { score: 60, emoji: '🥉', name: 'Medaglia Bronzo', color: 'bg-orange-100 border-orange-400 text-orange-700' },
  { score: 100, emoji: '🥈', name: 'Medaglia Argento', color: 'bg-gray-100 border-gray-400 text-gray-700' },
  { score: 150, emoji: '🥇', name: 'Medaglia Oro', color: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
  { score: 200, emoji: '🏆', name: 'Coppa Campione', color: 'bg-purple-100 border-purple-400 text-purple-700' },
];

const MathGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedOp, setSelectedOp] = useState<OperationType | null>(null);
  
  const [question, setQuestion] = useState({ text: '', answer: 0 });
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Rewards State
  const [unlockedPrizes, setUnlockedPrizes] = useState<typeof PRIZES>([]);
  const [showPrizeModal, setShowPrizeModal] = useState<typeof PRIZES[0] | null>(null);
  const [gameWon, setGameWon] = useState(false);

  // Difficulty ranges for 6-8 years old
  const generateQuestion = () => {
    if (!selectedOp) return;

    let num1 = 0;
    let num2 = 0;
    let answer = 0;
    let text = "";

    switch (selectedOp) {
        case 'ADD':
            // Sum up to 20-30
            num1 = Math.floor(Math.random() * 15) + 1; // 1-15
            num2 = Math.floor(Math.random() * 10) + 1; // 1-10
            answer = num1 + num2;
            text = `${num1} + ${num2} = ?`;
            break;

        case 'SUB':
            // Result never negative. Max number ~20
            num1 = Math.floor(Math.random() * 15) + 5; // 5-20
            num2 = Math.floor(Math.random() * num1);   // 0 to num1
            answer = num1 - num2;
            text = `${num1} - ${num2} = ?`;
            break;

        case 'MUL':
            // Times tables 1-9
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
            answer = num1 * num2;
            text = `${num1} × ${num2} = ?`;
            break;

        case 'DIV':
            // Clean division (no remainder). 
            // We generate the answer first, then multiply to get the dividend.
            answer = Math.floor(Math.random() * 9) + 1; // Answer 1-9
            num2 = Math.floor(Math.random() * 8) + 2;   // Divisor 2-9
            num1 = answer * num2;                       // Dividend
            text = `${num1} : ${num2} = ?`;
            break;
    }

    // Generate Unique Options using a Set
    const optionsSet = new Set<number>();
    optionsSet.add(answer); // Add correct answer first

    while (optionsSet.size < 3) {
        // Generate a variation nearby
        // Random offset between -5 and +5 (excluding 0)
        const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const candidate = answer + offset;

        // Ensure distinct non-negative candidates
        if (candidate >= 0 && !optionsSet.has(candidate)) {
            optionsSet.add(candidate);
        }
    }
    
    // Convert to array and shuffle
    const opts = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    
    setQuestion({ text, answer });
    setOptions(opts);
    setFeedback(null);
  };

  // Generate first question when operation is selected
  useEffect(() => {
    if (selectedOp) {
        generateQuestion();
    }
  }, [selectedOp]);

  const handleAnswer = (val: number) => {
    if (val === question.answer) {
      // CORRECT ANSWER
      const newScore = score + 10;
      setScore(newScore);
      setStreak(s => s + 1);
      setFeedback('correct');

      // Check for Prizes
      const prize = PRIZES.find(p => p.score === newScore);
      if (prize && !unlockedPrizes.some(p => p.name === prize.name)) {
          setUnlockedPrizes(prev => [...prev, prize]);
          setShowPrizeModal(prize);
      }

      // Check Win Condition (200 points)
      if (newScore >= 200) {
          setGameWon(true);
      } else {
          setTimeout(generateQuestion, 800);
      }
    } else {
      // WRONG ANSWER
      // Decrease score by 1 (min 0) instead of reset
      setScore(prev => Math.max(0, prev - 1));
      setStreak(0); // Reset streak fire only
      setFeedback('wrong');
    }
  };

  const handleSelectOp = (op: OperationType) => {
      setScore(0);
      setStreak(0);
      setUnlockedPrizes([]);
      setShowPrizeModal(null);
      setGameWon(false);
      setSelectedOp(op);
  };

  const closePrizeModal = () => {
      setShowPrizeModal(null);
  };
  
  const restartGame = () => {
      handleSelectOp(selectedOp!);
  };

  // --- MENU VIEW ---
  if (!selectedOp) {
      return (
        <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in text-center">
            <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-2 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>
                Matematica Magica
            </h2>
            <p className="text-lg font-bold text-white/90 mb-8">Scegli l'operazione!</p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <button 
                    onClick={() => handleSelectOp('ADD')}
                    className="flex flex-col items-center justify-center gap-2 bg-blue-500 text-white p-6 rounded-[30px] border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                >
                    <Plus size={48} strokeWidth={4} />
                    <span className="font-black text-xl">ADDIZIONE</span>
                </button>

                <button 
                    onClick={() => handleSelectOp('SUB')}
                    className="flex flex-col items-center justify-center gap-2 bg-orange-500 text-white p-6 rounded-[30px] border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                >
                    <Minus size={48} strokeWidth={4} />
                    <span className="font-black text-xl">SOTTRAZIONE</span>
                </button>

                <button 
                    onClick={() => handleSelectOp('MUL')}
                    className="flex flex-col items-center justify-center gap-2 bg-purple-500 text-white p-6 rounded-[30px] border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                >
                    <MulIcon size={48} strokeWidth={4} />
                    <span className="font-black text-xl">MOLTIPLICA</span>
                </button>

                <button 
                    onClick={() => handleSelectOp('DIV')}
                    className="flex flex-col items-center justify-center gap-2 bg-pink-500 text-white p-6 rounded-[30px] border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                >
                    <Divide size={48} strokeWidth={4} />
                    <span className="font-black text-xl">DIVISIONE</span>
                </button>
            </div>
        </div>
      );
  }

  // --- GAME VIEW ---
  return (
    <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in relative">
       
       <div className="w-full flex justify-between items-center mb-4">
           <button 
             onClick={() => setSelectedOp(null)}
             className="flex items-center gap-1 bg-white/20 hover:bg-white/40 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm transition-colors"
           >
               <ArrowLeft size={16} /> Cambia
           </button>
           <h2 className="text-3xl md:text-5xl font-black text-boo-orange drop-shadow-[2px_2px_0_black]" style={{ textShadow: "3px 3px 0px black" }}>
               {selectedOp === 'ADD' && 'Addizione'}
               {selectedOp === 'SUB' && 'Sottrazione'}
               {selectedOp === 'MUL' && 'Moltiplicazione'}
               {selectedOp === 'DIV' && 'Divisione'}
           </h2>
           <div className="w-20"></div> {/* Spacer for centering */}
       </div>

       <div className="bg-white w-full rounded-[40px] border-4 border-blue-500 shadow-xl overflow-hidden p-8 text-center relative">
          
          <div className="absolute top-4 right-6 flex items-center gap-1 font-bold text-yellow-500 text-xl">
            <Star fill="currentColor" /> {score}
          </div>

          <div className="mb-8 overflow-hidden">
            <div className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Risolvi</div>
            {/* Added whitespace-nowrap and responsive text sizing to keep it on one line */}
            <div className="text-4xl md:text-6xl font-black text-blue-600 font-mono tracking-wider whitespace-nowrap">
               {question.text}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             {options.map((opt, idx) => (
                <button
                   key={idx}
                   onClick={() => handleAnswer(opt)}
                   className="bg-blue-50 hover:bg-blue-100 border-b-4 border-blue-200 active:border-b-0 active:translate-y-1 text-3xl md:text-4xl font-black text-blue-800 py-4 md:py-6 rounded-2xl transition-all"
                >
                   {opt}
                </button>
             ))}
          </div>
          
          {feedback === 'correct' && (
             <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center text-white text-5xl font-black animate-in zoom-in duration-200 z-10">
                BRAVO! 🎉
             </div>
          )}
          {feedback === 'wrong' && (
             <div className="absolute inset-0 bg-red-500/95 flex flex-col items-center justify-center text-white animate-in shake duration-200 z-10 p-4">
                <div className="text-6xl font-black mb-8 drop-shadow-md">NO! 😱</div>
                <button 
                    onClick={() => setFeedback(null)}
                    className="flex items-center gap-3 bg-white text-red-600 text-xl md:text-2xl font-black px-8 py-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all group"
                >
                    <RotateCcw size={32} className="text-boo-yellow fill-boo-yellow stroke-black stroke-[3px]" />
                    RIPROVA
                </button>
             </div>
          )}
       </div>
       
       {/* BOTTOM STATS & PRIZE CASE */}
       <div className="mt-6 w-full">
           <div className="flex justify-between items-center text-white/80 font-bold mb-2 px-2">
                <span>Streak: {streak} 🔥</span>
                <span className="flex items-center gap-1"><Trophy size={16}/> {unlockedPrizes.length} Premi</span>
           </div>

           {/* Prize Case */}
           <div className="bg-black/20 rounded-2xl p-3 flex gap-2 overflow-x-auto min-h-[60px] items-center">
               {unlockedPrizes.length === 0 ? (
                   <p className="text-white/40 text-sm font-bold w-full text-center">Raggiungi 30 punti per il primo premio!</p>
               ) : (
                   unlockedPrizes.map((prize, i) => (
                       <div key={i} className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md border-2 border-white/50 animate-in zoom-in" title={prize.name}>
                           {prize.emoji}
                       </div>
                   ))
               )}
           </div>
       </div>

       {/* PRIZE MODAL */}
       {showPrizeModal && (
           <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
               {/* Modal Fixed (removed animate-bounce) */}
               <div className="bg-white rounded-[40px] border-4 border-yellow-400 p-8 text-center shadow-2xl animate-in zoom-in duration-300 transform-none">
                   <div className="text-8xl mb-4">{showPrizeModal.emoji}</div>
                   <h2 className="text-3xl font-black text-boo-purple mb-2">NUOVO PREMIO!</h2>
                   <div className={`inline-block px-4 py-1 rounded-full font-black border-2 text-lg mb-6 ${showPrizeModal.color}`}>
                       {showPrizeModal.name}
                   </div>
                   <button 
                     onClick={closePrizeModal}
                     className="block w-full bg-boo-green text-white font-black text-lg py-3 px-6 rounded-2xl border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 transition-all uppercase"
                   >
                       COLLEZIONA IL PREMIO 📥
                   </button>
               </div>
           </div>
       )}

       {/* GAME WON (SURRENDER) MODAL - Shows after collecting the last prize (200 pts) */}
       {gameWon && !showPrizeModal && (
           <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
               <div className="bg-white rounded-[40px] border-8 border-boo-purple p-8 text-center shadow-2xl max-w-sm w-full animate-in zoom-in">
                    
                   {/* Logo / Ghost */}
                   <div className="flex justify-center mb-6">
                        <img src={CHANNEL_LOGO} alt="Lone Boo" className="w-32 h-32 object-contain drop-shadow-lg" />
                   </div>

                   <h2 className="text-3xl font-black text-gray-800 mb-4 leading-tight">
                       Mi arrendo! 👻🏳️
                   </h2>
                   
                   <p className="text-xl font-bold text-gray-600 mb-8 leading-relaxed">
                       Sei troppo bravo per me...<br/>
                       Hai vinto tutti i premi!
                   </p>

                   <div className="flex flex-col gap-3">
                       <button 
                         onClick={restartGame}
                         className="block w-full bg-boo-yellow text-black font-black text-xl py-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 transition-all"
                       >
                           GIOCA ANCORA 🔄
                       </button>
                       <button 
                         onClick={onBack}
                         className="block w-full bg-red-500 text-white font-black text-xl py-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                       >
                           <LogOut size={20} /> ESCI
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default MathGame;
