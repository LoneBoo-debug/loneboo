
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Hash, Trophy, Play, RotateCcw, X as XIcon, Volume2, VolumeX, Star as LucideStar, Music, Music2 } from 'lucide-react';
import { CHARACTERS } from '../services/databaseAmici';
import { getAsset } from '../services/LocalAssets';

const BINGO_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mblsfondc.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bksalagii+(1).webp';
const START_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/estrheadetmbl.webp';
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartoon-189231.mp3';

const OPPONENT_TMB_IMAGES: Record<string, string> = {
  'andrea': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/andreatmb+(2).webp',
  'grufo': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grufotmbl+(1).webp',
  'raffa': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/raffatmbl+(1).webp'
};

const OPPONENT_WIN_IMAGES: Record<string, string> = {
  'andrea': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/andreawintmbl+(1).webp',
  'grufo': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grufowintblm+(1).webp',
  'raffa': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/raffawintblm+(1).webp'
};

type PrizeId = 'AMBO' | 'TERNO' | 'QUATERNA' | 'CINQUINA' | 'TOMBOLA';

const PRIZES = [
  { id: 'AMBO' as PrizeId, label: 'Ambo', tokens: 1, count: 2 },
  { id: 'TERNO' as PrizeId, label: 'Terno', tokens: 2, count: 3 },
  { id: 'QUATERNA' as PrizeId, label: 'Quaterna', tokens: 3, count: 4 },
  { id: 'CINQUINA' as PrizeId, label: 'Cinquina', tokens: 5, count: 5 },
  { id: 'TOMBOLA' as PrizeId, label: 'Tombola', tokens: 10, count: 15 }
];

interface Player {
  id: string;
  name: string;
  image: string;
  card: number[][];
  marked: boolean[][];
}

interface StarEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

const BingoGame: React.FC<{ onBack: () => void, onEarnTokens: (n: number) => void }> = ({ onBack, onEarnTokens }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [extractedNumbers, setExtractedNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [prizeHistory, setPrizeHistory] = useState<{ prizeId: string, winnerName: string }[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [winningOpponentId, setWinningOpponentId] = useState<string | null>(null);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [stars, setStars] = useState<StarEffect[]>([]);
  const [lastPlayerPrize, setLastPlayerPrize] = useState<string | null>(null);
  
  const extractionInterval = useRef<any>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const bgMusic = useRef<HTMLAudioElement | null>(null);

  // Initialize Music
  useEffect(() => {
    bgMusic.current = new Audio(BG_MUSIC_URL);
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.4;
    
    return () => {
      if (bgMusic.current) {
        bgMusic.current.pause();
        bgMusic.current = null;
      }
    };
  }, []);

  // Handle Music Playback
  useEffect(() => {
    if (bgMusic.current) {
      if (musicEnabled && isPlaying && !isGameOver) {
        bgMusic.current.play().catch(() => {
          console.log("Interaction required for music playback");
        });
      } else {
        bgMusic.current.pause();
      }
    }
  }, [musicEnabled, isPlaying, isGameOver]);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
  };

  const playSfx = useCallback((type: 'PLIN' | 'YEAH' | 'FANFARE') => {
    if (!sfxEnabled) return;
    initAudio();
    const ctx = audioCtx.current!;
    const now = ctx.currentTime;

    if (type === 'PLIN') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.1);
    } else if (type === 'YEAH') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.5);
    } else if (type === 'FANFARE') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + i * 0.15);
        gain.gain.setValueAtTime(0.05, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.5);
      });
    }
  }, [sfxEnabled]);

  const triggerVictoryExplosion = () => {
    const colors = ['#fde047', '#f97316', '#22c55e', '#3b82f6', '#ec4899'];
    const newStars = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setStars(newStars);
    setTimeout(() => setStars([]), 2000);
  };

  const generateCard = () => {
    const card: number[][] = Array.from({ length: 3 }, () => Array(9).fill(0));
    for (let r = 0; r < 3; r++) {
      const rowIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => Math.random() - 0.5).slice(0, 5);
      rowIndices.forEach(c => {
        const min = c * 10 + 1;
        const max = c === 8 ? 90 : (c + 1) * 10;
        let num;
        do {
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (card.some(row => row.includes(num)));
        card[r][c] = num;
      });
    }
    return card;
  };

  const initGame = () => {
    const opponents = CHARACTERS.filter(c => ['raffa', 'grufo', 'andrea'].includes(c.id));
    const allPlayers: Player[] = [
      { 
        id: 'player', 
        name: 'Tu', 
        image: getAsset('https://loneboo-images.s3.eu-south-1.amazonaws.com/boo.webp'), 
        card: generateCard(), 
        marked: Array.from({ length: 3 }, () => Array(9).fill(false)) 
      },
      ...opponents.map(c => ({
        id: c.id,
        name: c.name,
        image: c.image,
        card: generateCard(),
        marked: Array.from({ length: 3 }, () => Array(9).fill(false))
      }))
    ];
    setPlayers(allPlayers);
    setExtractedNumbers([]);
    setCurrentNumber(null);
    setPrizeHistory([]);
    setIsGameOver(false);
    setIsPaused(false);
    setWinningOpponentId(null);
    setIsPlaying(true);
    setLastPlayerPrize(null);
  };

  const checkWins = useCallback((updatedPlayers: Player[]) => {
    const newPrizes = [...prizeHistory];
    let wonTokens = 0;

    PRIZES.forEach(prize => {
      if (newPrizes.find(p => p.prizeId === prize.id)) return;

      const currentWinners = updatedPlayers.filter(player => {
        if (prize.id === 'TOMBOLA') {
          return player.marked.flat().filter(Boolean).length === 15;
        } else {
          return player.marked.some(row => row.filter(Boolean).length === prize.count);
        }
      });

      if (currentWinners.length > 0) {
        const luckyWinner = currentWinners.find(w => w.id === 'player') || 
                            currentWinners[Math.floor(Math.random() * currentWinners.length)];
        
        newPrizes.push({ prizeId: prize.id, winnerName: luckyWinner.name });
        
        setIsPaused(true); // Mette in pausa l'estrazione per celebrare

        if (luckyWinner.id === 'player') {
          wonTokens += prize.tokens;
          playSfx('FANFARE');
          triggerVictoryExplosion();
          setLastPlayerPrize(prize.label);
          
          if (prize.id === 'TOMBOLA') {
              setTimeout(() => setIsGameOver(true), 4000);
          } else {
              setTimeout(() => {
                setLastPlayerPrize(null);
                setIsPaused(false);
              }, 3000);
          }
        } else {
          playSfx('YEAH');
          setWinningOpponentId(luckyWinner.id);
          
          if (prize.id === 'TOMBOLA') {
              setTimeout(() => setIsGameOver(true), 4000);
          } else {
              setTimeout(() => {
                setWinningOpponentId(null);
                setIsPaused(false);
              }, 3000);
          }
        }
      }
    });

    if (wonTokens > 0) onEarnTokens(wonTokens);
    if (newPrizes.length !== prizeHistory.length) {
        setPrizeHistory(newPrizes);
    }
  }, [prizeHistory, onEarnTokens, playSfx]);

  const extract = useCallback(() => {
    if (isGameOver || isPaused) return;

    setExtractedNumbers(prev => {
      if (prev.length >= 90) return prev;
      let next;
      do {
        next = Math.floor(Math.random() * 90) + 1;
      } while (prev.includes(next));

      setCurrentNumber(next);
      playSfx('PLIN');
      const newExtracted = [...prev, next];

      setPlayers(currentPlayers => {
        const nextPlayers = currentPlayers.map(p => {
          const newMarked = p.marked.map((row, r) => 
            row.map((m, c) => m || p.card[r][c] === next)
          );
          return { ...p, marked: newMarked };
        });
        checkWins(nextPlayers);
        return nextPlayers;
      });

      return newExtracted;
    });
  }, [isGameOver, isPaused, checkWins, playSfx]);

  useEffect(() => {
    if (isPlaying && !isGameOver && !isPaused) {
      extractionInterval.current = setInterval(extract, 3500);
    } else {
      clearInterval(extractionInterval.current);
    }
    return () => clearInterval(extractionInterval.current);
  }, [isPlaying, isGameOver, isPaused, extract]);

  const currentPlayer = players.find(p => p.id === 'player');
  const penultimateNumber = extractedNumbers.length >= 2 ? extractedNumbers[extractedNumbers.length - 2] : null;

  return (
    <div className="fixed inset-0 z-0 bg-[#1e1b4b] overflow-hidden select-none touch-none h-full w-full">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes star-pop {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.5) rotate(360deg) translate(var(--tw-tx), var(--tw-ty)); opacity: 0; }
        }
        .star-particle {
          animation: star-pop 1.5s ease-out forwards;
        }
        @keyframes rocking-base {
          0%, 100% { transform: rotate(-8deg) scale(var(--scale, 1.1)); }
          50% { transform: rotate(8deg) scale(var(--scale, 1.1)); }
        }
        .animate-rocking-base {
          animation: rocking-base 0.6s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>

      {/* STAR EXPLOSION LAYER */}
      <div className="fixed inset-0 z-[110] pointer-events-none overflow-hidden">
        {stars.map(s => (
          <div 
            key={s.id} 
            className="star-particle absolute"
            style={{ 
              left: `${s.x}%`, 
              top: `${s.y}%`, 
              color: s.color,
              // @ts-ignore
              '--tw-tx': `${(Math.random() - 0.5) * 400}px`,
              // @ts-ignore
              '--tw-ty': `${(Math.random() - 0.5) * 400}px`
            }}
          >
            <LucideStar fill="currentColor" size={32} />
          </div>
        ))}
      </div>

      {/* SFONDO FISSO A TUTTO SCHERMO */}
      <img 
        src={BINGO_BG} 
        className="absolute inset-0 w-full h-full object-cover opacity-50" 
        alt="" 
      />
      
      {/* MAIN CONTAINER CON HEADER HUD */}
      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
        
        {/* HEADER HUD - COMPLETAMENTE TRASPARENTE */}
        <div className="w-full h-[150px] md:h-[200px] p-4 flex justify-between items-center bg-transparent pt-[70px] md:pt-[105px] border-b-2 border-white/0 shrink-0">
          <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-transform outline-none">
            <img src={EXIT_BTN_IMG} alt="Esci" className="h-20 md:h-32 w-auto" />
          </button>
          
          <div className="flex-1 flex justify-center items-center gap-2 md:gap-4 h-full min-h-[80px]">
            {!isPlaying ? (
               <div className="bg-orange-500 text-white px-6 py-2 rounded-full font-black uppercase text-xs md:text-sm animate-pulse border-2 border-white shadow-lg">
                  Tocca Inizia!
               </div>
            ) : (
              <div className="flex items-center gap-4 md:gap-8 animate-in slide-in-from-right duration-500">
                 {/* Penultimo Numero (N-1) */}
                 {penultimateNumber !== null && (
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-white/40 rounded-full border-2 border-white/50 flex items-center justify-center opacity-70">
                     <span className="text-2xl md:text-3xl font-black text-white">{penultimateNumber}</span>
                   </div>
                 )}
                 {/* Numero Corrente (N) */}
                 <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center justify-center animate-in zoom-in spin-in-90 duration-500">
                   <span className="text-4xl md:text-5xl font-black text-blue-900">{currentNumber || ""}</span>
                 </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <button 
              onClick={() => setMusicEnabled(!musicEnabled)} 
              className={`p-1.5 md:p-2 rounded-full border-2 transition-all ${musicEnabled ? 'bg-purple-500 border-white text-white' : 'bg-gray-600 border-gray-400 text-gray-300'}`}
              title="Musica"
            >
              {musicEnabled ? <Music2 size={18} /> : <Music size={18} />}
            </button>
            <button 
              onClick={() => setSfxEnabled(!sfxEnabled)} 
              className={`p-1.5 md:p-2 rounded-full border-2 transition-all ${sfxEnabled ? 'bg-orange-500 border-white text-white' : 'bg-gray-600 border-gray-400 text-gray-300'}`}
              title="Suoni"
            >
              {sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>

        {/* AREA DI GIOCO PRINCIPALE */}
        <div className="flex-1 w-full flex flex-col items-center justify-start p-4 gap-6 overflow-y-auto no-scrollbar pb-24">
          {!isPlaying ? (
            <div className="bg-white p-8 rounded-[40px] border-8 border-orange-500 shadow-2xl text-center max-w-sm animate-in zoom-in relative z-[60] mt-12">
               <div className="w-32 h-32 flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  <img src={START_HEADER_IMG} alt="" className="w-full h-full object-contain" />
               </div>
               <h2 className="text-3xl font-black text-gray-800 mb-2 uppercase font-luckiest">La Tombola!</h2>
               <p className="text-gray-500 font-bold mb-8 leading-tight">Sfida Raffa, Grufo e Andrea. <br/> Vinci fino a <span className="text-orange-500">10 gettoni</span>!</p>
               <button 
                  onClick={(e) => { e.stopPropagation(); initGame(); }} 
                  className="w-full bg-green-500 text-white font-black py-5 rounded-full border-4 border-black shadow-[4px_4px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none transition-all text-xl uppercase flex items-center justify-center gap-2"
               >
                 <Play fill="currentColor" /> INIZIA ORA
               </button>
            </div>
          ) : (
            <>
              {/* OPPONENTS PREVIEW - LAYOUT FISSO CON PERSONAGGI ABBASSATI */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-2xl shrink-0 items-end overflow-visible">
                 {players.filter(p => p.id !== 'player').map((p) => {
                   const isCelebrating = winningOpponentId === p.id;
                   const displayImg = isCelebrating ? OPPONENT_WIN_IMAGES[p.id] : (OPPONENT_TMB_IMAGES[p.id] || p.image);
                   // Andrea e Raffa sono abbassati con translate-y-6
                   const isShifted = p.id === 'andrea' || p.id === 'raffa';
                   
                   return (
                     <div key={p.id} className={`flex flex-col items-center transition-all ${isShifted ? 'translate-y-6' : ''}`}>
                        <img 
                          src={displayImg} 
                          className={`w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-lg transition-all duration-300 ${isCelebrating ? 'animate-rocking-base z-50' : ''}`} 
                          style={{
                              // @ts-ignore
                              '--scale': '1.1'
                          }}
                          alt="" 
                        />
                     </div>
                   );
                 })}
              </div>

              {/* PLAYER CARD */}
              {currentPlayer && (
                <div className="w-full max-w-3xl bg-orange-50 p-2 md:p-8 rounded-[2.5rem] border-4 md:border-[12px] border-orange-600 shadow-2xl animate-in slide-in-from-bottom mt-10 md:mt-24 relative">
                  
                  {/* FEEDBACK VINCITA CARTOON */}
                  {lastPlayerPrize && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none animate-in zoom-in duration-300">
                      <span 
                        className="text-4xl md:text-7xl font-luckiest text-yellow-400 uppercase tracking-widest text-center drop-shadow-[4px_4px_0_black]"
                        style={{ WebkitTextStroke: '2px black' }}
                      >
                        HAI FATTO {lastPlayerPrize}!
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-9 gap-1.5 md:gap-3 bg-orange-200 p-1.5 md:p-3 rounded-2xl shadow-inner">
                    {currentPlayer.card.map((row, r) => (
                      row.map((num, c) => (
                        <div key={`${r}-${c}`} className={`aspect-square rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-300 ${num === 0 ? 'bg-orange-300/30' : 'bg-white shadow-md border border-orange-300'}`}>
                           {num !== 0 && (
                             <span className="text-2xl md:text-5xl font-black text-blue-900 leading-none">{num}</span>
                           )}
                           {currentPlayer.marked[r][c] && (
                             <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center animate-in zoom-in duration-300 z-10">
                                <span className="text-4xl md:text-8xl font-black text-red-600/70 select-none pointer-events-none">X</span>
                             </div>
                           )}
                        </div>
                      ))
                    ))}
                  </div>
                </div>
              )}

              {/* PRIZE TRACKER */}
              <div className="w-full max-w-3xl mt-auto shrink-0">
                <div className="bg-black/50 backdrop-blur-md p-3 rounded-[2rem] border-2 border-white/10 flex flex-row items-center justify-center gap-2 md:gap-4 overflow-hidden shadow-2xl">
                   {PRIZES.map(p => {
                     const winner = prizeHistory.find(h => h.prizeId === p.id);
                     return (
                       <div key={p.id} className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl border-2 transition-all duration-500 min-w-0 ${winner ? 'bg-yellow-400 border-yellow-600 scale-105 shadow-lg' : 'bg-white/5 border-white/5 opacity-40'}`}>
                          <span className={`text-[8px] md:text-[10px] font-black uppercase leading-none mb-1 truncate w-full text-center ${winner ? 'text-yellow-900' : 'text-white/40'}`}>{p.label}</span>
                          <span className={`text-[10px] md:text-sm font-black truncate w-full text-center ${winner ? 'text-black' : 'text-white'}`}>{winner ? winner.winnerName : `${p.tokens} 🪙`}</span>
                       </div>
                     );
                   })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* GAME OVER MODAL */}
      {isGameOver && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in zoom-in duration-300">
          <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] text-center max-sm w-full relative">
             <img src={START_HEADER_IMG} alt="Vittoria" className="h-32 md:h-40 w-auto mx-auto mb-4" />
             <h2 className="text-3xl font-black text-gray-800 mb-2 uppercase font-luckiest">Gara Finita!</h2>
             
             <div className="bg-slate-50 p-5 rounded-3xl border-2 border-slate-100 mb-6 shadow-inner">
                <p className="text-gray-400 font-black text-[10px] mb-3 uppercase tracking-widest">Il Tuo Bottino:</p>
                <div className="flex flex-col gap-2">
                   {prizeHistory.filter(h => h.winnerName === 'Tu').length > 0 ? (
                     prizeHistory.filter(h => h.winnerName === 'Tu').map((h, i) => (
                       <div key={i} className="flex justify-between items-center px-4 py-2 bg-green-100 rounded-xl text-green-700 font-black border-2 border-green-200">
                         <span className="text-xs">{h.prizeId}</span>
                         <span className="text-sm">+{PRIZES.find(p => p.id === h.prizeId)?.tokens} 🪙</span>
                       </div>
                     ))
                   ) : (
                     <p className="text-gray-400 italic font-bold">Nessuna vincita in questa partita... Ritenta!</p>
                   )}
                </div>
             </div>

             <div className="flex flex-row gap-4 justify-center items-center">
               <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform outline-none">
                 <img src={EXIT_BTN_IMG} alt="Esci" className="h-24 md:h-32 w-auto drop-shadow-xl" />
               </button>
               <button onClick={initGame} className="hover:scale-105 active:scale-95 transition-transform outline-none">
                 <img src={BTN_PLAY_AGAIN_IMG} alt="Rigioca" className="h-24 md:h-32 w-auto drop-shadow-xl" />
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BingoGame;
