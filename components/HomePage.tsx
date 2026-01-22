
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { HOME_BG_MOBILE, HOME_BG_DESKTOP } from '../constants';
import { Settings } from 'lucide-react';
import NewsletterModal from './NewsletterModal';

interface HomePageProps {
    setView: (view: AppView) => void;
    lastView?: AppView | null;
}

const CONTEST_LOGO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newnovit6675+(1).webp';
const BTN_STAY_UPDATED = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-stay-updated.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const HOW_IT_WORKS_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/igliglg1454.webp';

const ZONES_MOBILE = [
  { id: AppView.CITY_MAP, points: [{ x: 13.06, y: 64.82 }, { x: 13.33, y: 83.39 }, { x: 41.31, y: 82.56 }, { x: 40.25, y: 64.49 }] },
  { id: AppView.BOO_GARDEN, points: [{ x: 60.5, y: 64.16 }, { x: 60.5, y: 82.39 }, { x: 89.82, y: 83.39 }, { x: 90.09, y: 64.66 }] }
];

const ZONES_DESKTOP = [
  { id: AppView.CITY_MAP, points: [{ x: 37.25, y: 64.26 }, { x: 37.14, y: 84.29 }, { x: 47.06, y: 84.29 }, { x: 47.06, y: 64.48 }] },
  { id: AppView.BOO_GARDEN, points: [{ x: 53.8, y: 64.7 }, { x: 53.6, y: 82.75 }, { x: 64.02, y: 84.29 }, { x: 63.92, y: 64.48 }] }
];

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
    const [isContestOpen, setIsContestOpen] = useState(false);
    const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
    
    const getClipPath = (points: { x: number; y: number }[]) => {
        const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
        return `polygon(${poly})`;
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-full overflow-hidden bg-[#8B5CF6] flex flex-col select-none">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img src={HOME_BG_MOBILE} alt="" className="block md:hidden w-full h-full object-fill opacity-100" />
                <img src={HOME_BG_DESKTOP} alt="" className="hidden md:block w-full h-full object-fill opacity-100" />
            </div>

            <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                {/* TOOL DI SERVIZIO TEMPORANEO */}
                <div className="absolute top-[10%] right-[4%] z-40 pointer-events-auto">
                    <button 
                        onClick={() => setView(AppView.TTS_STUDIO)}
                        className="bg-slate-900/80 p-3 rounded-full border-2 border-white/20 text-yellow-400 hover:rotate-90 transition-transform active:scale-90"
                    >
                        <Settings size={28} />
                    </button>
                </div>

                <div className="absolute top-[10%] left-[4%] md:top-[12%] md:left-[3.5%] w-[28%] md:w-[16%] z-20 flex flex-col gap-4 pointer-events-auto">
                    <button onClick={() => setIsContestOpen(true)} className="w-full hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none relative z-30 transform rotate-[-4deg]">
                        <img src={CONTEST_LOGO} alt="Concorso" className="w-full h-auto drop-shadow-md opacity-100 block" />
                    </button>
                </div>

                <div className="absolute top-[88%] left-[4.5%] md:top-[84%] md:left-[4%] w-[13%] md:w-[7.5%] z-20 pointer-events-auto">
                    <button onClick={() => setView(AppView.GUIDE)} className="w-full hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none relative z-30">
                        <img src={HOW_IT_WORKS_IMG} alt="Come Funziona" className="w-full h-auto drop-shadow-lg opacity-100 block" />
                    </button>
                </div>

                <div className="relative w-full h-full pointer-events-none z-10">
                    <div className="md:hidden absolute inset-0">
                        {ZONES_MOBILE.map((zone, index) => (
                            <div key={`mob-${index}`} onClick={() => setView(zone.id)} className="absolute inset-0 cursor-pointer active:bg-white/10 transition-colors pointer-events-auto" style={{ clipPath: getClipPath(zone.points) }} />
                        ))}
                    </div>
                    <div className="hidden md:block absolute inset-0">
                        {ZONES_DESKTOP.map((zone, index) => (
                            <div key={`desk-${index}`} onClick={() => setView(zone.id)} className="absolute inset-0 cursor-pointer hover:bg-white/10 active:bg-white/20 transition-colors pointer-events-auto" style={{ clipPath: getClipPath(zone.points) }} />
                        ))}
                    </div>
                </div>
            </div>

            {isContestOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsContestOpen(false)}>
                    <div className="bg-white relative w-full max-w-md p-8 rounded-[40px] border-8 border-yellow-400 shadow-2xl animate-in zoom-in flex flex-col items-center text-center" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setIsContestOpen(false)} className="absolute top-4 right-4 hover:scale-110 active:scale-95 outline-none">
                            <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 object-contain pointer-events-auto" />
                        </button>
                        <img src={CONTEST_LOGO} className="w-40 h-auto mb-4 pointer-events-auto" alt="" />
                        <h2 className="text-3xl font-black text-boo-purple mb-4">Novità in Arrivo!</h2>
                        <p className="text-gray-700 font-bold mb-8">Stiamo preparando dei nuovi concorsi magici per vincere premi fantastici!</p>
                        <button onClick={() => { setIsContestOpen(false); setIsNewsletterOpen(true); }} className="w-full hover:scale-105 active:scale-95 transition-all outline-none">
                            <img src={BTN_STAY_UPDATED} alt="Rimani Aggiornato" className="w-full h-auto pointer-events-auto" />
                        </button>
                    </div>
                </div>
            )}

            {isNewsletterOpen && <NewsletterModal onClose={() => setIsNewsletterOpen(false)} />}
        </div>
    );
};

export default HomePage;
