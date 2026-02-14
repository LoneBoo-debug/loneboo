
import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Trophy, ArrowLeft, ArrowBigDown } from 'lucide-react';
import SaveReminder from './SaveReminder';
import { getProgress } from '../services/tokens';
import { isNightTime } from '../services/weatherService';

const NEW_WORD_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvoa-parola-buuton-(1).webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';

const WORD_BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ndovinaparoladayyyes.webp';
const WORD_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ndovinaparolanightss.webp';

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
const VOWELS = ['A', 'E', 'I', 'O', 'U'];

interface WordGuessProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const WordGuessGame: React.FC<WordGuessProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [now, setNow] = useState(new Date());
  const [targetWord, setTargetWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState(5);
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  
  const [wordsWonCount, setWordsWonCount] = useState(0);
  const [currentTokens, setCurrentTokens] = useState(0);
  const [rewardGivenForThisWord, setRewardGivenForThisWord] = useState(false);

  // Background dinamico basato sull'orario (20:15 - 06:45)
  const currentBg = useMemo(() => isNightTime(now) ? WORD_BG_NIGHT : WORD_BG_DAY, [now]);

  useEffect(() => {
      startNewGame();
      try {
          const p = getProgress();
          setCurrentTokens(p ? p.tokens : 0);
      } catch (e) { console.error(e); }

      const timeTimer = setInterval(() => setNow(new Date()), 60000);
      return () => clearInterval(timeTimer);
  }, []);

  const startNewGame = () => {
      const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      setTargetWord(randomWord);
      setGuessedLetters([]);
      setLives(5);
      setGameStatus('PLAYING');
      setRewardGivenForThisWord(false);
  };

  // Calcolo dinamico indizi
  const vowelCount = useMemo(() => {
      if (!targetWord) return 0;
      return targetWord.split('').filter(char => VOWELS.includes(char)).length;
  }, [targetWord]);

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

  useEffect(() => {
      if (gameStatus === 'WON' && !rewardGivenForThisWord) {
          const newCount = wordsWonCount + 1;
          setWordsWonCount(newCount);
          setRewardGivenForThisWord(true);

          let reward = 0;
          if (newCount === 3) reward = 5;
          else if (newCount === 6) reward = 10;
          else if (newCount === 10) reward = 15;

          if (reward > 0 && onEarnTokens) {
              onEarnTokens(reward);
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

  const wrapperStyle = "fixed inset-0 top-0 left-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={wrapperStyle}>
        <img src={currentBg} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" draggable={false} />

        {/* HUD FISSA: TASTO ESCI E SALDO GETTONI */}
        <div className="absolute top-[80px] md:top-[120px] left-0 right-0 px-4 flex items-center justify-between z-50 pointer-events-none">
            <div className="pointer-events-auto">
                <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                    <img src={EXIT_BTN_IMG} alt="Indietro" className="h-12 w-auto" />
                </button>
            </div>
            <div className="pointer-events-auto">
                <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl">
                    <span>{currentTokens}</span> <span className="text-xl">🪙</span>
                </div>
            </div>
        </div>

        {/* MAIN CONTAINER: pt diminuito per alzare tutto */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-36 md:pt-40 px-4 overflow-hidden">
            
            {/* BOX TITOLI TRASLUCIDO */}
            {gameStatus === 'PLAYING' && (
                <div className="bg-white/40 backdrop-blur-md w-full max-w-3xl rounded-[30px] border-4 border-white/50 shadow-2xl p-3 md:p-5 text-center mb-4 animate-in slide-in-from-top-4 duration-500">
                    <h2 
                        className="font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[2px_2px_0_black] text-lg md:text-4xl"
                        style={{ WebkitTextStroke: '1.2px black', lineHeight: '1.1' }}
                    >
                        Indovina la parola, sono {targetWord.length} lettere!
                    </h2>
                    <p 
                        className="font-luckiest text-yellow-300 uppercase text-center tracking-tight drop-shadow-[1px_1px_0_black] text-sm md:text-2xl mt-1"
                        style={{ WebkitTextStroke: '0.8px black' }}
                    >
                        Ti do un indizio, {vowelCount === 1 ? "c'è 1 vocale" : `ci sono ${vowelCount} vocali`}
                    </p>
                </div>
            )}

            {/* MAIN GAME BOX (Translucent) - mb aggiunto per staccarlo dall'HUD sotto */}
            <div className="bg-white/40 backdrop-blur-md w-full max-w-3xl rounded-[30px] border-4 border-white/50 shadow-2xl p-3 md:p-5 text-center relative flex flex-col items-center min-h-[220px] justify-center mb-8">
                
                {/* WORD DISPLAY - Solo durante il gioco (PLAYING) */}
                {gameStatus === 'PLAYING' && (
                    <div className="flex flex-nowrap justify-center gap-1 md:gap-2 mb-6 px-1 w-full overflow-hidden">
                        {targetWord.split('').map((char, idx) => (
                            <div 
                                key={idx} 
                                className={`
                                    border-b-4 border-purple-800 flex items-center justify-center font-black text-purple-900 bg-white/90 rounded-lg shrink-0 shadow-sm
                                    ${getBoxSizeClass()}
                                `}
                            >
                                {guessedLetters.includes(char) ? char : ''}
                            </div>
                        ))}
                    </div>
                )}

                {/* GAME AREA OR WIN/LOSS MESSAGE */}
                {gameStatus === 'PLAYING' ? (
                    <div className="grid grid-cols-7 gap-2 md:gap-3 w-full px-1">
                        {ALPHABET.map((letter, idx) => {
                            const isGuessed = guessedLetters.includes(letter);
                            const isCorrect = targetWord.includes(letter);
                            
                            // Palette di colori per la tastiera
                            const bubbleColors = [
                                'bg-pink-400 border-pink-600 shadow-pink-800/40',
                                'bg-sky-400 border-sky-600 shadow-sky-800/40',
                                'bg-yellow-400 border-yellow-600 shadow-yellow-800/40',
                                'bg-orange-400 border-orange-600 shadow-orange-800/40',
                                'bg-purple-400 border-purple-600 shadow-purple-800/40',
                                'bg-lime-400 border-lime-600 shadow-lime-800/40'
                            ];
                            const myColor = bubbleColors[idx % bubbleColors.length];

                            let statusStyles = '';
                            if (isGuessed) {
                                if (isCorrect) statusStyles = 'bg-green-500 border-green-700 text-white opacity-40 grayscale-[0.5] translate-y-1 shadow-none';
                                else statusStyles = 'bg-gray-400 border-gray-500 text-gray-200 opacity-20 grayscale translate-y-1 shadow-none';
                            } else {
                                statusStyles = `${myColor} text-white border-b-[5px] md:border-b-[7px] active:border-b-0 active:translate-y-1 shadow-lg hover:scale-105`;
                            }

                            return (
                                <button
                                    key={letter}
                                    onClick={() => handleGuess(letter)}
                                    disabled={isGuessed}
                                    className={`
                                        aspect-square w-full rounded-2xl md:rounded-3xl border-x-2 border-t-2 
                                        font-black text-lg md:text-3xl transition-all flex items-center justify-center 
                                        relative overflow-hidden ${statusStyles}
                                    `}
                                    style={{ 
                                        // Forma a bolla asimmetrica
                                        borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' 
                                    }}
                                >
                                    {/* Effetto luce bolla */}
                                    {!isGuessed && (
                                        <div className="absolute top-1 left-2 w-2 h-4 md:w-3 md:h-6 bg-white/40 rounded-full blur-[1px] rotate-[-15deg]"></div>
                                    )}
                                    <span className="drop-shadow-md">{letter}</span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className={`flex flex-col items-center animate-in zoom-in w-full py-4 ${gameStatus === 'WON' ? 'pt-12 md:pt-16' : ''}`}>
                        {gameStatus === 'WON' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                        
                        {/* PAROLA ESATTA SPOSTATA SOPRA IL TITOLO */}
                        <p className="text-gray-800 font-bold mb-2 text-xl px-4 text-center leading-tight">
                            La parola era: <br className="sm:hidden" />
                            <span className="text-purple-700 uppercase font-black break-all">{targetWord}</span>
                        </p>

                        <h3 className={`text-4xl md:text-5xl font-black mb-4 ${gameStatus === 'WON' ? 'text-green-700' : 'text-red-600'}`}>
                            {gameStatus === 'WON' ? 'HAI VINTO! 🎉' : 'OH NO! 😱'}
                        </h3>
                        
                        {gameStatus === 'WON' && rewardGivenForThisWord && (
                            <div className="bg-yellow-400 text-black px-6 py-2 rounded-xl font-black text-xl border-2 border-black mb-4 animate-pulse inline-block transform rotate-[-2deg]">
                                + PUNTO LIVELLO!
                            </div>
                        )}

                        {/* FRECCIA CARTOON CHE PUNTA IN BASSO AL TASTO NUOVA PAROLA */}
                        {gameStatus === 'WON' && (
                            <div className="absolute bottom-4 right-4 animate-bounce">
                                <div className="relative">
                                    <ArrowBigDown 
                                        size={64} 
                                        className="text-yellow-400 fill-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,1)]" 
                                        stroke="black"
                                        strokeWidth={2}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* BOTTOM INFO HUD - Alzato a bottom-40 per renderlo più visibile */}
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-50">
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
