
import React, { useState, Suspense, useEffect, useRef, useMemo, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { getProgress, addTokens } from '../services/tokens';
import { OFFICIAL_LOGO } from '../constants';
import { AppView } from '../types';
import { getWeatherForDate, isNightTime } from '../services/weatherService';

// --- LAZY LOADED GAMES ---
const QuizGame = lazy(() => import('./QuizGame'));
const MemoryGame = lazy(() => import('./MemoryGame'));
const TicTacToeGame = lazy(() => import('./TicTacToeGame'));
const WhackGhostGame = lazy(() => import('./WhackGhostGame'));
const RPSGame = lazy(() => import('./RPSGame'));
const SimonGame = lazy(() => import('./SimonGame'));
const MathGame = lazy(() => import('./MathGame'));
const OddOneOutGame = lazy(() => import('./OddOneOutGame'));
const GuessNumberGame = lazy(() => import('./GuessNumberGame'));
const CheckersGame = lazy(() => import('./CheckersGame'));
const ChessGame = lazy(() => import('./ChessGame'));
const ConnectFourGame = lazy(() => import('./ConnectFourGame'));
const WordGuessGame = lazy(() => import('./WordGuessGame'));
const ArcadeConsole = lazy(() => import('./ArcadeConsole'));
const BingoGame = lazy(() => import('./BingoGame'));

const PARK_BG_SUN_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nuvoprcogiochi44r4e3w.webp';
const PARK_BG_SUN_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newparcogiochimape3rfcxxs.webp';

const PARK_BG_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giochibneveeso.webp';
const PARK_BG_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giochipiaggieso.webp';
const PARK_BG_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giochiventoeso.webp';

// Nuovi Asset Notturni
const PLAY_NIGHT_SUN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/parconottesoledsa.webp';
const PLAY_NIGHT_RAIN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/parconottepioggiadsx.webp';
const PLAY_NIGHT_WIND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/parconotteventores.webp';
const PLAY_NIGHT_SNOW = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/parconottenevexxz.webp';

// Asset Audio e Video
const AMBIENT_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/parcogiochispeechboo6tr64.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

enum GameType {
  NONE = 'NONE',
  QUIZ = 'QUIZ',
  MEMORY = 'MEMORY',
  TICTACTOE = 'TICTACTOE',
  WHACK = 'WHACK',
  RPS = 'RPS',
  SIMON = 'SIMON',
  MATH = 'MATH',
  ODD = 'ODD',
  GUESS = 'GUESS',
  CHECKERS = 'CHECKERS',
  CHESS = 'CHESS',
  CONNECT4 = 'CONNECT4',
  WORDGUESS = 'WORDGUESS',
  ARCADE = 'ARCADE',
  BINGO = 'BINGO'
}

type Point = { x: number; y: number };

const INITIAL_MAP_DATA: Record<string, Point[]> = {
  "QUIZ": [
    { "x": 57.3, "y": 24.28 },
    { "x": 55.17, "y": 37.32 },
    { "x": 67.96, "y": 35.22 },
    { "x": 69.56, "y": 24.43 }
  ],
  "FORZA_4": [
    { "x": 78.62, "y": 25.93 },
    { "x": 75.43, "y": 38.22 },
    { "x": 93.82, "y": 41.37 },
    { "x": 93.55, "y": 27.73 }
  ],
  "TRIS": [
    { "x": 23.19, "y": 45.71 },
    { "x": 40.78, "y": 50.81 },
    { "x": 57.3, "y": 47.21 },
    { "x": 42.38, "y": 41.82 }
  ],
  "ACCHIAPPA_BOO": [
    { "x": 3.46, "y": 47.21 },
    { "x": 13.59, "y": 56.21 },
    { "x": 26.12, "y": 54.41 },
    { "x": 17.06, "y": 44.51 }
  ],
  "SIMON_BOO": [
    { "x": 38.65, "y": 58.75 },
    { "x": 49.31, "y": 61.15 },
    { "x": 60.5, "y": 58.75 },
    { "x": 49.84, "y": 52.76 }
  ],
  "MORRA": [
    { "x": 3.2, "y": 33.12 },
    { "x": 11.19, "y": 43.17 },
    { "x": 27.19, "y": 41.52 },
    { "x": 18.39, "y": 30.88 }
  ],
  "DAMA": [
    { "x": 67.16, "y": 43.17 },
    { "x": 74.09, "y": 46.31 },
    { "x": 81.82, "y": 43.76 },
    { "x": 75.43, "y": 40.62 }
  ],
  "SCACCHI": [
    { "x": 61.03, "y": 51.71 },
    { "x": 70.63, "y": 54.41 },
    { "x": 77.56, "y": 52.61 },
    { "x": 69.3, "y": 49.01 }
  ],
  "MATEMATICA_MAGICA": [
    { "x": 2.4, "y": 60.85 },
    { "x": 15.72, "y": 68.94 },
    { "x": 27.99, "y": 65.65 },
    { "x": 19.19, "y": 58.45 }
  ],
  "INDOVINA_LA_PAROLA": [
    { "x": 83.42, "y": 44.81 },
    { "x": 81.82, "y": 54.41 },
    { "x": 96.75, "y": 57.55 },
    { "x": 97.81, "y": 46.46 }
  ],
  "INDOVINA_IL_NUMERO": [
    { "x": 32.52, "y": 63.85 },
    { "x": 30.65, "y": 72.99 },
    { "x": 42.64, "y": 73.14 },
    { "x": 45.58, "y": 64.15 }
  ],
  "TROVA_INTRUSO": [
    { "x": 34.91, "y": 26.83 },
    { "x": 32.25, "y": 35.82 },
    { "x": 49.04, "y": 37.02 },
    { "x": 48.51, "y": 26.23 }
  ],
  "MEMORY": [
    { "x": 61.57, "y": 68.79 },
    { "x": 74.36, "y": 72.69 },
    { "x": 94.35, "y": 62.2 },
    { "x": 80.49, "y": 58.9 }
  ],
  "SALA_GIOCHI": [
    { "x": 30.38, "y": 89.48 },
    { "x": 6.4, "y": 95.77 },
    { "x": 2.13, "y": 74.64 },
    { "x": 21.59, "y": 74.19 }
  ],
  "EDICOLA": [
    { "x": 80.76, "y": 73.89 },
    { "x": 98.08, "y": 71.49 },
    { "x": 97.01, "y": 96.97 },
    { "x": 78.89, "y": 94.12 }
  ],
  "TORNA_IN_CITTA": [
    { "x": 64.23, "y": 84.23 },
    { "x": 65.03, "y": 92.78 },
    { "x": 74.89, "y": 93.08 },
    { "x": 75.96, "y": 83.63 }
  ]
};

interface PlayZoneProps {
  setView: (view: AppView) => void;
}

const PlayZone: React.FC<PlayZoneProps> = ({ setView }) => {
  const [now, setNow] = useState(new Date());
  const [activeGame, setActiveGame] = useState<GameType>(GameType.NONE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(() => getProgress().tokens);
  const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
  const [isPlaying, setIsPlaying] = useState(false);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  const todayWeather = useMemo(() => getWeatherForDate(now), [now]);

  const currentBgMobile = useMemo(() => {
    const isNight = isNightTime(now);
    if (isNight) {
      switch (todayWeather) {
        case 'SNOW': return PLAY_NIGHT_SNOW;
        case 'RAIN': return PLAY_NIGHT_RAIN;
        case 'WIND': return PLAY_NIGHT_WIND;
        default: return PLAY_NIGHT_SUN;
      }
    } else {
      switch (todayWeather) {
        case 'SNOW': return PARK_BG_SNOW;
        case 'RAIN': return PARK_BG_RAIN;
        case 'WIND': return PARK_BG_WIND;
        default: return PARK_BG_SUN_MOBILE;
      }
    }
  }, [todayWeather, now]);

  const currentBgDesktop = useMemo(() => {
    const isNight = isNightTime(now);
    if (isNight) {
      switch (todayWeather) {
        case 'SNOW': return PLAY_NIGHT_SNOW;
        case 'RAIN': return PLAY_NIGHT_RAIN;
        case 'WIND': return PLAY_NIGHT_WIND;
        default: return PLAY_NIGHT_SUN;
      }
    } else {
      switch (todayWeather) {
        case 'SNOW': return PARK_BG_SNOW;
        case 'RAIN': return PARK_BG_RAIN;
        case 'WIND': return PARK_BG_WIND;
        default: return PARK_BG_SUN_DESKTOP;
      }
    }
  }, [todayWeather, now]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);

    const handleProgressUpdate = () => {
      setTokenBalance(getProgress().tokens);
    };
    window.addEventListener('progressUpdated', handleProgressUpdate);
    
    const bgUrl = window.innerWidth < 768 ? currentBgMobile : currentBgDesktop;
    const img = new Image(); 
    img.src = bgUrl;
    img.onload = () => setIsLoaded(true);

    if (!ambientAudioRef.current) {
      ambientAudioRef.current = new Audio(AMBIENT_VOICE_URL);
      ambientAudioRef.current.loop = false;
      ambientAudioRef.current.volume = 0.5;
      ambientAudioRef.current.addEventListener('play', () => setIsPlaying(true));
      ambientAudioRef.current.addEventListener('pause', () => setIsPlaying(false));
      ambientAudioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        // Fixed: Changed 'audioRef' to 'ambientAudioRef' to fix 'Cannot find name' error
        if (ambientAudioRef.current) ambientAudioRef.current.currentTime = 0;
      });
    }

    if (isAudioOn && activeGame === GameType.NONE) {
      ambientAudioRef.current.play().catch(e => console.log("Audio blocked", e));
    }

    const handleGlobalAudioChange = () => {
      const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
      setIsAudioOn(enabled);
      if (enabled && activeGame === GameType.NONE) ambientAudioRef.current?.play().catch(() => { });
      else ambientAudioRef.current?.pause();
    };
    window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

    const safetyTimer = setTimeout(() => setIsLoaded(true), 400);
    return () => {
      clearInterval(timer);
      clearTimeout(safetyTimer);
      window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
      window.removeEventListener('progressUpdated', handleProgressUpdate);
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        ambientAudioRef.current.currentTime = 0;
      }
    };
  }, [activeGame, isAudioOn, currentBgMobile, currentBgDesktop]);

  const getClipPath = (points: Point[]) => {
      if (!points || points.length < 3) return 'none';
      return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
  };

  const handleZoneClick = (key: string) => {
    switch (key) {
        case 'QUIZ': setActiveGame(GameType.QUIZ); break;
        case 'MEMORY': setActiveGame(GameType.MEMORY); break;
        case 'TRIS': setActiveGame(GameType.TICTACTOE); break;
        case 'ACCHIAPPA_BOO': setActiveGame(GameType.WHACK); break;
        case 'MORRA': setActiveGame(GameType.RPS); break;
        case 'SIMON_BOO': setActiveGame(GameType.SIMON); break;
        case 'MATEMATICA_MAGICA': setActiveGame(GameType.MATH); break;
        case 'TROVA_INTRUSO': setActiveGame(GameType.ODD); break;
        case 'INDOVINA_IL_NUMERO': setActiveGame(GameType.GUESS); break;
        case 'FORZA_4': setActiveGame(GameType.CONNECT4); break;
        case 'INDOVINA_LA_PAROLA': setActiveGame(GameType.WORDGUESS); break;
        case 'SALA_GIOCHI': setActiveGame(GameType.ARCADE); break;
        case 'DAMA': setActiveGame(GameType.CHECKERS); break;
        case 'SCACCHI': setActiveGame(GameType.CHESS); break;
        case 'EDICOLA': setView(AppView.NEWSSTAND); break;
        case 'TORNA_IN_CITTA': handleExit(); break;
    }
  };

  const handleExit = () => {
    const origin = sessionStorage.getItem('play_origin') as AppView;
    if (origin && Object.values(AppView).includes(origin)) {
        setView(origin);
    } else {
        setView(AppView.CITY_MAP);
    }
    sessionStorage.removeItem('play_origin');
  };

  if (activeGame !== GameType.NONE) {
    return (
      <div className="fixed inset-0 z-0 bg-slate-900 flex flex-col animate-in fade-in duration-300 pt-[64px] md:pt-[96px]">
        {/* Rimosso il div della barra duplicata qui */}
        <Suspense fallback={
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-800">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
            <span className="text-white font-black tracking-widest uppercase">Preparo il gioco...</span>
          </div>
        }>
          {activeGame === GameType.QUIZ && <QuizGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.MEMORY && <MemoryGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.TICTACTOE && <TicTacToeGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.WHACK && <WhackGhostGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.RPS && <RPSGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} />}
          {activeGame === GameType.SIMON && <SimonGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.MATH && <MathGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} />}
          {activeGame === GameType.ODD && <OddOneOutGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.GUESS && <GuessNumberGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} />}
          {activeGame === GameType.CHECKERS && <CheckersGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.CHESS && <ChessGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.CONNECT4 && <ConnectFourGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.WORDGUESS && <WordGuessGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} onOpenNewsstand={() => setView(AppView.NEWSSTAND)} />}
          {activeGame === GameType.ARCADE && <ArcadeConsole onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} />}
          {activeGame === GameType.BINGO && <BingoGame onBack={() => setActiveGame(GameType.NONE)} onEarnTokens={n => addTokens(n)} />}
        </Suspense>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-green-900 overflow-hidden touch-none overscroll-none select-none">
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-green-600/95 backdrop-blur-md">
          <img src={OFFICIAL_LOGO} alt="Loading" className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
          <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Entro nel Parco...</span>
        </div>
      )}

      {isLoaded && isAudioOn && isPlaying && (
        <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
          <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
            <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
          </div>
        </div>
      )}

      <div 
        className="absolute inset-0 z-0"
      >
        <picture>
          <source media="(max-width: 768px)" srcSet={currentBgMobile} />
          <img src={currentBgDesktop} alt="Parco Giochi" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
        </picture>
        
        {isLoaded && (
          <div className="absolute top-[74%] right-[4%] z-[60] animate-in slide-in-from-bottom-2 duration-700 pointer-events-auto">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl transition-transform hover:scale-105">
                  <span>{tokenBalance}</span> <span className="text-xl">🪙</span>
              </div>
          </div>
        )}

        {isLoaded && (Object.entries(INITIAL_MAP_DATA) as [string, Point[]][]).map(([key, pts]) => {
          return (
            <div
              key={key}
              onPointerDown={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                handleZoneClick(key); 
              }}
              className="absolute inset-0 z-10 cursor-pointer active:bg-white/10 pointer-events-auto"
              style={{ clipPath: getClipPath(pts) }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlayZone;
