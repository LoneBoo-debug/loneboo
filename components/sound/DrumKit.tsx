
import React, { useRef, useState, useEffect } from 'react';
import SoundLayout from './SoundLayout';
import { DRUM_SOUNDS } from '../../constants';

const DRUM_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfbattera.webp';
const DRUM_KIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/drum-kit.webp';

// Asset per i tasti con le basi rock associate
const EXTRA_BUTTONS = [
    { id: 1, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/grt44.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rock-thunder-rock-music-background-336548.mp3' },
    { id: 2, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tf556t.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/action-intro-rock-long-138444.mp3' },
    { id: 3, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/hg554kjh.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rock-420049.mp3' },
    { id: 4, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/hc5h6ff.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/intense-hard-rock-282532.mp3' },
    { id: 5, img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/gf6tf6.webp', src: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/crowd-cheer-406646.mp3' },
];

type Point = { x: number; y: number };

const FINAL_AREAS: Record<string, Point[]> = {
  "kick": [
    { "x": 28.51, "y": 63.24 },
    { "x": 27.61, "y": 92.49 },
    { "x": 69.02, "y": 93.19 },
    { "x": 68.72, "y": 63.01 }
  ],
  "snare": [
    { "x": 32.11, "y": 34.22 },
    { "x": 32.41, "y": 50.57 },
    { "x": 58.22, "y": 50.80 },
    { "x": 58.22, "y": 33.99 }
  ],
  "hihat_c": [
    { "x": 66.32, "y": 2.20 },
    { "x": 67.82, "y": 18.32 },
    { "x": 93.63, "y": 18.78 },
    { "x": 82.83, "y": 0.12 }
  ],
  "openhat": [
    { "x": 3.60, "y": 18.32 },
    { "x": 3.00, "y": 32.37 },
    { "x": 29.71, "y": 33.06 },
    { "x": 30.01, "y": 17.40 }
  ],
  "shaker": [
    { "x": 5.40, "y": 68.77 },
    { "x": 5.40, "y": 83.51 },
    { "x": 21.90, "y": 84.43 },
    { "x": 24.60, "y": 66.23 }
  ],
  "clap": [
    { "x": 73.82, "y": 79.36 },
    { "x": 74.42, "y": 93.88 },
    { "x": 94.23, "y": 94.11 },
    { "x": 94.53, "y": 79.13 }
  ],
  "tom1": [
    { "x": 63.02, "y": 34.22 },
    { "x": 63.32, "y": 51.49 },
    { "x": 87.93, "y": 52.41 },
    { "x": 88.83, "y": 33.99 }
  ],
  "tom2": [
    { "x": 39.31, "y": 14.64 },
    { "x": 39.31, "y": 29.84 },
    { "x": 65.42, "y": 30.30 },
    { "x": 64.22, "y": 14.18 }
  ]
};

const DrumKit: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const baseAudioRef = useRef<HTMLAudioElement | null>(null);
    const [activeBaseId, setActiveBaseId] = useState<number | null>(null);

    const playSound = (id: string) => {
        const sound = DRUM_SOUNDS.find(s => s.id === id);
        if (sound) {
            const a = new Audio(sound.src);
            a.volume = 0.8; // Volume dei colpi della batteria regolato a 0.8
            a.play().catch(() => {});
        }
    };

    const handleExtraAction = (btn: typeof EXTRA_BUTTONS[0]) => {
        if (!btn.src) return;

        // Se è il tasto 5 (Applauso), lo riproduciamo come effetto istantaneo
        if (btn.id === 5) {
            const a = new Audio(btn.src);
            a.volume = 0.5; // Volume applauso regolato a 0.5
            a.play().catch(() => {});
            return;
        }

        // Logica per basi musicali (1-4)
        if (activeBaseId === btn.id) {
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
                baseAudioRef.current = null;
            }
            setActiveBaseId(null);
        } else {
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
            }
            const audio = new Audio(btn.src);
            audio.loop = true;
            // Volume basi musicali regolato a 0.4, tranne il tasto 4 che viene alzato a 0.7 per compensare il file originale
            audio.volume = btn.id === 4 ? 0.7 : 0.4; 
            audio.play().catch(() => {});
            baseAudioRef.current = audio;
            setActiveBaseId(btn.id);
        }
    };

    useEffect(() => {
        return () => {
            if (baseAudioRef.current) {
                baseAudioRef.current.pause();
                baseAudioRef.current = null;
            }
        };
    }, []);

    const getPolygonPath = (points: Point[]) => {
        return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <SoundLayout onBack={onBack} backgroundImage={DRUM_BG}>
            
            {/* TASTI EXTRA IN ALTO A DESTRA - Dimensioni aumentate e abbassati per allineamento */}
            <div className="fixed top-24 md:top-32 right-4 z-50 flex items-center gap-1.5 md:gap-3">
                {EXTRA_BUTTONS.map((btn) => (
                    <button
                        key={btn.id}
                        onClick={() => handleExtraAction(btn)}
                        className={`
                            w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 transition-all active:scale-95 outline-none
                            ${activeBaseId === btn.id ? 'brightness-125 scale-110' : 'hover:scale-105'}
                        `}
                    >
                        <img 
                            src={btn.img} 
                            alt={`Extra ${btn.id}`} 
                            className={`w-full h-full object-contain drop-shadow-lg ${!btn.src && btn.id !== 5 ? 'opacity-40 grayscale' : ''}`} 
                        />
                    </button>
                ))}
            </div>

            <div className="absolute inset-0 flex items-end justify-center overflow-visible pointer-events-none">
                <div className="relative w-full max-w-5xl pointer-events-auto transform translate-y-2 md:translate-y-4">
                    <img 
                        ref={imgRef}
                        src={DRUM_KIT_IMG} 
                        alt="Batteria" 
                        className="w-full h-auto max-h-[75vh] object-contain pointer-events-none drop-shadow-2xl"
                        style={{ 
                            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))'
                        }}
                    />

                    {/* Interactive Click Layer */}
                    <div className="absolute inset-0 z-20 cursor-pointer">
                        {Object.entries(FINAL_AREAS).map(([id, points]) => (
                            <div 
                                key={id}
                                onPointerDown={(e) => { 
                                    e.stopPropagation(); 
                                    playSound(id); 
                                }}
                                className="absolute inset-0 bg-transparent"
                                style={{ 
                                    clipPath: getPolygonPath(points),
                                    touchAction: 'none'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </SoundLayout>
    );
};

export default DrumKit;
