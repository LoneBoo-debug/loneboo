import React, { useState, useEffect } from 'react';
import { BOOKS } from '../constants';
import { ShoppingCart, Star, X, Loader2 } from 'lucide-react';
import { Book } from '../types';
import RobotHint from './RobotHint';

const LIBRARY_BG_MOBILE = 'https://i.postimg.cc/L4GpYBGK/bibliot.jpg';
const LIBRARY_BG_DESKTOP = 'https://i.postimg.cc/52wDc7cS/biblio169.jpg';
const AMAZON_STORE_URL = 'https://www.amazon.it/stores/Lone-Boo/author/B0G3JTJSTB?ref=sr_ntt_srch_lnk_3&qid=1765027075&sr=8-3&isDramIntegrated=true&shoppingPortalEnabled=true';

type Point = { x: number; y: number };
type ZoneConfig = {
    id: string; 
    points: Point[];
};

// ZONE CALIBRATE (MOBILE)
const ZONES_MOBILE: ZoneConfig[] = [
  {
    "id": "book3",
    "points": [
      { "x": 41.58, "y": 8.08 },
      { "x": 57.84, "y": 8.08 },
      { "x": 57.84, "y": 27.1 },
      { "x": 41.58, "y": 27.1 }
    ]
  },
  {
    "id": "book1",
    "points": [
      { "x": 40.98, "y": 39.33 },
      { "x": 57.97, "y": 39.15 },
      { "x": 57.97, "y": 56.57 },
      { "x": 41.31, "y": 56.39 }
    ]
  },
  {
    "id": "book2",
    "points": [
      { "x": 40.25, "y": 69.81 },
      { "x": 40.51, "y": 87.76 },
      { "x": 58.9, "y": 87.94 },
      { "x": 59.17, "y": 69.63 }
    ]
  },
  {
    "id": "amazon_link_1",
    "points": [
      { "x": 5.86, "y": 44.15 },
      { "x": 12.79, "y": 53.66 },
      { "x": 32.52, "y": 45.76 },
      { "x": 26.12, "y": 37.69 }
    ]
  },
  {
    "id": "amazon_link_2",
    "points": [
      { "x": 21.06, "y": 30.15 },
      { "x": 21.06, "y": 35 },
      { "x": 32.25, "y": 35.71 },
      { "x": 31.98, "y": 30.51 }
    ]
  }
];

// ZONE DEFINITIVE (DESKTOP)
const ZONES_DESKTOP: ZoneConfig[] = [
  {
    "id": "book3",
    "points": [
      { "x": 46.28, "y": 7.61 },
      { "x": 46.28, "y": 27.54 },
      { "x": 53.51, "y": 27.8 },
      { "x": 53.62, "y": 7.08 }
    ]
  },
  {
    "id": "book1",
    "points": [
      { "x": 45.95, "y": 39.34 },
      { "x": 45.95, "y": 57.96 },
      { "x": 53.96, "y": 57.7 },
      { "x": 53.85, "y": 39.6 }
    ]
  },
  {
    "id": "book2",
    "points": [
      { "x": 46.17, "y": 70.55 },
      { "x": 46.06, "y": 88.13 },
      { "x": 53.74, "y": 88.13 },
      { "x": 53.74, "y": 70.55 }
    ]
  },
  {
    "id": "amazon_link_1",
    "points": [
      { "x": 31.27, "y": 43.8 },
      { "x": 34.54, "y": 54.82 },
      { "x": 43.35, "y": 46.42 },
      { "x": 40.3, "y": 37.77 }
    ]
  },
  {
    "id": "amazon_link_2",
    "points": [
      { "x": 38.16, "y": 30.42 },
      { "x": 38.04, "y": 36.98 },
      { "x": 42.79, "y": 36.98 },
      { "x": 42.67, "y": 29.38 }
    ]
  }
];

const BookDetailsModal: React.FC<{ book: Book; onClose: () => void }> = ({ book, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300 backdrop-blur-sm" onClick={onClose}>
            {/* Modal Container with Max Height and Flex Layout */}
            <div className="relative w-full max-w-lg bg-white rounded-[30px] md:rounded-[40px] border-4 border-black shadow-[0_0_50px_rgba(251,191,36,0.6)] animate-in zoom-in duration-300 flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button - Absolute inside the container to avoid cutoff */}
                <div className="absolute top-2 right-2 z-50">
                    <button 
                        onClick={onClose}
                        className="bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-90 transition-transform shadow-lg"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Scrollable Content Area */}
                <div className="overflow-y-auto p-6 md:p-8 flex flex-col items-center custom-scrollbar w-full">
                    
                    {/* Book Cover */}
                    <div className="w-32 h-48 md:w-40 md:h-56 flex-shrink-0 relative group mb-6 mt-4">
                       <div className="absolute inset-0 bg-black/30 rounded-r-lg transform rotate-[-6deg] translate-x-3 translate-y-3 blur-sm"></div>
                       <div className="relative w-full h-full transform rotate-[-6deg] transition-transform duration-300 hover:rotate-0 hover:scale-105">
                          <div className="absolute top-[2px] bottom-[2px] -left-3 w-4 bg-gray-900 border-l border-gray-700 rounded-l-sm transform skew-y-[0deg]"></div>
                          <img 
                            src={book.coverImage} 
                            alt={book.title} 
                            className="relative w-full h-full object-cover rounded-r-md border-r-2 border-b-2 border-t-2 border-white/20 shadow-[inset_4px_0_10px_rgba(0,0,0,0.3)]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none rounded-r-md"></div>
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/20 to-transparent"></div>
                       </div>
                    </div>

                    {/* Title & Info */}
                    <h3 className="text-xl md:text-3xl font-black text-gray-800 mb-2 leading-tight text-center">{book.title}</h3>
                    {book.subtitle && (
                        <p className="text-boo-purple font-black text-base md:text-lg mb-3 leading-tight text-center uppercase tracking-wide">{book.subtitle}</p>
                    )}
                    <div className="flex justify-center gap-1 mb-4">
                        {[1,2,3,4,5].map(s => <Star key={s} size={24} className="text-yellow-400 fill-current" />)}
                    </div>

                    {/* Description - Scrolls if long */}
                    <div className="text-gray-600 font-medium mb-8 text-sm md:text-base leading-relaxed text-left w-full">
                        {book.description}
                    </div>

                    {/* CTA Button */}
                    <a 
                        href={book.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-yellow-400 text-black text-lg font-black px-8 py-4 rounded-full border-4 border-black hover:scale-105 active:scale-95 transition-all shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 shrink-0"
                    >
                        <ShoppingCart size={24} strokeWidth={3} />
                        LO VOGLIO!
                    </a>
                </div>
            </div>
        </div>
    );
};

const BookShelf: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
      // Preload both images
      const imgMobile = new Image();
      imgMobile.src = LIBRARY_BG_MOBILE;
      const imgDesktop = new Image();
      imgDesktop.src = LIBRARY_BG_DESKTOP;

      let loadedCount = 0;
      const checkLoad = () => {
          loadedCount++;
          if (loadedCount >= 1) setIsLoaded(true);
      };

      imgMobile.onload = checkLoad;
      imgDesktop.onload = checkLoad;

      // Fallback
      setTimeout(() => setIsLoaded(true), 1500);

      window.scrollTo(0, 0);

      const timer = setTimeout(() => {
          if (!activeBook) setShowHint(true);
      }, 5000); 

      return () => clearTimeout(timer);
  }, []); 

  const handleInteraction = () => {
      if (showHint) setShowHint(false);
  };

  const getPositioning = (points: Point[]) => {
      if (points.length < 3) return null;
      const xs = points.map(p => p.x);
      const ys = points.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const width = maxX - minX;
      const height = maxY - minY;
      const localPoints = points.map(p => {
          const lx = ((p.x - minX) / width) * 100;
          const ly = ((p.y - minY) / height) * 100;
          return `${lx}% ${ly}%`;
      });
      return {
          style: {
              top: `${minY}%`,
              left: `${minX}%`,
              width: `${width}%`,
              height: `${height}%`,
              clipPath: `polygon(${localPoints.join(', ')})`
          }
      };
  };

  const getSimpleClipPath = (points: Point[]) => {
      const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
      return `polygon(${poly})`;
  };

  const renderZones = (zones: ZoneConfig[], isDesktop: boolean) => {
      return zones.map((zone) => {
          const book = BOOKS.find(b => b.id === zone.id);
          
          if (book) {
              const pos = getPositioning(zone.points);
              if (!pos) return null;
              return (
                  <div
                      key={zone.id}
                      onClick={(e) => { e.stopPropagation(); setShowHint(false); setActiveBook(book); }}
                      className="absolute group z-20 cursor-pointer"
                      style={pos.style}
                      title={book.title}
                  >
                      {/* Render Book Cover Image specifically for Mobile Zones, 
                          OR if we are on Desktop and have valid points (not empty) */}
                      {(isDesktop ? zone.points.length > 0 : true) && (
                          <img 
                              src={book.coverImage} 
                              alt={book.title} 
                              className="w-full h-full object-fill transform transition-transform duration-300 group-hover:scale-105 relative z-10"
                          />
                      )}
                  </div>
              );
          } 
          else if (zone.id.startsWith('amazon_link')) {
              if (zone.points.length < 3) return null;
              return (
                  <a
                      key={zone.id}
                      href={AMAZON_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute group z-20 cursor-pointer"
                      style={{ clipPath: getSimpleClipPath(zone.points), inset: 0 }}
                      title="Vai allo Store Amazon"
                      onClick={() => setShowHint(false)}
                  ></a>
              );
          }
          return null;
      });
  };

  return (
    <div 
        className="relative w-full h-[calc(100vh-75px)] md:h-[calc(100vh-106px)] bg-amber-900 overflow-hidden flex flex-col"
        onClick={handleInteraction}
    >
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-900 z-50">
                <span className="text-white font-black text-2xl animate-pulse drop-shadow-md flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Entro in Biblioteca...
                </span>
            </div>
        )}

        <RobotHint 
            show={showHint && isLoaded && !activeBook} 
            message="Tocca un libro o vai allo store"
        />

        <div className="relative flex-1 w-full h-full overflow-hidden select-none">
            {/* --- MOBILE (VERTICALE) --- */}
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={LIBRARY_BG_MOBILE} 
                    alt="Lone Boo Biblioteca Mobile" 
                    className={`w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {/* Render Interactive Elements Mobile */}
                {isLoaded && renderZones(ZONES_MOBILE, false)}
            </div>

            {/* --- DESKTOP (ORIZZONTALE 16:9) --- */}
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={LIBRARY_BG_DESKTOP} 
                    alt="Lone Boo Biblioteca Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                
                {/* Render Interactive Elements Desktop */}
                {isLoaded && renderZones(ZONES_DESKTOP, true)}
            </div>
        </div>

        {activeBook && (
            <BookDetailsModal book={activeBook} onClose={() => setActiveBook(null)} />
        )}
    </div>
  );
};

export default BookShelf;