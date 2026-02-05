
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Star, X } from 'lucide-react';

const SOLAR_SYSTEM_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/solarsistem66yt88.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

type Point = { x: number; y: number };

// Mappa delle immagini per le schede informative
const PLANET_INFO: Record<string, { image: string, label: string }> = {
    'sole': { label: 'Sole', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/solechsedainfo55reds.webp' },
    'giove': { label: 'Giove', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ioveschedainfo554re.webp' },
    'mercurio': { label: 'Mercurio', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mercurioschedainfodn44wa.webp' },
    'venere': { label: 'Venere', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/venereschedainforre3wwq.webp' },
    'terra': { label: 'Terra', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/terraschedainfo44rdew.webp' },
    'marte': { label: 'Marte', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/marteschedainfo55rdswq.webp' },
    'saturno': { label: 'Saturno', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/saturnoschedainforrnden33.webp' },
    'urano': { label: 'Urano', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/urnoschedsinfeubs.webp' },
    'nettuno': { label: 'Nettuno', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nettunoschedainfonde4wqq.webp' },
    'plutone': { label: 'Plutone', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/plutonschedainfogrr44ew.webp' }
};

// Coordinate definitive
const ZONES: Record<string, Point[]> = {
  "sole": [
    { "x": 38.67, "y": 44.83 },
    { "x": 39.73, "y": 55.47 },
    { "x": 58.67, "y": 56.07 },
    { "x": 59.2, "y": 46.33 }
  ],
  "mercurio": [
    { "x": 58.13, "y": 44.08 },
    { "x": 65.6, "y": 45.28 },
    { "x": 65.6, "y": 39.13 },
    { "x": 58.67, "y": 38.83 }
  ],
  "venere": [
    { "x": 69.6, "y": 41.68 },
    { "x": 70.93, "y": 48.58 },
    { "x": 80.8, "y": 48.43 },
    { "x": 83.47, "y": 41.08 }
  ],
  "terra": [
    { "x": 72, "y": 51.72 },
    { "x": 72, "y": 58.77 },
    { "x": 84, "y": 58.92 },
    { "x": 84.8, "y": 51.12 }
  ],
  "marte": [
    { "x": 15.2, "y": 40.18 },
    { "x": 14.67, "y": 46.93 },
    { "x": 26.13, "y": 47.23 },
    { "x": 27.73, "y": 39.73 }
  ],
  "giove": [
    { "x": 6.93, "y": 57.27 },
    { "x": 7.47, "y": 71.21 },
    { "x": 29.6, "y": 71.51 },
    { "x": 29.07, "y": 57.12 }
  ],
  "saturno": [
    { "x": 49.33, "y": 19.19 },
    { "x": 54.13, "y": 28.19 },
    { "x": 81.07, "y": 28.49 },
    { "x": 81.87, "y": 18.74 }
  ],
  "urano": [
    { "x": 65.87, "y": 74.51 },
    { "x": 65.33, "y": 84.11 },
    { "x": 81.07, "y": 84.26 },
    { "x": 81.07, "y": 73.16 }
  ],
  "nettuno": [
    { "x": 35.47, "y": 83.81 },
    { "x": 35.47, "y": 92.65 },
    { "x": 49.07, "y": 92.95 },
    { "x": 50.93, "y": 82.91 }
  ],
  "plutone": [
    { "x": 7.47, "y": 87.41 },
    { "x": 8, "y": 93.4 },
    { "x": 19.73, "y": 93.4 },
    { "x": 20.53, "y": 86.36 }
  ]
};

interface SolarSystemViewProps {
    onClose: () => void;
}

const SolarSystemView: React.FC<SolarSystemViewProps> = ({ onClose }) => {
    const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const getClipPath = (points: Point[]) => {
        if (points.length < 3) return 'none';
        return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <div className="fixed inset-0 z-[300] bg-black flex flex-col overflow-hidden select-none animate-in fade-in duration-700">
            <style>{`
                .lucky-font { font-family: 'Luckiest Guy', cursive; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .text-stroke-title {
                    -webkit-text-stroke: 1px black;
                    text-shadow: 2px 2px 0px rgba(0,0,0,0.5);
                }
            `}</style>

            {/* Background Image Layer */}
            <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-default">
                <img 
                    src={SOLAR_SYSTEM_BG} 
                    alt="Sistema Solare" 
                    className="w-full h-full object-fill md:object-cover pointer-events-none"
                />

                {/* Clickable Areas */}
                {(Object.entries(ZONES) as [string, Point[]][]).map(([id, points]) => (
                    points.length >= 3 && (
                        <div 
                            key={`area-${id}`}
                            onClick={(e) => { e.stopPropagation(); setSelectedPlanet(id); }}
                            className="absolute inset-0 z-30 cursor-pointer active:bg-white/5 transition-colors"
                            style={{ clipPath: getClipPath(points) }}
                        />
                    )
                ))}
            </div>
            
            {/* Header Layer */}
            <div className="relative z-40 w-full pt-4 md:pt-6 px-6 flex justify-between items-start pointer-events-none">
                <button 
                    onClick={onClose}
                    className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none"
                    title="Torna al Telescopio"
                >
                    <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-2xl" />
                </button>

                <div className="flex flex-col items-end gap-2 animate-in slide-in-from-right duration-700 pointer-events-auto">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/20 shadow-2xl flex items-center gap-3">
                        <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                        <h2 className="text-white lucky-font text-xl md:text-4xl uppercase tracking-tighter text-stroke-title">
                            Il Sistema Solare
                        </h2>
                    </div>
                </div>
            </div>

            {/* PLANET DETAIL MODAL */}
            {selectedPlanet && (
                <div className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedPlanet(null)}>
                    <div 
                        className="bg-white rounded-[2rem] md:rounded-[3rem] border-8 border-yellow-400 w-full max-w-2xl h-[70vh] flex flex-col relative overflow-hidden animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedPlanet(null)}
                            className="absolute top-4 right-4 z-[610] bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all shadow-xl"
                        >
                            <X size={24} strokeWidth={4} />
                        </button>

                        <div className="flex-1 relative bg-black flex items-center justify-center">
                            <img 
                                src={PLANET_INFO[selectedPlanet]?.image} 
                                alt={selectedPlanet} 
                                className="w-full h-full object-contain"
                            />
                            
                            {/* Nome del pianeta in alto a sinistra stile Lucky */}
                            <div className="absolute top-6 left-8 z-[605] pointer-events-none">
                                <h3 className="lucky-font text-yellow-400 text-3xl md:text-6xl uppercase tracking-tighter text-stroke-title">
                                    {PLANET_INFO[selectedPlanet]?.label}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Decorative Stars Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[20%] left-[10%] text-white animate-pulse"><Star size={12} fill="currentColor" /></div>
                <div className="absolute top-[40%] right-[15%] text-white animate-pulse delay-700"><Star size={8} fill="currentColor" /></div>
                <div className="absolute bottom-[30%] left-[40%] text-white animate-pulse delay-300"><Star size={10} fill="currentColor" /></div>
            </div>
        </div>
    );
};

export default SolarSystemView;
