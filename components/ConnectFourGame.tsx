
import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, LogOut, Settings, Loader2, Lock } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const ROWS = 6;
const COLS = 7;
type Player = 'RED' | 'YELLOW' | null;
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface ConnectFourProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const ConnectFourGame: React.FC<ConnectFourProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [board, setBoard] = useState<Player[][]>(
        Array.from({ length: ROWS }, () => Array(COLS).fill(null))
    );
    const [currentPlayer, setCurrentPlayer] = useState<'RED' | 'YELLOW'>('RED'); // RED = Human
    const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
    const [winningCells, setWinningCells] = useState<[number, number][]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const [rewardGiven, setRewardGiven] = useState(false);

    // Lock State
    const [isHardUnlocked, setIsHardUnlocked] = useState(false);
    const [userTokens, setUserTokens] = useState(0);
    const [showUnlockModal, setShowUnlockModal] = useState(false);

    useEffect(() => {
        const progress = getProgress();
        setUserTokens(progress.tokens);
        const albumComplete = progress.unlockedStickers.length >= 30; 
        setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
    }, []);

    // Sync tokens when modal shows up
    useEffect(() => {
        if (showUnlockModal) {
            const p = getProgress();
            setUserTokens(p.tokens);
        }
    }, [showUnlockModal]);

    const handleUnlockHard = () => {
        if (unlockHardMode()) {
            setIsHardUnlocked(true);
            const p = getProgress();
            setUserTokens(p.tokens);
            setShowUnlockModal(false);
            setDifficulty('HARD');
            resetGame();
        }
    };

    const handleOpenNewsstand = () => {
        if (onOpenNewsstand) {
            onOpenNewsstand();
            setShowUnlockModal(false);
        }
    };

    const checkWin = (boardState: Player[][], player: Player) => {
        // Horizontal
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (boardState[r][c] === player && boardState[r][c+1] === player && boardState[r][c+2] === player && boardState[r][c+3] === player) {
                    return [[r,c], [r,c+1], [r,c+2], [r,c+3]];
                }
            }
        }
        // Vertical
        for (let r = 0; r < ROWS - 3; r++) {
            for (let c = 0; c < COLS; c++) {
                if (boardState[r][c] === player && boardState[r+1][c] === player && boardState[r+2][c] === player && boardState[r+3][c] === player) {
                    return [[r,c], [r+1,c], [r+2,c], [r+3,c]];
                }
            }
        }
        // Diagonal /
        for (let r = 3; r < ROWS; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (boardState[r][c] === player && boardState[r-1][c+1] === player && boardState[r-2][c+2] === player && boardState[r-3][c+3] === player) {
                    return [[r,c], [r-1,c+1], [r-2,c+2], [r-3,c+3]];
                }
            }
        }
        // Diagonal \
        for (let r = 0; r < ROWS - 3; r++) {
            for (let c = 0; c < COLS - 3; c++) {
                if (boardState[r][c] === player && boardState[r+1][c+1] === player && boardState[r+2][c+2] === player && boardState[r+3][c+3] === player) {
                    return [[r,c], [r+1,c+1], [r+2,c+2], [r+3,c+3]];
                }
            }
        }
        return null;
    };

    const handleColumnClick = (col: number) => {
        if (winner || currentPlayer === 'YELLOW' || isThinking || !difficulty) return;

        let row = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!board[r][col]) {
                row = r;
                break;
            }
        }

        if (row === -1) return;

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = 'RED';
        setBoard(newBoard);

        const win = checkWin(newBoard, 'RED');
        if (win) {
            setWinner('RED');
            setWinningCells(win as [number, number][]);
        } else {
            if (newBoard.every(row => row.every(cell => cell !== null))) {
                setWinner('DRAW');
            } else {
                setCurrentPlayer('YELLOW');
            }
        }
    };

    const makeAiMove = () => {
        const validCols = [];
        for (let c = 0; c < COLS; c++) {
            if (!board[0][c]) validCols.push(c);
        }

        if (validCols.length === 0) return;

        let col = -1;

        // --- AI STRATEGY ---
        
        // 1. Can AI Win? (Always check this first)
        if (col === -1) {
            for (const c of validCols) {
                const tempBoard = board.map(r => [...r]);
                let r = -1; 
                for(let i=ROWS-1; i>=0; i--) if(!tempBoard[i][c]) { r=i; break; }
                tempBoard[r][c] = 'YELLOW';
                if (checkWin(tempBoard, 'YELLOW')) { col = c; break; }
            }
        }

        // 2. Must Block Player? (Only if not Easy)
        if (col === -1 && difficulty !== 'EASY') {
            for (const c of validCols) {
                const tempBoard = board.map(r => [...r]);
                let r = -1; 
                for(let i=ROWS-1; i>=0; i--) if(!tempBoard[i][c]) { r=i; break; }
                tempBoard[r][c] = 'RED';
                if (checkWin(tempBoard, 'RED')) { col = c; break; }
            }
        }

        // 3. Strategic Randomness
        if (col === -1) {
            // Hard Priority: Center Column
            if (difficulty === 'HARD' && validCols.includes(3) && Math.random() > 0.1) {
                col = 3;
            } else {
                col = validCols[Math.floor(Math.random() * validCols.length)];
            }
        }
        
        let row = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!board[r][col]) {
                row = r;
                break;
            }
        }

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = 'YELLOW';
        setBoard(newBoard);

        const win = checkWin(newBoard, 'YELLOW');
        if (win) {
            setWinner('YELLOW');
            setWinningCells(win as [number, number][]);
        } else {
            if (newBoard.every(row => row.every(cell => cell !== null))) {
                setWinner('DRAW');
            } else {
                setCurrentPlayer('RED');
            }
        }
    };

    useEffect(() => {
        if (currentPlayer === 'YELLOW' && !winner && difficulty) {
            setIsThinking(true);
            const timer = setTimeout(() => {
                makeAiMove();
                setIsThinking(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [currentPlayer, winner, difficulty]);

    // REWARD LOGIC
    useEffect(() => {
        if (winner === 'RED' && !rewardGiven && onEarnTokens) {
            let reward = 5; // Easy
            if (difficulty === 'MEDIUM') reward = 10;
            if (difficulty === 'HARD') reward = 20;
            
            onEarnTokens(reward);
            setRewardGiven(true);
        }
    }, [winner, rewardGiven, onEarnTokens, difficulty]);

    const resetGame = () => {
        setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
        setWinner(null);
        setWinningCells([]);
        setCurrentPlayer('RED');
        setRewardGiven(false);
    };

    const handleLevelSelect = (level: Difficulty) => {
        if (level === 'HARD' && !isHardUnlocked) {
            setShowUnlockModal(true);
            return;
        }
        setDifficulty(level);
        resetGame();
    };

    const backToMenu = () => {
        setDifficulty(null);
        resetGame();
    };

    // --- MENU VIEW ---
    if (!difficulty) {
        return (
            <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in text-center min-h-[500px]">
                {showUnlockModal && (
                    <UnlockModal 
                        onClose={() => setShowUnlockModal(false)}
                        onUnlock={handleUnlockHard}
                        onOpenNewsstand={handleOpenNewsstand}
                        currentTokens={userTokens}
                    />
                )}

                <h2 className="text-4xl md:text-5xl font-black text-blue-600 mb-8 relative z-10" style={{ textShadow: "3px 3px 0px white" }}>Forza 4</h2>
                <div className="bg-white p-8 rounded-[40px] border-4 border-blue-800 shadow-xl w-full">
                    <p className="text-2xl font-bold text-gray-700 mb-6">Abilità Avversario</p>
                    <div className="flex flex-col gap-4">
                        <button onClick={() => handleLevelSelect('EASY')} className="bg-green-500 text-white text-xl font-black py-4 px-6 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2">PRINCIPIANTE 😊</button>
                        <button onClick={() => handleLevelSelect('MEDIUM')} className="bg-yellow-400 text-black text-xl font-black py-4 px-6 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2">ESPERTO 😎</button>
                        <button onClick={() => handleLevelSelect('HARD')} className={`text-white text-xl font-black py-4 px-6 rounded-2xl border-4 border-black transition-transform shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2 ${isHardUnlocked ? 'bg-purple-600 hover:scale-105' : 'bg-gray-400 hover:scale-[1.02] cursor-pointer'}`}>
                            {isHardUnlocked ? 'MAESTRO 🤖' : <><Lock/> BLOCCATO</>}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const tokenReward = difficulty === 'EASY' ? 5 : difficulty === 'MEDIUM' ? 10 : 20;

    // --- GAME VIEW ---
    return (
        <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in w-full">
            <div className="w-full flex justify-between items-center mb-4 px-2">
                <button onClick={backToMenu} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/40">
                    <Settings size={24} />
                </button>
                <h2 className="text-4xl md:text-5xl font-black text-blue-600 drop-shadow-[2px_2px_0_white]" style={{ textShadow: "3px 3px 0px white" }}>
                    Forza 4
                </h2>
                <div className="w-10"></div>
            </div>

            <p className="text-white/80 font-bold mb-4 bg-blue-900/30 px-4 py-1 rounded-full backdrop-blur-sm">
                {difficulty === 'EASY' ? 'Livello Facile' : (difficulty === 'MEDIUM' ? 'Livello Medio' : 'Livello Maestro')}
            </p>

            <div className="bg-blue-600 p-3 rounded-[30px] border-4 border-blue-800 shadow-2xl relative">
                {isThinking && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full font-bold flex items-center gap-2 border-2 border-black z-10 animate-bounce">
                        <Loader2 className="animate-spin" size={16} /> Sto pensando...
                    </div>
                )}

                <div className="grid grid-cols-7 gap-2 bg-blue-500 p-2 rounded-xl">
                    {Array.from({ length: COLS }).map((_, c) => (
                        <div key={c} className="flex flex-col gap-2" onClick={() => handleColumnClick(c)}>
                            {Array.from({ length: ROWS }).map((_, r) => {
                                const cell = board[r][c];
                                const isWinning = winningCells.some(([wr, wc]) => wr === r && wc === c);
                                return (
                                    <div key={`${r}-${c}`} className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-4 ${isWinning ? 'border-white animate-pulse' : 'border-blue-700'} flex items-center justify-center bg-blue-800 shadow-inner overflow-hidden cursor-pointer`}>
                                        {cell === 'RED' && <div className="w-full h-full bg-red-500 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300"></div>}
                                        {cell === 'YELLOW' && <div className="w-full h-full bg-yellow-400 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300"></div>}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* FIXED OVERLAY TO PREVENT CLIPPING */}
            {winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                    <div className="bg-white p-8 rounded-[40px] text-center border-4 border-black max-w-sm w-full shadow-2xl relative">
                        {/* SAVE REMINDER */}
                        {winner === 'RED' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

                        <div className="text-6xl md:text-7xl mb-4 animate-bounce">
                            {winner === 'RED' ? '🏆' : (winner === 'YELLOW' ? '🤖' : '🤝')}
                        </div>
                        <h2 className="text-3xl font-black mb-4 text-purple-600 drop-shadow-sm">
                            {winner === 'RED' ? 'HAI VINTO! 🎉' : (winner === 'YELLOW' ? 'Ha vinto il computer!' : 'Pareggio!')}
                        </h2>
                        {winner === 'RED' && (
                            <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-block whitespace-nowrap">
                                +{tokenReward} GETTONI! 🪙
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <button onClick={resetGame} className="flex items-center justify-center gap-2 bg-green-500 text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 shadow-[4px_4px_0_black]">
                                <RotateCcw size={20} /> Rigioca
                            </button>
                            <button onClick={onBack} className="flex items-center justify-center gap-2 bg-red-500 text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 shadow-[4px_4px_0_black]">
                                <LogOut size={20} /> Esci
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectFourGame;
