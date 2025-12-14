
import React, { useState, useRef, useEffect } from 'react';
import { X, Move } from 'lucide-react';

// --- DATA: LE 12 COSTELLAZIONI ---
// Coordinate relative su una griglia immaginaria 2000x2000
const CONSTELLATIONS = [
    {
        id: 'aries',
        name: 'ARIETE ♈',
        stars: [{x: 300, y: 400}, {x: 380, y: 380}, {x: 450, y: 420}, {x: 480, y: 480}],
        lines: [[0,1], [1,2], [2,3]],
        color: '#ff9999'
    },
    {
        id: 'taurus',
        name: 'TORO ♉',
        stars: [{x: 600, y: 300}, {x: 650, y: 350}, {x: 700, y: 320}, {x: 650, y: 450}, {x: 750, y: 400}],
        lines: [[0,1], [1,2], [1,3], [3,4]],
        color: '#99ff99'
    },
    {
        id: 'gemini',
        name: 'GEMELLI ♊',
        stars: [{x: 900, y: 200}, {x: 950, y: 200}, {x: 900, y: 500}, {x: 950, y: 500}, {x: 925, y: 350}],
        lines: [[0,2], [1,3], [2,4], [3,4]],
        color: '#ffff99'
    },
    {
        id: 'cancer',
        name: 'CANCRO ♋',
        stars: [{x: 1200, y: 400}, {x: 1250, y: 450}, {x: 1300, y: 400}, {x: 1250, y: 550}, {x: 1250, y: 350}],
        lines: [[0,1], [1,2], [1,3], [1,4]],
        color: '#99ccff'
    },
    {
        id: 'leo',
        name: 'LEONE ♌',
        stars: [{x: 1500, y: 300}, {x: 1550, y: 250}, {x: 1600, y: 280}, {x: 1580, y: 350}, {x: 1500, y: 450}, {x: 1650, y: 400}],
        lines: [[0,1], [1,2], [2,3], [3,4], [3,5], [4,5]],
        color: '#ffcc99'
    },
    {
        id: 'virgo',
        name: 'VERGINE ♍',
        stars: [{x: 300, y: 800}, {x: 400, y: 750}, {x: 500, y: 800}, {x: 450, y: 900}, {x: 350, y: 950}, {x: 250, y: 850}],
        lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],
        color: '#d9b3ff'
    },
    {
        id: 'libra',
        name: 'BILANCIA ♎',
        stars: [{x: 700, y: 800}, {x: 800, y: 750}, {x: 900, y: 800}, {x: 800, y: 950}],
        lines: [[0,1], [1,2], [0,3], [2,3]],
        color: '#ff99cc'
    },
    {
        id: 'scorpio',
        name: 'SCORPIONE ♏',
        stars: [{x: 1100, y: 800}, {x: 1150, y: 850}, {x: 1150, y: 950}, {x: 1100, y: 1050}, {x: 1200, y: 1050}, {x: 1250, y: 1000}],
        lines: [[0,1], [1,2], [2,3], [3,4], [4,5]],
        color: '#ff4d4d'
    },
    {
        id: 'sagittarius',
        name: 'SAGITTARIO ♐',
        stars: [{x: 1500, y: 800}, {x: 1600, y: 800}, {x: 1550, y: 750}, {x: 1550, y: 900}, {x: 1450, y: 950}, {x: 1650, y: 950}],
        lines: [[0,1], [0,2], [1,2], [0,3], [1,3], [3,4], [3,5]], // Teapot shape approx
        color: '#99e6e6'
    },
    {
        id: 'capricorn',
        name: 'CAPRICORNO ♑',
        stars: [{x: 400, y: 1300}, {x: 500, y: 1250}, {x: 600, y: 1300}, {x: 500, y: 1400}],
        lines: [[0,1], [1,2], [2,3], [3,0]], // Triangle-ish
        color: '#cccc00'
    },
    {
        id: 'aquarius',
        name: 'ACQUARIO ♒',
        stars: [{x: 800, y: 1250}, {x: 850, y: 1300}, {x: 900, y: 1250}, {x: 950, y: 1300}, {x: 1000, y: 1250}],
        lines: [[0,1], [1,2], [2,3], [3,4]], // Zig Zag
        color: '#66ffcc'
    },
    {
        id: 'pisces',
        name: 'PESCI ♓',
        stars: [{x: 1300, y: 1300}, {x: 1400, y: 1250}, {x: 1500, y: 1350}, {x: 1400, y: 1450}, {x: 1400, y: 1350}],
        lines: [[0,4], [4,1], [4,2], [4,3]], // Two fish tied
        color: '#cc99ff'
    }
];

const MAP_SIZE = 2000; // Virtual size of the sky map

const StarMap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // Viewport State
    const [offset, setOffset] = useState({ x: -MAP_SIZE/4, y: -MAP_SIZE/4 });
    const [isDragging, setIsDragging] = useState(false);
    const lastPos = useRef({ x: 0, y: 0 });
    
    // Background Stars (Generated once)
    const [bgStars, setBgStars] = useState<{x: number, y: number, size: number, opacity: number}[]>([]);

    useEffect(() => {
        // Generate random background stars
        const stars = [];
        for (let i = 0; i < 300; i++) {
            stars.push({
                x: Math.random() * MAP_SIZE,
                y: Math.random() * MAP_SIZE,
                size: Math.random() * 3 + 1,
                opacity: Math.random()
            });
        }
        setBgStars(stars);
        
        // Center initial view roughly
        setOffset({ x: -300, y: -300 });
    }, []);

    // --- DRAG HANDLERS ---
    const handleStart = (clientX: number, clientY: number) => {
        setIsDragging(true);
        lastPos.current = { x: clientX, y: clientY };
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging) return;
        const dx = clientX - lastPos.current.x;
        const dy = clientY - lastPos.current.y;
        
        setOffset(prev => {
            let newX = prev.x + dx;
            let newY = prev.y + dy;
            
            // Bounds checking (don't scroll off map completely)
            const minX = -MAP_SIZE + window.innerWidth;
            const minY = -MAP_SIZE + window.innerHeight;
            
            if (newX > 0) newX = 0;
            if (newY > 0) newY = 0;
            if (newX < minX) newX = minX;
            if (newY < minY) newY = minY;

            return { x: newX, y: newY };
        });
        
        lastPos.current = { x: clientX, y: clientY };
    };

    const handleEnd = () => {
        setIsDragging(false);
    };

    // Mouse Events
    const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();
    const onMouseLeave = () => handleEnd();

    // Touch Events
    const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: React.TouchEvent) => {
        // Prevent page scroll
        // e.preventDefault(); // Warning: requires non-passive listener, handled by CSS usually
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handleEnd();

    return (
        // CHANGED: 'fixed' -> 'absolute', 'z-[100]' -> 'z-40' to stay under header within the relative parent
        <div className="absolute inset-0 z-40 bg-black overflow-hidden select-none touch-none animate-in fade-in duration-500">
            
            {/* UI LAYER (FIXED INSIDE ABSOLUTE CONTAINER) */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-2xl border-2 border-cyan-500 shadow-[0_0_20px_cyan] animate-pulse pointer-events-auto">
                    <h2 className="text-xl md:text-2xl font-black uppercase text-cyan-300 drop-shadow-md">
                        Telescopio 🔭
                    </h2>
                    <p className="text-[10px] md:text-xs font-bold text-cyan-100 flex items-center gap-1">
                        <Move size={12} /> Trascina per esplorare
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className="bg-red-600 text-white p-2 rounded-full border-2 border-white hover:scale-110 active:scale-95 transition-all shadow-lg pointer-events-auto"
                >
                    <X size={24} strokeWidth={3} />
                </button>
            </div>

            {/* DRAGGABLE SKY LAYER */}
            <div 
                className="absolute w-full h-full cursor-move"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div 
                    style={{ 
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                        width: MAP_SIZE,
                        height: MAP_SIZE,
                        background: 'radial-gradient(circle at center, #0f172a 0%, #000000 100%)',
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                    }}
                    className="relative"
                >
                    {/* BACKGROUND STARS */}
                    {bgStars.map((star, i) => (
                        <div 
                            key={`bg-${i}`}
                            className="absolute rounded-full bg-white"
                            style={{
                                left: star.x,
                                top: star.y,
                                width: star.size,
                                height: star.size,
                                opacity: star.opacity,
                                boxShadow: `0 0 ${star.size * 2}px white`
                            }}
                        />
                    ))}

                    {/* CONSTELLATIONS */}
                    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                        {CONSTELLATIONS.map(constellation => (
                            <g key={constellation.id}>
                                {/* Lines */}
                                {constellation.lines.map((pair, idx) => {
                                    const s1 = constellation.stars[pair[0]];
                                    const s2 = constellation.stars[pair[1]];
                                    return (
                                        <line 
                                            key={`l-${idx}`}
                                            x1={s1.x} y1={s1.y}
                                            x2={s2.x} y2={s2.y}
                                            stroke={constellation.color}
                                            strokeWidth="2"
                                            strokeOpacity="0.6"
                                            strokeDasharray="5,5"
                                        />
                                    );
                                })}
                                {/* Stars */}
                                {constellation.stars.map((star, idx) => (
                                    <circle 
                                        key={`s-${idx}`}
                                        cx={star.x} cy={star.y}
                                        r="6"
                                        fill="white"
                                        filter="url(#glow)"
                                    />
                                ))}
                            </g>
                        ))}
                        {/* Glow Filter Definition */}
                        <defs>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                    </svg>

                    {/* LABELS (HTML for better text rendering) */}
                    {CONSTELLATIONS.map(c => {
                        // Calculate center of constellation for label
                        const avgX = c.stars.reduce((acc, s) => acc + s.x, 0) / c.stars.length;
                        const avgY = c.stars.reduce((acc, s) => acc + s.y, 0) / c.stars.length;
                        
                        return (
                            <div 
                                key={`label-${c.id}`}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
                                style={{ left: avgX, top: avgY + 60 }} // Offset label down
                            >
                                <span 
                                    className="text-white font-black text-sm md:text-lg uppercase tracking-widest drop-shadow-[0_2px_2px_black]"
                                    style={{ color: c.color, textShadow: '0 0 10px black' }}
                                >
                                    {c.name}
                                </span>
                            </div>
                        )
                    })}

                    {/* LONE BOO EASTER EGG */}
                    <div className="absolute top-[1800px] left-[1800px] animate-float opacity-80">
                        <span className="text-6xl filter drop-shadow-[0_0_20px_cyan]">👻</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StarMap;
