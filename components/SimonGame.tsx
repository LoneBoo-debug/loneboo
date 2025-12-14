
import React, { useState, useRef, useEffect } from 'react';
import { Play, Trophy, LogOut, RotateCcw } from 'lucide-react';

const colors = [
  { id: 'green', color: 'bg-green-500', active: 'bg-green-300', sound: 261.63 }, // Do (C4)
  { id: 'red', color: 'bg-red-500', active: 'bg-red-300', sound: 329.63 },   // Mi (E4)
  { id: 'yellow', color: 'bg-yellow-400', active: 'bg-yellow-200', sound: 392.00 }, // Sol (G4)
  { id: 'blue', color: 'bg-blue-500', active: 'bg-blue-300', sound: 523.25 }  // Do (C5)
];

const MILESTONES = [
    { level: 5, reward: 5 },
    { level: 10, reward: 10 },
    { level: 20, reward: 20 }
];

interface SimonGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const SimonGame: React.FC<SimonGameProps> = ({ onBack, onEarnTokens }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [userStep, setUserStep] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusText, setStatusText] = useState("START");
  const [gameOver, setGameOver] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Helper to init context lazily
  const getAudioContext = () => {
      if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
              audioCtxRef.current = new AudioContextClass();
          }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playSound = (freq: number) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    // Smooth sound envelope (Short beep)
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3); 
    osc.stop(ctx.currentTime + 0.3);
  };

  const playSequence = async (seq: string[]) => {
    setIsPlayerTurn(false);
    setStatusText("OSSERVA");
    
    // Initial delay
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      setPlayingIdx(i);
      const colorObj = colors.find(c => c.id === seq[i]);
      if(colorObj) playSound(colorObj.sound);
      
      await new Promise(r => setTimeout(r, 500)); // Light on time
      setPlayingIdx(null);
      await new Promise(r => setTimeout(r, 200)); // Gap between lights
    }
    
    setIsPlayerTurn(true);
    setStatusText("TOCCA A TE");
  };

  const startGame = () => {
    // Important: User interaction required to unlock audio on modern browsers
    getAudioContext();
    
    setSequence([]);
    setUserStep(0);
    setIsPlaying(true);
    setGameOver(false);
    addToSequence([]);
  };

  const addToSequence = (currentSeq: string[]) => {
    const nextColor = colors[Math.floor(Math.random() * colors.length)].id;
    const newSeq = [...currentSeq, nextColor];
    setSequence(newSeq);
    playSequence(newSeq);
  };

  const handleColorClick = (colorId: string) => {
    if (!isPlayerTurn || !isPlaying) return;

    // Play sound on user click too
    const colorObj = colors.find(c => c.id === colorId);
    if(colorObj) playSound(colorObj.sound);

    if (colorId === sequence[userStep]) {
      if (userStep === sequence.length - 1) {
        // Round complete
        setIsPlayerTurn(false);
        setUserStep(0);
        setStatusText("BRAVO!");
        
        // CHECK MILESTONES
        const currentLevel = sequence.length;
        const milestone = MILESTONES.find(m => m.level === currentLevel);
        
        if (milestone && onEarnTokens) {
            onEarnTokens(milestone.reward);
        }

        setTimeout(() => addToSequence(sequence), 1000);
      } else {
        setUserStep(prev => prev + 1);
      }
    } else {
      // Game Over
      setStatusText("OH NO!");
      setGameOver(true);
      setIsPlaying(false);
      setIsPlayerTurn(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-900 overflow-hidden relative">
      
      {/* HEADER */}
      <div className="w-full p-4 flex justify-between items-center z-10 shrink-0">
          <button onClick={onBack} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20">
              <LogOut size={24} />
          </button>
          <h2 className="text-4xl font-black text-boo-orange" style={{ textShadow: "3px 3px 0px black" }}>
              Simon Boo
          </h2>
          <div className="w-10"></div>
      </div>

      {/* GAME AREA - FLEXIBLE & CENTERED */}
      <div className="flex-1 w-full flex items-center justify-center relative p-2 min-h-0">
          
          {/* SIMON BOARD - REDUCED SIZE FOR FIT */}
          <div className="relative w-full max-w-[300px] md:max-w-sm aspect-square max-h-[50vh]">
              {/* Background Plate */}
              <div className="absolute inset-0 rounded-full bg-black shadow-2xl"></div>
              
              {/* Buttons Grid */}
              <div className="absolute inset-2 grid grid-cols-2 grid-rows-2 gap-2">
                  {colors.map((btn) => {
                    const isLit = playingIdx !== null && sequence[playingIdx] === btn.id;
                    const isTopLeft = btn.id === 'green';
                    const isTopRight = btn.id === 'red';
                    const isBottomLeft = btn.id === 'yellow';
                    const isBottomRight = btn.id === 'blue';

                    // Rounded corners logic for the 4 quadrants
                    const roundedClass = 
                        isTopLeft ? 'rounded-tl-[100px]' : 
                        isTopRight ? 'rounded-tr-[100px]' : 
                        isBottomLeft ? 'rounded-bl-[100px]' : 
                        'rounded-br-[100px]';

                    return (
                      <button
                        key={btn.id}
                        // Use both MouseDown and TouchStart for faster response
                        onMouseDown={() => handleColorClick(btn.id)}
                        onTouchStart={(e) => { e.preventDefault(); handleColorClick(btn.id); }}
                        className={`
                          w-full h-full border-8 border-black/10 transition-all duration-100 relative overflow-hidden
                          ${roundedClass}
                          ${btn.color}
                          ${isLit ? 'brightness-150 scale-[1.02] z-10 shadow-[0_0_30px_rgba(255,255,255,0.8)]' : 'brightness-100'}
                          active:brightness-125 active:scale-[0.98]
                        `}
                        style={{ touchAction: 'manipulation' }}
                      />
                    );
                  })}
              </div>

              {/* CENTRAL HUB */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] bg-black rounded-full border-[8px] border-gray-800 flex flex-col items-center justify-center shadow-2xl z-20 overflow-hidden">
                   {!isPlaying && !gameOver ? (
                       <button 
                           onClick={startGame}
                           className="w-full h-full flex flex-col items-center justify-center bg-gray-900 hover:bg-gray-800 transition-colors group"
                       >
                           <Play size={40} className="text-green-500 fill-green-500 group-hover:scale-110 transition-transform mb-1" />
                           <span className="text-white font-black text-sm md:text-base uppercase">GIOCA</span>
                       </button>
                   ) : gameOver ? (
                       <button 
                           onClick={startGame}
                           className="w-full h-full flex flex-col items-center justify-center bg-gray-900 hover:bg-gray-800 transition-colors group animate-in zoom-in"
                       >
                           <RotateCcw size={32} className="text-red-500 group-hover:rotate-180 transition-transform duration-500 mb-1" />
                           <span className="text-white font-black text-xs uppercase">RIPROVA</span>
                           <span className="text-gray-500 font-bold text-[10px]">Score: {sequence.length > 0 ? sequence.length - 1 : 0}</span>
                       </button>
                   ) : (
                       <div className="flex flex-col items-center justify-center text-center">
                           <span className="text-gray-500 font-bold text-[10px] uppercase tracking-wider mb-1">LIVELLO</span>
                           <span className="text-white font-black text-4xl leading-none mb-1">{sequence.length}</span>
                           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${isPlayerTurn ? 'bg-green-500 text-black animate-pulse' : 'bg-red-500 text-white'}`}>
                               {statusText}
                           </span>
                       </div>
                   )}
              </div>
          </div>
      </div>

      {/* DASHBOARD PANEL (FIXED BOTTOM) */}
      <div className="w-full max-w-md p-4 pb-6 shrink-0 z-10">
          <div className="bg-gray-800 rounded-2xl border-4 border-gray-700 p-4 shadow-xl">
              
              <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                      <Trophy size={20} className="text-yellow-400" />
                      <span className="text-white font-black text-lg uppercase tracking-wide">Ricompense</span>
                  </div>
                  <div className="text-xs font-bold text-gray-400">
                      Livello Attuale: <span className="text-white text-sm">{isPlaying || gameOver ? (sequence.length > 0 && !gameOver && isPlayerTurn ? sequence.length -1 : sequence.length) : 0}</span>
                  </div>
              </div>

              <div className="flex gap-2 justify-between">
                  {MILESTONES.map((m) => {
                      const isReached = sequence.length >= m.level || (gameOver && (sequence.length - 1) >= m.level); 
                      
                      return (
                          <div 
                            key={m.level} 
                            className={`
                                flex-1 flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all duration-500
                                ${isReached 
                                    ? 'bg-gradient-to-b from-green-500 to-green-700 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-105' 
                                    : 'bg-gray-700 border-gray-600 opacity-60 grayscale'}
                            `}
                          >
                              <span className={`text-[9px] font-black uppercase mb-1 ${isReached ? 'text-green-100' : 'text-gray-400'}`}>Lvl {m.level}</span>
                              <div className="flex items-center gap-1">
                                  <span className={`font-black text-lg ${isReached ? 'text-white' : 'text-gray-500'}`}>{m.reward}</span>
                                  <span className="text-base">🪙</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>

    </div>
  );
};

export default SimonGame;
