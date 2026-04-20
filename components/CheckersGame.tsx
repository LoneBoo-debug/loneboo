
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RotateCcw, Loader2, Send, Check, AlertCircle, Trophy, Users, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProgress, unlockHardMode, isAnyAlbumComplete, addTokens } from '../services/tokens';
import { isNightTime } from '../services/weatherService';
import { TOKEN_ICON_URL } from '../constants';
import TokenIcon from './TokenIcon';
import UnlockModal from './UnlockModal';
import SaveReminder from './SaveReminder';
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

const EXIT_BTN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-back-park.webp';
const TITLE_IMG = 'https://i.postimg.cc/nrFpH8Q/dmana-(1).png';
const BTN_EASY_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/facilelogodsnaq.webp';
const BTN_MEDIUM_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mediologjeidnuj4hedn.webp';
const BTN_HARD_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/difficielrnfjn4edj.webp';
const LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/icon-parents.webp'; 
const BTN_BACK_MENU_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-levels-menu.webp';

// Nuovi Asset Sfondi
const BG_DAY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/damadayesa.webp';
const BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/damanghtsa.webp';

const GRANDFATHER_THINKING_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grandpa-thinking.webp';
const VICTORY_TITLE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/victory-checkers.webp';

// Multiplayer Modal Assets
const MULTIPLAYER_WIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/victoruymultiplayer.webp';
const MULTIPLAYER_LOST_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/lostmultiplyaers33.webp';
const BTN_PLAY_AGAIN_MULTI_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giocaancoramultiplyars.webp';
const BTN_EXIT_MULTI_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_con+le+stesse+dimensioni+del+t_488799909208367111.webp';
const BTN_PLAY_AGAIN_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-play-again.webp';
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

// Musica di sottofondo
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfredsmusicalsfonbg.MP3';

type PieceColor = 'RED' | 'BLACK';
type PieceType = 'MAN' | 'KING';
type Piece = { color: PieceColor; type: PieceType } | null;
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface CheckersGameProps {
    onBack: () => void;
    onEarnTokens?: (amount: number) => void;
    onOpenNewsstand?: () => void;
}

const CheckersGame: React.FC<CheckersGameProps> = ({ onBack, onEarnTokens, onOpenNewsstand }) => {
  const [now, setNow] = useState(new Date());
  const [board, setBoard] = useState<Piece[]>(Array(64).fill(null));
  const [turn, setTurn] = useState<PieceColor>('RED'); 
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [validMoves, setValidMoves] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);
  const [isHardUnlocked, setIsHardUnlocked] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [jumpingPieceIdx, setJumpingPieceIdx] = useState<number | null>(null);
  const [aiMoving, setAiMoving] = useState<{ from: number, to: number } | null>(null);
  const [musicEnabled, setMusicEnabled] = useState(() => localStorage.getItem('loneboo_game_music_enabled') !== 'false');

  // Multiplayer States
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [playerRole, setPlayerRole] = useState<'p1' | 'p2' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const displayIndices = useMemo(() => {
    const indices = Array.from({ length: 64 }, (_, i) => i);
    if (isMultiplayer && playerRole === 'p2') {
      return [...indices].reverse();
    }
    return indices;
  }, [isMultiplayer, playerRole]);

  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Background dinamico basato sull'orario (20:15 - 06:45)
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

      // Sincronizzazione audio globale
      // Timer per l'aggiornamento dell'orario
      const timeTimer = setInterval(() => setNow(new Date()), 60000);
      return () => {
          unsubscribeAuth();
          clearInterval(timeTimer);
          if (bgMusicRef.current) {
              bgMusicRef.current.pause();
              bgMusicRef.current = null;
          }
      };
  }, []);

  // Multiplayer Listener
  useEffect(() => {
    if (!isMultiplayer || !roomCode) return;

    const roomRef = doc(db, 'checkers_rooms', roomCode);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.board) {
          const parsedBoard = typeof data.board === 'string' ? JSON.parse(data.board) : data.board;
          setBoard(parsedBoard);
        }
        if (data.turn) setTurn(data.turn);
        if (data.winner) setWinner(data.winner);
        if (data.jumpingPieceIdx !== undefined) setJumpingPieceIdx(data.jumpingPieceIdx);
        if (data.status === 'PLAYING') {
          setIsConnected(true);
          setDifficulty('MEDIUM');
          setShowInviteMenu(false);
        }
        if (data.status === 'RESTART') {
          initBoard();
        }
      }
    });

    return () => unsubscribe();
  }, [isMultiplayer, roomCode]);

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
          const p = getProgress();
          setUserTokens(p.tokens);
          setShowUnlockModal(false);
          setDifficulty('HARD');
          initBoard();
      }
  };

  const handleOpenNewsstand = () => {
      if (onOpenNewsstand) {
          onOpenNewsstand();
          setShowUnlockModal(false);
      }
  };

  const initBoard = () => {
      const newBoard: Piece[] = Array(64).fill(null);
      for (let i = 0; i < 64; i++) {
          const row = Math.floor(i / 8);
          const col = i % 8;
          if ((row + col) % 2 === 1) {
              if (row < 3) newBoard[i] = { color: 'BLACK', type: 'MAN' };
              if (row > 4) newBoard[i] = { color: 'RED', type: 'MAN' };
          }
      }
      setBoard(newBoard);
      setTurn('RED');
      setWinner(null);
      setSelectedIdx(null);
      setValidMoves([]);
      setIsThinking(false);
      setRewardGiven(false);
      setJumpingPieceIdx(null);
      setAiMoving(null);

      if (isMultiplayer && roomCode) {
        const roomRef = doc(db, 'checkers_rooms', roomCode);
        updateDoc(roomRef, {
          status: 'PLAYING',
          board: JSON.stringify(newBoard),
          turn: 'RED',
          winner: null,
          jumpingPieceIdx: null,
          updatedAt: serverTimestamp()
        }).catch(err => console.error("Error resetting room:", err));
      }
  };

  useEffect(() => {
      if (difficulty) initBoard();
  }, [difficulty]);

  useEffect(() => {
      if (winner && !rewardGiven && onEarnTokens) {
          let reward = 0;
          if (isMultiplayer) {
              const iWon = (playerRole === 'p1' && winner === 'RED') || (playerRole === 'p2' && winner === 'BLACK');
              reward = iWon ? 50 : 0;
          } else if (winner === 'RED') {
              reward = difficulty === 'HARD' ? 20 : (difficulty === 'MEDIUM' ? 10 : 5);
          }

          if (reward > 0) {
              onEarnTokens(reward);
              setUserTokens(prev => prev + reward);
              setRewardGiven(true);
          }
      }
  }, [winner, rewardGiven, isMultiplayer, playerRole, difficulty, onEarnTokens]);

  const getJumps = (idx: number, currentBoard: Piece[]) => {
      const piece = currentBoard[idx];
      if (!piece) return [];
      const jumps: number[] = [];
      const row = Math.floor(idx / 8);
      const col = idx % 8;
      const isKing = piece.type === 'KING';
      const directions = [];
      if (piece.color === 'RED' || isKing) directions.push([-1, -1], [-1, 1]); 
      if (piece.color === 'BLACK' || isKing) directions.push([1, -1], [1, 1]); 

      directions.forEach(([dr, dc]) => {
          const endR = row + (dr * 2); const endC = col + (dc * 2);
          if (endR >= 0 && endR < 8 && endC >= 0 && endC < 8) {
              const midPiece = currentBoard[(row + dr) * 8 + (col + dc)];
              const endPiece = currentBoard[endR * 8 + endC];
              if (midPiece && midPiece.color !== piece.color && !endPiece) {
                  if (piece.type === 'MAN' && midPiece.type === 'KING') return; 
                  jumps.push(endR * 8 + endC);
              }
          }
      });
      return jumps;
  };

  const getRegularMoves = (idx: number, currentBoard: Piece[]) => {
      const piece = currentBoard[idx];
      if (!piece) return [];
      const moves: number[] = [];
      const row = Math.floor(idx / 8);
      const col = idx % 8;
      const isKing = piece.type === 'KING';
      const directions = [];
      if (piece.color === 'RED' || isKing) directions.push([-1, -1], [-1, 1]); 
      if (piece.color === 'BLACK' || isKing) directions.push([1, -1], [1, 1]); 

      directions.forEach(([dr, dc]) => {
          const r = row + dr; const c = col + dc;
          if (r >= 0 && r < 8 && c >= 0 && c < 8 && !currentBoard[r * 8 + c]) {
              moves.push(r * 8 + c);
          }
      });
      return moves;
  };

  const getMoves = (idx: number, currentBoard: Piece[]) => {
      return [...getJumps(idx, currentBoard), ...getRegularMoves(idx, currentBoard)];
  };

  const handleSelect = (idx: number) => {
      if (winner || isThinking || aiMoving) return;
      
      // Multiplayer turn check
      if (isMultiplayer) {
        if (playerRole === 'p1' && turn !== 'RED') return;
        if (playerRole === 'p2' && turn !== 'BLACK') return;
      } else {
        if (turn !== 'RED') return;
      }

      if (jumpingPieceIdx !== null && idx !== jumpingPieceIdx) return;
      
      const myColor = isMultiplayer ? (playerRole === 'p1' ? 'RED' : 'BLACK') : 'RED';
      if (board[idx]?.color === myColor) {
          setSelectedIdx(idx);
          setValidMoves(jumpingPieceIdx !== null ? getJumps(idx, board) : getMoves(idx, board));
      } else if (jumpingPieceIdx === null) {
          setSelectedIdx(null); setValidMoves([]);
      }
  };

  const movePiece = async (from: number, to: number) => {
      const newBoard = [...board];
      const piece = newBoard[from];
      if (!piece) return;
      const fromRow = Math.floor(from / 8); const toRow = Math.floor(to / 8);
      const isJump = Math.abs(toRow - fromRow) === 2;

      if (isJump) {
          const midRow = (fromRow + toRow) / 2;
          const midCol = (from % 8 + to % 8) / 2;
          newBoard[midRow * 8 + midCol] = null; 
      }
      newBoard[to] = { ...piece }; newBoard[from] = null;
      if (piece.color === 'RED' && toRow === 0) newBoard[to]!.type = 'KING';
      if (piece.color === 'BLACK' && toRow === 7) newBoard[to]!.type = 'KING';
      
      let newWinner: PieceColor | null = null;
      if (newBoard.filter(p => p?.color === 'BLACK').length === 0) newWinner = 'RED';
      else if (newBoard.filter(p => p?.color === 'RED').length === 0) newWinner = 'BLACK';

      let nextTurn = turn;
      let nextJumpingIdx = null;

      if (isJump) {
          const nextJumps = getJumps(to, newBoard);
          if (nextJumps.length > 0) { 
            nextJumpingIdx = to;
          } else {
            nextTurn = turn === 'RED' ? 'BLACK' : 'RED';
          }
      } else {
        nextTurn = turn === 'RED' ? 'BLACK' : 'RED';
      }

      if (isMultiplayer && roomCode) {
        const roomRef = doc(db, 'checkers_rooms', roomCode);
        
        // Optimistic local update
        setBoard(newBoard);
        setWinner(newWinner);
        setTurn(nextTurn);
        setJumpingPieceIdx(nextJumpingIdx);
        if (nextJumpingIdx) {
          setSelectedIdx(nextJumpingIdx);
          setValidMoves(getJumps(nextJumpingIdx, newBoard));
        } else {
          setSelectedIdx(null);
          setValidMoves([]);
        }

        await updateDoc(roomRef, {
          board: JSON.stringify(newBoard),
          turn: nextTurn,
          winner: newWinner,
          jumpingPieceIdx: nextJumpingIdx,
          updatedAt: serverTimestamp()
        });
      } else {
        setBoard(newBoard);
        setWinner(newWinner);
        setTurn(nextTurn);
        setJumpingPieceIdx(nextJumpingIdx);
        if (nextJumpingIdx) {
          setSelectedIdx(nextJumpingIdx);
          setValidMoves(getJumps(nextJumpingIdx, newBoard));
        } else {
          setSelectedIdx(null);
          setValidMoves([]);
        }
      }
  };

  const aiMove = () => {
      setIsThinking(true);
      setTimeout(() => {
          let currentBoard = [...board];
          let aiJumpingIdx: number | null = null;
          const executeMove = () => {
              const pieces = [];
              for (let i = 0; i < 64; i++) {
                  if (currentBoard[i]?.color === 'BLACK' && (aiJumpingIdx === null || aiJumpingIdx === i)) pieces.push(i);
              }
              let bestMove = null; let jumpsAvailable: any[] = []; let regularsAvailable: any[] = [];
              for (let i of pieces) {
                  getJumps(i, currentBoard).forEach(m => jumpsAvailable.push({ from: i, to: m }));
                  getRegularMoves(i, currentBoard).forEach(m => regularsAvailable.push({ from: i, to: m }));
              }
              if (jumpsAvailable.length > 0) bestMove = jumpsAvailable[Math.floor(Math.random() * jumpsAvailable.length)];
              else if (regularsAvailable.length > 0 && aiJumpingIdx === null) bestMove = regularsAvailable[Math.floor(Math.random() * regularsAvailable.length)];

              if (bestMove) {
                  setIsThinking(false); setAiMoving({ from: bestMove.from, to: bestMove.to });
                  setTimeout(() => {
                      const fRow = Math.floor(bestMove.from / 8); const tRow = Math.floor(bestMove.to / 8);
                      const isJ = Math.abs(tRow - fRow) === 2;
                      const p = currentBoard[bestMove.from];
                      if (isJ) { currentBoard[Math.floor((fRow + tRow) / 2) * 8 + Math.floor((bestMove.from % 8 + bestMove.to % 8) / 2)] = null; }
                      currentBoard[bestMove.to] = { ...p! }; currentBoard[bestMove.from] = null;
                      if (p && p.color === 'BLACK' && tRow === 7) currentBoard[bestMove.to]!.type = 'KING';
                      setAiMoving(null); setBoard([...currentBoard]);
                      if (isJ) {
                          const nextJ = getJumps(bestMove.to, currentBoard);
                          if (nextJ.length > 0) { aiJumpingIdx = bestMove.to; setTimeout(executeMove, 500); return; }
                      }
                      if (currentBoard.filter(p => p?.color === 'RED').length === 0) setWinner('BLACK'); else setTurn('RED');
                  }, 800);
              } else { setWinner('RED'); setIsThinking(false); }
          };
          executeMove();
      }, 2000);
  };

  useEffect(() => { if (turn === 'BLACK' && !winner && !aiMoving && !isMultiplayer) aiMove(); }, [turn, winner, isMultiplayer]);

  const handleLevelSelect = (level: Difficulty) => {
      if (level === 'HARD' && !isHardUnlocked) { setShowUnlockModal(true); return; }
      setDifficulty(level);
      setIsMultiplayer(false);
  };

  const generateRoomCode = async () => {
    if (!currentUser) {
      alert("Attendi la connessione al server...");
      return;
    }
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(code);
    setPlayerRole('p1');
    setIsMultiplayer(true);
    setIsConnected(false);
    
    try {
      const initialBoard = Array(64).fill(null);
      for (let i = 0; i < 64; i++) {
          const row = Math.floor(i / 8);
          const col = i % 8;
          if ((row + col) % 2 === 1) {
              if (row < 3) initialBoard[i] = { color: 'BLACK', type: 'MAN' };
              if (row > 4) initialBoard[i] = { color: 'RED', type: 'MAN' };
          }
      }

      await setDoc(doc(db, 'checkers_rooms', code), {
        p1: { id: currentUser.uid, name: 'Tu' },
        board: JSON.stringify(initialBoard),
        turn: 'RED',
        jumpingPieceIdx: null,
        status: 'WAITING',
        updatedAt: serverTimestamp()
      });
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
      const roomRef = doc(db, 'checkers_rooms', inputCode);
      try {
        const snap = await getDoc(roomRef);
        if (snap.exists()) {
          setRoomCode(inputCode);
          setPlayerRole('p2');
          setIsMultiplayer(true);
          setDifficulty('MEDIUM');
          
          await updateDoc(roomRef, {
            p2: { id: currentUser.uid, name: 'Tu' },
            status: 'PLAYING',
            updatedAt: serverTimestamp()
          });
        } else {
          alert("Stanza non trovata!");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        alert("Errore nell'accesso alla stanza.");
      }
    }
  };

  const restartMultiplayer = async () => {
    if (!roomCode) return;
    const roomRef = doc(db, 'checkers_rooms', roomCode);
    await updateDoc(roomRef, {
      status: 'RESTART',
      updatedAt: serverTimestamp()
    });
    initBoard();
  };

  const backToMenu = async () => { 
    if (isMultiplayer && roomCode) {
      try {
        const roomRef = doc(db, 'checkers_rooms', roomCode);
        await deleteDoc(roomRef);
      } catch (err) {
        console.error("Error deleting room:", err);
      }
    }
    setDifficulty(null); 
    setIsMultiplayer(false);
    setRoomCode('');
    initBoard(); 
  };

  const wrapperStyle = "fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 overflow-hidden touch-none overscroll-none select-none";

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

        {/* SFONDO A TUTTO SCHERMO DINAMICO */}
        <img 
            src={currentBg} 
            alt="" 
            className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-0 animate-in fade-in duration-1000" 
            draggable={false}
        />

        {/* TASTI NAVIGAZIONE IN ALTO A SINISTRA */}
        <div className="absolute top-[20px] left-4 right-4 z-[1300] flex justify-between items-start pointer-events-none">
            <div className="flex flex-col items-center gap-2 pointer-events-auto">
                <button onClick={onBack} className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-xl p-0 cursor-pointer touch-manipulation">
                    <img src={EXIT_BTN_IMG} alt="Ritorna al Parco" className="h-10 md:h-12 w-auto" />
                </button>
                
                {/* Tasto Audio sotto il tasto esci - Come richiesto */}
                <button 
                    onClick={() => {
                        const nextState = !musicEnabled;
                        setMusicEnabled(nextState);
                        localStorage.setItem('loneboo_game_music_enabled', String(nextState));
                    }}
                    className={`hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
                    title={musicEnabled ? "Spegni Musica" : "Accendi Musica"}
                >
                    <img src={AUDIO_ICON_IMG} alt="Audio" className="w-12 h-12 md:w-16 h-auto drop-shadow-xl" />
                </button>
            </div>
            
            <div className="flex gap-2 pointer-events-auto items-start">
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

        {/* SALDO GETTONI (SOTTO L'HEADER) */}
        <div className="absolute top-[20px] right-4 z-[1200] pointer-events-none shadow-xl">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50 flex items-center gap-2 text-white font-black text-sm md:text-lg pointer-events-auto">
                <span>{userTokens}</span> <TokenIcon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
        </div>

        {showUnlockModal && <UnlockModal onClose={() => setShowUnlockModal(false)} onUnlock={handleUnlockHard} onOpenNewsstand={handleOpenNewsstand} currentTokens={userTokens} />}
        
        {/* AREA CONTENUTO */}
        <div className="relative z-[110] w-full h-full flex flex-col items-center justify-start p-4 pt-32 md:pt-40">
            {!difficulty ? (
                <div className="flex flex-col items-center w-full animate-fade-in px-4">
                    <div className="flex flex-col gap-4 items-center w-full max-w-[220px] md:max-w-[280px] relative">
                        {/* Box istruzioni spostato SOPRA i tasti con posizionamento assoluto per non spostare i tasti stessi */}
                        <div className="absolute -top-16 md:-top-20 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/40 shadow-lg animate-in slide-in-from-top-4 w-max max-w-[90vw]">
                            <p className="font-luckiest text-white uppercase text-center tracking-wide drop-shadow-[2px_2px_0_black] text-sm md:text-xl" style={{ WebkitTextStroke: '1px black' }}>
                                {isMultiplayer ? "SFIDA MULTIPLAYER" : "Scegli un livello e sfida il nonno a Dama!"}
                            </p>
                        </div>

                        <button onClick={() => handleLevelSelect('EASY')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent">
                            <img src={BTN_EASY_IMG} alt="Facile" className="w-full h-auto drop-shadow-md" />
                        </button>
                        <button onClick={() => handleLevelSelect('MEDIUM')} className="sticker-btn animate-float-btn w-full outline-none border-none bg-transparent" style={{ animationDelay: '0.5s' }}>
                            <img src={BTN_MEDIUM_IMG} alt="Intermedio" className="w-full h-auto drop-shadow-md" />
                        </button>
                        <div className="relative sticker-btn animate-float-btn w-full" style={{ animationDelay: '1s' }}>
                            <button onClick={() => handleLevelSelect('HARD')} className={`w-full outline-none border-none bg-transparent ${!isHardUnlocked ? 'filter grayscale brightness-75 cursor-pointer' : ''}`}>
                                <img src={BTN_HARD_IMG} alt="Difficile" className="w-full h-auto drop-shadow-md" />
                            </button>
                            {!isHardUnlocked && (
                                <div className="absolute right-[-10px] top-[-10px] pointer-events-none z-20">
                                    <img src={LOCK_IMG} alt="Bloccato" className="w-10 h-10 drop-shadow-lg rotate-12" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-start min-h-0 pt-8 md:pt-14 px-2">
                    <div className="w-full max-w-[min(90vw,55vh)] md:max-w-[min(60vh,60vw)] flex flex-col items-center mb-2 gap-2">
                        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-1.5 rounded-full border-2 border-black relative shadow-lg shrink-0 scale-90 md:scale-100">
                            <div className={`w-4 h-4 rounded-full ${turn === 'RED' ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}></div>
                            <span className={`font-bold uppercase tracking-tight text-sm ${turn === 'RED' ? 'text-red-600' : 'text-slate-800'}`}>
                              {isMultiplayer ? (
                                playerRole === 'p1' ? (turn === 'RED' ? 'Tocca a te' : 'Tocca all\'avversario') : (turn === 'BLACK' ? 'Tocca a te' : 'Tocca all\'avversario')
                              ) : (
                                turn === 'RED' ? (jumpingPieceIdx !== null ? 'Ancora tu!' : 'Tocca a te (Rossi)') : 'Nonno (Neri)'
                              )}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/40 backdrop-blur-md p-3 md:p-4 rounded-[30px] border-4 border-white/50 shadow-2xl relative shrink-0">
                        {isThinking && !isMultiplayer && (
                            <div className="absolute top-0 right-[-15px] md:right-[-30px] z-[200] flex flex-col items-center animate-in fade-in zoom-in duration-500 pointer-events-none transform -translate-y-[35%] -rotate-3">
                                <span className="font-luckiest text-sm md:text-xl text-yellow-300 uppercase whitespace-nowrap mb-[-15px] relative z-10 -translate-x-3" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000', WebkitTextStroke: '1px black' }}>mmmh sto pensando...</span>
                                <img src={GRANDFATHER_THINKING_IMG} alt="Nonno pensa" className="w-56 h-56 md:w-72 md:h-72 max-w-none object-contain drop-shadow-xl" />
                            </div>
                        )}
                        <div className="grid grid-cols-8 grid-rows-8 w-[min(90vw,55vh)] h-[min(90vw,55vh)] md:w-[min(60vh,60vw)] md:h-[min(60vh,60vw)] border-4 border-amber-900 rounded-lg overflow-hidden bg-amber-100">
                            {displayIndices.map((idx) => {
                                const piece = board[idx];
                                const row = Math.floor(idx / 8); const col = idx % 8;
                                const isDark = (row + col) % 2 === 1;
                                const isVal = validMoves.includes(idx); const isSel = selectedIdx === idx;
                                const isJump = jumpingPieceIdx === idx;
                                const isAiFrom = aiMoving?.from === idx;
                                let transform = 'none'; let transition = 'none';
                                if (isAiFrom) {
                                    let dr = (Math.floor(aiMoving!.to / 8) - row) * 100;
                                    let dc = (aiMoving!.to % 8 - col) * 100;
                                    if (isMultiplayer && playerRole === 'p2') {
                                        dr = -dr;
                                        dc = -dc;
                                    }
                                    transform = `translate(${dc}%, ${dr}%)`; transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                                }
                                return (
                                    <div key={idx} onClick={() => isVal ? movePiece(selectedIdx!, idx) : handleSelect(idx)} className={`relative flex items-center justify-center w-full h-full rounded-sm ${isDark ? 'bg-amber-500' : 'bg-amber-100'} ${isSel ? 'ring-inset ring-4 ring-yellow-400 z-10' : ''} ${isJump ? 'ring-inset ring-2 ring-red-500 animate-pulse' : ''}`}>
                                        {isVal && !piece && <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full opacity-80 shadow-sm animate-pulse border-2 border-white" />}
                                        {piece && (aiMoving === null || aiMoving.to !== idx) && (
                                            <div className={`w-[80%] h-[80%] rounded-full shadow-[inset_0_4px_4px_rgba(255,255,255,0.4),0_4px_4px_rgba(0,0,0,0.2)] flex items-center justify-center border-4 relative ${piece.color === 'RED' ? 'bg-red-500 border-red-700' : 'bg-slate-800 border-black'} ${isAiFrom ? 'z-50 shadow-2xl' : 'z-10'}`} style={{ transform, transition }}>
                                                {piece.type === 'KING' && <span className="text-yellow-400 text-lg md:text-2xl font-black drop-shadow-sm">👑</span>}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {winner && (
                        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-300">
                            <div className="bg-white p-8 rounded-[40px] border-8 border-yellow-400 text-center shadow-2xl flex flex-col items-center max-sm w-full mx-auto relative overflow-hidden transform translate-y-10">
                                {winner === 'RED' && onOpenNewsstand && !isMultiplayer && <SaveReminder onOpenNewsstand={onOpenNewsstand} />}
                                
                                <div className="mb-2 w-full">
                                    {isMultiplayer ? (
                                        ((playerRole === 'p1' && winner === 'RED') || (playerRole === 'p2' && winner === 'BLACK')) ? (
                                            <div className="flex flex-col items-center w-full">
                                                <img src={MULTIPLAYER_WIN_IMG} alt="Hai Vinto" className="w-full h-auto object-contain drop-shadow-xl" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center w-full">
                                                <img src={MULTIPLAYER_LOST_IMG} alt="Hai Perso" className="w-full h-auto object-contain drop-shadow-xl" />
                                            </div>
                                        )
                                    ) : (
                                        winner === 'RED' ? (
                                            <div className="flex flex-col items-center">
                                                <img src={VICTORY_TITLE_IMG} alt="Hai Vinto" className="h-40 md:h-56 w-auto object-contain" />
                                                <p className="font-luckiest text-lg md:text-2xl text-boo-purple uppercase mt-2 whitespace-nowrap">HAI BATTUTO IL NONNO</p>
                                            </div>
                                        ) : (
                                            <h2 className="text-3xl font-black text-red-600 leading-tight uppercase">HAI PERSO 🤖</h2>
                                        )
                                    )}
                                </div>

                                {((!isMultiplayer && winner === 'RED') || (isMultiplayer && ((playerRole === 'p1' && winner === 'RED') || (playerRole === 'p2' && winner === 'BLACK')))) && (
                                    <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-lg border-2 border-black mb-6 animate-pulse inline-flex items-center gap-2 whitespace-nowrap shadow-lg transform rotate-[-2deg]">
                                        +{isMultiplayer ? 50 : (difficulty === 'EASY' ? 5 : difficulty === 'MEDIUM' ? 10 : 20)} GETTONI! <TokenIcon className="w-5 h-5" />
                                    </div>
                                )}

                                <div className="flex flex-row gap-4 w-full justify-center">
                                    <button 
                                        onClick={isMultiplayer ? restartMultiplayer : initBoard} 
                                        className="hover:scale-105 active:scale-95 transition-transform flex-1 max-w-[140px]"
                                    >
                                        <img 
                                          src={isMultiplayer ? BTN_PLAY_AGAIN_MULTI_IMG : BTN_PLAY_AGAIN_IMG} 
                                          alt="Rigioca" 
                                          className="w-full h-auto drop-shadow-xl" 
                                        />
                                    </button>
                                    <button 
                                        onClick={backToMenu} 
                                        className="hover:scale-105 active:scale-95 transition-transform flex-1 max-w-[140px]"
                                    >
                                        <img 
                                          src={isMultiplayer ? BTN_EXIT_MULTI_IMG : EXIT_BTN_IMG} 
                                          alt="Esci" 
                                          className="w-full h-auto drop-shadow-xl" 
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default CheckersGame;
