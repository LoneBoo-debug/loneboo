import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Monitor, Users, Send, Check, AlertCircle, Trophy, RotateCcw, ChevronDown } from 'lucide-react';
import { STICKERS_COLLECTION, STICKERS_COLLECTION_VOL2 } from '../services/stickersDatabase';
import { getProgress } from '../services/tokens';
import { Sticker, AppView } from '../types';
import { io, Socket } from 'socket.io-client';

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
}

const ClashBoo: React.FC<ClashBooProps> = ({ setView }) => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  
  const [player, setPlayer] = useState<GamePlayer>({ id: 'player', name: 'Tu', cards: [], selectedCard: null, score: 0, roundsWon: 0 });
  const [opponent, setOpponent] = useState<GamePlayer>({ id: 'opponent', name: 'Avversario', cards: [], selectedCard: null, score: 0, roundsWon: 0 });
  
  const [round, setRound] = useState(1);
  const [roundWinner, setRoundWinner] = useState<string | null>(null);
  const [isColpoFurbo, setIsColpoFurbo] = useState(false);
  
  const socketRef = useRef<Socket | null>(null);
  const progress = getProgress();
  
  // All stickers owned by the player
  const myStickers = useMemo(() => {
    const all = [...STICKERS_COLLECTION, ...STICKERS_COLLECTION_VOL2];
    return all.filter(s => progress.unlockedStickers.includes(s.id));
  }, [progress.unlockedStickers]);

  useEffect(() => {
    if (isMultiplayer) {
      socketRef.current = io();
      
      socketRef.current.on('player_joined', (data) => {
        console.log('Opponent joined:', data.id);
        // If we are the host, we might want to send our state
      });

      socketRef.current.on('game_action', (data) => {
        const { action, payload } = data;
        handleRemoteAction(action, payload);
      });

      return () => {
        socketRef.current?.disconnect();
      };
    }
  }, [isMultiplayer]);

  const handleRemoteAction = (action: string, payload: any) => {
    switch (action) {
      case 'CARDS_SELECTED':
        setOpponent(prev => ({ ...prev, cards: payload.cards, id: payload.id }));
        break;
      case 'CARD_PLAYED':
        setOpponent(prev => ({ ...prev, selectedCard: payload.card }));
        break;
      case 'RESTART':
        restartCurrentModeLocally();
        break;
    }
  };

  const restartCurrentModeLocally = () => {
    setPlayer(prev => ({ ...prev, cards: [], selectedCard: null, score: 0, roundsWon: 0 }));
    setOpponent(prev => ({ ...prev, cards: [], selectedCard: null, score: 0, roundsWon: 0 }));
    setRound(1);
    setRoundWinner(null);
    setIsColpoFurbo(false);
    setGameState('SELECT_CARDS');
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(code);
    setIsMultiplayer(true);
    socketRef.current?.emit('join_room', code);
    setGameState('SELECT_CARDS');
  };

  const joinRoom = () => {
    if (inputCode.length === 4) {
      setRoomCode(inputCode);
      setIsMultiplayer(true);
      socketRef.current?.emit('join_room', inputCode);
      setGameState('SELECT_CARDS');
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

  const confirmSelection = () => {
    if (player.cards.length === 5) {
      if (isMultiplayer) {
        socketRef.current?.emit('game_action', {
          roomCode,
          action: 'CARDS_SELECTED',
          payload: { cards: player.cards, id: socketRef.current.id }
        });
        setGameState('WAITING_OPPONENT');
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

  const playCard = (card: Sticker) => {
    if (player.selectedCard) return;
    
    setPlayer(prev => ({ ...prev, selectedCard: card }));
    
    if (isMultiplayer) {
      socketRef.current?.emit('game_action', {
        roomCode,
        action: 'CARD_PLAYED',
        payload: { card }
      });
    } else {
      // CPU plays a random card from its remaining cards
      const availableCpuCards = opponent.cards.filter(c => !opponent.selectedCard || c.id !== opponent.selectedCard.id);
      const randomCard = availableCpuCards[Math.floor(Math.random() * availableCpuCards.length)];
      setTimeout(() => {
        setOpponent(prev => ({ ...prev, selectedCard: randomCard }));
      }, 500);
    }
  };

  useEffect(() => {
    if (player.selectedCard && opponent.selectedCard) {
      resolveRound();
    }
  }, [player.selectedCard, opponent.selectedCard]);

  useEffect(() => {
    if (gameState === 'ROUND_RESULT') {
      const timer = setTimeout(() => {
        nextRound();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

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
      winnerId = pVal < oVal ? 'player' : 'opponent';
    } else {
      winnerId = pVal > oVal ? 'player' : 'opponent';
    }

    setIsColpoFurbo(colpoFurbo);
    setRoundWinner(winnerId);
    
    setTimeout(() => {
      setGameState('ROUND_RESULT');
    }, 1000);
  };

  const nextRound = () => {
    const pWon = roundWinner === 'player';
    const oWon = roundWinner === 'opponent';
    
    setPlayer(prev => ({ 
      ...prev, 
      roundsWon: pWon ? prev.roundsWon + 1 : prev.roundsWon,
      cards: prev.cards.filter(c => c.id !== prev.selectedCard?.id),
      selectedCard: null 
    }));
    setOpponent(prev => ({ 
      ...prev, 
      roundsWon: oWon ? prev.roundsWon + 1 : prev.roundsWon,
      cards: prev.cards.filter(c => c.id !== prev.selectedCard?.id),
      selectedCard: null 
    }));
    
    setRound(prev => prev + 1);
    setRoundWinner(null);
    setIsColpoFurbo(false);

    const pCardsLeft = player.cards.filter(c => c.id !== player.selectedCard?.id).length;

    if (player.roundsWon + (pWon ? 1 : 0) >= 3 || opponent.roundsWon + (oWon ? 1 : 0) >= 3 || pCardsLeft === 0) {
      setGameState('GAME_OVER');
    } else {
      setGameState('PLAYING');
    }
  };

  const restartCurrentMode = () => {
    restartCurrentModeLocally();
    
    if (isMultiplayer) {
      socketRef.current?.emit('game_action', {
        roomCode,
        action: 'RESTART',
        payload: {}
      });
    }
  };

  const resetGame = () => {
    setGameState('MENU');
    setPlayer({ id: 'player', name: 'Tu', cards: [], selectedCard: null, score: 0, roundsWon: 0 });
    setOpponent({ id: 'opponent', name: 'Avversario', cards: [], selectedCard: null, score: 0, roundsWon: 0 });
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
      <div className="relative p-4 flex justify-between items-center z-50">
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
                  className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-[100]"
                >
                  <button onClick={() => { generateRoomCode(); setShowInviteMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-700 text-white flex items-center gap-2">
                    <Send size={16} /> Invita (Crea)
                  </button>
                  <div className="p-2 border-t border-slate-700">
                    <input 
                      type="text" 
                      placeholder="Codice..." 
                      maxLength={4}
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      className="w-full bg-slate-900 text-white p-2 rounded border border-slate-600 text-center uppercase"
                    />
                    <button onClick={() => { joinRoom(); setShowInviteMenu(false); }} className="w-full mt-2 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-500">
                      Entra
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4">

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
          <div className="w-full max-w-4xl flex flex-col h-[90%] z-10 bg-slate-900/90 backdrop-blur-xl p-4 md:p-8 rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase italic">Scegli 5 Carte ({player.cards.length}/5)</h2>
              <button 
                onClick={confirmSelection}
                disabled={player.cards.length !== 5}
                className="px-8 py-3 bg-green-600 text-white rounded-full font-black disabled:opacity-50 disabled:grayscale shadow-lg"
              >
                CONFERMA
              </button>
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
          <div className="text-center z-10 bg-slate-900/80 backdrop-blur-lg p-12 rounded-3xl border-2 border-white/20 shadow-2xl max-w-[90vw]">
            <div className="w-24 h-24 border-8 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-3xl font-black text-white mb-2">ATTESA AVVERSARIO</h2>
            <p className="text-slate-400">Condividi il codice con un amico:</p>
            <div className="mt-4 bg-slate-800 px-8 py-4 rounded-2xl border-2 border-purple-500 text-4xl font-black text-white tracking-widest">
              {roomCode}
            </div>
          </div>
        )}

        {(gameState === 'PLAYING' || gameState === 'ROUND_RESULT') && (
          <div className="w-full max-w-[98vw] md:max-w-7xl flex flex-col h-[95%] z-10 justify-between bg-slate-900/60 backdrop-blur-md p-4 md:p-8 rounded-3xl border-2 border-white/10 shadow-2xl relative">
            {/* Round Result Overlay (Top Aligned) */}
            <AnimatePresence>
              {gameState === 'ROUND_RESULT' && (
                <motion.div 
                  initial={{ opacity: 0, y: -50, scale: 0.8 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-0 right-0 flex flex-col items-center justify-center z-[60] pointer-events-none"
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
