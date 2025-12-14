
import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const GuessNumberGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [target, setTarget] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('Indovina il numero tra 1 e 100!');
  const [attempts, setAttempts] = useState(0);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState<{val: number, hint: 'high'|'low'}[]>([]);

  const handleGuess = () => {
      const val = parseInt(guess);
      if (isNaN(val)) return;

      setAttempts(a => a + 1);
      
      if (val === target) {
          setWon(true);
          setMessage(`🎉 Bravissimo! Era proprio il ${target}!`);
      } else if (val < target) {
          setMessage('Troppo BASSO! 📈 Prova a salire.');
          setHistory(prev => [{val, hint: 'low'}, ...prev]);
      } else {
          setMessage('Troppo ALTO! 📉 Scendi un po\'.');
          setHistory(prev => [{val, hint: 'high'}, ...prev]);
      }
      setGuess('');
  };

  const resetGame = () => {
      setTarget(Math.floor(Math.random() * 100) + 1);
      setGuess('');
      setMessage('Indovina il numero tra 1 e 100!');
      setAttempts(0);
      setWon(false);
      setHistory([]);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-6 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>
          Indovina il Numero
      </h2>

      <div className="bg-white w-full rounded-[40px] border-4 border-orange-500 shadow-xl p-8 text-center">
         
         <div className="mb-6 h-16 flex items-center justify-center">
             <p className={`text-xl font-bold ${won ? 'text-green-500 text-2xl' : 'text-gray-700'}`}>
                 {message}
             </p>
         </div>

         {!won ? (
             <div className="flex gap-2 justify-center mb-8">
                 <input 
                    type="number" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="?"
                    className="w-24 h-16 text-center text-3xl font-black border-4 border-gray-300 rounded-2xl focus:border-orange-500 outline-none appearance-none m-0"
                    onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                 />
                 <button 
                    onClick={handleGuess}
                    className="bg-orange-500 text-white font-black px-6 rounded-2xl border-4 border-orange-600 active:scale-95 transition-transform"
                 >
                     PROVA
                 </button>
             </div>
         ) : (
             <button 
                onClick={resetGame}
                className="bg-green-500 text-white text-xl font-black px-8 py-4 rounded-full border-4 border-green-700 hover:scale-105 transition-transform mb-8"
             >
                 Gioca Ancora 🔄
             </button>
         )}

         {/* History */}
         {history.length > 0 && (
             <div className="mt-4 border-t-2 border-gray-100 pt-4">
                 <p className="text-gray-400 font-bold text-sm mb-2">Tentativi precedenti:</p>
                 <div className="flex flex-wrap justify-center gap-2">
                     {history.slice(0, 5).map((h, i) => (
                         <div key={i} className={`flex items-center gap-1 px-3 py-1 rounded-full text-white font-bold text-sm ${h.hint === 'low' ? 'bg-blue-400' : 'bg-red-400'}`}>
                             {h.val} {h.hint === 'low' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>}
                         </div>
                     ))}
                 </div>
             </div>
         )}
      </div>
    </div>
  );
};

export default GuessNumberGame;
