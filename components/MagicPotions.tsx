
import React, { useState } from 'react';
import { FlaskConical, RotateCcw, Sparkles } from 'lucide-react';

const COLORS = [
  { id: 'red', name: 'Rosso Fuoco', hex: '#EF4444', text: 'text-red-500' },
  { id: 'blue', name: 'Blu Oceano', hex: '#3B82F6', text: 'text-blue-500' },
  { id: 'yellow', name: 'Giallo Sole', hex: '#EAB308', text: 'text-yellow-500' },
];

const RECIPES: Record<string, { name: string, effect: string, color: string, icon: string }> = {
  'red-blue': { name: 'Pozione dell\'Invisibilità', effect: 'Ora nessuno può vederti... tranne i gatti!', color: 'bg-purple-600', icon: '👻' },
  'red-yellow': { name: 'Pozione Super Forza', effect: 'Puoi sollevare un elefante con un dito!', color: 'bg-orange-500', icon: '💪' },
  'blue-yellow': { name: 'Pozione Saltellante', effect: 'I tuoi piedi sono diventati delle molle!', color: 'bg-green-500', icon: '🐸' },
  'red-red': { name: 'Pozione Piccante', effect: 'Sputi fuoco come un draghetto!', color: 'bg-red-600', icon: '🐲' },
  'blue-blue': { name: 'Pozione Ghiacciata', effect: 'Brrr... hai trasformato tutto in un ghiacciolo!', color: 'bg-cyan-400', icon: '❄️' },
  'yellow-yellow': { name: 'Pozione Luminosa', effect: 'Brilli al buio come una lucciola!', color: 'bg-yellow-300', icon: '💡' },
};

const MagicPotions: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const addIngredient = (colorId: string) => {
    if (selected.length < 2) {
      const newSelected = [...selected, colorId];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        // Mix!
        const key = newSelected.sort().join('-');
        setTimeout(() => {
            setResult(RECIPES[key]);
        }, 500);
      }
    }
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in py-4">
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-purple-600 mb-2 drop-shadow-sm">
                Laboratorio di Pozioni 🧪
            </h2>
            <p className="text-gray-600 font-bold text-lg">
                Mescola due ingredienti nel calderone e guarda cosa succede!
            </p>
        </div>

        {/* INGREDIENTS SHELF */}
        <div className="flex justify-center gap-4 md:gap-8 mb-8 bg-amber-900/10 p-4 rounded-3xl border-b-8 border-amber-900/20 w-full max-w-lg">
            {COLORS.map((c) => (
                <button
                    key={c.id}
                    onClick={() => addIngredient(c.id)}
                    disabled={selected.length >= 2}
                    className={`
                        flex flex-col items-center transition-transform active:scale-95
                        ${selected.length >= 2 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-2'}
                    `}
                >
                    <div className={`w-16 h-24 md:w-20 md:h-32 rounded-b-2xl rounded-t-lg border-4 border-black/20 shadow-lg relative overflow-hidden flex items-end justify-center pb-2`} style={{ backgroundColor: c.hex }}>
                         <div className="absolute top-2 left-2 w-2 h-8 bg-white/30 rounded-full"></div>
                         <FlaskConical className="text-white/50 w-8 h-8" />
                    </div>
                    <span className={`font-black mt-2 text-sm md:text-base ${c.text}`}>{c.name}</span>
                </button>
            ))}
        </div>

        {/* CAULDRON AREA */}
        <div className="relative w-full max-w-md flex flex-col items-center">
            
            {/* The Cauldron */}
            <div className="relative w-48 h-40 md:w-64 md:h-48 bg-gray-800 rounded-b-[4rem] rounded-t-lg border-x-8 border-b-8 border-gray-900 shadow-2xl flex items-center justify-center overflow-visible">
                {/* Rim */}
                <div className="absolute -top-4 w-[110%] h-8 bg-gray-700 rounded-full border-4 border-gray-900"></div>
                
                {/* Liquid / Result */}
                <div className={`
                    w-[80%] h-[60%] rounded-b-[3rem] transition-colors duration-1000 flex items-center justify-center relative
                    ${result ? result.color : 'bg-gray-700'}
                `}>
                    {/* Bubbles Animation */}
                    <div className="absolute -top-10 w-full flex justify-center gap-4">
                        {selected.length > 0 && <div className="w-4 h-4 rounded-full bg-white/50 animate-bounce delay-100"></div>}
                        {result && <div className="w-6 h-6 rounded-full bg-white/50 animate-bounce delay-300"></div>}
                        {selected.length > 1 && <div className="w-3 h-3 rounded-full bg-white/50 animate-bounce delay-700"></div>}
                    </div>

                    {result ? (
                         <span className="text-6xl animate-in zoom-in spin-in-12 duration-500 drop-shadow-lg">{result.icon}</span>
                    ) : (
                         <span className="text-gray-500 font-bold opacity-50">?</span>
                    )}
                </div>
            </div>

            {/* RESULT CARD */}
            {result && (
                <div className="mt-8 bg-white p-6 rounded-[30px] border-4 border-purple-500 shadow-xl text-center w-full animate-in slide-in-from-bottom">
                    <h3 className="text-2xl font-black text-purple-600 mb-2">{result.name}</h3>
                    <p className="text-gray-700 font-bold text-lg mb-4">"{result.effect}"</p>
                    <button 
                        onClick={reset}
                        className="flex items-center justify-center gap-2 bg-yellow-400 text-black font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 active:shadow-none active:translate-y-1 shadow-[4px_4px_0_black] mx-auto"
                    >
                        <RotateCcw size={20} /> ALTRA POZIONE
                    </button>
                </div>
            )}

            {selected.length > 0 && !result && (
                 <div className="mt-8">
                     <p className="text-gray-400 font-bold animate-pulse">Mescola...</p>
                 </div>
            )}

        </div>
    </div>
  );
};

export default MagicPotions;
