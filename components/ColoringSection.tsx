
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { COLORING_DATABASE } from '../services/coloringDatabase';
import { ColoringCategory, AppView } from '../types';
import { Download, ZoomIn, X, Construction } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';
import { isNightTime } from '../services/weatherService';

const SCHOOL_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/academy-mobile.webp';
const SCHOOL_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/accademianottesa.webp';
const LIST_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scaricaimngasedcolorarede33e3.webp';
const LIST_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/accademiasfondnottedisegni.webp';
const BTN_BACK_ACCADEMIA_IMG = 'https://i.postimg.cc/sDLjTmQX/TORNACCADEMIA-(1)-(1).png';
const CONSTRUCTION_IMG = 'https://i.postimg.cc/13NBmSgd/vidu-image-3059119613071461-(1).png';
const BTN_GOTO_SCHOOL_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vaia+scuola.png';
const BTN_BACK_CITY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/trneds.png';

// Asset Audio e Video
const ACADEMY_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bf1cde66-0232-492f-a201-1fff9144d3e2.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

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
  const [now, setNow] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<ColoringCategory | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const zones = INITIAL_ZONES;

  const isNight = useMemo(() => isNightTime(now), [now]);

  const currentBg = useMemo(() => {
    return isNight ? SCHOOL_BG_NIGHT : SCHOOL_BG_MOBILE;
  }, [isNight]);

  const currentListBg = useMemo(() => {
    return isNight ? LIST_BG_NIGHT : LIST_BG;
  }, [isNight]);

  useEffect(() => {
      // Aggiorna l'orario ogni minuto per gestire il cambio giorno/notte
      const timeInterval = setInterval(() => setNow(new Date()), 60000);

      const img = new Image();
      img.src = currentBg;
      img.onload = () => setIsLoaded(true);
      
      if (!audioRef.current) {
          audioRef.current = new Audio(ACADEMY_VOICE_URL);
          audioRef.current.loop = false;
          audioRef.current.volume = 0.5;
          audioRef.current.addEventListener('play', () => setIsPlaying(true));
          audioRef.current.addEventListener('pause', () => setIsPlaying(false));
          audioRef.current.addEventListener('ended', () => {
              setIsPlaying(false);
              if (audioRef.current) audioRef.current.currentTime = 0;
          });
      }

      if (isAudioOn && !selectedCategory) {
          audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
      }

      const handleGlobalAudioChange = () => {
          const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
          setIsAudioOn(enabled);
          if (enabled && isLoaded && !selectedCategory) audioRef.current?.play().catch(() => {});
          else {
              audioRef.current?.pause();
              if (audioRef.current) audioRef.current.currentTime = 0;
          }
      };
      window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

      const timer = setTimeout(() => setIsLoaded(true), 2000);
      window.scrollTo(0, 0);
      
      return () => {
          clearInterval(timeInterval);
          clearTimeout(timer);
          window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
          if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
          }
      };
  }, [isLoaded, currentBg, selectedCategory]);

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
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] bg-purple-900 overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* SFONDO GALLERIA A TUTTO SCHERMO */}
            <img 
                src={currentListBg} 
                alt="" 
                className="fixed inset-0 w-full h-full object-fill z-0 pointer-events-none" 
            />
            
            {/* OVERLAY PER MIGLIORARE LA LEGGIBILITÀ */}
            <div className="fixed inset-0 bg-white/10 backdrop-blur-[1px] z-[1] pointer-events-none"></div>

            {/* TASTO TORNA FISSO IN ALTO A SINISTRA */}
            <div className="fixed top-20 md:top-28 left-4 z-[100] animate-in slide-in-from-left duration-500">
                <button 
                    onClick={() => setSelectedCategory(null)} 
                    className="hover:scale-105 active:scale-95 transition-transform outline-none"
                >
                    <img src={BTN_BACK_ACCADEMIA_IMG} alt="Torna" className="h-20 md:h-32 w-auto drop-shadow-xl" />
                </button>
            </div>

            {/* POPUP ZOOM DISEGNO */}
            {zoomedImage && (
                <div 
                    className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setZoomedImage(null)}
                >
                    <button className="absolute top-24 right-6 bg-red-500 text-white p-3 rounded-full border-4 border-white shadow-xl hover:scale-110 active:scale-95 transition-all z-10">
                        <X size={32} strokeWidth={4} />
                    </button>
                    <div 
                        className="w-full max-w-4xl flex flex-col items-center gap-4 animate-in zoom-in duration-500" 
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative bg-white p-2 rounded-[2rem] border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center max-h-[80vh]">
                            <img 
                                src={zoomedImage} 
                                alt="Ingrandimento" 
                                className="max-w-full max-h-[70vh] object-contain rounded-xl" 
                            />
                        </div>
                        <p className="text-white font-black text-xl uppercase tracking-widest drop-shadow-md">Anteprima del disegno ✨</p>
                    </div>
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 pb-24 min-h-full">
                <div className="mt-[160px] md:mt-[220px]">
                    {selectedCategory.items.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {selectedCategory.items.map((item) => (
                                <div key={item.id} className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden border-4 border-white hover:border-boo-purple transition-colors shadow-xl flex flex-col">
                                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden group cursor-pointer border-b-2 border-gray-100">
                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                            <button 
                                                onClick={() => setZoomedImage(item.pdfUrl)}
                                                className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-lg outline-none"
                                            >
                                                <ZoomIn size={24} />
                                            </button>
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
                        <div className="flex flex-col items-center justify-center text-center py-12 bg-white/80 backdrop-blur-md rounded-[40px] border-4 border-dashed border-gray-300 shadow-xl min-h-[50vh] animate-in zoom-in">
                            <img src={CONSTRUCTION_IMG} alt="Lavori" className="w-48 h-48 md:w-64 mb-6 object-contain drop-shadow-lg" />
                            <h3 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 uppercase tracking-tighter">In Costruzione! 🚧</h3>
                            <p className="text-lg md:text-2xl font-bold text-gray-500 max-w-md leading-relaxed px-4">
                                Sto preparando nuovi disegni per {selectedCategory.title}!
                            </p>
                        </div>
                    )}
                </div>
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

        {/* Mini TV di Boo - Posizionato a SINISTRA */}
        {isLoaded && isAudioOn && isPlaying && (
            <div className="absolute top-20 md:top-28 left-4 z-50 animate-in zoom-in duration-500">
                <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                    <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                </div>
            </div>
        )}

        {/* --- BACKGROUND IMAGE (FULL SCREEN) --- */}
        <div className="absolute inset-0 w-full h-full">
            <img 
                src={currentBg} 
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
