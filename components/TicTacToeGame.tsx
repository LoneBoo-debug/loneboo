
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Trophy, Loader2, Lock, ArrowLeft, Send, Check, AlertCircle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TOKEN_ICON_URL } from '../constants';
import TokenIcon from './TokenIcon';
import { getProgress, unlockHardMode, isAnyAlbumComplete, addTokens } from '../services/tokens';
import { isNightTime } from '../services/weatherService';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';
import { db, auth } from '../firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const TITLE_IMG = 'https://i.postimg.cc/02djnLBy/acchiam-(1).png';
const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/facilelogodsnaq.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediologjeidnuj4hedn.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/difficielrnfjn4edj.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp'; 
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

// Asset Sfondi
const BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tribhggroudd.webp';
const BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giocotrisnotte.webp';

const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';
const WITCH_THINKING_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/witch-thinking.webp';
const PLAYER_AVATAR_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/girlthinkticerd.webp';
const VICTORY_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/triswingirl.webp';

// Musica di sottofondo
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/hitslab-comedy-cartoon-funny-background-music-365347.mp3';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface TicTacToeProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const TicTacToeGame: React.FC<TicTacToeProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [now, setNow] = useState(new Date());
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [sessionScore, setSessionScore] = useState({ player: 0, cpu: 0 });
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isMounting, setIsMounting] = useState(true);

  // Multiplayer States
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [playerRole, setPlayerRole] = useState<'p1' | 'p2' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Sfondo dinamico basato sull'orario (20:15 - 06:45)
  const currentBg = useMemo(() => isNightTime(now) ? BG_NIGHT : BG_DAY, [now]);

  useEffect(() => {
      const progress = getProgress();
      setUserTokens(progress.tokens);
      const albumComplete = isAnyAlbumComplete(); 
      setIsHardUnlocked(albumComplete || !!progress.hardModeUnlocked);

      // Firebase Auth
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          signInAnonymously(auth).catch(err => console.error("Auth error:", err));
        }
      });

      // Inizializza Audio
      bgMusicRef.current = new Audio(BG_MUSIC_URL);
      bgMusicRef.current.loop = true;
      bgMusicRef.current.volume = 0.4;

      // Timer per l'aggiornamento dell'orario
      const timeInterval = setInterval(() => setNow(new Date()), 60000);
      
      // Ritardo di sicurezza per prevenire ghost clicks
      const mountTimer = setTimeout(() => setIsMounting(false), 200);

      return () => {
          unsubscribeAuth();
          clearInterval(timeInterval);
          clearTimeout(mountTimer);
          if (bgMusicRef.current) {
              bgMusicRef.current.pause();
              bgMusicRef.current = null;
          }
      };
  }, []);

  // Multiplayer Listener
  useEffect(() => {
    if (!isMultiplayer || !roomCode) return;

    const roomRef = doc(db, 'tictactoe_rooms', roomCode);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.board) setBoard(data.board);
        if (data.isPlayerTurn !== undefined) setIsPlayerTurn(data.isPlayerTurn);
        if (data.winner !== undefined) setWinner(data.winner);
        if (data.status === 'PLAYING') setIsConnected(true);
        if (data.status === 'RESTART') {
          resetGame();
        }
      }
    });

    return () => unsubscribe();
  }, [isMultiplayer, roomCode]);

  // Gestione musica basata sullo stato del gioco e del toggle
  useEffect(() => {
      if (bgMusicRef.current) {
          if (musicEnabled && difficulty && !winner) {
              bgMusicRef.current.play().catch(() => console.log("Musica bloccata dal browser"));
          } else {
              bgMusicRef.current.pause();
          }
      }
  }, [musicEnabled, difficulty, winner]);

  const handleUnlockHard = () => {
      if (unlockHardMode()) {
          setIsHardUnlocked(true);
          const p = getProgress();
          setUserTokens(p.tokens);
          setShowUnlockModal(false);
          setDifficulty('HARD');
          resetGame();
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const updateScore = (gameWinner: string) => {
      if (gameWinner === 'O') {
          setSessionScore(prev => ({ ...prev, player: prev.player + 1 }));
      } else if (gameWinner === 'X') {
          setSessionScore(prev => ({ ...prev, cpu: prev.cpu + 1 }));
      }
  };

  const handleClick = async (index: number) => {
    if (board[index] || winner || !difficulty || isThinking) return;

    // Multiplayer turn check
    if (isMultiplayer) {
      if (playerRole === 'p1' && !isPlayerTurn) return;
      if (playerRole === 'p2' && isPlayerTurn) return;
    } else {
      if (!isPlayerTurn) return;
    }

    const newBoard = [...board];
    const symbol = isMultiplayer ? (playerRole === 'p1' ? 'O' : 'X') : 'O';
    newBoard[index] = symbol; 
    
    const gameWinner = checkWinner(newBoard);
    const nextTurn = !isPlayerTurn;
    let finalWinner = gameWinner;
    if (!gameWinner && !newBoard.includes(null)) finalWinner = 'draw';

    if (isMultiplayer && roomCode) {
      const roomRef = doc(db, 'tictactoe_rooms', roomCode);
      await updateDoc(roomRef, {
        board: newBoard,
        isPlayerTurn: nextTurn,
        winner: finalWinner,
        updatedAt: serverTimestamp()
      });
    } else {
      setBoard(newBoard);
      if (finalWinner) {
        setWinner(finalWinner);
        updateScore(finalWinner);
      } else {
        setIsPlayerTurn(false);
      }
    }
  };

  const getBestMove = (currentBoard: (string | null)[], diff: Difficulty) => {
      const availableMoves = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
      
      if (diff === 'EASY') {
          if (Math.random() > 0.2) return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
      if (diff === 'MEDIUM') {
          if (Math.random() > 0.6) return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }

      const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (currentBoard[a] === 'X' && currentBoard[b] === 'X' && !currentBoard[c]) return c;
          if (currentBoard[a] === 'X' && currentBoard[c] === 'X' && !currentBoard[b]) return b;
          if (currentBoard[b] === 'X' && currentBoard[c] === 'X' && !currentBoard[a]) return a;
      }
      for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (currentBoard[a] === 'O' && currentBoard[b] === 'O' && !currentBoard[c]) return c;
          if (currentBoard[a] === 'O' && currentBoard[c] === 'O' && !currentBoard[b]) return b;
          if (currentBoard[b] === 'O' && currentBoard[c] === 'O' && !currentBoard[a]) return a;
      }
      if (!currentBoard[4]) return 4;
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner && difficulty && !isMultiplayer) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        const moveIndex = getBestMove(board, difficulty);
        if (moveIndex !== undefined) {
          const newBoard = [...board];
          newBoard[moveIndex] = 'X'; 
          setBoard(newBoard);
          const gameWinner = checkWinner(newBoard);
          if (gameWinner) { setWinner(gameWinner); updateScore(gameWinner); }
          else if (!newBoard.includes(null)) setWinner('draw');
          setIsPlayerTurn(true);
        }
        setIsThinking(false);
      }, 2500); 
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board, difficulty]);

  useEffect(() => {
    if (winner && !rewardGiven && onEarnTokens) {
      let amount = 0;
      if (isMultiplayer) {
        const iWon = (playerRole === 'p1' && winner === 'O') || (playerRole === 'p2' && winner === 'X');
        amount = iWon ? 50 : 0;
      } else if (winner === 'O') {
        amount = 5;
      }

      if (amount > 0) {
        onEarnTokens(amount);
        setRewardGiven(true);
        setUserTokens(prev => prev + amount);
      }
    }
  }, [winner, rewardGiven, onEarnTokens, isMultiplayer, playerRole]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setIsThinking(false);
    setRewardGiven(false);

    if (isMultiplayer && roomCode) {
      const roomRef = doc(db, 'tictactoe_rooms', roomCode);
      updateDoc(roomRef, {
        status: 'PLAYING',
        board: Array(9).fill(null),
        isPlayerTurn: true,
        winner: null,
        updatedAt: serverTimestamp()
      }).catch(err => console.error("Error resetting room:", err));
    }
  };

  const restartMultiplayer = async () => {
    if (!roomCode) return;
    const roomRef = doc(db, 'tictactoe_rooms', roomCode);
    await updateDoc(roomRef, {
      status: 'RESTART',
      updatedAt: serverTimestamp()
    });
    resetGame();
  };

  const generateRoomCode = async () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(code);
    setPlayerRole('p1');
    setIsMultiplayer(true);
    setDifficulty('MEDIUM');
    
    try {
      await setDoc(doc(db, 'tictactoe_rooms', code), {
        p1: currentUser?.uid || 'host',
        board: Array(9).fill(null),
        isPlayerTurn: true,
        winner: null,
        status: 'WAITING',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Errore nella creazione della stanza.");
    }
  };

  const joinRoom = async () => {
    if (inputCode.length === 4) {
      const roomRef = doc(db, 'tictactoe_rooms', inputCode);
      try {
        const snap = await getDoc(roomRef);
        if (snap.exists()) {
          setRoomCode(inputCode);
          setPlayerRole('p2');
          setIsMultiplayer(true);
          setDifficulty('MEDIUM');
          
          await updateDoc(roomRef, {
            p2: currentUser?.uid || 'guest',
            status: 'PLAYING',
            updatedAt: serverTimestamp()
          });
        } else {
          alert("Stanza non trovata!");
        }
      } catch (error) {
        console.error("Error joining room:", error);
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
    setIsMultiplayer(false);
    resetGame();
  };

  const backToMenu = () => {
      setDifficulty(null);
      setIsMultiplayer(false);
      setRoomCode('');
      resetGame();
  };

  const renderTitle = () => {
    const levelLabel = difficulty === 'EASY' ? 'LIVELLO FACILE' : (difficulty === 'MEDIUM' ? 'LIVELLO MEDIO' : 'SFIDA DIFFICILE');

    return (
        <div className="absolute top-[160px] md:top-[220px] left-0 right-0 flex flex-col items-center z-50 pointer-events-none px-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className={`bg-white/20 backdrop-blur-md px-4 rounded-[20px] border-2 border-white/40 shadow-xl mt-3 ${difficulty ? 'rounded-full pt-0.5 pb-1.5' : 'rounded-[20px] py-1'}`}>
                <h1 
                    className={`font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[2px_2px_0_black] ${difficulty ? 'text-sm md:text-2xl whitespace-nowrap' : 'text-lg md:text-4xl'}`}
                    style={{ WebkitTextStroke: '1.2px black', lineHeight: '1.1' }}
                >
                    {difficulty ? levelLabel : "GIOCA CONTRO LA STREGA"}
                </h1>
            </div>
        </div>
    );
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

      <img src={currentBg} alt="" className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0" />

      {/* TASTI NAVIGAZIONE IN ALTO A SINISTRA E SALDO GETTONI IN ALTO A DESTRA */}
      <div className="absolute top-[20px] left-4 right-4 z-[1000] flex justify-between items-center pointer-events-none">
          <div className="flex flex-col items-start pointer-events-auto">
              <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                  <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-10 md:h-12 w-auto drop-shadow-md" />
              </button>
              {difficulty && (
                <button onClick={backToMenu} className="mt-2 hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                    <img src={BTN_BACK_MENU_IMG} alt="Torna ai Livelli" className="h-10 md:h-12 w-auto drop-shadow-md" />
                </button>
              )}
          </div>

          <div className="flex gap-2 pointer-events-auto">
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
                                      onClick={() => { generateRoomCode(); setShowInviteMenu(false); }} 
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
                                  {showJoinInput && (
                                      <motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="flex flex-col gap-2 pt-2 border-t border-white/20 overflow-hidden"
                                      >
                                          <input 
                                              type="text" 
                                              placeholder="INSERISCI CODICE..." 
                                              maxLength={4}
                                              value={inputCode}
                                              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                              className="w-full bg-white/40 text-slate-900 placeholder:text-slate-600 p-2 rounded-xl border border-white/50 text-center uppercase font-black tracking-widest outline-none focus:bg-white/60 transition-colors text-sm"
                                          />
                                          <button 
                                              onClick={() => { joinRoom(); setShowInviteMenu(false); }} 
                                              className="w-full bg-green-500/80 hover:bg-green-500 text-white py-2 rounded-xl font-black text-xs tracking-widest shadow-lg transition-colors uppercase"
                                          >
                                              CONFERMA ENTRA
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

      {/* SALDO GETTONI E AUDIO SOTTO L'HEADER */}
      <div className="absolute top-[80px] md:top-[100px] right-4 z-[100] pointer-events-none flex flex-col items-end gap-3">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg shadow-xl pointer-events-auto">
              <span>{userTokens}</span> <TokenIcon className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          
          {/* Tasto Audio sotto i gettoni */}
          <button 
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
              title={musicEnabled ? "Spegni Musica" : "Accendi Musica"}
          >
              <img src={AUDIO_ICON_IMG} alt="Audio" className="w-16 h-16 md:w-24 h-auto drop-shadow-xl" />
          </button>
      </div>

      {renderTitle()}

      {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pt-64 md:pt-80 pb-4">
        {isMultiplayer && roomCode && (
          <div className="absolute top-[280px] md:top-[340px] z-50 flex flex-col items-center gap-2">
            <div className="bg-white/90 backdrop-blur-md px-4 py-1 rounded-full border-2 border-boo-purple shadow-lg flex items-center gap-2">
              <span className="text-boo-purple font-black text-xs uppercase">Codice Stanza:</span>
              <span className="text-boo-purple font-black text-lg tracking-widest">{roomCode}</span>
              {!isConnected && (
                <div className="flex items-center gap-2 ml-2">
                  <Loader2 className="w-4 h-4 animate-spin text-boo-purple" />
                  <span className="text-[10px] text-boo-purple animate-pulse">In attesa...</span>
                </div>
              )}
            </div>
          </div>
        )}
        {difficulty === null ? (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-start p-4">
                <div className="flex flex-col gap-4 items-center w-full max-w-[220px] md:max-w-[280px] mt-24 md:mt-32">
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
                            <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                                <img src={LOCK_IMG} alt="Bloccato" className="w-12 h-12 drop-shadow-lg rotate-12" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
          <>
            <div className="flex justify-between items-center w-full max-w-sm px-6 mb-6">
                <div className={`flex flex-col items-center transition-all relative bg-black/20 backdrop-blur-sm p-3 rounded-[25px] ${(!isMultiplayer ? !isPlayerTurn : (playerRole === 'p1' ? !isPlayerTurn : isPlayerTurn)) && !winner ? 'scale-110' : 'opacity-80 scale-90'}`}>
                    <div className={`relative ${(!isMultiplayer ? !isPlayerTurn : (playerRole === 'p1' ? !isPlayerTurn : isPlayerTurn)) && !winner ? 'drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]' : ''}`}>
                        <img src={WITCH_THINKING_IMG} alt="Strega" className="w-20 h-20 md:w-28 md:h-28 object-contain" />
                        {isThinking && !winner && !isMultiplayer && (
                            <div className="absolute top-1/2 left-[-30px] md:left-[-70px] -translate-y-1/2 z-50 flex flex-col items-center animate-in fade-in zoom-in duration-500 pointer-events-none transform -rotate-3">
                                <span className="font-luckiest text-lg md:text-xl text-yellow-300 uppercase whitespace-nowrap mb-[-25px] relative z-10 translate-x-8" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', WebkitTextStroke: '1px black' }}>mmmh sto pensando...</span>
                                <img src={WITCH_THINKING_IMG} alt="Strega" className="w-52 h-52 md:w-64 md:h-64 object-contain" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md z-40">{sessionScore.cpu}</div>
                    </div>
                </div>
                <div className="text-center"><span className="text-4xl font-black text-white drop-shadow-[0_4px_0_black] italic">VS</span></div>
                <div className={`flex flex-col items-center transition-all bg-black/20 backdrop-blur-sm p-3 rounded-[25px] ${(!isMultiplayer ? isPlayerTurn : (playerRole === 'p1' ? isPlayerTurn : !isPlayerTurn)) && !winner ? 'scale-110' : 'opacity-80 scale-90'}`}>
                    <div className={`relative ${(!isMultiplayer ? isPlayerTurn : (playerRole === 'p1' ? isPlayerTurn : !isPlayerTurn)) && !winner ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]' : ''}`}>
                        <img src={PLAYER_AVATAR_IMG} alt="Tu" className="w-20 h-20 md:w-28 md:h-28 object-contain" />
                        {!isMultiplayer && <div className="absolute -bottom-1 -right-1 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white shadow-md">{sessionScore.player}</div>}
                    </div>
                </div>
            </div>
            <div className="w-80 h-80 md:w-[440px] md:h-[440px] mx-auto bg-black/20 backdrop-blur-sm p-3 rounded-[30px] shadow-2xl border-4 border-white/30 relative">
                <div className="grid grid-cols-3 gap-3 w-full h-full">
                {board.map((cell, idx) => {
                    const canClick = !cell && !winner && (!isMultiplayer ? isPlayerTurn : (playerRole === 'p1' ? isPlayerTurn : !isPlayerTurn)) && !isThinking;
                    return (
                        <div key={idx} className="relative w-full h-full">
                            <button 
                                type="button" 
                                onClick={() => handleClick(idx)} 
                                disabled={!canClick} 
                                className={`absolute inset-0 w-full h-full flex items-center justify-center rounded-2xl shadow-inner border-2 border-white/20 transition-all duration-200 active:scale-95 ${cell ? 'bg-white/10 cursor-default' : 'bg-white/40 hover:bg-white/60 cursor-pointer'}`} 
                                style={{ touchAction: 'manipulation' }}
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    {cell === 'X' && <span className="text-7xl md:text-8xl font-luckiest text-red-600 animate-in zoom-in duration-300 drop-shadow-[3px_3px_0_black]" style={{ WebkitTextStroke: '2px black' }}>X</span>}
                                    {cell === 'O' && <span className="text-7xl md:text-8xl font-luckiest text-blue-500 animate-in zoom-in duration-300 drop-shadow-[3px_3px_0_black]" style={{ WebkitTextStroke: '2px black' }}>O</span>}
                                </div>
                            </button>
                        </div>
                    );
                })}
                </div>
            </div>
          </>
        )}
      </div>

      {/* MODALE DI FINE PARTITA */}
      {winner && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-blue-600/90 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
            <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 text-center shadow-2xl flex flex-col items-center max-sm w-full mx-auto relative overflow-hidden">
                {winner === 'O' && onOpenNewsstand && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                
                {winner === 'draw' ? (
                    <>
                        <div className="text-8xl mb-4">🤝</div>
                        <h2 className="text-3xl font-black text-blue-600 mb-2 uppercase text-center leading-none">PAREGGIO!</h2>
                        <p className="text-gray-600 font-bold mb-8 text-center">Siete stati bravissimi entrambi!</p>
                    </>
                ) : (isMultiplayer ? ((playerRole === 'p1' && winner === 'O') || (playerRole === 'p2' && winner === 'X')) : winner === 'O') ? (
                    <>
                        <img src={VICTORY_HEADER_IMG} alt="Vittoria" className="w-48 h-auto mb-4 drop-shadow-xl" />
                        <div className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black text-2xl border-2 border-black mb-8 shadow-lg flex items-center gap-2">
                            +{isMultiplayer ? 50 : 5} <TokenIcon className="w-6 h-6" />
                        </div>
                    </>
                ) : (
                    <>
                        <img src={WITCH_THINKING_IMG} alt="La Strega Vince" className="w-48 h-auto mb-4 drop-shadow-xl" />
                        <h2 className="text-3xl font-black text-red-600 mb-2 uppercase text-center leading-none">
                            {isMultiplayer ? 'HAI PERSO LA SFIDA!' : 'HA VINTO LA STREGA!'}
                        </h2>
                        <p className="text-gray-600 font-bold mb-8 text-center">Riprova, non farti battere!</p>
                    </>
                )}
                
                <div className="flex flex-row gap-4 w-full justify-center">
                    <button 
                        onClick={isMultiplayer ? restartMultiplayer : resetGame} 
                        className="hover:scale-105 active:scale-95 transition-all outline-none flex-1 max-w-[160px]"
                    >
                        <img src={BTN_PLAY_AGAIN_IMG} alt="Rigioca" className="w-full h-auto drop-shadow-lg" />
                    </button>
                    <button 
                        onClick={backToMenu} 
                        className="hover:scale-105 active:scale-95 transition-all outline-none flex-1 max-w-[160px]"
                    >
                        <img src={BTN_BACK_MENU_IMG} alt="Livelli" className="w-full h-auto drop-shadow-lg" />
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToeGame;
