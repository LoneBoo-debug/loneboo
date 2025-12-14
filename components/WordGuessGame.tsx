
import React, { useState, useEffect } from 'react';
import { RotateCcw, Check, X, LogOut } from 'lucide-react';
import SaveReminder from './SaveReminder';

const WORDS = [
    // MAGIA & FANTASIA
    'FANTASMA', 'ZUCCA', 'CASTELLO', 'MAGIA', 'AMICI', 'NOTTE', 'STELLA', 'LUNA', 'DRAGO', 'FORESTA',
    'RE', 'REGINA', 'PRINCIPESSA', 'PRINCIPE', 'MAGO', 'STREGA', 'FATA', 'FOLLETTO', 'TESORO', 'SPADA',
    'POZIONE', 'MANTELLO', 'CORONA', 'BACCHETTA', 'MOSTRO', 'UNICORNO', 'GNOMO', 'ORCO', 'INCANTESIMO', 'LIBRO',

    // ANIMALI
    'CANE', 'GATTO', 'LEONE', 'TIGRE', 'ELEFANTE', 'GIRAFFA', 'ORSO', 'LUPO', 'VOLPE', 'CONIGLIO',
    'TOPO', 'DELFINO', 'BALENA', 'SQUALO', 'RANA', 'FARFALLA', 'APE', 'UCCELLO', 'GUFO', 'PINGUINO',
    'CAVALLO', 'MUCCA', 'PECORA', 'MAIALE', 'GALLINA', 'RAGNO', 'FORMICA', 'LUMACA', 'TARTARUGA', 'PESCE',
    'SCIMMIA', 'ZEBRA', 'SERPENTE', 'COCCODRILLO', 'IPPOPOTAMO', 'CANGURO', 'PANDA', 'AQUILA', 'PAPERA',

    // NATURA & TEMPO
    'SOLE', 'PIOGGIA', 'NEVE', 'VENTO', 'MARE', 'MONTAGNA', 'FIUME', 'LAGO', 'ALBERO', 'FIORE',
    'FOGLIA', 'ERBA', 'CIELO', 'NUVOLA', 'ARCOBALENO', 'FULMINE', 'TEMPORALE', 'SABBIA', 'SASSO', 'VULCANO',
    'ISOLA', 'GROTTA', 'PRATO', 'BOSCO', 'GHIACCIO', 'FUOCO', 'ACQUA', 'TERRA', 'ARIA', 'STAGIONE',

    // CIBO
    'PIZZA', 'PASTA', 'PANE', 'TORTA', 'GELATO', 'MELA', 'BANANA', 'ARANCIA', 'FRAGOLA', 'CIOCCOLATO',
    'BISCOTTO', 'CARAMELLA', 'LATTE', 'SUCCO', 'FORMAGGIO', 'UVA', 'PERA', 'LIMONE', 'PATATA', 'POMODORO',
    'CAROTA', 'INSALATA', 'UOVO', 'PESCA', 'CILIEGIA', 'ANGURIA', 'ANANAS', 'MANDARINO', 'MIELE', 

    // SCUOLA & OGGETTI
    'SCUOLA', 'ZAINO', 'QUADERNO', 'PENNA', 'MATITA', 'GOMMA', 'LAVAGNA', 'BANCO', 'AULA', 'MAESTRA',
    'DISEGNO', 'COLORI', 'FORBICI', 'COLLA', 'RIGHELLO', 'ASTUCCIO', 'PAGINA', 'LETTURA', 'SCRIVERE',
    'CASA', 'TAVOLO', 'SEDIA', 'LETTO', 'DIVANO', 'LAMPADA', 'SPECCHIO', 'OROLOGIO', 'PORTA', 'FINESTRA',

    // GIOCHI & SPORT
    'GIOCO', 'PALLA', 'BAMBOLA', 'TRENO', 'MACCHINA', 'AEREO', 'NAVE', 'BICI', 'PATTINI', 'AQUILONE',
    'CALCIO', 'NUOTO', 'CORSA', 'SALTO', 'BASKET', 'TENNIS', 'DADI', 'CARTE', 'PUZZLE', 'ROBOT',

    // EMOZIONI & PERSONE
    'AMORE', 'FELICITA', 'SORRISO', 'PAURA', 'RABBIA', 'TRISTEZZA', 'MAMMA', 'PAPA', 'NONNO', 'NONNA',
    'FRATELLO', 'SORELLA', 'ZIO', 'ZIA', 'CUGINO', 'AMICO', 'BAMBINO', 'RAGAZZO', 'UOMO', 'DONNA',

    // COLORI & VARI
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
  const [lives, setLives] = useState(6);
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [rewardGiven, setRewardGiven] = useState(false);

  useEffect(() => {
      startNewGame();
  }, []);

  const startNewGame = () => {
      const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      setTargetWord(randomWord);
      setGuessedLetters([]);
      setLives(6);
      setGameStatus('PLAYING');
      setRewardGiven(false);
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
          // Check Win
          const isWon = targetWord.split('').every(char => newGuessed.includes(char));
          if (isWon) setGameStatus('WON');
      }
  };

  // EARN TOKENS (Fixed 5 tokens)
  useEffect(() => {
      if (gameStatus === 'WON' && !rewardGiven && onEarnTokens) {
          onEarnTokens(5);
          setRewardGiven(true);
      }
  }, [gameStatus, rewardGiven, onEarnTokens]);

  // Logic to determine box size
  const getBoxSizeClass = () => {
      const len = targetWord.length;
      if (len > 10) return 'w-6 h-9 text-lg md:w-10 md:h-14 md:text-3xl'; // Very long words
      if (len > 7) return 'w-8 h-12 text-2xl md:w-12 md:h-16 md:text-4xl';  // Long words
      return 'w-10 h-14 text-3xl md:w-14 md:h-20 md:text-5xl';             // Short/Normal words
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center animate-fade-in text-center pb-8">
        <h2 className="text-4xl md:text-5xl font-black text-boo-orange mb-6 relative z-10" style={{ textShadow: "3px 3px 0px black" }}>
            Parola Magica
        </h2>

        {/* Lives Display */}
        <div className="flex flex-col items-center mb-8">
            <p className="font-bold text-gray-600 mb-2 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm border-2 border-white/50">
                Vite disponibili: <span className="text-boo-purple text-xl font-black">{lives}</span>
            </p>
            <div className="flex gap-2 text-2xl">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={`transition-opacity ${i < lives ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                        👻
                    </span>
                ))}
            </div>
        </div>

        {/* Word Display - NOW ALWAYS ON ONE LINE */}
        <div className="flex flex-nowrap justify-center gap-1 md:gap-2 mb-10 px-1 w-full overflow-hidden">
            {targetWord.split('').map((char, idx) => (
                <div 
                    key={idx} 
                    className={`
                        border-b-4 border-black flex items-center justify-center font-black text-boo-purple bg-white rounded-lg shrink-0
                        ${getBoxSizeClass()}
                        ${gameStatus === 'LOST' && !guessedLetters.includes(char) ? 'text-red-400' : ''}
                    `}
                >
                    {guessedLetters.includes(char) || gameStatus === 'LOST' ? char : ''}
                </div>
            ))}
        </div>

        {/* Keyboard - 7 Columns Grid */}
        {gameStatus === 'PLAYING' ? (
            <div className="grid grid-cols-7 gap-2 md:gap-3 max-w-lg w-full px-4 mb-8">
                {ALPHABET.map((letter) => {
                    const isGuessed = guessedLetters.includes(letter);
                    const isCorrect = targetWord.includes(letter);
                    
                    let bgClass = 'bg-white hover:bg-gray-100 border-gray-300 text-gray-800';
                    
                    if (isGuessed) {
                        bgClass = isCorrect ? 'bg-green-500 border-green-700 text-white opacity-50' : 'bg-gray-300 border-gray-400 text-gray-500 opacity-50';
                    }

                    return (
                        <button
                            key={letter}
                            onClick={() => handleGuess(letter)}
                            disabled={isGuessed}
                            className={`
                                aspect-square w-full rounded-xl border-b-4 font-black text-xl md:text-2xl transition-all flex items-center justify-center
                                ${bgClass}
                                ${!isGuessed ? 'active:translate-y-1 active:border-b-0 shadow-md' : ''}
                            `}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>
        ) : (
            <div className="mb-8 animate-in zoom-in bg-white p-6 rounded-3xl border-4 border-black shadow-lg relative">
                {/* SAVE REMINDER */}
                {gameStatus === 'WON' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}

                <h3 className={`text-3xl font-black mb-2 ${gameStatus === 'WON' ? 'text-green-500' : 'text-red-500'}`}>
                    {gameStatus === 'WON' ? 'HAI VINTO! 🎉' : 'OH NO! 😱'}
                </h3>
                <p className="text-gray-600 font-bold mb-2">La parola era: <span className="text-boo-purple uppercase">{targetWord}</span></p>
                {gameStatus === 'WON' && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-black text-xl border-2 border-yellow-400 inline-block">
                        +5 GETTONI GUADAGNATI! 🪙
                    </div>
                )}
            </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
            <button onClick={startNewGame} className="bg-boo-green text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 active:translate-y-1 shadow-[4px_4px_0_black] flex items-center gap-2">
                <RotateCcw size={20} /> Nuova Parola
            </button>
            <button onClick={onBack} className="bg-red-500 text-white font-black px-6 py-3 rounded-full border-4 border-black hover:scale-105 active:translate-y-1 shadow-[4px_4px_0_black] flex items-center gap-2">
                <LogOut size={20} /> Esci
            </button>
        </div>
    </div>
  );
};

export default WordGuessGame;
