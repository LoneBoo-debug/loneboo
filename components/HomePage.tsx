import React, { useState } from 'react';
import { AppView } from '../types';
import { HOME_BG_MOBILE, HOME_BG_DESKTOP } from '../constants';
import { LOCAL_ASSET_MAP } from '../services/LocalAssets';
import { X, Check, Star, Trophy } from 'lucide-react';
import NewsletterModal from './NewsletterModal';
import OptimizedImage from './OptimizedImage';

interface HomePageProps {
    setView: (view: AppView) => void;
    lastView?: AppView | null;
}

// ASSETS
const CONTEST_LOGO = 'https://i.postimg.cc/LX7J1C7n/logoconcorso.png';
const BTN_STAY_UPDATED = 'https://i.postimg.cc/VkQKrVmX/rimani-aggiornato-(1).png';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

// ZONES CONFIGURATION (Mobile)
const ZONES_MOBILE = [
  {
    id: AppView.CITY_MAP,
    points: [
      { x: 13.06, y: 64.82 },
      { x: 13.33, y: 83.39 },
      { x: 41.31, y: 82.56 },
      { x: 40.25, y: 64.49 }
    ]
  },
  {
    id: AppView.BOO_HOUSE,
    points: [
      { x: 60.5, y: 64.16 },
      { x: 60.5, y: 82.39 },
      { x: 89.82, y: 83.39 },
      { x: 90.09, y: 64.66 }
    ]
  }
];

// ZONES CONFIGURATION (Desktop) - CALIBRATED
const ZONES_DESKTOP = [
  {
    id: AppView.CITY_MAP,
    points: [
      { x: 37.25, y: 64.26 },
      { x: 37.14, y: 84.29 },
      { x: 47.06, y: 84.29 },
      { x: 47.06, y: 64.48 }
    ]
  },
  {
    id: AppView.BOO_HOUSE,
    points: [
      { x: 53.8, y: 64.7 },
      { x: 53.6, y: 82.75 },
      { x: 64.02, y: 84.29 },
      { x: 63.92, y: 64.48 }
    ]
  }
];

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
    const [isContestOpen, setIsContestOpen] = useState(false);
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
    
    const getClipPath = (points: { x: number; y: number }[]) => {
        const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
        return `polygon(${poly})`;
    };

    const handleNavigation = (view: AppView) => {
        setView(view);
    };

    const handleOpenNewsletter = () => {
        setIsContestOpen(false);
        setIsNewsletterOpen(true);
    };

    return (
        <>
            {/* --- MOBILE VIEW --- */}
            <div className="md:hidden fixed inset-0 top-[64px] z-0 overflow-hidden bg-black">
                <div className="w-full h-full relative">
                    {/* Fixed: removed priority="high" because OptimizedImage does not support it */}
                    <OptimizedImage 
                        src={HOME_BG_MOBILE} 
                        alt="Home Background Mobile" 
                        className="w-full h-full pointer-events-none select-none"
                    />
                    
                    {ZONES_MOBILE.map((zone, index) => (
                        <div
                            key={index}
                            onClick={() => handleNavigation(zone.id)}
                            className="absolute inset-0 cursor-pointer active:bg-white/10 transition-colors pointer-events-auto"
                            style={{ clipPath: getClipPath(zone.points) }}
                        />
                    ))}
                </div>

                {/* UI ELEMENTS - LEFT (CONTEST) */}
                <div className="absolute top-4 left-4 z-20">
                    <button 
                        onClick={() => setIsContestOpen(true)}
                        className="hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none touch-manipulation"
                    >
                        <OptimizedImage 
                            src={CONTEST_LOGO}
                            alt="Concorso"
                            className="w-20 h-auto drop-shadow-md pointer-events-none animate-float"
                        />
                    </button>
                </div>
            </div>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:flex fixed inset-0 top-[96px] z-0 bg-black items-center justify-center overflow-hidden">
                <div className="relative w-full h-full shadow-2xl">
                    {/* Fixed: removed priority="high" because OptimizedImage does not support it */}
                    <OptimizedImage 
                        src={HOME_BG_DESKTOP} 
                        alt="Home Background Desktop" 
                        className="w-full h-full pointer-events-none select-none"
                    />

                    {ZONES_DESKTOP.map((zone, index) => (
                        <div
                            key={index}
                            onClick={() => handleNavigation(zone.id)}
                            className="absolute inset-0 cursor-pointer hover:bg-white/10 active:bg-white/20 transition-colors pointer-events-auto"
                            style={{ clipPath: getClipPath(zone.points) }}
                            title={zone.id === AppView.CITY_MAP ? "Vai in Città" : "Vai a Casa Boo"}
                        />
                    ))}
                </div>

                {/* UI ELEMENTS - LEFT */}
                <div className="absolute top-[5%] left-[5%] z-20">
                    <button 
                        onClick={() => setIsContestOpen(true)}
                        className="hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none"
                    >
                        <OptimizedImage 
                            src={CONTEST_LOGO}
                            alt="Concorso"
                            className="w-[9vw] h-auto drop-shadow-xl pointer-events-none animate-float"
                        />
                    </button>
                </div>
            </div>

            {/* --- CONTEST BANNER MODAL --- */}
            {isContestOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setIsContestOpen(false)}>
                    <div 
                        className="bg-white relative w-full max-w-md p-8 rounded-[40px] border-8 border-yellow-400 shadow-[8px_8px_0px_0px_black] animate-in zoom-in-95 duration-300 flex flex-col items-center text-center"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Star */}
                        <div className="absolute -top-8 -left-8 text-yellow-400 animate-spin-slow">
                            <Star size={64} fill="currentColor" strokeWidth={1} />
                        </div>

                        {/* Custom Close Button */}
                        <button 
                            onClick={() => setIsContestOpen(false)}
                            className="absolute top-4 right-4 hover:scale-110 active:scale-95 transition-all outline-none z-10"
                        >
                            <OptimizedImage 
                                src={BTN_CLOSE_IMG} 
                                alt="Chiudi" 
                                className="w-14 h-14 md:w-18 md:h-18 object-contain drop-shadow-xl" 
                            />
                        </button>

                        <div className="mb-4">
                            <OptimizedImage 
                                src={CONTEST_LOGO} 
                                alt="Concorso" 
                                className="w-40 h-auto drop-shadow-lg animate-float"
                            />
                        </div>

                        <h2 className="text-3xl font-black text-boo-purple mb-4 leading-tight">
                            Novità in Arrivo!
                        </h2>

                        <p className="text-gray-700 font-bold text-lg mb-8 leading-relaxed">
                            Stiamo preparando dei nuovi concorsi magici per vincere premi fantastici direttamente qui nell'app in totale sicurezza!<br/><br/>
                            Torna a trovarci presto. 🎁
                        </p>

                        <button 
                            onClick={handleOpenNewsletter}
                            className="w-full hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                            <OptimizedImage 
                                src={BTN_STAY_UPDATED} 
                                alt="Rimani Aggiornato" 
                                className="w-full h-auto drop-shadow-lg"
                            />
                        </button>
                    </div>
                </div>
            )}

            {/* --- NEWSLETTER MODAL --- */}
            {isNewsletterOpen && (
                <NewsletterModal onClose={() => setIsNewsletterOpen(false)} />
            )}
        </>
    );
};

export default HomePage;