import React, { useEffect, useState } from 'react';
import { Sparkles, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, Character } from '../types';
import { CHARACTERS } from '../services/databaseAmici';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';

const INFO_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newsfondimieiamicir4.webp';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const BTN_GO_TO_SECTION = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_creami+un+tasto+rettangolare+i_503665104197095433.webp';

const CHAR_VIEW_MAP: Record<string, AppView> = {
  "maragno": AppView.CHAT,
  "marlo": AppView.TRAIN_JOURNEY,
  "raffa": AppView.COLORING,
  "grufo": AppView.EMOTIONAL_GARDEN,
  "pumpkin": AppView.CINEMA_PREVIEW,
  "flora": AppView.TALES,
  "batbeat": AppView.SOUNDS
};

type Point = { x: number; y: number };

const CHARACTER_AREAS: Record<string, Point[]> = {
  "boo": [
    { "x": 30.93, "y": 43.78 },
    { "x": 27.73, "y": 50.97 },
    { "x": 34.4, "y": 52.92 },
    { "x": 38.13, "y": 46.33 },
    { "x": 33.33, "y": 43.33 }
  ],
  "pumpkin": [
    { "x": 79.73, "y": 63.57 },
    { "x": 73.07, "y": 68.22 },
    { "x": 79.73, "y": 72.26 },
    { "x": 88, "y": 70.91 },
    { "x": 90.67, "y": 67.32 },
    { "x": 85.33, "y": 64.02 }
  ],
  "gaia": [
    { "x": 46.4, "y": 46.33 },
    { "x": 40.8, "y": 50.97 },
    { "x": 35.47, "y": 56.82 },
    { "x": 41.6, "y": 62.97 },
    { "x": 42.93, "y": 68.82 },
    { "x": 55.73, "y": 58.02 },
    { "x": 51.47, "y": 48.43 }
  ],
  "andrea": [
    { "x": 61.87, "y": 61.47 },
    { "x": 50.4, "y": 74.81 },
    { "x": 49.07, "y": 80.81 },
    { "x": 60.53, "y": 79.01 },
    { "x": 66.4, "y": 76.91 },
    { "x": 69.07, "y": 65.37 }
  ],
  "grufo": [
    { "x": 11.73, "y": 51.72 },
    { "x": 9.87, "y": 67.47 },
    { "x": 23.2, "y": 66.72 },
    { "x": 24.8, "y": 53.37 }
  ],
  "raffa": [
    { "x": 80.53, "y": 43.48 },
    { "x": 81.07, "y": 60.42 },
    { "x": 92.8, "y": 61.47 },
    { "x": 92, "y": 42.73 }
  ],
  "batbeat": [
    { "x": 55.73, "y": 91 },
    { "x": 80.53, "y": 91.9 },
    { "x": 96.8, "y": 79.46 },
    { "x": 79.2, "y": 79.76 },
    { "x": 68.8, "y": 83.21 }
  ],
  "maragno": [
    { "x": 9.6, "y": 35.23 },
    { "x": 14.13, "y": 40.78 },
    { "x": 22.93, "y": 39.73 },
    { "x": 18.13, "y": 31.93 }
  ],
  "flora": [
    { "x": 17.6, "y": 70.01 },
    { "x": 6.93, "y": 73.46 },
    { "x": 12, "y": 82.76 },
    { "x": 16, "y": 91.45 },
    { "x": 25.07, "y": 89.06 },
    { "x": 37.33, "y": 82.76 },
    { "x": 35.73, "y": 70.16 }
  ],
  "marlo": [
    { "x": 60.8, "y": 47.38 },
    { "x": 58.67, "y": 51.27 },
    { "x": 60, "y": 57.57 },
    { "x": 66.93, "y": 57.12 },
    { "x": 67.47, "y": 51.72 },
    { "x": 63.73, "y": 47.23 }
  ]
};

interface CharactersPageProps {
    setView: (view: AppView) => void;
}

const CharactersPage: React.FC<CharactersPageProps> = ({ setView }) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

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

  const getClipPath = (pts: Point[]) => {
    if (!pts || pts.length < 3) return 'none';
    return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
  };

  const openCharacter = (id: string) => {
    const char = CHARACTERS.find(c => c.id === id);
    if (char) setSelectedChar(char);
  };

  return (
    <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed overflow-hidden select-none h-[100dvh]"
        style={{ backgroundImage: `url(${INFO_BG})`, backgroundSize: '100% 100%' }}
    >
      
      {/* Header con Titolo e Tasto Chiudi */}
      <div className="fixed top-20 right-4 left-4 z-50 flex items-center justify-end gap-6 pointer-events-none">
          <h1 
            className="text-3xl md:text-6xl font-luckiest tracking-normal uppercase whitespace-nowrap pointer-events-auto"
            style={{ 
              color: '#ef4444',
              filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,0.3))',
              WebkitTextStroke: '2.5px white',
              paintOrder: 'stroke fill',
              letterSpacing: '0.05em'
            }}
          >
            I Miei Amici
          </h1>
          
          <button 
              onClick={() => setView(AppView.BOO_LIVING_ROOM)}
              className="hover:scale-110 active:scale-95 transition-all outline-none pointer-events-auto shrink-0"
              aria-label="Indietro"
          >
              <img 
                src={BTN_CLOSE_IMG} 
                alt="Chiudi" 
                className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-2xl" 
              />
          </button>
      </div>

      {/* Clickable Areas */}
      {Object.entries(CHARACTER_AREAS).map(([id, pts]) => (
          <div 
            key={id}
            onClick={() => openCharacter(id)}
            className="absolute inset-0 z-10 cursor-pointer transition-colors active:bg-white/10"
            style={{ clipPath: getClipPath(pts) }}
          />
      ))}

      {/* Modal Dettaglio */}
      <AnimatePresence>
        {selectedChar && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedChar(null)}
            >
                <motion.div 
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 50, opacity: 0 }}
                    className="relative w-full max-w-2xl max-h-[85vh] bg-white/30 backdrop-blur-2xl rounded-[3rem] border-2 border-white/40 shadow-2xl overflow-y-auto custom-scrollbar p-6 md:p-10 flex flex-col items-center gap-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setSelectedChar(null)}
                        className="absolute top-6 right-6 text-white hover:scale-110 active:scale-95 transition-all p-2 bg-black/20 rounded-full"
                    >
                        <CloseIcon size={24} />
                    </button>

                    <div className="w-40 h-40 md:w-64 md:h-64 relative">
                        <div className={`absolute inset-4 rounded-full blur-3xl opacity-30 ${selectedChar.color.split(' ')[0]}`}></div>
                        <img 
                            src={selectedChar.image} 
                            alt={selectedChar.name} 
                            className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                            onError={handleImageError}
                        />
                    </div>

                    <div className="text-center w-full">
                        <h2 className="text-4xl md:text-6xl font-cartoon text-white mb-2" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.2)' }}>
                            {selectedChar.name}
                        </h2>
                        <span className={`inline-block px-4 py-1 rounded-full text-xs md:text-sm font-black uppercase tracking-widest bg-white/20 text-white border border-white/30 mb-6`}>
                            {selectedChar.role}
                        </span>
                        
                        <div className="max-h-32 md:max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            <p className="text-lg md:text-2xl font-bold text-white leading-relaxed text-center px-2 md:px-8 drop-shadow-sm">
                                {selectedChar.description}
                            </p>
                        </div>

                        {CHAR_VIEW_MAP[selectedChar.id] && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setView(CHAR_VIEW_MAP[selectedChar.id])}
                            className="mt-6 mx-auto relative group overflow-hidden rounded-2xl shadow-xl transition-all"
                          >
                            <img 
                              src={BTN_GO_TO_SECTION} 
                              alt="SEZIONE" 
                              className="w-32 md:w-48 h-auto object-contain"
                            />
                          </motion.button>
                        )}
                    </div>

                    <Sparkles className="absolute bottom-8 left-8 text-white/20 animate-pulse" size={32} />
                    <Sparkles className="absolute top-20 right-12 text-white/10 animate-pulse delay-500" size={24} />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CharactersPage;
