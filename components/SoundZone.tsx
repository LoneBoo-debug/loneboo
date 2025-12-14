
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, Music } from 'lucide-react'; 
import RobotHint from './RobotHint';
import { DJ_SOUNDS, ANIMAL_SOUNDS, DRUM_SOUNDS } from '../constants';

const DISCO_BG_MOBILE = 'https://i.postimg.cc/9M86Fxpz/disco3.png';
const DISCO_BG_DESKTOP = 'https://i.postimg.cc/136sRMS0/disco169.jpg';

enum SoundMode {
    NONE = 'NONE',
    PIANO = 'PIANO',
    DJ = 'DJ',
    DRUMS = 'DRUMS',
    ANIMALS = 'ANIMALS',
    XYLOPHONE = 'XYLOPHONE',
    GUITAR = 'GUITAR',
    CHOIR = 'CHOIR',
    BONGO = 'BONGO'
}

type Point = { x: number; y: number };
type ZoneConfig = { id: string; points: Point[]; };

// ZONE MOBILE
const ZONES_MOBILE: ZoneConfig[] = [
  { "id": "Piano", "points": [ { "x": 8, "y": 51.87 }, { "x": 19.19, "y": 63.89 }, { "x": 51.97, "y": 51.69 }, { "x": 41.58, "y": 42.18 } ] },
  { "id": "Batteria", "points": [ { "x": 58.1, "y": 35.71 }, { "x": 59.43, "y": 53.12 }, { "x": 87.42, "y": 57.07 }, { "x": 88.22, "y": 32.12 } ] },
  { "id": "Effects/DJ", "points": [ { "x": 62.1, "y": 73.94 }, { "x": 67.43, "y": 82.38 }, { "x": 97.81, "y": 68.56 }, { "x": 88.75, "y": 62.28 } ] },
  { "id": "Animali", "points": [ { "x": 10.66, "y": 21.9 }, { "x": 18.39, "y": 32.66 }, { "x": 31.72, "y": 29.61 }, { "x": 24.25, "y": 18.49 } ] },
  { "id": "Chitarra 3", "points": [ { "x": 36.51, "y": 12.74 }, { "x": 36.78, "y": 34.28 }, { "x": 46.91, "y": 33.02 }, { "x": 40.25, "y": 13.1 } ] },
  { "id": "Coro", "points": [ { "x": 55.17, "y": 14.18 }, { "x": 55.17, "y": 26.2 }, { "x": 93.55, "y": 29.25 }, { "x": 87.95, "y": 14.54 } ] },
  { "id": "Xilofono", "points": [ { "x": 10.66, "y": 76.81 }, { "x": 3.73, "y": 80.4 }, { "x": 24.25, "y": 88.48 }, { "x": 28.25, "y": 84.71 } ] },
  { "id": "Bongo", "points": [ { "x": 30.92, "y": 88.12 }, { "x": 31.72, "y": 96.02 }, { "x": 38.11, "y": 96.55 }, { "x": 40.25, "y": 87.22 } ] },
  { "id": "Chitarra 1", "points": [ { "x": 54.64, "y": 70.89 }, { "x": 43.18, "y": 94.04 }, { "x": 53.84, "y": 97.45 }, { "x": 57.84, "y": 72.33 } ] },
  { "id": "Chitarra 2", "points": [ { "x": 2.4, "y": 23.51 }, { "x": 3.46, "y": 44.33 }, { "x": 13.59, "y": 42.89 }, { "x": 5.86, "y": 24.77 } ] }
];

// ZONE DESKTOP
const ZONES_DESKTOP: ZoneConfig[] = [
  { "id": "Piano", "points": [ { "x": 30.82, "y": 55.08 }, { "x": 36.35, "y": 66.88 }, { "x": 50.91, "y": 54.55 }, { "x": 46.28, "y": 45.64 } ] },
  { "id": "Batteria", "points": [ { "x": 53.4, "y": 36.72 }, { "x": 53.85, "y": 57.18 }, { "x": 67.73, "y": 59.8 }, { "x": 66.83, "y": 35.15 } ] },
  { "id": "Effects/DJ", "points": [ { "x": 54.75, "y": 76.32 }, { "x": 57.57, "y": 84.45 }, { "x": 71.69, "y": 71.08 }, { "x": 66.83, "y": 64.26 } ] },
  { "id": "Animali", "points": [ { "x": 32.06, "y": 23.61 }, { "x": 35.79, "y": 35.67 }, { "x": 42.33, "y": 31.47 }, { "x": 38.95, "y": 19.41 } ] },
  { "id": "Xilofono", "points": [ { "x": 32.74, "y": 78.16 }, { "x": 29.69, "y": 82.09 }, { "x": 39.06, "y": 90.22 }, { "x": 40.64, "y": 86.03 } ] },
  { "id": "Chitarra 1", "points": [ { "x": 51.7, "y": 72.65 }, { "x": 47.64, "y": 94.95 }, { "x": 52.38, "y": 97.83 }, { "x": 53.06, "y": 73.18 } ] },
  { "id": "Chitarra 2", "points": [ { "x": 28.45, "y": 24.65 }, { "x": 29.01, "y": 46.95 }, { "x": 33.3, "y": 46.16 }, { "x": 29.92, "y": 25.18 } ] },
  { "id": "Chitarra 3", "points": [ { "x": 44.25, "y": 13.9 }, { "x": 43.91, "y": 36.98 }, { "x": 48.54, "y": 35.67 }, { "x": 45.72, "y": 14.43 } ] },
  { "id": "Coro", "points": [ { "x": 51.36, "y": 14.43 }, { "x": 51.82, "y": 28.33 }, { "x": 70.78, "y": 30.42 }, { "x": 70.78, "y": 14.69 } ] },
  { "id": "Bongo", "points": [ { "x": 41.77, "y": 88.39 }, { "x": 42.11, "y": 97.04 }, { "x": 45.38, "y": 96.78 }, { "x": 45.95, "y": 87.6 } ] }
];

// --- SUB-COMPONENTS (MERGED) ---

const PianoComponent = () => {
    const NOTES = [
        { note: 'C4', freq: 261.63, color: 'bg-red-500', label: 'Do' },
        { note: 'D4', freq: 293.66, color: 'bg-orange-500', label: 'Re' },
        { note: 'E4', freq: 329.63, color: 'bg-yellow-400', label: 'Mi' },
        { note: 'F4', freq: 349.23, color: 'bg-green-500', label: 'Fa' },
        { note: 'G4', freq: 392.00, color: 'bg-cyan-500', label: 'Sol' },
        { note: 'A4', freq: 440.00, color: 'bg-blue-500', label: 'La' },
        { note: 'B4', freq: 493.88, color: 'bg-purple-500', label: 'Si' },
        { note: 'C5', freq: 523.25, color: 'bg-red-400', label: 'Do' },
    ];
    const audioCtxRef = useRef<AudioContext | null>(null);
    useEffect(() => { return () => { audioCtxRef.current?.close(); }; }, []);
    const playNote = (freq: number) => {
        if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.8); 
        osc.stop(ctx.currentTime + 0.8);
    };
    return (
        <div className="w-full h-[300px] md:h-[400px] landscape:h-[180px] bg-black p-3 md:p-5 pt-8 md:pt-10 pb-4 landscape:pt-6 landscape:pb-2 rounded-[40px] border-4 border-gray-800 shadow-xl flex gap-1 md:gap-2 relative">
            {NOTES.map((n, i) => (
                <button key={i} onMouseDown={() => playNote(n.freq)} onTouchStart={(e) => { e.preventDefault(); playNote(n.freq); }} className={`flex-1 h-full rounded-b-xl border-x border-b-4 border-black/20 active:scale-y-[0.95] origin-top transition-transform flex flex-col justify-end items-center pb-4 ${n.color}`}><span className="font-black text-white text-xl md:text-4xl drop-shadow-md">{n.label}</span></button>
            ))}
        </div>
    );
};

const DJComponent = () => {
    const playSound = (src: string) => { const a = new Audio(src); a.volume = 0.8; a.play().catch(()=>{}); };
    return (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 w-full max-w-3xl mx-auto">
            {DJ_SOUNDS.map((s) => (
                <button key={s.id} onPointerDown={(e) => { e.preventDefault(); playSound(s.src); }} className="aspect-square rounded-2xl border-4 border-black bg-white active:bg-yellow-300 active:scale-95 transition-all shadow-lg flex flex-col items-center justify-center">
                    <span className="text-4xl select-none">{s.emoji}</span>
                    <span className="font-black text-gray-800 text-[10px] uppercase">{s.label}</span>
                </button>
            ))}
        </div>
    );
};

const DrumComponent = () => {
    const playSound = (src: string) => { const a = new Audio(src); a.volume = 0.9; a.play().catch(()=>{}); };
    return (
        <div className="grid grid-cols-3 gap-3 w-full max-w-lg mx-auto bg-gray-800 p-4 rounded-[30px] border-4 border-gray-600">
            {DRUM_SOUNDS.map((s) => (
                <button key={s.id} onPointerDown={(e) => { e.preventDefault(); playSound(s.src); }} className={`aspect-square rounded-xl border-4 ${s.color} active:brightness-150 active:scale-95 transition-all relative shadow-inner flex items-center justify-center`}>
                    <span className="font-black text-white text-xs uppercase">{s.label}</span>
                </button>
            ))}
        </div>
    );
};

const AnimalComponent = () => {
    const playSound = (src: string) => { const a = new Audio(src); a.play().catch(()=>{}); };
    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl mx-auto">
            {ANIMAL_SOUNDS.map((a) => (
                <button key={a.id} onPointerDown={(e) => { e.preventDefault(); playSound(a.src); }} className="aspect-square rounded-2xl border-4 border-black bg-white hover:bg-green-50 active:bg-green-200 active:scale-95 transition-all shadow-md flex flex-col items-center justify-center gap-1">
                    <span className="text-5xl select-none">{a.emoji}</span>
                    <span className="font-black text-gray-800 text-xs uppercase">{a.label}</span>
                </button>
            ))}
        </div>
    );
};

const SoundZone: React.FC = () => {
  const [activeMode, setActiveMode] = useState<SoundMode>(SoundMode.NONE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const imgMobile = new Image(); imgMobile.src = DISCO_BG_MOBILE;
      const imgDesktop = new Image(); imgDesktop.src = DISCO_BG_DESKTOP;
      let loadedCount = 0;
      const checkLoad = () => { loadedCount++; if (loadedCount >= 1) setIsLoaded(true); };
      imgMobile.onload = checkLoad; imgDesktop.onload = checkLoad;
      setTimeout(() => setIsLoaded(true), 1500);
      window.scrollTo(0, 0);
      const timer = setTimeout(() => { if (activeMode === SoundMode.NONE) setShowHint(true); }, 1000); 
      return () => clearTimeout(timer);
  }, []); 

  useEffect(() => {
      if (activeMode === SoundMode.PIANO) document.body.classList.add('allow-landscape');
      else document.body.classList.remove('allow-landscape');
      return () => { document.body.classList.remove('allow-landscape'); };
  }, [activeMode]);

  const handleInteraction = () => { if (showHint) setShowHint(false); };
  const getClipPath = (points: Point[]) => { if (!points || points.length < 3) return 'none'; const poly = points.map(p => `${p.x}% ${p.y}%`).join(', '); return `polygon(${poly})`; };

  const handleZoneClick = (zoneId: string) => {
      setShowHint(false); 
      switch (zoneId) {
          case 'Piano': setActiveMode(SoundMode.PIANO); break;
          case 'Batteria': setActiveMode(SoundMode.DRUMS); break;
          case 'Effects/DJ': setActiveMode(SoundMode.DJ); break;
          case 'Animali': setActiveMode(SoundMode.ANIMALS); break;
          case 'Xilofono': setActiveMode(SoundMode.XYLOPHONE); break;
          case 'Chitarra 1': case 'Chitarra 2': case 'Chitarra 3': setActiveMode(SoundMode.GUITAR); break;
          case 'Coro': setActiveMode(SoundMode.CHOIR); break;
          case 'Bongo': setActiveMode(SoundMode.BONGO); break;
      }
  };

  if (activeMode !== SoundMode.NONE) {
      return (
          <div className="w-full h-full overflow-y-auto pb-20 bg-gray-900/95 backdrop-blur-sm animate-in fade-in">
                <div className="w-full p-3 flex items-center z-40 sticky top-0 bg-transparent -mt-2">
                    <button onClick={() => setActiveMode(SoundMode.NONE)} className="flex items-center gap-2 bg-pink-500 text-white font-black py-2 px-6 rounded-full border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-105 active:translate-y-1 transition-all">
                        <ArrowLeft size={20} strokeWidth={4} /> <span className="text-sm md:text-base">INDIETRO</span>
                    </button>
                </div>
                <div className="p-4 flex justify-center">
                    {activeMode === SoundMode.PIANO && <div className="max-w-4xl w-full"><h2 className="text-center text-4xl font-black text-boo-orange mb-4 text-stroke-3">Piano Magico</h2><PianoComponent /></div>}
                    {activeMode === SoundMode.DJ && <div className="max-w-4xl w-full"><h2 className="text-center text-4xl font-black text-pink-500 mb-8 text-stroke-3">DJ Console</h2><DJComponent /></div>}
                    {activeMode === SoundMode.DRUMS && <div className="max-w-4xl w-full"><h2 className="text-center text-4xl font-black text-blue-500 mb-8 text-stroke-3">Batteria</h2><DrumComponent /></div>}
                    {activeMode === SoundMode.ANIMALS && <div className="max-w-4xl w-full"><h2 className="text-center text-4xl font-black text-green-500 mb-8 text-stroke-3">Orchestra Animali</h2><AnimalComponent /></div>}
                    {['XYLOPHONE', 'GUITAR', 'CHOIR', 'BONGO'].includes(activeMode) && (
                        <div className="text-center py-20"><h2 className="text-3xl font-black text-gray-400">Strumento in arrivo! 🚧</h2></div>
                    )}
                </div>
          </div>
      );
  }

  return (
    <div className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-106px)] bg-gray-900 overflow-hidden flex flex-col" onClick={handleInteraction}>
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-900 z-50">
                <span className="text-white font-black text-2xl animate-pulse flex items-center gap-2"><Loader2 className="animate-spin" /> Apro la Discoteca...</span>
            </div>
        )}
        <RobotHint show={showHint} message="Tocca uno strumento o un personaggio!" variant="ROBOT"/>
        <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden select-none">
            <div className="block md:hidden w-full h-full relative">
                <img src={DISCO_BG_MOBILE} alt="Disco Mobile" className={`w-full h-full object-fill object-center ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false}/>
                {ZONES_MOBILE.map((zone, i) => (<div key={i} className="absolute inset-0 cursor-pointer" style={{ clipPath: getClipPath(zone.points) }} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }}></div>))}
            </div>
            <div className="hidden md:block w-full h-full relative overflow-hidden">
                <img src={DISCO_BG_DESKTOP} alt="Disco Desktop" className={`absolute inset-0 w-full h-full object-fill object-center ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false}/>
                {ZONES_DESKTOP.map((zone, i) => (<div key={i} className="absolute inset-0 cursor-pointer" style={{ clipPath: getClipPath(zone.points) }} onClick={(e) => { e.stopPropagation(); handleZoneClick(zone.id); }}></div>))}
            </div>
        </div>
    </div>
  );
};

export default SoundZone;
