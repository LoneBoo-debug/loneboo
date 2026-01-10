
import React, { useState, useEffect } from 'react';
import { COLORING_DATABASE } from '../services/coloringDatabase';
import { ColoringCategory, AppView } from '../types';
import { Download, ZoomIn, X, Construction } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';

const SCHOOL_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/academy-mobile.webp';
const BTN_BACK_ACCADEMIA_IMG = 'https://i.postimg.cc/sDLjTmQX/TORNACCADEMIA-(1)-(1).png';
const CONSTRUCTION_IMG = 'https://i.postimg.cc/13NBmSgd/vidu-image-3059119613071461-(1).png';
const BTN_GOTO_SCHOOL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vaia+scuola.png';
const BTN_BACK_CITY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trneds.png';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; name: string; points: Point[]; };

const INITIAL_ZONES: ZoneConfig[] = [
  {
    "id": "animals",
    "name": "Animali",
    "points": [{ "x": 22.92, "y": 15.29 }, { "x": 23.19, "y": 26.23 }, { "x": 9.33, "y": 25.93 }, { "x": 8.8, "y": 12.44 }]
  },
  {
    "id": "christmas",
    "name": "Natale",
    "points": [{ "x": 28.25, "y": 15.59 }, { "x": 27.99, "y": 26.98 }, { "x": 41.58, "y": 28.03 }, { "x": 42.38, "y": 18.14 }]
  },
  {
    "id": "halloween",
    "name": "Halloween",
    "points": [{ "x": 8.53, "y": 29.83 }, { "x": 9.06, "y": 42.87 }, { "x": 24.52, "y": 43.02 }, { "x": 23.19, "y": 30.43 }]
  },
  {
    "id": "flowers",
    "name": "Fiori",
    "points": [{ "x": 28.78, "y": 30.88 }, { "x": 28.52, "y": 42.42 }, { "x": 41.84, "y": 41.52 }, { "x": 41.58, "y": 31.18 }]
  },
  {
    "id": "sea",
    "name": "In fondo al mar",
    "points": [{ "x": 8.8, "y": 47.66 }, { "x": 8.26, "y": 51.71 }, { "x": 24.25, "y": 51.26 }, { "x": 24.25, "y": 46.16 }]
  },
  {
    "id": "characters",
    "name": "Personaggi",
    "points": [{ "x": 28.78, "y": 45.86 }, { "x": 29.58, "y": 57.25 }, { "x": 42.38, "y": 54.86 }, { "x": 41.84, "y": 44.51 }]
  }
];

const ColoringSection: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
  const [selectedCategory, setSelectedCategory] = useState<ColoringCategory | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const zones = INITIAL_ZONES;

  useEffect(() => {
      const img = new Image();
      img.src = SCHOOL_BG_MOBILE;
      img.onload = () => setIsLoaded(true);
      const timer = setTimeout(() => setIsLoaded(true), 2000);
      window.scrollTo(0, 0);
      return () => clearTimeout(timer);
  }, []);

  const handleZoneClick = (zoneId: string) => {
      const cat = COLORING_DATABASE.find(c => c.id === zoneId);
      if (cat) setSelectedCategory(cat);
  };

  const getClipPath = (points: Point[]) => {
      if (points.length < 3) return 'none';
      return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
  };

  // VISTA LISTA DISEGNI
  if (selectedCategory) {
      return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24 min-h-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 mt-[74px] md:mt-[116px] border-b-4 border-gray-100 pb-6 relative">
                    <button onClick={() => setSelectedCategory(null)} className="hover:scale-105 active:scale-95 transition-transform outline-none">
                        <img src={BTN_BACK_ACCADEMIA_IMG} alt="Torna" className="h-24 md:h-36 w-auto drop-shadow-md" />
                    </button>
                    <h2 className={`text-3xl md:text-5xl font-black uppercase text-center flex-1 ${selectedCategory.color.replace('bg-', 'text-')}`}>
                        {selectedCategory.title} {selectedCategory.emoji}
                    </h2>
                </div>
                {selectedCategory.items.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {selectedCategory.items.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border-4 border-gray-200 hover:border-boo-purple transition-colors shadow-lg flex flex-col">
                                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden group cursor-pointer border-b-2 border-gray-100">
                                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-lg"><ZoomIn size={24} /></a>
                                    </div>
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <h4 className="font-bold text-gray-700 text-sm md:text-base leading-tight mb-2 line-clamp-2">{item.title}</h4>
                                    <div className="mt-auto pt-2">
                                        <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-white font-black text-sm transition-all shadow-md active:scale-95 ${selectedCategory.color} hover:brightness-110`}><Download size={16} /> SCARICA</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-[40px] border-4 border-dashed border-gray-300 shadow-sm min-h-[50vh] animate-in zoom-in">
                        <img src={CONSTRUCTION_IMG} alt="Lavori" className="w-48 h-48 md:w-64 mb-6 object-contain drop-shadow-lg" />
                        <h3 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 uppercase tracking-tighter">In Costruzione! 🚧</h3>
                        <p className="text-lg md:text-2xl font-bold text-gray-500 max-w-md leading-relaxed px-4">
                            Sto preparando nuovi disegni per {selectedCategory.title}!
                        </p>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // VISTA PRINCIPALE (ACADEMY MAP)
  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-purple-900 overflow-hidden touch-none overscroll-none select-none">
        
        {!isLoaded && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-orange-400/95 backdrop-blur-md">
                <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Sto Caricando...</span>
            </div>
        )}

        {/* --- BACKGROUND IMAGE (FULL SCREEN) --- */}
        <div className="absolute inset-0 w-full h-full">
            <img 
                src={SCHOOL_BG_MOBILE} 
                alt="Accademia" 
                className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                draggable={false}
            />

            {/* AREE CLICCABILI (POLYGONS) */}
            {isLoaded && zones.map(zone => (
                <div 
                    key={zone.id} 
                    onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }} 
                    className="absolute inset-0 cursor-pointer z-20 active:bg-white/10" 
                    style={{ clipPath: getClipPath(zone.points) }}
                />
            ))}
        </div>

        {/* --- TASTO TORNA IN CITTÀ (IN BASSO A SINISTRA) --- */}
        {isLoaded && (
            <div 
                className="absolute bottom-[4%] left-[4%] z-40 pointer-events-auto w-[28vw] md:w-[15vw] max-w-[240px]"
            >
                <button 
                    onClick={() => setView(AppView.CITY_MAP)}
                    className="w-full hover:scale-105 active:scale-95 transition-all outline-none"
                >
                    <img 
                        src={BTN_BACK_CITY_IMG} 
                        alt="Torna in Città" 
                        className="w-full h-auto drop-shadow-2xl"
                    />
                </button>
            </div>
        )}

        {/* --- TASTO VAI A SCUOLA (IN BASSO A DESTRA) - GRANDE E ADATTIVO --- */}
        {isLoaded && (
            <div 
                className="absolute bottom-[4%] right-[4%] z-40 pointer-events-auto w-[28vw] md:w-[15vw] max-w-[240px]"
            >
                <button 
                    onClick={() => setView(AppView.SCHOOL)}
                    className="w-full hover:scale-105 active:scale-95 transition-all outline-none"
                >
                    <img 
                        src={BTN_GOTO_SCHOOL_IMG} 
                        alt="Vai a Scuola" 
                        className="w-full h-auto drop-shadow-2xl"
                    />
                </button>
            </div>
        )}
    </div>
  );
};

export default ColoringSection;
