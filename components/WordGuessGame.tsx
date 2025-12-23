
import React, { useState, useEffect } from 'react';
import { Heart, Trophy, ArrowLeft } from 'lucide-react';
import SaveReminder from './SaveReminder';
import { getProgress } from '../services/tokens';

const TITLE_IMG = 'https://i.postimg.cc/h4Tk6xq4/paolowsw-(1).png';
const NEW_WORD_BTN_IMG = 'https://i.postimg.cc/WbGGtwSC/nuvoa-parola-buuton-(1).png';
const BG_IMG = 'https://i.postimg.cc/gcS9Q3vk/sfondo-parola-magicadef.jpg';
const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';

const WORDS = [
    'FANTASMA', 'ZUCCA', 'CASTELLO', 'MAGIA', 'AMICI', 'NOTTE', 'STELLA', 'LUNA', 'DRAGO', 'FORESTA',
    'RE', 'REGINA', 'PRINCIPESSA', 'PRINCIPE', 'MAGO', 'STREGA', 'FATA', 'FOLLETTO', 'TESORO', 'SPADA',
    'POZIONE', 'MANTELLO', 'CORONA', 'BACCHETTA', 'MOSTRO', 'UNICORNO', 'GNOMO', 'ORCO', 'INCANTESIMO', 'LIBRO',
    'CANE', 'GATTO', 'LEONE', 'TIGRE', 'ELEFANTE', 'GIRAFFA', 'ORSO', 'LUPO', 'VOLPE', 'CONIGLIO',
    'TOPO', 'DELFINO', 'BALENA', 'SQUALO', 'RANA', 'FARFALLA', 'APE', 'UCCELLO', 'GUFO', 'PINGUINO',
    'CAVALLO', 'MUCCA', 'PECORA', 'MAIALE', 'GALLINA', 'RAGNO', 'FORMICA', 'LUMACA', 'TARTARUGA', 'PESCE',
    'SCIMMIA', 'ZEBRA', 'SERPENTE', 'COCCODRILLO', 'IPPOPOTAMO', 'CANGURO', 'PANDA', 'AQUILA', 'PAPERA',
    'SOLE', 'PIOGGIA', 'NEVE', 'VENTO', 'MARE', 'MONTAGNA', 'FIUME', 'LAGO', 'ALBERO', 'FIORE',
    'FOGLIA', 'ERBA', 'CIELO', 'NUVOLA', 'ARCOBALENO', 'FULMINE', 'TEMPORALE', 'SABBIA', 'SASSO', 'VULCANO',
    'ISOLA', 'GROTTA', 'PRATO', 'BOSCO', 'GHIACCIO', 'FUOCO', 'ACQUA', 'TERRA', 'ARIA', 'STAGIONE',
    'PIZZA', 'PASTA', 'PANE', 'TORTA', 'GELATO', 'MELA', 'BANANA', 'ARANCIA', 'FRAGOLA', 'CIOCCOLATO',
    'BISCOTTO', 'CARAMELLA', 'LATTE', 'SUCCO', 'FORMAGGIO', 'UVA', 'PERA', 'LIMONE', 'PATATA', 'POMODORO',
    'CAROTA', 'INSALATA', 'UOVO', 'PESCA', 'CILIEGIA', 'ANGURIA', 'ANANAS', 'MANDARINO', 'MIELE', 
    'SCUOLA', 'ZAINO', 'QUADERNO', 'PENNA', 'MATITA', 'GOMMA', 'LAVAGNA', 'BANCO', 'AULA', 'MAESTRA',
    'DISEGNO', 'COLORI', 'FORBICI', 'COLLA', 'RIGHELLO', 'ASTUCCIO', 'PAGINA', 'LETTURA', 'SCRIVERE',
    'CASA', 'TAVOLO', 'SEDIA', 'LETTO', 'DIVANO', 'LAMPADA', 'SPECCHIO', 'OROLOGIO', 'PORTA', 'FINESTRA',
    'GIOCO', 'PALLA', 'BAMBOLA', 'TRENO', 'MACCHINA', 'AEREO', 'NAVE', 'BICI', 'PATTINI', 'AQUILONE',
    'CALCIO', 'NUOTO', 'CORSA', 'SALTO', 'BASKET', 'TENNIS', 'DADI', 'CARTE', 'PUZZLE', 'ROBOT',
    'AMORE', 'FELICITA', 'SORRISO', 'PAURA', 'RABBIA', 'TRISTEZZA', 'MAMMA', 'PAPA', 'NONNO', 'NONNA',
    'FRATELLO', 'SORELLA', 'ZIO', 'ZIA', 'CUGINO', 'AMICO', 'BAMBINO', 'RAGAZZO', 'UOMO', 'DONNA',
    'ROSSO', 'BLU', 'VERDE', 'GIALLO', 'NERO', 'BIANCO', 'ROSA', 'VIOLA', 'ARANCIONE', 'GRIGIO',
    'MUSICA', 'CANZONE', 'BALLO', 'SUONO', 'VOCE', 'FESTA', 'REGALO', 'SOGNO', 'VIAGGIO', 'ESTATE'
];

const ALPHABET = "ABCDEFGHILMNOPQRSTUVZ".split('');

interface WordGuessProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const WordGuessGame: React.FC<WordGuessProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [targetWord, setTargetWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(5);
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  
  // Progression Logic
  const [wordsWonCount, setWordsWonCount] = useState(0);
  const [currentTokens, setCurrentTokens] = useState(0);
  const [rewardGivenForThisWord, setRewardGivenForThisWord] = useState(false);

  useEffect(() => {
      startNewGame();
      try {
          const p = getProgress();
          setCurrentTokens(p ? p.tokens : 0);
      } catch (e) { console.error(e); }
  }, []);

  const startNewGame = () => {
      const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      setTargetWord(randomWord);
      setGuessedLetters([]);
      setLives(5);
      setGameStatus('PLAYING');
      setRewardGivenForThisWord(false);
  };

  const handleGuess = (letter: string) => {
      if (gameStatus !== 'PLAYING' || guessedLetters.includes(letter)) return;

      const newGuessed = [...guessedLetters, letter];
      setGuessedLetters(newGuessed);

      if (!targetWord.includes(letter)) {
          const newLives = lives - 1;
          setLives(newLives);
          if (newLives === 0) setGameStatus('LOST');
      } else {
          const isWon = targetWord.split('').every(char => newGuessed.includes(char));
          if (isWon) setGameStatus('WON');
      }
  };

  // Handle Rewards when word is won
  useEffect(() => {
      if (gameStatus === 'WON' && !rewardGivenForThisWord) {
          const newCount = wordsWonCount + 1;
          setWordsWonCount(newCount);
          setRewardGivenForThisWord(true);

          let reward = 0;
          // Rules: 3 words -> 5 coins, 6 words -> 10 coins, 10 words -> 15 coins
          if (newCount === 3) reward = 5;
          else if (newCount === 6) reward = 10;
          else if (newCount === 10) reward = 15;

          if (reward > 0 && onEarnTokens) {
              onEarnTokens(reward);
              // Update local display immediately
              setCurrentTokens(prev => prev + reward);
          }
      }
  }, [gameStatus, rewardGivenForThisWord, wordsWonCount, onEarnTokens]);

  const getBoxSizeClass = () => {
      const len = targetWord.length;
      if (len > 10) return 'w-6 h-9 text-lg md:w-10 md:h-14 md:text-3xl';
      if (len > 7) return 'w-8 h-12 text-2xl md:w-12 md:h-16 md:text-4xl'; 
      return 'w-10 h-14 text-3xl md:w-14 md:h-20 md:text-5xl';
  };

  // Wrapper style for full screen fixed background
  const wrapperStyle = "fixed top-[64px] md:top-[96px] left-0 right-0 bottom-0 w-full h-[calc(100%-64px)] md:h-[calc(100%-96px)] overflow-y-auto bg-cover bg-center z-[60]";

  return (
    <div 
        className={wrapperStyle}
        style={{ backgroundImage: `url(${BG_IMG})` }}
    >
        {/* BACK BUTTON */}
        <div className="absolute top-4 left-4 z-50">
            <button 
                onClick={onBack} 
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
                <img 
                    src={EXIT_BTN_IMG} 
                    alt="Ritorna al Parco" 
                    className="h-12 w-auto drop-shadow-md" 
                />
            </button>
        </div>

        {/* TOP RIGHT TOKEN COUNTER */}
        <div className="absolute top-4 right-4 z-50 pointer-events-none">
           <div className="bg-yellow-400 text-black px-4 py-2 rounded-full border-4 border-white shadow-md flex items-center gap-2 font-black text-lg">
               <span>{currentTokens}</span> <span className="text-xl">🪙</span>
           </div>
        </div>

        {/* MAIN CONTAINER: min-h-full to allow scrolling on desktop if needed, without clipping */}
        <div className="w-full min-h-full flex flex-col items-center pt-24 md:pt-32 pb-24 relative">
            
            {/* TITLE */}
            <img 
                src={TITLE_IMG} 
                alt="Parola Magica" 
                className="h-24 md:h-36 w-auto mb-2 relative z-10 hover:scale-105 transition-transform duration-300"
                style={{
                    filter: 'drop-shadow(0px 0px 2px #F97316) drop-shadow(0px 0px 3px #F97316) drop-shadow(0px 0px 5px #F97316) drop-shadow(0px 0px 2px #000000)'
                }}
            />

            {/* MAIN GAME BOX (Translucent) */}
            <div className="bg-white/40 backdrop-blur-md w-[95%] max-w-3xl rounded-[30px] border-4 border-white/50 shadow-2xl overflow-hidden p-3 md:p-5 text-center relative flex flex-col items-center z-10 min-h-[200px] justify-center">
                
                {/* WORD DISPLAY - Reduced bottom margin */}
                <div className="flex flex-nowrap justify-center gap-1 md:gap-2 mb-4 px-1 w-full overflow-hidden">
                    {targetWord.split('').map((char, idx) => (
                        <div 
                            key={idx} 
                            className={`
                                border-b-4 border-purple-800 flex items-center justify-center font-black text-purple-900 bg-white/90 rounded-lg shrink-0 shadow-sm
                                ${getBoxSizeClass()}
                                ${gameStatus === 'LOST' && !guessedLetters.includes(char) ? 'text-red-500 bg-red-50' : ''}
                                ${gameStatus === 'WON' ? 'bg-green-100 text-green-700 border-green-600' : ''}
                            `}
                        >
                            {guessedLetters.includes(char) || gameStatus === 'LOST' ? char : ''}
                        </div>
                    ))}
                </div>

                {/* GAME AREA OR WIN/LOSS MESSAGE */}
                {gameStatus === 'PLAYING' ? (
                    <div className="grid grid-cols-7 gap-1 md:gap-2 w-full">
                        {ALPHABET.map((letter) => {
                            const isGuessed = guessedLetters.includes(letter);
                            const isCorrect = targetWord.includes(letter);
                            
                            let bgClass = '';
                            if (isGuessed) {
                                if (isCorrect) bgClass = 'bg-green-500 border-green-700 text-white opacity-80 border-b-2 translate-y-1';
                                else bgClass = 'bg-gray-400 border-gray-500 text-gray-200 opacity-60 border-b-2 translate-y-1';
                            } else {
                                bgClass = 'bg-white border-purple-300 hover:bg-purple-50 text-purple-900 border-b-[4px] md:border-b-[5px] active:border-b-0 active:translate-y-1 shadow-sm';
                            }

                            return (
                                <button
                                    key={letter}
                                    onClick={() => handleGuess(letter)}
                                    disabled={isGuessed}
                                    className={`
                                        aspect-square w-full rounded-xl md:rounded-2xl border-x-2 border-t-2 font-black text-lg md:text-2xl transition-all flex items-center justify-center
                                        ${bgClass}
                                    `}
                                >
                                    {letter}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center animate-in zoom-in w-full py-4">
                        {gameStatus === 'WON' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

                        <h3 className={`text-4xl font-black mb-2 ${gameStatus === 'WON' ? 'text-green-700' : 'text-red-600'}`}>
                            {gameStatus === 'WON' ? 'HAI VINTO! 🎉' : 'OH NO! 😱'}
                        </h3>
                        <p className="text-gray-800 font-bold mb-4 text-xl">
                            La parola era: <span className="text-purple-700 uppercase font-black">{targetWord}</span>
                        </p>
                        
                        {gameStatus === 'WON' && rewardGivenForThisWord && (
                            <div className="bg-yellow-400 text-black px-6 py-2 rounded-xl font-black text-xl border-2 border-black mb-4 animate-pulse inline-block transform rotate-[-2deg]">
                                + PUNTO LIVELLO!
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* BOTTOM INFO HUD - Absolute on Mobile, Static on Desktop */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-50 md:static md:transform-none md:mt-6 md:mb-8">
                <div className="bg-white/40 backdrop-blur-md p-2 rounded-[30px] border-4 border-white/50 shadow-xl flex items-center justify-between h-24">
                    
                    {/* LEFT: RULES */}
                    <div className="flex flex-col gap-0.5 text-[10px] md:text-xs font-bold text-gray-800 pl-4 min-w-max leading-tight">
                        <p className="uppercase text-purple-800 font-black mb-1">Premi:</p>
                        <div className={`flex items-center gap-1 ${wordsWonCount >= 3 ? 'opacity-40' : ''}`}>
                            <span>3 Parole =</span> <span className="text-green-800 font-black">+5 🪙</span>
                        </div>
                        <div className={`flex items-center gap-1 ${wordsWonCount >= 6 ? 'opacity-40' : ''}`}>
                            <span>6 Parole =</span> <span className="text-green-800 font-black">+10 🪙</span>
                        </div>
                        <div className={`flex items-center gap-1 ${wordsWonCount >= 10 ? 'opacity-40' : ''}`}>
                            <span>10 Parole =</span> <span className="text-green-800 font-black">+15 🪙</span>
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="w-0.5 h-14 bg-white/50 rounded-full mx-2 hidden sm:block"></div>

                    {/* MIDDLE: STATS (LIVES & LEVEL) */}
                    <div className="flex flex-col items-center justify-center flex-1">
                        {/* Lives (5 Hearts) */}
                        <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Heart 
                                    key={i} 
                                    size={18} 
                                    className={`transition-all duration-300 drop-shadow-sm ${i < lives ? 'text-red-500 fill-red-500' : 'text-white/50 fill-white/20'}`} 
                                    strokeWidth={2.5}
                                />
                            ))}
                        </div>
                        {/* Level Progress */}
                        <div className="text-center">
                            <span className="text-xs font-bold text-gray-700 uppercase">PAROLE INDOVINATE</span>
                            <div className="text-2xl font-black text-purple-800 leading-none">{wordsWonCount}</div>
                        </div>
                    </div>

                    {/* RIGHT: NEW WORD BUTTON */}
                    <div className="pr-2">
                        <button 
                            onClick={startNewGame} 
                            className="hover:scale-105 active:scale-95 transition-transform"
                            title="Nuova Parola"
                        >
                            <img 
                                src={NEW_WORD_BTN_IMG} 
                                alt="Nuova Parola" 
                                className="h-16 w-auto drop-shadow-md" 
                            />
                        </button>
                    </div>

                </div>
            </div>

        </div>
    </div>
  );
};

export default WordGuessGame;
