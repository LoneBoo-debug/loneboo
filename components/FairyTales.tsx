import React, { useState, useRef, useEffect } from 'react';
import { FAIRY_TALES } from '../constants';
import { Play, Pause, Clock, Loader2, RotateCcw, X, BookOpen } from 'lucide-react';
import RobotHint from './RobotHint';

const FOREST_BG_MOBILE = 'https://i.postimg.cc/gJqK5hLQ/boscod.jpg';
const FOREST_BG_DESKTOP = 'https://i.postimg.cc/kXHYkNRR/fiabe169.jpg';

// --- TYPE DEFINITIONS ---
type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

// ZONE MOBILE (INVARIATE)
const ZONES_MOBILE: ZoneConfig[] = [
    {
        id: "Fata",
        points: [
          { x: 62.63, y: 24.23 },
          { x: 50.11, y: 62.99 },
          { x: 79.42, y: 66.4 },
          { x: 80.76, y: 26.2 }
        ]
    }
];

// ZONE DESKTOP (DEFINITIVE)
const ZONES_DESKTOP: ZoneConfig[] = [
  {
    "id": "Fata",
    "points": [
      { "x": 53.62, "y": 29.38 },
      { "x": 49.9, "y": 65.05 },
      { "x": 63.33, "y": 70.82 },
      { "x": 65.7, "y": 29.38 }
    ]
  }
];

// --- IMAGE COMPONENT ---
const TaleImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <div className={`relative bg-gray-200 overflow-hidden ${className || 'w-full h-full'}`}>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse z-10">
                    <Loader2 size={24} className="text-gray-400 animate-spin" />
                </div>
            )}
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
            />
        </div>
    );
};

const FairyTales: React.FC = () => {
  // Main States
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the Story List Modal
  
  // Audio Player States
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background Load
  useEffect(() => {
      // Preload both images
      const imgMobile = new Image();
      imgMobile.src = FOREST_BG_MOBILE;
      const imgDesktop = new Image();
      imgDesktop.src = FOREST_BG_DESKTOP;

      let loadedCount = 0;
      const checkLoad = () => {
          loadedCount++;
          if (loadedCount >= 1) setIsLoaded(true); // Show as soon as one is ready (optimistic)
      };

      imgMobile.onload = checkLoad;
      imgDesktop.onload = checkLoad;

      // Fallback
      setTimeout(() => setIsLoaded(true), 2000);

      window.scrollTo(0, 0);

      // Timer parte SOLO al mount del componente
      const timer = setTimeout(() => {
          if (!isMenuOpen) setShowHint(true);
      }, 5000); 

      return () => clearTimeout(timer);
  }, []); // Dipendenza vuota: non riparte se chiudo il menu

  // Audio Playback Effect
  useEffect(() => {
      if (audioRef.current) {
          if (currentAudio) {
              audioRef.current.src = currentAudio;
              if (showPlayerModal) {
                  const playPromise = audioRef.current.play();
                  if (playPromise !== undefined) {
                      playPromise.catch(() => setIsPlaying(false));
                  }
                  setIsPlaying(true);
              }
          } else {
              audioRef.current.pause();
              setIsPlaying(false);
          }
      }
  }, [currentAudio, showPlayerModal]);

  // Wake Lock
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && isPlaying) {
        try {
          // @ts-ignore
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {}
      }
    };
    if (isPlaying) requestWakeLock();
    return () => { wakeLock?.release(); };
  }, [isPlaying]);

  // Interaction Handlers
  const handleInteraction = () => { if (showHint) setShowHint(false); };

  const getClipPath = (points: Point[]) => {
      if (!points || points.length < 3) return 'none';
      const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
      return `polygon(${poly})`;
  };

  const handleZoneClick = () => {
      setShowHint(false); // Nasconde il robot
      setIsMenuOpen(true);
  };

  // Player Handlers
  const openPlayer = (src: string) => {
      if (!src) return;
      setCurrentAudio(src);
      setShowPlayerModal(true);
  };

  const closePlayer = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0; 
      }
      setIsPlaying(false);
      setShowPlayerModal(false);
      setCurrentAudio(null);
  };

  const togglePlayPause = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
      } else {
          audioRef.current.play().catch(() => setIsPlaying(false));
          setIsPlaying(true);
      }
  };

  // Helper Function: Format Time (Handles H:MM:SS or MM:SS)
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const totalSeconds = Math.floor(time);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const activeStory = FAIRY_TALES.find(t => t.src === currentAudio);

  return (
    <div 
        className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col"
        onClick={handleInteraction}
    >
        <audio 
            ref={audioRef} 
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />

        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-950 z-50">
                <span className="text-emerald-300 font-black text-2xl animate-pulse flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Entro nel Bosco...
                </span>
            </div>
        )}

        <RobotHint 
            show={showHint && isLoaded && !isMenuOpen} 
            message="Tocca Fata Flora per ascoltare una fiaba"
        />

        {/* MAIN BACKGROUND & INTERACTION LAYER */}
        <div 
            className="relative flex-1 w-full h-full overflow-hidden select-none"
        >
            {/* --- AMBIENTE MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={FOREST_BG_MOBILE} 
                    alt="Bosco delle Fiabe Mobile" 
                    className={`w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {/* CLICKABLE FAIRY ZONE (Mobile) */}
                {ZONES_MOBILE.map((zone, i) => (
                    <div
                        key={i}
                        onClick={handleZoneClick}
                        className="absolute inset-0 cursor-pointer group"
                        style={{ clipPath: getClipPath(zone.points) }}
                        title="Apri le Fiabe"
                    ></div>
                ))}
            </div>

            {/* --- AMBIENTE DESKTOP (ORIZZONTALE - FIX 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={FOREST_BG_DESKTOP} 
                    alt="Bosco delle Fiabe Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                
                {/* ZONE DESKTOP DEFINITIVE */}
                {ZONES_DESKTOP.map((zone, i) => (
                    <div
                        key={i}
                        onClick={handleZoneClick}
                        className="absolute inset-0 cursor-pointer group"
                        style={{ clipPath: getClipPath(zone.points) }}
                        title="Apri le Fiabe"
                    ></div>
                ))}
            </div>
            
        </div>

        {/* --- STORY LIST MODAL (THE MAGIC BOOK) --- */}
        {isMenuOpen && (
            <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 flex items-center justify-center p-4">
                
                {/* Book Container */}
                <div className="bg-[#fffbeb] w-full max-w-4xl h-[85vh] rounded-[40px] border-8 border-[#8B4513] shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
                    
                    {/* Header */}
                    <div className="bg-[#8B4513] p-4 flex items-center gap-4 text-[#fffbeb] shadow-md z-10">
                        {/* Close button moved to Left */}
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-[#5c2e0e] p-2 rounded-full hover:bg-[#3e1f0a] transition-colors border-2 border-[#a67c52] shrink-0"
                        >
                            <X size={24} />
                        </button>
                        
                        {/* Title Section */}
                        <div className="flex items-center gap-3">
                            <BookOpen size={32} />
                            <h2 className="text-2xl md:text-3xl font-black font-serif tracking-wide">Le Fiabe</h2>
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {FAIRY_TALES.map((story) => (
                                <div 
                                    key={story.id} 
                                    className="bg-white rounded-2xl p-3 border-2 border-[#e5e7eb] hover:border-[#8B4513] shadow-md hover:shadow-xl transition-all group flex flex-col cursor-pointer"
                                    onClick={() => openPlayer(story.src)}
                                >
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-gray-200">
                                        <TaleImage src={story.image} alt={story.title} />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <div className="bg-white/90 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                                                <Play size={24} className="text-[#8B4513] ml-1" fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-gray-800 text-lg leading-tight mb-1">{story.title}</h3>
                                    <div className="flex items-center gap-1 text-xs font-bold text-gray-400 mt-auto">
                                        <Clock size={12} /> {story.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- AUDIO PLAYER OVERLAY --- */}
        {showPlayerModal && activeStory && (
            <div className="absolute inset-x-0 bottom-0 z-50 bg-white border-t-4 border-[#8B4513] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300 flex flex-col md:flex-row items-center p-4 gap-4">
                
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-300 shrink-0">
                        <TaleImage src={activeStory.image} alt={activeStory.title} />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-black text-gray-900 text-lg leading-tight truncate">{activeStory.title}</h3>
                        <p className="text-xs font-bold text-gray-500">Stai ascoltando...</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 w-full flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-6">
                        <button onClick={() => { if(audioRef.current) audioRef.current.currentTime = 0; }} className="p-2 text-gray-400 hover:text-[#8B4513] transition-colors"><RotateCcw size={20} /></button>
                        <button 
                            onClick={togglePlayPause}
                            className="w-12 h-12 bg-[#8B4513] rounded-full text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                        >
                            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
                        </button>
                        <button onClick={closePlayer} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                    </div>
                    {/* Progress Bar with Formatted Time */}
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-[10px] font-mono font-bold text-gray-500 w-12 text-right">{formatTime(currentTime)}</span>
                        <input 
                            type="range" 
                            min="0" 
                            max={duration || 100} 
                            value={currentTime} 
                            onChange={(e) => { if(audioRef.current) audioRef.current.currentTime = Number(e.target.value); }}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B4513]"
                        />
                        <span className="text-[10px] font-mono font-bold text-gray-500 w-12">{formatTime(duration)}</span>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default FairyTales;