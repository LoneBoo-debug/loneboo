import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Monitor, Users, Send, Check, AlertCircle, Trophy, RotateCcw, ChevronDown } from 'lucide-react';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from '../services/stickersDatabase';
import { getProgress, addTokens } from '../services/tokens';
import { Sticker, AppView } from '../types';
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

const CLASH_BOO_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfondoclashboogifure.webp';

interface ClashBooProps {
  setView: (view: AppView) => void;
}

type GameState = 'MENU' | 'SELECT_CARDS' | 'WAITING_OPPONENT' | 'PLAYING' | 'ROUND_RESULT' | 'GAME_OVER';
type PlayerType = 'PLAYER' | 'CPU' | 'REMOTE';

interface GamePlayer {
  id: string;
  name: string;
  cards: Sticker[];
  selectedCard: Sticker | null;
  score: number;
  roundsWon: number;
  round: number;
}

const ClashBoo: React.FC<ClashBooProps> = ({ setView }) => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  
  const [isConnected, setIsConnected] = useState(false);
  const [playerRole, setPlayerRole] = useState<'p1' | 'p2' | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [player, setPlayer] = useState<GamePlayer>({ id: 'player', name: 'Tu', cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 });
  const [opponent, setOpponent] = useState<GamePlayer>({ id: 'opponent', name: 'Avversario', cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 });
  
  const [round, setRound] = useState(1);
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [isColpoFurbo, setIsColpoFurbo] = useState(false);
  const [isNextRoundReady, setIsNextRoundReady] = useState(false);
  
  const progress = getProgress();
  
  // All stickers owned by the player
  const myStickers = useMemo(() => {
    const all = [...STICKERS_COLLECTION, ...STICKERS_COLLECTION_VOL2];
    return all.filter(s => progress.unlockedStickers.includes(s.id));
  }, [progress.unlockedStickers]);

  // Auth setup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsConnected(true);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, []);

  // Multiplayer sync
  useEffect(() => {
    if (isMultiplayer && roomCode && currentUser) {
      const roomRef = doc(db, 'clashboo_rooms', roomCode);
      
      const unsubscribe = onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          
          // Sync opponent data
          if (playerRole === 'p1') {
            if (data.p2) {
              setOpponent(prev => {
                // Don't clear opponent card if we are still showing results of the current round
                const shouldKeepCard = gameState === 'ROUND_RESULT' && prev.selectedCard && !data.p2.selectedCard && data.p2.round > prev.round;
                return {
                  ...prev,
                  id: data.p2.id || 'opponent',
                  cards: data.p2.cards || [],
                  selectedCard: shouldKeepCard ? prev.selectedCard : (data.p2.selectedCard || null),
                  roundsWon: data.p2.roundsWon || 0,
                  round: data.p2.round || 1
                };
              });
            }
          } else if (playerRole === 'p2') {
            if (data.p1) {
              setOpponent(prev => {
                const shouldKeepCard = gameState === 'ROUND_RESULT' && prev.selectedCard && !data.p1.selectedCard && data.p1.round > prev.round;
                return {
                  ...prev,
                  id: data.p1.id || 'host',
                  cards: data.p1.cards || [],
                  selectedCard: shouldKeepCard ? prev.selectedCard : (data.p1.selectedCard || null),
                  roundsWon: data.p1.roundsWon || 0,
                  round: data.p1.round || 1
                };
              });
            }
          }

          // Sync game state if needed
          if (data.status === 'RESTART' && gameState !== 'SELECT_CARDS') {
            restartCurrentModeLocally();
          }
        } else if (playerRole === 'p2') {
          // Room deleted by host
          resetGame();
        }
      });

      return () => unsubscribe();
    }
  }, [isMultiplayer, roomCode, currentUser, playerRole]);

  const restartCurrentModeLocally = () => {
    setPlayer(prev => ({ ...prev, cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 }));
    setOpponent(prev => ({ ...prev, cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 }));
    setRound(1);
    setRoundWinner(null);
    setIsColpoFurbo(false);
    setGameState('SELECT_CARDS');
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
    
    try {
      if (!db) throw new Error("Database non inizializzato");
      
      await setDoc(doc(db, 'clashboo_rooms', code), {
        p1: { id: currentUser.uid, name: 'Tu', cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 },
        status: 'WAITING',
        updatedAt: serverTimestamp()
      });
      setGameState('SELECT_CARDS');
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
      const roomRef = doc(db, 'clashboo_rooms', inputCode);
      try {
        if (!db) throw new Error("Database non inizializzato");
        const snap = await getDoc(roomRef);
        if (snap.exists()) {
          setRoomCode(inputCode);
          setPlayerRole('p2');
          setIsMultiplayer(true);
          
          await updateDoc(roomRef, {
            p2: { id: currentUser.uid, name: 'Tu', cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 },
            status: 'PLAYING',
            updatedAt: serverTimestamp()
          });
          setGameState('SELECT_CARDS');
        } else {
          alert("Stanza non trovata! Verifica il codice.");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        alert("Errore nell'accesso alla stanza. Verifica la connessione.");
      }
    }
  };

  const startCpuGame = () => {
    setIsMultiplayer(false);
    setGameState('SELECT_CARDS');
  };

  const selectCard = (sticker: Sticker) => {
    if (player.cards.length < 5 && !player.cards.find(c => c.id === sticker.id)) {
      setPlayer(prev => ({ ...prev, cards: [...prev.cards, sticker] }));
    } else {
      setPlayer(prev => ({ ...prev, cards: prev.cards.filter(c => c.id !== sticker.id) }));
    }
  };

  const confirmSelection = async () => {
    if (player.cards.length === 5) {
      if (isMultiplayer && roomCode) {
        const roomRef = doc(db, 'clashboo_rooms', roomCode);
        const updateData: any = {};
        updateData[playerRole === 'p1' ? 'p1' : 'p2'] = {
          ...player,
          id: currentUser?.uid || player.id
        };
        
        try {
          await updateDoc(roomRef, updateData);
          setGameState('WAITING_OPPONENT');
        } catch (error) {
          console.error("Error confirming selection:", error);
        }
      } else {
        // Generate CPU cards
        const allStickers = [...STICKERS_COLLECTION, ...STICKERS_COLLECTION_VOL2];
        const cpuCards: Sticker[] = [];
        const shuffled = [...allStickers].sort(() => 0.5 - Math.random());
        for (let i = 0; i < 5; i++) cpuCards.push(shuffled[i]);
        setOpponent(prev => ({ ...prev, cards: cpuCards, name: 'Computer', id: 'cpu' }));
        setGameState('PLAYING');
      }
    }
  };

  useEffect(() => {
    if (gameState === 'WAITING_OPPONENT' && opponent.cards.length === 5) {
      setGameState('PLAYING');
    }
  }, [gameState, opponent.cards]);

  const playCard = async (card: Sticker) => {
    if (player.selectedCard) return;
    
    setPlayer(prev => ({ ...prev, selectedCard: card }));
    
    if (isMultiplayer && roomCode) {
      const roomRef = doc(db, 'clashboo_rooms', roomCode);
      const updateData: any = {};
      updateData[`${playerRole}.selectedCard`] = card;
      
      try {
        await updateDoc(roomRef, updateData);
      } catch (error) {
        console.error("Error playing card:", error);
      }
    } else {
      // CPU plays a random card from its remaining cards
      const availableCpuCards = opponent.cards.filter(c => !opponent.selectedCard || c.id !== opponent.selectedCard.id);
      if (availableCpuCards.length > 0) {
        const randomCard = availableCpuCards[Math.floor(Math.random() * availableCpuCards.length)];
        setTimeout(() => {
          setOpponent(prev => ({ ...prev, selectedCard: randomCard }));
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (isMultiplayer && roomCode && gameState === 'PLAYING') {
      // Reset next round ready state when entering playing state
      setIsNextRoundReady(false);
    }
  }, [gameState, isMultiplayer, roomCode]);

  useEffect(() => {
    if (player.selectedCard && opponent.selectedCard) {
      resolveRound();
    }
  }, [player.selectedCard, opponent.selectedCard]);

  useEffect(() => {
    if (gameState === 'ROUND_RESULT' && !isMultiplayer) {
      const timer = setTimeout(() => {
        nextRound();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, isMultiplayer]);

  const resolveRound = () => {
    const pVal = player.selectedCard?.value || 0;
    const oVal = opponent.selectedCard?.value || 0;
    const diff = Math.abs(pVal - oVal);
    
    let winnerId = null;
    let colpoFurbo = false;

    if (pVal === oVal) {
      winnerId = 'DRAW';
    } else if (diff >= 5) {
      colpoFurbo = true;
      // Low card beats high card if diff >= 5
      winnerId = pVal < oVal ? 'player' : 'opponent';
    } else {
      winnerId = pVal > oVal ? 'player' : 'opponent';
    }

    setIsColpoFurbo(colpoFurbo);
    setRoundWinner(winnerId);
    
    // Update scores immediately for CPU mode to ensure they are marked
    if (!isMultiplayer) {
      if (winnerId === 'player') {
        setPlayer(prev => ({ ...prev, roundsWon: prev.roundsWon + 1 }));
      } else if (winnerId === 'opponent') {
        setOpponent(prev => ({ ...prev, roundsWon: prev.roundsWon + 1 }));
      }
    }
    
    setTimeout(() => {
      setGameState('ROUND_RESULT');
    }, 1000);
  };

  const nextRound = async () => {
    // In CPU mode, roundsWon is already updated in resolveRound
    const pWon = !isMultiplayer ? false : (roundWinner === 'player');
    const oWon = !isMultiplayer ? false : (roundWinner === 'opponent');
    
    const newPlayer = { 
      ...player, 
      roundsWon: pWon ? player.roundsWon + 1 : player.roundsWon,
      cards: player.cards.filter(c => c.id !== player.selectedCard?.id),
      selectedCard: null,
      round: player.round + 1
    };

    if (!isMultiplayer) {
      const newOpponent = {
        ...opponent,
        // roundsWon already updated in resolveRound
        cards: opponent.cards.filter(c => c.id !== opponent.selectedCard?.id),
        selectedCard: null,
        round: opponent.round + 1
      };
      
      const pCardsLeft = newPlayer.cards.length;
      if (newPlayer.roundsWon >= 3 || newOpponent.roundsWon >= 3 || pCardsLeft === 0) {
        setPlayer(newPlayer);
        setOpponent(newOpponent);
        setGameState('GAME_OVER');
        if (newPlayer.roundsWon > newOpponent.roundsWon) {
          addTokens(50, 'Vittoria Clash Boo');
        }
      } else {
        setPlayer(newPlayer);
        setOpponent(newOpponent);
        setRound(prev => prev + 1);
        setRoundWinner(null);
        setIsColpoFurbo(false);
        setGameState('PLAYING');
      }
      return;
    }

    setPlayer(newPlayer);
    setRound(prev => prev + 1);
    setRoundWinner(null);
    setIsColpoFurbo(false);

    // Sync to Firebase if multiplayer
    if (isMultiplayer && roomCode) {
      const roomRef = doc(db, 'clashboo_rooms', roomCode);
      const updateData: any = {};
      updateData[playerRole === 'p1' ? 'p1' : 'p2'] = newPlayer;
      updateData.updatedAt = serverTimestamp();
      await updateDoc(roomRef, updateData);
    }

    const pCardsLeft = player.cards.filter(c => c.id !== player.selectedCard?.id).length;
    const oWonRounds = opponent.roundsWon + (oWon ? 1 : 0);
    const pWonRounds = player.roundsWon + (pWon ? 1 : 0);

    if (pWonRounds >= 3 || oWonRounds >= 3 || pCardsLeft === 0) {
      setGameState('GAME_OVER');
      if (pWonRounds > oWonRounds) {
        addTokens(50, 'Vittoria Clash Boo');
      }
    } else {
      setGameState('PLAYING');
    }
  };

  const restartCurrentMode = async () => {
    restartCurrentModeLocally();
    
    if (isMultiplayer && roomCode) {
      const roomRef = doc(db, 'clashboo_rooms', roomCode);
      try {
        await updateDoc(roomRef, {
          status: 'RESTART',
          p1: { ...player, cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 },
          p2: { ...opponent, cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 },
          updatedAt: serverTimestamp()
        });
        // Reset status back to PLAYING after a short delay
        setTimeout(() => {
          updateDoc(roomRef, { status: 'PLAYING' });
        }, 1000);
      } catch (error) {
        console.error("Error restarting game:", error);
      }
    }
  };

  const resetGame = async () => {
    if (isMultiplayer && roomCode && playerRole === 'p1') {
      try {
        await deleteDoc(doc(db, 'clashboo_rooms', roomCode));
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
    setGameState('MENU');
    setPlayer({ id: 'player', name: 'Tu', cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 });
    setOpponent({ id: 'opponent', name: 'Avversario', cards: [], selectedCard: null, score: 0, roundsWon: 0, round: 1 });
    setRound(1);
    setRoundWinner(null);
    setIsColpoFurbo(false);
    setIsMultiplayer(false);
    setRoomCode('');
    setInputCode('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={CLASH_BOO_BG} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-transparent">
        <button onClick={() => setView(AppView.PLAY)} className="hover:scale-105 active:scale-95 transition-transform">
          <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/esciclashboo.webp" alt="Esci" className="h-10 md:h-12 w-auto" />
        </button>
        
        <div className="flex gap-2">
          <button onClick={startCpuGame} className="hover:scale-105 active:scale-95 transition-transform">
            <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/fidailcomputerclashboo.webp" alt="Sfida Computer" className="h-10 md:h-12 w-auto" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowInviteMenu(!showInviteMenu)}
              className="hover:scale-105 active:scale-95 transition-transform"
            >
              <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/sfidaunamicoclashboo.webp" alt="Sfida Amico" className="h-10 md:h-12 w-auto" />
            </button>
            
            <AnimatePresence>
              {showInviteMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-60 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl overflow-hidden z-[100] p-4 flex flex-col gap-3"
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

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col items-center justify-center w-full h-full">

        {gameState === 'MENU' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-row gap-4 z-10">
            <button onClick={startCpuGame} className="hover:scale-105 transition-transform outline-none">
              <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/vcscomputeradesive.webp" alt="VS Computer" className="w-48 md:w-64 h-auto drop-shadow-xl" />
            </button>
            <button onClick={() => setShowInviteMenu(true)} className="hover:scale-105 transition-transform outline-none">
              <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/vsamicosdeseire.webp" alt="VS Amico" className="w-48 md:w-64 h-auto drop-shadow-xl" />
            </button>
          </motion.div>
        )}

        {gameState === 'SELECT_CARDS' && (
          <div className="w-full h-full z-10 bg-slate-900/90 backdrop-blur-xl p-4 md:p-8 pt-20 md:pt-24 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase italic">Scegli 5 Carte ({player.cards.length}/5)</h2>
              <div className="flex items-center gap-4">
                {isMultiplayer && (
                  <div className="bg-purple-600/30 px-3 py-1 rounded-full border border-purple-500/50 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    <span className="text-[10px] font-bold text-purple-200 uppercase tracking-tighter">
                      {isConnected ? (opponent.id !== 'opponent' ? 'Avversario Connesso' : 'Server OK - In attesa...') : 'Connessione...'}
                    </span>
                  </div>
                )}
                <button 
                  onClick={confirmSelection}
                  disabled={player.cards.length !== 5}
                  className="px-8 py-3 bg-green-600 text-white rounded-full font-black disabled:opacity-50 disabled:grayscale shadow-lg"
                >
                  CONFERMA
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 p-2 bg-slate-800/50 rounded-2xl border-2 border-slate-700">
              {myStickers.map(s => {
                const isSelected = player.cards.find(c => c.id === s.id);
                return (
                  <div 
                    key={s.id} 
                    onClick={() => selectCard(s)}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer border-4 transition-all ${isSelected ? 'border-yellow-400 scale-95' : 'border-transparent hover:border-white/30'}`}
                  >
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-yellow-400 text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-black italic">
                      {s.value}
                    </div>
                    {isSelected && (
                      <div className="absolute inset-0 bg-yellow-400/20 flex items-center justify-center">
                        <Check className="text-white drop-shadow-md" size={32} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                );
              })}
              {myStickers.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400">
                  <AlertCircle size={48} className="mb-4" />
                  <p>Non hai ancora figurine! Vai in edicola a comprare dei pacchetti.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {gameState === 'WAITING_OPPONENT' && (
          <div className="w-full h-full z-10 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-lg p-12 pt-20 md:pt-24 relative">
            <div className="w-24 h-24 border-8 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-3xl font-black text-white mb-2">ATTESA AVVERSARIO</h2>
            <p className="text-slate-400">Condividi il codice con un amico:</p>
            <div className="mt-4 bg-slate-800 px-8 py-4 rounded-2xl border-2 border-purple-500 text-4xl font-black text-white tracking-widest">
              {roomCode}
            </div>
            {opponent.id !== 'opponent' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 flex items-center gap-3 bg-green-600/20 border border-green-500/50 px-6 py-3 rounded-full"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-bold uppercase tracking-widest">Amico Connesso!</span>
              </motion.div>
            )}
          </div>
        )}

        {(gameState === 'PLAYING' || gameState === 'ROUND_RESULT') && (
          <div className="w-full h-full z-10 flex flex-col justify-between bg-slate-900/60 backdrop-blur-md p-4 md:p-8 pt-20 md:pt-24 relative">
            {/* Round Result Overlay (Top Aligned) */}
            <AnimatePresence>
              {gameState === 'ROUND_RESULT' && (
                <motion.div 
                  initial={{ opacity: 0, y: -50, scale: 0.8 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-24 md:top-32 left-0 right-0 flex flex-col items-center justify-center z-[60] pointer-events-none"
                >
                  {isColpoFurbo && (
                    <div className="bg-yellow-400 text-black px-6 py-1 rounded-full font-black text-lg mb-2 animate-bounce shadow-[4px_4px_0px_rgba(0,0,0,0.3)] border-2 border-black">
                      COLPO FURBO! 🦊
                    </div>
                  )}
                  <img 
                    src={roundWinner === 'player' ? 'https://loneboo-images.s3.eu-south-1.amazonaws.com/haivontoclahsbooe.webp' : 
                         roundWinner === 'opponent' ? 'https://loneboo-images.s3.eu-south-1.amazonaws.com/haipersoclashboopake4.webp' : 
                         'https://loneboo-images.s3.eu-south-1.amazonaws.com/pareggioclashboode3.webp'} 
                    alt={roundWinner || 'Pareggio'} 
                    className={`${roundWinner === 'DRAW' ? 'h-20 md:h-32' : 'h-28 md:h-48'} w-auto drop-shadow-2xl transition-all`}
                  />
                  
                  {isMultiplayer && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => {
                        setIsNextRoundReady(true);
                        nextRound();
                      }}
                      disabled={isNextRoundReady}
                      className="mt-4 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-black rounded-full shadow-xl border-2 border-white/50 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale pointer-events-auto"
                    >
                      {isNextRoundReady ? 'ATTESA...' : 'PROSSIMO ROUND'}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Opponent Area */}
            <div className="flex flex-col items-center">
              <div className="flex gap-4 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 border-white ${i < opponent.roundsWon ? 'bg-red-500' : 'bg-slate-700'}`}></div>
                ))}
              </div>
              <div className="flex gap-2">
                {opponent.cards.map((_, i) => (
                  <div key={i} className="w-12 h-16 bg-slate-700 rounded-lg border-2 border-slate-600 flex items-center justify-center">
                    <div className="w-8 h-8 bg-slate-600 rounded-full opacity-20"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Battle Area */}
            <div className="flex-1 flex items-center justify-center gap-4 md:gap-16 px-4 relative">
              <div className="flex flex-col items-center">
                <span className="text-white font-black mb-2 uppercase text-sm">{opponent.name}</span>
                <AnimatePresence mode="wait">
                  {opponent.selectedCard ? (
                    <motion.div 
                      key="opp-card"
                      initial={{ y: -100, opacity: 0, rotateY: 180 }}
                      animate={{ y: 0, opacity: 1, rotateY: gameState === 'ROUND_RESULT' ? 0 : 180 }}
                      className="w-32 h-44 md:w-48 md:h-64 bg-white rounded-2xl border-4 border-red-500 shadow-2xl overflow-hidden relative"
                    >
                      {gameState === 'ROUND_RESULT' ? (
                        <>
                          <img src={opponent.selectedCard.image} className="w-full h-full object-cover" alt="" />
                          <div className="absolute top-2 left-2 bg-yellow-400 text-black font-black text-xl w-10 h-10 rounded-full flex items-center justify-center border-2 border-black italic">
                            {opponent.selectedCard.value}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-500/20 rounded-full border-4 border-red-500/30"></div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="w-32 h-44 md:w-48 md:h-64 border-4 border-dashed border-slate-700 rounded-2xl flex items-center justify-center text-slate-700 font-black">
                      ...
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-6xl font-black text-white italic drop-shadow-lg">VS</div>

              <div className="flex flex-col items-center">
                <span className="text-white font-black mb-2 uppercase text-sm">{player.name}</span>
                <AnimatePresence mode="wait">
                  {player.selectedCard ? (
                    <motion.div 
                      key="player-card"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="w-32 h-44 md:w-48 md:h-64 bg-white rounded-2xl border-4 border-blue-500 shadow-2xl overflow-hidden relative"
                    >
                      <img src={player.selectedCard.image} className="w-full h-full object-cover" alt="" />
                      <div className="absolute top-2 left-2 bg-yellow-400 text-black font-black text-xl w-10 h-10 rounded-full flex items-center justify-center border-2 border-black italic">
                        {player.selectedCard.value}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="w-32 h-44 md:w-48 md:h-64 border-4 border-dashed border-slate-700 rounded-2xl flex items-center justify-center text-slate-700 font-black">
                      SCEGLI
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Player Area */}
            <div className="flex flex-col items-center w-full">
              <div className="flex gap-3 mb-4 overflow-x-auto w-full p-2 px-4 scrollbar-hide snap-x snap-mandatory">
                {player.cards.map((c) => (
                  <button 
                    key={c.id} 
                    onClick={() => playCard(c)}
                    disabled={!!player.selectedCard || gameState === 'ROUND_RESULT'}
                    className={`relative w-24 h-32 md:w-36 md:h-48 bg-white rounded-xl border-2 overflow-hidden transition-all flex-shrink-0 snap-center ${player.selectedCard?.id === c.id ? 'opacity-50 scale-90 border-blue-500' : 'hover:-translate-y-4 border-white shadow-lg'}`}
                  >
                    <img src={c.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-1 left-1 bg-yellow-400 text-black font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border border-black italic">
                      {c.value}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 border-white ${i < player.roundsWon ? 'bg-blue-500' : 'bg-slate-700'}`}></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-center z-10 bg-slate-800/95 backdrop-blur-xl p-8 md:p-12 rounded-3xl border-4 border-white shadow-2xl max-w-[90vw] md:max-w-lg w-full mx-auto"
          >
            {player.roundsWon > opponent.roundsWon ? (
              <Trophy size={80} className="mx-auto mb-6 text-yellow-400" />
            ) : player.roundsWon < opponent.roundsWon ? (
              <AlertCircle size={80} className="mx-auto mb-6 text-red-400" />
            ) : (
              <Users size={80} className="mx-auto mb-6 text-blue-400" />
            )}
            
            <h2 className="text-5xl font-black text-white mb-2 uppercase italic">
              {player.roundsWon > opponent.roundsWon ? 'CAMPIONE!' : 
               player.roundsWon < opponent.roundsWon ? 'RITENTA!' : 'PAREGGIO!'}
            </h2>
            {player.roundsWon > opponent.roundsWon && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 mb-4 bg-yellow-400/20 py-2 px-4 rounded-full border border-yellow-400/50 w-fit mx-auto"
              >
                <span className="text-yellow-400 font-black text-2xl">+50</span>
                <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/gettoneloneboonew.webp" alt="Gettoni" className="w-8 h-8" />
              </motion.div>
            )}
            <p className="text-slate-400 mb-8 text-xl">Punteggio finale: {player.roundsWon} - {opponent.roundsWon}</p>
            <div className="flex gap-4 justify-center">
              <button onClick={restartCurrentMode} className="hover:scale-105 transition-transform outline-none">
                <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/riogiocaclahsnfknedfn3.webp" alt="Rigioca" className="h-14 md:h-20 w-auto" />
              </button>
              <button onClick={resetGame} className="hover:scale-105 transition-transform outline-none">
                <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/escivlchasdbvjjrh43e.webp" alt="Esci" className="h-14 md:h-20 w-auto" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClashBoo;
