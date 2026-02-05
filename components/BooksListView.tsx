
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import RobotHint from './RobotHint';
import { OFFICIAL_LOGO } from '../constants';

const BOOKS_LIST_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflibrettre.webp';

// Asset Audio e Video
const LIBRERIA_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/7b2baa76-c6f2-4391-a60c-4e7923896495.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };

const FIXED_ZONES = {
    READ: [
        { "x": 75.96, "y": 22.63 }, { "x": 75.69, "y": 36.57 }, { "x": 27.72, "y": 36.27 }, { "x": 34.91, "y": 20.08 }
    ],
    CARDS: [
        { "x": 27.72, "y": 49.01 }, { "x": 70.9, "y": 49.31 }, { "x": 77.29, "y": 61.3 }, { "x": 21.86, "y": 62.8 }
    ]
};

const BooksListView: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Gestione Audio e Video sincronizzata con l'header
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    useEffect(() => {
        const img = new Image();
        img.src = BOOKS_LIST_BG;
        img.onload = () => setIsLoaded(true);

        // Inizializzazione Audio specifico per la Libreria
        if (!audioRef.current) {
            audioRef.current = new Audio(LIBRERIA_VOICE_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;

            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
        }

        // Avvio automatico rispettando lo stato globale dell'header
        if (isAudioOn) {
            audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
        }

        // Listener per il tasto audio globale nell'header
        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled) {
                audioRef.current?.play().catch(() => {});
            } else {
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        const timer = setTimeout(() => setIsLoaded(true), 2500);
        window.scrollTo(0, 0);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const getClipPath = (pts: Point[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 flex flex-col items-center justify-center overflow-hidden select-none touch-none bg-[#3e2723]">
            {!isLoaded && (
                <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[#3e2723] backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">STO CARICANDO...</span>
                </div>
            )}

            {/* Mini TV di Boo - Posizionato a SINISTRA */}
            {isLoaded && isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video 
                            src={BOO_TALK_VIDEO}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ 
                                mixBlendMode: 'screen',
                                filter: 'contrast(1.1) brightness(1.1)'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                    src={BOOKS_LIST_BG} 
                    alt="Sfondo" 
                    className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>

            <div 
                onClick={() => setView(AppView.LIBRARY_READ)}
                className="absolute inset-0 z-20 cursor-pointer active:bg-white/10"
                style={{ clipPath: getClipPath(FIXED_ZONES.READ) }}
            />
            <div 
                onClick={() => setView(AppView.LIBRARY_CARDS)}
                className="absolute inset-0 z-20 cursor-pointer active:bg-white/10"
                style={{ clipPath: getClipPath(FIXED_ZONES.CARDS) }}
            />
            
            <RobotHint show={isLoaded} message={"GIOCA A CARTE\nO LEGGI UN LIBRO"} variant="BROWN" />

            <button 
                onClick={() => setView(AppView.BOOKS)} 
                className="absolute bottom-6 left-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
            >
                <img 
                    src="https://loneboo-images.s3.eu-south-1.amazonaws.com/bktobibliostede.webp" 
                    alt="Back" 
                    className="w-32 md:w-48 h-auto drop-shadow-2xl" 
                />
            </button>
        </div>
    );
};

export default BooksListView;
