
import React, { useState, useEffect } from 'react';
import { RotateCcw, CircleHelp, LogOut } from 'lucide-react';

const COLORS = [
  { name: 'ROSSO', hex: '#EF4444' }, // red-500
  { name: 'BLU', hex: '#3B82F6' },   // blue-500
  { name: 'VERDE', hex: '#10B981' }, // emerald-500
  { name: 'GIALLO', hex: '#F59E0B' }, // amber-500
  { name: 'VIOLA', hex: '#8B5CF6' }  // violet-500
];

const GAME_DURATION = 20;

const ColorMatchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [targetText, setTargetText] = useState(COLORS[0]);
  const [targetColor, setTargetColor] = useState(COLORS[1]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const newRound = () => {
    const randomText = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetText(randomText);
    setTargetColor(randomColor);
  };

  const handleChoice = (colorHex: string) => {
    if (!isPlaying) return;
    
    // The player must match the INK COLOR, not the word text
    if (colorHex === targetColor.hex) {
      setScore(s => s + 1);
      newRound();
    } else {
      setScore(s => Math.max(0, s - 1)); // Penalty
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsPlaying(true);
    newRound();
  };

  // --- RENDER GAME OVER CONTENT BASED ON SCORE ---
  const renderGameOver = () => {
      if (score >= 12) {
          // HIGH SCORE
          return (
              <div className="animate-in zoom-in duration-300">
                  <div className="text-6xl mb-4 animate-bounce">🏆</div>
                  <h2 className="text-4xl font-black text-green-600 mb-2 drop-shadow-sm">
                      CONGRATULAZIONI!
                  </h2>
                  <p className="text-xl font-bold text-gray-700 mb-6">
                      Sei stato bravissimo!
                  </p>
                  <div className="bg-green-100 text-green-800 font-black text-3xl py-3 px-8 rounded-2xl border-2 border-green-300 mb-8 inline-block">
                      {score} Punti
                  </div>
                  <div className="flex flex-col gap-3 max-w-[200px] mx-auto">
                    <button 
                        onClick={startGame}
                        className="bg-boo-yellow text-black font-black text-xl px-8 py-3 rounded-full border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1"
                    >
                        Gioca Ancora
                    </button>
                    <button 
                        onClick={onBack}
                        className="bg-red-500 text-white font-black text-xl px-8 py-3 rounded-full border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} /> Esci
                    </button>
                  </div>
              </div>
          );
      } else if (score > 0) {
          // MID SCORE - SHOW RULES
          return (
              <div className="animate-in zoom-in duration-300">
                  <div className="text-6xl mb-4">🤔</div>
                  <h2 className="text-3xl font-black text-boo-orange mb-4 drop-shadow-sm">
                      Impegnati di più!
                  </h2>
                  
                  <div className="bg-blue-50 p-4 rounded-2xl border-l-4 border-blue-500 text-left mb-6 max-w-xs mx-auto">
                      <p className="font-black text-blue-900 flex items-center gap-2 mb-1">
                          <CircleHelp size={20} /> RICORDA LA REGOLA:
                      </p>
                      <p className="text-blue-800 text-sm font-bold leading-snug">
                          Devi premere il bottone del <span className="underline">COLORE</span> della scritta, non leggere la parola!
                      </p>
                  </div>

                  <div className="text-2xl font-black text-gray-400 mb-8">
                      Punteggio: {score}
                  </div>

                  <div className="flex flex-col gap-3 max-w-[200px] mx-auto">
                    <button 
                        onClick={startGame}
                        className="flex items-center justify-center gap-2 w-full bg-white text-red-600 text-xl font-black px-6 py-3 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                    >
                        <RotateCcw size={24} /> RIPROVA
                    </button>
                    <button 
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 w-full bg-red-500 text-white text-xl font-black px-6 py-3 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                    >
                        <LogOut size={20} /> ESCI
                    </button>
                  </div>
              </div>
          );
      } else {
          // ZERO SCORE
          return (
              <div className="animate-in zoom-in duration-300">
                  <div className="text-6xl mb-4">😴</div>
                  <h2 className="text-4xl font-black text-red-500 mb-2 drop-shadow-sm">
                      Impegnati di più!
                  </h2>
                  <p className="text-lg font-bold text-gray-500 mb-8">
                      Non hai fatto punti. Sveglia!
                  </p>
                  
                  <div className="flex flex-col gap-3 max-w-[200px] mx-auto">
                    <button 
                        onClick={startGame}
                        className="flex items-center justify-center gap-2 w-full bg-white text-red-600 text-xl font-black px-6 py-3 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                    >
                        <RotateCcw size={24} /> RIPROVA
                    </button>
                    <button 
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 w-full bg-red-500 text-white text-xl font-black px-6 py-3 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 active:shadow-none active:translate-y-1 transition-all"
                    >
                        <LogOut size={20} /> ESCI
                    </button>
                  </div>
              </div>
          );
      }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in text-center">
      <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-6 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>
          Caos Colori
      </h2>
      
      <div className="bg-white w-full rounded-[40px] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] min-h-[400px] flex flex-col justify-center">
        
        {!isPlaying ? (
           <>
               {timeLeft === 0 ? (
                   renderGameOver()
               ) : (
                   // START SCREEN
                   <div className="py-4">
                       <p className="text-gray-600 text-lg font-bold mb-8 leading-relaxed">
                           Regola: Clicca il bottone che corrisponde al <br/>
                           <span className="text-pink-500 font-black bg-pink-100 px-2 rounded">COLORE DELLA SCRITTA</span><br/>
                           (non a quello che leggi!)
                       </p>
                       <button 
                          onClick={startGame}
                          className="bg-boo-green text-white text-2xl font-black px-10 py-4 rounded-full border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1"
                       >
                          INIZIA
                       </button>
                   </div>
               )}
           </>
        ) : (
           <>
              <div className="flex justify-between mb-8 font-black text-xl text-gray-400">
                  <div className={`px-3 py-1 rounded-lg border-2 ${timeLeft <= 5 ? 'bg-red-100 text-red-500 border-red-200 animate-pulse' : 'bg-gray-100 border-gray-200'}`}>
                      ⏱️ {timeLeft}s
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-lg border-2 border-gray-200">
                      ⭐ {score}
                  </div>
              </div>
              
              <div className="mb-12">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Premi il colore:</p>
                  <h1 
                    className="text-6xl md:text-7xl font-black drop-shadow-sm transition-colors duration-200"
                    style={{ color: targetColor.hex }}
                  >
                      {targetText.name}
                  </h1>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                  {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => handleChoice(c.hex)}
                        className="w-16 h-16 rounded-full border-4 border-black/10 shadow-lg transform active:scale-90 transition-transform"
                        style={{ backgroundColor: c.hex }}
                        aria-label={c.name}
                      />
                  ))}
              </div>
           </>
        )}
      </div>
    </div>
  );
};

export default ColorMatchGame;
