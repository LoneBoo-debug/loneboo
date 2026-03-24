
import React, { useEffect } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { ArrowLeft } from 'lucide-react';

interface Point {
    x: number;
    y: number;
}

interface AreaPoints {
    tl: Point;
    tr: Point;
    bl: Point;
    br: Point;
}

interface MountainCityLocationProps {
    title: string;
    setView: (view: AppView) => void;
    bgImage?: string;
    minimal?: boolean;
}

// Calibrated points for Scavi Archeologici
const SCAVI_POINTS = {
    ossa: {
        tl: { x: 57.03624547909587, y: 38.21942376117251 },
        tr: { x: 96.74839770519532, y: 38.51918394753465 },
        bl: { x: 60.767588641279715, y: 83.78297208821739 },
        br: { x: 95.94882417044165, y: 87.38009432456305 }
    },
    fossili: {
        tl: { x: 2.398720604261041, y: 34.02278115210259 },
        tr: { x: 42.91044636511418, y: 33.42326077937832 },
        bl: { x: 1.5991470695073606, y: 90.07793600182227 },
        br: { x: 45.575691480959776, y: 88.12949479046837 }
    }
};

const MountainCityLocation: React.FC<MountainCityLocationProps> = ({ title, setView, bgImage, minimal }) => {
    const isScavi = title === "Scavi Archeologici";
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getAreaStyle = (points: AreaPoints) => {
        const minX = Math.min(points.tl.x, points.tr.x, points.bl.x, points.br.x);
        const maxX = Math.max(points.tl.x, points.tr.x, points.bl.x, points.br.x);
        const minY = Math.min(points.tl.y, points.tr.y, points.bl.y, points.br.y);
        const maxY = Math.max(points.tl.y, points.tr.y, points.bl.y, points.br.y);

        return {
            left: `${minX}%`,
            top: `${minY}%`,
            width: `${maxX - minX}%`,
            height: `${maxY - minY}%`
        };
    };

    return (
        <div 
            className="fixed inset-0 z-[100] bg-emerald-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden"
        >
            {bgImage && (
                <img 
                    src={bgImage} 
                    alt={title} 
                    className={`absolute inset-0 w-full h-full object-cover select-none ${minimal ? 'opacity-100' : 'opacity-60'}`}
                    referrerPolicy="no-referrer"
                />
            )}

            {/* Clickable Areas for Scavi */}
            {isScavi && (
                <>
                    <div 
                        className="absolute cursor-pointer hover:bg-white/10 border-2 border-dashed border-transparent hover:border-white/30 transition-all z-20"
                        style={getAreaStyle(SCAVI_POINTS.ossa)}
                        onClick={(e) => { e.stopPropagation(); setView(AppView.MOUNTAIN_CITY_OSSA_ANIMALI); }}
                    />
                    <div 
                        className="absolute cursor-pointer hover:bg-white/10 border-2 border-dashed border-transparent hover:border-white/30 transition-all z-20"
                        style={getAreaStyle(SCAVI_POINTS.fossili)}
                        onClick={(e) => { e.stopPropagation(); setView(AppView.MOUNTAIN_CITY_REPERTI_FOSSILI); }}
                    />
                </>
            )}
            
            {minimal ? (
                <>
                    {title !== "Scavi Archeologici" && title !== "Ossa Animali" && title !== "Reperti Fossili" && (
                        <div className="relative z-10 animate-in fade-in zoom-in duration-1000 pointer-events-none">
                            <h1 
                                className="font-luckiest text-white text-5xl md:text-8xl uppercase tracking-widest drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                                style={{ WebkitTextStroke: '2px rgba(0,0,0,0.3)' }}
                            >
                                SEZIONE IN ALLESTIMENTO
                            </h1>
                        </div>
                    )}
                    
                    {/* Floating Back Button for minimal view */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setView(AppView.MOUNTAIN_CITY); }}
                        className="fixed top-2 left-2 z-50 hover:scale-110 active:scale-95 transition-all drop-shadow-2xl"
                    >
                        <img 
                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/bacdsthecity67676.webp" 
                            alt="Indietro" 
                            className="w-24 md:w-44 h-auto rounded-2xl"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                </>
            ) : (
                <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-xl border-4 border-emerald-600 rounded-[3rem] p-8 flex flex-col items-center gap-6 shadow-2xl animate-in zoom-in duration-500">
                    <img src={OFFICIAL_LOGO} alt="Boo" className="w-32 h-32 animate-bounce select-none" referrerPolicy="no-referrer" />
                    <h1 className="font-luckiest text-emerald-600 text-4xl uppercase tracking-widest leading-tight">{title}</h1>
                    <p className="text-emerald-800 font-medium text-lg italic">
                        Questa area della Città delle Montagne è in fase di allestimento... torna presto per esplorarla!
                    </p>
                    <button 
                        onClick={() => setView(AppView.MOUNTAIN_CITY)}
                        className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-full border-4 border-black shadow-[4px_4px_0_black] transition-all active:translate-y-1 active:shadow-none flex items-center gap-2 uppercase tracking-widest"
                    >
                        <ArrowLeft strokeWidth={4} /> Torna in Città
                    </button>
                </div>
            )}
        </div>
    );
};

export default MountainCityLocation;
