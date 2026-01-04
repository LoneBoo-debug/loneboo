import React, { useState, useRef, useEffect } from 'react';
import { Move } from 'lucide-react';

// --- DATA: LE 12 COSTELLAZIONI ---
const CONSTELLATIONS = [
    { id: 'aries', name: 'ARIETE ♈', stars: [{x: 300, y: 400}, {x: 380, y: 380}, {x: 450, y: 420}, {x: 480, y: 480}], lines: [[0,1], [1,2], [2,3]], color: '#ff9999' },
    { id: 'taurus', name: 'TORO ♉', stars: [{x: 600, y: 300}, {x: 650, y: 350}, {x: 700, y: 320}, {x: 650, y: 450}, {x: 750, y: 400}], lines: [[0,1], [1,2], [1,3], [3,4]], color: '#99ff99' },
    { id: 'gemini', name: 'GEMELLI ♊', stars: [{x: 900, y: 200}, {x: 950, y: 200}, {x: 900, y: 500}, {x: 950, y: 500}, {x: 925, y: 350}], lines: [[0,2], [1,3], [2,4], [3,4]], color: '#ffff99' },
    { id: 'cancer', name: 'CANCRO ♋', stars: [{x: 1200, y: 400}, {x: 1250, y: 450}, {x: 1300, y: 400}, {x: 1250, y: 550}, {x: 1250, y: 350}], lines: [[0,1], [1,2], [1,3], [1,4]], color: '#99ccff' },
    { id: 'leo', name: 'LEONE ♌', stars: [{x: 1500, y: 300}, {x: 1550, y: 250}, {x: 1600, y: 280}, {x: 1580, y: 350}, {x: 1500, y: 450}, {x: 1650, y: 400}], lines: [[0,1], [1,2], [2,3], [3,4], [3,5], [4,5]], color: '#ffcc99' },
    { id: 'virgo', name: 'VERGINE ♍', stars: [{x: 300, y: 800}, {x: 400, y: 750}, {x: 500, y: 800}, {x: 450, y: 900}, {x: 350, y: 950}, {x: 250, y: 850}], lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]], color: '#d9b3ff' },
    { id: 'libra', name: 'BILANCIA ♎', stars: [{x: 700, y: 800}, {x: 800, y: 750}, {x: 900, y: 800}, {x: 800, y: 950}], lines: [[0,1], [1,2], [0,3], [2,3]], color: '#ff99cc' },
    { id: 'scorpio', name: 'SCORPIONE ♏', stars: [{x: 1100, y: 800}, {x: 1150, y: 850}, {x: 1150, y: 950}, {x: 1100, y: 1050}, {x: 1200, y: 1050}, {x: 1250, y: 1000}], lines: [[0,1], [1,2], [2,3], [3,4], [4,5]], color: '#ff4d4d' },
    { id: 'sagittarius', name: 'SAGITTARIO ♐', stars: [{x: 1500, y: 800}, {x: 1600, y: 800}, {x: 1550, y: 750}, {x: 1550, y: 900}, {x: 1450, y: 950}, {x: 1650, y: 950}], lines: [[0,1], [0,2], [1,2], [0,3], [1,3], [3,4], [3,5]], color: '#99e6e6' },
    { id: 'capricorn', name: 'CAPRICORNO ♑', stars: [{x: 400, y: 1300}, {x: 500, y: 1250}, {x: 600, y: 1300}, {x: 500, y: 1400}], lines: [[0,1], [1,2], [2,3], [3,0]], color: '#cccc00' },
    { id: 'aquarius', name: 'ACQUARIO ♒', stars: [{x: 800, y: 1250}, {x: 850, y: 1300}, {x: 900, y: 1250}, {x: 950, y: 1300}, {x: 1000, y: 1250}], lines: [[0,1], [1,2], [2,3], [3,4]], color: '#66ffcc' },
    { id: 'pisces', name: 'PESCI ♓', stars: [{x: 1300, y: 1300}, {x: 1400, y: 1250}, {x: 1500, y: 1350}, {x: 1400, y: 1450}, {x: 1400, y: 1350}], lines: [[0,4], [4,1], [4,2], [4,3]], color: '#cc99ff' }
];

const MAP_SIZE = 2000;
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

const StarMap: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [offset, setOffset] = useState({ x: -300, y: -300 });
    const [isDragging, setIsDragging] = useState(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const [bgStars, setBgStars] = useState<{x: number, y: number, size: number, opacity: number}[]>([]);

    useEffect(() => {
        const stars = [];
        for (let i = 0; i < 300; i++) {
            stars.push({ x: Math.random() * MAP_SIZE, y: Math.random() * MAP_SIZE, size: Math.random() * 3 + 1, opacity: Math.random() });
        }
        setBgStars(stars);
        
        // Blocca lo scroll del body quando la mappa è aperta
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

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
            
            // Impediamo di uscire troppo dai bordi della mappa rispetto alla finestra corrente
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight; 
            
            const minX = -(MAP_SIZE - containerWidth);
            const minY = -(MAP_SIZE - containerHeight); 
            
            if (newX > 0) newX = 0;
            if (newY > 0) newY = 0;
            if (newX < minX) newX = minX;
            if (newY < minY) newY = minY;

            return { x: newX, y: newY };
        });
        
        lastPos.current = { x: clientX, y: clientY };
    };

    const handleEnd = () => setIsDragging(false);

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col overflow-hidden select-none touch-none animate-in fade-in duration-500">
            
            {/* Header Mappa - Robusto e fisso sopra l'header globale */}
            <div className="bg-slate-900 p-4 md:p-6 flex items-center justify-between border-b-4 border-cyan-800 shrink-0 shadow-xl relative z-[210]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onClose} 
                        className="hover:scale-110 active:scale-95 transition-transform flex items-center justify-center pointer-events-auto outline-none"
                        title="Torna in Camera"
                    >
                        <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-20 md:h-20 drop-shadow-xl" />
                    </button>
                    <div>
                        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-cyan-400 drop-shadow-sm leading-none">Telescopio 🔭</h2>
                        <p className="text-[10px] md:text-xs font-bold text-cyan-600 flex items-center gap-1 uppercase mt-1">
                            <Move size={12} /> Trascina per esplorare il cielo
                        </p>
                    </div>
                </div>
                <div className="hidden md:block">
                   <span className="text-cyan-900 font-black text-4xl opacity-20 select-none">LONE BOO SKY</span>
                </div>
            </div>

            {/* Area Mappa - Touch Action None previene lo scroll del browser */}
            <div 
                className="flex-1 relative cursor-move overflow-hidden touch-none"
                style={{ touchAction: 'none' }}
                onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
                onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleEnd}
            >
                <div 
                    style={{ 
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                        width: MAP_SIZE,
                        height: MAP_SIZE,
                        background: 'radial-gradient(circle at center, #0f172a 0%, #000000 100%)',
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    }}
                    className="relative"
                >
                    {bgStars.map((star, i) => (
                        <div key={`bg-${i}`} className="absolute rounded-full bg-white" style={{ left: star.x, top: star.y, width: star.size, height: star.size, opacity: star.opacity, boxShadow: `0 0 ${star.size * 2}px white` }} />
                    ))}

                    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                        {CONSTELLATIONS.map(constellation => (
                            <g key={constellation.id}>
                                {constellation.lines.map((pair, idx) => {
                                    const s1 = constellation.stars[pair[0]];
                                    const s2 = constellation.stars[pair[1]];
                                    return <line key={`l-${idx}`} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke={constellation.color} strokeWidth="2" strokeOpacity="0.4" strokeDasharray="5,5" />;
                                })}
                                {constellation.stars.map((star, idx) => (
                                    <circle key={`s-${idx}`} cx={star.x} cy={star.y} r="5" fill="white" filter="url(#glow)" />
                                ))}
                            </g>
                        ))}
                        <defs>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                        </defs>
                    </svg>

                    {CONSTELLATIONS.map(c => {
                        const avgX = c.stars.reduce((acc, s) => acc + s.x, 0) / c.stars.length;
                        const avgY = c.stars.reduce((acc, s) => acc + s.y, 0) / c.stars.length;
                        return (
                            <div key={`label-${c.id}`} className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ left: avgX, top: avgY + 50 }}>
                                <span className="text-white font-black text-xs md:text-base uppercase tracking-widest" style={{ color: c.color, textShadow: '0 0 8px black' }}>{c.name}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default StarMap;