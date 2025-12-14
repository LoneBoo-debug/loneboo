
import React, { useState } from 'react';
import { AppView } from '../types';
import { HOME_BG_MOBILE, HOME_BG_DESKTOP, APP_VERSION } from '../constants';
import { Info, Mail, ShieldAlert, Cpu, X, ExternalLink, Trophy, Star, Check, HelpCircle, BookOpen } from 'lucide-react';

interface HomePageProps {
    setView: (view: AppView) => void;
    lastView?: AppView | null;
}

// DECORATION IMAGE (SUN/CLOUD)
const DECORATION_TOP_LEFT = 'https://i.postimg.cc/bw5dnCs4/IMG-696ee7.png';
// CONTEST LOGO
const CONTEST_LOGO = 'https://i.postimg.cc/LX7J1C7n/logoconcorso.png';

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
    const [isCloudOpen, setIsCloudOpen] = useState(false);
    const [isContestOpen, setIsContestOpen] = useState(false);
    
    const getClipPath = (points: { x: number; y: number }[]) => {
        const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
        return `polygon(${poly})`;
    };

    const handleNavigation = (view: AppView) => {
        setIsCloudOpen(false);
        setView(view);
    };

    return (
        <>
            {/* --- MOBILE VIEW --- */}
            <div className="md:hidden fixed inset-0 top-[64px] z-0 overflow-hidden bg-black">
                <div className="w-full h-full relative">
                    <img 
                        src={HOME_BG_MOBILE} 
                        alt="Home Background Mobile" 
                        className="w-full h-full object-fill object-bottom animate-fade-in pointer-events-none select-none"
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

                {/* UI ELEMENTS - LEFT */}
                <div className="absolute top-4 left-4 z-20">
                    <button 
                        onClick={() => setIsCloudOpen(true)}
                        className="hover:scale-110 active:scale-95 transition-transform cursor-pointer outline-none touch-manipulation"
                    >
                        <img 
                            src={DECORATION_TOP_LEFT}
                            alt="Menu Nuvola"
                            className="w-14 h-auto drop-shadow-md pointer-events-none"
                        />
                    </button>
                </div>

                {/* UI ELEMENTS - RIGHT (CONTEST) */}
                <div className="absolute top-4 right-4 z-20">
                    <button 
                        onClick={() => setIsContestOpen(true)}
                        className="hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none touch-manipulation"
                    >
                        <img 
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
                    <img 
                        src={HOME_BG_DESKTOP} 
                        alt="Home Background Desktop" 
                        className="w-full h-full object-fill animate-fade-in pointer-events-none select-none"
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
                        onClick={() => setIsCloudOpen(true)}
                        className="hover:scale-110 active:scale-95 transition-transform cursor-pointer outline-none"
                    >
                        <img 
                            src={DECORATION_TOP_LEFT}
                            alt="Menu Nuvola"
                            className="w-[6vw] h-auto drop-shadow-xl pointer-events-none"
                        />
                    </button>
                </div>

                {/* UI ELEMENTS - RIGHT */}
                <div className="absolute top-[5%] right-[5%] z-20">
                    <button 
                        onClick={() => setIsContestOpen(true)}
                        className="hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none"
                    >
                        <img 
                            src={CONTEST_LOGO}
                            alt="Concorso"
                            className="w-[9vw] h-auto drop-shadow-xl pointer-events-none animate-float"
                        />
                    </button>
                </div>
            </div>

            {/* --- CLOUD MENU MODAL (FUMETTOSO) --- */}
            {isCloudOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setIsCloudOpen(false)}>
                    
                    {/* Cloud Container */}
                    <div 
                        className="bg-white relative w-full max-w-md p-8 rounded-[50px] border-8 border-black shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] animate-in zoom-in-95 duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Decorative Cloud Bumps */}
                        <div className="absolute -top-10 left-10 w-24 h-24 bg-white rounded-full border-t-8 border-l-8 border-black z-0"></div>
                        <div className="absolute -top-16 right-20 w-32 h-32 bg-white rounded-full border-t-8 border-r-8 border-black z-0"></div>
                        <div className="absolute -bottom-10 right-10 w-24 h-24 bg-white rounded-full border-b-8 border-r-8 border-black z-0"></div>

                        {/* Close Button */}
                        <button 
                            onClick={() => setIsCloudOpen(false)}
                            className="absolute top-4 right-4 z-20 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 transition-transform shadow-[2px_2px_0_black]"
                        >
                            <X size={24} strokeWidth={4} />
                        </button>

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <h2 className="text-4xl font-black text-blue-500 mb-2 drop-shadow-[2px_2px_0_black]" style={{ textShadow: "2px 2px 0px black" }}>
                                INFO
                            </h2>
                            <p className="text-gray-600 font-bold mb-4">Tutto quello che devi sapere!</p>

                            <div className="grid grid-cols-1 gap-2">
                                {/* NEW: GUIDE BUTTON */}
                                <button 
                                    onClick={() => handleNavigation(AppView.GUIDE)}
                                    className="flex items-center gap-3 bg-green-500 p-3 rounded-2xl border-4 border-black shadow-[3px_3px_0_black] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all group text-left"
                                >
                                    <div className="bg-white p-1.5 rounded-xl border-2 border-black group-hover:scale-110 transition-transform">
                                        <BookOpen size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <span className="block font-black text-white text-base uppercase">Come usare l'App</span>
                                        <span className="block text-[10px] font-bold text-white/80">Guida all'Avventura</span>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => handleNavigation(AppView.ABOUT)}
                                    className="flex items-center gap-3 bg-yellow-400 p-3 rounded-2xl border-4 border-black shadow-[3px_3px_0_black] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all group text-left"
                                >
                                    <div className="bg-white p-1.5 rounded-xl border-2 border-black group-hover:rotate-6 transition-transform">
                                        <Info size={20} className="text-yellow-600" />
                                    </div>
                                    <div>
                                        <span className="block font-black text-black text-base uppercase">Chi Siamo</span>
                                        <span className="block text-[10px] font-bold text-black/70">La storia di Lone Boo</span>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => handleNavigation(AppView.FAQ)}
                                    className="flex items-center gap-3 bg-orange-400 p-3 rounded-2xl border-4 border-black shadow-[3px_3px_0_black] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all group text-left"
                                >
                                    <div className="bg-white p-1.5 rounded-xl border-2 border-black group-hover:-rotate-6 transition-transform">
                                        <HelpCircle size={20} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <span className="block font-black text-black text-base uppercase">FAQ</span>
                                        <span className="block text-[10px] font-bold text-black/70">Domande Frequenti</span>
                                    </div>
                                </button>

                                <a 
                                    href="mailto:support@loneboo.online"
                                    className="flex items-center gap-3 bg-blue-500 p-3 rounded-2xl border-4 border-black shadow-[3px_3px_0_black] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all group text-left"
                                >
                                    <div className="bg-white p-1.5 rounded-xl border-2 border-black group-hover:-rotate-6 transition-transform">
                                        <Mail size={20} className="text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-black text-white text-base uppercase">Contatti</span>
                                        <span className="block text-[10px] font-bold text-white/80">Scrivici una mail!</span>
                                    </div>
                                    <ExternalLink size={14} className="text-white opacity-60" />
                                </a>

                                <button 
                                    onClick={() => handleNavigation(AppView.DISCLAIMER)}
                                    className="flex items-center gap-3 bg-red-500 p-3 rounded-2xl border-4 border-black shadow-[3px_3px_0_black] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all group text-left"
                                >
                                    <div className="bg-white p-1.5 rounded-xl border-2 border-black group-hover:rotate-6 transition-transform">
                                        <ShieldAlert size={20} className="text-red-600" />
                                    </div>
                                    <div>
                                        <span className="block font-black text-white text-base uppercase">Disclaimer</span>
                                        <span className="block text-[10px] font-bold text-white/80">Privacy & Sicurezza</span>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => handleNavigation(AppView.TECH_INFO)}
                                    className="flex items-center gap-3 bg-purple-500 p-3 rounded-2xl border-4 border-black shadow-[3px_3px_0_black] hover:scale-[1.02] active:shadow-none active:translate-y-1 transition-all group text-left"
                                >
                                    <div className="bg-white p-1.5 rounded-xl border-2 border-black group-hover:-rotate-6 transition-transform">
                                        <Cpu size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <span className="block font-black text-white text-base uppercase">Tecnologia</span>
                                        <span className="block text-[10px] font-bold text-white/80">Come funziona l'App</span>
                                    </div>
                                </button>
                            </div>

                            {/* VERSION BADGE */}
                            <div className="mt-4 pt-1">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                    Versione {APP_VERSION}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

                        {/* Close Button */}
                        <button 
                            onClick={() => setIsContestOpen(false)}
                            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 transition-transform shadow-[2px_2px_0_black]"
                        >
                            <X size={24} strokeWidth={4} />
                        </button>

                        <div className="mb-4 bg-yellow-100 p-4 rounded-full border-4 border-yellow-500">
                            <Trophy size={48} className="text-yellow-600" />
                        </div>

                        <h2 className="text-3xl font-black text-boo-purple mb-4 leading-tight">
                            Novità in Arrivo!
                        </h2>

                        <p className="text-gray-700 font-bold text-lg mb-8 leading-relaxed">
                            Stiamo preparando dei nuovi concorsi magici per vincere premi fantastici direttamente qui nell'app in totale sicurezza!<br/><br/>
                            Torna a trovarci presto. 🎁
                        </p>

                        <button 
                            onClick={() => setIsContestOpen(false)}
                            className="w-full bg-green-500 text-white font-black text-xl py-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase"
                        >
                            NON VEDO L'ORA! <Check size={24} strokeWidth={4} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomePage;
