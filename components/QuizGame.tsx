
import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS_EASY, QUIZ_QUESTIONS_HARD, SOCIALS, STICKERS_COLLECTION } from '../constants';
import { Trophy, ArrowRight, RotateCcw, CircleCheck, CircleX, Baby, GraduationCap, ArrowLeft, Brain, Lock } from 'lucide-react';
import { QuizQuestion } from '../types';
import { getProgress, unlockHardMode } from '../services/tokens';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

// Add prop interface
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
  
  // Track if rewards already given for this session
  const [rewardGiven, setRewardGiven] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);

  // Lock State
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      // Unlock if Album Complete (30 stickers) OR bought
      const albumComplete = progress.unlockedStickers.length >= 30; // Assuming 30 is total
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);
  }, []);

  // Update tokens from storage when modal opens (to catch updates from newsstand)
  useEffect(() => {
      if (showUnlockModal) {
          const p = getProgress();
          setUserTokens(p.tokens);
      }
  }, [showUnlockModal]);

  const handleUnlockSuccess = () => {
      if (unlockHardMode()) {
          setIsHardUnlocked(true);
          const p = getProgress();
          setUserTokens(p.tokens);
          setShowUnlockModal(false);
          // Auto start game
          initGame('HARD', true);
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          // We keep the modal open or close it? 
          // Let's keep it open so user sees updates when they return, 
          // OR close it. Closing is safer.
          setShowUnlockModal(false);
      }
  };

  const youtubeLink = SOCIALS.find(s => s.platform === 'YouTube')?.url || 'https://www.youtube.com/@ILoneBoo';

  // Initialize game with random questions based on difficulty
  const initGame = (selectedDiff: Difficulty, forceStart = false) => {
      if (selectedDiff === 'HARD' && !isHardUnlocked && !forceStart) {
          setShowUnlockModal(true);
          return;
      }

      setDifficulty(selectedDiff);
      
      let sourceQuestions: QuizQuestion[] = [];

      if (selectedDiff === 'EASY') {
          sourceQuestions = QUIZ_QUESTIONS_EASY;
      } else if (selectedDiff === 'HARD') {
          sourceQuestions = QUIZ_QUESTIONS_HARD;
      } else {
          // MEDIUM: Mix 50/50
          sourceQuestions = [...QUIZ_QUESTIONS_EASY, ...QUIZ_QUESTIONS_HARD];
      }

      // Fisher-Yates Shuffle
      const shuffled = [...sourceQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // Select first 10 questions
      setGameQuestions(shuffled.slice(0, 10));
      
      // Reset state
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowScore(false);
      setIsAnswered(false);
      setSelectedOption(null);
      setRewardGiven(false);
      setEarnedTokens(0);
  };

  const resetToMenu = () => {
      setDifficulty(null);
      setGameQuestions([]);
      setScore(0);
      setShowScore(false);
  };

  const currentQuestion = gameQuestions[currentQuestionIndex];

  const handleAnswerClick = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    if (currentQuestion && optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < gameQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setShowScore(true);
    }
  };

  // AWARD TOKENS EFFECT - SPECIFIC RULES FOR PERFECT SCORE
  useEffect(() => {
      if (showScore && !rewardGiven && onEarnTokens) {
          const totalQs = gameQuestions.length;
          let reward = 0;
          
          // 1. PERFECT SCORE REWARDS (100%)
          if (score === totalQs) {
              if (difficulty === 'EASY') reward = 5;
              else if (difficulty === 'MEDIUM') reward = 10;
              else if (difficulty === 'HARD') reward = 15;
          } 
          // 2. PASSING SCORE REWARDS (>50% but not perfect) - Consolation prize
          else if (score >= totalQs / 2) {
              reward = 2; 
          }

          if (reward > 0) {
              onEarnTokens(reward);
          }
          setEarnedTokens(reward);
          setRewardGiven(true);
      }
  }, [showScore, rewardGiven, score, gameQuestions.length, onEarnTokens, difficulty]);

  const getResultContent = () => {
      const totalQs = gameQuestions.length;
      const percentage = (score / totalQs) * 100;
      
      if (percentage === 100) {
          return {
              emoji: "🏆",
              title: "INCREDIBILE!",
              message: "Hai risposto correttamente a TUTTE le domande! Non ne hai sbagliata nemmeno una. Sei un vero fenomeno, ed ecco il tuo premio super!",
              color: "text-purple-600",
              showYt: false
          };
      } else if (percentage >= 80) {
          return {
              emoji: "🤓",
              title: "SEI UN GENIO!",
              message: "Wow! Hai risposto benissimo a quasi tutte le domande! Sei prontissimo per la scuola (o per insegnare)!",
              color: "text-green-500",
              showYt: false
          };
      } else if (percentage >= 50) {
          return {
              emoji: "😎",
              title: "BRAVISSIMO!",
              message: "Hai fatto un buon punteggio! Con un po' di ripasso diventerai imbattibile.",
              color: "text-yellow-500",
              showYt: true
          };
      } else {
          return {
              emoji: "📚",
              title: "PUOI FARE DI PIÙ!",
              message: "Non ti preoccupare, sbagliando si impara! Riprova e vedrai che andrà meglio.",
              color: "text-red-500",
              showYt: true
          };
      }
  };

  // --- MENU SELECTION VIEW ---
  if (!difficulty) {
      return (
          <div className="max-w-xl mx-auto flex flex-col items-center animate-fade-in text-center min-h-[500px]">
              {showUnlockModal && (
                  <UnlockModal 
                      onClose={() => setShowUnlockModal(false)}
                      onUnlock={handleUnlockSuccess}
                      onOpenNewsstand={handleOpenNewsstand}
                      currentTokens={userTokens}
                  />
              )}

              <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-8 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>Mettiti alla Prova</h2>
              <div className="bg-white p-8 rounded-[40px] border-4 border-black shadow-xl w-full">
                  <p className="text-2xl font-bold text-gray-700 mb-6">Scegli la difficoltà:</p>
                  <div className="flex flex-col gap-4">
                      <button 
                        onClick={() => initGame('EASY')} 
                        className="bg-green-500 text-white text-xl font-black py-4 px-6 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3"
                      >
                          <Baby size={32} /> FACILE
                      </button>
                      
                      <button 
                        onClick={() => initGame('MEDIUM')} 
                        className="bg-yellow-400 text-black text-xl font-black py-4 px-6 rounded-2xl border-4 border-black hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3"
                      >
                          <Brain size={32} /> INTERMEDIO
                      </button>

                      <button 
                        onClick={() => initGame('HARD')} 
                        className={`relative text-white text-xl font-black py-4 px-6 rounded-2xl border-4 border-black transition-transform shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 ${isHardUnlocked ? 'bg-red-500 hover:scale-105' : 'bg-gray-400 hover:scale-[1.02] cursor-pointer'}`}
                      >
                          {isHardUnlocked ? <GraduationCap size={32} /> : <Lock size={32} />} 
                          DIFFICILE
                          {!isHardUnlocked && <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] px-2 py-1 rounded-full border-2 border-black">LOCKED</div>}
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // --- SCORE VIEW ---
  if (showScore) {
    const result = getResultContent();

    return (
      <div className="flex flex-col items-center justify-center p-4 animate-fade-in text-center max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-[40px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] w-full relative">
            
            {/* SAVE REMINDER ICON */}
            {onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

            <div className="text-8xl mb-4 animate-bounce">{result.emoji}</div>
            
            <h2 className={`text-3xl md:text-4xl font-black mb-2 drop-shadow-sm ${result.color}`}>
                {result.title}
            </h2>
            
            <p className="text-xl font-bold text-gray-700 mb-6 leading-relaxed">
              {result.message}
            </p>
            
            <div className="bg-gray-100 p-4 rounded-2xl border-2 border-gray-200 mb-4 inline-block">
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Punteggio</span>
                <p className="text-4xl font-black text-gray-800">{score} / {gameQuestions.length}</p>
            </div>

            {earnedTokens > 0 && (
                <div className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-black text-lg border-2 border-black mb-8 animate-pulse inline-block ml-2 align-top h-[88px] flex items-center">
                    +{earnedTokens} GETTONI! 🪙
                </div>
            )}

            {/* YOUTUBE PROMO LINK FOR LOW SCORES */}
            {result.showYt && (
                <div className="mb-8 animate-pulse">
                    <p className="font-cartoon text-lg mb-2 text-boo-purple">Per imparare divertendoti:</p>
                    <a 
                        href={youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center gap-3 transition-transform active:scale-95"
                    >
                        {/* Custom Cartoon YouTube Logo */}
                        <div className="relative w-16 h-12 bg-red-600 rounded-xl border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-[-3deg] transition-all duration-300">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                        </div>
                        <span className="font-cartoon text-2xl text-boo-yellow" style={{ textShadow: "2px 2px 0px black", WebkitTextStroke: "1px black" }}>
                            VAI AL CANALE
                        </span>
                    </a>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-center gap-4">
                <button 
                    onClick={resetToMenu}
                    className="flex items-center justify-center gap-2 bg-boo-green text-white font-black px-6 py-3 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] hover:scale-105 transition-transform"
                >
                    <RotateCcw size={20} /> Torna al Menu
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- GAME VIEW ---
  return (
    <div className="max-w-xl mx-auto flex flex-col items-center">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="w-full flex justify-between items-center mb-6 px-2">
          <button onClick={resetToMenu} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/40">
              <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <h2 className="text-4xl md:text-5xl font-black text-boo-orange drop-shadow-[3px_3px_0_black]" style={{ textShadow: "3px 3px 0px black" }}>
              Quiz {difficulty === 'EASY' ? 'Facile' : (difficulty === 'MEDIUM' ? 'Misto' : 'Esperto')}
          </h2>
          <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="w-full bg-white rounded-[24px] md:rounded-[30px] border-4 border-black p-4 md:p-8 shadow-[6px_6px_0px_0px_rgba(236,72,153,1)] relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-3 bg-gray-100 w-full">
            <div 
                className="h-full bg-pink-500 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / gameQuestions.length) * 100}%` }}
            ></div>
        </div>

        <div className="mt-4 mb-4 md:mb-6">
            <span className="text-pink-500 font-black tracking-widest uppercase text-xs md:text-sm">Domanda {currentQuestionIndex + 1}/{gameQuestions.length}</span>
            <h3 className="text-lg md:text-2xl font-black text-gray-800 mt-1 leading-tight min-h-[3.5rem] flex items-center">
                {currentQuestion.question}
            </h3>
        </div>

        {/* Options Grid - 2 Cols on mobile now for compactness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {currentQuestion.options.map((option, index) => {
                let buttonStyle = "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"; // Default
                
                if (isAnswered) {
                    if (index === currentQuestion.correctAnswer) {
                        buttonStyle = "bg-green-100 border-green-500 text-green-700";
                    } else if (index === selectedOption) {
                        buttonStyle = "bg-red-100 border-red-500 text-red-700";
                    } else {
                        buttonStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-50";
                    }
                }

                return (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        disabled={isAnswered}
                        className={`
                            relative w-full text-left p-3 md:p-4 rounded-xl border-4 font-bold text-sm md:text-lg transition-all duration-200 flex items-center justify-between min-h-[60px] md:min-h-[80px] leading-tight
                            ${buttonStyle}
                            ${!isAnswered && 'hover:scale-[1.02] hover:shadow-md active:scale-95'}
                        `}
                    >
                        <span className="break-words w-full pr-1">{option}</span>
                        {isAnswered && index === currentQuestion.correctAnswer && <CircleCheck className="text-green-600 flex-shrink-0 ml-1" size={20} />}
                        {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && <CircleX className="text-red-600 flex-shrink-0 ml-1" size={20} />}
                    </button>
                );
            })}
        </div>

        {isAnswered && (
            <div className="mt-6 flex justify-end animate-fade-in-up">
                <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 bg-boo-blue text-white font-black px-6 py-2 md:py-3 rounded-2xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 hover:bg-blue-500 transition-all text-sm md:text-base"
                >
                    {currentQuestionIndex === gameQuestions.length - 1 ? 'Risultato' : 'Prossima'} <ArrowRight size={20} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
