
import React, { useEffect, useState, useRef } from 'react';
import { AppView } from '../types';
import { ArrowLeft, X } from 'lucide-react';
import { fetchFishData, FishData } from '../services/fishService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vToWwQXX5JOX5Sbb-L0fHT7knkxJlfINBhq0USnoj6UuhO7cwdzAhDZ63qF9nKhCxNWuu8DQEiVCSYF/pub?gid=0&single=true&output=csv';

interface Point {
    x: number;
    y: number;
}

interface AreaPoints {
    tl: Point; // top-left
    tr: Point; // top-right
    bl: Point; // bottom-left
    br: Point; // bottom-right
}

interface LakeCityAcquarioProps {
    setView: (view: AppView) => void;
}

const LakeCityAcquario: React.FC<LakeCityAcquarioProps> = ({ setView }) => {
    const [allFish, setAllFish] = useState<FishData[]>([]);
    const [filteredFish, setFilteredFish] = useState<FishData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('PESCI');
    const menuRef = useRef<HTMLDivElement>(null);
    
    const categories = [
        { id: 'PESCI', label: 'Pesci', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pescibuttoneded.webp' },
        { id: 'INVERTEBRATI', label: 'Invertebrati', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/invertebratibuttoneded.webp' },
        { id: 'MAMMIFERI', label: 'Mammiferi', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mammifeributtonedede.webp' },
        { id: 'ALGHE', label: 'Alghe e Microorganismi', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/alghebuttonededed.webp' }
    ];

    // Default points (calibrated)
    const defaultImagePoints: AreaPoints = {
        tl: { x: 9.6, y: 18.89055472263868 },
        tr: { x: 88.8, y: 18.140929535232384 },
        bl: { x: 9.333333333333334, y: 44.97751124437781 },
        br: { x: 86.93333333333332, y: 45.27736131934033 }
    };
    const defaultTextPoints: AreaPoints = {
        tl: { x: 13.066666666666665, y: 59.37031484257871 },
        tr: { x: 87.2, y: 59.52023988005997 },
        bl: { x: 12.533333333333333, y: 88.30584707646177 },
        br: { x: 87.2, y: 87.55622188905548 }
    };

    const [imagePoints] = useState<AreaPoints>(() => {
        const saved = localStorage.getItem('acquario_image_points');
        return saved ? JSON.parse(saved) : defaultImagePoints;
    });
    const [textPoints] = useState<AreaPoints>(() => {
        const saved = localStorage.getItem('acquario_text_points');
        return saved ? JSON.parse(saved) : defaultTextPoints;
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadData = async () => {
            const cacheBuster = `&t=${new Date().getTime()}`;
            const data = await fetchFishData(CSV_URL + cacheBuster);
            // Filter out museum items (Column D = 0)
            const aquariumData = data.filter(f => f.isMuseum !== '0');
            setAllFish(aquariumData);
            
            // Initial filter for PESCI
            const initialFiltered = aquariumData.filter(f => f.category?.toUpperCase() === 'PESCI');
            setFilteredFish(initialFiltered);
            setCurrentIndex(0);
            setLoading(false);
        };
        loadData();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeMenu && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };

        if (activeMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenu]);

    // Update filtered list when category changes
    useEffect(() => {
        if (allFish.length > 0) {
            const filtered = allFish.filter(f => f.category?.toUpperCase() === selectedCategory);
            setFilteredFish(filtered);
            setCurrentIndex(0);
        }
    }, [selectedCategory, allFish]);

    const handleNext = () => {
        if (filteredFish.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % filteredFish.length);
    };

    const handlePrev = () => {
        if (filteredFish.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + filteredFish.length) % filteredFish.length);
    };

    const currentFish = filteredFish[currentIndex];

    // Calculate bounding box for display
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
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-blue-900">
            {/* BACKGROUND LAYER */}
            <img 
                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/acquyariumsofodneo.webp" 
                alt="Acquario di Città dei Laghi" 
                className="absolute inset-0 w-full h-full object-cover select-none animate-in fade-in duration-1000"
                referrerPolicy="no-referrer"
            />
            
            {/* FISH IMAGE AREA */}
            {!loading && currentFish && (
                <div 
                    className="absolute flex items-center justify-center transition-all duration-500 z-20"
                    style={getAreaStyle(imagePoints)}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                            src={currentFish.image} 
                            alt={currentFish.name}
                            className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-in zoom-in duration-700"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </div>
            )}

            {/* CUSTOM NAVIGATION ARROWS */}
            {!loading && filteredFish.length > 1 && (
                <div className="absolute top-[52%] -translate-y-1/2 left-0 right-0 z-50 flex justify-between px-10 pointer-events-none">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="pointer-events-auto hover:scale-110 active:scale-95 transition-transform duration-300 drop-shadow-lg"
                    >
                        <img 
                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/frecciasinistraderfede.webp" 
                            alt="Precedente" 
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                    
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="pointer-events-auto hover:scale-110 active:scale-95 transition-transform duration-300 drop-shadow-lg"
                    >
                        <img 
                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/frecciadestrarees.webp" 
                            alt="Successivo" 
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                </div>
            )}

            {/* TEXT DESCRIPTION AREA */}
            {!loading && currentFish && (
                <div 
                    className="absolute flex flex-col transition-all duration-500 overflow-hidden z-20"
                    style={getAreaStyle(textPoints)}
                >
                    <h2 
                        className="text-2xl md:text-4xl font-luckiest text-sky-300 uppercase tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-2 flex-shrink-0"
                        style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
                    >
                        {currentFish.name || 'Pesce Sconosciuto'}
                    </h2>
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar pointer-events-auto">
                        <div className="text-black text-sm md:text-lg font-medium leading-relaxed prose prose-sm max-w-none prose-p:my-0 prose-headings:text-black prose-strong:text-black prose-em:text-black">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                            >
                                {currentFish.description || 'Nessuna descrizione disponibile.'}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            {/* OVERLAY UI */}
            <div className="absolute inset-0 z-[150] flex flex-col justify-between pt-4 px-4 md:px-10 pointer-events-none">
                <div className="flex justify-between items-start w-full pointer-events-auto">
                    {/* BACK BUTTON */}
                    <button 
                        onClick={() => setView(AppView.LAKE_CITY)}
                        className="hover:scale-110 active:scale-95 transition-transform duration-300 drop-shadow-lg p-0"
                    >
                        <img 
                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/uytornacitygfrd66.webp" 
                            alt="Ritorna in Città" 
                            className="w-12 md:w-16 h-auto block rounded-2xl"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                    
                    <div ref={menuRef} className="flex gap-1 md:gap-4 items-start">
                        {categories.map((cat, idx) => (
                            <div key={cat.id} className="relative">
                                <button 
                                    onClick={() => {
                                        if (activeMenu === cat.id) {
                                            setActiveMenu(null);
                                        } else {
                                            setActiveMenu(cat.id);
                                            setSelectedCategory(cat.id);
                                        }
                                    }}
                                    className={`hover:scale-110 active:scale-95 transition-transform duration-300 drop-shadow-lg p-0 ${selectedCategory === cat.id ? 'scale-105 brightness-110' : 'opacity-80'}`}
                                >
                                    <img 
                                        src={cat.img} 
                                        alt={cat.label} 
                                        className="w-16 md:w-22 h-auto block"
                                        referrerPolicy="no-referrer"
                                    />
                                </button>

                                {/* DROPDOWN FOR CATEGORY - Dynamic alignment to prevent cut-off */}
                                {activeMenu === cat.id && (
                                    <div className={`absolute top-full mt-2 w-48 md:w-64 max-h-[60vh] bg-sky-400/20 backdrop-blur-2xl border-2 border-white/30 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-300 z-[160] ${idx < 2 ? 'left-0' : 'right-0'}`}>
                                        <div className="p-3 md:p-4 border-b border-white/20 flex justify-between items-center bg-white/10">
                                            <h3 className="text-white font-luckiest text-sm md:text-lg uppercase tracking-widest drop-shadow-md">{cat.label}</h3>
                                            <button onClick={() => setActiveMenu(null)} className="text-white/80 hover:text-white">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="overflow-y-auto max-h-[calc(60vh-60px)] custom-scrollbar">
                                            {allFish
                                                .filter(f => f.category?.toUpperCase() === cat.id)
                                                .map((fish, index) => {
                                                    // Find index in filtered list
                                                    const fishIndex = filteredFish.findIndex(f => f.name === fish.name);
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                setCurrentIndex(fishIndex);
                                                                setActiveMenu(null);
                                                            }}
                                                            className={`w-full p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 text-left ${currentFish?.name === fish.name ? 'bg-white/20' : ''}`}
                                                        >
                                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                                                                <img 
                                                                    src={fish.image} 
                                                                    alt={fish.name} 
                                                                    className="w-full h-full object-contain"
                                                                    referrerPolicy="no-referrer"
                                                                />
                                                            </div>
                                                            <span className={`text-white text-xs md:text-sm font-medium ${currentFish?.name === fish.name ? 'text-sky-300' : ''}`}>
                                                                {fish.name}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            {allFish.filter(f => f.category?.toUpperCase() === cat.id).length === 0 && (
                                                <div className="p-4 text-white/40 text-center text-xs italic">Nessun elemento</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-blue-900/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-white font-luckiest uppercase tracking-widest animate-pulse">Caricamento Pesci...</span>
                    </div>
                </div>
            )}

            {/* Subtle Animated Particles or Bubbles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute bg-white/10 rounded-full animate-pulse"
                        style={{
                            width: Math.random() * 20 + 5 + 'px',
                            height: Math.random() * 20 + 5 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 5 + 's',
                            animationDuration: Math.random() * 3 + 2 + 's'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default LakeCityAcquario;
