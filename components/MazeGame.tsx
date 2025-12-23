
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Trophy } from 'lucide-react';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const BTN_EASY_IMG = 'https://i.postimg.cc/MpVqCtbx/facile.png';
const BTN_HARD_IMG = 'https://i.postimg.cc/tRsTr3f4/difficile.png';
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';

const LEVEL_EASY = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 4, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1]
];

const LEVEL_HARD = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 3, 1, 1],
    [1, 0, 4, 0, 1, 0, 0, 1],
    [1, 0, 1, 4, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 4, 0, 1],
    [1, 1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1]
];

type Difficulty = 'EASY' | 'HARD';

const MazeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [grid, setGrid] = useState<number[][]>([]);
  const [playerPos, setPlayerPos] = useState({ r: 1, c: 1 });
  const [won, setWon] = useState(false);

  const startLevel = (diff: Difficulty) => {
      const template = diff === 'EASY' ? LEVEL_EASY : LEVEL_HARD;
      const newGrid = template.map(row => [...row]);
      let startR = 1, startC = 1;
      for(let r=0; r<newGrid.length; r++) { for(let c=0; c<newGrid[0].length; c++) { if (newGrid[r][c] === 2) { startR = r; startC = c; } } }
      setGrid(newGrid); setPlayerPos({ r: startR, c: startC }); setWon(false); setDifficulty(diff);
  };

  const resetCurrentLevel = () => { if (difficulty) startLevel(difficulty); };

  const move = (dr: number, dc: number) => {
      if (won || !difficulty) return;
      const nextR = playerPos.r + dr; const nextC = playerPos.c + dc;
      if (nextR < 0 || nextR >= grid.length || nextC < 0 || nextC >= grid[0].length) return;
      const targetCell = grid[nextR][nextC];

      if (targetCell === 0 || targetCell === 2 || targetCell === 3) {
          setPlayerPos({ r: nextR, c: nextC });
          if (targetCell === 3) setWon(true);
      }
      else if (targetCell === 4) {
          const beyondR = nextR + dr; const beyondC = nextC + dc;
          if (beyondR < 0 || beyondR >= grid.length || beyondC < 0 || beyondC >= grid[0].length) return;
          const beyondCell = grid[beyondR][beyondC];
          if (beyondCell === 0 || beyondCell === 2 || beyondCell === 3) {
              const newGrid = grid.map(row => [...row]);
              const template = difficulty === 'EASY' ? LEVEL_EASY : LEVEL_HARD;
              const originalCellType = template[nextR][nextC]; 
              newGrid[beyondR][beyondC] = 4;
              if (originalCellType === 3) newGrid[nextR][nextC] = 3;
              else if (originalCellType === 2) newGrid[nextR][nextC] = 2;
              else newGrid[nextR][nextC] = 0;
              setGrid(newGrid); setPlayerPos({ r: nextR, c: nextC });
          }
      }
  };
  
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (!difficulty || won) return;
          if (e.key === 'ArrowUp') move(-1, 0); if (e.key === 'ArrowDown') move(1, 0); if (e.key === 'ArrowLeft') move(0, -1); if (e.key === 'ArrowRight') move(0, 1);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [difficulty, grid, playerPos, won]);

  const renderCell = (r: number, c: number, cellValue: number) => {
      const isPlayer = playerPos.r === r && playerPos.c === c;
      let content = null;
      let bgClass = 'bg-gray-700';
      if (cellValue === 1) bgClass = 'bg-green-800 border border-green-900 shadow-inner rounded-sm';
      else if (cellValue === 3) content = <span className="text-xl animate-bounce">🍭</span>; 
      else if (cellValue === 4) { content = <span className="text-xl md:text-2xl drop-shadow-md">🪨</span>; bgClass = 'bg-gray-600 rounded-lg border-b-4 border-gray-800'; }

      return (
          <div key={`${r}-${c}`} className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ${bgClass} transition-all`}>
              {isPlayer ? <span className="text-2xl md:text-3xl animate-pulse z-10">👻</span> : content}
          </div>
      );
  };

  if (!difficulty) {
      return (
          <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in text-center p-4">
              <h2 className="text-4xl md:text-6xl font-black text-boo-orange mb-8 relative z-10 drop-shadow-[3px_3px_0_black]" style={{ textShadow: "4px 4px 0px black" }}>Labirinto</h2>
              <p className="text-gray-500 font-bold mb-8 text-sm bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">Usa la forza! Sposta i sassi 🪨 per passare.</p>
              <div className="flex flex-col gap-6 items-center w-full">
                  <button onClick={() => startLevel('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" /></button>
                  <button onClick={() => startLevel('HARD')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-md" /></button>
                  <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform mt-2"><img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto" /></button>
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in text-center px-2">
        <div className="w-full flex justify-between items-center mb-6">
            <button onClick={() => setDifficulty(null)} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                <img src={BTN_BACK_MENU_IMG} alt="Torna al Menu" className="h-12 w-auto drop-shadow-md" />
            </button>
            <h2 className="text-3xl md:text-5xl font-black text-boo-orange drop-shadow-[2px_2px_0_black]" style={{ textShadow: "3px 3px 0px black" }}>Labirinto</h2>
            <div className="w-10"></div>
        </div>

        <div className="bg-gray-800 p-3 rounded-2xl border-4 border-gray-600 shadow-xl mb-6 relative inline-block">
            {won && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm rounded-xl animate-in zoom-in p-4">
                    <Trophy size={60} className="text-yellow-400 mb-2 animate-bounce" />
                    <h3 className="text-3xl font-black text-white mb-2">VITTORIA!</h3>
                    <p className="text-white mb-6 font-bold">Hai trovato il dolcetto!</p>
                    <div className="flex gap-4">
                        <button onClick={resetCurrentLevel} className="bg-green-500 text-white font-black px-6 py-2 rounded-full border-2 border-white hover:scale-105">Rigioca</button>
                        <button onClick={() => setDifficulty(null)} className="bg-orange-500 text-white font-black px-6 py-2 rounded-full border-2 border-white hover:scale-105">Menu</button>
                    </div>
                </div>
            )}
            <div className="grid gap-0 border-2 border-gray-900" style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 1}, 1fr)` }}>
                {grid.map((row, r) => (row.map((cellValue, c) => renderCell(r, c, cellValue))))}
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-48 mb-6">
            <div></div><button onClick={() => move(-1, 0)} className="bg-blue-500 h-14 rounded-xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white flex items-center justify-center shadow-lg"><ArrowUp size={32}/></button><div></div>
            <button onClick={() => move(0, -1)} className="bg-blue-500 h-14 rounded-xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white flex items-center justify-center shadow-lg"><ArrowLeft size={32}/></button>
            <button onClick={resetCurrentLevel} className="bg-yellow-400 h-14 rounded-xl border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 text-black flex items-center justify-center shadow-lg"><RotateCcw size={24}/></button>
            <button onClick={() => move(0, 1)} className="bg-blue-500 h-14 rounded-xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white flex items-center justify-center shadow-lg"><ArrowRight size={32}/></button>
            <div></div><button onClick={() => move(1, 0)} className="bg-blue-500 h-14 rounded-xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 text-white flex items-center justify-center shadow-lg"><ArrowDown size={32}/></button><div></div>
        </div>
        <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform"><img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto" /></button>
    </div>
  );
};

export default MazeGame;
