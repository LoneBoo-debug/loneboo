
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LogOut, Lock, Play, RotateCcw } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

// NEW IMAGE ASSET
const BOO_POP_IMG = 'https://i.postimg.cc/Sx2DkBZ5/acchiappabooesce.png';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface WhackGhostProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const WhackGhostGame: React.FC<WhackGhostProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // INCREASED TO 60s
  const [isPlaying, setIsPlaying] = useState(false);
  const [ghostIndex, setGhostIndex] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0); 
  const [gameResult, setGameResult] = useState<'WIN' | 'LOSE' | null>(null);
  
  // Hit feedback state
  const [hitFeedback, setHitFeedback] = useState<{index: number, id: number} | null>(null);

  // Lock State
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Refs for Game Loop Stability
  const timerRef = useRef<any>(null);      // Game Countdown
  const ghostStayTimer = useRef<any>(null); // How long ghost stays up
  const nextGhostTimer = useRef<any>(null); // Delay between ghosts
  
  // Refs to access current state inside callbacks without dependencies
  const isPlayingRef = useRef(false);
  const difficultyRef = useRef<Difficulty | null>(null);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  // Sync refs with state
  useEffect(() => {
      isPlayingRef.current = isPlaying;
      difficultyRef.current = difficulty;
  }, [isPlaying, difficulty]);

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
          startGame('HARD', true);
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  // --- GAME LOOP LOGIC (ROBUST VERSION) ---

  const clearAllTimers = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (ghostStayTimer.current) clearTimeout(ghostStayTimer.current);
      if (nextGhostTimer.current) clearTimeout(nextGhostTimer.current);
  };

  const showGhost = useCallback(() => {
      if (!isPlayingRef.current) return;

      // 1. Pick a random hole
      const nextIndex = Math.floor(Math.random() * 9);
      setGhostIndex(nextIndex);

      // 2. Determine how long it stays visible (Difficulty based)
      let stayDuration = 1500; // Easy
      if (difficultyRef.current === 'MEDIUM') stayDuration = 1000;
      if (difficultyRef.current === 'HARD') stayDuration = 600;

      // 3. Schedule disappearance (Missed)
      ghostStayTimer.current = setTimeout(() => {
          if (!isPlayingRef.current) return;
          setGhostIndex(null); // Hide
          scheduleNextGhost(); // Plan next appearance
      }, stayDuration);

  }, []);

  const scheduleNextGhost = useCallback(() => {
      if (!isPlayingRef.current) return;

      // Random gap between ghosts to make it less predictable
      // Easy: 600-1000ms, Hard: 200-500ms
      let minGap = 600, maxGap = 1000;
      if (difficultyRef.current === 'MEDIUM') { minGap = 400; maxGap = 800; }
      if (difficultyRef.current === 'HARD') { minGap = 200; maxGap = 500; }

      const gap = Math.random() * (maxGap - minGap) + minGap;

      nextGhostTimer.current = setTimeout(() => {
          showGhost();
      }, gap);
  }, [showGhost]);

  // --- START / STOP ---

  const startGame = (selectedDifficulty: Difficulty, forceStart = false) => {
    if (selectedDifficulty === 'HARD' && !isHardUnlocked && !forceStart) {
        setShowUnlockModal(true);
        return;
    }
    clearAllTimers();
    
    setDifficulty(selectedDifficulty);
    difficultyRef.current = selectedDifficulty;
    
    setScore(0);
    setTimeLeft(60); // 60 Seconds
    setIsPlaying(true);
    isPlayingRef.current = true;
    
    setRewardGiven(false);
    setEarnedTokens(0);
    setGameResult(null);
    setGhostIndex(null);
    setHitFeedback(null);

    // Start Loops
    scheduleNextGhost();

    // Start Game Timer
    timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame(); // End naturally
            return 0;
          }
          return prev - 1;
        });
    }, 1000);
  };

  const endGame = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      clearAllTimers();
      setGhostIndex(null);

      // --- WIN LOGIC ---
      // Goal: 25 hits in 60s
      setScore(currentScore => {
          if (currentScore >= 25) {
              setGameResult('WIN');
              // Calculate reward
              let reward = 5; 
              if (difficultyRef.current === 'MEDIUM') reward = 10;
              if (difficultyRef.current === 'HARD') reward = 20; // Harder = More reward
              
              // We need to trigger this effect outside or use a ref because state update is async
              // But here we are inside a closure.
              // Let's rely on a useEffect to trigger the callback based on gameResult change
              return currentScore; 
          } else {
              setGameResult('LOSE');
              return currentScore;
          }
      });
  };

  // Effect to handle reward issuing when gameResult changes to WIN
  useEffect(() => {
      if (gameResult === 'WIN' && !rewardGiven && onEarnTokens) {
          let reward = 5; 
          if (difficulty === 'MEDIUM') reward = 10;
          if (difficulty === 'HARD') reward = 20;
          
          onEarnTokens(reward);
          setEarnedTokens(reward);
          setRewardGiven(true);
      }
  }, [gameResult, rewardGiven, onEarnTokens, difficulty]);

  const resetMenu = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      clearAllTimers();
      setDifficulty(null);
      setTimeLeft(60);
      setScore(0);
      setRewardGiven(false);
      setEarnedTokens(0);
      setGameResult(null);
      setHitFeedback(null);
  };

  // Cleanup on unmount
  useEffect(() => {
      return () => clearAllTimers();
  }, []);

  // --- INTERACTION ---

  const handleHoleTouch = (index: number) => {
    if (!isPlaying) return;

    if (index === ghostIndex) {
      // HIT!
      setScore((prev) => prev + 1);
      setHitFeedback({ index, id: Date.now() }); // +1 Animation
      setGhostIndex(null); // Hide immediately
      
      // Cancel the "stay" timer because we hit it
      if (ghostStayTimer.current) clearTimeout(ghostStayTimer.current);
      
      // Immediately schedule next one (faster pace when hitting)
      scheduleNextGhost();
    } 
    // If missed (wrong hole), DO NOTHING. 
    // Do not penalize, do not reset timers. Just ignore.
    // This prevents the "crazy loop" bug.
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in pb-4 w-full">
      <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-4 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>
          Acchiappa Boo
      </h2>

      {/* Changed bg-white to green garden theme */}
      <div className="bg-[#86efac] p-4 rounded-[30px] border-4 border-[#14532d] shadow-[8px_8px_0px_0px_#14532d] w-full max-w-lg relative overflow-hidden flex flex-col gap-4">
        
        {/* --- HEADER STATS --- */}
        <div className="flex justify-between items-center font-black text-xl px-2">
          <div className="flex flex-col items-start bg-white/90 px-3 py-1 rounded-xl border-2 border-green-700 shadow-sm">
            <span className="text-[10px] text-green-800 font-bold uppercase tracking-widest leading-none mb-1">PUNTI</span>
            <span className="text-2xl text-green-900 leading-none">{score}</span>
          </div>
          
          <div className={`flex flex-col items-end px-3 py-1 rounded-xl border-2 transition-colors duration-300 shadow-sm ${timeLeft <= 10 ? 'bg-red-50 border-red-500' : 'bg-white/90 border-green-700'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1 text-gray-500">TEMPO</span>
            <span className={`text-2xl leading-none transition-colors duration-300 ${timeLeft <= 10 ? 'text-red-600 animate-pulse scale-110' : 'text-green-900'}`}>
                {timeLeft}s
            </span>
          </div>
        </div>

        {/* --- GAME CONTENT --- */}
        
        {/* 1. MENU SELECTION */}
        {!isPlaying && !gameResult && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6 animate-in fade-in bg-white/40 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
            {showUnlockModal && (
                  <UnlockModal 
                      onClose={() => setShowUnlockModal(false)}
                      onUnlock={handleUnlockHard}
                      onOpenNewsstand={handleOpenNewsstand}
                      currentTokens={userTokens}
                  />
            )}

            <p className="text-lg font-black text-green-900 mb-2 drop-shadow-sm">SCEGLI LA VELOCITÀ:</p>
            
            <button 
                onClick={() => startGame('EASY')}
                className="w-[90%] bg-green-500 text-white font-black text-xl py-3 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2"
            >
                LENTO 🐢
            </button>

            <button 
                onClick={() => startGame('MEDIUM')}
                className="w-[90%] bg-yellow-400 text-black font-black text-xl py-3 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2"
            >
                MEDIO 🐇
            </button>
            
            <button 
                onClick={() => startGame('HARD')}
                className={`w-[90%] text-white font-black text-xl py-3 rounded-2xl border-4 border-black transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2 ${isHardUnlocked ? 'bg-red-500 hover:scale-105' : 'bg-gray-400 hover:scale-[1.02] cursor-pointer'}`}
            >
                {isHardUnlocked ? 'VELOCE ⚡' : <><Lock size={20}/> BLOCCATO</>}
            </button>

            <p className="text-xs text-green-900 font-bold mt-2 max-w-xs text-center leading-tight">
                Regola: Acchiappa almeno <span className="text-red-600 text-sm">25 Boo</span> in 1 minuto per vincere gettoni!
            </p>
          </div>
        )}

        {/* 2. GAME OVER / WIN SCREEN */}
        {!isPlaying && gameResult && (
             <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in py-4 bg-white/90 rounded-2xl border-4 border-white shadow-xl relative">
                
                {/* SAVE REMINDER */}
                {gameResult === 'WIN' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

                <div className="text-6xl mb-2 animate-bounce">
                    {gameResult === 'WIN' ? '🏆' : '⏰'}
                </div>
                <h3 className={`text-3xl font-black mb-2 ${gameResult === 'WIN' ? 'text-green-600' : 'text-gray-800'}`}>
                    {gameResult === 'WIN' ? 'VITTORIA!' : 'TEMPO SCADUTO!'}
                </h3>
                
                <p className="text-lg text-gray-600 font-bold mb-4">
                    Hai preso <span className="text-2xl text-boo-purple font-black mx-1">{score}</span> fantasmi.
                    <br/>
                    <span className="text-sm opacity-70">(Obiettivo: 25)</span>
                </p>
                
                {gameResult === 'WIN' && earnedTokens > 0 && (
                    <div className="bg-yellow-400 text-black px-6 py-2 rounded-xl font-black text-lg border-4 border-black mb-6 animate-pulse shadow-lg transform rotate-[-2deg]">
                        +{earnedTokens} GETTONI! 🪙
                    </div>
                )}

                {gameResult === 'LOSE' && (
                    <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-bold text-sm mb-6 border-2 border-gray-200">
                        Nessun gettone (Serve punteggio 25)
                    </div>
                )}

                <div className="flex flex-col gap-2 w-[90%]">
                    <button 
                        onClick={resetMenu}
                        className="bg-boo-green text-white font-black text-lg px-8 py-3 rounded-full border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={20} /> GIOCA ANCORA
                    </button>
                    <button 
                        onClick={onBack}
                        className="bg-red-500 text-white font-black text-lg px-8 py-3 rounded-full border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} /> ESCI
                    </button>
                </div>
            </div>
        )}

        {/* 3. ACTIVE GAME GRID (THE GARDEN) */}
        {isPlaying && (
          <div className="flex-1 w-full">
              <div className="grid grid-cols-3 gap-3 md:gap-4 w-full aspect-square">
                {Array(9).fill(null).map((_, idx) => (
                  <div 
                    key={idx} 
                    // Use onPointerDown for instant response (mouse + touch)
                    onPointerDown={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation();
                        handleHoleTouch(idx); 
                    }}
                    // GARDEN STYLE: Green Grass Tiles
                    className="relative bg-green-600 rounded-2xl border-4 border-green-800 overflow-hidden cursor-pointer active:scale-95 transition-transform touch-none select-none aspect-square shadow-inner"
                    style={{ touchAction: 'manipulation' }}
                  >
                    {/* Hole Graphic (Dark Earth) - MOVED DOWN to 60% top to allow head space */}
                    <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[55%] bg-[#3f2e05] rounded-full opacity-90 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] pointer-events-none"></div>
                    
                    {/* Ghost Character - Animated from Hole */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none transition-transform duration-100 ease-out will-change-transform"
                        style={{
                            // RAISED HIGHER (-35%) to be clearly visible
                            transform: ghostIndex === idx ? 'translateY(-35%) scale(1.3)' : 'translateY(100%) scale(0.5)'
                        }}
                    >
                         <img 
                            src={BOO_POP_IMG} 
                            alt="Ghost" 
                            className="w-[85%] h-auto object-contain drop-shadow-xl"
                            draggable={false}
                         />
                    </div>

                    {/* HIT FEEDBACK (+1) */}
                    {hitFeedback && hitFeedback.index === idx && (
                        <div key={hitFeedback.id} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-float-up">
                            <span className="text-yellow-400 font-black text-4xl drop-shadow-[2px_2px_0_black] stroke-black stroke-2">+1</span>
                        </div>
                    )}
                  </div>
                ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhackGhostGame;
