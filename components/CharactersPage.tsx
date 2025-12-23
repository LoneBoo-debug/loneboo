
import React, { useEffect, useState } from 'react';
import { Sparkles, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { AppView } from '../types';
import { CHARACTERS } from '../services/databaseAmici';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';

const INFO_BG = 'https://i.postimg.cc/WpkmSWf3/sfondamici.jpg';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

interface CharactersPageProps {
    setView: (view: AppView) => void;
}

const CharactersPage: React.FC<CharactersPageProps> = ({ setView }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.currentTarget;
      const currentSrc = target.getAttribute('src') || '';
      const originalUrl = Object.keys(LOCAL_ASSET_MAP).find(key => LOCAL_ASSET_MAP[key] === currentSrc || (currentSrc.startsWith(window.location.origin) && currentSrc.endsWith(LOCAL_ASSET_MAP[key])));
      
      if (originalUrl && currentSrc !== originalUrl) {
          target.src = originalUrl;
      }
  };

  const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-fixed pb-24"
        style={{ backgroundImage: `url(${INFO_BG})` }}
    >
      
      {/* TASTO CHIUDI FISSO - Ingrandito leggermente */}
      <button 
          onClick={() => setView(AppView.BOO_LIVING_ROOM)}
          className="fixed top-20 right-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
          aria-label="Indietro"
      >
          <img 
            src={BTN_CLOSE_IMG} 
            alt="Chiudi" 
            className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl" 
          />
      </button>

      <div className="max-w-6xl mx-auto p-3 md:p-8 pt-28 md:pt-32 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
            <h2 
                className="text-4xl md:text-8xl font-cartoon text-white tracking-tight leading-none mb-4"
                style={{ WebkitTextStroke: '1.5px #ef4444', textShadow: '4px 4px 0px rgba(0,0,0,0.2)' }}
            >
               I Miei Amici
            </h2>
            <div className="inline-flex items-center gap-2 bg-boo-orange/80 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-xl font-black backdrop-blur-md border border-white/30 shadow-xl transform -rotate-1">
                 <Star className="animate-spin-slow w-4 h-4 md:w-6 md:h-6" fill="currentColor" />
                 <span>GLI ABITANTI DI CITTÀ COLORATA</span>
                 <Star className="animate-spin-slow w-4 h-4 md:w-6 md:h-6" fill="currentColor" />
            </div>
        </div>

        {/* Characters Grid - 2 COLONNE FISSE SEMPRE */}
        <div className="grid grid-cols-2 gap-3 md:gap-10 lg:gap-12">
            {CHARACTERS.map((char) => {
                const isExpanded = expandedId === char.id;
                const needsReadMore = char.description.length > 90;
                const displayedText = (isExpanded || !needsReadMore) 
                    ? char.description 
                    : char.description.slice(0, 90) + "...";

                return (
                    <div 
                        key={char.id} 
                        className="group relative flex flex-col h-full"
                    >
                        {/* Effetto Vetro Box */}
                        <div className={`
                            h-full bg-white/60 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-4 md:p-8
                            border-2 md:border-4 border-white/40 shadow-xl transition-all duration-300
                            hover:bg-white/80 hover:scale-[1.02] flex flex-col items-center gap-3 md:gap-6 relative overflow-hidden
                        `}>
                            {/* Decorazione interna sfumata */}
                            <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 ${char.color.split(' ')[0]}`}></div>

                            {/* Immagine Personaggio - STATICA */}
                            <div className="w-24 h-24 md:w-44 md:h-44 shrink-0 relative z-10">
                                <div className={`absolute inset-2 rounded-full opacity-10 blur-xl ${char.color.split(' ')[0]}`}></div>
                                <img 
                                    src={char.image} 
                                    alt={char.name} 
                                    className="w-full h-full object-contain drop-shadow-lg"
                                    onError={handleImageError}
                                />
                            </div>

                            {/* Testi */}
                            <div className="text-center relative z-10 w-full">
                                <div className="mb-2">
                                    <h3 
                                        className="text-xl md:text-4xl font-cartoon text-gray-800 leading-none mb-1"
                                        style={{ WebkitTextStroke: '0.5px white' }}
                                    >
                                        {char.name}
                                    </h3>
                                    <span className={`
                                        inline-block px-2 py-0.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border
                                        ${char.color} shadow-sm
                                    `}>
                                        {char.role}
                                    </span>
                                </div>
                                
                                <p className="text-gray-700 font-bold text-[10px] md:text-base leading-relaxed text-center">
                                    {displayedText}
                                </p>

                                {needsReadMore && (
                                    <button 
                                        onClick={() => toggleExpand(char.id)}
                                        className="mt-2 text-boo-purple font-black text-[9px] md:text-sm uppercase flex items-center gap-1 mx-auto hover:underline"
                                    >
                                        {isExpanded ? (
                                            <>MENO <ChevronUp size={14} /></>
                                        ) : (
                                            <>LEGGI ALTRO <ChevronDown size={14} /></>
                                        )}
                                    </button>
                                )}
                            </div>
                            
                            <Sparkles className="absolute top-4 right-4 text-white/40 hidden md:block" size={20} />
                        </div>
                    </div>
                );
            })}
        </div>

      </div>
    </div>
  );
};

export default CharactersPage;
