
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Sparkles, RotateCcw, CheckCircle2, AlertCircle, Settings, Trash2, Copy } from 'lucide-react';
import { CHARACTERS } from '../services/databaseAmici';
import { addTokens } from '../services/tokens';

const MIRROR_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/puliscispecchiobagnoboo33wq.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

// Nuovi Asset Pulsanti Finali
const BTN_REPLAY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rigiocaspecchiojyhg.webp';
const BTN_EXIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/escispecchiosporcoujh8.webp';

// --- MAPPATURA IMMAGINI SPECCHIO (ETERE) ---
const MIRROR_ASSETS: Record<string, string> = {
    'boo': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boomirror443.webp',
    'marlo': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/marlomirroede3w2.webp',
    'grufo': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grufomirroroe332ws.webp',
    'maragno': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/maragnomirrore322w2w.webp',
    'flora': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/floramirroroedeed32w.webp',
    'pumpkin': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccottomirrored3ws.webp',
    'raffa': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rafamirrore32w21q.webp',
    'andrea': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/andreamirrorde22ws.webp',
    'gaia': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gaiamirrorod3w2ws2ws.webp'
};

const DEFAULT_MIRROR_POLYGON = [{"x":21.87,"y":9.6},{"x":19.47,"y":13.04},{"x":20.53,"y":23.24},{"x":22.93,"y":29.24},{"x":23.73,"y":35.23},{"x":25.07,"y":41.83},{"x":25.33,"y":47.38},{"x":24,"y":53.82},{"x":25.6,"y":59.82},{"x":36,"y":60.12},{"x":43.47,"y":60.42},{"x":51.73,"y":60.87},{"x":59.73,"y":62.07},{"x":69.07,"y":62.22},{"x":74.4,"y":60.12},{"x":74.13,"y":53.97},{"x":74.13,"y":47.53},{"x":74.13,"y":41.23},{"x":74.67,"y":35.83},{"x":75.73,"y":29.84},{"x":77.33,"y":24.44},{"x":78.93,"y":20.54},{"x":79.73,"y":16.04},{"x":77.87,"y":11.84},{"x":61.6,"y":11.99},{"x":44.8,"y":10.79},{"x":32.8,"y":9.6}];

interface MirrorGameProps {
    onBack: () => void;
}

type GamePhase = 'SELECT' | 'CLEANING' | 'RESULT';

const MirrorGame: React.FC<MirrorGameProps> = ({ onBack }) => {
    const [phase, setPhase] = useState<GamePhase>('SELECT');
    const [userChoice, setUserChoice] = useState<string | null>(null);
    const [culprit, setCulprit] = useState<typeof CHARACTERS[0] | null>(null);
    const [isCleaned, setIsCleaned] = useState(false);
    
    const selectableCharacters = useMemo(() => CHARACTERS.filter(c => c.id !== 'batbeat'), []);

    const [isCalibrating, setIsCalibrating] = useState(false);
    const [polygon, setPolygon] = useState<any[]>(() => {
        const saved = localStorage.getItem('mirror_polygon_final');
        return saved ? JSON.parse(saved) : DEFAULT_MIRROR_POLYGON;
    });
    const [debugClicks, setDebugClicks] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef<{ x: number, y: number } | null>(null);
    const totalMirrorPixels = useRef(0);

    // Identifica se il colpevole è femmina
    const isFemale = useMemo(() => {
        return culprit && ['gaia', 'flora', 'raffa'].includes(culprit.id);
    }, [culprit]);

    const polygonBounds = useMemo(() => {
        if (!polygon.length) return { top: 0, left: 0, width: 100, height: 100 };
        const xs = polygon.map(p => p.x);
        const ys = polygon.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        return {
            left: minX,
            top: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }, [polygon]);

    useEffect(() => {
        const randomChar = selectableCharacters[Math.floor(Math.random() * selectableCharacters.length)];
        setCulprit(randomChar);
    }, [selectableCharacters]);

    useEffect(() => {
        if (phase === 'CLEANING' && canvasRef.current) {
            initMirrorDirt();
        }
    }, [phase, polygon]);

    const initMirrorDirt = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (polygon.length < 3) return;

        ctx.save();
        ctx.beginPath();
        polygon.forEach((p, i) => {
            const px = (p.x / 100) * canvas.width;
            const py = (p.y / 100) * canvas.height;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.clip();

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#e2e8f0');
        gradient.addColorStop(0.5, '#f8fafc');
        gradient.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.98;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 50 + 20, 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 ? 'white' : '#94a3b8';
            ctx.fill();
        }
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let count = 0;
        for (let i = 3; i < imageData.data.length; i += 40) {
            if (imageData.data[i] > 0) count++;
        }
        totalMirrorPixels.current = count;
    };

    const handleCalibratorClick = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isCalibrating) return;
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const x = Number(((clientX / window.innerWidth) * 100).toFixed(2));
        const y = Number(((clientY / window.innerHeight) * 100).toFixed(2));
        setPolygon(prev => [...prev, { x, y }]);
    };

    const startDrawing = (clientX: number, clientY: number) => {
        if (isCalibrating || isCleaned || phase !== 'CLEANING') return;
        isDrawing.current = true;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
        }
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDrawing.current || isCalibrating || isCleaned || phase !== 'CLEANING') return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !lastPos.current) return;

        const x = clientX - canvas.getBoundingClientRect().left;
        const y = clientY - canvas.getBoundingClientRect().top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 60;

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastPos.current = { x, y };
        checkCleaningProgress();
    };

    const checkCleaningProgress = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (!canvas || !ctx || totalMirrorPixels.current === 0) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let currentDirt = 0;

        for (let i = 3; i < data.length; i += 40) {
            if (data[i] > 10) currentDirt++;
        }

        const cleanedPercentage = 100 - (currentDirt / totalMirrorPixels.current * 100);

        if (cleanedPercentage >= 70 && !isCleaned) { 
            setIsCleaned(true);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setTimeout(() => {
                setPhase('RESULT');
            }, 3000);
        }
    };

    const stopDrawing = () => {
        isDrawing.current = false;
        lastPos.current = null;
    };

    const handleTitleClick = () => {
        setDebugClicks(prev => {
            const next = prev + 1;
            if (next >= 5) {
                setIsCalibrating(!isCalibrating);
                return 0;
            }
            return next;
        });
    };

    const saveCalibration = () => {
        localStorage.setItem('mirror_polygon_final', JSON.stringify(polygon));
        alert("Coordinate salvate!");
    };

    const copyCalibration = () => {
        navigator.clipboard.writeText(JSON.stringify(polygon));
        alert("JSON Copiato!");
    };

    const isWin = userChoice === culprit?.name;
    const getClipPath = () => `polygon(${polygon.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    return (
        <div className="fixed inset-0 z-[160] bg-slate-950 flex flex-col overflow-hidden animate-in fade-in duration-700">
            {/* SFONDO BAGNO */}
            <img src={MIRROR_BG} className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none" alt="" />
            
            {/* PERSONAGGIO RIVELATO (SEMPRE TRASLUCIDO ED ETEREO) */}
            <div 
                className="absolute inset-0 z-10 overflow-hidden pointer-events-none transition-all duration-700"
                style={{ clipPath: getClipPath() }}
            >
                {culprit && (
                    <img 
                        src={MIRROR_ASSETS[culprit.id] || culprit.image} 
                        alt="" 
                        className={`absolute object-contain transition-all duration-[2000ms] ${isCleaned ? 'opacity-65 blur-0 scale-105' : 'opacity-15 blur-lg scale-100'}`}
                        style={{ 
                            top: `${polygonBounds.top}%`,
                            left: `${polygonBounds.left}%`,
                            width: `${polygonBounds.width}%`,
                            height: `${polygonBounds.height}%`,
                            mixBlendMode: 'multiply', 
                            filter: `drop-shadow(0 0 20px rgba(255,255,255,0.8))`
                        }}
                    />
                )}
            </div>

            {/* CANVAS PULIZIA */}
            <canvas 
                ref={canvasRef}
                className={`absolute inset-0 z-20 cursor-crosshair touch-none transition-opacity duration-1000 ${isCleaned ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
                onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => startDrawing(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => { if (e.cancelable) e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY); }}
                onTouchEnd={stopDrawing}
                onClick={isCalibrating ? (e) => handleCalibratorClick(e) : undefined}
            />

            {/* UI SUPERIORE - ALZATA AL MASSIMO (pt-1) */}
            <div className="relative z-50 flex justify-between items-start p-2 pt-1 md:pt-2 pointer-events-none">
                <button onClick={onBack} className="pointer-events-auto hover:scale-110 active:scale-95 transition-transform outline-none">
                    <img src={BTN_CLOSE_IMG} className="w-14 h-14 md:w-20 drop-shadow-xl" alt="Esci" />
                </button>

                <div className="flex flex-col items-center gap-2">
                    <div onClick={handleTitleClick} className="pointer-events-auto bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl border-4 border-blue-500 shadow-xl flex items-center gap-3 cursor-pointer">
                        <span className="font-luckiest text-blue-600 text-lg md:text-2xl uppercase">
                            {isCalibrating ? 'CALIBRAZIONE' : phase === 'SELECT' ? 'Chi è il birichino o la birichina?' : isCleaned ? 'Splendente! ✨' : 'Pulisci bene! 🧼'}
                        </span>
                    </div>
                </div>

                <div className="w-20" />
            </div>

            {/* MODALE SELEZIONE */}
            {phase === 'SELECT' && (
                <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white p-6 md:p-8 rounded-[3rem] border-8 border-blue-400 shadow-2xl max-w-2xl w-full animate-in zoom-in flex flex-col items-center">
                        <h2 className="text-2xl md:text-5xl font-luckiest text-blue-600 mb-2 uppercase text-center leading-none">Chi è il sospettato? 🔍</h2>
                        <p className="text-gray-600 font-bold mb-8 text-center text-base md:text-xl">Tocca un personaggio e pulisci quasi tutto lo specchio!</p>
                        
                        <div className="grid grid-cols-3 gap-x-4 gap-y-6 md:gap-x-10 md:gap-y-12 w-full max-h-[60vh] overflow-y-auto no-scrollbar">
                            {selectableCharacters.map(char => (
                                <button 
                                    key={char.id} 
                                    onClick={() => { setUserChoice(char.name); setPhase('CLEANING'); }}
                                    className="group flex flex-col items-center transition-all active:scale-90"
                                >
                                    <div className="w-20 h-20 md:w-36 md:h-36 flex items-center justify-center">
                                        <img src={char.image} alt={char.name} className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* MODALE RISULTATO - DUE TASTI GRAFICI */}
            {phase === 'RESULT' && (
                <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white p-8 md:p-12 rounded-[4rem] border-8 border-blue-500 shadow-2xl max-w-md w-full animate-in zoom-in text-center flex flex-col items-center">
                        <div className="mb-6 w-52 h-52 md:w-64 md:h-64 flex items-center justify-center">
                            <img src={culprit?.image} alt="" className="w-full h-full object-contain drop-shadow-xl" />
                        </div>

                        {isWin ? (
                            <>
                                <h3 className="text-3xl md:text-5xl font-luckiest text-green-600 mb-2 uppercase">BRAVO! 🎉</h3>
                                <p className="text-gray-600 font-bold mb-8 text-lg">Era proprio <span className={isFemale ? "text-pink-500 font-black" : "text-blue-600 font-black"}>{culprit?.name}</span>! <br/>Indagine chiusa!</p>
                                <div className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black text-2xl border-4 border-black mb-8 shadow-lg animate-pulse">+15 🪙</div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-3xl md:text-5xl font-luckiest text-red-600 mb-2 uppercase">QUASI! 🧐</h3>
                                <p className="text-gray-600 font-bold mb-8 text-lg">Pensavi fosse {userChoice}... ma {isFemale ? 'la birichina' : 'il birichino'} era <span className={isFemale ? "text-pink-500 font-black" : "text-red-500 font-black"}>{culprit?.name}</span>!</p>
                            </>
                        )}

                        <div className="flex flex-row gap-4 w-full justify-center items-center mt-2">
                            <button 
                                onClick={() => { 
                                    const randomChar = selectableCharacters[Math.floor(Math.random() * selectableCharacters.length)];
                                    if (isWin) addTokens(15);
                                    setCulprit(randomChar);
                                    setPhase('SELECT'); 
                                    setIsCleaned(false);
                                }}
                                className="hover:scale-105 active:scale-95 transition-transform outline-none"
                            >
                                <img src={BTN_REPLAY_IMG} alt="Rigioca" className="w-32 md:w-48 h-auto drop-shadow-lg" />
                            </button>
                            <button 
                                onClick={() => {
                                    if (isWin) addTokens(15);
                                    onBack();
                                }}
                                className="hover:scale-105 active:scale-95 transition-transform outline-none"
                            >
                                <img src={BTN_EXIT_IMG} alt="Esci" className="w-32 md:w-48 h-auto drop-shadow-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CALIBRATORE */}
            {isCalibrating && (
                <div className="fixed inset-0 z-[250] bg-black/40 pointer-events-auto">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <polygon points={polygon.map(p => `${(p.x/100)*window.innerWidth},${(p.y/100)*window.innerHeight}`).join(' ')} fill="rgba(255, 234, 0, 0.3)" stroke="#FFEA00" strokeWidth="3" strokeDasharray="10,5" />
                        {polygon.map((p, i) => (
                            <circle key={i} cx={(p.x/100)*window.innerWidth} cy={(p.y/100)*window.innerHeight} r="6" fill="#FFEA00" stroke="black" strokeWidth="2" />
                        ))}
                    </svg>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 border-4 border-yellow-400 p-4 rounded-3xl flex gap-4 pointer-events-auto shadow-2xl">
                        <button onClick={() => setPolygon([])} className="bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2"><Trash2 size={16}/> Reset</button>
                        <button onClick={saveCalibration} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2"><Settings size={16}/> Salva</button>
                        <button onClick={copyCalibration} className="bg-green-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2"><Settings size={16}/> Copia JSON</button>
                        <button onClick={() => setIsCalibrating(false)} className="bg-gray-600 text-white p-2 rounded-xl"><X size={20}/></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MirrorGame;
