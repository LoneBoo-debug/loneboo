import React, { useState, useEffect, useMemo, useRef } from 'react';
/* Added Star to imports to fix the 'Cannot find name Star' error */
import { RefreshCw, Sparkles, Loader2, Star } from 'lucide-react';
import { generateDiceStory } from '../services/ai';
import { STORY_DICE_DATABASE, DiceItem } from '../services/dbdadi';

const TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dice-title.webp';
const ROLL_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-roll-dice.webp';
const GRUFO_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grufo.webp';

// --- COMPONENTE RULLO ---
interface DiceReelProps {
    finalItem: DiceItem | null;
    isRolling: boolean;
    duration: number;
}

const DiceReel: React.FC<DiceReelProps> = ({ finalItem, isRolling, duration }) => {
    const reelItems = useMemo(() => {
        const items = Array.from({ length: 29 }, () => 
            STORY_DICE_DATABASE[Math.floor(Math.random() * STORY_DICE_DATABASE.length)]
        );
        return finalItem ? [...items, finalItem] : items;
    }, [finalItem, isRolling]);

    return (
        <div className="w-[30%] aspect-square max-w-[176px] bg-white rounded-2xl md:rounded-[2.5rem] border-4 border-black shadow-[4px_4px_0px_0px_#10B981] overflow-hidden relative shrink-0">
            {!isRolling && finalItem ? (
                <img src={finalItem.url} alt="" className="w-full h-full object-cover animate-in fade-in duration-300" />
            ) : isRolling ? (
                <div 
                    className="absolute top-0 left-0 w-full flex flex-col"
                    style={{ animation: `slot-spin ${duration}s cubic-bezier(0.15, 0, 0.15, 1) forwards` }}
                >
                    {reelItems.map((item, idx) => (
                        <div key={idx} className="w-full aspect-square shrink-0">
                            <img src={item.url} className="w-full h-full object-cover" alt="" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="text-4xl md:text-6xl text-gray-200 font-black">?</span>
                </div>
            )}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_5px_15px_rgba(0,0,0,0.2)] bg-gradient-to-tr from-transparent via-white/5 to-transparent"></div>
        </div>
    );
};

// --- COMPONENTE PRINCIPALE ---
const StoryDice: React.FC = () => {
  const [finalItems, setFinalItems] = useState<(DiceItem | null)[]>([null, null, null]);
  const [isRolling, setIsRolling] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    setGeneratedStory(null); 
    
    const results = [
        STORY_DICE_DATABASE[Math.floor(Math.random() * STORY_DICE_DATABASE.length)],
        STORY_DICE_DATABASE[Math.floor(Math.random() * STORY_DICE_DATABASE.length)],
        STORY_DICE_DATABASE[Math.floor(Math.random() * STORY_DICE_DATABASE.length)]
    ];
    setFinalItems(results);

    setTimeout(() => {
        setIsRolling(false);
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }, 3200);
  };

  const handleGenerateStory = async () => {
      if (isGenerating || isRolling || !finalItems[0]) return;
      setIsGenerating(true);
      try {
          const story = await generateDiceStory(finalItems.map(d => d?.label || ""));
          setGeneratedStory(story);
      } catch (e) {
          setGeneratedStory("Grufo è un po' stanco, riprova tra un attimo! 🦉");
      } finally {
          setIsGenerating(false);
      }
  };

  const allStopped = !isRolling && finalItems[0] !== null;

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-4">
        <style>{`
            @keyframes slot-spin {
                0% { transform: translateY(0); filter: blur(0); }
                20% { filter: blur(2px); }
                80% { filter: blur(2px); }
                100% { transform: translateY(calc(-100% + 100% / 30)); filter: blur(0); }
            }
        `}</style>

        <div className="text-center mb-6 flex flex-col items-center">
            <img src={TITLE_IMG} alt="Dadi delle Storie" className="w-64 md:w-80 h-auto mb-4 drop-shadow-md" />
            <p className="text-white font-black text-lg md:text-2xl drop-shadow-[0_4px_8px_black] uppercase leading-tight px-4" style={{ textShadow: "3px 3px 0px black" }}>
                Lancia i dadi e prova a inventare una storia <br className="hidden md:block" /> con la tua immaginazione!
            </p>
        </div>

        {/* CONTAINER DADI - FISSO ORIZZONTALE E BEN ALLINEATO */}
        <div className="flex flex-row justify-center items-center gap-2 sm:gap-6 md:gap-8 mb-8 w-full max-w-2xl px-2">
            <DiceReel finalItem={finalItems[0]} isRolling={isRolling} duration={1.8} />
            <DiceReel finalItem={finalItems[1]} isRolling={isRolling} duration={2.4} />
            <DiceReel finalItem={finalItems[2]} isRolling={isRolling} duration={3.0} />
        </div>

        <button 
            onClick={rollDice}
            disabled={isRolling}
            className={`transition-all mb-10 outline-none shrink-0 ${isRolling ? 'opacity-50 grayscale scale-95' : 'hover:scale-105 active:scale-95'}`}
        >
            <img src={ROLL_BTN_IMG} alt="Lancia i dadi" className="w-56 md:w-80 h-auto drop-shadow-2xl" />
        </button>

        {/* PUNTO DI ANCORAGGIO PER LO SCROLL */}
        <div ref={scrollRef} className="w-full flex flex-col items-center pt-2">
            {allStopped && (
                <div className="w-full max-w-2xl flex flex-col items-center pb-20 animate-in slide-in-from-bottom">
                    <div className="text-center mb-6 flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-black uppercase text-yellow-400 mb-2" style={{ WebkitTextStroke: '2px black', textShadow: '3px 3px 0px black' }}>Tocca a te!</h3>
                        <div className="bg-black/40 backdrop-blur-sm px-6 py-2 rounded-2xl border-2 border-white/10 shadow-lg">
                            <p className="text-yellow-400 font-bold text-lg drop-shadow-md">Usa i dadi o chiedi aiuto a Grufo...</p>
                        </div>
                    </div>

                    {!generatedStory || isGenerating ? (
                        <div className="text-center flex flex-col items-center">
                            {isGenerating && (
                                <p className="text-red-500 font-black text-xl md:text-2xl uppercase mb-3 drop-shadow-md">
                                    Mmmh... fatemi pensare...
                                </p>
                            )}
                            <button 
                                onClick={handleGenerateStory} 
                                disabled={isGenerating}
                                className={`transition-all outline-none relative ${isGenerating ? 'opacity-70 scale-95' : 'hover:scale-105 active:scale-95'}`}
                            >
                                {isGenerating && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <Loader2 className="animate-spin text-white" size={48} strokeWidth={4} />
                                    </div>
                                )}
                                <img src={GRUFO_BTN_IMG} alt="Chiedi a Grufo" className={`w-64 md:w-80 h-auto drop-shadow-xl ${isGenerating ? 'blur-sm' : ''}`} />
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white/95 p-6 md:p-10 rounded-[40px] border-4 border-boo-purple shadow-2xl relative w-full overflow-hidden animate-in zoom-in">
                            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"></div>
                            <div className="flex items-center gap-2 mb-4 text-boo-purple">
                                <Star size={28} className="animate-pulse" fill="currentColor" />
                                <span className="font-black text-xl uppercase">La Storia di Grufo:</span>
                            </div>
                            <p className={`text-xl md:text-2xl font-bold leading-relaxed text-gray-800 italic ${isGenerating ? 'blur-sm opacity-50' : 'blur-0 opacity-100'} transition-all`}>
                                "{generatedStory}"
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center border-t-2 border-gray-100 pt-6 gap-4">
                                <span className="text-xs font-bold text-gray-400 uppercase">Generata da Grufo il Saggio ✨</span>
                                <button 
                                    onClick={handleGenerateStory} 
                                    disabled={isGenerating}
                                    className="bg-boo-purple text-white font-black py-3 px-6 rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {isGenerating ? (<><Loader2 size={20} className="animate-spin" /> Sto pensando...</>) : (<><RefreshCw size={20} /> Ne voglio un'altra!</>)}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default StoryDice;