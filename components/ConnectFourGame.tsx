
import { getProgress, unlockHardMode, isAnyAlbumComplete, addTokens } from '../services/tokens';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';
import { isNightTime } from '../services/weatherService';
import { TOKEN_ICON_URL } from '../constants';
import TokenIcon from './TokenIcon';
import { db, auth } from '../firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDoc, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Users, User, Monitor, ChevronDown, Send, Check, AlertCircle, X } from 'lucide-react';

const NEW_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/connect4.webp';
const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/facilelogodsnaq.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediologjeidnuj4hedn.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/difficielrnfjn4edj.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp'; 
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/forza4daysuna.webp';
const BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/forza4nighteere.webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const ZUCCOTTO_THINKING_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccotto-thinking.webp';
const ZUCCOTTO_WIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/zuccotto-wins.webp';
const PLAYER_WIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/victory-hug.webp';
const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';

// Multiplayer Modal Assets
const MULTIPLAYER_WIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/victoruymultiplayer.webp';
const MULTIPLAYER_LOST_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lostmultiplyaers33.webp';
const BTN_PLAY_AGAIN_MULTI_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giocaancoramultiplyars.webp';
const BTN_EXIT_MULTI_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_con+le+stesse+dimensioni+del+t_488799909208367111.webp';
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

// Musica di sottofondo
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/backgroundmusicforvideos-cartoon-funny-music-452420.mp3';

const ROWS = 6;
const COLS = 7;

type CellValue = 'RED' | 'YELLOW' | null;
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface ConnectFourProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const ConnectFourGame: React.FC<ConnectFourProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [now, setNow] = useState(new Date());
  const [board, setBoard] = useState<CellValue[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [turn, setTurn] = useState<'RED' | 'YELLOW'>('RED');
  const [winner, setWinner] = useState<'RED' | 'YELLOW' | 'DRAW' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [rewardGiven, setRewardGiven] = useState(false);
  
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [playerRole, setPlayerRole] = useState<'RED' | 'YELLOW' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(() => localStorage.getItem('loneboo_game_music_enabled') !== 'false');
  const [isMounting, setIsMounting] = useState(true);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Background dinamico basato sull'orario richiesto (20:15 - 06:45)
  const currentBg = useMemo(() => isNightTime(now) ? BG_NIGHT : BG_DAY, [now]);

  useEffect(() => {
      const timeTimer = setInterval(() => setNow(new Date()), 60000);
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = isAnyAlbumComplete(); 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);

      // Auth setup
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          signInAnonymously(auth).catch(console.error);
        }
      });

      // Inizializza Audio
      bgMusicRef.current = new Audio(BG_MUSIC_URL);
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.4;
      
      // Ritardo di sicurezza per prevenire ghost clicks
      const mountTimer = setTimeout(() => setIsMounting(false), 200);

      return () => {
          clearInterval(timeTimer);
          clearTimeout(mountTimer);
          unsubscribeAuth();
          if (bgMusicRef.current) {
              bgMusicRef.current.pause();
              bgMusicRef.current = null;
          }
      };
  }, []);

  // Multiplayer sync
  useEffect(() => {
    if (isMultiplayer && roomCode && currentUser) {
      const roomRef = doc(db, 'connect4_rooms', roomCode);
      
      const unsubscribe = onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          
          if (data.board) {
            const parsedBoard = typeof data.board === 'string' ? JSON.parse(data.board) : data.board;
            setBoard(parsedBoard);
          }
          if (data.turn) setTurn(data.turn);
          if (data.winner) setWinner(data.winner);
          if (data.winningCells) {
            const parsedCells = typeof data.winningCells === 'string' ? JSON.parse(data.winningCells) : data.winningCells;
            setWinningCells(parsedCells);
          }
          
          if (data.status === 'PLAYING') {
            setIsConnected(true);
            setDifficulty('MEDIUM');
          }
          
          if (data.status === 'RESTART' && winner) {
            initGameLocally();
          }
        } else if (playerRole === 'YELLOW') {
          // Room deleted by host
          backToMenu();
        }
      });

      return () => unsubscribe();
    }
  }, [isMultiplayer, roomCode, currentUser, playerRole, winner]);

  const initGameLocally = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setTurn('RED');
    setWinner(null);
    setWinningCells([]);
    setIsThinking(false);
    setRewardGiven(false);
    const p = getProgress();
    setUserTokens(p.tokens);
  };

  const generateRoomCode = async () => {
    if (!currentUser) {
      alert("Attendi la connessione al server...");
      return;
    }
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(code);
    setPlayerRole('RED');
    setIsMultiplayer(true);
    setIsConnected(false);
    
    try {
      await setDoc(doc(db, 'connect4_rooms', code), {
        board: JSON.stringify(Array.from({ length: ROWS }, () => Array(COLS).fill(null))),
        turn: 'RED',
        winner: null,
        winningCells: JSON.stringify([]),
        status: 'WAITING',
        p1: { id: currentUser.uid, name: 'Tu' },
        updatedAt: serverTimestamp()
      });
      initGameLocally();
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Errore nella creazione della stanza. Verifica i permessi Firebase.");
    }
  };

  const joinRoom = async () => {
    if (!currentUser) {
      alert("Attendi la connessione al server...");
      return;
    }
    if (inputCode.length === 4) {
      const roomRef = doc(db, 'connect4_rooms', inputCode);
      try {
        const snap = await getDoc(roomRef);
        if (snap.exists()) {
          setRoomCode(inputCode);
          setPlayerRole('YELLOW');
          setIsMultiplayer(true);
          
          await updateDoc(roomRef, {
            p2: { id: currentUser.uid, name: 'Tu' },
            status: 'PLAYING',
            updatedAt: serverTimestamp()
          });
          initGameLocally();
        } else {
          alert("Stanza non trovata!");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        alert("Errore nell'accesso alla stanza.");
      }
    }
  };

  // Gestione musica basata sullo stato del gioco e del toggle
  useEffect(() => {
      if (bgMusicRef.current) {
          if (musicEnabled && !winner) {
              bgMusicRef.current.play().catch(() => console.log("Musica bloccata dal browser"));
          } else {
              bgMusicRef.current.pause();
          }
      }
  }, [musicEnabled, winner]);

  const handleUnlockHard = () => {
      if (unlockHardMode()) {
          setIsHardUnlocked(true);
          setShowUnlockModal(false);
          setDifficulty('HARD');
          const p = getProgress();
          setUserTokens(p.tokens);
          initGame();
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  const initGame = () => {
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
      setTurn('RED');
      setWinner(null);
      setWinningCells([]);
      setIsThinking(false);
      setRewardGiven(false);
      const p = getProgress();
      setUserTokens(p.tokens);
  };

  useEffect(() => {
      if (difficulty) initGame();
  }, [difficulty]);

  useEffect(() => {
      if (winner === 'RED' && !rewardGiven && onEarnTokens && !isMultiplayer) {
          let reward = difficulty === 'HARD' ? 15 : (difficulty === 'MEDIUM' ? 10 : 5);
          onEarnTokens(reward);
          setRewardGiven(true);
          setUserTokens(prev => prev + reward);
      } else if (winner && winner !== 'DRAW' && !rewardGiven && isMultiplayer) {
          // In multiplayer, the winner gets 50 tokens
          const isWinner = (playerRole === 'RED' && winner === 'RED') || (playerRole === 'YELLOW' && winner === 'YELLOW');
          if (isWinner) {
              addTokens(50, 'Vittoria Forza 4 Multiplayer');
              setUserTokens(prev => prev + 50);
          }
          setRewardGiven(true);
      }
  }, [winner, rewardGiven, onEarnTokens, difficulty, isMultiplayer, playerRole]);

  const checkWin = (currentBoard: CellValue[][]): { winner: 'RED' | 'YELLOW' | null, cells: [number, number][] } => {
      const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
      for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
              const player = currentBoard[r][c];
              if (!player) continue;
              for (const [dr, dc] of directions) {
                  let cells: [number, number][] = [[r, c]];
                  for (let i = 1; i < 4; i++) {
                      const nr = r + dr * i; const nc = c + dc * i;
                      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && currentBoard[nr][nc] === player) cells.push([nr, nc]);
                      else break;
                  }
                  if (cells.length === 4) return { winner: player, cells };
              }
          }
      }
      return { winner: null, cells: [] };
  };

  const checkDraw = (currentBoard: CellValue[][]) => currentBoard[0].every(cell => cell !== null);

  const dropPiece = (col: number, player: 'RED' | 'YELLOW', currentBoard: CellValue[][]): { success: boolean, row: number } => {
      for (let r = ROWS - 1; r >= 0; r--) {
          if (!currentBoard[r][col]) {
              currentBoard[r][col] = player;
              return { success: true, row: r };
          }
      }
      return { success: false, row: -1 };
  };

  const handleColumnClick = async (col: number) => {
      if (winner || isThinking || turn !== (isMultiplayer ? playerRole : 'RED')) return;
      
      const newBoard = board.map(row => [...row]);
      const { success } = dropPiece(col, turn, newBoard);
      
      if (success) {
          const winResult = checkWin(newBoard);
          let newWinner: 'RED' | 'YELLOW' | 'DRAW' | null = winResult.winner;
          let newWinningCells = winResult.cells;
          let newTurn: 'RED' | 'YELLOW' = turn === 'RED' ? 'YELLOW' : 'RED';
          
          if (!newWinner && checkDraw(newBoard)) newWinner = 'DRAW';

          if (isMultiplayer && roomCode) {
              const roomRef = doc(db, 'connect4_rooms', roomCode);
              
              // Optimistic local update
              setBoard(newBoard);
              if (newWinner) {
                  setWinner(newWinner);
                  setWinningCells(newWinningCells);
              } else {
                  setTurn(newTurn);
              }

              await updateDoc(roomRef, {
                  board: JSON.stringify(newBoard),
                  turn: newWinner ? turn : newTurn,
                  winner: newWinner,
                  winningCells: JSON.stringify(newWinningCells),
                  updatedAt: serverTimestamp()
              });
          } else {
              setBoard(newBoard);
              if (newWinner) { 
                  setWinner(newWinner); 
                  setWinningCells(newWinningCells); 
              } else {
                  setTurn(newTurn);
              }
          }
      }
  };

  const handleLevelSelect = (diff: Difficulty) => {
    if (isMounting) return;
    if (diff === 'HARD' && !isHardUnlocked) {
        setShowUnlockModal(true);
        return;
    }
    setDifficulty(diff);
  };

  useEffect(() => {
      if (turn === 'YELLOW' && !winner && difficulty && !isMultiplayer) {
          setIsThinking(true);
          const timer = setTimeout(() => {
              const newBoard = board.map(row => [...row]);
              const validMoves = [];
              for (let c = 0; c < COLS; c++) if (!newBoard[0][c]) validMoves.push(c);

              if (validMoves.length === 0) { setWinner('DRAW'); setIsThinking(false); return; }

              let colToPlay = -1;
              for (const col of validMoves) {
                  const testBoard = newBoard.map(r => [...r]);
                  dropPiece(col, 'YELLOW', testBoard);
                  if (checkWin(testBoard).winner === 'YELLOW') { colToPlay = col; break; }
              }
              if (colToPlay === -1 && (difficulty !== 'EASY')) {
                  for (const col of validMoves) {
                      const testBoard = newBoard.map(r => [...r]);
                      dropPiece(col, 'RED', testBoard);
                      if (checkWin(testBoard).winner === 'RED') { colToPlay = col; break; }
                  }
              }
              if (colToPlay === -1) colToPlay = validMoves[Math.floor(Math.random() * validMoves.length)];

              dropPiece(colToPlay, 'YELLOW', newBoard);
              setBoard(newBoard);
              const winResult = checkWin(newBoard);
              if (winResult.winner) { setWinner(winResult.winner); setWinningCells(winResult.cells); }
              else if (checkDraw(newBoard)) setWinner('DRAW');
              else setTurn('RED');
              setIsThinking(false);
          }, 3000);
          return () => clearTimeout(timer);
      }
  }, [turn, winner, difficulty, board]);

  const resetGame = async () => {
    if (isMultiplayer && roomCode) {
        const roomRef = doc(db, 'connect4_rooms', roomCode);
        await updateDoc(roomRef, {
            status: 'RESTART',
            board: JSON.stringify(Array.from({ length: ROWS }, () => Array(COLS).fill(null))),
            turn: 'RED',
            winner: null,
            winningCells: JSON.stringify([]),
            updatedAt: serverTimestamp()
        });
        setTimeout(() => {
            updateDoc(roomRef, { status: 'PLAYING' });
        }, 500);
    } else {
        initGameLocally();
    }
  };

  const backToMenu = async () => {
      if (isMultiplayer && roomCode) {
          try {
              await deleteDoc(doc(db, 'connect4_rooms', roomCode));
          } catch (err) {
              console.error("Error deleting room:", err);
          }
      }
      setDifficulty(null);
      setWinner(null);
      setWinningCells([]);
      setIsMultiplayer(false);
      setRoomCode('');
      setPlayerRole(null);
  };

  const fullScreenWrapper = "fixed inset-0 w-full h-[100dvh] z-[60] overflow-hidden touch-none overscroll-none select-none";

  return (
    <div className={fullScreenWrapper}>
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

        <img src={currentBg} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" />

        {/* TASTI NAVIGAZIONE IN ALTO A SINISTRA */}
        <div className="absolute top-[20px] left-4 right-4 z-[1300] flex justify-between items-center pointer-events-none">
            <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation pointer-events-auto">
                <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-10 md:h-12 w-auto" />
            </button>
            
            <div className="flex gap-2 pointer-events-auto">
                {difficulty && (
                    <button onClick={backToMenu} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                        <img src={BTN_BACK_MENU_IMG} alt="Torna ai Livelli" className="h-10 md:h-12 w-auto" />
                    </button>
                )}
                
                <div className="relative">
                    <button 
                        onClick={() => setShowInviteMenu(!showInviteMenu)}
                        className="hover:scale-105 active:scale-95 transition-transform outline-none"
                    >
                        <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/sfidaunamicoclashboo.webp" alt="Sfida Amico" className="h-10 md:h-12 w-auto" />
                    </button>
                    
                    <AnimatePresence>
                        {showInviteMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-60 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden z-[1100] p-4 flex flex-col gap-3"
                            >
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => { generateRoomCode(); }} 
                                        className="flex-1 hover:scale-105 active:scale-95 transition-transform outline-none"
                                    >
                                        <img 
                                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/creagiocomultiplayer+(1).webp" 
                                            alt="Crea Gioco" 
                                            className="w-full h-auto drop-shadow-md"
                                        />
                                    </button>
                                    
                                    <button 
                                        onClick={() => setShowJoinInput(!showJoinInput)} 
                                        className="flex-1 hover:scale-105 active:scale-95 transition-transform outline-none"
                                    >
                                        <img 
                                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/partecipamultipoi+(1).webp" 
                                            alt="Partecipa" 
                                            className="w-full h-auto drop-shadow-md"
                                        />
                                    </button>
                                </div>
                                
                                <AnimatePresence>
                                    {isMultiplayer && roomCode && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="flex flex-col items-center gap-2 pt-3 border-t border-white/20 overflow-hidden"
                                        >
                                            <div className="bg-white/40 px-4 py-2 rounded-xl border border-white/50 w-full text-center relative group">
                                                <span className="text-slate-900 font-black text-xl tracking-widest">{roomCode}</span>
                                                <button 
                                                    onClick={() => backToMenu()}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors shadow-md"
                                                    title="Chiudi Stanza"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                                                    {isConnected ? "Avversario connesso!" : "In attesa dell'avversario..."}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {showJoinInput && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="flex flex-col gap-2 pt-2 border-t border-white/20 overflow-hidden"
                                        >
                                            <input 
                                                type="text" 
                                                placeholder="CODICE..." 
                                                maxLength={4}
                                                value={inputCode}
                                                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                                className="w-full bg-white/40 text-slate-900 placeholder:text-slate-600 p-2 rounded-xl border border-white/50 text-center uppercase font-black tracking-widest outline-none focus:bg-white/60 transition-colors text-sm"
                                            />
                                            <button 
                                                onClick={() => { joinRoom(); setShowInviteMenu(false); }} 
                                                className="w-full bg-green-500/80 hover:bg-green-500 text-white py-2 rounded-xl font-black text-xs tracking-widest shadow-lg transition-colors uppercase"
                                            >
                                                ENTRA ORA
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

        {/* SALDO GETTONI E AUDIO (ALTO A DESTRA) */}
        <div className="absolute top-[80px] md:top-[100px] right-4 z-[1200] pointer-events-none flex flex-col items-end gap-3">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl pointer-events-auto">
                <span>{userTokens}</span> <TokenIcon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            
            {/* Tasto Audio sotto i gettoni */}
            <button 
                onClick={() => {
                    const nextState = !musicEnabled;
                    setMusicEnabled(nextState);
                    localStorage.setItem('loneboo_game_music_enabled', String(nextState));
                }}
                className={`pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
                title={musicEnabled ? "Spegni Musica" : "Accendi Musica"}
            >
                <img src={AUDIO_ICON_IMG} alt="Audio" className="w-16 h-16 md:w-24 h-auto drop-shadow-xl" />
            </button>
        </div>


        {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}

        {!difficulty ? (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-4 pt-36 md:pt-48">
                {/* Multiplayer Status */}
                {isMultiplayer && roomCode && (
                    <div className="mb-6 flex flex-col items-center gap-2">
                        <div className="bg-white/30 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/50 flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                            <span className="text-blue-700 font-black uppercase tracking-widest text-sm">
                                {roomCode ? `CODICE: ${roomCode}` : 'CONNESSIONE...'}
                            </span>
                        </div>
                        {playerRole === 'RED' && (
                            <p className="text-white/80 text-xs font-bold uppercase tracking-tighter bg-black/20 px-3 py-1 rounded-full">
                                In attesa di un amico...
                            </p>
                        )}
                    </div>
                )}

                {/* ISTRUZIONE SU DUE RIGHE IN UN BOX TRASLUCIDO - INGRANDITA */}
                <div className="bg-white/20 backdrop-blur-md px-8 py-5 rounded-[40px] border-4 border-white/40 shadow-2xl mb-10 animate-in slide-in-from-top-4 duration-500 max-w-[95%] md:max-w-xl">
                    <h2 
                        className="font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[3px_3px_0_black] text-xl sm:text-4xl md:text-[46px] leading-tight" 
                        style={{ WebkitTextStroke: '1.5px black' }}
                    >
                        {isMultiplayer ? (
                            "SFIDA MULTIPLAYER"
                        ) : (
                            <>
                                Sfida <span className="text-yellow-300">Zuccotto</span><br />
                                e metti <span className="text-red-400">4 gettoni</span> in fila!
                            </>
                        )}
                    </h2>
                </div>

                <div className="flex flex-col gap-4 items-center w-full max-w-[220px] md:max-w-[280px]">
                    <button onClick={() => handleLevelSelect('EASY')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent">
                        <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto" />
                    </button>
                    <button onClick={() => handleLevelSelect('MEDIUM')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent" style={{ animationDelay: '0.5s' }}>
                        <img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto" />
                    </button>
                    <div className="relative sticker-btn animate-float-btn w-full" style={{ animationDelay: '1s' }}>
                        <button onClick={() => handleLevelSelect('HARD')} className={`w-full outline-none border-none bg-transparent ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}>
                            <img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto" />
                        </button>
                        {!isHardUnlocked && (
                            <div className="absolute right-[-8px] top-[-8px] pointer-events-none z-20">
                                <img src={LOCK_IMG} alt="Bloccato" className="w-10 h-10 drop-shadow-lg rotate-12" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2 pt-32">
              {/* Tabellone */}
              <div className="bg-blue-600 p-2 md:p-4 rounded-[30px] border-4 md:border-8 border-blue-800 shadow-2xl relative">
                  {isThinking && (
                      <div className="absolute z-[100] animate-in zoom-in slide-in-from-bottom-10 duration-500 pointer-events-none" style={{ top: '-120px', left: '50%', transform: 'translateX(-50%)' }}>
                          <img src={ZUCCOTTO_THINKING_IMG} alt="Zuccotto pensa" className="h-auto drop-shadow-2xl" style={{ width: '162px' }} />
                      </div>
                  )}
                  <div className="grid grid-cols-7 gap-1 md:gap-3 bg-blue-500 p-2 rounded-xl">
                      {Array.from({ length: COLS }).map((_, c) => (
                          <div key={c} className="flex flex-col gap-1 md:gap-3" onClick={() => handleColumnClick(c)}>
                              {Array.from({ length: ROWS }).map((_, r) => {
                                  const cell = board[r]?.[c];
                                  const isWinning = winningCells.some(([wr, wc]) => wr === r && wc === c);
                                  return (
                                      <div key={`${r}-${c}`} className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full border-2 md:border-4 ${isWinning ? 'border-white animate-pulse' : 'border-blue-700'} flex items-center justify-center bg-blue-800 shadow-inner overflow-hidden cursor-pointer`}>
                                          {cell === 'RED' && <div className="w-full h-full bg-red-500 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300"></div>}
                                          {cell === 'YELLOW' && <div className="w-full h-full bg-yellow-400 rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300"></div>}
                                      </div>
                                  );
                              })}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        )}

        {winner && (
            <div className="fixed inset-0 z-[110] flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-48 animate-in zoom-in duration-300">
                <div className="bg-white p-6 md:p-8 rounded-[40px] text-center border-4 border-black max-sm w-full shadow-2xl relative flex flex-col items-center transform translate-y-4">
                    {winner === 'RED' && onOpenNewsstand && !isMultiplayer && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                    
                    {isMultiplayer ? (
                        <div className="mb-4 w-full flex flex-col items-center">
                            {((playerRole === 'RED' && winner === 'RED') || (playerRole === 'YELLOW' && winner === 'YELLOW')) ? (
                                <img src={MULTIPLAYER_WIN_IMG} alt="Hai Vinto" className="w-full h-auto object-contain drop-shadow-xl" />
                            ) : winner === 'DRAW' ? (
                                <div className="animate-bounce text-6xl md:text-7xl mb-4">🤝</div>
                            ) : (
                                <img src={MULTIPLAYER_LOST_IMG} alt="Hai Perso" className="w-full h-auto object-contain drop-shadow-xl" />
                            )}
                            {winner === 'DRAW' && <h2 className="text-2xl md:text-3xl font-black text-purple-600 drop-shadow-sm uppercase">PAREGGIO!</h2>}
                        </div>
                    ) : (
                        <>
                            <div className={`mb-4 flex items-center justify-center ${winner === 'DRAW' ? 'animate-bounce text-6xl md:text-7xl' : ''}`}>
                                {winner === 'RED' ? <img src={PLAYER_WIN_IMG} alt="Hai Vinto" className="w-44 h-44 md:w-64 md:h-64 object-contain" /> : (winner === 'YELLOW' ? <img src={ZUCCOTTO_WIN_IMG} alt="Zuccotto Vince" className="w-44 h-44 md:w-64 md:h-64 object-contain" /> : '🤝')}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-purple-600 drop-shadow-sm uppercase">
                                {winner === 'DRAW' ? 'PAREGGIO!' : (winner === 'RED' ? 'HAI VINTO!' : 'HA VINTO ZUCCOTTO!')}
                            </h2>
                        </>
                    )}

                    <div className="flex flex-row gap-4 justify-center items-center w-full mt-2">
                        <button 
                            onClick={resetGame} 
                            className="hover:scale-105 active:scale-95 transition-transform flex-1 max-w-[140px]"
                        >
                            <img 
                                src={isMultiplayer ? BTN_PLAY_AGAIN_MULTI_IMG : BTN_PLAY_AGAIN_IMG} 
                                alt="Gioca Ancora" 
                                className="w-full h-auto drop-shadow-xl" 
                            />
                        </button>
                        <button 
                            onClick={backToMenu} 
                            className="hover:scale-105 active:scale-95 transition-transform flex-1 max-w-[140px]"
                        >
                            <img 
                                src={isMultiplayer ? BTN_EXIT_MULTI_IMG : EXIT_BTN_IMG} 
                                alt="Menu" 
                                className="w-full h-auto drop-shadow-xl" 
                            />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ConnectFourGame;
