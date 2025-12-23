import React, { useState, useEffect } from 'react';
import { COLORING_DATABASE } from '../services/coloringDatabase';
import { ColoringCategory } from '../types';
import { ArrowLeft, Download, ZoomIn, Loader2, X } from 'lucide-react';
import RobotHint from './RobotHint';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';
import { OFFICIAL_LOGO } from '../constants';

const SCHOOL_BG_MOBILE = 'https://i.postimg.cc/xjxMcbck/scoooplo.jpg';
const SCHOOL_BG_DESKTOP = 'https://i.postimg.cc/XYLSGH2F/accademia169.jpg';
const CONSTRUCTION_IMG = 'https://i.postimg.cc/13NBmSgd/vidu-image-3059119613071461-(1).png';
const BTN_BACK_ACCADEMIA_IMG = 'https://i.postimg.cc/sDLjTmQX/TORNACCADEMIA-(1)-(1).png';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

const ZONES_MOBILE: ZoneConfig[] = [
  { "id": "animals", "points": [ { "x": 46.67, "y": 43.93 }, { "x": 45.07, "y": 48.23 }, { "x": 55.21, "y": 48.23 }, { "x": 53.88, "y": 43.75 } ] },
  { "id": "christmas", "points": [ { "x": 38.94, "y": 56.48 }, { "x": 36.81, "y": 62.93 }, { "x": 46.41, "y": 62.93 }, { "x": 47.21, "y": 56.66 } ] },
  { "id": "halloween", "points": [ { "x": 52.81, "y": 56.66 }, { "x": 53.34, "y": 63.65 }, { "x": 63.48, "y": 63.47 }, { "x": 61.34, "y": 56.84 } ] },
  { "id": "flowers", "points": [ { "x": 8.8, "y": 73.15 }, { "x": 2.13, "y": 80.86 }, { "x": 13.34, "y": 82.84 }, { "x": 19.2, "y": 74.59 } ] },
  { "id": "sea", "points": [ { "x": 33.87, "y": 74.77 }, { "x": 31.21, "y": 84.63 }, { "x": 44.81, "y": 84.81 }, { "x": 46.14, "y": 75.13 } ] },
  { "id": "characters", "points": [ { "x": 54.14, "y": 75.13 }, { "x": 55.48, "y": 85.17 }, { "x": 69.08, "y": 84.63 }, { "x": 65.61, "y": 74.95 } ] },
  { "id": "food", "points": [ { "x": 80.01, "y": 74.41 }, { "x": 85.62, "y": 82.66 }, { "x": 97.35, "y": 81.4 }, { "x": 89.88, "y": 73.15 } ] }
];

const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "animals", "points": [ { "x": 48.32, "y": 47.21 }, { "x": 47.75, "y": 52.46 }, { "x": 52.61, "y": 52.98 }, { "x": 52.16, "y": 47.47 } ] },
  { "id": "christmas", "points": [ { "x": 44.59, "y": 60.85 }, { "x": 43.46, "y": 67.67 }, { "x": 48.88, "y": 68.45 }, { "x": 49.22, "y": 60.59 } ] },
  { "id": "halloween", "points": [ { "x": 51.14, "y": 60.85 }, { "x": 51.93, "y": 67.67 }, { "x": 56.56, "y": 67.67 }, { "x": 55.65, "y": 60.32 } ] },
  { "id": "flowers", "points": [ { "x": 30.14, "y": 76.06 }, { "x": 26.98, "y": 84.45 }, { "x": 32.85, "y": 87.08 }, { "x": 35.33, "y": 78.16 } ] },
  { "id": "sea", "points": [ { "x": 42.45, "y": 78.68 }, { "x": 40.98, "y": 88.13 }, { "x": 47.53, "y": 88.65 }, { "x": 48.43, "y": 78.42 } ] },
  { "id": "characters", "points": [ { "x": 52.04, "y": 78.68 }, { "x": 52.49, "y": 87.86 }, { "x": 59.15, "y": 87.86 }, { "x": 57.8, "y": 78.95 } ] },
  { "id": "food", "points": [ { "x": 64.35, "y": 78.68 }, { "x": 67.17, "y": 86.55 }, { "x": 72.48, "y": 85.24 }, { "x": 69.77, "y": 76.85 } ] }
];

const ColoringSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ColoringCategory | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
      const imgMobile = new Image(); imgMobile.src = SCHOOL_BG_MOBILE;
      const imgDesktop = new Image(); imgDesktop.src = SCHOOL_BG_DESKTOP;
      let loadedCount = 0;
      const checkLoad = () => { loadedCount++; if (loadedCount >= 1) setIsLoaded(true); };
      imgMobile.onload = checkLoad; imgDesktop.onload = checkLoad;
      setTimeout(() => setIsLoaded(true), 2000);
      window.scrollTo(0, 0);
      const timer = setTimeout(() => { if (!selectedCategory) setShowHint(true); }, 5000); 
      return () => clearTimeout(timer);
  }, []); 

  const getClipPath = (points: Point[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

  return (
    <div className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] overflow-hidden">
        {!isLoaded && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-orange-400/95 backdrop-blur-md">
                <img 
                    src={OFFICIAL_LOGO} 
                    alt="Caricamento..." 
                    className="w-32 h-32 object-contain animate-spin-horizontal mb-6" 
                    onError={(e) => { e.currentTarget.src = 'https://i.postimg.cc/tCZGcq9V/official.png'; }} 
                />
                <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">
                    Sto Caricando...
                </span>
            </div>
        )}
        {selectedCategory ? (
            <div className="w-full h-full bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24 min-h-full">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 mt-28 md:mt-40 border-b-4 border-gray-100 pb-6 relative">
                        <div className="absolute -top-24 md:-top-32 left-0 md:relative md:top-auto md:left-auto">
                            <button onClick={() => setSelectedCategory(null)} className="hover:scale-105 active:scale-95 transition-transform outline-none">
                                <img src={BTN_BACK_ACCADEMIA_IMG} alt="Torna all'Accademia" className="h-24 md:h-36 w-auto drop-shadow-md" />
                            </button>
                        </div>
                        <h2 className={`text-3xl md:text-5xl font-black uppercase text-center w-full ${selectedCategory.color.replace('bg-', 'text-')}`}>{selectedCategory.title} {selectedCategory.emoji}</h2>
                    </div>
                    {selectedCategory.items.length > 0 ? (
                        <div className="grid grid-cols-2 landscape:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {selectedCategory.items.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl overflow-hidden border-4 border-gray-200 hover:border-boo-purple transition-colors shadow-lg flex flex-col">
                                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden group cursor-pointer border-b-2 border-gray-100"><img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3"><a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" download className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-lg" title="Apri PDF"><ZoomIn size={24} /></a></div></div>
                                    <div className="p-3 flex flex-col flex-1"><h4 className="font-bold text-gray-700 text-sm md:text-base leading-tight mb-2 line-clamp-2">{item.title}</h4><div className="mt-auto pt-2"><a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" download className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-white font-black text-sm transition-all shadow-md active:scale-95 ${selectedCategory.color} hover:brightness-110`}><Download size={16} /> SCARICA</a></div></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-[40px] border-4 border-dashed border-gray-300 shadow-sm min-h-[50vh] animate-in zoom-in"><div className="w-48 h-48 md:w-64 md:h-64 mb-6 relative"><img src={CONSTRUCTION_IMG} alt="Lavori in corso" className="w-full h-full object-contain drop-shadow-lg" /></div><h3 className="text-3xl md:text-4xl font-black text-gray-700 mb-4">Lavori in Corso! 🚧</h3><p className="text-xl font-bold text-gray-500 max-w-md leading-relaxed px-4">Sto disegnando nuovi capolavori per la sezione <span className={`inline-block ${selectedCategory.color} text-white px-3 py-1 rounded-lg mx-1`}>{selectedCategory.title}</span>!<br/><br/>Torna a trovarci presto! 👻✏️</p></div>
                    )}
                </div>
            </div>
        ) : (
            <div className="relative w-full h-full bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col" onClick={() => setShowHint(false)}>
                <RobotHint show={showHint && isLoaded && !selectedCategory} message="Tocca un disegno, stampalo e... coloriamo!" />
                <div className="relative flex-1 w-full h-full overflow-hidden select-none">
                    <div className="block md:hidden w-full h-full relative">
                        <img src={SCHOOL_BG_MOBILE} alt="Accademia Mobile" className={`w-full h-full object-fill object-center ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                        {ZONES_MOBILE.map((zone, i) => (<div key={i} onClick={(e) => { e.stopPropagation(); setSelectedCategory(COLORING_DATABASE.find(c => c.id === zone.id) || null); }} className="absolute inset-0 cursor-pointer" style={{ clipPath: getClipPath(zone.points) }}></div>))}
                    </div>
                    <div className="hidden md:block w-full h-full relative overflow-hidden">
                        <img src={SCHOOL_BG_DESKTOP} alt="Accademia Desktop" className={`absolute inset-0 w-full h-full object-fill object-center ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                        {ZONES_DESKTOP.map((zone, i) => (<div key={i} onClick={(e) => { e.stopPropagation(); setSelectedCategory(COLORING_DATABASE.find(c => c.id === zone.id) || null); }} className="absolute inset-0 cursor-pointer" style={{ clipPath: getClipPath(zone.points) }}></div>))}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ColoringSection;