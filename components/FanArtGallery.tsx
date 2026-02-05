
import React, { useState, useEffect, useRef } from 'react';
import { getFanArt } from '../services/data';
import { FanArt, AppView } from '../types';
import { X, PenTool, Sparkles } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';
import SendDrawingModal from './SendDrawingModal';

const MUSEUM_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/museum-mobile.webp';
const MUSEUM_BG_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/museum-desktop.webp';

const BTN_VAI_GALLERIA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-museum-gallery.webp';
const BTN_TORNA_CITTA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-museum-back.webp';
const BTN_INVIA_DISEGNO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-museum-send.webp';

// Asset Audio e Video
const MUSEUM_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/museumspechlongbri3ew2.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };
type FrameConfig = { id: string; points: Point[]; };

const FRAMES_MOBILE: FrameConfig[] = [
    { "id": "f1", "points": [ { "x": 6.67, "y": 33.4 }, { "x": 21.6, "y": 34.92 }, { "x": 21.07, "y": 57.02 }, { "x": 5.87, "y": 56.86 } ] },
    { "id": "f2", "points": [ { "x": 29.87, "y": 36.44 }, { "x": 41.61, "y": 37.96 }, { "x": 41.07, "y": 57.19 }, { "x": 29.07, "y": 57.19 } ] },
    { "id": "f3", "points": [ { "x": 57.88, "y": 37.79 }, { "x": 69.08, "y": 36.27 }, { "x": 70.15, "y": 57.19 }, { "x": 58.68, "y": 57.19 } ] },
    { "id": "f4", "points": [ { "x": 77.61, "y": 35.26 }, { "x": 92.28, "y": 33.4 }, { "x": 93.08, "y": 57.02 }, { "x": 78.15, "y": 57.19 } ] }
];

const SIGN_INVIA_MOBILE: Point[] = [ { "x": 6.67, "y": 80.16 }, { "x": 30.2, "y": 80.32 }, { "x": 30.47, "y": 94.9 }, { "x": 6.4, "y": 94.91 } ];
const SIGN_GALLERY_MOBILE: Point[] = [ { "x": 35.0, "y": 60.0 }, { "x": 98.0, "y": 60.0 }, { "x": 98.0, "y": 99.0 }, { "x": 35.0, "y": 99.0 } ];

const FRAMES_DESKTOP: FrameConfig[] = [
    { "id": "f1", "points": [ { "x": 31.68, "y": 32.85 }, { "x": 31.38, "y": 57.83 }, { "x": 38.19, "y": 57.61 }, { "x": 38.49, "y": 33.75 } ] },
    { "id": "f2", "points": [ { "x": 41.4, "y": 35.78 }, { "x": 41.2, "y": 57.61 }, { "x": 46.71, "y": 58.06 }, { "x": 47.01, "y": 37.13 } ] },
    { "id": "f3", "points": [ { "x": 53.13, "y": 37.13 }, { "x": 58.54, "y": 36.23 }, { "x": 58.94, "y": 57.83 }, { "x": 53.23, "y": 58.06 } ] },
    { "id": "f4", "points": [ { "x": 61.15, "y": 34.43 }, { "x": 67.96, "y": 32.63 }, { "x": 68.46, "y": 57.83 }, { "x": 61.25, "y": 57.83 } ] }
];

const SIGN_INVIA_DESKTOP: Point[] = [ { "x": 23.86, "y": 79.43 }, { "x": 23.96, "y": 94.43 }, { "x": 35.87, "y": 94.43 }, { "x": 35.17, "y": 78.53 } ];
const SIGN_GALLERY_DESKTOP: Point[] = [ { "x": 45.0, "y": 70.0 }, { "x": 85.0, "y": 70.0 }, { "x": 85.0, "y": 99.0 }, { "x": 45.0, "y": 99.0 } ];

const renderPolygonalArea = (points: Point[], content: React.ReactNode, onClick: () => void, zIndex: number = 10, useClipPath: boolean = true) => {
    if (points.length < 3) return null;
    const xs = points.map(p => p.x); const ys = points.map(p => p.y);
    const minX = Math.min(...xs); const maxX = Math.max(...xs);
    const minY = Math.min(...ys); const maxY = Math.max(...ys);
    const width = maxX - minX; const height = maxY - minY;
    const polygonPoints = points.map(p => `${(p.x - minX) / width * 100}% ${(p.y - minY) / height * 100}%`).join(', ');
    return (
        <div onClick={onClick} className="absolute cursor-pointer" style={{ top: `${minY}%`, left: `${minX}%`, width: `${width}%`, height: `${height}%`, zIndex, clipPath: useClipPath ? `polygon(${polygonPoints})` : 'none' }}>
            {content}
        </div>
    );
};

interface FanArtGalleryProps { setView?: (view: AppView) => void; }

const FanArtGallery: React.FC<FanArtGalleryProps> = ({ setView }) => {
  const [gallery, setGallery] = useState<FanArt[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState<FanArt | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Gestione Audio e Video sincronizzata
  const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
        const data = await getFanArt();
        setGallery(data);
    };
    fetchGallery();
    const imgM = new Image(); imgM.src = MUSEUM_BG_MOBILE;
    const imgD = new Image(); imgD.src = MUSEUM_BG_DESKTOP;
    let loadedCount = 0;
    const checkLoad = () => { loadedCount++; if (loadedCount >= 1) setBgLoaded(true); };
    imgM.onload = checkLoad; imgD.onload = checkLoad;

    // Inizializzazione Audio specifico per il Museo
    if (!audioRef.current) {
        audioRef.current = new Audio(MUSEUM_VOICE_URL);
        audioRef.current.loop = false;
        audioRef.current.volume = 0.5;

        audioRef.current.addEventListener('play', () => setIsPlaying(true));
        audioRef.current.addEventListener('pause', () => setIsPlaying(false));
        audioRef.current.addEventListener('ended', () => {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.currentTime = 0;
        });
    }

    // Avvio automatico se l'audio è già attivo globalmente
    if (isAudioOn) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }

    // Listener per cambiamenti audio globali dall'header
    const handleGlobalAudioChange = () => {
        const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
        setIsAudioOn(enabled);
        if (enabled) {
            audioRef.current?.play().catch(() => {});
        } else {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
        }
    };
    window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

    setTimeout(() => setBgLoaded(true), 2000);
    window.scrollTo(0, 0);

    return () => {
        window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };
  }, []);

  const renderInteractives = (isDesktop: boolean) => {
      const activeFrames = isDesktop ? FRAMES_DESKTOP : FRAMES_MOBILE;
      const activeSignInvia = isDesktop ? SIGN_INVIA_DESKTOP : SIGN_INVIA_MOBILE;
      const activeSignGallery = isDesktop ? SIGN_GALLERY_DESKTOP : SIGN_GALLERY_MOBILE;
      
      return (
      <>
        {activeFrames.map((frame, index) => {
            const art = gallery[index];
            return renderPolygonalArea(frame.points, (
                <div className="w-full h-full bg-[#1a1a1a] relative">
                    {art && <img src={art.image} alt={art.author} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                </div>
            ), () => { if (art) setSelectedArt(art); }, 20);
        })}

        {/* TASTO INVIA DISEGNO */}
        {renderPolygonalArea(activeSignInvia, (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
                <img src={BTN_INVIA_DISEGNO} alt="Invia Disegno" className="w-32 md:w-56 h-auto drop-shadow-lg" />
            </div>
        ), () => setIsSendModalOpen(true), 30, false)}

        {renderPolygonalArea(activeSignGallery, (
            <div className="w-full h-full relative pointer-events-none">
                <div onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }} className="absolute bottom-20 md:bottom-28 left-0 pointer-events-auto cursor-pointer">
                    <img src={BTN_VAI_GALLERIA} alt="Galleria" className="w-24 md:w-32 h-auto drop-shadow-lg" />
                </div>
                <div onClick={(e) => { e.stopPropagation(); if (setView) setView(AppView.CITY_MAP); }} className="absolute bottom-2 right-0 pointer-events-auto cursor-pointer">
                    <img src={BTN_TORNA_CITTA} alt="Vai in Città" className="w-32 md:w-44 h-auto drop-shadow-xl" />
                </div>
            </div>
        ), () => {}, 30, false)}
      </>
      );
  };

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-indigo-900 overflow-hidden touch-none overscroll-none select-none">
        {!bgLoaded && (
            <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-amber-800/95 backdrop-blur-md">
                <img src={OFFICIAL_LOGO} alt="Loading" className="w-32 h-32 animate-spin-horizontal mb-4" />
                <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">STO CARICANDO...</span>
            </div>
        )}

        {/* Mini TV di Boo - Posizionato a SINISTRA */}
        {bgLoaded && isAudioOn && isPlaying && (
            <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                    <video 
                        src={BOO_TALK_VIDEO}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ 
                            mixBlendMode: 'screen',
                            filter: 'contrast(1.1) brightness(1.1)'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                </div>
            </div>
        )}

        <div className="relative w-full h-full overflow-hidden">
            <div className="block md:hidden absolute inset-0 w-full h-full overflow-hidden">
                <img src={MUSEUM_BG_MOBILE} alt="Museo Mobile" className={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} />
                {bgLoaded && renderInteractives(false)}
            </div>

            <div className="hidden md:block absolute inset-0 w-full h-full overflow-hidden">
                <img src={MUSEUM_BG_DESKTOP} alt="Museo Desktop" className={`absolute inset-0 w-full h-full object-fill object-center transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`} />
                {bgLoaded && renderInteractives(true)}
            </div>
        </div>

        {isSendModalOpen && <SendDrawingModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} />}

        {isGalleryOpen && (
            <div className="fixed inset-0 z-[200] bg-[#2a0404] flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto pt-[64px] md:pt-[96px]">
                <div className="flex justify-between items-center p-4 bg-[#2a0404] border-b-4 border-[#d4af37] shrink-0 sticky top-0 z-10">
                    <h2 className="text-2xl md:text-4xl font-black text-[#d4af37] uppercase tracking-tight">Galleria dei Piccoli Artisti</h2>
                    <button onClick={() => setIsGalleryOpen(false)} className="bg-[#d4af37] text-[#2a0404] p-2 rounded-full transition-transform active:scale-95"><X size={24} strokeWidth={3} /></button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 p-4 md:p-8">
                    {gallery.map((art) => (
                        <div key={art.id} className="relative cursor-pointer flex flex-col items-center" onClick={() => setSelectedArt(art)}>
                            <div className="relative w-full aspect-square bg-[#1a1a1a] shadow-2xl p-2 border-[6px] md:border-[10px] border-[#5D4037] outline outline-2 md:outline-4 outline-[#3E2723] overflow-hidden">
                                <img src={art.image} alt={art.author} className="w-full h-full object-cover" />
                            </div>
                            <div className="mt-4 bg-yellow-400 px-4 py-1 rounded-full border-2 border-black shadow-md"><p className="text-[10px] md:text-xs font-black text-blue-900 uppercase">{art.author}</p></div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {selectedArt && (
            <div className="fixed inset-0 z-[250] bg-black/95 flex flex-col items-center justify-center p-4 animate-in zoom-in duration-300" onClick={() => setSelectedArt(null)}>
                <button className="absolute top-20 right-4 bg-red-500 text-white p-3 rounded-full border-4 border-black shadow-lg transition-all active:scale-95 z-50"><X size={32} strokeWidth={4} /></button>
                <div className="relative max-w-full max-h-[75vh]">
                    <img src={selectedArt.image} alt={selectedArt.author} className="max-w-full max-h-full object-contain rounded-xl border-8 border-white shadow-[0_0_50px_rgba(255,255,255,0.3)]" />
                </div>
                <div className="text-center mt-6">
                    <h3 className="text-4xl md:text-6xl font-cartoon text-white uppercase tracking-tighter" style={{ WebkitTextStroke: '1px #fbbf24' }}>"{selectedArt.author}"</h3>
                    <p className="text-yellow-400 font-black text-xl md:text-2xl mt-2 uppercase tracking-widest">{selectedArt.age} • {selectedArt.city}</p>
                </div>
            </div>
        )}
    </div>
  );
};

export default FanArtGallery;
