
import React, { useEffect, useState, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'motion/react';

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

interface ObservatoryItem {
    category: string;
    image: string;
    name: string;
    specs: string;
    history: string;
    curiosities: string;
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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [observatoryData, setObservatoryData] = useState<ObservatoryItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activePopup, setActivePopup] = useState<{ title: string, content: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const isScavi = title === "Scavi Archeologici";
    const isOsservatorio = title === "Osservatorio Astronomico";
    const isCentroMeteo = title === "Centro Meteo";
    const isLaboratorioAcque = title === "Laboratorio delle Acque";
    const isLagoPesca = title === "Lago di Pesca";
    
    useEffect(() => {
        window.scrollTo(0, 0);
        
        if (isOsservatorio) {
            setIsLoading(true);
            const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0LFjBtzDO5pqmW2tTOWxGrHyAbAuP07Q0azbKtwWyD7_QdICc9Bv90NC5o5ee5jQoFw2whdB7njtf/pub?gid=0&single=true&output=csv";
            
            Papa.parse(csvUrl, {
                download: true,
                header: false,
                complete: (results) => {
                    const data = results.data as string[][];
                    // Skip header if exists, filter out empty rows
                    const items: ObservatoryItem[] = data
                        .filter(row => row.length >= 6 && row[0])
                        .map(row => ({
                            category: row[0].trim(),
                            image: row[1].trim(),
                            name: row[2].trim(),
                            specs: row[3].trim(),
                            history: row[4].trim(),
                            curiosities: row[5].trim()
                        }));
                    setObservatoryData(items);
                    setIsLoading(false);
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error);
                    setIsLoading(false);
                }
            });
        }
    }, [isOsservatorio]);

    const filteredItems = observatoryData.filter(item => 
        item.category.toLowerCase() === selectedCategory?.toLowerCase()
    );

    const currentItem = filteredItems[currentIndex];

    const nextItem = () => {
        setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
        setActivePopup(null);
    };

    const prevItem = () => {
        setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        setActivePopup(null);
    };

    const scrollToIndex = (index: number) => {
        if (!scrollRef.current) return;
        const targetIndex = Math.max(0, Math.min(index, filteredItems.length - 1));
        scrollRef.current.scrollTo({
            left: targetIndex * scrollRef.current.offsetWidth,
            behavior: 'smooth'
        });
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, offsetWidth } = scrollRef.current;
        if (offsetWidth === 0) return;
        const index = Math.round(scrollLeft / offsetWidth);
        if (index !== currentIndex && index >= 0 && index < filteredItems.length) {
            setCurrentIndex(index);
            setActivePopup(null);
        }
    };

    useEffect(() => {
        setCurrentIndex(0);
        setActivePopup(null);
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = 0;
        }
    }, [selectedCategory]);

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
                    {title !== "Scavi Archeologici" && title !== "Ossa Animali" && title !== "Reperti Fossili" && !isOsservatorio && !isCentroMeteo && !isLaboratorioAcque && !isLagoPesca && (
                        <div className="relative z-10 animate-in fade-in zoom-in duration-1000 pointer-events-none">
                            <h1 
                                className="font-luckiest text-white text-5xl md:text-8xl uppercase tracking-widest drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                                style={{ WebkitTextStroke: '2px rgba(0,0,0,0.3)' }}
                            >
                                SEZIONE IN ALLESTIMENTO
                            </h1>
                        </div>
                    )}

                    {isLaboratorioAcque && (
                        <div className="relative z-10 animate-in fade-in zoom-in duration-1000 pointer-events-none">
                            <h1 
                                className="font-luckiest text-white text-5xl md:text-8xl uppercase tracking-widest drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                                style={{ WebkitTextStroke: '2px rgba(0,0,0,0.3)' }}
                            >
                                LABORATORIO ACQUE IN ALLESTIMENTO
                            </h1>
                        </div>
                    )}

                    {isLagoPesca && (
                        <div className="relative z-10 animate-in fade-in zoom-in duration-1000 pointer-events-none">
                            <h1 
                                className="font-luckiest text-white text-5xl md:text-8xl uppercase tracking-widest drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                                style={{ WebkitTextStroke: '2px rgba(0,0,0,0.3)' }}
                            >
                                LAGO DI PESCA IN ALLESTIMENTO
                            </h1>
                        </div>
                    )}

                    {isCentroMeteo && (
                        <div className="relative z-10 animate-in fade-in zoom-in duration-1000 pointer-events-none">
                            <h1 
                                className="font-luckiest text-white text-5xl md:text-8xl uppercase tracking-widest drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                                style={{ WebkitTextStroke: '2px rgba(0,0,0,0.3)' }}
                            >
                                CENTRO METEO IN ALLESTIMENTO
                            </h1>
                        </div>
                    )}

                    {isOsservatorio && !selectedCategory && (
                        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-center gap-4 px-4 overflow-x-auto no-scrollbar">
                            {[
                                { name: 'Asteroidi', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ateriodinbuttone4.webp' },
                                { name: 'Pianeti', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pianetibuttone4e3.webp' },
                                { name: 'Stelle', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/stellebuttone4e3.webp' },
                                { name: 'Galassie', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/galassiebuttone3e.webp' }
                            ].map((btn, idx) => (
                                <button 
                                    key={idx}
                                    className="flex-shrink-0 hover:scale-110 active:scale-95 transition-all drop-shadow-xl group"
                                    onClick={() => setSelectedCategory(btn.name)}
                                >
                                    <img 
                                        src={btn.img} 
                                        alt={btn.name} 
                                        className="w-16 md:w-32 h-auto"
                                        referrerPolicy="no-referrer"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {isOsservatorio && selectedCategory && (
                        <div className="fixed inset-0 z-[150] animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
                            <img 
                                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/sfondoosseevatasti4.webp" 
                                alt={selectedCategory}
                                className="fixed inset-0 w-full h-full object-cover select-none"
                                referrerPolicy="no-referrer"
                            />
                            
                            {/* Close Button: Red circle with X */}
                            <button 
                                onClick={() => setSelectedCategory(null)}
                                className="fixed top-4 left-4 z-[160] bg-red-600 hover:bg-red-500 text-white w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                            >
                                <X size={32} strokeWidth={4} />
                            </button>

                            <div className="relative z-10 min-h-full flex flex-col items-center py-20 px-4 md:px-8">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-64">
                                        <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
                                        <p className="font-luckiest text-emerald-400 text-2xl uppercase tracking-widest">Caricamento dati spaziali...</p>
                                    </div>
                                ) : filteredItems.length > 0 ? (
                                    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                                        {/* Header with Navigation Buttons */}
                                        <div className="fixed top-0 left-0 right-0 z-[160] flex items-center justify-center h-16 md:h-24 pointer-events-none translate-x-12 md:translate-x-20">
                                            {filteredItems.length > 1 && (
                                                <div className="flex items-center gap-4 pointer-events-auto">
                                                    <button 
                                                        onClick={() => scrollToIndex(currentIndex - 1)}
                                                        className="bg-black/40 backdrop-blur-md border-2 border-[#00ff00]/50 text-[#00ff00] px-4 py-2 rounded-full font-luckiest text-sm md:text-xl uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                                                    >
                                                        Precedente
                                                    </button>
                                                    <button 
                                                        onClick={() => scrollToIndex(currentIndex + 1)}
                                                        className="bg-black/40 backdrop-blur-md border-2 border-[#00ff00]/50 text-[#00ff00] px-4 py-2 rounded-full font-luckiest text-sm md:text-xl uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,0,0.3)]"
                                                    >
                                                        Successivo
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Title above image */}
                                        <motion.h2 
                                            key={`title-${currentIndex}`}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="font-luckiest text-[#00ff00] text-3xl md:text-6xl uppercase tracking-widest text-center drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]"
                                        >
                                            {currentItem.name}
                                        </motion.h2>

                                        {/* Carousel Image Container */}
                                        <div className="relative w-full flex items-center justify-center group">
                                            <div 
                                                ref={scrollRef}
                                                onScroll={handleScroll}
                                                className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                                            >
                                                {filteredItems.map((item, idx) => (
                                                    <div key={idx} className="w-full flex-shrink-0 snap-center flex items-center justify-center p-4 h-[45vh] md:h-[65vh]">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            className="max-h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(0,255,0,0.4)]"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="w-full flex flex-row justify-center items-center gap-2 md:gap-6 mt-16 md:mt-24 overflow-x-auto no-scrollbar px-2">
                                            {[
                                                { id: 'specs', label: 'Descrizione', content: currentItem.specs, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/descrizionebuttonspace+(1).webp' },
                                                { id: 'history', label: 'Storia', content: currentItem.history, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/storiabuttonspaces+(1).webp' },
                                                { id: 'curiosities', label: 'Curiosità', content: currentItem.curiosities, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/curiositabuttonspace43+(1).webp' }
                                            ].map((btn) => (
                                                <button 
                                                    key={btn.id}
                                                    onClick={() => setActivePopup({ title: btn.label, content: btn.content })}
                                                    className="flex-shrink-0 hover:scale-110 active:scale-95 transition-all drop-shadow-xl"
                                                >
                                                    <img 
                                                        src={btn.img} 
                                                        alt={btn.label} 
                                                        className="w-24 md:w-40 h-auto"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        {/* Translucent Popup Modal */}
                                        <AnimatePresence>
                                            {activePopup && (
                                                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 pointer-events-none">
                                                    <motion.div 
                                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                                        className="relative w-full max-w-2xl max-h-[70vh] bg-black/60 backdrop-blur-xl border-2 border-[#00ff00]/50 rounded-[2rem] p-8 md:p-12 flex flex-col pointer-events-auto shadow-[0_0_50px_rgba(0,255,0,0.2)]"
                                                    >
                                                        <button 
                                                            onClick={() => setActivePopup(null)}
                                                            className="absolute top-4 right-4 text-[#00ff00] hover:scale-110 transition-transform"
                                                        >
                                                            <X size={32} strokeWidth={3} />
                                                        </button>

                                                        <h3 className="font-luckiest text-[#00ff00] text-3xl md:text-5xl uppercase tracking-widest mb-6 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                                                            {activePopup.title}
                                                        </h3>

                                                        <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                                                            <p className="text-[#00ff00] font-medium text-lg md:text-2xl leading-relaxed text-left whitespace-pre-wrap">
                                                                {activePopup.content}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64">
                                        <p className="font-luckiest text-emerald-400 text-2xl uppercase tracking-widest">Nessun dato trovato per questa categoria.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Floating Back Button for minimal view */}
                    <div className="fixed top-2 left-2 z-50 flex items-center gap-2 md:gap-4">
                        <button 
                            onClick={(e) => { 
                                e.stopPropagation(); 
                                if (isLagoPesca) {
                                    setView(AppView.LAKE_CITY);
                                } else {
                                    setView(AppView.MOUNTAIN_CITY); 
                                }
                            }}
                            className="hover:scale-110 active:scale-95 transition-all drop-shadow-2xl"
                        >
                            <img 
                                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/bacdsthecity67676.webp" 
                                alt="Indietro" 
                                className="w-24 md:w-44 h-auto rounded-2xl"
                                referrerPolicy="no-referrer"
                            />
                        </button>
                        {isScavi && (
                            <div className="bg-black/40 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-2xl md:rounded-full border-2 border-white/30 animate-in fade-in slide-in-from-left duration-1000">
                                <p className="font-luckiest text-white text-xs md:text-xl uppercase tracking-wider drop-shadow-md">
                                    tocca gli scavi per scoprire i tesori...
                                </p>
                            </div>
                        )}
                    </div>
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
