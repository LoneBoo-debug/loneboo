
import React, { useState, useRef, useEffect } from 'react';
import { Play, Trophy, LogOut, RotateCcw } from 'lucide-react';
import { getProgress } from '../services/tokens';

const SIMON_BG = 'https://i.postimg.cc/J7KWgLP0/sfondosimon.jpg';
const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const TITLE_IMG = 'https://i.postimg.cc/XqTM8VkF/intetssimon-(1).png';

const colors = [
  { id: 'green', color: 'bg-green-500', active: 'bg-green-300', sound: 261.63, position: 'top-0 left-0 rounded-tl-[100px]' }, // Do (C4)
  { id: 'red', color: 'bg-red-500', active: 'bg-red-300', sound: 329.63, position: 'top-0 right-0 rounded-tr-[100px]' },   // Mi (E4)
  { id: 'yellow', color: 'bg-yellow-400', active: 'bg-yellow-200', sound: 392.00, position: 'bottom-0 left-0 rounded-bl-[100px]' }, // Sol (G4)
  { id: 'blue', color: 'bg-blue-500', active: 'bg-blue-300', sound: 523.25, position: 'bottom-0 right-0 rounded-br-[100px]' }  // Do (C5)
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
  
  // Token State
  const [currentTokens, setCurrentTokens] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize tokens
  useEffect(() => {
      try {
          const p = getProgress();
          setCurrentTokens(p ? p.tokens : 0);
      } catch (e) { console.error(e); }
  }, []);

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
            setCurrentTokens(prev => prev + milestone.reward);
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

  // WRAPPER STYLE - Updated to bg-cover to fix mobile aspect ratio
  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center bg-no-repeat z-[60]";

  return (
    <div className={wrapperStyle} style={{ backgroundImage: `url(${SIMON_BG})` }}>
      
      {/* BACK BUTTON */}
      <div className="absolute top-4 left-4 z-50">
          <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
              <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto drop-shadow-md" />
          </button>
      </div>

      {/* TOP RIGHT TOKEN COUNTER */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none">
           <div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg">
               <span>{currentTokens}</span> <span className="text-xl">🪙</span>
           </div>
      </div>

      {/* MAIN CONTAINER - FLEX COLUMN FOR AUTO-LAYOUT */}
      <div className="w-full h-full flex flex-col items-center relative p-2">
          
          {/* 1. HEADER IMAGE - Enarged with Orange Contour */}
          <div className="mt-14 md:mt-4 mb-2 shrink-0 z-10 flex justify-center w-full animate-in slide-in-from-top-4 duration-500">
               <img 
                   src={TITLE_IMG} 
                   alt="Simon Boo" 
                   className="h-24 md:h-40 w-auto object-contain transition-transform hover:scale-105 duration-300"
                   style={{
                       filter: 'drop-shadow(0px 0px 4px #F97316) drop-shadow(0px 0px 6px #F97316) drop-shadow(0px 0px 2px #000000)'
                   }}
               />
          </div>

          {/* 2. GAME AREA - Flex-1 to take available space and center vertically */}
          <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
              
              {/* SIMON BOARD - Adjusted size for small screens (280px mobile) */}
              <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] shrink-0">
                  
                  {/* BUTTONS GRID */}
                  {colors.map((btn) => {
                    const isLit = playingIdx !== null && sequence[playingIdx] === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onPointerDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleColorClick(btn.id);
                        }}
                        className={`
                          absolute w-[130px] h-[130px] md:w-[165px] md:h-[165px] 
                          border-4 border-white/20 shadow-2xl transition-all duration-100
                          ${btn.position}
                          ${btn.color}
                          ${isLit ? 'brightness-150 scale-105 z-10 shadow-[0_0_40px_white]' : 'brightness-100 hover:brightness-110'}
                          active:scale-95 active:brightness-125
                        `}
                        style={{ touchAction: 'none' }}
                      />
                    );
                  })}

                  {/* CENTRAL HUB */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 bg-black rounded-full border-[6px] border-gray-600 flex flex-col items-center justify-center shadow-[0_0_30px_black] z-20">
                       {!isPlaying && !gameOver ? (
                           <button 
                               onClick={startGame}
                               className="w-full h-full flex flex-col items-center justify-center hover:scale-105 transition-transform group"
                           >
                               <Play size={36} className="text-green-500 fill-green-500 group-hover:drop-shadow-[0_0_10px_lime] transition-all mb-1" />
                               <span className="text-white font-black text-sm md:text-base uppercase tracking-widest">START</span>
                           </button>
                       ) : gameOver ? (
                           <button 
                               onClick={startGame}
                               className="w-full h-full flex flex-col items-center justify-center hover:scale-105 transition-transform group animate-in zoom-in"
                           >
                               <RotateCcw size={32} className="text-red-500 group-hover:rotate-180 transition-transform duration-500 mb-1" />
                               <span className="text-white font-black text-xs uppercase">RIPROVA</span>
                               <span className="text-gray-400 font-bold text-[10px]">Score: {sequence.length > 0 ? sequence.length - 1 : 0}</span>
                           </button>
                       ) : (
                           <div className="flex flex-col items-center justify-center text-center">
                               <span className="text-gray-400 font-bold text-[9px] uppercase tracking-wider mb-1">LIVELLO</span>
                               <span className="text-white font-black text-4xl leading-none mb-1 text-shadow-md">{sequence.length}</span>
                               <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${isPlayerTurn ? 'bg-green-500 text-black animate-pulse' : 'bg-red-500 text-white'}`}>
                                   {statusText}
                               </span>
                           </div>
                       )}
                  </div>
              </div>
          </div>

          {/* 3. DASHBOARD PANEL - Static (Flow) to ensure it fits without overlap */}
          <div className="w-[90%] max-w-md shrink-0 mb-4 z-50">
              <div className="bg-black/60 backdrop-blur-md rounded-3xl border-2 border-white/20 p-4 shadow-xl">
                  
                  <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                          <Trophy size={20} className="text-yellow-400 drop-shadow-md" />
                          <span className="text-white font-black text-lg uppercase tracking-wide drop-shadow-md">Premi</span>
                      </div>
                      <div className="text-xs font-bold text-white/60">
                          Record Attuale: <span className="text-white text-sm">{isPlaying || gameOver ? (sequence.length > 0 && !gameOver && isPlayerTurn ? sequence.length -1 : sequence.length) : 0}</span>
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
                                        ? 'bg-gradient-to-b from-green-500/80 to-green-700/80 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-105' 
                                        : 'bg-white/10 border-white/10 opacity-50 grayscale'}
                                `}
                              >
                                  <span className={`text-[9px] font-black uppercase mb-1 ${isReached ? 'text-green-100' : 'text-gray-400'}`}>Lvl {m.level}</span>
                                  <div className="flex items-center gap-1">
                                      <span className={`font-black text-lg ${isReached ? 'text-white' : 'text-gray-300'}`}>{m.reward}</span>
                                      <span className="text-base">🪙</span>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>

      </div>

    </div>
  );
};

export default SimonGame;
