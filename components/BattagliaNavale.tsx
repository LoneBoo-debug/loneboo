import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';
import { X, RotateCw, Play, Users, Cpu, LogOut, Trophy, Anchor } from 'lucide-react';
import { addTokens } from '../services/tokens';
import { io, Socket } from 'socket.io-client';

const GRID_SIZE = 10;
const WIN_TOKENS = 50;

const IMG_HIT_MINE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/copitavanave.webp';
const IMG_HIT_OPPONENT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/colpitoavversario.webp';
const IMG_MISS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bucoacquaswa.webp';

const AUDIO_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ebunny-pirates-action-loop-368853.mp3';
const AUDIO_EXPLOSION = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dragon-studio-loud-explosion-425457.mp3';
const IMG_AUDIO_TOGGLE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

interface ShipType {
    id: string;
    name: string;
    size: number;
    preview: string;
    image: string;
}

const SHIPS: ShipType[] = [
    { id: 'ricognitore', name: 'Ricognitore', size: 1, preview: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ricognitore.webp', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/minisommerf.webp' },
    { id: 'battagliera', name: 'Battagliera', size: 2, preview: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/battagliera.webp', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/battaglieralato%C3%B9.webp' },
    { id: 'mini-incrociatore', name: 'Mini-Incrociatore', size: 3, preview: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/miniincrociatore.webp', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/miniincorialtro.webp' },
    { id: 'portaerei', name: 'Portaerei', size: 4, preview: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/portaerei+(1).webp', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/portEDdalto.webp' },
    { id: 'super-incrociatore', name: 'Super-Incrociatore', size: 5, preview: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/superincrociatore+(1).webp', image: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/superincoroxalto.webp' },
];

interface PlacedShip {
    shipId: string;
    x: number;
    y: number;
    horizontal: boolean;
    size: number;
    image: string;
}

interface Shot {
    x: number;
    y: number;
    hit: boolean;
}

type GameMode = 'NONE' | 'COMPUTER' | 'MULTIPLAYER';
type GamePhase = 'PLACEMENT' | 'BATTLE' | 'GAMEOVER';

const BattagliaNavale: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [mode, setMode] = useState<GameMode>('NONE');
    const [phase, setPhase] = useState<GamePhase>('PLACEMENT');
    const [myShips, setMyShips] = useState<PlacedShip[]>([]);
    const [selectedShipIndex, setSelectedShipIndex] = useState<number | null>(null);
    const [isHorizontal, setIsHorizontal] = useState(true);
    const [myShots, setMyShots] = useState<Shot[]>([]);
    const [opponentShots, setOpponentShots] = useState<Shot[]>([]);
    const [isMyTurn, setIsMyTurn] = useState(true);
    const [winner, setWinner] = useState<'ME' | 'OPPONENT' | null>(null);
    const [roomCode, setRoomCode] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [opponentReady, setOpponentReady] = useState(false);
    const [iAmReady, setIAmReady] = useState(false);
    const [opponentShips, setOpponentShips] = useState<PlacedShip[]>([]); // Only for computer or end game

    const [activeBoard, setActiveBoard] = useState<'MINE' | 'OPPONENT'>('MINE');
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isFlashing, setIsFlashing] = useState(false);
    const [hitMessage, setHitMessage] = useState<{ text: string, type: 'MINE' | 'OPPONENT' } | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const bgMusic = useRef<HTMLAudioElement | null>(null);
    const explosionSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        if (typeof window !== 'undefined') {
            bgMusic.current = new Audio(AUDIO_BG);
            bgMusic.current.loop = true;
            bgMusic.current.volume = 0.4;
            
            explosionSound.current = new Audio(AUDIO_EXPLOSION);
            explosionSound.current.volume = 0.6;
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            if (bgMusic.current) {
                bgMusic.current.pause();
                bgMusic.current = null;
            }
            if (explosionSound.current) {
                explosionSound.current.pause();
                explosionSound.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!bgMusic.current) return;
        if (isAudioEnabled && mode !== 'NONE') {
            bgMusic.current.play().catch((e: any) => console.log("Audio play blocked", e));
        } else {
            bgMusic.current.pause();
        }
    }, [isAudioEnabled, mode]);

    useEffect(() => {
        const handleInteraction = () => {
            if (isAudioEnabled && mode !== 'NONE' && bgMusic.current && bgMusic.current.paused) {
                bgMusic.current.play().catch(() => {});
            }
        };
        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, [isAudioEnabled, mode]);

    const triggerHitEffect = useCallback((isMine: boolean) => {
        if (explosionSound.current) {
            explosionSound.current.currentTime = 0;
            explosionSound.current.play().catch((e: any) => console.log("Sound play blocked", e));
        }
        setIsFlashing(true);
        setHitMessage({ 
            text: isMine ? "SEI STATO COLPITO!" : "HAI COLPITO IL NEMICO!", 
            type: isMine ? 'MINE' : 'OPPONENT' 
        });
        
        // Switch board to show the hit
        if (isMine) {
            setActiveBoard('MINE');
        } else {
            setActiveBoard('OPPONENT');
        }

        // Keep the message and flash for 4 seconds as requested
        setTimeout(() => {
            setIsFlashing(false);
            setHitMessage(null);
        }, 4000);
    }, []);

    // Letters for columns
    const letters = useMemo(() => Array.from({ length: GRID_SIZE }, (_, i) => String.fromCharCode(65 + i)), []);
    // Numbers for rows
    const numbers = useMemo(() => Array.from({ length: GRID_SIZE }, (_, i) => i + 1), []);

    useEffect(() => {
        const s = io();
        setSocket(s);
        return () => { s.disconnect(); };
    }, []);

    const checkWin = useCallback((ships: PlacedShip[], shots: Shot[]) => {
        if (ships.length === 0) return false;
        const totalShipCells = ships.reduce((acc, s) => acc + s.size, 0);
        const hits = shots.filter(s => s.hit).length;
        return hits === totalShipCells && totalShipCells > 0;
    }, []);

    const getSunkShipsCount = useCallback((ships: PlacedShip[], shots: Shot[]) => {
        if (ships.length === 0) return 0;
        return ships.filter(ship => {
            const shipCells = [];
            for (let i = 0; i < ship.size; i++) {
                shipCells.push({
                    x: ship.horizontal ? ship.x + i : ship.x,
                    y: ship.horizontal ? ship.y : ship.y + i
                });
            }
            return shipCells.every(cell => shots.some(s => s.x === cell.x && s.y === cell.y && s.hit));
        }).length;
    }, []);

    const handleShot = (x: number, y: number) => {
        if (phase !== 'BATTLE' || !isMyTurn || winner) return;
        if (myShots.some(s => s.x === x && s.y === y)) return;

        let hit = false;
        if (mode === 'COMPUTER') {
            hit = opponentShips.some(s => {
                for (let i = 0; i < s.size; i++) {
                    const sx = s.horizontal ? s.x + i : s.x;
                    const sy = s.horizontal ? s.y : s.y + i;
                    if (sx === x && sy === y) return true;
                }
                return false;
            });

            const newShots = [...myShots, { x, y, hit }];
            setMyShots(newShots);
            
            if (hit) {
                triggerHitEffect(false);
            }

            if (checkWin(opponentShips, newShots)) {
                setWinner('ME');
                setPhase('GAMEOVER');
                addTokens(WIN_TOKENS);
            } else {
                setIsMyTurn(false);
                // If hit, wait 4 seconds before switching to MINE
                // If miss, switch after 1 second
                setTimeout(() => {
                    setActiveBoard('MINE');
                    setTimeout(computerTurn, 500);
                }, hit ? 4000 : 1000);
            }
        } else if (mode === 'MULTIPLAYER' && socket) {
            socket.emit('game_action', {
                roomCode,
                action: 'SHOT',
                payload: { x, y }
            });
        }
    };

    const computerTurn = () => {
        let x: number, y: number;
        do {
            x = Math.floor(Math.random() * GRID_SIZE);
            y = Math.floor(Math.random() * GRID_SIZE);
        } while (opponentShots.some(s => s.x === x && s.y === y));

        const hit = myShips.some(s => {
            for (let i = 0; i < s.size; i++) {
                const sx = s.horizontal ? s.x + i : s.x;
                const sy = s.horizontal ? s.y : s.y + i;
                if (sx === x && sy === y) return true;
            }
            return false;
        });

        const newShots = [...opponentShots, { x, y, hit }];
        setOpponentShots(newShots);

        if (hit) {
            triggerHitEffect(true);
        }

        if (checkWin(myShips, newShots)) {
            setWinner('OPPONENT');
            setPhase('GAMEOVER');
        } else {
            setIsMyTurn(true);
            // If hit, wait 4 seconds before switching back to attack
            // If miss, switch after 1 second
            setTimeout(() => {
                setActiveBoard('OPPONENT');
            }, hit ? 4000 : 1000);
        }
    };

    const placeShip = (x: number, y: number) => {
        if (selectedShipIndex === null || phase !== 'PLACEMENT') return;
        const ship = SHIPS[selectedShipIndex];
        
        // Check bounds
        if (isHorizontal && x + ship.size > GRID_SIZE) return;
        if (!isHorizontal && y + ship.size > GRID_SIZE) return;

        // Check collisions
        const newShipCells: {x: number, y: number}[] = [];
        for (let i = 0; i < ship.size; i++) {
            newShipCells.push({
                x: isHorizontal ? x + i : x,
                y: isHorizontal ? y : y + i
            });
        }

        const collision = myShips.some(s => {
            for (let i = 0; i < s.size; i++) {
                const sx = s.horizontal ? s.x + i : s.x;
                const sy = s.horizontal ? s.y : s.y + i;
                if (newShipCells.some(c => c.x === sx && c.y === sy)) return true;
            }
            return false;
        });

        if (collision) return;

        setMyShips([...myShips, {
            shipId: ship.id,
            x,
            y,
            horizontal: isHorizontal,
            size: ship.size,
            image: ship.image
        }]);
        setSelectedShipIndex(null);
    };

    const startComputerGame = () => {
        setMode('COMPUTER');
        setPhase('PLACEMENT');
        // Randomly place computer ships
        const compShips: PlacedShip[] = [];
        SHIPS.forEach(ship => {
            let placed = false;
            while (!placed) {
                const horizontal = Math.random() > 0.5;
                const x = Math.floor(Math.random() * (horizontal ? GRID_SIZE - ship.size + 1 : GRID_SIZE));
                const y = Math.floor(Math.random() * (horizontal ? GRID_SIZE : GRID_SIZE - ship.size + 1));
                
                const cells: {x: number, y: number}[] = [];
                for (let i = 0; i < ship.size; i++) {
                    cells.push({ x: horizontal ? x + i : x, y: horizontal ? y : y + i });
                }

                const collision = compShips.some(s => {
                    for (let i = 0; i < s.size; i++) {
                        const sx = s.horizontal ? s.x + i : s.x;
                        const sy = s.horizontal ? s.y : s.y + i;
                        if (cells.some(c => c.x === sx && c.y === sy)) return true;
                    }
                    return false;
                });

                if (!collision) {
                    compShips.push({ shipId: ship.id, x, y, horizontal, size: ship.size, image: ship.image });
                    placed = true;
                }
            }
        });
        setOpponentShips(compShips);
    };

    const startMultiplayerGame = () => {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setRoomCode(code);
        setMode('MULTIPLAYER');
        setPhase('PLACEMENT');
        socket?.emit('join_room', code);
    };

    const joinFriend = () => {
        setShowJoinInput(true);
    };

    const confirmJoin = () => {
        if (joinCode) {
            setRoomCode(joinCode.toUpperCase());
            setMode('MULTIPLAYER');
            setPhase('PLACEMENT');
            socket?.emit('join_room', joinCode.toUpperCase());
            setShowJoinInput(false);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleAction = (data: any) => {
            const { action, payload } = data;
            switch (action) {
                case 'READY':
                    setOpponentReady(true);
                    break;
                case 'SHOT':
                    const hit = myShips.some(s => {
                        for (let i = 0; i < s.size; i++) {
                            const sx = s.horizontal ? s.x + i : s.x;
                            const sy = s.horizontal ? s.y : s.y + i;
                            if (sx === payload.x && sy === payload.y) return true;
                        }
                        return false;
                    });
                    setOpponentShots(prev => [...prev, { x: payload.x, y: payload.y, hit }]);
                    if (hit) {
                        triggerHitEffect(true);
                    }
                    socket.emit('game_action', {
                        roomCode,
                        action: 'SHOT_RESULT',
                        payload: { x: payload.x, y: payload.y, hit }
                    });
                    
                    setTimeout(() => {
                        setIsMyTurn(true);
                        setActiveBoard('OPPONENT');
                    }, hit ? 4000 : 1000);
                    break;
                case 'SHOT_RESULT':
                    setMyShots(prev => [...prev, payload]);
                    if (payload.hit) {
                        triggerHitEffect(false);
                    }
                    setTimeout(() => {
                        setIsMyTurn(false);
                        setActiveBoard('MINE');
                    }, payload.hit ? 4000 : 1000);
                    break;
            }
        };

        socket.on('game_action', handleAction);
        return () => { socket.off('game_action', handleAction); };
    }, [socket, roomCode, myShips]);

    useEffect(() => {
        if (phase === 'BATTLE') {
            if (checkWin(myShips, opponentShots)) {
                setWinner('OPPONENT');
                setPhase('GAMEOVER');
            }
            // In multiplayer, we wait for SHOT_RESULT to check win for ME
            if (mode === 'COMPUTER' && checkWin(opponentShips, myShots)) {
                setWinner('ME');
                setPhase('GAMEOVER');
                addTokens(WIN_TOKENS);
            }
        }
    }, [myShots, opponentShots, myShips, opponentShips, phase, mode, checkWin]);

    useEffect(() => {
        if (mode === 'MULTIPLAYER' && iAmReady && opponentReady) {
            setPhase('BATTLE');
            // Randomize first turn
            setIsMyTurn(roomCode.charCodeAt(0) % 2 === 0);
        }
    }, [iAmReady, opponentReady, mode, roomCode]);

    const handleReady = () => {
        if (myShips.length < SHIPS.length) {
            alert("Posiziona tutte le navi prima di iniziare!");
            return;
        }
        setIAmReady(true);
        if (mode === 'COMPUTER') {
            setPhase('BATTLE');
            setIsMyTurn(true);
            setActiveBoard('OPPONENT');
        } else {
            socket?.emit('game_action', { roomCode, action: 'READY' });
        }
    };

    const renderMyBoard = () => (
        <div className={`flex flex-col items-center gap-2 md:gap-4 w-full max-w-[450px] ${phase === 'PLACEMENT' ? 'lg:max-w-[1000px] lg:flex-row lg:items-center lg:justify-center lg:gap-8' : ''}`}>
            <div className={`flex flex-col items-center gap-2 md:gap-4 w-full max-w-[400px] ${phase === 'PLACEMENT' ? 'lg:order-2 shrink-0' : ''}`}>
                <div className="text-center h-8 md:h-12 flex flex-col justify-center">
                    <h2 className="font-luckiest text-sky-400 text-lg md:text-2xl uppercase tracking-wider">La Tua Flotta</h2>
                    <AnimatePresence>
                        {hitMessage?.type === 'MINE' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                className="text-red-500 font-luckiest text-base md:text-xl uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                            >
                                {hitMessage.text}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="relative bg-white/5 backdrop-blur-sm p-1.5 rounded-2xl border-4 border-white/10 shadow-2xl w-full aspect-square flex flex-col">
                    <div className="flex h-6 ml-6">
                        {letters.map(l => (
                            <div key={l} className="flex-1 flex items-center justify-center text-slate-500 font-mono font-bold text-[10px]">
                                {l}
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex flex-1">
                        <div className="flex flex-col w-6">
                            {numbers.map(n => (
                                <div key={n} className="flex-1 flex items-center justify-center text-slate-500 font-mono font-bold text-[10px]">
                                    {n}
                                </div>
                            ))}
                        </div>

                        <div className="flex-1 relative bg-transparent border-2 border-white/10 overflow-hidden">
                            <div 
                                className="grid h-full w-full"
                                style={{ 
                                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, 
                                    gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                                }}
                            >
                                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                                    const x = i % GRID_SIZE;
                                    const y = Math.floor(i / GRID_SIZE);
                                    
                                    return (
                                        <div 
                                            key={i}
                                            onClick={() => placeShip(x, y)}
                                            className={`border-[0.5px] border-slate-700/50 aspect-square flex items-center justify-center relative transition-colors ${phase === 'PLACEMENT' && selectedShipIndex !== null ? 'hover:bg-sky-500/20 cursor-crosshair' : ''}`}
                                        />
                                    );
                                })}
                            </div>

                            {myShips.map((s, i) => {
                                const footprintWidth = s.horizontal ? (s.size / GRID_SIZE) * 100 : (1 / GRID_SIZE) * 100;
                                const footprintHeight = s.horizontal ? (1 / GRID_SIZE) * 100 : (s.size / GRID_SIZE) * 100;
                                
                                return (
                                    <div 
                                        key={i}
                                        className="absolute pointer-events-none flex items-center justify-center overflow-hidden"
                                        style={{ 
                                            left: `${(s.x / GRID_SIZE) * 100}%`, 
                                            top: `${(s.y / GRID_SIZE) * 100}%`,
                                            width: `${footprintWidth}%`,
                                            height: `${footprintHeight}%`,
                                            zIndex: 10
                                        }}
                                    >
                                        <div className="w-full h-full p-[0.5px] flex items-center justify-center">
                                            <img 
                                                src={s.image} 
                                                alt="Ship" 
                                                className="object-fill"
                                                style={{
                                                    width: s.horizontal ? `${(footprintHeight / footprintWidth) * 100}%` : '100%',
                                                    height: s.horizontal ? `${(footprintWidth / footprintHeight) * 100}%` : '100%',
                                                    transform: s.horizontal ? 'rotate(-90deg)' : 'none',
                                                    imageRendering: 'crisp-edges'
                                                }}
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {opponentShots.map((shot, i) => (
                                <motion.div 
                                    key={`shot-${i}`}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ 
                                        scale: shot.hit ? [1, 1.2, 1] : 1, 
                                        opacity: 1 
                                    }}
                                    transition={{ 
                                        duration: shot.hit ? 0.5 : 0.3,
                                        repeat: shot.hit && isFlashing ? Infinity : 0,
                                        repeatType: "reverse"
                                    }}
                                    className="absolute pointer-events-none flex items-center justify-center p-0.5"
                                    style={{
                                        left: `${(shot.x / GRID_SIZE) * 100}%`,
                                        top: `${(shot.y / GRID_SIZE) * 100}%`,
                                        width: `${100 / GRID_SIZE}%`,
                                        height: `${100 / GRID_SIZE}%`,
                                        zIndex: 20
                                    }}
                                >
                                    <img 
                                        src={shot.hit ? IMG_HIT_MINE : IMG_MISS} 
                                        alt={shot.hit ? "Colpito" : "Acqua"} 
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {phase === 'PLACEMENT' && myShips.length === SHIPS.length && (
                    <button
                        onClick={handleReady}
                        disabled={iAmReady}
                        className={`w-full mt-2 py-4 rounded-2xl font-luckiest uppercase tracking-wider transition-all active:scale-95 text-lg ${iAmReady ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'}`}
                    >
                        {iAmReady ? "In attesa..." : "Sono Pronto!"}
                    </button>
                )}
            </div>
            {phase === 'PLACEMENT' && (
                <div className="w-full max-w-[380px] bg-white/5 backdrop-blur-md p-2 md:p-4 rounded-2xl border border-white/10 shadow-2xl overflow-hidden lg:order-1 lg:mt-0 self-center shrink-0">
                    <h3 className="text-white/50 text-[9px] uppercase font-bold mb-1.5 text-center tracking-widest">Posiziona la tua flotta</h3>
                    <div 
                        className="flex overflow-x-auto pb-1.5 gap-2 snap-x scroll-smooth"
                        style={{ 
                            scrollbarWidth: 'thin', 
                            scrollbarColor: 'rgba(14, 165, 233, 0.5) rgba(15, 23, 42, 0.2)',
                        }}
                    >
                        {SHIPS.map((ship, idx) => {
                            const isPlaced = myShips.some(s => s.shipId === ship.id);
                            return (
                                <button
                                    key={ship.id}
                                    disabled={isPlaced}
                                    onClick={() => {
                                        setSelectedShipIndex(idx);
                                        setIsHorizontal(true);
                                    }}
                                    className={`flex-shrink-0 snap-center p-1 transition-all flex flex-col items-center justify-center gap-1 min-w-[100px] relative ${isPlaced ? 'opacity-20 grayscale' : selectedShipIndex === idx ? 'scale-105' : 'hover:scale-105'}`}
                                >
                                    <div className="h-10 w-full flex items-center justify-center">
                                        <img src={ship.preview} alt={ship.name} className="max-h-full max-w-full object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="text-[9px] text-white font-luckiest uppercase truncate w-full text-center leading-tight tracking-wider drop-shadow-md">{ship.name}</div>
                                    </div>
                                    {isPlaced && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Anchor size={20} className="text-white/40" />
                                        </div>
                                    )}
                                    {selectedShipIndex === idx && !isPlaced && (
                                        <div className="absolute -bottom-0.5 w-5 h-1 bg-sky-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {selectedShipIndex !== null && (
                        <div className="mt-2 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between bg-sky-500/20 p-1.5 rounded-xl border border-sky-500/30">
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-sky-400 font-bold uppercase tracking-wider">Orientamento</span>
                                    <span className="text-[10px] text-white font-bold uppercase">{isHorizontal ? "Orizzontale" : "Verticale"}</span>
                                </div>
                                <button 
                                    onClick={() => setIsHorizontal(!isHorizontal)}
                                    className="px-3 py-1.5 bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-500/30 active:scale-95 transition-all flex items-center gap-1.5 font-luckiest uppercase text-[10px] tracking-widest"
                                >
                                    <RotateCw size={14} />
                                    <span>Ruota</span>
                                </button>
                            </div>
                            <div className="text-center">
                                <p className="text-sky-400 text-[8px] font-bold uppercase animate-pulse tracking-widest">
                                    Tocca una casella sul tabellone
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    const renderOpponentBoard = () => (
        <div className="flex flex-col items-center gap-4 w-full max-w-[450px]">
            <div className="text-center h-8 md:h-12 flex flex-col justify-center">
                <h2 className="font-luckiest text-red-400 text-xl md:text-2xl uppercase tracking-wider">Flotta Nemica</h2>
                <AnimatePresence>
                    {hitMessage?.type === 'OPPONENT' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            className="text-emerald-400 font-luckiest text-base md:text-xl uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                        >
                            {hitMessage.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="relative bg-white/5 backdrop-blur-sm p-2 rounded-2xl border-4 border-white/10 shadow-2xl w-full aspect-square flex flex-col">
                <div className="flex h-6 ml-6">
                    {letters.map(l => (
                        <div key={l} className="flex-1 flex items-center justify-center text-slate-500 font-mono font-bold text-[10px]">
                            {l}
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-1">
                    <div className="flex flex-col w-6">
                        {numbers.map(n => (
                            <div key={n} className="flex-1 flex items-center justify-center text-slate-500 font-mono font-bold text-[10px]">
                                {n}
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 relative bg-transparent border-2 border-white/10 overflow-hidden">
                        <div 
                            className="grid h-full w-full"
                            style={{ 
                                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, 
                                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                            }}
                        >
                            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                                const x = i % GRID_SIZE;
                                const y = Math.floor(i / GRID_SIZE);
                                const shot = myShots.find(s => s.x === x && s.y === y);
                                return (
                                    <div 
                                        key={i}
                                        onClick={() => handleShot(x, y)}
                                        className={`border-[0.5px] border-slate-700/50 aspect-square flex items-center justify-center relative transition-colors ${phase === 'BATTLE' && isMyTurn ? 'hover:bg-red-500/20 cursor-crosshair' : 'cursor-not-allowed'}`}
                                    >
                                        {shot && (
                                            <div className="w-full h-full flex items-center justify-center p-0.5">
                                                <img 
                                                    src={shot.hit ? IMG_HIT_OPPONENT : IMG_MISS} 
                                                    alt={shot.hit ? "Colpito" : "Acqua"} 
                                                    className="w-full h-full object-contain"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-900" style={{ 
            backgroundImage: 'url("https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_rendi+questa+immagine+pi%C3%B9+scur_490332073499013120.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            {/* Header */}
            <header className="min-h-[5rem] py-2 bg-transparent border-b border-white/10 flex items-center px-4 md:px-6 shrink-0 gap-4 z-10">
                <button 
                    onClick={() => setView(AppView.LAKE_CITY)}
                    className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-xl border border-red-500/30 transition-all active:scale-95 text-sm md:text-base shrink-0"
                >
                    <LogOut size={18} />
                    <span className="font-luckiest uppercase tracking-wider">Esci</span>
                </button>

                <div className="flex flex-1 items-center gap-2 overflow-x-auto">
                    {mode === 'NONE' && !showJoinInput && (
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={startComputerGame}
                                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-3 md:px-4 py-2 rounded-xl font-luckiest uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-sky-500/20 text-[10px] md:text-xs whitespace-nowrap"
                            >
                                <Cpu size={14} className="hidden sm:block" />
                                VS Computer
                            </button>
                            <button 
                                onClick={startMultiplayerGame}
                                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 md:px-4 py-2 rounded-xl font-luckiest uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] md:text-xs whitespace-nowrap"
                            >
                                <Users size={14} className="hidden sm:block" />
                                VS Amico
                            </button>
                            <button 
                                onClick={joinFriend}
                                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3 md:px-4 py-2 rounded-xl font-luckiest uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-500/20 text-[10px] md:text-xs whitespace-nowrap"
                            >
                                <Users size={14} className="hidden sm:block" />
                                Unisciti
                            </button>
                        </div>
                    )}

                    {showJoinInput && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                            <input 
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="CODICE"
                                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-sky-500 w-24 md:w-32"
                                maxLength={6}
                            />
                            <button 
                                onClick={confirmJoin}
                                className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-xl font-luckiest uppercase text-xs tracking-wider transition-all active:scale-95"
                            >
                                OK
                            </button>
                            <button 
                                onClick={() => setShowJoinInput(false)}
                                className="text-white/50 hover:text-white px-2"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    {mode !== 'NONE' && (
                        <div className="flex items-center gap-2 md:gap-4">
                            {roomCode && (
                                <div className="bg-white/5 px-2 md:px-4 py-1 md:py-2 rounded-xl border border-white/10 flex items-center">
                                    <span className="text-white/50 text-[10px] uppercase font-bold mr-1 md:mr-2">Cod:</span>
                                    <span className="text-sky-400 font-mono font-bold text-xs md:text-sm">{roomCode}</span>
                                </div>
                            )}
                            <div className="bg-white/5 px-2 md:px-4 py-1 md:py-2 rounded-xl border border-white/10 flex items-center">
                                <span className="text-white/50 text-[10px] uppercase font-bold mr-1 md:mr-2">Turno:</span>
                                <span className={`${isMyTurn ? "text-emerald-400" : "text-red-400"} font-bold text-xs md:text-sm`}>
                                    {isMyTurn ? "TUO" : "AVV."}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {mode !== 'NONE' && (
                    <button 
                        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                        className={`transition-all active:scale-95 shrink-0 ml-auto ${isAudioEnabled ? 'opacity-100' : 'opacity-40'}`}
                    >
                        <img src={IMG_AUDIO_TOGGLE} alt="Audio" className="w-10 h-10 md:w-12 md:h-12 object-contain" referrerPolicy="no-referrer" />
                    </button>
                )}
            </header>

            {/* Red Flash Overlay */}
            <AnimatePresence>
                {isFlashing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.6, 0, 0.6, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 4, repeat: 0 }}
                        className="fixed inset-0 z-[60] pointer-events-none border-[20px] md:border-[40px] border-red-600 shadow-[inset_0_0_150px_rgba(220,38,38,0.8)]"
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden">
                <div className="h-full flex flex-col items-center p-2 md:p-4 justify-start">
                    {mode === 'NONE' ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl animate-in fade-in zoom-in duration-700">
                            <img 
                                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_utilizzando+le+immagini+fornit_490326012180271105.webp" 
                                alt="Battaglia Navale" 
                                className="w-90 h-90 md:w-[650px] md:h-[650px] mx-auto mb-4 object-contain drop-shadow-2xl"
                                referrerPolicy="no-referrer"
                            />
                            <h1 className="text-3xl md:text-6xl font-luckiest text-white mb-2 uppercase tracking-tighter">Battaglia Navale</h1>
                            <p className="text-slate-400 text-sm md:text-lg mb-8 px-4">
                                Benvenuto al Molo di Città dei Laghi! Scegli la tua modalità di gioco e preparati a colpire la flotta nemica.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-4 md:gap-12 items-center lg:items-start justify-center w-full max-w-7xl">
                            {/* Mobile Board Toggle */}
                            {phase === 'BATTLE' && (
                                <div className="flex lg:hidden w-full bg-white/5 backdrop-blur-sm p-1 rounded-xl mb-2 border border-white/5">
                                    <button 
                                        onClick={() => setActiveBoard('MINE')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-luckiest uppercase tracking-wider transition-all ${activeBoard === 'MINE' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-400'}`}
                                    >
                                        Mia Flotta
                                    </button>
                                    <button 
                                        onClick={() => setActiveBoard('OPPONENT')}
                                        className={`flex-1 py-2 rounded-lg text-xs font-luckiest uppercase tracking-wider transition-all ${activeBoard === 'OPPONENT' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400'}`}
                                    >
                                        Nemico
                                    </button>
                                </div>
                            )}

                            {isMobile ? (
                                <div className="w-full flex justify-center relative min-h-[400px] overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {activeBoard === 'MINE' || phase === 'PLACEMENT' ? (
                                            <motion.div 
                                                key="mine-mobile"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full flex flex-col items-center"
                                            >
                                                {renderMyBoard()}
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                key="opponent-mobile"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full flex flex-col items-center"
                                            >
                                                {renderOpponentBoard()}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex flex-row gap-12 items-start justify-center w-full">
                                    {renderMyBoard()}
                                    {phase === 'BATTLE' && renderOpponentBoard()}
                                </div>
                            )}

                            {/* Controls / Info */}
                            <div className="w-full lg:w-72 flex flex-col gap-3 mt-auto lg:mt-0">
                                {phase === 'BATTLE' && (
                                    <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-xl">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex flex-col items-center flex-1">
                                                <span className="text-[8px] text-white/50 uppercase font-bold mb-1">Tua Flotta</span>
                                                <div className="bg-sky-500/20 px-3 py-1 rounded-lg border border-sky-500/30 w-full text-center">
                                                    <span className="text-sky-400 font-luckiest text-lg">
                                                        {SHIPS.length - getSunkShipsCount(myShips, opponentShots)}
                                                    </span>
                                                    <span className="text-sky-400/50 text-xs ml-1">/ {SHIPS.length}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center flex-1">
                                                <span className="text-[8px] text-white/50 uppercase font-bold mb-1">Flotta Nemica</span>
                                                <div className="bg-red-500/20 px-3 py-1 rounded-lg border border-red-500/30 w-full text-center">
                                                    <span className="text-red-400 font-luckiest text-lg">
                                                        {SHIPS.length - getSunkShipsCount(opponentShips, myShots)}
                                                    </span>
                                                    <span className="text-red-400/50 text-xs ml-1">/ {SHIPS.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-white/10">
                                            <p className="text-[10px] text-white/50 italic leading-tight text-center lg:text-left">
                                                {isMyTurn ? "È il tuo turno! Colpisci il nemico." : "L'avversario sta attaccando..."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Game Over Modal */}
            <AnimatePresence>
                {phase === 'GAMEOVER' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-xl border-4 border-white/20 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
                        >
                            {winner === 'ME' ? (
                                <>
                                    <Trophy size={80} className="text-yellow-400 mx-auto mb-6" />
                                    <h2 className="text-4xl font-luckiest text-white mb-2 uppercase tracking-tighter">Vittoria!</h2>
                                    <p className="text-slate-400 mb-6">Hai affondato l'intera flotta nemica!</p>
                                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-4 mb-8">
                                        <div className="text-emerald-400 font-luckiest text-2xl">+ {WIN_TOKENS} GETTONI</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Anchor size={80} className="text-slate-500 mx-auto mb-6" />
                                    <h2 className="text-4xl font-luckiest text-white mb-2 uppercase tracking-tighter">Sconfitta</h2>
                                    <p className="text-slate-400 mb-8">La tua flotta è stata affondata. Ritenta, sarai più fortunato!</p>
                                </>
                            )}
                            <button 
                                onClick={() => {
                                    setMode('NONE');
                                    setPhase('PLACEMENT');
                                    setMyShips([]);
                                    setMyShots([]);
                                    setOpponentShots([]);
                                    setWinner(null);
                                    setIAmReady(false);
                                    setOpponentReady(false);
                                }}
                                className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-luckiest text-xl uppercase tracking-wider transition-all active:scale-95"
                            >
                                Torna al Menu
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BattagliaNavale;
