
import React, { useState, useEffect, useRef } from 'react';
import { SOCIALS } from '../constants';
import { RotateCcw, CircleCheck, CircleX, ArrowLeft } from 'lucide-react';
import { QuizQuestion } from '../types';
import { getProgress, unlockHardMode } from '../services/tokens';
// Importiamo dal nuovo database dedicato
import { QUIZ_EASY, QUIZ_MEDIUM, QUIZ_HARD } from '../services/quizDatabase';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const NEW_HEADER_LOGO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/header-quiz.webp';
const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/facilelogodsnaq.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediologjeidnuj4hedn.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/difficielrnfjn4edj.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const QUIZ_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quiz-bg.webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const BTN_EXIT_GAME_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const DEFEAT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quiz-defeat.webp';
const VICTORY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quiz-victory.webp';
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/comedy-funny-cartoon-music-426784.mp3';
const MUSIC_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/kghjgsoundsino.webp';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface QuizGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameQuestions, setGameQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  // Gestione Musica di Sottofondo
  useEffect(() => {
    if (difficulty) {
        if (!audioRef.current) {
            audioRef.current = new Audio(BG_MUSIC_URL);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.4;
        }
        if (musicEnabled) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        } else {
            audioRef.current.pause();
        }
    } else {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };
  }, [difficulty, musicEnabled]);

  useEffect(() => { if (showUnlockModal || rewardGiven) { const p = getProgress(); setUserTokens(p.tokens); } }, [showUnlockModal, rewardGiven]);

  const handleUnlockSuccess = () => { if (unlockHardMode()) { setIsHardUnlocked(true); const p = getProgress(); setUserTokens(p.tokens); setShowUnlockModal(false); initGame('HARD', true); } };
  const handleOpenNewsstand = () => { if (onOpenNewsstand) { onOpenNewsstand(); setShowUnlockModal(false); } };
  
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initGame = (selectedDiff: Difficulty, forceStart = false) => {
      if (selectedDiff === 'HARD' && !isHardUnlocked && !forceStart) { setShowUnlockModal(true); return; }
      setDifficulty(selectedDiff);
      
      let sourceQuestions: QuizQuestion[] = [];
      if (selectedDiff === 'EASY') sourceQuestions = QUIZ_EASY;
      else if (selectedDiff === 'MEDIUM') sourceQuestions = QUIZ_MEDIUM;
      else sourceQuestions = QUIZ_HARD;

      const shuffledSource = shuffleArray(sourceQuestions);
      const finalSelection = shuffledSource.slice(0, 10).map(q => {
          const correctText = q.options[q.correctAnswer];
          const shuffledOptions = shuffleArray(q.options);
          const newCorrectIndex = shuffledOptions.indexOf(correctText);
          
          return {
              ...q,
              options: shuffledOptions,
              correctAnswer: newCorrectIndex
          };
      });
      
      setGameQuestions(finalSelection);
      setCurrentQuestionIndex(0); 
      setScore(0); 
      setShowScore(false); 
      setIsAnswered(false); 
      setSelectedOption(null); 
      setRewardGiven(false); 
      setEarnedTokens(0);
  };

  const resetToMenu = () => { setDifficulty(null); setGameQuestions([]); setScore(0); setShowScore(false); };
  const currentQuestion = gameQuestions[currentQuestionIndex];

  const handleAnswerClick = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex); setIsAnswered(true);
    if (currentQuestion && optionIndex === currentQuestion.correctAnswer) { setScore(s => s + 1); }
    setTimeout(() => {
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < gameQuestions.length) { 
            setCurrentQuestionIndex(nextQuestion); 
            setIsAnswered(false); 
            setSelectedOption(null); 
        } 
        else { setShowScore(true); }
    }, 2000);
  };

  useEffect(() => {
      if (showScore && !rewardGiven && onEarnTokens) {
          const totalQs = gameQuestions.length;
          let reward = 0;
          if (score === totalQs) {
              if (difficulty === 'EASY') reward = 5; else if (difficulty === 'MEDIUM') reward = 10; else if (difficulty === 'HARD') reward = 15;
          } else if (score >= totalQs / 2) { reward = 2; }
          if (reward > 0) { onEarnTokens(reward); setUserTokens(prev => prev + reward); }
          setEarnedTokens(reward); setRewardGiven(true);
      }
  }, [showScore, rewardGiven, score, gameQuestions.length, onEarnTokens, difficulty]);

  const getResultContent = () => {
      const totalQs = gameQuestions.length;
      const percentage = (score / totalQs) * 100;
      if (percentage === 100) return { image: VICTORY_IMG, title: "INCREDIBILE!", message: "Hai risposto correttamente a TUTTE le domande! Sei un vero fenomeno!", color: "text-purple-600", showYt: false };
      else if (percentage >= 80) return { image: VICTORY_IMG, title: "SEI UN GENIO!", message: "Wow! Hai risposto benissimo a quasi tutte le domande!", color: "text-green-500", showYt: false };
      else if (percentage >= 50) return { image: VICTORY_IMG, title: "BRAVISSIMO!", message: "Hai fatto un buon punteggio!", color: "text-yellow-500", showYt: true };
      else return { image: DEFEAT_IMG, title: "PUOI FARE DI PIÙ!", message: "Non ti preoccupare, sbagliando si impara!", color: "text-red-500", showYt: true };
  };

  const wrapperStyle = "fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

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

        {/* SFONDO A TUTTO SCHERMO */}
        <img 
            src={QUIZ_BG} 
            alt="" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" 
            draggable={false}
        />

        {/* TESTATA SUPERIORE FISSA */}
        <div className="absolute top-[80px] md:top-[115px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
            <div className="pointer-events-auto">
                {difficulty ? (
                    <button onClick={resetToMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                        <img src={BTN_BACK_MENU_IMG} alt="Menu" className="h-12 w-auto drop-shadow-md" />
                    </button>
                ) : (
                    <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                        <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" />
                    </button>
                )}
            </div>

            <div className={`flex-1 flex justify-center px-4 transition-transform duration-500 ${!difficulty ? '-translate-x-6 md:-translate-x-12' : (showScore ? '' : '-translate-x-1 md:-translate-x-2')}`}>
                <img src={NEW_HEADER_LOGO} alt="Quiz" className="h-12 md:h-24 w-auto object-contain drop-shadow-xl pointer-events-none" />
            </div>

            <div className="pointer-events-auto">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg">
                    <span>{userTokens}</span> <span className="text-xl">🪙</span>
                </div>
            </div>
        </div>

        {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockSuccess} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
        
        {/* AREA CONTENUTO */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-4 pt-44 md:pt-56">
            {!difficulty ? (
                <div className="flex flex-col items-center w-full animate-fade-in px-4 mt-10 md:mt-20">
                    <div className="flex flex-col gap-4 items-center w-full max-w-[220px] md:max-w-[280px]">
                        <button onClick={() => initGame('EASY')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent">
                            <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-xl" />
                        </button>
                        <button onClick={() => initGame('MEDIUM')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent" style={{ animationDelay: '0.5s' }}>
                            <img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto drop-shadow-xl" />
                        </button>
                        <div className="relative sticker-btn animate-float-btn w-full" style={{ animationDelay: '1s' }}>
                            <button onClick={() => initGame('HARD')} className={`w-full outline-none border-none bg-transparent ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}>
                                <img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-xl" />
                            </button>
                            {!isHardUnlocked && (
                                <div className="absolute right-[-8px] top-[-8px] pointer-events-none z-20">
                                    <img src={LOCK_IMG} alt="Bloccato" className="w-8 h-8 drop-shadow-lg rotate-12" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : showScore ? (
                <div className="bg-white p-6 md:p-8 rounded-[30px] border-8 border-orange-500 shadow-2xl w-[90%] max-w-md text-center relative animate-in zoom-in pointer-events-auto">
                    {(() => {
                        const result = getResultContent();
                        return (
                            <>
                                {onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                                
                                {earnedTokens > 0 && (
                                    <div className="absolute -top-8 -right-4 md:-right-8 z-[70] bg-yellow-400 text-black px-4 py-2 rounded-2xl font-black text-xl md:text-2xl border-4 border-white shadow-xl rotate-12 animate-bounce">
                                        +{earnedTokens} 🪙
                                    </div>
                                )}

                                <img src={result.image} alt="" className="h-44 md:h-64 mx-auto mb-2 md:mb-4 object-contain" />
                                
                                <h2 className={`text-2xl md:text-3xl font-black mb-2 drop-shadow-sm ${result.color}`}>{result.title}</h2>
                                <p className="text-base md:text-lg font-bold text-gray-700 mb-6 leading-relaxed">{result.message}</p>
                                <div className="bg-gray-100 px-6 py-2 rounded-full border-4 border-gray-200 mb-6 inline-flex items-center gap-2">
                                    <span className="text-gray-500 font-black uppercase tracking-widest text-xs md:text-sm">Punteggio:</span>
                                    <span className="text-xl md:text-3xl font-black text-gray-800 leading-none">{score} / {gameQuestions.length}</span>
                                </div>
                                
                                <div className="flex flex-row gap-4 justify-center items-center w-full mt-2">
                                     <button onClick={() => initGame(difficulty)} className="hover:scale-105 active:scale-95 transition-transform w-44"><img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" /></button>
                                     <button onClick={resetToMenu} className="hover:scale-105 active:scale-95 transition-transform w-44"><img src={BTN_EXIT_GAME_IMG} alt="Menu" className="w-full h-auto drop-shadow-xl" /></button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            ) : (
                <div className="w-full h-full max-w-2xl flex flex-col items-center px-4 pointer-events-auto">
                    <div className="w-full max-w-sm bg-black/40 backdrop-blur-md rounded-full border-2 border-white/30 h-6 mb-6 relative overflow-hidden shadow-lg">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / gameQuestions.length) * 100}%` }}></div>
                        <div className="absolute inset-0 flex items-center justify-center"><span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-sm">Domanda {currentQuestionIndex + 1} di {gameQuestions.length}</span></div>
                    </div>
                    <div className="mb-32 md:mb-52 w-full text-center relative z-10 animate-in zoom-in duration-300">
                        <h3 className="text-2xl md:text-4xl font-cartoon text-white leading-tight break-words" style={{ textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>{currentQuestion?.question}</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 md:gap-4 w-full pb-12 max-w-2xl">
                        {currentQuestion?.options.map((option, index) => {
                            let statusClasses = "bg-blue-900/60 border-white text-white";
                            
                            if (isAnswered) {
                                if (index === currentQuestion.correctAnswer) {
                                    statusClasses = "bg-green-600 border-white ring-4 ring-green-300 shadow-[0_0_20px_rgba(34,197,94,0.8)] z-20 scale-105 animate-pulse";
                                } else if (index === selectedOption) {
                                    statusClasses = "bg-red-600 border-white ring-4 ring-red-300 opacity-90 scale-95";
                                } else {
                                    statusClasses = "bg-blue-950/40 border-blue-900/20 text-blue-200/40 grayscale brightness-50";
                                }
                            }

                            return (
                                <button 
                                    key={index} 
                                    onClick={() => handleAnswerClick(index)} 
                                    disabled={isAnswered} 
                                    className={`
                                        relative w-full py-4 md:py-6 px-4 rounded-2xl md:rounded-3xl border-2 md:border-4 
                                        backdrop-blur-md font-black text-sm md:text-xl transition-all duration-300 
                                        flex items-center justify-center text-center shadow-2xl overflow-hidden
                                        ${statusClasses}
                                        ${!isAnswered && 'hover:scale-[1.02] hover:bg-blue-800/80 hover:border-white active:scale-95'}
                                    `}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                                    <span className="relative z-10 break-words drop-shadow-md">{option}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>

        {/* TASTO MUSICA DI SOTTOFONDO (In basso a sinistra) */}
        {difficulty && (
            <div className="absolute bottom-8 left-8 z-[100] pointer-events-auto">
                <button 
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`transition-all active:scale-90 hover:scale-110 outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
                    title={musicEnabled ? "Disattiva musica" : "Attiva musica"}
                >
                    <img 
                        src={MUSIC_ICON_IMG} 
                        alt="Musica" 
                        className="w-16 h-16 md:w-20 md:h-20 drop-shadow-xl" 
                    />
                </button>
            </div>
        )}
    </div>
  );
};

export default QuizGame;
