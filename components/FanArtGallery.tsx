
import React, { useState, useEffect, useRef } from 'react';
import { getFanArt } from '../services/data';
import { FanArt } from '../types';
import { Camera, Send, Loader2, Image as ImageIcon, MapPin, X, CheckCircle, PenTool, ArrowRight, LayoutGrid, Trash2 } from 'lucide-react';
import RobotHint from './RobotHint'; 

// =================================================================================================
// 🖼️ MUSEUM BACKGROUND IMAGES
// =================================================================================================
const MUSEUM_BG_MOBILE = 'https://i.postimg.cc/rmp2mHP4/museuuum.jpg';
const MUSEUM_BG_DESKTOP = 'https://i.postimg.cc/rFhND518/museo169.jpg';

// TYPE DEFINITIONS
type Point = { x: number; y: number };
type FrameConfig = {
    id: string;
    points: Point[]; 
};

// --- CONFIGURAZIONE MOBILE (Verticale) ---
const FRAMES_MOBILE: FrameConfig[] = [
    {
      "id": "frame1",
      "points": [
        { "x": 6.67, "y": 33.4 },
        { "x": 21.6, "y": 34.92 },
        { "x": 21.07, "y": 57.02 },
        { "x": 5.87, "y": 56.86 }
      ]
    },
    {
      "id": "frame2",
      "points": [
        { "x": 29.87, "y": 36.44 },
        { "x": 41.61, "y": 37.96 },
        { "x": 41.07, "y": 57.19 },
        { "x": 29.07, "y": 57.19 }
      ]
    },
    {
      "id": "frame3",
      "points": [
        { "x": 57.88, "y": 37.79 },
        { "x": 69.08, "y": 36.27 },
        { "x": 70.15, "y": 57.19 },
        { "x": 58.68, "y": 57.19 }
      ]
    },
    {
      "id": "frame4",
      "points": [
        { "x": 77.61, "y": 35.26 },
        { "x": 92.28, "y": 33.4 },
        { "x": 93.08, "y": 57.02 },
        { "x": 78.15, "y": 57.19 }
      ]
    }
];

const SIGN_INVIA_MOBILE: Point[] = [
    { "x": 6.67, "y": 82.16 },
    { "x": 27.2, "y": 81.32 },
    { "x": 27.47, "y": 87.9 },
    { "x": 6.4, "y": 88.91 }
];

const SIGN_GALLERY_MOBILE: Point[] = [
    { "x": 72.01, "y": 75.75 }, 
    { "x": 88.02, "y": 75.41 }, 
    { "x": 87.48, "y": 89.42 }, 
    { "x": 70.95, "y": 89.25 }
];

// --- CONFIGURAZIONE DESKTOP (Orizzontale 16:9) ---
const FRAMES_DESKTOP: FrameConfig[] = [
    {
      "id": "frame1",
      "points": [
        { "x": 31.68, "y": 32.85 },
        { "x": 31.38, "y": 57.83 },
        { "x": 38.19, "y": 57.61 },
        { "x": 38.49, "y": 33.75 }
      ]
    },
    {
      "id": "frame2",
      "points": [
        { "x": 41.4, "y": 35.78 },
        { "x": 41.2, "y": 57.61 },
        { "x": 46.71, "y": 58.06 },
        { "x": 47.01, "y": 37.13 }
      ]
    },
    {
      "id": "frame3",
      "points": [
        { "x": 53.13, "y": 37.13 },
        { "x": 58.54, "y": 36.23 },
        { "x": 58.94, "y": 57.83 },
        { "x": 53.23, "y": 58.06 }
      ]
    },
    {
      "id": "frame4",
      "points": [
        { "x": 61.15, "y": 34.43 },
        { "x": 67.96, "y": 32.63 },
        { "x": 68.46, "y": 57.83 },
        { "x": 61.25, "y": 57.83 }
      ]
    }
];

const SIGN_INVIA_DESKTOP: Point[] = [
    { "x": 23.86, "y": 79.43 },
    { "x": 23.96, "y": 88.43 },
    { "x": 30.87, "y": 88.43 },
    { "x": 31.17, "y": 78.53 }
];

const SIGN_GALLERY_DESKTOP: Point[] = [
    { "x": 64.66, "y": 81.46 },
    { "x": 64.76, "y": 92.26 },
    { "x": 72.57, "y": 92.93 },
    { "x": 72.37, "y": 81.23 }
];

const FanArtGallery: React.FC = () => {
  const [gallery, setGallery] = useState<FanArt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState<FanArt | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Upload Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Preload Both Images
    const imgMobile = new Image();
    imgMobile.src = MUSEUM_BG_MOBILE;
    const imgDesktop = new Image();
    imgDesktop.src = MUSEUM_BG_DESKTOP;

    let count = 0;
    const onLoad = () => {
        count++;
        if (count >= 1) setBgLoaded(true);
    };

    imgMobile.onload = onLoad;
    imgDesktop.onload = onLoad;
    
    // Fallback
    setTimeout(() => setBgLoaded(true), 2000);

    const fetchGallery = async () => {
        setLoading(true);
        const data = await getFanArt();
        setGallery(data);
        setLoading(false);
    };
    fetchGallery();

    const timer = setTimeout(() => {
        setShowHint(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleInteraction = () => {
      if (showHint) setShowHint(false);
  };

  // --- RENDER HELPER: 4-Point Container ---
  const renderPolygonalArea = (
      points: Point[], 
      content: React.ReactNode, 
      onClick: () => void, 
      zIndex: number = 10, 
      isButton: boolean = false,
      useClipPath: boolean = true
  ) => {
      
      if (points.length < 3) return null;

      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const width = maxX - minX;
      const height = maxY - minY;

      const polygonPoints = points.map(p => {
          const relX = ((p.x - minX) / width) * 100;
          const relY = ((p.y - minY) / height) * 100;
          return `${relX}% ${relY}%`;
      }).join(', ');

      return (
          <div
              key={`poly-${minX}-${minY}`}
              onClick={onClick}
              className={`absolute ${useClipPath ? 'overflow-hidden' : ''} ${isButton ? 'cursor-pointer group' : 'cursor-pointer group'}`}
              style={{
                  top: `${minY}%`,
                  left: `${minX}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                  zIndex: zIndex,
                  clipPath: useClipPath ? `polygon(${polygonPoints})` : 'none'
              }}
          >
              <div className="w-full h-full relative">
                  {content}
              </div>
          </div>
      );
  };

  // Form Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => { setImageFile(reader.result as string); };
          reader.readAsDataURL(file);
      }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setImageFile(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || !imageFile) return;
      setIsSubmitting(true);
      setSubmitStatus('IDLE');
      try {
          const response = await fetch('/api/send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, age, city, province, image: imageFile }),
          });
          if (response.ok) {
              setSubmitStatus('SUCCESS');
              setName(''); setAge(''); setCity(''); setProvince(''); setImageFile(null);
              setTimeout(() => { setIsFormOpen(false); setSubmitStatus('IDLE'); }, 3000);
          } else {
              setSubmitStatus('ERROR');
          }
      } catch (error) {
          setSubmitStatus('ERROR');
      }
      setIsSubmitting(false);
  };

  // Helper to render all interactive elements (reused for mobile and desktop)
  const renderInteractives = (isDesktop: boolean) => {
      const activeFrames = isDesktop ? FRAMES_DESKTOP : FRAMES_MOBILE;
      const activeSignInvia = isDesktop ? SIGN_INVIA_DESKTOP : SIGN_INVIA_MOBILE;
      const activeSignGallery = isDesktop ? SIGN_GALLERY_DESKTOP : SIGN_GALLERY_MOBILE;

      return (
      <>
        {/* --- FRAMES --- */}
        {activeFrames.map((frame, index) => {
            const art = gallery[index];
            const content = (
                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center relative"> 
                    {art ? (
                        <>
                            <img src={art.image} alt={art.author} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-2">
                                <p className="text-white font-black text-xs md:text-sm lg:text-base leading-tight mb-1">"{art.author}"</p>
                                <p className="text-yellow-400 font-bold text-[10px] md:text-xs">{art.age}</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center opacity-30"><ImageIcon className="text-white w-8 h-8 mb-1" /><span className="text-[8px] font-bold text-white">VUOTO</span></div>
                    )}
                    <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                </div>
            );
            
            return renderPolygonalArea(frame.points, content, () => art && setSelectedArt(art), 20, false, true);
        })}

        {/* --- SEND BUTTON (SIGN STAND STYLE) --- */}
        {renderPolygonalArea(activeSignInvia, (
            <div className="w-full h-full flex flex-col items-center justify-end group relative cursor-pointer">
                
                {/* The Sign Board (Blue for Invia) */}
                <div className="relative z-20 bg-[#1e3a8a] border-[3px] border-[#fbbf24] rounded-lg px-3 py-2 shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform origin-bottom flex items-center gap-2">
                    <div className="bg-[#fbbf24] rounded-full p-1 text-[#1e3a8a]">
                        <PenTool size={14} strokeWidth={4} />
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-[#fbbf24] font-serif font-bold uppercase tracking-widest leading-none">INVIA IL TUO</span>
                        <span className="text-white font-black text-xs md:text-sm tracking-wide whitespace-nowrap">DISEGNO</span>
                    </div>
                </div>

                {/* The Pole */}
                <div className="w-2 h-1/2 bg-gray-800 border-x border-gray-600 relative z-10 -mt-1"></div>

                {/* The Base (Perspective Oval) */}
                <div className="w-12 h-3 bg-gray-900 rounded-[50%] border-2 border-gray-700 shadow-lg relative z-0"></div>

            </div>
        ), () => setIsFormOpen(true), 30, true, false)}

        {/* --- GALLERY SIGN BUTTON (MUSEUM STAND STYLE) --- */}
        {renderPolygonalArea(activeSignGallery, (
            <div className="w-full h-full flex flex-col items-center justify-end group relative cursor-pointer">
                
                {/* The Sign Board */}
                <div className="relative z-20 bg-[#7f1d1d] border-[3px] border-[#fbbf24] rounded-lg px-3 py-2 shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform origin-bottom flex items-center gap-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-[#fbbf24] font-serif font-bold uppercase tracking-widest leading-none">MUSEO</span>
                        <span className="text-white font-black text-xs md:text-sm tracking-wide">GALLERIA</span>
                    </div>
                    <div className="bg-[#fbbf24] rounded-full p-1 text-[#7f1d1d]">
                        <ArrowRight size={14} strokeWidth={4} />
                    </div>
                </div>

                {/* The Pole */}
                <div className="w-2 h-1/2 bg-gray-800 border-x border-gray-600 relative z-10 -mt-1"></div>

                {/* The Base (Perspective Oval) */}
                <div className="w-12 h-3 bg-gray-900 rounded-[50%] border-2 border-gray-700 shadow-lg relative z-0"></div>

            </div>
        ), () => setIsGalleryOpen(true), 30, true, false)}
      </>
      );
  };

  return (
    <div className="relative w-full h-[calc(100vh-75px)] md:h-[calc(100vh-106px)] bg-amber-50 overflow-hidden flex flex-col"
        onClick={handleInteraction}
    >
        
        {/* LOADING */}
        {(!bgLoaded || loading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-100 z-50">
                <span className="text-amber-800 font-black text-2xl animate-pulse flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Apro il Museo...
                </span>
            </div>
        )}

        <RobotHint 
            show={showHint && bgLoaded} 
            message={`TOCCA I QUADRI\nPER VEDERLI\nDA VICINO!`}
        />

        {/* MAIN VISUAL AREA */}
        <div 
            ref={containerRef}
            className="relative flex-1 w-full h-full overflow-hidden select-none"
        >
            
            {/* --- MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={MUSEUM_BG_MOBILE} 
                    alt="Museo Lone Boo Mobile" 
                    className={`w-full h-full object-fill object-center animate-in fade-in duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {renderInteractives(false)}
            </div>

            {/* --- DESKTOP (ORIZZONTALE 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={MUSEUM_BG_DESKTOP} 
                    alt="Museo Lone Boo Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center animate-in fade-in duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {renderInteractives(true)}
            </div>

        </div>

        {/* --- MODAL: FULL GALLERY GRID --- */}
        {isGalleryOpen && (
            // Full Screen Overlay - Solid Background, Slide In
            <div className="fixed inset-0 z-[100] bg-[#450a0a] flex flex-col animate-in slide-in-from-right duration-500">
                
                {/* Baroque Wall Pattern Overlay */}
                <div 
                    className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" 
                    style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/baroque.png')` }} 
                ></div>

                {/* Vignette Effect for Depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,#2a0404_100%)] pointer-events-none"></div>

                {/* Header Area */}
                <div className="relative z-20 flex justify-between items-center p-4 bg-[#2a0404] border-b-4 border-[#78350f] shadow-lg">
                    <div className="flex flex-col">
                        <h2 className="text-2xl md:text-4xl font-black text-[#d4af37] drop-shadow-[2px_2px_0_#2a0404]" style={{ fontFamily: '"Titan One", cursive' }}>
                            Galleria
                        </h2>
                        <div className="h-1 w-full bg-[#d4af37] rounded-full mt-1 opacity-70"></div>
                    </div>
                    <button 
                        onClick={() => setIsGalleryOpen(false)}
                        className="bg-[#2a0404] text-[#d4af37] p-2 md:p-3 rounded-full border-4 border-[#d4af37] hover:scale-110 transition-transform shadow-lg"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Grid Container - Hiding Scrollbar */}
                <div 
                    className="flex-1 overflow-y-auto p-4 md:p-8"
                    style={{ 
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none' /* IE/Edge */
                    }}
                >
                    <style>{`
                        .overflow-y-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 pb-20">
                        {gallery.map((art) => (
                            <div 
                                key={art.id} 
                                className="relative group cursor-pointer flex flex-col items-center"
                                onClick={() => setSelectedArt(art)}
                            >
                                {/* Hanging String Illusion */}
                                <div className="absolute -top-8 w-px h-8 bg-gray-400 left-1/2 -translate-x-1/2 z-0"></div>
                                <div className="absolute -top-8 w-2 h-2 rounded-full bg-[#78350f] border border-black shadow-sm left-1/2 -translate-x-1/2 z-10"></div>
                                <div className="absolute -top-4 w-16 h-8 border-t-2 border-l-2 border-r-2 border-gray-400 border-b-0 rounded-t-full left-1/2 -translate-x-1/2 z-0"></div>

                                {/* Spotlight Effect on Wall behind frame */}
                                <div className="absolute inset-0 -m-8 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                {/* The Frame Container */}
                                <div 
                                    className="relative w-full aspect-square bg-[#1a1a1a] shadow-[0_15px_30px_rgba(0,0,0,0.7)] transform transition-transform duration-300 group-hover:scale-[1.02] z-10"
                                    style={{
                                        border: '14px solid #5D4037', // Medium Wood
                                        outline: '6px solid #3E2723', // Darker Outer Wood
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.8)' // Deep Shadow
                                    }}
                                >
                                    {/* Matting (Passepartout) */}
                                    <div className="w-full h-full bg-[#f5f5f0] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] p-3 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={art.image} 
                                            alt={art.author} 
                                            className="w-full h-full object-contain drop-shadow-md"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                
                                {/* Gold Plaque Label - Moved slightly down */}
                                <div className="mt-4 bg-gradient-to-b from-[#fcd34d] to-[#b45309] px-4 py-1.5 shadow-[0_2px_4px_black] text-center min-w-[70%] rounded-sm border border-[#78350f] relative z-20">
                                    <p className="text-[10px] md:text-xs font-serif font-black text-[#451a03] uppercase tracking-widest truncate">{art.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {gallery.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-[#d4af37]/50">
                            <LayoutGrid size={64} className="mb-4" />
                            <p className="text-xl font-bold font-serif">La galleria è vuota... Invia il primo capolavoro!</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* --- MODAL: UPLOAD FORM (Same as before) --- */}
        {isFormOpen && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white/90 backdrop-blur-md rounded-[30px] border-4 border-yellow-400 p-6 md:p-8 shadow-2xl w-full max-w-lg relative animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                    <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-md"><X size={24} /></button>
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-black text-yellow-600 mb-2">Il tuo Capolavoro</h3>
                        <p className="text-gray-600 font-bold text-sm">Compila il modulo per appendere il tuo disegno nel museo.</p>
                    </div>
                    {submitStatus === 'SUCCESS' ? (
                        <div className="text-center py-8"><CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" /><h4 className="text-2xl font-black text-green-600 mb-2">Inviato con Successo!</h4></div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-bold text-xs uppercase mb-1">Nome</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="Scrivi il tuo nome (Obbligatorio)" 
                                        className="w-full bg-white border-2 border-gray-300 rounded-xl p-3 font-bold focus:border-yellow-400 outline-none placeholder:text-gray-400 text-gray-800" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold text-xs uppercase mb-1">Età</label>
                                    <input 
                                        type="text" 
                                        value={age} 
                                        onChange={(e) => setAge(e.target.value)} 
                                        placeholder="Quanti anni hai?"
                                        className="w-full bg-white border-2 border-gray-300 rounded-xl p-3 font-bold focus:border-yellow-400 outline-none placeholder:text-gray-400 text-gray-800" 
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-bold text-xs uppercase mb-1">Città</label>
                                    <input 
                                        type="text" 
                                        value={city} 
                                        onChange={(e) => setCity(e.target.value)} 
                                        placeholder="Dove abiti?"
                                        className="w-full bg-white border-2 border-gray-300 rounded-xl p-3 font-bold focus:border-yellow-400 outline-none placeholder:text-gray-400 text-gray-800" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold text-xs uppercase mb-1">Prov.</label>
                                    <input 
                                        type="text" 
                                        value={province} 
                                        onChange={(e) => setProvince(e.target.value)} 
                                        maxLength={4} 
                                        placeholder="Es. MI"
                                        className="w-full bg-white border-2 border-gray-300 rounded-xl p-3 font-bold focus:border-yellow-400 outline-none placeholder:text-gray-400 text-gray-800" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-bold text-xs uppercase mb-1">Il tuo Capolavoro</label>
                                <div className={`border-4 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white ${imageFile ? 'border-green-400' : 'border-gray-300 hover:bg-gray-50'}`} onClick={() => fileInputRef.current?.click()}>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    {imageFile ? (
                                        <div className="relative w-full text-center">
                                            <img src={imageFile} alt="Preview" className="max-h-32 rounded-lg shadow-md mb-2 mx-auto" />
                                            <span className="text-green-600 font-black text-sm flex items-center justify-center gap-1"><CheckCircle size={16} /> Pronta!</span>
                                            
                                            {/* Remove Button */}
                                            <button 
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full border-2 border-white shadow-md hover:scale-110 hover:bg-red-600 transition-all z-10"
                                                title="Rimuovi immagine"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Camera size={40} className="mx-auto mb-1" />
                                            <span className="font-bold text-xs">Tocca per caricare foto (Obbligatorio)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" disabled={isSubmitting || !name || !imageFile} className="bg-yellow-400 text-black font-black text-lg py-4 rounded-xl border-b-4 border-yellow-600 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />} {isSubmitting ? 'INVIO...' : 'SPEDISCI A LONE BOO'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )}

        {/* --- MODAL: SINGLE IMAGE VIEW --- */}
        {selectedArt && (
            <div className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedArt(null)}>
                <button onClick={() => setSelectedArt(null)} className="absolute top-4 right-4 z-50 bg-red-500 text-white p-2 rounded-full border-2 border-white hover:scale-110 hover:bg-red-600 transition-all shadow-lg"><X size={32} strokeWidth={3} /></button>
                <div className="relative max-w-4xl w-full max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    <img src={selectedArt.image} alt={selectedArt.author} className="max-w-full max-h-[70vh] object-contain rounded-lg border-[10px] border-amber-900 shadow-[0_0_50px_rgba(255,255,255,0.2)] bg-white" />
                </div>
                <div className="mt-6 text-center" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-4xl font-black text-white mb-2 font-serif italic">"{selectedArt.author}"</h3>
                    <div className="flex flex-col items-center gap-1">
                        <div className="bg-amber-100 text-amber-900 px-4 py-1 rounded-full font-bold text-xl inline-block border-2 border-amber-800">{selectedArt.age}</div>
                        {(selectedArt.city || selectedArt.province) && <div className="text-gray-300 font-bold text-lg flex items-center gap-1 mt-2"><MapPin size={18} /> {selectedArt.city} {selectedArt.province ? `(${selectedArt.province})` : ''}</div>}
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default FanArtGallery;
    