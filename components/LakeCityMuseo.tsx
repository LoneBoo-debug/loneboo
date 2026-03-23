
import React, { useEffect, useState, useRef } from 'react';
import { AppView } from '../types';
import { X } from 'lucide-react';
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

interface LakeCityMuseoProps {
    setView: (view: AppView) => void;
}

const LakeCityMuseo: React.FC<LakeCityMuseoProps> = ({ setView }) => {
    const [allFish, setAllFish] = useState<FishData[]>([]);
    const [filteredFish, setFilteredFish] = useState<FishData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [selectedEra, setSelectedEra] = useState<string>('DEVONIANO');
    const menuRef = useRef<HTMLDivElement>(null);
    
    const eras = [
        { id: 'DEVONIANO', label: 'Devoniano', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/devonianobutton.webp' },
        { id: 'CARBONIFERO', label: 'Carbonifero', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/carobiniferobutton.webp' },
        { id: 'TRIASSICO', label: 'Triassico', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/triassicobutton.webp' },
        { id: 'CRETACEO', label: 'Cretaceo', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cretaceobutton.webp' }
    ];

    // Fixed calibrated points
    const imagePoints: AreaPoints = {
        tl: { x: 4.533333333333333, y: 25.937031484257872 },
        tr: { x: 6.133333333333333, y: 60.86956521739131 },
        bl: { x: 94.39999999999999, y: 61.6191904047976 },
        br: { x: 94.13333333333334, y: 26.08695652173913 }
    };
    const textPoints: AreaPoints = {
        tl: { x: 4.8, y: 70.46326836581709 },
        tr: { x: 5.066666666666666, y: 94 },
        bl: { x: 95.46666666666667, y: 94 },
        br: { x: 96, y: 70.7631184407796 }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadData = async () => {
            const cacheBuster = `&t=${new Date().getTime()}`;
            const data = await fetchFishData(CSV_URL + cacheBuster);
            // Filter for museum items (Column D = 0)
            const museumData = data.filter(f => f.isMuseum === '0');
            setAllFish(museumData);
            
            // Initial filter for DEVONIANO
            const initialFiltered = museumData.filter(f => f.era?.toUpperCase() === 'DEVONIANO');
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

    // Update filtered list when era changes
    useEffect(() => {
        if (allFish.length > 0) {
            const filtered = allFish.filter(f => f.era?.toUpperCase() === selectedEra);
            setFilteredFish(filtered);
            setCurrentIndex(0);
        }
    }, [selectedEra, allFish]);

    const handleNext = () => {
        if (filteredFish.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % filteredFish.length);
    };

    const handlePrev = () => {
        if (filteredFish.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + filteredFish.length) % filteredFish.length);
    };

    const currentFish = filteredFish[currentIndex];

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
            className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-blue-900"
        >
            {/* BACKGROUND LAYER */}
            <img 
                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_in+questa+immagine+rendi+la+va_490680446169284616.webp" 
                alt="Museo Acquatico" 
                className="absolute inset-0 w-full h-full object-cover select-none animate-in fade-in duration-1000"
                referrerPolicy="no-referrer"
            />
            
            {/* MUSEUM IMAGE AREA */}
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

            {/* NAVIGATION ARROWS */}
            {!loading && filteredFish.length > 1 && (
                <div className="absolute top-[66%] -translate-y-1/2 left-0 right-0 z-50 flex justify-between px-10 pointer-events-none">
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
                        className="text-2xl md:text-4xl font-luckiest text-white uppercase tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-2 flex-shrink-0"
                        style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
                    >
                        {currentFish.name || 'Creatura Sconosciuta'}
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
                        {eras.map((era, idx) => (
                            <div key={era.id} className="relative">
                                <button 
                                    onClick={() => {
                                        if (activeMenu === era.id) {
                                            setActiveMenu(null);
                                        } else {
                                            setActiveMenu(era.id);
                                            setSelectedEra(era.id);
                                        }
                                    }}
                                    className={`hover:scale-110 active:scale-95 transition-transform duration-300 drop-shadow-lg p-0 ${selectedEra === era.id ? 'scale-105 brightness-110' : 'opacity-80'}`}
                                >
                                    <img 
                                        src={era.img} 
                                        alt={era.label} 
                                        className="w-16 md:w-22 h-auto block"
                                        referrerPolicy="no-referrer"
                                    />
                                </button>

                                {/* DROPDOWN FOR ERA - Dynamic alignment to prevent cut-off */}
                                {activeMenu === era.id && (
                                    <div className={`absolute top-full mt-2 w-48 md:w-64 max-h-[60vh] bg-sky-400/20 backdrop-blur-2xl border-2 border-white/30 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-300 z-[160] ${idx < 2 ? 'left-0' : 'right-0'}`}>
                                        <div className="p-3 md:p-4 border-b border-white/20 flex justify-between items-center bg-white/10">
                                            <h3 className="text-white font-luckiest text-sm md:text-lg uppercase tracking-widest drop-shadow-md">{era.label}</h3>
                                            <button onClick={() => setActiveMenu(null)} className="text-white/80 hover:text-white">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="overflow-y-auto max-h-[calc(60vh-60px)] custom-scrollbar">
                                            {allFish
                                                .filter(f => f.era?.toUpperCase() === era.id)
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
                                            {allFish.filter(f => f.era?.toUpperCase() === era.id).length === 0 && (
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
                        <span className="text-white font-luckiest uppercase tracking-widest animate-pulse">Caricamento Museo...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LakeCityMuseo;

