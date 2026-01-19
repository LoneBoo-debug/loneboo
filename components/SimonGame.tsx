
import React, { useState, useRef, useEffect } from 'react';
import { Play, Trophy, LogOut, RotateCcw } from 'lucide-react';
import { getProgress } from '../services/tokens';

const SIMON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/simboosfobkg.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';

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
    
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3); 
    osc.stop(ctx.currentTime + 0.3);
  };

  const playSequence = async (seq: string[]) => {
    setIsPlayerTurn(false);
    setStatusText("OSSERVA");
    
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      setPlayingIdx(i);
      const colorObj = colors.find(c => c.id === seq[i]);
      if(colorObj) playSound(colorObj.sound);
      
      await new Promise(r => setTimeout(r, 500)); 
      setPlayingIdx(null);
      await new Promise(r => setTimeout(r, 200)); 
    }
    
    setIsPlayerTurn(true);
    setStatusText("TOCCA A TE");
  };

  const startGame = () => {
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

    const colorObj = colors.find(c => c.id === colorId);
    if(colorObj) playSound(colorObj.sound);

    if (colorId === sequence[userStep]) {
      if (userStep === sequence.length - 1) {
        setIsPlayerTurn(false);
        setUserStep(0);
        setStatusText("BRAVO!");
        
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
      setStatusText("OH NO!");
      setGameOver(true);
      setIsPlaying(false);
      setIsPlayerTurn(false);
    }
  };

  const wrapperStyle = "fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={wrapperStyle}>
      {/* SFONDO FISSO A TUTTO SCHERMO */}
      <img 
          src={SIMON_BG} 
          alt="" 
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" 
          draggable={false}
      />
      
      {/* UI FISSA: TASTO ESCI E SALDO GETTONI (STILE TRIS/FORZA 4) */}
      <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
          <div className="pointer-events-auto">
              <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                  <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto drop-shadow-md" />
              </button>
          </div>

          <div className="pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                  <span>{currentTokens}</span> <span className="text-xl">🪙</span>
              </div>
          </div>
      </div>

      {/* AREA DI GIOCO RIALZATA (pt ridotto per alzare tutto) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-24 md:pt-32 px-2">
          
          {/* TITOLO LIVELLO */}
          <div className="h-12 md:h-16 flex items-center justify-center shrink-0 mb-2">
            {isPlaying && !gameOver && (
                <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/40 shadow-lg animate-in slide-in-from-top-4">
                    <span 
                        className="font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[2px_2px_0_black] text-xl md:text-3xl"
                        style={{ WebkitTextStroke: '1.2px black' }}
                    >
                        LIVELLO {sequence.length}
                    </span>
                </div>
            )}
          </div>

          {/* SIMON BOARD - Aggiunta ombreggiatura bianca esterna */}
          <div className="flex-none w-full flex items-center justify-center py-4 md:py-8 relative">
              <div 
                className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] shrink-0 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.4)]"
                style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.2))' }}
              >
                  {colors.map((btn) => {
                    const isLit = playingIdx !== null && sequence[playingIdx] === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleColorClick(btn.id); }}
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
                           <button onClick={startGame} className="w-full h-full flex flex-col items-center justify-center hover:scale-105 transition-transform group">
                               <Play size={36} className="text-green-500 fill-green-500 group-hover:drop-shadow-[0_0_10px_lime] transition-all mb-1" />
                               <span className="text-white font-black text-sm md:text-base uppercase tracking-widest">START</span>
                           </button>
                       ) : gameOver ? (
                           <button onClick={startGame} className="w-full h-full flex flex-col items-center justify-center hover:scale-105 transition-transform group animate-in zoom-in">
                               <RotateCcw size={32} className="text-red-500 group-hover:rotate-180 transition-transform duration-500 mb-1" />
                               <span className="text-white font-black text-xs uppercase">RIPROVA</span>
                               <span className="text-gray-400 font-bold text-[10px]">Score: {sequence.length > 0 ? sequence.length - 1 : 0}</span>
                           </button>
                       ) : (
                           <div className="flex flex-col items-center justify-center text-center">
                               <span className={`text-[10px] md:text-sm font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${isPlayerTurn ? 'bg-green-500 text-black animate-pulse' : 'bg-red-500 text-white'}`}>
                                   {statusText}
                               </span>
                           </div>
                       )}
                  </div>
              </div>
          </div>

          {/* DASHBOARD PANEL - Più compatto e staccato di poco dal tabellone */}
          <div className="w-[95%] max-w-sm shrink-0 mb-6 z-50 mt-2">
              <div className="bg-black/60 backdrop-blur-md rounded-3xl border-2 border-white/20 p-3 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                          <Trophy size={18} className="text-yellow-400 drop-shadow-md" />
                          <span className="text-white font-black text-base uppercase tracking-wide drop-shadow-md">Premi</span>
                      </div>
                      <div className="text-[10px] font-bold text-white/60">
                          Lvl: <span className="text-white text-xs">{sequence.length}</span>
                      </div>
                  </div>

                  <div className="flex gap-2 justify-between">
                      {MILESTONES.map((m) => {
                          const isReached = sequence.length >= m.level || (gameOver && (sequence.length - 1) >= m.level); 
                          return (
                              <div 
                                key={m.level} 
                                className={`
                                    flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl border-2 transition-all duration-500
                                    ${isReached 
                                        ? 'bg-gradient-to-b from-green-500/80 to-green-700/80 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-105' 
                                        : 'bg-white/10 border-white/10 opacity-50 grayscale'}
                                `}
                              >
                                  <span className={`text-[8px] font-black uppercase mb-0.5 ${isReached ? 'text-green-100' : 'text-gray-400'}`}>Lvl {m.level}</span>
                                  <div className="flex items-center gap-1">
                                      <span className={`font-black text-base ${isReached ? 'text-white' : 'text-gray-300'}`}>{m.reward}</span>
                                      <span className="text-sm">🪙</span>
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
