
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const BOO_POP_IMG = 'https://i.postimg.cc/Sx2DkBZ5/acchiappabooesce.png';
const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';
const TITLE_IMG = 'https://i.postimg.cc/02djnLBy/acchiam-(1).png';
const BTN_EASY_IMG = 'https://i.postimg.cc/MpVqCtbx/facile.png';
const BTN_MEDIUM_IMG = 'https://i.postimg.cc/3x5HFmMp/intermedio.png';
const BTN_HARD_IMG = 'https://i.postimg.cc/tRsTr3f4/difficile.png';
const LOCK_IMG = 'https://i.postimg.cc/3Nz0wMj1/lucchetto.png'; // New Lock Image
const WHACK_BG = 'https://i.postimg.cc/N0z5cXgJ/sfondoacchiappaboo.jpg';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface WhackGhostProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const WhackGhostGame: React.FC<WhackGhostProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
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
  const timerRef = useRef<any>(null);
  const ghostStayTimer = useRef<any>(null);
  const nextGhostTimer = useRef<any>(null);
  const isPlayingRef = useRef(false);
  const difficultyRef = useRef<Difficulty | null>(null);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  useEffect(() => { isPlayingRef.current = isPlaying; difficultyRef.current = difficulty; }, [isPlaying, difficulty]);
  useEffect(() => { if (showUnlockModal) { const p = getProgress(); setUserTokens(p.tokens); } }, [showUnlockModal]);

  const handleUnlockHard = () => { if (unlockHardMode()) { setIsHardUnlocked(true); const p = getProgress(); setUserTokens(p.tokens); setShowUnlockModal(false); startGame('HARD', true); } };
  const handleOpenNewsstand = () => { if (onOpenNewsstand) { onOpenNewsstand(); setShowUnlockModal(false); } };
  const clearAllTimers = () => { if (timerRef.current) clearInterval(timerRef.current); if (ghostStayTimer.current) clearTimeout(ghostStayTimer.current); if (nextGhostTimer.current) clearTimeout(nextGhostTimer.current); };

  const showGhost = useCallback(() => {
      if (!isPlayingRef.current) return;
      const nextIndex = Math.floor(Math.random() * 9);
      setGhostIndex(nextIndex);
      let stayDuration = 1500; 
      if (difficultyRef.current === 'MEDIUM') stayDuration = 1000;
      if (difficultyRef.current === 'HARD') stayDuration = 600;
      ghostStayTimer.current = setTimeout(() => {
          if (!isPlayingRef.current) return;
          setGhostIndex(null); 
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
    setRewardGiven(false); setEarnedTokens(0); setGameResult(null); setGhostIndex(null); setHitFeedback(null);
    scheduleNextGhost();
    timerRef.current = setInterval(() => {
        setTimeLeft((prev) => { if (prev <= 1) { endGame(); return 0; } return prev - 1; });
    }, 1000);
  };

  const endGame = () => {
      setIsPlaying(false); isPlayingRef.current = false; clearAllTimers(); setGhostIndex(null);
      setScore(currentScore => {
          if (currentScore >= 25) {
              setGameResult('WIN');
              let reward = 5; if (difficultyRef.current === 'MEDIUM') reward = 10; if (difficultyRef.current === 'HARD') reward = 20; 
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

  const resetMenu = () => { setIsPlaying(false); isPlayingRef.current = false; clearAllTimers(); setDifficulty(null); setTimeLeft(60); setScore(0); setRewardGiven(false); setEarnedTokens(0); setGameResult(null); setHitFeedback(null); };
  useEffect(() => { return () => clearAllTimers(); }, []);
  const handleHoleTouch = (index: number) => { if (!isPlaying) return; if (index === ghostIndex) { setScore((prev) => prev + 1); setHitFeedback({ index, id: Date.now() }); setGhostIndex(null); if (ghostStayTimer.current) clearTimeout(ghostStayTimer.current); scheduleNextGhost(); } };

  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

  return (
    <div className={wrapperStyle} style={{ backgroundImage: `url(${WHACK_BG})` }}>
      {/* Modal moved to root to ensure high Z-Index stacking */}
      {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}

      <div className="absolute top-4 left-4 z-50">
          {isPlaying || gameResult ? (
              <button onClick={resetMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"><img src={BTN_BACK_MENU_IMG} alt="Menu" className="h-12 w-auto drop-shadow-md" /></button>
          ) : (
              <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"><img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto drop-shadow-md" /></button>
          )}
      </div>
      <div className="absolute top-4 right-4 z-50 pointer-events-none"><div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg"><span>{userTokens}</span> <span className="text-xl">🪙</span></div></div>

      <div className="w-full h-full flex flex-col items-center justify-center p-4">
          {(!isPlaying && !gameResult) && (<img src={TITLE_IMG} alt="Acchiappa Boo" className="w-64 md:w-96 h-auto mb-4 mt-12 relative z-10 hover:scale-105 transition-transform duration-300 animate-in fade-in slide-in-from-top-4" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />)}
          {!isPlaying && !gameResult && (
              <div className="flex flex-col items-center gap-4 animate-in fade-in z-20">
                <h3 className="text-3xl md:text-4xl font-cartoon text-white tracking-wider mb-2" style={{ textShadow: '2px 2px 0px black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black' }}>SCEGLI LA VELOCITÀ</h3>
                <button onClick={() => startGame('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-xl" /></button>
                <button onClick={() => startGame('MEDIUM')} className="hover:scale-105 active:scale-95 transition-transform w-48"><img src={BTN_MEDIUM_IMG} alt="Medio" className="w-full h-auto drop-shadow-xl" /></button>
                <div className="relative hover:scale-105 active:scale-95 transition-transform w-48">
                    <button onClick={() => startGame('HARD')} className={`w-full ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}><img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-xl" /></button>
                    {!isHardUnlocked && (
                        <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                            <img src={LOCK_IMG} alt="Bloccato" className="w-12 h-12 drop-shadow-lg rotate-12" />
                        </div>
                    )}
                </div>
                <p className="text-lg md:text-xl text-white font-black mt-4 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: "2px 2px 0 black" }}>Acchiappa almeno <span className="text-yellow-300">25 Boo</span> in 1 minuto!</p>
              </div>
          )}
          {isPlaying && (
              <div className="w-full max-w-lg flex flex-col items-center animate-in fade-in z-20">
                  <div className="flex justify-between w-full mb-6 px-2">
                      <div className="bg-yellow-400 border-4 border-black rounded-2xl px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transform -rotate-2 flex items-center gap-3"><span className="text-3xl filter drop-shadow-sm">👻</span><div className="flex flex-col items-start leading-none"><span className="text-[10px] font-black uppercase text-yellow-800 tracking-wider">PRESI</span><span className="text-4xl font-black text-black">{score}</span></div></div>
                      <div className={`border-4 border-black rounded-2xl px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transform rotate-2 flex items-center gap-3 transition-colors duration-300 ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-black'}`}><div className="flex flex-col items-end leading-none"><span className={`text-[10px] font-black uppercase tracking-wider ${timeLeft <= 10 ? 'text-red-200' : 'text-gray-400'}`}>TEMPO</span><span className="text-4xl font-black">{timeLeft}</span></div><span className="text-3xl">⏰</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 w-full aspect-square">
                        {Array(9).fill(null).map((_, idx) => (
                          <div key={idx} onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); handleHoleTouch(idx); }} className="relative bg-green-600 rounded-[2rem] border-4 border-green-800 overflow-hidden cursor-pointer active:scale-95 transition-transform touch-none select-none aspect-square shadow-[0_6px_0_#14532d]" style={{ touchAction: 'manipulation' }}>
                            <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[55%] bg-[#3f2e05] rounded-full opacity-90 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none transition-transform duration-100 ease-out will-change-transform" style={{ transform: ghostIndex === idx ? 'translateY(-25%) scale(1.3)' : 'translateY(100%) scale(0.5)' }}><img src={BOO_POP_IMG} alt="Ghost" className="w-[90%] h-auto object-contain drop-shadow-xl" draggable={false} /></div>
                            {hitFeedback && hitFeedback.index === idx && <div key={hitFeedback.id} className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-float-up"><span className="text-yellow-400 font-black text-5xl drop-shadow-[2px_2px_0_black] stroke-black stroke-2">+1</span></div>}
                          </div>
                        ))}
                  </div>
              </div>
          )}
          {!isPlaying && gameResult && (
                <div className="bg-white p-6 rounded-[40px] border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] w-full max-w-md text-center animate-in zoom-in relative z-20">
                        {gameResult === 'WIN' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                        <div className="text-7xl mb-4 animate-bounce">{gameResult === 'WIN' ? '🏆' : '⏰'}</div>
                        <h3 className={`text-4xl font-black mb-2 ${gameResult === 'WIN' ? 'text-green-600' : 'text-gray-800'}`}>{gameResult === 'WIN' ? 'VITTORIA!' : 'TEMPO SCADUTO!'}</h3>
                        <p className="text-xl text-gray-600 font-bold mb-6">Hai preso <span className="text-3xl text-boo-purple font-black mx-1">{score}</span> fantasmi.<br/><span className="text-sm opacity-70">(Obiettivo: 25)</span></p>
                        {gameResult === 'WIN' && earnedTokens > 0 && <div className="bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xl border-4 border-black mb-8 animate-pulse shadow-lg transform rotate-[-2deg] inline-block">+{earnedTokens} GETTONI! 🪙</div>}
                        {gameResult === 'LOSE' && <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-bold text-sm mb-6 border-2 border-gray-200">Nessun gettone (Serve punteggio 25)</div>}
                        <button onClick={resetMenu} className="w-full bg-boo-green text-white font-black text-xl px-8 py-4 rounded-full border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-2 mb-2"><RotateCcw size={24} /> GIOCA ANCORA</button>
                </div>
          )}
      </div>
    </div>
  );
};

export default WhackGhostGame;
