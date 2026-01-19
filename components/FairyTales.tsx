
import React, { useState, useRef, useEffect } from 'react';
import { OFFICIAL_LOGO } from '../constants';
import { FAIRY_TALES } from '../services/talesDatabase';
import { Play, Pause, Clock, Loader2, RotateCcw, X, BookOpen } from 'lucide-react';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';
import { AppView } from '../types';

const FOREST_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tales-mobile.webp';
const FOREST_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tales-desktop.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const TALES_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tales-header.webp';
const MARAGNO_EASTER_EGG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mrarafilo+(1).webp';
const BTN_BACK_CITY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/fungindiccitt.png';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

const ZONES_MOBILE: ZoneConfig[] = [ { id: "Fata", points: [ { x: 62.63, y: 24.23 }, { x: 50.11, y: 62.99 }, { x: 79.42, y: 66.4 }, { x: 80.76, y: 26.2 } ] } ];
const ZONES_DESKTOP: ZoneConfig[] = [ { id: "Fata", points: [ { "x": 53.62, "y": 29.38 }, { "x": 49.9, "y": 65.05 }, { "x": 63.33, "y": 70.82 }, { "x": 65.7, "y": 29.38 } ] } ];

const FairyTales: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSpider, setShowSpider] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
      const imgMobile = new Image(); imgMobile.src = FOREST_BG_MOBILE;
      const imgDesktop = new Image(); imgDesktop.src = FOREST_BG_DESKTOP;
      let loadedCount = 0;
      const checkLoad = () => { loadedCount++; if (loadedCount >= 1) setIsLoaded(true); };
      imgMobile.onload = checkLoad; imgDesktop.onload = checkLoad;
      
      const timer = setTimeout(() => setIsLoaded(true), 2000);
      
      // Easter Egg Maragno Timer
      const spiderTimer = setTimeout(() => {
          setShowSpider(true);
      }, 1000);

      window.scrollTo(0, 0);
      return () => {
          clearTimeout(timer);
          clearTimeout(spiderTimer);
      };
  }, []); 

  useEffect(() => {
    if (audioRef.current && currentAudio) {
        audioRef.current.load();
    }
  }, [currentAudio]);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const totalSeconds = Math.floor(time);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
        audioRef.current.pause();
    } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("Errore riproduzione:", error);
                setIsPlaying(false);
            });
        }
    }
  };

  const activeStory = FAIRY_TALES.find(t => t.src === currentAudio);
  const getClipPath = (points: Point[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-green-900 overflow-hidden touch-none overscroll-none select-none">
        <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            
            @keyframes maragno-drop {
                0% { transform: translateY(-100%); }
                65% { transform: translateY(0); }
                80% { transform: translateY(-20px); }
                100% { transform: translateY(0); }
            }
            .animate-maragno {
                animation: maragno-drop 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
        `}</style>
        
        <audio 
            key={currentAudio || 'idle'}
            ref={audioRef} 
            src={currentAudio || ''}
            preload="auto"
            crossOrigin="anonymous"
            onEnded={() => setIsPlaying(false)} 
            onPause={() => setIsPlaying(false)} 
            onPlay={() => setIsPlaying(true)} 
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} 
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} 
        />
        
        {!isLoaded && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-green-800/95 backdrop-blur-md">
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

        {/* MARAGNO EASTER EGG - SPOSTATO LEGGERMENTE PIÙ A SINISTRA (da -8%/-5% a -12%/-10%) */}
        {showSpider && isLoaded && !isMenuOpen && !showPlayerModal && (
            <button 
                onClick={() => setView(AppView.CHAT)}
                className="fixed top-[-130px] md:top-[-260px] left-[-12%] md:left-[-10%] z-40 w-80 md:w-[560px] h-auto transition-transform hover:scale-105 active:scale-95 animate-maragno outline-none cursor-pointer"
            >
                <img 
                    src={MARAGNO_EASTER_EGG} 
                    alt="Maragno ti aspetta all'Info Point" 
                    className="w-full h-auto drop-shadow-2xl" 
                />
            </button>
        )}

        {/* TASTO TORNA IN CITTÀ */}
        {isLoaded && !isMenuOpen && !showPlayerModal && (
            <button 
                onClick={() => setView(AppView.CITY_MAP)}
                className="fixed bottom-6 right-6 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
                title="Torna in Città"
            >
                <img 
                    src={BTN_BACK_CITY} 
                    alt="Torna in Città" 
                    className="w-40 md:w-72 h-auto drop-shadow-2xl" 
                />
            </button>
        )}

        <div className="relative flex-1 w-full h-full overflow-hidden">
            <div className="block md:hidden w-full h-full relative">
                <img src={FOREST_BG_MOBILE} alt="Fiabe Mobile" className={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                {isLoaded && ZONES_MOBILE.map((zone, i) => (<div key={i} className="absolute inset-0 cursor-pointer pointer-events-auto" style={{ clipPath: getClipPath(zone.points) }} onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}></div>))}
            </div>
            <div className="hidden md:block w-full h-full relative">
                <img src={FOREST_BG_DESKTOP} alt="Fiabe Desktop" className={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
                {isLoaded && ZONES_DESKTOP.map((zone, i) => (
                    <div key={i} className="absolute inset-0 cursor-pointer pointer-events-auto" style={{ clipPath: getClipPath(zone.points) }} onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}></div>
                ))}
            </div>
        </div>

        {isMenuOpen && !showPlayerModal && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-md p-4 pt-28 md:pt-36 animate-in fade-in duration-300 pointer-events-auto">
                <div className="bg-white/95 w-full max-w-4xl h-[80vh] rounded-[40px] border-4 border-green-600 shadow-2xl flex flex-col overflow-hidden relative" onClick={e => e.stopPropagation()}>
                    <div className="bg-green-600 p-2 md:p-4 flex justify-center items-center shrink-0 border-b-4 border-green-800 relative">
                        <div className="flex items-center justify-center">
                            <img src={TALES_HEADER_IMG} alt="Le Fiabe di Flora" className="h-20 md:h-32 w-auto object-contain drop-shadow-lg" />
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className="absolute top-2 right-2 hover:scale-110 active:scale-95 transition-all outline-none z-10">
                            <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-xl" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 no-scrollbar bg-green-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                            {FAIRY_TALES.map((tale) => (
                                <div key={tale.id} onClick={() => { setCurrentAudio(tale.src); setShowPlayerModal(true); }} className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full">
                                    <div className="relative aspect-video overflow-hidden">
                                        <img src={tale.image} alt={tale.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                            <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                <Play size={24} className="text-green-600 ml-1" fill="currentColor" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold border-2 border-black/30 px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
                                            <Clock size={12} /> {tale.duration}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-black text-gray-800 text-lg leading-tight mb-2 group-hover:text-green-700 transition-colors">{tale.title}</h3>
                                        <p className="text-gray-500 text-xs md:sm line-clamp-3 leading-relaxed font-medium">{tale.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showPlayerModal && activeStory && (
            <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in duration-300 pointer-events-auto">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img src={activeStory.image} className="w-full h-full object-cover blur-xl" alt="" />
                </div>
                <div className="relative w-full max-w-md p-6 flex flex-col items-center z-10">
                    <button onClick={() => { if (audioRef.current) { audioRef.current.pause(); } setIsPlaying(false); setShowPlayerModal(false); setCurrentAudio(null); }} className="absolute top-0 right-4 hover:scale-110 active:scale-95 transition-all outline-none z-50">
                        <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-xl" />
                    </button>
                    <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-white/10 shadow-[0_0_50px_rgba(34,197,94,0.3)] overflow-hidden mb-8 relative ${isPlaying ? 'animate-spin-slow' : ''}`}>
                        <img src={activeStory.image} alt={activeStory.title} className="w-full h-full object-cover" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full border-4 border-gray-800"></div>
                    </div>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-md">{activeStory.title}</h2>
                        <p className="text-green-300 font-bold uppercase tracking-widest text-xs">Raccontata da Fata Flora</p>
                    </div>
                    <div className="w-full mb-8">
                        <input type="range" min="0" max={duration || 100} value={currentTime} onChange={(e) => { const newTime = parseFloat(e.target.value); if (audioRef.current) audioRef.current.currentTime = newTime; }} className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-green-500" />
                        <div className="flex justify-between text-xs font-bold text-white/50 mt-2 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <button onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 15; }} className="text-white/70 hover:text-white p-2">
                            <RotateCcw size={28} />
                            <span className="text-[10px] font-bold block text-center">-15s</span>
                        </button>
                        <button onClick={handleTogglePlay} className="bg-green-500 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-105 active:scale-95 transition-all border-4 border-white/20">
                            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                        </button>
                        <button onClick={() => { if(audioRef.current) audioRef.current.currentTime += 15; }} className="text-white/70 hover:text-white p-2">
                            <RotateCcw size={28} className="scale-x-[-1]" />
                            <span className="text-[10px] font-bold block text-center">+15s</span>
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default FairyTales;
