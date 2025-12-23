
import React, { useRef } from 'react';
import SoundLayout from './SoundLayout';
import { DRUM_SOUNDS } from '../../constants';

const DRUM_BG = 'https://i.postimg.cc/tJZ6XsdD/sfobatt.png';
const DRUM_TITLE_IMG = 'https://i.postimg.cc/BQCFJfHV/batters.png';
const DRUM_KIT_IMG = 'https://i.postimg.cc/wx5Gh3hY/batteriafx-(1).png';

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

    const playSound = (id: string) => {
        const sound = DRUM_SOUNDS.find(s => s.id === id);
        if (sound) {
            const a = new Audio(sound.src);
            a.volume = 0.9;
            a.play().catch(() => {});
        }
    };

    const getPolygonPath = (points: Point[]) => {
        return `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <SoundLayout onBack={onBack} titleImage={DRUM_TITLE_IMG} backgroundImage={DRUM_BG}>
            <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none touch-none pb-4">
                
                <div className="relative w-full h-full max-w-5xl flex items-center justify-center p-0 md:p-4">
                    <img 
                        ref={imgRef}
                        src={DRUM_KIT_IMG} 
                        alt="Batteria" 
                        className="w-full h-full object-contain pointer-events-none"
                        style={{ 
                            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))'
                        }}
                    />

                    {/* Interactive Click Layer */}
                    <div className="absolute inset-0 z-20 cursor-pointer">
                        {Object.entries(FINAL_AREAS).map(([id, points]) => (
                            <div 
                                key={id}
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    playSound(id); 
                                }}
                                onTouchStart={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    playSound(id);
                                }}
                                className="absolute inset-0 bg-transparent"
                                style={{ 
                                    clipPath: getPolygonPath(points)
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
