
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getProgress, addTokens } from '../services/tokens';

const TETRIS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/frigsapert.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nav-to-kitchen-sx.webp';
const BOO_POP_IMG = 'https://i.postimg.cc/Sx2DkBZ5/acchiappabooesce.png';
const ICE_CUBE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cuboice.webp';

// Asset Pulsanti Personalizzati
const BTN_LEFT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/arrsxss.webp';
const BTN_DOWN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/arrdoensw.webp';
const BTN_RIGHT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/arrdxsd.webp';
const BTN_ROTATE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/recucyhde.webp';

// Asset Modali Personalizzati
const BTN_GIOCA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giochhde.webp';
const BTN_RETRY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giocancoreee.webp';
const BTN_EXIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/escittresg.webp';
const GAMEOVER_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icescioltre.webp';

// Configurazione Tetris - 14 colonne e 20 righe
const COLS = 14;
const ROWS = 20;

type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

interface Tetromino {
    shape: number[][];
    type: PieceType;
}

const TETROMINOS: Record<PieceType, Tetromino> = {
    'I': { shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], type: 'I' },
    'J': { shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]], type: 'J' },
    'L': { shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]], type: 'L' },
    'O': { shape: [[1, 1], [1, 1]], type: 'O' },
    'S': { shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]], type: 'S' },
    'T': { shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]], type: 'T' },
    'Z': { shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]], type: 'Z' }
};

const RANDOM_PIECE = () => {
    const keys: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return TETROMINOS[randomKey];
};

interface TetrisGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ onBack }) => {
    const [grid, setGrid] = useState<(boolean | null)[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    const [activePiece, setActivePiece] = useState<{ pos: { x: number, y: number }, tetromino: Tetromino } | null>(null);
    const [nextPiece, setNextPiece] = useState<Tetromino>(RANDOM_PIECE());
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [totalLinesCleared, setTotalLinesCleared] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userTokens, setUserTokens] = useState(0);
    const [sfxEnabled, setSfxEnabled] = useState(true);

    const gameLoopRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);
    const dropCounterRef = useRef<number>(0);
    const gameStartTimeRef = useRef<number>(0);
    const audioCtxRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        const p = getProgress();
        setUserTokens(p.tokens);
    }, []);

    const playSound = (type: 'MOVE' | 'ROTATE' | 'CLEAR' | 'GAMEOVER') => {
        if (!sfxEnabled) return;
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            if (type === 'MOVE') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(); osc.stop(now + 0.05);
            } else if (type === 'ROTATE') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(); osc.stop(now + 0.1);
            } else if (type === 'CLEAR') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(); osc.stop(now + 0.2);
            } else if (type === 'GAMEOVER') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(); osc.stop(now + 0.5);
            }
            osc.connect(gain).connect(ctx.destination);
        } catch (e) {}
    };

    const collides = (piece: any, grid: any, offset = { x: 0, y: 0 }) => {
        for (let y = 0; y < piece.tetromino.shape.length; y++) {
            for (let x = 0; x < piece.tetromino.shape[y].length; x++) {
                if (piece.tetromino.shape[y][x] !== 0) {
                    const newX = piece.pos.x + x + offset.x;
                    const newY = piece.pos.y + y + offset.y;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const merge = (piece: any, currentGrid: any) => {
        const newGrid = currentGrid.map((row: any) => [...row]);
        piece.tetromino.shape.forEach((row: any, y: any) => {
            row.forEach((value: any, x: any) => {
                if (value !== 0) {
                    const gridY = piece.pos.y + y;
                    const gridX = piece.pos.x + x;
                    if (gridY >= 0) newGrid[gridY][gridX] = true;
                }
            });
        });
        return newGrid;
    };

    const rotate = (matrix: number[][]) => {
        const m = matrix.length;
        const result = Array.from({ length: m }, () => Array(m).fill(0));
        for (let y = 0; y < m; y++) {
            for (let x = 0; x < m; x++) {
                result[x][m - 1 - y] = matrix[y][x];
            }
        }
        return result;
    };

    const resetPiece = () => {
        const piece = nextPiece;
        setNextPiece(RANDOM_PIECE());
        const pos = { x: Math.floor(COLS / 2) - 1, y: 0 };
        const newPiece = { pos, tetromino: piece };
        
        if (collides(newPiece, grid)) {
            setGameOver(true);
            setIsPlaying(false);
            playSound('GAMEOVER');
        } else {
            setActivePiece(newPiece);
        }
    };

    const clearLines = (currentGrid: (boolean | null)[][]) => {
        let linesInThisTurn = 0;
        const newGrid = currentGrid.reduce((acc, row) => {
            if (row.every(cell => cell !== null)) {
                linesInThisTurn++;
                acc.unshift(Array(COLS).fill(null));
            } else {
                acc.push(row);
            }
            return acc;
        }, [] as (boolean | null)[][]);

        if (linesInThisTurn > 0) {
            playSound('CLEAR');
            setScore(s => s + (linesInThisTurn * 10 * level));
            
            // Logica Gettoni: 2 ogni 10 righe
            setTotalLinesCleared(prevTotal => {
                const newTotal = prevTotal + linesInThisTurn;
                const oldBatches = Math.floor(prevTotal / 10);
                const newBatches = Math.floor(newTotal / 10);
                
                if (newBatches > oldBatches) {
                    const amount = (newBatches - oldBatches) * 2;
                    addTokens(amount);
                    setUserTokens(getProgress().tokens);
                }
                return newTotal;
            });
        }
        return newGrid;
    };

    const movePiece = (dx: number, dy: number) => {
        if (!activePiece || gameOver) return;
        const newPiece = { ...activePiece, pos: { x: activePiece.pos.x + dx, y: activePiece.pos.y + dy } };
        if (!collides(newPiece, grid)) {
            setActivePiece(newPiece);
            if (dx !== 0) playSound('MOVE');
        } else if (dy > 0) {
            const mergedGrid = merge(activePiece, grid);
            const clearedGrid = clearLines(mergedGrid);
            setGrid(clearedGrid);
            resetPiece();
        }
    };

    const rotatePiece = () => {
        if (!activePiece || gameOver) return;
        if (activePiece.tetromino.type === 'O') {
            playSound('ROTATE');
            return;
        }
        const rotatedShape = rotate(activePiece.tetromino.shape);
        const newPiece = { ...activePiece, tetromino: { ...activePiece.tetromino, shape: rotatedShape } };
        
        let offset = 1;
        const origX = newPiece.pos.x;
        while (collides(newPiece, grid)) {
            newPiece.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (Math.abs(offset) > newPiece.tetromino.shape[0].length) {
                newPiece.pos.x = origX;
                return;
            }
        }
        setActivePiece(newPiece);
        playSound('ROTATE');
    };

    const startGame = () => {
        setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
        setScore(0);
        setLevel(1);
        setTotalLinesCleared(0);
        setGameOver(false);
        setIsPlaying(true);
        setNextPiece(RANDOM_PIECE());
        const first = RANDOM_PIECE();
        setActivePiece({ pos: { x: Math.floor(COLS / 2) - 1, y: 0 }, tetromino: first });
        lastTimeRef.current = performance.now();
        gameStartTimeRef.current = performance.now();
        dropCounterRef.current = 0;
    };

    const gameUpdate = (time = 0) => {
        if (!isPlaying || gameOver) return;
        
        const deltaTime = time - lastTimeRef.current;
        lastTimeRef.current = time;
        
        // Aggiornamento Livello ogni 2 minuti
        const totalElapsed = (time - gameStartTimeRef.current) / 1000;
        const calculatedLevel = Math.floor(totalElapsed / 120) + 1;
        if (calculatedLevel !== level) {
            setLevel(calculatedLevel);
        }

        dropCounterRef.current += deltaTime;

        // Calcolo velocità bilanciato: parte da 1000ms e scende di 80ms per livello. Minimo 150ms.
        const dropInterval = Math.max(150, 1000 - (level - 1) * 80);
        
        if (dropCounterRef.current > dropInterval) {
            movePiece(0, 1);
            dropCounterRef.current = 0;
        }
        gameLoopRef.current = requestAnimationFrame(gameUpdate);
    };

    useEffect(() => {
        if (isPlaying && !gameOver) {
            gameLoopRef.current = requestAnimationFrame(gameUpdate);
        }
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [isPlaying, gameOver, activePiece, grid, level]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying || gameOver) return;
            if (e.key === 'ArrowLeft') movePiece(-1, 0);
            if (e.key === 'ArrowRight') movePiece(1, 0);
            if (e.key === 'ArrowDown') movePiece(0, 1);
            if (e.key === 'ArrowUp') rotatePiece();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, gameOver, activePiece, grid]);

    return (
        <div className="fixed inset-0 z-50 bg-sky-200 flex flex-col animate-in fade-in overflow-hidden pt-[64px] md:pt-[96px] h-[100dvh] w-full">
            <img src={TETRIS_BG} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

            {/* HEADER GIOCO */}
            <div className="relative z-20 w-full flex justify-between items-center p-2 md:p-4 pointer-events-none shrink-0">
                <div className="pointer-events-auto">
                    <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-transform">
                        <img src={EXIT_BTN_IMG} className="h-16 md:h-28 w-auto drop-shadow-md" alt="Torna in Cucina" />
                    </button>
                </div>

                <div className="flex items-center gap-1.5 md:gap-3 pointer-events-auto">
                    <div className="bg-white/90 h-10 md:h-14 w-10 md:w-14 rounded-xl border-2 md:border-4 border-blue-500 shadow-lg flex items-center justify-center overflow-hidden">
                        <div className="scale-75 md:scale-90">
                            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)` }}>
                                {nextPiece.shape.map((row, y) => (
                                    row.map((val, x) => (
                                        <div key={`${x}-${y}`} className={`w-2 h-2 md:w-3 md:h-3 rounded-[1px] relative overflow-hidden`}>
                                            {val !== 0 && <img src={ICE_CUBE_IMG} className="absolute inset-0 w-full h-full object-cover" alt="" />}
                                        </div>
                                    ))
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 h-10 md:h-14 px-2 md:px-4 rounded-xl border-2 md:border-4 border-purple-500 shadow-lg flex flex-col items-center justify-center min-w-[60px] md:min-w-[90px]">
                        <span className="block text-[7px] md:text-[9px] font-black text-purple-400 uppercase leading-none mb-0.5">LINEE</span>
                        <span className="text-sm md:text-xl font-black text-purple-700 leading-none">{totalLinesCleared}</span>
                    </div>

                    <div className="bg-white/90 h-10 md:h-14 px-2 md:px-4 rounded-xl border-2 md:border-4 border-green-500 shadow-lg flex flex-col items-center justify-center min-w-[50px] md:min-w-[80px]">
                        <span className="block text-[7px] md:text-[9px] font-black text-green-400 uppercase leading-none mb-0.5">LIV</span>
                        <span className="text-sm md:text-xl font-black text-green-700 leading-none">{level}</span>
                    </div>

                    {/* BOX AUDIO SQUARE */}
                    <button 
                        onClick={() => setSfxEnabled(!sfxEnabled)}
                        className="bg-white/90 h-10 md:h-14 w-10 md:w-14 rounded-xl border-2 md:border-4 border-blue-400 shadow-lg flex items-center justify-center active:scale-95 transition-all"
                    >
                        {sfxEnabled ? <Volume2 size={24} className="text-blue-500" /> : <VolumeX size={24} className="text-red-500" />}
                    </button>
                </div>

                <div className="pointer-events-auto">
                    <div className="bg-white/90 backdrop-blur-md px-3 md:px-4 h-10 md:h-14 rounded-xl border-2 md:border-4 border-blue-600 font-black flex items-center gap-2 text-black shadow-xl">
                        <span className="text-sm md:text-lg">{userTokens}</span> <span className="text-lg md:text-xl">🪙</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 min-h-0 overflow-hidden px-4 pb-4">
                {/* GRID TETRIS */}
                <div 
                    className="relative bg-slate-900/80 backdrop-blur-sm p-1.5 md:p-2.5 rounded-[1.5rem] md:rounded-[2rem] border-6 md:border-8 border-slate-700 shadow-2xl overflow-hidden h-[55vh] md:h-[65vh] aspect-[14/20]"
                >
                    <div 
                        className="grid w-full h-full gap-[1px] bg-slate-800 rounded-lg md:rounded-xl overflow-hidden shadow-inner"
                        style={{ 
                            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                            gridTemplateRows: `repeat(${ROWS}, 1fr)` 
                        }}
                    >
                        {grid.map((row, y) => (
                            row.map((occupied, x) => {
                                let isOccupiedByActive = false;
                                if (activePiece) {
                                    const { pos, tetromino } = activePiece;
                                    const py = y - pos.y;
                                    const px = x - pos.x;
                                    if (py >= 0 && py < tetromino.shape.length && px >= 0 && px < tetromino.shape[py].length) {
                                        if (tetromino.shape[py][px] !== 0) isOccupiedByActive = true;
                                    }
                                }

                                const finalOccupied = occupied || isOccupiedByActive;

                                return (
                                    <div 
                                        key={`${x}-${y}`} 
                                        className={`w-full h-full rounded-[1px] transition-colors duration-75 relative overflow-hidden ${finalOccupied ? '' : 'bg-slate-700/30'}`}
                                    >
                                        {finalOccupied && (
                                            <img 
                                                src={ICE_CUBE_IMG} 
                                                className="absolute inset-0 w-full h-full object-cover" 
                                                alt="" 
                                                style={{ opacity: isOccupiedByActive ? 0.85 : 1 }}
                                            />
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>

                {/* CONTROLLI MOBILE */}
                <div className="w-full max-w-[320px] md:max-w-[400px] flex justify-center gap-4 mt-6 mb-2 shrink-0 px-2">
                    <button 
                        onPointerDown={(e) => { e.preventDefault(); movePiece(-1, 0); }} 
                        className="w-16 h-16 md:w-20 md:h-20 hover:scale-110 active:scale-90 transition-transform outline-none"
                    >
                        <img src={BTN_LEFT_IMG} alt="Sinistra" className="w-full h-full object-contain drop-shadow-md" />
                    </button>
                    <button 
                        onPointerDown={(e) => { e.preventDefault(); movePiece(0, 1); }} 
                        className="w-16 h-16 md:w-20 md:h-20 hover:scale-110 active:scale-90 transition-transform outline-none"
                    >
                        <img src={BTN_DOWN_IMG} alt="Giù" className="w-full h-full object-contain drop-shadow-md" />
                    </button>
                    <button 
                        onPointerDown={(e) => { e.preventDefault(); movePiece(1, 0); }} 
                        className="w-16 h-16 md:w-20 md:h-20 hover:scale-110 active:scale-90 transition-transform outline-none"
                    >
                        <img src={BTN_RIGHT_IMG} alt="Destra" className="w-full h-full object-contain drop-shadow-md" />
                    </button>
                    <button 
                        onPointerDown={(e) => { e.preventDefault(); rotatePiece(); }} 
                        className="w-16 h-16 md:w-20 md:h-20 hover:scale-110 active:scale-90 transition-transform outline-none"
                    >
                        <img src={BTN_ROTATE_IMG} alt="Ruota" className="w-full h-full object-contain drop-shadow-md" />
                    </button>
                </div>
            </div>

            {/* MODALI STATO */}
            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-6 text-center">
                    <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] border-6 md:border-8 border-blue-600 shadow-2xl max-w-xs md:max-w-sm animate-in zoom-in flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-black text-blue-600 mb-2 uppercase leading-tight">Frigo-Tetris! 🧊</h2>
                        <p className="text-gray-600 font-bold mb-6 text-sm md:text-lg leading-snug">Incastra i blocchi di ghiaccio nel frigorifero. Guadagna 2 gettoni ogni 10 righe!</p>
                        <button onClick={startGame} className="hover:scale-105 active:scale-95 transition-all outline-none">
                            <img src={BTN_GIOCA_IMG} alt="Gioca" className="w-48 md:w-64 h-auto drop-shadow-xl" />
                        </button>
                    </div>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4 text-center">
                    <div className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] border-6 md:border-8 border-red-600 shadow-2xl max-w-sm md:max-w-md animate-in zoom-in flex flex-col items-center">
                        <img src={GAMEOVER_HEADER_IMG} className="w-48 md:w-64 h-auto mb-3 drop-shadow-md" alt="Gelo Totale" />
                        <p className="text-gray-600 font-bold mb-6 text-sm md:text-base">Il frigo è pieno! Punteggio: <span className="text-blue-600">{score}</span></p>
                        <div className="flex flex-row gap-4 w-full justify-center">
                            <button onClick={startGame} className="hover:scale-110 active:scale-95 transition-all outline-none">
                                <img src={BTN_RETRY_IMG} alt="Riprova" className="h-24 md:h-36 w-auto drop-shadow-md" />
                            </button>
                            <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none">
                                <img src={BTN_EXIT_IMG} alt="Esci" className="h-24 md:h-36 w-auto drop-shadow-md" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TetrisGame;
