
import React, { useState, useEffect, useRef } from 'react';
import { Play, Music } from 'lucide-react';

const EXIT_BTN_IMG = 'https://i.postimg.cc/0QpvC8JQ/ritorna-al-parco-(1)-(2).png';

const COLS = 4;
const GAME_HEIGHT = 400;

interface Note {
    id: number;
    col: number;
    y: number;
    clicked: boolean;
}

const FallingNotesGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const notesRef = useRef<Note[]>([]);
  const reqRef = useRef<number>(0);
  const speedRef = useRef(2);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
      if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
              audioCtxRef.current = new AudioContextClass();
          }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
  };

  useEffect(() => {
      return () => { audioCtxRef.current?.close(); };
  }, []);

  const playTone = () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const freqs = [261.63, 293.66, 329.63, 392.00, 440.00]; 
      osc.frequency.value = freqs[Math.floor(Math.random() * freqs.length)];
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
  };

  const startGame = () => {
      getAudioContext(); 
      setGameOver(false);
      setScore(0);
      speedRef.current = 3;
      notesRef.current = [];
      setIsPlaying(true);
  };

  const update = () => {
      if (!isPlaying || gameOver) return;

      if (Math.random() < 0.03) {
          notesRef.current.push({
              id: Date.now() + Math.random(),
              col: Math.floor(Math.random() * COLS),
              y: -100,
              clicked: false
          });
      }

      const nextNotes: Note[] = [];
      for (const note of notesRef.current) {
          note.y += speedRef.current;
          
          if (note.y > GAME_HEIGHT) {
              if (!note.clicked) {
                  setGameOver(true);
                  setIsPlaying(false);
                  return;
              }
          } else {
              nextNotes.push(note);
          }
      }
      notesRef.current = nextNotes;
      
      reqRef.current = requestAnimationFrame(update);
  };

  const [renderNotes, setRenderNotes] = useState<Note[]>([]);
  useEffect(() => {
      if (isPlaying && !gameOver) {
          const loop = () => {
              if (Math.random() < 0.02 + (score * 0.0005)) {
                  notesRef.current.push({
                      id: Date.now() + Math.random(),
                      col: Math.floor(Math.random() * COLS),
                      y: -120, 
                      clicked: false
                  });
              }
              
              const newNotes: Note[] = [];
              let missed = false;

              notesRef.current.forEach(note => {
                  note.y += speedRef.current + (score * 0.01);
                  if (note.y > GAME_HEIGHT) {
                      if (!note.clicked) missed = true;
                  } else {
                      newNotes.push(note);
                  }
              });

              if (missed) {
                  setGameOver(true);
                  setIsPlaying(false);
              } else {
                  notesRef.current = newNotes;
                  setRenderNotes([...notesRef.current]); 
                  reqRef.current = requestAnimationFrame(loop);
              }
          };
          reqRef.current = requestAnimationFrame(loop);
      }
      return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [isPlaying, gameOver]);

  const handleTileClick = (id: number) => {
      const note = notesRef.current.find(n => n.id === id);
      if (note && !note.clicked) {
          note.clicked = true;
          playTone();
          setScore(s => s + 1);
      }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in w-full">
        <h2 className="text-4xl font-black text-boo-orange mb-4 drop-shadow-[2px_2px_0_black]" style={{ textShadow: "3px 3px 0px black" }}>
            Note Cadenti
        </h2>

        <div className="relative bg-gray-900 border-4 border-black rounded-xl overflow-hidden shadow-2xl" style={{ width: 320, height: GAME_HEIGHT }}>
            
            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
                <div className="border-r border-gray-700"></div>
                <div className="border-r border-gray-700"></div>
                <div className="border-r border-gray-700"></div>
            </div>

            <div className="absolute bottom-20 left-0 w-full h-1 bg-green-500 opacity-50"></div>

            {renderNotes.map(note => (
                <div
                    key={note.id}
                    onMouseDown={() => handleTileClick(note.id)}
                    onTouchStart={(e) => { e.preventDefault(); handleTileClick(note.id); }}
                    className={`
                        absolute w-[25%] h-24 rounded-lg border-2 border-white/20 flex items-center justify-center transition-opacity duration-200 cursor-pointer
                        ${note.clicked ? 'opacity-0 scale-110' : 'opacity-100'}
                        ${note.col === 0 ? 'bg-red-500 left-0' : 
                          note.col === 1 ? 'bg-blue-500 left-[25%]' : 
                          note.col === 2 ? 'bg-yellow-500 left-[50%]' : 'bg-green-500 left-[75%]'}
                    `}
                    style={{ top: note.y }}
                >
                    {!note.clicked && <Music className="text-white/50" />}
                </div>
            ))}

            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-black text-3xl drop-shadow-md z-20">
                {score}
            </div>

            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30">
                    <p className="text-white font-bold mb-4">Tocca le note prima che cadano!</p>
                    <button onClick={startGame} className="bg-boo-purple text-white px-8 py-3 rounded-full font-black border-4 border-white hover:scale-105">
                        START
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center z-30 animate-in zoom-in">
                    <h3 className="text-3xl font-black text-white mb-2">MUSICA FINITA</h3>
                    <p className="text-white text-xl font-bold mb-6">Punteggio: {score}</p>
                    <button onClick={startGame} className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black border-4 border-black mb-4">
                        RIPROVA
                    </button>
                    <button onClick={onBack} className="hover:scale-105 active:scale-95 transition-transform">
                        <img src={EXIT_BTN_IMG} alt="Esci" className="h-12 w-auto" />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default FallingNotesGame;
