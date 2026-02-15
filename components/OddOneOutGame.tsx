
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Timer, Trophy, Heart, XCircle, AlertTriangle } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import { INTRUSO_DATABASE, IntrusoItem } from '../services/dbIntruso';
import { isNightTime } from '../services/weatherService';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/facilelogodsnaq.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediologjeidnuj4hedn.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/difficielrnfjn4edj.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp'; 
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const BTN_RETRY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tasto-riprova-(1).webp';
const BTN_EXIT_GAME_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tasto-esci-(1).webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const VICTORY_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dfersaasa-(1).webp';
const GAMEOVER_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dsfdfs-(1).webp';
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

// Nuovi asset sfondo
const BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/intrusodaytt.webp';
const BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/intrusonightrd.webp';

// Musica di sottofondo
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/hitslab-kids-cartoon-289153.mp3';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
type GameOverReason = 'TIME' | 'LIVES' | null;

interface OddOneOutProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const OddOneOutGame: React.FC<OddOneOutProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [now, setNow] = useState(new Date());
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gridSize, setGridSize] = useState(2); 
  const [items, setItems] = useState<IntrusoItem[]>([]);
  const [oddIndex, setOddIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lives, setLives] = useState(4);
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'GAME_OVER' | 'VICTORY'>('MENU');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>(null);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isMounting, setIsMounting] = useState(true);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Sfondo dinamico basato sull'orario (20:15 - 06:45)
  const currentBg = useMemo(() => isNightTime(now) ? BG_NIGHT : BG_DAY, [now]);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);

      // Inizializza Audio
      bgMusicRef.current = new Audio(BG_MUSIC_URL);
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.4;

      // Timer per l'aggiornamento dinamico dello sfondo
      const timeInterval = setInterval(() => setNow(new Date()), 60000);
      
      // Ritardo di sicurezza per prevenire ghost clicks
      const mountTimer = setTimeout(() => setIsMounting(false), 200);

      return () => {
          clearInterval(timeInterval);
          clearTimeout(mountTimer);
          if (bgMusicRef.current) {
              bgMusicRef.current.pause();
              bgMusicRef.current = null;
          }
      };
  }, []);

  // Gestione musica basata sullo stato del gioco e del toggle
  useEffect(() => {
      if (bgMusicRef.current) {
          if (musicEnabled && gameState === 'PLAYING') {
              bgMusicRef.current.play().catch(() => console.log("Musica bloccata dal browser"));
          } else {
              bgMusicRef.current.pause();
          }
      }
  }, [musicEnabled, gameState]);

  const handleUnlockHard = () => { if (unlockHardMode()) { setIsHardUnlocked(true); const p = getProgress(); setUserTokens(p.tokens); setShowUnlockModal(false); startGame('HARD', true); } };
  const handleOpenNewsstand = () => { if (onOpenNewsstand) { onOpenNewsstand(); setShowUnlockModal(false); } };
  
  const getInitialTime = (diff: Difficulty) => { 
    switch (diff) { 
        case 'EASY': return 60; 
        case 'MEDIUM': return 45; 
        case 'HARD': return 30; 
        default: return 60; 
    } 
  };

  const generateLevel = (currentLevel: number) => {
    const size = Math.min(5, 2 + Math.floor((currentLevel - 1) / 5)); 
    setGridSize(size);
    const totalCells = size * size;

    const categories = Array.from(new Set(INTRUSO_DATABASE.map(i => i.category)));
    const sortedCats = categories.sort((a,b) => 
        INTRUSO_DATABASE.filter(i => i.category === b).length - INTRUSO_DATABASE.filter(i => i.category === a).length
    );
    const mainCat = sortedCats[Math.floor(Math.random() * Math.min(sortedCats.length, 2))]; 

    const otherCats = categories.filter(c => c !== mainCat);
    const intruderCat = otherCats.length > 0 ? otherCats[Math.floor(Math.random() * otherCats.length)] : mainCat;

    const mainPool = [...INTRUSO_DATABASE.filter(i => i.category === mainCat)].sort(() => 0.5 - Math.random());
    const intruderPool = [...INTRUSO_DATABASE.filter(i => i.category === intruderCat)].sort(() => 0.5 - Math.random());

    const boardItems: IntrusoItem[] = [];
    for (let i = 0; i < totalCells - 1; i++) {
        boardItems.push(mainPool[i % mainPool.length]);
    }
    
    let intruderItem = intruderPool[0];
    if (mainCat === intruderCat) {
        intruderItem = intruderPool.find(item => !boardItems.some(bi => bi.id === item.id)) || intruderPool[0];
    }

    const newOddIndex = Math.floor(Math.random() * totalCells);
    setOddIndex(newOddIndex);
    const finalItems = [...boardItems];
    finalItems.splice(newOddIndex, 0, intruderItem);
    setItems(finalItems);
  };

  const startGame = (diff: Difficulty, forceStart = false) => {
      if (isMounting) return;
      if (diff === 'HARD' && !isHardUnlocked && !forceStart) { setShowUnlockModal(true); return; }
      setDifficulty(diff); 
      setLevel(1); 
      setLives(4);
      setRewardGiven(false); 
      setGameState('PLAYING'); 
      setGameOverReason(null);
      setTimeLeft(getInitialTime(diff));
      generateLevel(1);
  };

  useEffect(() => {
    let timer: any;
    if (gameState === 'PLAYING' && timeLeft > 0) { 
        timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000); 
    } else if (timeLeft === 0 && gameState === 'PLAYING') { 
        setGameOverReason('TIME');
        setGameState('GAME_OVER'); 
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
      if (gameState === 'VICTORY' && !rewardGiven && onEarnTokens) {
          const reward = 5;
          onEarnTokens(reward);
          setRewardGiven(true);
          setUserTokens(prev => prev + reward);
      }
  }, [gameState, rewardGiven, onEarnTokens]);

  const handleClick = (index: number) => {
    if (gameState !== 'PLAYING') return;
    if (index === oddIndex) {
      const nextLevel = level + 1;
      if (nextLevel > 20) { 
        setGameState('VICTORY'); 
      } else { 
        setLevel(nextLevel); 
        generateLevel(nextLevel); 
      }
    } else { 
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
          setGameOverReason('LIVES');
          setGameState('GAME_OVER');
      }
    }
  };

  const returnToMenu = () => { setGameState('MENU'); setDifficulty(null); };

  const wrapperStyle = "fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={wrapperStyle}>
        <style>{`
            /* Effetto Sticker Cartoon: Bordo bianco solido che segue la sagoma */
            .sticker-btn {
                filter: 
                    drop-shadow(2px 2px 0px white) 
                    drop-shadow(-2px -2px 0px white) 
                    drop-shadow(2px -2px 0px white) 
                    drop-shadow(-2px 2px 0px white)
                    drop-shadow(0px 4px 8px rgba(0,0,0,0.3));
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .sticker-btn:active {
                transform: scale(0.92);
            }
            
            @keyframes float-btn {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            .animate-float-btn { animation: float-btn 3s ease-in-out infinite; }
        `}</style>

        <img src={currentBg} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" draggable={false} />

        {/* TASTI NAVIGAZIONE IN ALTO A SINISTRA (ALZATI) */}
        <div className="fixed top-[70px] md:top-[105px] left-4 z-50 flex flex-col items-start pointer-events-none">
            <div className="pointer-events-auto">
                {gameState === 'MENU' ? (
                    <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-2 cursor-pointer touch-manipulation">
                        <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto" />
                    </button>
                ) : (
                    <button onClick={returnToMenu} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-2 cursor-pointer touch-manipulation">
                        <img src={BTN_BACK_MENU_IMG} alt="Torna al Menu" className="h-16 md:h-22 w-auto" />
                    </button>
                )}
            </div>
        </div>

        {/* SALDO GETTONI E TASTO AUDIO (ALTO A DESTRA) */}
        <div className="absolute top-[80px] md:top-[120px] right-4 z-50 pointer-events-none flex flex-col items-end gap-3">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl pointer-events-auto">
                <span>{userTokens}</span> <span className="text-xl">🪙</span>
            </div>
            
            {/* Tasto Audio sotto i gettoni - Ingrandito leggermente */}
            {(gameState === 'PLAYING' || gameState === 'MENU') && (
                <button 
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
                    title={musicEnabled ? "Spegni Musica" : "Accendi Musica"}
                >
                    <img src={AUDIO_ICON_IMG} alt="Audio" className="w-16 h-16 md:w-24 h-auto drop-shadow-xl" />
                </button>
            )}
        </div>

        {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-4 pt-24 md:pt-32">
            {gameState === 'MENU' ? (
                <div className="flex flex-col items-center w-full h-full animate-fade-in px-4">
                    
                    {/* PULSANTI CON EFFETTO STICKER - ABBASSATI ULTERIORMENTE */}
                    <div className="flex flex-col gap-4 items-center w-full max-w-[220px] md:max-w-[280px] mt-20 md:mt-36">
                        <button onClick={() => startGame('EASY')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent">
                            <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-xl" />
                        </button>
                        <button onClick={() => startGame('MEDIUM')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent" style={{ animationDelay: '0.5s' }}>
                            <img src={BTN_MEDIUM_IMG} alt="Medio" className="w-full h-auto drop-shadow-xl" />
                        </button>
                        <div className="relative sticker-btn animate-float-btn w-full" style={{ animationDelay: '1s' }}>
                            <button onClick={() => startGame('HARD')} className={`w-full outline-none border-none bg-transparent ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}>
                                <img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-xl" />
                            </button>
                            {!isHardUnlocked && <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20"><img src={LOCK_IMG} alt="Bloccato" className="w-10 h-10 drop-shadow-lg rotate-12" /></div>}
                        </div>
                    </div>
                </div>
            ) : gameState === 'PLAYING' ? (
               <div className="w-full h-full max-w-4xl flex flex-col items-center justify-start pt-28 md:pt-44">
                   <div className="flex justify-between w-full mb-6 px-4 max-xl items-center">
                        {/* LIVELLO (SX) */}
                        <div className="bg-blue-600/80 backdrop-blur-md text-white px-3 py-1 rounded-xl border-2 border-white/40 shadow-lg flex items-center gap-1.5">
                            <span className="font-black text-[10px] uppercase tracking-wider">LIV</span>
                            <span className="font-black text-xl">{level}/20</span>
                        </div>
                        
                        {/* CUORI (CENTRO) */}
                        <div className="flex gap-1.5 bg-black/40 p-2 rounded-full backdrop-blur-md border-2 border-white/20 shadow-lg">
                            {[...Array(4)].map((_, i) => (
                                <Heart key={i} size={18} className={`${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500 opacity-50'} transition-all`} />
                            ))}
                        </div>

                        {/* TIMER (DX) */}
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border-2 border-white/40 shadow-lg transition-colors backdrop-blur-md ${timeLeft <= 5 ? 'bg-red-600/80 animate-pulse' : 'bg-black/60'}`}>
                            <Timer size={20} className="text-white" />
                            <span className="font-black text-xl text-white">{timeLeft}s</span>
                        </div>
                   </div>
                   
                   <div className="bg-white/30 backdrop-blur-md p-3 md:p-5 rounded-[40px] border-4 border-white/50 shadow-2xl aspect-square w-full max-h-[60vh] max-w-[60vh] flex items-center justify-center relative z-10">
                       <div className="grid gap-2 md:gap-3 w-full h-full" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
                           {items.map((item, idx) => (
                               <button key={item.id + '-' + idx} onPointerDown={(e) => { e.preventDefault(); handleClick(idx); }} className="w-full h-full flex items-center justify-center bg-white rounded-xl md:rounded-2xl hover:bg-blue-50 border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 active:bg-blue-100 transition-all shadow-md overflow-hidden p-1.5 md:p-3" style={{ touchAction: 'none' }}>
                                   <img src={item.url} alt={item.label} className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm" draggable={false} />
                               </button>
                           ))}
                       </div>
                   </div>
               </div>
            ) : (
                <div className="bg-white p-5 md:p-8 rounded-[40px] border-8 border-yellow-400 shadow-2xl text-center max-sm w-[90%] animate-in zoom-in relative z-50 mt-12 md:mt-24 transform translate-y-4">
                   {onOpenNewsstand && gameState === 'VICTORY' && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                   
                   <div className="flex flex-col items-center mb-4">
                       {gameState === 'VICTORY' ? (
                           <img src={VICTORY_HEADER_IMG} alt="Vittoria" className="h-40 md:h-56 w-auto object-contain mb-1 mt-4 transform translate-y-2 md:translate-y-4" />
                       ) : (
                           <img src={GAMEOVER_HEADER_IMG} alt="Game Over" className="h-40 md:h-56 w-auto object-contain mb-1" />
                       )}
                   </div>

                   <h3 className={`text-2xl md:text-3xl font-black mb-1 drop-shadow-sm uppercase ${gameState === 'VICTORY' ? 'text-purple-600' : 'text-red-600'}`}>
                       {gameState === 'VICTORY' ? 'INCREDIBILE!' : (gameOverReason === 'LIVES' ? 'HAI PERSO!' : 'TEMPO SCADUTO!')}
                   </h3>
                   
                   <p className="text-gray-600 font-bold mb-4 text-sm md:text-lg leading-tight">
                       {gameState === 'VICTORY' 
                          ? 'Hai completato tutti i livelli!' 
                          : (gameOverReason === 'LIVES' ? 'Troppi errori! Riprova con più calma.' : 'Purtroppo il tempo è finito!')}
                   </p>

                   {gameState === 'VICTORY' ? (
                       <div className="bg-yellow-400 text-black px-4 py-2 rounded-2xl font-black text-lg border-4 border-black mb-4 animate-pulse inline-block whitespace-nowrap shadow-lg transform rotate-[-2deg]">
                           +5 GETTONI! 🪙
                       </div>
                   ) : (
                       <div className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg font-bold text-xs mb-4 border-2 border-gray-200">
                           Premio: 0 gettoni <br/> (Arriva al liv. 20 senza finire le vite)
                       </div>
                   )}

                   <div className="flex flex-row gap-3 justify-center items-center mt-2 w-full">
                       <button onClick={() => startGame(difficulty!)} className="hover:scale-105 active:scale-95 transition-transform w-32 md:w-48 shrink-0"><img src={BTN_RETRY_IMG} alt="Riprova" className="w-full h-auto drop-shadow-xl" /></button>
                       <button onClick={returnToMenu} className="hover:scale-105 active:scale-95 transition-all outline-none flex-1 max-w-[100px] md:max-w-[125px]">
                           <img src={BTN_EXIT_GAME_IMG} alt="Menu" className="w-full h-auto drop-shadow-xl" />
                       </button>
                   </div>
               </div>
            )}
        </div>
    </div>
  );
};

export default OddOneOutGame;
