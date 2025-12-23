
import React, { useState, useEffect } from 'react';
import { SOCIALS } from '../constants';
import { RotateCcw, CircleCheck, CircleX } from 'lucide-react';
import { QuizQuestion } from '../types';
import { getProgress, unlockHardMode } from '../services/tokens';
// Importiamo dal nuovo database dedicato
import { QUIZ_EASY, QUIZ_MEDIUM, QUIZ_HARD } from '../services/quizDatabase';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

const TITLE_IMG = 'https://i.postimg.cc/Kvmtrr8d/prova-(1).png';
const BTN_EASY_IMG = 'https://i.postimg.cc/MpVqCtbx/facile.png';
const BTN_MEDIUM_IMG = 'https://i.postimg.cc/3x5HFmMp/intermedio.png';
const BTN_HARD_IMG = 'https://i.postimg.cc/tRsTr3f4/difficile.png';
const LOCK_IMG = 'https://i.postimg.cc/3Nz0wMj1/lucchetto.png';
const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const BTN_BACK_MENU_IMG = 'https://i.postimg.cc/Dw1bshV7/tasto-torna-al-menu-(1).png';
const QUIZ_BG = 'https://i.postimg.cc/htSVpVZW/sfondoquiz.jpg';
const BTN_PLAY_AGAIN_IMG = 'https://i.postimg.cc/fyF07TTv/tasto-gioca-ancora-(1).png';
const BTN_EXIT_GAME_IMG = 'https://i.postimg.cc/X7mwdxpc/tasto-esci-(1).png';

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

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = progress.unlockedStickers.length >= 30; 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  useEffect(() => { if (showUnlockModal || rewardGiven) { const p = getProgress(); setUserTokens(p.tokens); } }, [showUnlockModal, rewardGiven]);

  const handleUnlockSuccess = () => { if (unlockHardMode()) { setIsHardUnlocked(true); const p = getProgress(); setUserTokens(p.tokens); setShowUnlockModal(false); initGame('HARD', true); } };
  const handleOpenNewsstand = () => { if (onOpenNewsstand) { onOpenNewsstand(); setShowUnlockModal(false); } };
  const youtubeLink = SOCIALS.find(s => s.platform === 'YouTube')?.url || 'https://www.youtube.com/@ILoneBoo';

  /**
   * Helper per mescolare un array (Fisher-Yates)
   */
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

      // 1. Mescoliamo il set completo di domande
      const shuffledSource = shuffleArray(sourceQuestions);
      
      // 2. Prendiamo 10 domande e per ognuna mescoliamo le opzioni
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
      if (percentage === 100) return { emoji: "🏆", title: "INCREDIBILE!", message: "Hai risposto correttamente a TUTTE le domande! Sei un vero fenomeno!", color: "text-purple-600", showYt: false };
      else if (percentage >= 80) return { emoji: "🤓", title: "SEI UN GENIO!", message: "Wow! Hai risposto benissimo a quasi tutte le domande!", color: "text-green-500", showYt: false };
      else if (percentage >= 50) return { emoji: "😎", title: "BRAVISSIMO!", message: "Hai fatto un buon punteggio!", color: "text-yellow-500", showYt: true };
      else return { emoji: "📚", title: "PUOI FARE DI PIÙ!", message: "Non ti preoccupare, sbagliando si impara!", color: "text-red-500", showYt: true };
  };

  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-hidden bg-cover bg-center z-[60]";

  return (
    <div className={wrapperStyle} style={{ backgroundImage: `url(${QUIZ_BG})` }}>
        <div className="absolute top-4 left-4 z-50">
            {difficulty ? <button onClick={resetToMenu} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"><img src={BTN_BACK_MENU_IMG} alt="Torna al Menu" className="h-12 w-auto drop-shadow-md" /></button> : <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"><img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-12 w-auto drop-shadow-md" /></button>}
        </div>
        <div className="absolute top-4 right-4 z-50 pointer-events-none"><div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg"><span>{userTokens}</span> <span className="text-xl">🪙</span></div></div>
        {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockSuccess} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
        
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            {!difficulty && <img src={TITLE_IMG} alt="Mettiti alla prova" className="w-72 md:w-96 h-auto mb-6 relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-300 shrink-0" style={{ filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)' }} />}
            {!difficulty ? (
                <div className="flex flex-col gap-4 items-center w-full max-w-sm animate-fade-in px-4">
                    <button onClick={() => initGame('EASY')} className="hover:scale-105 active:scale-95 transition-transform w-full max-w-[200px]"><img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-lg" /></button>
                    <button onClick={() => initGame('MEDIUM')} className="hover:scale-105 active:scale-95 transition-transform w-full max-w-[200px]"><img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto drop-shadow-lg" /></button>
                    <div className="relative hover:scale-105 active:scale-95 transition-transform w-full max-w-[200px]">
                        <button onClick={() => initGame('HARD')} className={`w-full ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}><img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-lg" /></button>
                        {!isHardUnlocked && (
                            <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                                <img src={LOCK_IMG} alt="Bloccato" className="w-12 h-12 drop-shadow-lg rotate-12" />
                            </div>
                        )}
                    </div>
                </div>
            ) : showScore ? (
                <div className="bg-white p-6 md:p-8 rounded-[30px] border-4 border-black shadow-2xl w-[90%] max-w-md text-center relative animate-in zoom-in">
                    {(() => {
                        const result = getResultContent();
                        return (
                            <>
                                {onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                                <div className="text-6xl md:text-8xl mb-2 md:mb-4 animate-bounce">{result.emoji}</div>
                                <h2 className={`text-2xl md:text-3xl font-black mb-2 drop-shadow-sm ${result.color}`}>{result.title}</h2>
                                <p className="text-base md:text-lg font-bold text-gray-700 mb-6 leading-relaxed">{result.message}</p>
                                <div className="bg-gray-100 p-3 rounded-2xl border-2 border-gray-200 mb-6 inline-block"><span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Punteggio</span><p className="text-3xl font-black text-gray-800">{score} / {gameQuestions.length}</p></div>
                                {earnedTokens > 0 && <div className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-lg border-2 border-black mb-6 animate-pulse inline-block ml-2 align-top">+{earnedTokens} GETTONI! 🪙</div>}
                                {result.showYt && <div className="mb-6 animate-pulse"><a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="font-cartoon text-lg md:text-xl text-boo-purple underline hover:text-purple-700">Ripassa sul canale! 📺</a></div>}
                                <div className="flex flex-row gap-4 justify-center items-center w-full mt-2">
                                     <button onClick={() => initGame(difficulty)} className="hover:scale-105 active:scale-95 transition-transform w-44"><img src={BTN_PLAY_AGAIN_IMG} alt="Gioca Ancora" className="w-full h-auto drop-shadow-xl" /></button>
                                     <button onClick={resetToMenu} className="hover:scale-105 active:scale-95 transition-transform w-32"><img src={BTN_EXIT_GAME_IMG} alt="Menu" className="w-full h-auto drop-shadow-xl" /></button>
                                </div>
                            </>
                        );
                    })()}
                </div>
            ) : (
                <div className="w-full max-w-2xl flex flex-col items-center px-4">
                    <div className="w-full max-w-sm bg-black/40 backdrop-blur-md rounded-full border-2 border-white/30 h-6 mb-6 relative overflow-hidden shadow-lg">
                        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / gameQuestions.length) * 100}%` }}></div>
                        <div className="absolute inset-0 flex items-center justify-center"><span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-sm">Domanda {currentQuestionIndex + 1} di {gameQuestions.length}</span></div>
                    </div>
                    <div className="mb-8 w-full text-center relative z-10 animate-in zoom-in duration-300">
                        <h3 className="text-3xl md:text-5xl font-cartoon text-white leading-tight break-words" style={{ textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' }}>{currentQuestion?.question}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {currentQuestion?.options.map((option, index) => {
                            let buttonStyle = "bg-gradient-to-b from-blue-700 to-blue-900 border-blue-400 text-white"; 
                            let icon = null;
                            if (isAnswered) {
                                if (index === currentQuestion.correctAnswer) { buttonStyle = "bg-gradient-to-b from-green-500 to-green-700 border-white ring-4 ring-green-300 scale-105 shadow-[0_0_20px_rgba(34,197,94,0.6)] z-20"; icon = <CircleCheck className="text-white ml-2 animate-bounce" size={24} />; } 
                                else if (index === selectedOption) { buttonStyle = "bg-gradient-to-b from-red-500 to-red-700 border-white opacity-90 ring-4 ring-red-300"; icon = <CircleX className="text-white ml-2 animate-shake" size={24} />; } 
                                else { buttonStyle = "bg-gray-700 border-gray-600 text-gray-400 opacity-50 scale-95"; }
                            }
                            return (
                                <button key={index} onClick={() => handleAnswerClick(index)} disabled={isAnswered} className={`relative w-full py-4 px-6 rounded-full border-4 font-black text-lg md:text-xl transition-all duration-200 flex items-center justify-center text-center shadow-lg ${buttonStyle} ${!isAnswered && 'hover:scale-105 hover:border-white hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] active:scale-95'}`}>
                                    <span className="break-words drop-shadow-md">{option}</span>{icon}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default QuizGame;
