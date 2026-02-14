
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Trophy, LogOut, RotateCcw } from 'lucide-react';
import { getProgress } from '../services/tokens';
import { isNightTime } from '../services/weatherService';

const SIMON_BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/simonboobgdiejsj33w.webp';
const SIMON_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/simonboonightvisoin.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';

const colors = [
  { 
    id: 'green', 
    color: 'bg-green-500/40', 
    lit: 'bg-green-500/90 shadow-[0_0_50px_rgba(34,197,94,0.9)]', 
    sound: 261.63, 
    position: 'top-0 left-0 rounded-tl-[100px]' 
  },
  { 
    id: 'red', 
    color: 'bg-red-500/40', 
    lit: 'bg-red-500/90 shadow-[0_0_50px_rgba(239,68,68,0.9)]', 
    sound: 329.63, 
    position: 'top-0 right-0 rounded-tr-[100px]' 
  },
  { 
    id: 'yellow', 
    color: 'bg-yellow-400/40', 
    lit: 'bg-yellow-400/90 shadow-[0_0_50px_rgba(250,204,21,0.9)]', 
    sound: 392.00, 
    position: 'bottom-0 left-0 rounded-bl-[100px]' 
  },
  { 
    id: 'blue', 
    color: 'bg-blue-500/40', 
    lit: 'bg-blue-500/90 shadow-[0_0_50px_rgba(59,130,246,0.9)]', 
    sound: 523.25, 
    position: 'bottom-0 right-0 rounded-br-[100px]' 
  }
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
  const [now, setNow] = useState(new Date());
  const [sequence, setSequence] = useState<string[]>([]);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [userStep, setUserStep] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusText, setStatusText] = useState("START");
  const [gameOver, setGameOver] = useState(false);
  
  const [currentTokens, setCurrentTokens] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentBg = useMemo(() => isNightTime(now) ? SIMON_BG_NIGHT : SIMON_BG_DAY, [now]);

  useEffect(() => {
    const timeTimer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timeTimer);
  }, []);

  useEffect(() => {
      try {
          const p = getProgress();
          setCurrentTokens(p ? p.tokens : 0);
      } catch (e) { console.error(e); }
  }, []);

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

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none">
      <img 
          src={currentBg} 
          alt="" 
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" 
          draggable={false}
      />
      
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

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-24 md:pt-32 px-2">
          
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

          <div className="flex-none w-full flex items-center justify-center py-4 md:py-8 relative">
              <div 
                className="relative w-[250px] h-[250px] md:w-[320px] md:h-[320px] shrink-0 rounded-full"
              >
                  {colors.map((btn) => {
                    const isLit = playingIdx !== null && sequence[playingIdx] === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleColorClick(btn.id); }}
                        className={`
                          absolute w-[115px] h-[115px] md:w-[150px] md:h-[150px] 
                          border-4 border-white/30 backdrop-blur-md transition-all duration-150
                          ${btn.position}
                          ${isLit ? btn.lit + ' scale-105 z-10 brightness-125' : btn.color}
                          active:scale-95 active:brightness-125
                        `}
                        style={{ touchAction: 'none' }}
                      />
                    );
                  })}

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-28 md:h-28 bg-black/60 backdrop-blur-lg rounded-full border-[6px] border-gray-600/50 flex flex-col items-center justify-center shadow-[0_0_30px_black] z-20 overflow-hidden">
                       {!isPlaying && !gameOver ? (
                           <button onClick={startGame} className="w-full h-full flex flex-col items-center justify-center hover:scale-105 transition-transform group">
                               <Play size={30} className="text-green-500 fill-green-500 group-hover:drop-shadow-[0_0_10px_lime] transition-all mb-1" />
                               <span className="text-white font-black text-xs md:text-sm uppercase tracking-widest">START</span>
                           </button>
                       ) : gameOver ? (
                           <button onClick={startGame} className="w-full h-full flex flex-col items-center justify-center hover:scale-105 transition-transform group animate-in zoom-in">
                               <RotateCcw size={28} className="text-red-500 group-hover:rotate-180 transition-transform duration-500 mb-1" />
                               <span className="text-white font-black text-[10px] uppercase">RIPROVA</span>
                               <span className="text-gray-400 font-bold text-[8px]">Score: {sequence.length > 0 ? sequence.length - 1 : 0}</span>
                           </button>
                       ) : (
                           <div className="flex flex-col items-center justify-center text-center">
                               <span className={`text-[8px] md:text-xs font-black uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${isPlayerTurn ? 'bg-green-500 text-black animate-pulse' : 'bg-red-500 text-white'}`}>
                                   {statusText}
                               </span>
                           </div>
                       )}
                  </div>
              </div>
          </div>

          <div className="w-[90%] max-w-[320px] shrink-0 mb-6 z-50 mt-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border-2 border-white/20 p-2 shadow-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
                  <div className="relative z-10">
                      <div className="flex justify-between items-center mb-1.5 px-1">
                          <div className="flex items-center gap-1.5">
                              <Trophy size={16} className="text-yellow-400 drop-shadow-md" />
                              <span className="text-white font-black text-sm uppercase tracking-wide drop-shadow-md">Premi</span>
                          </div>
                          <div className="text-[9px] font-bold text-white/60">
                              Lvl: <span className="text-white text-xs">{sequence.length}</span>
                          </div>
                      </div>

                      <div className="flex gap-1.5 justify-between">
                          {MILESTONES.map((m) => {
                              const isReached = sequence.length >= m.level || (gameOver && (sequence.length - 1) >= m.level); 
                              return (
                                  <div 
                                    key={m.level} 
                                    className={`
                                        flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl border-2 transition-all duration-500
                                        ${isReached 
                                            ? 'bg-green-500/60 backdrop-blur-md border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-105' 
                                            : 'bg-white/5 border-white/10 opacity-50 grayscale'}
                                    `}
                                  >
                                      <span className={`text-[7px] font-black uppercase mb-0.5 ${isReached ? 'text-green-100' : 'text-gray-400'}`}>Lvl {m.level}</span>
                                      <div className="flex items-center gap-1">
                                          <span className={`font-black text-sm ${isReached ? 'text-white' : 'text-gray-300'}`}>{m.reward}</span>
                                          <span className="text-xs">🪙</span>
                                      </div>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default SimonGame;
