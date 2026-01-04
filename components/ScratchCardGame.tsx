
import React, { useState, useEffect, useRef } from 'react';
import { X, Star, Percent, Check, Lock, ShieldCheck } from 'lucide-react';
import { addTokens } from '../services/tokens';

const BG_SCRATCH = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/game-scratch-card.webp';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';
const BTN_NEW_IMG = 'https://i.postimg.cc/cC0DFrNT/nuododeo-(1)-(1).png';
const BTN_RULES_IMG = 'https://i.postimg.cc/FsFWcdpV/regolejd-(1)-(1).png';
const ICON_PARENTS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';
const IMG_LOCKED_GAMES = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/yesnoi.webp';

// Renamed to ScratchPoint to avoid potential collisions
type ScratchPoint = { x: number; y: number };

// COORDINATE NORMALIZZATE PER ALLINEAMENTO PERFETTO
const X_COLS = [20.25, 36.00, 52.00, 67.75]; 
const BOX_WIDTH = 11.75;
const WIN_Y = { top: 15.50, bottom: 23.50 };
const PLAY_Y1 = { top: 38.50, bottom: 47.20 };
const PLAY_Y2 = { top: 50.20, bottom: 58.30 };
const PLAY_Y3 = { top: 61.30, bottom: 69.50 };

const FIXED_ZONES = {
  "winning": [
    { "id": "win-0", "points": [{ "x": X_COLS[0], "y": WIN_Y.top }, { "x": X_COLS[0], "y": WIN_Y.bottom }, { "x": X_COLS[0] + BOX_WIDTH, "y": WIN_Y.bottom }, { "x": X_COLS[0] + BOX_WIDTH, "y": WIN_Y.top }] },
    { "id": "win-1", "points": [{ "x": X_COLS[1], "y": WIN_Y.top }, { "x": X_COLS[1], "y": WIN_Y.bottom }, { "x": X_COLS[1] + BOX_WIDTH, "y": WIN_Y.bottom }, { "x": X_COLS[1] + BOX_WIDTH, "y": WIN_Y.top }] },
    { "id": "win-2", "points": [{ "x": X_COLS[2], "y": WIN_Y.top }, { "x": X_COLS[2], "y": WIN_Y.bottom }, { "x": X_COLS[2] + BOX_WIDTH, "y": WIN_Y.bottom }, { "x": X_COLS[2] + BOX_WIDTH, "y": WIN_Y.top }] },
    { "id": "win-3", "points": [{ "x": X_COLS[3], "y": WIN_Y.top }, { "x": X_COLS[3], "y": WIN_Y.bottom }, { "x": X_COLS[3] + BOX_WIDTH, "y": WIN_Y.bottom }, { "x": X_COLS[3] + BOX_WIDTH, "y": WIN_Y.top }] }
  ],
  "player": [
    { "id": "play-0", "points": [{ "x": X_COLS[0], "y": PLAY_Y1.top }, { "x": X_COLS[0], "y": PLAY_Y1.bottom }, { "x": X_COLS[0] + BOX_WIDTH, "y": PLAY_Y1.bottom }, { "x": X_COLS[0] + BOX_WIDTH, "y": PLAY_Y1.top }] },
    { "id": "play-1", "points": [{ "x": X_COLS[1], "y": PLAY_Y1.top }, { "x": X_COLS[1], "y": PLAY_Y1.bottom }, { "x": X_COLS[1] + BOX_WIDTH, "y": PLAY_Y1.bottom }, { "x": X_COLS[1] + BOX_WIDTH, "y": PLAY_Y1.top }] },
    { "id": "play-2", "points": [{ "x": X_COLS[2], "y": PLAY_Y1.top }, { "x": X_COLS[2], "y": PLAY_Y1.bottom }, { "x": X_COLS[2] + BOX_WIDTH, "y": PLAY_Y1.bottom }, { "x": X_COLS[2] + BOX_WIDTH, "y": PLAY_Y1.top }] },
    { "id": "play-3", "points": [{ "x": X_COLS[3], "y": PLAY_Y1.top }, { "x": X_COLS[3], "y": PLAY_Y1.bottom }, { "x": X_COLS[3] + BOX_WIDTH, "y": PLAY_Y1.bottom }, { "x": X_COLS[3] + BOX_WIDTH, "y": PLAY_Y1.top }] },
    { "id": "play-4", "points": [{ "x": X_COLS[0], "y": PLAY_Y2.top }, { "x": X_COLS[0], "y": PLAY_Y2.bottom }, { "x": X_COLS[0] + BOX_WIDTH, "y": PLAY_Y2.bottom }, { "x": X_COLS[0] + BOX_WIDTH, "y": PLAY_Y2.top }] },
    { "id": "play-5", "points": [{ "x": X_COLS[1], "y": PLAY_Y2.top }, { "x": X_COLS[1], "y": PLAY_Y2.bottom }, { "x": X_COLS[1] + BOX_WIDTH, "y": PLAY_Y2.bottom }, { "x": X_COLS[1] + BOX_WIDTH, "y": PLAY_Y2.top }] },
    { "id": "play-6", "points": [{ "x": X_COLS[2], "y": PLAY_Y2.top }, { "x": X_COLS[2], "y": PLAY_Y2.bottom }, { "x": X_COLS[2] + BOX_WIDTH, "y": PLAY_Y2.bottom }, { "x": X_COLS[2] + BOX_WIDTH, "y": PLAY_Y2.top }] },
    { "id": "play-7", "points": [{ "x": X_COLS[3], "y": PLAY_Y2.top }, { "x": X_COLS[3], "y": PLAY_Y2.bottom }, { "x": X_COLS[3] + BOX_WIDTH, "y": PLAY_Y2.bottom }, { "x": X_COLS[3] + BOX_WIDTH, "y": PLAY_Y2.top }] },
    { "id": "play-8", "points": [{ "x": X_COLS[0], "y": PLAY_Y3.top }, { "x": X_COLS[0], "y": PLAY_Y3.bottom }, { "x": X_COLS[0] + BOX_WIDTH, "y": PLAY_Y3.bottom }, { "x": X_COLS[0] + BOX_WIDTH, "y": PLAY_Y3.top }] },
    { "id": "play-9", "points": [{ "x": X_COLS[1], "y": PLAY_Y3.top }, { "x": X_COLS[1], "y": PLAY_Y3.bottom }, { "x": X_COLS[1] + BOX_WIDTH, "y": PLAY_Y3.bottom }, { "x": X_COLS[1] + BOX_WIDTH, "y": PLAY_Y3.top }] },
    { "id": "play-10", "points": [{ "x": X_COLS[2], "y": PLAY_Y3.top }, { "x": X_COLS[2], "y": PLAY_Y3.bottom }, { "x": X_COLS[2] + BOX_WIDTH, "y": PLAY_Y3.bottom }, { "x": X_COLS[2] + BOX_WIDTH, "y": PLAY_Y3.top }] },
    { "id": "play-11", "points": [{ "x": X_COLS[3], "y": PLAY_Y3.top }, { "x": X_COLS[3], "y": PLAY_Y3.bottom }, { "x": X_COLS[3] + BOX_WIDTH, "y": PLAY_Y3.bottom }, { "x": X_COLS[3] + BOX_WIDTH, "y": PLAY_Y3.top }] }
  ]
};

// Moved ScratchArea up to avoid temporal dead zone and ensure correct type inference for default export
const ScratchArea: React.FC<{ points: ScratchPoint[], value: number, prize?: number, onRevealed: () => void }> = ({ points, value, prize, onRevealed }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef<{x: number, y: number} | null>(null);
    const [hasTriggered, setHasTriggered] = useState(false);

    const xs = points.map(p => p.x); const ys = points.map(p => p.y);
    const minX = Math.min(...xs); const maxX = Math.max(...xs);
    const minY = Math.min(...ys); const maxY = Math.max(...ys);
    const width = maxX - minX; const height = maxY - minY;

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
        ctx.fillStyle = '#94a3b8'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out'; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = 40;
    }, []);

    const checkRevealed = () => {
        if (hasTriggered) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (!canvas || !ctx) return;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0; 
        const data = imageData.data;
        for (let i = 3; i < data.length; i += 16) { if (data[i] === 0) transparent++; }
        
        if ((transparent / (data.length / 16)) * 100 > 3) { 
            setHasTriggered(true); 
            onRevealed(); 
        }
    };

    const scratch = (clientX: number, clientY: number) => {
        if (!isDrawing.current) return;
        const canvas = canvasRef.current; const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left; const y = clientY - rect.top;
        ctx.beginPath();
        if (lastPos.current) { ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(x, y); ctx.stroke(); } 
        else { ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill(); }
        lastPos.current = { x, y };
        checkRevealed();
    };

    return (
        <div className="absolute overflow-hidden" style={{ left: `${minX}%`, top: `${minY}%`, width: `${width}%`, height: `${height}%` }}>
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-1 pointer-events-none select-none">
                <span className="font-black text-blue-900 text-xl md:text-4xl leading-none">{value}</span>
                {prize && <span className="text-[8px] md:text-xs font-black text-green-600 mt-0.5">{prize}🪙</span>}
            </div>
            <canvas ref={canvasRef} className="absolute inset-0 cursor-crosshair touch-none" 
                onMouseDown={(e) => { isDrawing.current = true; scratch(e.clientX, e.clientY); }}
                onMouseMove={(e) => scratch(e.clientX, e.clientY)}
                onMouseUp={() => { isDrawing.current = false; lastPos.current = null; }}
                onTouchStart={(e) => { isDrawing.current = true; scratch(e.touches[0].clientX, e.touches[0].clientY); }}
                onTouchMove={(e) => { if(e.cancelable) e.preventDefault(); scratch(e.touches[0].clientX, e.touches[0].clientY); }}
                onTouchEnd={() => { isDrawing.current = false; lastPos.current = null; }}
            />
        </div>
    );
};

const ScratchCardGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [gameData, setGameData] = useState<{
        winningNums: number[],
        playerNums: { num: number, prize: number }[],
        totalWin: number,
        gameId: number
    } | null>(null);
    const [revealedCount, setRevealedCount] = useState(0);
    const [showRules, setShowRules] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('authorized_games_enabled') === 'true');

    useEffect(() => {
        const handleSettingsUpdate = () => {
            setIsAuthorized(localStorage.getItem('authorized_games_enabled') === 'true');
        };
        window.addEventListener('settingsChanged', handleSettingsUpdate);
        return () => window.removeEventListener('settingsChanged', handleSettingsUpdate);
    }, []);

    const initNumbers = () => {
        const isWinnerTicket = Math.random() < 0.4;
        
        const winSet = new Set<number>();
        while(winSet.size < 4) winSet.add(Math.floor(Math.random() * 90) + 1);
        const win = Array.from(winSet);

        let totalWin = 0;
        const playerSet = new Set<number>();
        const play: { num: number, prize: number }[] = [];

        while(playerSet.size < 12) {
            const num = Math.floor(Math.random() * 90) + 1;
            if (!playerSet.has(num) && !winSet.has(num)) {
                playerSet.add(num);
                const rand = Math.random();
                let prize = 2;
                if (rand > 0.995) prize = 500;
                else if (rand > 0.98) prize = 100;
                else if (rand > 0.94) prize = 50;
                else if (rand > 0.87) prize = 20;
                else if (rand > 0.75) prize = 10;
                else if (rand > 0.50) prize = 5;
                play.push({ num, prize });
            }
        }

        if (isWinnerTicket) {
            const luckyIdx = Math.floor(Math.random() * 12);
            const luckyWinIdx = Math.floor(Math.random() * 4);
            play[luckyIdx].num = win[luckyWinIdx];
        }

        play.forEach(p => {
            if (win.includes(p.num)) totalWin += p.prize;
        });

        setGameData({ winningNums: win, playerNums: play, totalWin, gameId: Date.now() });
        setRevealedCount(0);
        if (totalWin > 0) addTokens(totalWin);
    };

    useEffect(() => {
        if (isAuthorized) initNumbers();
    }, [isAuthorized]);

    const allRevealed = revealedCount >= 16;

    if (!isAuthorized) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white w-full max-w-sm rounded-[40px] border-8 border-orange-500 p-8 flex flex-col items-center text-center shadow-2xl relative">
                    <button onClick={onBack} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110"><X size={24} strokeWidth={4}/></button>
                    
                    <div className="w-60 h-60 mb-4">
                        <img src={IMG_LOCKED_GAMES} alt="Autorizzazione" className="w-full h-full object-contain" />
                    </div>

                    <h2 className="text-3xl font-black text-orange-600 mb-4 uppercase leading-tight font-luckiest">Gioco Bloccato!</h2>
                    
                    <p className="text-gray-600 font-bold mb-8 leading-relaxed">
                        Chiedi a <span className="text-blue-600">Papà</span> o <span className="text-pink-500">Mamma</span> di attivare questo gioco nell'Area Genitori.
                    </p>

                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('triggerParentalGate'))}
                        className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 text-lg shadow-lg"
                    >
                        <img src={ICON_PARENTS} alt="" className="w-8 h-8 object-contain" />
                        VAI DAI GENITORI
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[90] bg-black flex flex-col pt-[68px] md:pt-[106px] animate-in fade-in overflow-hidden select-none touch-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
            <div className="relative flex-1 w-full h-full overflow-hidden">
                <img src={BG_SCRATCH} alt="Gratta e Vinci" className="w-full h-full object-fill pointer-events-none" />
                {gameData && (
                    <div className="absolute inset-0 z-10" key={gameData.gameId}>
                        {FIXED_ZONES.winning.map((z, i) => (
                            <ScratchArea key={`win-${i}-${gameData.gameId}`} points={z.points} value={gameData.winningNums[i]} onRevealed={() => setRevealedCount(prev => prev + 1)} />
                        ))}
                        {FIXED_ZONES.player.map((z, i) => (
                            <ScratchArea key={`play-${i}-${gameData.gameId}`} points={z.points} value={gameData.playerNums[i].num} prize={gameData.playerNums[i].prize} onRevealed={() => setRevealedCount(prev => prev + 1)} />
                        ))}
                        
                        {allRevealed && (
                            <div 
                                className="absolute flex items-center justify-center animate-in zoom-in duration-500 pointer-events-none overflow-hidden"
                                style={{ left: `23.5%`, top: `76%`, width: `53%`, height: `9%` }}
                            >
                                <div 
                                    className={`text-center font-luckiest uppercase flex items-center justify-center h-full w-full leading-[0.9] px-2 ${gameData.totalWin > 0 ? 'text-yellow-400' : 'text-white'}`}
                                    style={{ 
                                        fontSize: 'clamp(10px, 3.5vh, 22px)',
                                        WebkitTextStroke: gameData.totalWin > 0 ? '1.5px #854d0e' : '1.5px #b91c1c', 
                                        textShadow: '2px 2px 0px rgba(0,0,0,0.5)' 
                                    }}
                                >
                                    {gameData.totalWin > 0 ? `HAI VINTO ${gameData.totalWin} GETTONI!` : "RITENTA, SARAI PIÙ FORTUNATO!"}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="fixed top-28 right-4 z-[95] flex flex-col gap-4 items-center">
                <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-12 h-12 md:w-20 h-auto drop-shadow-2xl" />
                </button>
                <button onClick={initNumbers} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_NEW_IMG} alt="Nuovo" className="w-12 h-12 md:w-20 h-auto drop-shadow-2xl" />
                </button>
                <button onClick={() => setShowRules(true)} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_RULES_IMG} alt="Regole" className="w-12 h-12 md:w-20 h-auto drop-shadow-2xl" />
                </button>
            </div>

            {showRules && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowRules(false)}>
                    <div className="bg-white rounded-[40px] border-8 border-boo-purple p-6 max-w-sm w-full shadow-2xl relative flex flex-col" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowRules(false)} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black"><X size={24} strokeWidth={4}/></button>
                        
                        <h3 className="text-4xl font-black text-boo-purple uppercase text-center mb-6 font-luckiest">Regole del Gioco</h3>
                        
                        <div className="space-y-4 text-gray-700 font-bold mb-8 text-sm md:text-xl">
                            <div className="flex items-center gap-3"><Check className="text-green-500 shrink-0" size={24} strokeWidth={4}/><p>Gratta i <span className="text-blue-600">4 NUMERI VINCENTI</span>.</p></div>
                            <div className="flex items-center gap-3"><Check className="text-green-500 shrink-0" size={24} strokeWidth={4}/><p>Gratta i tuoi <span className="text-orange-500">12 NUMERI</span> sotto.</p></div>
                            <div className="flex items-center gap-3"><Check className="text-green-500 shrink-0" size={24} strokeWidth={4}/><p>Se trovi un numero uguale, <span className="text-purple-600">VINCI IL PREMIO!</span></p></div>
                        </div>

                        <div className="bg-slate-50 rounded-[2.5rem] p-5 border-4 border-slate-100">
                            <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2 font-luckiest uppercase"><Percent className="text-boo-purple" size={26} /> Vincite</h4>
                            <table className="w-full text-sm md:text-lg">
                                <tbody className="font-bold text-slate-600">
                                    <tr className="border-b-2 border-slate-200"><td className="py-2">500 Gettoni 🪙</td><td className="text-right text-red-500 font-black">Rarissimo (0.5%)</td></tr>
                                    <tr className="border-b-2 border-slate-200"><td className="py-2">100 Gettoni 🪙</td><td className="text-right text-orange-500 font-black">Raro (1.5%)</td></tr>
                                    <tr className="border-b-2 border-slate-200"><td className="py-2">50 Gettoni 🪙</td><td className="text-right text-yellow-600 font-black">Speciale (4%)</td></tr>
                                    <tr className="border-b-2 border-slate-200"><td className="py-2">10-20 Gettoni 🪙</td><td className="text-right text-blue-600 font-black">Buona (19%)</td></tr>
                                    <tr><td className="py-2">2-5 Gettoni 🪙</td><td className="text-right text-green-600 font-black">Comune (75%)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-gray-400 font-bold mt-6 text-center italic">Circa il 40% dei biglietti emessi sono vincenti.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScratchCardGame;
