
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RotateCcw, LogOut, Music, Music2 } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import { isNightTime } from '../services/weatherService';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const BOO_POP_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/acchiappabooesce.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const TITLE_IMG = 'https://i.postimg.cc/02djnLBy/acchiam-(1).png';

const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/facilelogodsnaq.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediologjeidnuj4hedn.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/difficielrnfjn4edj.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp'; 
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

const WHACK_BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/colpisciboodaysun.webp';
const WHACK_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/colpisciboonights.webp';

const DEFEAT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/time-out.webp';
const VICTORY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/victory-hug.webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/suspense-in-the-wood-360052.mp3';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface WhackGhostProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const WhackGhostGame: React.FC<WhackGhostProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [now, setNow] = useState(new Date());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [ghostIndex, setGhostIndex] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0); 
  const [gameResult, setGameResult] = useState<'WIN' | 'LOSE' | null>(null);
  const [hitFeedback, setHitFeedback] = useState<{index: number, id: number} | null>(null);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const timerRef = useRef<any>(null);
  const ghostStayTimer = useRef<any>(null);
  const nextGhostTimer = useRef<any>(null);
  const isPlayingRef = useRef(false);
  const difficultyRef = useRef<Difficulty | null>(null);
  const bgMusic = useRef<HTMLAudioElement | null>(null);
  const ghostIndexRef = useRef<number | null>(null);

  const currentBg = useMemo(() => isNightTime(now) ? WHACK_BG_NIGHT : WHACK_BG_DAY, [now]);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);

      bgMusic.current = new Audio(BG_MUSIC_URL);
      bgMusic.current.loop = true;
      bgMusic.current.volume = 0.4;

      const timeTimer = setInterval(() => setNow(new Date()), 60000);

      return () => {
          clearInterval(timeTimer);
          if (bgMusic.current) {
              bgMusic.current.pause();
              bgMusic.current = null;
          }
      };
  }, []);

  useEffect(() => {
      if (bgMusic.current) {
          if (musicEnabled && isPlaying && !gameResult) {
              bgMusic.current.play().catch(() => {});
          } else {
              bgMusic.current.pause();
          }
      }
  }, [musicEnabled, isPlaying, gameResult]);

  useEffect(() => { isPlayingRef.current = isPlaying; difficultyRef.current = difficulty; }, [isPlaying, difficulty]);
  useEffect(() => { if (showUnlockModal) { const p = getProgress(); setUserTokens(p.tokens); } }, [showUnlockModal]);

  const handleUnlockHard = () => { if (unlockHardMode()) { setIsHardUnlocked(true); const p = getProgress(); setUserTokens(p.tokens); setShowUnlockModal(false); startGame('HARD', true); } };
  const handleOpenNewsstand = () => { if (onOpenNewsstand) { onOpenNewsstand(); setShowUnlockModal(false); } };
  const clearAllTimers = () => { if (timerRef.current) clearInterval(timerRef.current); if (ghostStayTimer.current) clearTimeout(ghostStayTimer.current); if (nextGhostTimer.current) clearTimeout(nextGhostTimer.current); };

  const showGhost = useCallback(() => {
      if (!isPlayingRef.current) return;
      const nextIndex = Math.floor(Math.random() * 9);
      setGhostIndex(nextIndex);
      ghostIndexRef.current = nextIndex;
      let stayDuration = 1500; 
      if (difficultyRef.current === 'MEDIUM') stayDuration = 1000;
      if (difficultyRef.current === 'HARD') stayDuration = 600;
      ghostStayTimer.current = setTimeout(() => {
          if (!isPlayingRef.current) return;
          setGhostIndex(null); 
          ghostIndexRef.current = null;
          scheduleNextGhost(); 
      }, stayDuration);
  }, []);

  const scheduleNextGhost = useCallback(() => {
      if (!isPlayingRef.current) return;
      let minGap = 600, maxGap = 1000;
      if (difficultyRef.current === 'MEDIUM') { minGap = 400; maxGap = 800; }
      if (difficultyRef.current === 'HARD') { minGap = 200; maxGap = 500; }
      const gap = Math.random() * (maxGap - minGap) + minGap;
      nextGhostTimer.current = setTimeout(() => { showGhost(); }, gap);
  }, [showGhost]);

  const startGame = (selectedDifficulty: Difficulty, forceStart = false) => {
    if (selectedDifficulty === 'HARD' && !isHardUnlocked && !forceStart) { setShowUnlockModal(true); return; }
    clearAllTimers();
    setDifficulty(selectedDifficulty); difficultyRef.current = selectedDifficulty;
    setScore(0); setTimeLeft(60); setIsPlaying(true); isPlayingRef.current = true;
    setRewardGiven(false); setEarnedTokens(0); setGameResult(null); setGhostIndex(null); ghostIndexRef.current = null; setHitFeedback(null);
    scheduleNextGhost();
    timerRef.current = setInterval(() => {
        setTimeLeft((prev) => { if (prev <= 1) { endGame(); return 0; } return prev - 1; });
    }, 1000);
  };

  const endGame = () => {
      setIsPlaying(false); isPlayingRef.current = false; clearAllTimers(); setGhostIndex(null); ghostIndexRef.current = null;
      setScore(currentScore => {
          if (currentScore >= 25) {
              setGameResult('WIN');
              return currentScore; 
          } else { setGameResult('LOSE'); return currentScore; }
      });
  };

  useEffect(() => {
      if (gameResult === 'WIN' && !rewardGiven && onEarnTokens) {
          let reward = 5; if (difficulty === 'MEDIUM') reward = 10; if (difficulty === 'HARD') reward = 20;
          onEarnTokens(reward); setUserTokens(prev => prev + reward); setEarnedTokens(reward); setRewardGiven(true);
      }
  }, [gameResult, rewardGiven, onEarnTokens, difficulty]);

  const resetMenu = (e?: React.MouseEvent) => { 
      if (e) { 
          e.preventDefault(); 
          e.stopPropagation(); 
      }
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
      ghostIndexRef.current = null;
  };
  
  useEffect(() => { return () => clearAllTimers(); }, []);
  
  const handleHoleTouch = (index: number) => { 
    if (!isPlaying) return; 
    if (index === ghostIndexRef.current) { 
        setScore((prev) => prev + 1); 
        const feedbackId = Date.now();
        setHitFeedback({ index, id: feedbackId }); 
        
        setTimeout(() => {
            setHitFeedback(prev => (prev?.id === feedbackId ? null : prev));
        }, 800);

        setGhostIndex(null); 
        ghostIndexRef.current = null;
        if (ghostStayTimer.current) clearTimeout(ghostStayTimer.current); 
        scheduleNextGhost(); 
    } 
  };

  const wrapperStyle = "fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={wrapperStyle}>
        <style>{`
            /* Effetto Sticker Cartoon */
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

      <img 
          src={currentBg} 
          alt="" 
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" 
          draggable={false}
      />

      <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
          <div className="pointer-events-auto">
              {difficulty ? (
                <button onClick={resetMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none">
                  <img src={BTN_BACK_MENU_IMG} alt="Menu" className="h-12 w-auto drop-shadow-md" />
                </button>
              ) : (
                <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer outline-none">
                  <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto drop-shadow-md" />
                </button>
              )}
          </div>

          <div className="pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                  <span>{userTokens}</span> <span className="text-xl">🪙</span>
              </div>
          </div>
      </div>

      {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}

      <div className="absolute top-[130px] md:top-[170px] right-4 z-[300] flex flex-col items-end gap-3 pointer-events-none">
          <button 
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
              title={musicEnabled ? "Spegni Musica" : "Accendi Musica"}
          >
              <img src={AUDIO_ICON_IMG} alt="Audio" className="w-14 h-14 md:w-20 h-auto drop-shadow-xl" />
          </button>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-52 md:pt-64 p-4">
          {!isPlaying && !gameResult && (
              <div className="flex flex-col items-center animate-in fade-in z-20 w-full px-4">
                
                <div className="mb-10 w-full text-center">
                    <p 
                        className="font-luckiest text-white text-xl md:text-4xl whitespace-nowrap drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] uppercase tracking-wide" 
                        style={{ WebkitTextStroke: '1.5px black' }}
                    >
                        Colpisci almeno <span className="text-yellow-400">25 Boo</span> in 1 minuto!
                    </p>
                </div>

                <div className="flex flex-col gap-4 items-center w-full max-w-[200px] md:max-w-[280px]">
                    <button onClick={() => startGame('EASY')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent">
                        <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto" />
                    </button>
                    <button onClick={() => startGame('MEDIUM')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent" style={{ animationDelay: '0.5s' }}>
                        <img src={BTN_MEDIUM_IMG} alt="Medio" className="w-full h-auto" />
                    </button>
                    <div className="relative sticker-btn animate-float-btn w-full" style={{ animationDelay: '1s' }}>
                        <button 
                            onClick={() => startGame('HARD')} 
                            className={`w-full outline-none border-none bg-transparent ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}
                        >
                            <img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto" />
                        </button>
                        {!isHardUnlocked && (
                            <div className="absolute right-[-15px] top-[-15px] pointer-events-none z-20">
                                <img src={LOCK_IMG} alt="Bloccato" className="w-12 h-12 drop-shadow-lg rotate-12" />
                            </div>
                        )}
                    </div>
                </div>
              </div>
          )}
          {isPlaying && (
              <div className="w-full max-w-lg flex flex-col items-center animate-in fade-in z-20">
                  <div className="flex justify-between w-full -mb-6 md:-mb-8 px-6 relative z-30">
                      <div className="bg-yellow-400 border-2 border-black rounded-xl px-2 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transform -rotate-2 flex items-center gap-2">
                          <span className="text-xl md:text-2xl filter drop-shadow-sm">👻</span>
                          <div className="flex flex-col items-start leading-none">
                              <span className="text-[8px] font-black uppercase text-yellow-800 tracking-wider">PRESI</span>
                              <span className="text-2xl md:text-3xl font-black text-black">{score}</span>
                          </div>
                      </div>
                      <div className={`border-2 border-black rounded-xl px-2 py-1 shadow-[4px_4px_0_bold_rgba(0,0,0,0.3)] transform rotate-2 flex items-center gap-2 transition-colors duration-300 ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-black'}`}>
                          <div className="flex flex-col items-end leading-none">
                              <span className={`text-[8px] font-black uppercase tracking-wider ${timeLeft <= 10 ? 'text-red-200' : 'text-gray-400'}`}>TEMPO</span>
                              <span className="text-2xl md:text-3xl font-black">{timeLeft}</span>
                          </div>
                          <span className="text-xl md:text-2xl">⏰</span>
                      </div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md p-4 md:p-6 pt-10 md:pt-12 rounded-[40px] border-4 border-white/30 shadow-2xl w-full aspect-square flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-[10%] left-[5%] w-32 h-16 bg-amber-900/15 rounded-[100%] blur-md transform rotate-12"></div>
                        <div className="absolute bottom-[20%] right-[10%] w-40 h-20 bg-amber-950/20 rounded-[100%] blur-lg transform -rotate-6"></div>
                        <span className="absolute top-[2%] left-[10%] text-2xl opacity-40">🌱</span>
                        <span className="absolute top-[15%] right-[15%] text-xl opacity-30">🌿</span>
                        <span className="absolute bottom-[10%] right-[30%] text-2xl opacity-45">🌿</span>
                        <span className="absolute bottom-[15%] left-[75%] text-2xl opacity-40">🌱</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 w-full aspect-square relative z-10">
                            {Array(9).fill(null).map((_, idx) => (
                            <div 
                                key={idx} 
                                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleHoleTouch(idx); }} 
                                className="relative overflow-hidden cursor-pointer active:scale-95 transition-transform touch-none select-none aspect-square group" 
                                style={{ touchAction: 'none' }}
                            >
                                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[98%] h-[52%] bg-stone-900 rounded-[100%] shadow-[inset_0_10px_20px_rgba(0,0,0,1)] border-t-2 border-stone-800/50 pointer-events-none group-active:brightness-110"></div>
                                <div 
                                    className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none transition-transform duration-100 ease-out will-change-transform z-10" 
                                    style={{ transform: ghostIndex === idx ? 'translateY(-15%) scale(1.3)' : 'translateY(100%) scale(0.5)' }}
                                >
                                    <img src={BOO_POP_IMG} alt="Ghost" className="w-[85%] h-auto object-contain drop-shadow-2xl" draggable={false} />
                                </div>
                                {hitFeedback && hitFeedback.index === idx && (
                                    <div key={hitFeedback.id} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-float-up">
                                        <span className="text-yellow-400 font-black text-5xl drop-shadow-[2px_2px_0_black] stroke-black stroke-2">+1</span>
                                    </div>
                                )}
                            </div>
                            ))}
                    </div>
                  </div>
              </div>
          )}
          {!isPlaying && gameResult && (
                <div className="bg-white p-5 md:p-6 rounded-[40px] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] w-full max-w-[340px] text-center animate-in zoom-in relative z-20 overflow-hidden">
                        {gameResult === 'WIN' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                        
                        <div className="mb-2 flex flex-col items-center">
                            {gameResult === 'WIN' ? (
                                <img src={VICTORY_IMG} alt="Vittoria" className="h-36 md:h-48 w-auto object-contain" />
                            ) : (
                                <img src={DEFEAT_IMG} alt="Tempo Scaduto" className="h-44 md:h-56 w-auto object-contain" />
                            )}
                        </div>

                        {gameResult === 'WIN' && (
                            <h3 className="text-3xl md:text-4xl font-black mb-1 uppercase text-green-600">
                                Ottimo lavoro!
                            </h3>
                        )}

                        <p className="text-lg text-gray-600 font-bold mb-4">Hai preso <span className="text-2xl text-boo-purple font-black mx-1">{score}</span> fantasmi.<br/><span className="text-[10px] uppercase opacity-70">(Obiettivo: 25)</span></p>
                        {gameResult === 'WIN' && earnedTokens > 0 && <div className="bg-yellow-400 text-black px-5 py-2 rounded-2xl font-black text-lg border-4 border-black mb-6 animate-pulse shadow-lg transform rotate-[-2deg] inline-block">+{earnedTokens} GETTONI! 🪙</div>}
                        {gameResult === 'LOSE' && <div className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg font-bold text-xs mb-4 border-2 border-gray-200">Nessun gettone (Serve 25)</div>}
                        
                        <div className="flex flex-row gap-2 w-full justify-center items-center mt-2">
                            <button 
                                onClick={() => startGame(difficulty!)} 
                                className="w-40 md:w-56 hover:scale-105 active:scale-95 transition-transform outline-none"
                            >
                                <img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" />
                            </button>
                        </div>
                </div>
          )}
      </div>
    </div>
  );
};

export default WhackGhostGame;
