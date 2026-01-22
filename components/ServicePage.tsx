
import React, { useState, useRef } from 'react';
import { AppView } from '../types';
import { ArrowLeft, Copy, Trash2, MapPin, RotateCcw, MousePointer2 } from 'lucide-react';

const TRAVEL_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/caricsfondcittaaltre55tf4.webp';

type Point = { x: number; y: number };

interface ServicePageProps {
    setView: (view: AppView) => void;
}

const PathEditor: React.FC = () => {
    const [activeCity, setActiveCity] = useState<string>('RAINBOW');
    const [paths, setPaths] = useState<Record<string, Point[]>>({
        RAINBOW: [],
        GRAY: [],
        MOUNTAIN: [],
        LAKE: []
    });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        // Calcolo percentuale (0-100) basato sulla dimensione REALE dell'immagine renderizzata
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const newPoint = { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
        setPaths(prev => ({
            ...prev,
            [activeCity]: [...prev[activeCity], newPoint]
        }));
    };

    const removeLast = () => {
        setPaths(prev => ({
            ...prev,
            [activeCity]: prev[activeCity].slice(0, -1)
        }));
    };

    const clearAll = () => {
        if (window.confirm("Cancellare tutto il percorso attuale?")) {
            setPaths(prev => ({ ...prev, [activeCity]: [] }));
        }
    };

    const copyToClipboard = () => {
        const json = JSON.stringify(paths[activeCity], null, 2);
        navigator.clipboard.writeText(json);
        alert(`COORDINATE COPIATE PER ${activeCity}!\n\nIncolla il testo in chat.`);
    };

    return (
        <div className="fixed inset-0 bg-[#020617] flex flex-col overflow-hidden">
            {/* Barra di controllo superiore ultra-compatta */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    {['RAINBOW', 'GRAY', 'MOUNTAIN', 'LAKE'].map(city => (
                        <button
                            key={city}
                            onClick={() => setActiveCity(city)}
                            className={`px-4 py-1.5 rounded-lg font-black text-[10px] uppercase transition-all ${activeCity === city ? 'bg-yellow-400 text-black' : 'bg-slate-800 text-slate-400'}`}
                        >
                            {city}
                        </button>
                    ))}
                </div>
                
                <div className="flex gap-2">
                    <button onClick={removeLast} className="bg-orange-600 p-2 rounded-lg text-white active:scale-95"><RotateCcw size={18}/></button>
                    <button onClick={clearAll} className="bg-red-600 p-2 rounded-lg text-white active:scale-95"><Trash2 size={18}/></button>
                    <button onClick={copyToClipboard} className="bg-green-600 px-4 py-1.5 rounded-lg text-white font-black text-[10px] uppercase flex items-center gap-2 active:scale-95">
                        <Copy size={14} /> COPIA DATI
                    </button>
                </div>
            </div>

            {/* Area Mappa - Massimizzata */}
            <div className="flex-1 w-full h-full flex items-center justify-center p-4 pt-16">
                <div 
                    className="relative w-full h-full max-w-full max-h-full flex items-center justify-center"
                    style={{ aspectRatio: '16/9' }}
                >
                    {/* Immagine con object-contain per evitare distorsioni */}
                    <div className="relative w-full h-full shadow-[0_0_100px_rgba(0,0,0,0.5)] border-2 border-white/5">
                        <img 
                            src={TRAVEL_BG} 
                            className="w-full h-full object-contain" 
                            alt="Mappa del Viaggio" 
                        />
                        
                        {/* Layer interattivo invisibile che copre ESATTAMENTE l'immagine contenuta */}
                        <div 
                            ref={containerRef}
                            onClick={handleClick}
                            className="absolute inset-0 z-10 cursor-crosshair"
                        >
                            <svg 
                                viewBox="0 0 100 100" 
                                preserveAspectRatio="none" 
                                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                            >
                                {paths[activeCity].length > 1 && (
                                    <polyline
                                        points={paths[activeCity].map(p => `${p.x},${p.y}`).join(' ')}
                                        fill="none"
                                        stroke="#fbbf24"
                                        strokeWidth="0.4"
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                )}
                                {paths[activeCity].map((p, i) => (
                                    <circle
                                        key={`${activeCity}-point-${i}`}
                                        cx={p.x}
                                        cy={p.y}
                                        r="0.8"
                                        fill={i === paths[activeCity].length - 1 ? "#34d399" : "#fbbf24"}
                                        stroke="black"
                                        strokeWidth="0.1"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                ))}
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Floating Badge */}
            <div className="absolute bottom-4 left-4 z-40 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    Punti {activeCity}: <span className="text-yellow-400">{paths[activeCity].length}</span>
                </span>
            </div>
        </div>
    );
};

const ServicePage: React.FC<ServicePageProps> = ({ setView }) => {
    return (
        <div className="fixed inset-0 z-[1000] bg-[#020617] text-slate-100 font-mono">
            {/* Pulsante ESCI globale posizionato strategicamente */}
            <button 
                onClick={() => setView(AppView.HOME)} 
                className="fixed bottom-4 right-4 z-[2000] bg-slate-800 p-4 rounded-full border-4 border-slate-700 shadow-2xl hover:bg-slate-700 active:scale-95 transition-all text-yellow-400"
                title="Torna all'App"
            >
                <ArrowLeft size={32} />
            </button>

            <PathEditor />
        </div>
    );
};

export default ServicePage;
