
import React, { useRef } from 'react';
import SoundLayout from './SoundLayout';
import { DRUM_SOUNDS } from '../../constants';

const DRUM_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfbattera.webp';
const DRUM_KIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/drum-kit.webp';

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
        <SoundLayout onBack={onBack} backgroundImage={DRUM_BG}>
            {/* 
                CONTENITORE ASSOLUTO: 
                Occupa tutto lo spazio disponibile sotto il titolo e si ancora al fondo.
                pointer-events-none per non bloccare eventuali click allo sfondo, 
                mentre il contenuto interno riabilita i pointer-events.
            */}
            <div className="absolute inset-0 flex items-end justify-center overflow-visible pointer-events-none">
                
                {/* 
                   BOX BATTERIA:
                   Posizionato in basso. Alzato di pochissimo rispetto a prima (ridotti translate-y).
                   Essendo in un genitore con overflow-visible, non verrà tagliato.
                */}
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
