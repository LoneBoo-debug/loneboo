
import React, { useState } from 'react';
import { Dices, RefreshCw, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { generateDiceStory } from '../services/ai';

const ICONS = [
    '🏰', '🐉', '🚀', '🍕', '👻', '👑', '🌈', '🎸', '🐱', '🌊', 
    '🚗', '🎈', '🎁', '⏰', '🔑', '💎', '🍦', '🚲', '🤖', '🏠',
    '🗺️', '💡', '👣', '👀', '🕷️', '🦋', '🌙', '🔥', '📚', '⚽'
];

const StoryDice: React.FC = () => {
  const [dice, setDice] = useState<string[]>(['❓', '❓', '❓']);
  const [isRolling, setIsRolling] = useState(false);
  const [hasRolled, setHasRolled] = useState(false);
  
  // AI Story States
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setHasRolled(false);
    setGeneratedStory(null); // Reset story

    // Animation effect
    let counter = 0;
    const interval = setInterval(() => {
        setDice([
            ICONS[Math.floor(Math.random() * ICONS.length)],
            ICONS[Math.floor(Math.random() * ICONS.length)],
            ICONS[Math.floor(Math.random() * ICONS.length)]
        ]);
        counter++;
        if (counter > 10) {
            clearInterval(interval);
            setIsRolling(false);
            setHasRolled(true);
        }
    }, 100);
  };

  const handleGenerateStory = async () => {
      if (isGenerating) return;
      setIsGenerating(true);
      const story = await generateDiceStory(dice);
      setGeneratedStory(story);
      setIsGenerating(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in">
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-boo-green mb-2 drop-shadow-sm">
                Dadi delle Storie 🎲
            </h2>
            <p className="text-gray-600 font-bold text-lg">
                Lancia i dadi e inventa tu la storia... o chiedi a Lone Boo!
            </p>
        </div>

        {/* DICE CONTAINER */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {dice.map((icon, idx) => (
                <div 
                    key={idx}
                    className={`
                        w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_#10B981] 
                        flex items-center justify-center text-5xl md:text-6xl select-none transition-transform
                        ${isRolling ? 'animate-bounce' : 'hover:scale-105'}
                    `}
                >
                    {icon}
                </div>
            ))}
        </div>

        {/* CONTROLS */}
        <button 
            onClick={rollDice}
            disabled={isRolling}
            className={`
                flex items-center gap-3 bg-boo-orange text-white text-xl md:text-2xl font-black px-10 py-5 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] transition-all mb-12
                ${isRolling ? 'opacity-80 scale-95' : 'hover:scale-105 active:shadow-none active:translate-y-1'}
            `}
        >
            <Dices size={32} />
            {isRolling ? 'STO LANCIANDO...' : 'LANCIA I DADI!'}
        </button>

        {/* STORY PROMPT SECTION */}
        {hasRolled && (
            <div className="w-full max-w-2xl animate-in slide-in-from-bottom">
                
                {/* Manual Prompt */}
                <div className="bg-blue-50 p-6 rounded-[30px] border-4 border-blue-200 text-center mb-6">
                    <div className="flex justify-center mb-2">
                        <BookOpen size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-lg font-black text-gray-800 mb-1">Tocca a te!</h3>
                    <p className="text-gray-600 font-bold text-sm">
                        Riuscirai a collegare {dice[0]}, {dice[1]} e {dice[2]} in un'avventura?
                    </p>
                </div>

                {/* AI Generation Button */}
                {!generatedStory ? (
                    <div className="text-center">
                        <p className="text-gray-400 font-bold text-xs uppercase mb-2">Non hai idee?</p>
                        <button 
                            onClick={handleGenerateStory}
                            disabled={isGenerating}
                            className="inline-flex items-center gap-2 bg-boo-purple text-white font-black px-6 py-3 rounded-full border-4 border-black shadow-md active:scale-95 transition-all hover:bg-purple-600"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                            {isGenerating ? "Sto inventando..." : "Fammela raccontare da Lone Boo!"}
                        </button>
                    </div>
                ) : (
                    /* AI Story Result */
                    <div className="bg-white p-6 md:p-8 rounded-[30px] border-4 border-boo-purple shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500"></div>
                        
                        <div className="flex items-center gap-2 mb-4 text-boo-purple">
                            <Sparkles size={24} />
                            <span className="font-black text-lg">La Storia di Lone Boo:</span>
                        </div>
                        
                        <p className="text-xl md:text-2xl font-cartoon leading-relaxed text-gray-800">
                            "{generatedStory}"
                        </p>

                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={handleGenerateStory} 
                                className="text-sm font-bold text-gray-400 hover:text-boo-purple underline flex items-center gap-1"
                            >
                                <RefreshCw size={14} /> Ne voglio un'altra!
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

    </div>
  );
};

export default StoryDice;
