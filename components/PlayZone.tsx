import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Loader2, ArrowLeft, Store, ShoppingBag, Check, Sparkles } from 'lucide-react';
import RobotHint from './RobotHint';
import { getProgress, addTokens } from '../services/tokens';
import Newsstand from './Newsstand';
import { OFFICIAL_LOGO } from '../constants';

// Lazy Load Games
const QuizGame = React.lazy(() => import('./QuizGame'));
const MemoryGame = React.lazy(() => import('./MemoryGame'));
const TicTacToeGame = React.lazy(() => import('./TicTacToeGame'));
const WhackGhostGame = React.lazy(() => import('./WhackGhostGame'));
const RPSGame = React.lazy(() => import('./RPSGame'));
const SimonGame = React.lazy(() => import('./SimonGame'));
const MathGame = React.lazy(() => import('./MathGame'));
const ColorMatchGame = React.lazy(() => import('./ColorMatchGame'));
const OddOneOutGame = React.lazy(() => import('./OddOneOutGame'));
const GuessNumberGame = React.lazy(() => import('./GuessNumberGame'));
const DrawingGame = React.lazy(() => import('./DrawingGame'));
const CheckersGame = React.lazy(() => import('./CheckersGame'));
const ChessGame = React.lazy(() => import('./ChessGame'));
const ConnectFourGame = React.lazy(() => import('./ConnectFourGame'));
const WordGuessGame = React.lazy(() => import('./WordGuessGame'));
const ArcadeConsole = React.lazy(() => import('./ArcadeConsole'));
const AstroBooGame = React.lazy(() => import('./AstroBooGame'));
const BooBreakerGame = React.lazy(() => import('./BooBreakerGame'));
const FlappyBooGame = React.lazy(() => import('./FlappyBooGame'));
const FallingNotesGame = React.lazy(() => import('./FallingNotesGame'));
const MazeGame = React.lazy(() => import('./MazeGame'));
const RainDodgeGame = React.lazy(() => import('./RainDodgeGame'));

const PARK_BG_MOBILE = 'https://i.postimg.cc/fLFPzmRh/percoooox.jpg';
const PARK_BG_DESKTOP = 'https://i.postimg.cc/85n0dxWj/parco169.jpg';
const NEWSSTAND_ICON = 'https://i.postimg.cc/50GkpGd7/edicolabooo.png';
const TUTORIAL_GHOST_IMG = 'https://i.postimg.cc/L6gGcsb3/indicafre-(1).png';
const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';
const PARK_TITLE_IMG = 'https://i.postimg.cc/ydM78X3g/sfondoparco-(1)-(1).png';

enum GameType {
  NONE = 'NONE',
  QUIZ = 'QUIZ',
  MEMORY = 'MEMORY',
  TICTACTOE = 'TICTACTOE',
  WHACK = 'WHACK',
  RPS = 'RPS',
  SIMON = 'SIMON',
  MATH = 'MATH',
  COLOR = 'COLOR',
  ODD = 'ODD',
  GUESS = 'GUESS',
  DRAW = 'DRAW',
  CHECKERS = 'CHECKERS',
  CHESS = 'CHESS',
  CONNECT4 = 'CONNECT4',
  WORDGUESS = 'WORDGUESS',
  ARCADE = 'ARCADE',
  ASTRO = 'ASTRO',
  BREAKER = 'BREAKER',
  FLAPPY = 'FLAPPY',
  FALLING = 'FALLING',
  MAZE = 'MAZE',
  RAIN = 'RAIN'
}

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

// ZONE DEFINITIVE (MOBILE - VERTICALE)
const ZONES_MOBILE: ZoneConfig[] = [
  { "id": "Quiz", "points": [ { "x": 13.59, "y": 29.97 }, { "x": 21.86, "y": 34.1 }, { "x": 43.98, "y": 24.95 }, { "x": 34.38, "y": 20.28 } ] },
  { "id": "Forza 4", "points": [ { "x": 43.71, "y": 13.82 }, { "x": 53.3, "y": 18.49 }, { "x": 67.7, "y": 13.1 }, { "x": 58.64, "y": 8.08 } ] },
  { "id": "Tris", "points": [ { "x": 85.02, "y": 16.33 }, { "x": 70.1, "y": 23.51 }, { "x": 83.96, "y": 28.72 }, { "x": 97.28, "y": 21.72 } ] },
  { "id": "Acchiappa Boo", "points": [ { "x": 61.57, "y": 26.38 }, { "x": 55.97, "y": 39.84 }, { "x": 70.1, "y": 42.89 }, { "x": 74.09, "y": 30.69 } ] },
  { "id": "Simon", "points": [ { "x": 81.56, "y": 44.33 }, { "x": 70.1, "y": 49.35 }, { "x": 81.82, "y": 55.1 }, { "x": 94.08, "y": 49.53 } ] },
  { "id": "Morra", "points": [ { "x": 35.71, "y": 45.41 }, { "x": 35.18, "y": 57.61 }, { "x": 55.17, "y": 56.89 }, { "x": 55.97, "y": 44.69 } ] },
  { "id": "Boo Runner", "points": [ { "x": 8.8, "y": 44.33 }, { "x": 8.26, "y": 60.66 }, { "x": 24.25, "y": 59.76 }, { "x": 22.39, "y": 40.92 } ] },
  { "id": "Scacchi", "points": [ { "x": 59.7, "y": 62.46 }, { "x": 67.7, "y": 65.87 }, { "x": 76.76, "y": 62.28 }, { "x": 67.96, "y": 57.43 } ] },
  { "id": "Dama", "points": [ { "x": 74.09, "y": 68.38 }, { "x": 82.36, "y": 72.15 }, { "x": 90.88, "y": 68.74 }, { "x": 82.89, "y": 64.79 } ] },
  { "id": "Math", "points": [ { "x": 9.33, "y": 79.33 }, { "x": 14.66, "y": 81.66 }, { "x": 19.72, "y": 79.86 }, { "x": 14.66, "y": 75.92 } ] },
  { "id": "Indovina Parola", "points": [ { "x": 19.72, "y": 75.2 }, { "x": 24.52, "y": 77.89 }, { "x": 30.38, "y": 76.45 }, { "x": 25.32, "y": 72.86 } ] },
  { "id": "Indovina Numero", "points": [ { "x": 45.58, "y": 72.33 }, { "x": 46.64, "y": 87.94 }, { "x": 57.84, "y": 88.84 }, { "x": 58.37, "y": 71.61 } ] },
  { "id": "Memory", "points": [ { "x": 28.52, "y": 91.89 }, { "x": 27.72, "y": 98.17 }, { "x": 44.78, "y": 98.17 }, { "x": 42.11, "y": 90.99 } ] },
  { "id": "Trova Intruso", "points": [ { "x": 77.29, "y": 76.63 }, { "x": 77.56, "y": 95.3 }, { "x": 86.62, "y": 96.2 }, { "x": 86.35, "y": 76.99 } ] }
];

// ZONE DEFINITIVE (DESKTOP - 16:9)
const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "Quiz", "points": [ { "x": 34.88, "y": 25.88 }, { "x": 38.09, "y": 31.95 }, { "x": 47.21, "y": 21.15 }, { "x": 43.4, "y": 15.98 } ] },
  { "id": "Forza 4", "points": [ { "x": 47.51, "y": 9.68 }, { "x": 51.52, "y": 15.08 }, { "x": 57.94, "y": 7.88 }, { "x": 54.03, "y": 2.7 } ] },
  { "id": "Tris", "points": [ { "x": 64.25, "y": 11.25 }, { "x": 57.74, "y": 19.35 }, { "x": 63.35, "y": 26.33 }, { "x": 69.47, "y": 17.78 } ] },
  { "id": "Acchiappa Boo", "points": [ { "x": 55.03, "y": 21.38 }, { "x": 52.13, "y": 38.03 }, { "x": 56.94, "y": 42.98 }, { "x": 60.14, "y": 27.9 } ] },
  { "id": "Simon", "points": [ { "x": 62.75, "y": 41.85 }, { "x": 57.34, "y": 47.93 }, { "x": 62.55, "y": 55.13 }, { "x": 67.96, "y": 47.93 } ] },
  { "id": "Morra", "points": [ { "x": 44.11, "y": 42.53 }, { "x": 44.21, "y": 57.61 }, { "x": 52.13, "y": 56.71 }, { "x": 52.13, "y": 42.53 } ] },
  { "id": "Boo Runner", "points": [ { "x": 33.28, "y": 42.53 }, { "x": 33.38, "y": 60.08 }, { "x": 39.6, "y": 58.96 }, { "x": 40, "y": 39.83 } ] },
  { "id": "Scacchi", "points": [ { "x": 56.94, "y": 56.93 }, { "x": 54.13, "y": 60.98 }, { "x": 57.04, "y": 65.03 }, { "x": 60.14, "y": 60.76 } ] },
  { "id": "Dama", "points": [ { "x": 62.95, "y": 64.58 }, { "x": 60.14, "y": 67.73 }, { "x": 62.75, "y": 71.56 }, { "x": 66.16, "y": 67.73 } ] },
  { "id": "Math", "points": [ { "x": 33.68, "y": 79.21 }, { "x": 35.69, "y": 83.03 }, { "x": 38.19, "y": 80.33 }, { "x": 35.79, "y": 76.28 } ] },
  { "id": "Indovina Parola", "points": [ { "x": 38.19, "y": 75.38 }, { "x": 39.8, "y": 78.08 }, { "x": 42.1, "y": 76.51 }, { "x": 40.4, "y": 73.13 } ] },
  { "id": "Indovina Numero", "points": [ { "x": 48.52, "y": 70.88 }, { "x": 49.02, "y": 88.43 }, { "x": 52.23, "y": 88.88 }, { "x": 52.93, "y": 72.01 } ] },
  { "id": "Memory", "points": [ { "x": 43.91, "y": 89.33 }, { "x": 39.49, "y": 95.86 }, { "x": 45.81, "y": 99.01 }, { "x": 48.82, "y": 95.18 } ] },
  { "id": "Trova Intruso", "points": [ { "x": 60.55, "y": 76.96 }, { "x": 60.55, "y": 94.51 }, { "x": 64.35, "y": 95.18 }, { "x": 64.35, "y": 76.28 } ] }
];

const PlayZone: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>(GameType.NONE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // TOKEN ECONOMY STATE
  const [tokenBalance, setTokenBalance] = useState(0);
  const [showNewsstand, setShowNewsstand] = useState(false);
  const [newsstandTab, setNewsstandTab] = useState<'SHOP' | 'ALBUM' | 'PASSPORT'>('SHOP');
  const [tokensEarnedAnimation, setTokensEarnedAnimation] = useState<number | null>(null);

  // TUTORIAL STATE
  const [showTutorial, setShowTutorial] = useState(false);

  // Interaction Tracking to prevent Hint from reappearing after playing
  const hasInteractedRef = useRef(false);

  // 1. INITIALIZATION & HINT EFFECT (Runs ONCE on mount)
  useEffect(() => {
      // Preload both images
      const imgMobile = new Image();
      imgMobile.src = PARK_BG_MOBILE;
      const imgDesktop = new Image();
      imgDesktop.src = PARK_BG_DESKTOP;

      let loadedCount = 0;
      const checkLoad = () => {
          loadedCount++;
          if (loadedCount >= 1) setIsLoaded(true);
      };

      imgMobile.onload = checkLoad;
      imgDesktop.onload = checkLoad;

      // Fallback
      setTimeout(() => setIsLoaded(true), 1500);

      window.scrollTo(0, 0);

      // --- TUTORIAL LOGIC (SESSION BASED) ---
      const tutorialSeen = sessionStorage.getItem('playzone_tutorial_seen');
      if (!tutorialSeen) {
          // If first time in this session, show tutorial
          // We wait a moment for the background to load to make the frosted effect look good
          setTimeout(() => {
              setShowTutorial(true);
              sessionStorage.setItem('playzone_tutorial_seen', 'true');
          }, 1000);
      } else {
          // Normal hint timer only if tutorial is NOT shown
          const timer = setTimeout(() => {
              if (!hasInteractedRef.current) setShowHint(true);
          }, 5000);
          return () => clearTimeout(timer);
      }

  }, []); 

  // 2. GAME STATE & TOKEN EFFECT (Runs when activeGame changes)
  useEffect(() => {
      // Load Tokens (Refresh when returning from game)
      const current = getProgress();
      setTokenBalance(current.tokens);

      // Listen for updates from other tabs/modals
      const updateHandler = () => {
          const updated = getProgress();
          setTokenBalance(updated.tokens);
      };
      window.addEventListener('progressUpdated', updateHandler);

      return () => {
          window.removeEventListener('progressUpdated', updateHandler);
      };
  }, [activeGame]);

  const handleInteraction = () => {
      if (showHint) setShowHint(false);
  };

  const getClipPath = (points: Point[]) => {
      if (!points || points.length === 0) return 'none';
      const poly = points.map(p => `${p.x}% ${p.y}%`).join(', ');
      return `polygon(${poly})`;
  };

  const handleZoneClick = (zoneId: string) => {
      setShowHint(false);
      setShowTutorial(false); // Ensure tutorial is closed if they manage to click through
      hasInteractedRef.current = true; 
      
      switch (zoneId) {
          case 'Quiz': setActiveGame(GameType.QUIZ); break;
          case 'Forza 4': setActiveGame(GameType.CONNECT4); break;
          case 'Tris': setActiveGame(GameType.TICTACTOE); break;
          case 'Acchiappa Boo': setActiveGame(GameType.WHACK); break;
          case 'Simon': setActiveGame(GameType.SIMON); break;
          case 'Morra': setActiveGame(GameType.RPS); break;
          case 'Boo Runner': setActiveGame(GameType.ARCADE); break;
          case 'Scacchi': setActiveGame(GameType.CHESS); break;
          case 'Dama': setActiveGame(GameType.CHECKERS); break;
          case 'Math': setActiveGame(GameType.MATH); break;
          case 'Indovina Parola': setActiveGame(GameType.WORDGUESS); break;
          case 'Indovina Numero': setActiveGame(GameType.GUESS); break;
          case 'Memory': setActiveGame(GameType.MEMORY); break;
          case 'Trova Intruso': setActiveGame(GameType.ODD); break;
          default: setActiveGame(GameType.NONE); break;
      }
  };

  const handleEarnTokens = (amount: number) => {
      // addTokens returns the new total, explicitly typed as number
      const newTotal = addTokens(amount);
      setTokenBalance(newTotal);
      setTokensEarnedAnimation(amount);
      setTimeout(() => setTokensEarnedAnimation(null), 2000);
  };

  const handleOpenNewsstand = (tab?: 'SHOP' | 'ALBUM' | 'PASSPORT') => {
      setNewsstandTab(tab || 'SHOP');
      setShowNewsstand(true);
      setShowTutorial(false);
  };

  const renderGame = () => {
    const commonProps = { 
        onBack: () => setActiveGame(GameType.NONE),
        onEarnTokens: handleEarnTokens,
        onOpenNewsstand: () => handleOpenNewsstand('PASSPORT')
    };

    const Component = (() => {
      switch (activeGame) {
        case GameType.QUIZ: return QuizGame;
        case GameType.MEMORY: return MemoryGame;
        case GameType.TICTACTOE: return TicTacToeGame;
        case GameType.WHACK: return WhackGhostGame;
        case GameType.RPS: return RPSGame;
        case GameType.SIMON: return SimonGame;
        case GameType.MATH: return MathGame;
        case GameType.COLOR: return ColorMatchGame;
        case GameType.ODD: return OddOneOutGame;
        case GameType.GUESS: return GuessNumberGame;
        case GameType.DRAW: return DrawingGame;
        case GameType.CHECKERS: return CheckersGame;
        case GameType.CHESS: return ChessGame;
        case GameType.CONNECT4: return ConnectFourGame;
        case GameType.WORDGUESS: return WordGuessGame;
        case GameType.ARCADE: return ArcadeConsole;
        case GameType.ASTRO: return AstroBooGame;
        case GameType.BREAKER: return BooBreakerGame;
        case GameType.FLAPPY: return FlappyBooGame;
        case GameType.FALLING: return FallingNotesGame;
        case GameType.MAZE: return MazeGame;
        case GameType.RAIN: return RainDodgeGame;
        default: return null;
      }
    })();

    if (!Component) return null;

    return (
      <Suspense 
        fallback={
          <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in">
            <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
            <p className="font-bold text-lg text-white mt-4 tracking-widest animate-pulse">STO CARICANDO...</p>
          </div>
        }
      >
        {/* @ts-ignore - dynamic prop passing */}
        <Component {...commonProps} />
      </Suspense>
    );
  };

  // VISTA GIOCO ATTIVO (FISSA E RESPONSIVA)
  if (activeGame !== GameType.NONE) {
      return (
          <div className="w-full h-full flex flex-col relative overflow-hidden">
                {/* TOKEN EARNED POPUP */}
                {tokensEarnedAnimation && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] animate-in zoom-in slide-in-from-bottom-10 duration-500 pointer-events-none">
                        <div className="bg-yellow-400 text-black font-black text-3xl px-6 py-3 rounded-full border-4 border-white shadow-[0_0_30px_gold] flex items-center gap-2">
                            <span>+{tokensEarnedAnimation}</span> 🪙
                        </div>
                    </div>
                )}

                {showNewsstand && <Newsstand onClose={() => setShowNewsstand(false)} initialTab={newsstandTab} />}

                {/* HEADER FOR GAMES (ARCADE HAS ITS OWN HEADER usually but we can keep minimal padding if needed) */}
                {activeGame !== GameType.ARCADE && (
                    <div className="w-full p-3 flex items-center justify-between shrink-0 bg-transparent z-40">
                        <button
                            onClick={() => setActiveGame(GameType.NONE)}
                            className="hover:scale-105 active:scale-95 transition-transform"
                        >
                            <img 
                                src={EXIT_BTN_IMG} 
                                alt="Ritorna al Parco" 
                                className="h-12 md:h-14 w-auto drop-shadow-md" 
                            />
                        </button>
                        
                        <div 
                            className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black hover:bg-black/60 transition-colors cursor-default"
                        >
                            <span>{tokenBalance}</span> 🪙
                        </div>
                    </div>
                )}

                {/* GAME CONTAINER: Flex-1 to take remaining space, hidden overflow to prevent scroll */}
                <div className={`flex-1 w-full h-full relative overflow-hidden flex flex-col items-center justify-center ${activeGame === GameType.ARCADE ? 'p-0' : 'p-2'}`}>
                    {renderGame()}
                </div>
          </div>
      );
  }

  // VISTA PRINCIPALE (PARCO GIOCHI)
  return (
    <div 
        className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gradient-to-b from-[#b388f4] to-white overflow-hidden flex flex-col"
        onClick={handleInteraction}
    >
        {!isLoaded && (
            <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-green-600/90 backdrop-blur-md">
                <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                <span className="text-white font-bold text-lg tracking-widest animate-pulse">
                    STO CARICANDO...
                </span>
            </div>
        )}

        {isLoaded && (
            <>
                {/* PARK TITLE IMAGE (TOP LEFT) - RESIZED AND STYLED AS REQUESTED */}
                <div className="absolute top-2 left-2 z-30 animate-in slide-in-from-left duration-500 pointer-events-none">
                    <img 
                        src={PARK_TITLE_IMG} 
                        alt="Parco Giochi" 
                        className="w-28 md:w-48 h-auto object-contain transition-transform duration-500" 
                        style={{
                            // "Cloud" effect: Multiple white drop shadows to create a thick, soft glow
                            filter: 'drop-shadow(0px 0px 8px rgba(255, 255, 255, 0.9)) drop-shadow(0px 0px 15px rgba(255, 255, 255, 0.7))'
                        }}
                    />
                </div>

                {/* --- TUTORIAL OVERLAY (FROSTED GLASS, NO BOX, HIGHLIGHTED ICON) --- */}
                {showTutorial && (
                    <div 
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md animate-in fade-in cursor-pointer"
                        onClick={() => setShowTutorial(false)}
                    >
                        {/* TEXT & ARROW - Spostato leggermente verso destra */}
                        <div className="absolute top-24 right-16 md:right-64 w-72 text-right flex flex-col items-end z-[101] pointer-events-none">
                             <div className="mb-0 mr-20 md:mr-6 mt-12 animate-bounce">
                                <img 
                                    src={TUTORIAL_GHOST_IMG} 
                                    alt="Guarda qui" 
                                    className="w-40 h-40 object-contain drop-shadow-xl transform rotate-12" 
                                />
                             </div>
                             
                             <div className="flex flex-col gap-1 items-end drop-shadow-[0_4px_0_black]">
                                 <p className="font-luckiest text-3xl text-white uppercase leading-none transform -rotate-2">
                                     EHI! PSST!
                                 </p>
                                 <p className="font-luckiest text-2xl text-yellow-300 uppercase leading-none transform -rotate-1">
                                     PRIMA DI GIOCARE...
                                 </p>
                                 <p className="font-luckiest text-xl text-white uppercase leading-tight mt-2 w-full text-right">
                                     Tocca qui per fare <br/> la tua <span className="text-cyan-300">TESSERA</span>!
                                 </p>
                                 <p className="font-bold text-white/80 text-xs mt-1">
                                     (Salva i tuoi gettoni!)
                                 </p>
                             </div>
                        </div>

                        {/* THE "CUTOUT" / HIGHLIGHTED NEWSSTAND CLONE */}
                        <div className="absolute top-0 right-0 z-[102] p-0 md:p-2 pointer-events-auto">
                            <div className="relative group cursor-pointer" onClick={(e) => { e.stopPropagation(); handleOpenNewsstand('PASSPORT'); }}>
                                <div className="group-hover:scale-105 transition-transform w-32 h-32 md:w-64 md:h-64 origin-top-right">
                                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                    <img 
                                        src={NEWSSTAND_ICON} 
                                        alt="Edicola Highlight" 
                                        className="w-full h-full object-contain drop-shadow-2xl relative z-10" 
                                    />
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-black text-sm md:text-lg px-4 py-1 rounded-full border-4 border-black shadow-lg whitespace-nowrap z-20">
                                    {tokenBalance} 🪙
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* NORMAL NEWSSTAND ICON (Visible underneath overlay or when overlay is gone) */}
                <div className="absolute top-0 right-0 z-30 animate-in slide-in-from-right duration-500 p-0 md:p-2 pointer-events-none">
                    <div className="relative group cursor-pointer pointer-events-auto" onClick={() => handleOpenNewsstand('SHOP')}>
                        <div className="group-hover:scale-105 transition-transform w-32 h-32 md:w-64 md:h-64 origin-top-right">
                            <img 
                                src={NEWSSTAND_ICON} 
                                alt="Edicola" 
                                className="w-full h-full object-contain drop-shadow-2xl" 
                            />
                        </div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-black text-sm md:text-lg px-4 py-1 rounded-full border-4 border-black shadow-lg whitespace-nowrap z-10">
                            {tokenBalance} 🪙
                        </div>
                    </div>
                </div>
            </>
        )}

        {showNewsstand && <Newsstand onClose={() => setShowNewsstand(false)} initialTab={newsstandTab} />}

        <RobotHint 
            show={showHint && isLoaded && !showTutorial} 
            message="Tocca un gioco per vincere gettoni!"
        />

        <div className="relative flex-1 w-full h-full overflow-hidden select-none">
            <div className="block md:hidden w-full h-full relative">
                <img 
                    src={PARK_BG_MOBILE} 
                    alt="Lone Boo Parco Giochi Mobile" 
                    className={`w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {ZONES_MOBILE.map((zone, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 cursor-pointer"
                        style={{ clipPath: getClipPath(zone.points) }}
                        onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }}
                    ></div>
                ))}
            </div>

            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img 
                    src={PARK_BG_DESKTOP} 
                    alt="Lone Boo Parco Giochi Desktop" 
                    className={`absolute inset-0 w-full h-full object-fill object-center animate-in fade-in duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    draggable={false}
                />
                {ZONES_DESKTOP.map((zone, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 cursor-pointer"
                        style={{ clipPath: getClipPath(zone.points) }}
                        onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }}
                    ></div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default PlayZone;