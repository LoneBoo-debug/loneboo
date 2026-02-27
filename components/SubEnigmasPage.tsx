import React, { useEffect, useState, useMemo, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO, TOKEN_ICON_URL } from '../constants';
import { getProgress, addTokens } from '../services/tokens';
import { SUB_ENIGMAS_DB, SubEnigma } from '../services/dbSubEnigmas';
import { Sparkles, Trophy, RotateCcw, AlertCircle, Clock, Lock } from 'lucide-react';
import TokenIcon from './TokenIcon';

const ENIGMAS_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/enigmitorresotter.webp';
const BTN_EXIT_ENIGMAS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esicenigmi.webp';
const BTN_NEXT_ENIGMA = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/nextenigmaswaq.webp';
const AUDIO_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/audiologoingames.webp';

// Nuovi Asset per il blocco
const IMG_BANNER_BLOCCO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bannerbloccoenigmoerd.webp';
const BTN_EXIT_BLOCCO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/escinabberbloccoenigmie.webp';

// Asset Audio
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ivan_luzan-scary-cartoon-172131.mp3';
const SFX_CORRECT_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/alexzavesa-cartoon-6-468373.mp3';
const SFX_WRONG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/universfield-fail-144746.mp3';

const BAN_DURATION_MS = 5 * 60 * 1000; // 5 minuti

interface SubEnigmasPageProps {
    setView: (view: AppView) => void;
}

const SubEnigmasPage: React.FC<SubEnigmasPageProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [tokens, setTokens] = useState(getProgress().tokens);
    const [currentEnigma, setCurrentEnigma] = useState<SubEnigma | null>(null);
    const [gameState, setGameState] = useState<'PLAYING' | 'SOLVED' | 'WRONG'>('PLAYING');
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [musicEnabled, setMusicEnabled] = useState(true);

    // Stati per la gestione del blocco accessi
    const [errorCount, setErrorCount] = useState(() => Number(localStorage.getItem('sub_enigmas_errors') || 0));
    const [banUntil, setBanUntil] = useState(() => Number(localStorage.getItem('sub_enigmas_ban_until') || 0));
    const [timeLeft, setTimeLeft] = useState(0);

    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    const pickRandomEnigma = () => {
        // Carica gli ID già visti dal localStorage
        const seenIdsRaw = localStorage.getItem('sub_enigmas_seen_ids');
        let seenIds: number[] = seenIdsRaw ? JSON.parse(seenIdsRaw) : [];

        // Filtra gli enigmi non ancora visti
        let availableEnigmas = SUB_ENIGMAS_DB.filter(e => !seenIds.includes(e.id));

        // Se li abbiamo visti tutti, resettiamo la lista
        if (availableEnigmas.length === 0) {
            seenIds = [];
            availableEnigmas = [...SUB_ENIGMAS_DB];
        }

        // Scegliamo un enigma casuale tra quelli disponibili
        const randomIndex = Math.floor(Math.random() * availableEnigmas.length);
        const nextEnigma = availableEnigmas[randomIndex];

        // Aggiorniamo la lista dei visti
        seenIds.push(nextEnigma.id);
        localStorage.setItem('sub_enigmas_seen_ids', JSON.stringify(seenIds));

        setCurrentEnigma(nextEnigma);
        setGameState('PLAYING');
        setSelectedIdx(null);
        
        // RESET ERRORI: Ogni nuovo enigma garantisce una tabula rasa per gli errori consecutivi
        setErrorCount(0);
        localStorage.setItem('sub_enigmas_errors', '0');
    };

    useEffect(() => {
        const img = new Image();
        img.src = ENIGMAS_BG;
        img.onload = () => setIsLoaded(true);
        pickRandomEnigma();
        window.scrollTo(0, 0);

        // Inizializza musica
        bgMusicRef.current = new Audio(BG_MUSIC_URL);
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.4;

        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
        };
    }, []);

    // Timer per il countdown del blocco
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            if (banUntil > now) {
                setTimeLeft(Math.ceil((banUntil - now) / 1000));
            } else {
                if (timeLeft > 0) {
                    setTimeLeft(0);
                    setErrorCount(0);
                    localStorage.setItem('sub_enigmas_errors', '0');
                    localStorage.removeItem('sub_enigmas_ban_until');
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [banUntil, timeLeft]);

    // Gestione riproduzione musica
    useEffect(() => {
        if (bgMusicRef.current) {
            const isBanned = timeLeft > 0;
            if (musicEnabled && isLoaded && !isBanned && gameState !== 'WRONG') {
                bgMusicRef.current.play().catch(e => console.log("Audio block", e));
            } else {
                bgMusicRef.current.pause();
            }
        }
    }, [musicEnabled, isLoaded, gameState, timeLeft]);

    const playSfx = (url: string) => {
        if (!musicEnabled) return;
        const sfx = new Audio(url);
        sfx.volume = 0.6;
        sfx.play().catch(e => console.log("SFX block", e));
    };

    const handleAnswer = (index: number) => {
        if (gameState !== 'PLAYING' || !currentEnigma || timeLeft > 0) return;
        
        setSelectedIdx(index);
        if (index === currentEnigma.correctIndex) {
            playSfx(SFX_CORRECT_URL);
            setGameState('SOLVED');
            const newTotal = addTokens(4);
            setTokens(newTotal);
            
            // RESET ERRORI: La risposta corretta azzera la sequenza di errori consecutivi
            setErrorCount(0);
            localStorage.setItem('sub_enigmas_errors', '0');
        } else {
            playSfx(SFX_WRONG_URL);
            setGameState('WRONG');
            
            // INCREMENTO ERRORI CONSECUTIVI SULLO STESSO ENIGMA
            const nextErrors = errorCount + 1;
            setErrorCount(nextErrors);
            localStorage.setItem('sub_enigmas_errors', String(nextErrors));

            if (nextErrors >= 3) {
                const banTime = Date.now() + BAN_DURATION_MS;
                setBanUntil(banTime);
                localStorage.setItem('sub_enigmas_ban_until', String(banTime));
            } else {
                setTimeout(() => {
                    setGameState('PLAYING');
                    setSelectedIdx(null);
                }, 1500);
            }
        }
    };

    // Helper per ridimensionare il testo in base alla lunghezza
    const getEnigmaFontSize = (text: string) => {
        const len = text.length;
        if (len > 300) return 'text-[12px] md:text-[18px]';
        if (len > 200) return 'text-[14px] md:text-[22px]';
        return 'text-[16px] md:text-[28px]';
    };

    const getExplanationFontSize = (text: string) => {
        const len = text.length;
        if (len > 250) return 'text-[11px] md:text-[16px]';
        if (len > 150) return 'text-[13px] md:text-[20px]';
        return 'text-[15px] md:text-[24px]';
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-slate-900 flex flex-col overflow-hidden select-none animate-in fade-in duration-1000">
            <style>{`
                .text-scroll-area::-webkit-scrollbar { display: none; }
                .text-cartoon-stroke {
                    -webkit-text-stroke: 1px black;
                    text-shadow: 2px 2px 0px rgba(0,0,0,0.2);
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
            `}</style>

            {!isLoaded && (
                <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">APRO IL LIBRO DEI MISTERI...</span>
                </div>
            )}

            {/* BANNER DI BLOCCO PER ERRORI */}
            {timeLeft > 0 && (
                <div className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500">
                    <div className="bg-white/20 backdrop-blur-xl rounded-[3rem] border-8 border-purple-600 p-2 w-full max-w-lg shadow-2xl flex flex-col items-center animate-in zoom-in duration-300 relative overflow-hidden">
                        
                        {/* Immagine del Banner */}
                        <img 
                            src={IMG_BANNER_BLOCCO} 
                            alt="Blocco Enigmi" 
                            className="w-full h-auto rounded-t-[2.5rem] object-contain" 
                        />

                        {/* Footer con Timer e Tasto Esci */}
                        <div className="w-full flex items-center justify-between px-8 py-6 bg-white/10">
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] md:text-xs font-black text-purple-200 uppercase tracking-widest leading-none mb-1">Ritorna tra</span>
                                <span className="font-luckiest text-purple-400 text-4xl md:text-6xl leading-none">
                                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                </span>
                            </div>

                            <button 
                                onClick={() => setView(AppView.MAGIC_TOWER_SUB)}
                                className="hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                                <img 
                                    src={BTN_EXIT_BLOCCO} 
                                    alt="Esci" 
                                    className="w-24 md:w-36 h-auto drop-shadow-lg" 
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={ENIGMAS_BG} 
                    alt="Enigmi dei Sotterranei" 
                    className={`w-full h-full object-fill md:object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>

            {/* HEADER HUD */}
            <div className="absolute top-[80px] md:top-[120px] left-6 right-6 z-50 flex justify-between items-start pointer-events-none">
                <button 
                    onClick={() => setView(AppView.MAGIC_TOWER_SUB)}
                    className="pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_EXIT_ENIGMAS} alt="Indietro" className="w-20 h-20 md:w-32 h-auto drop-shadow-2xl" />
                </button>

                <div className="flex flex-col items-end gap-3">
                    <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border-4 border-purple-500 shadow-2xl flex items-center gap-3">
                        <span className="text-white font-black text-lg md:text-2xl">{tokens}</span>
                        <TokenIcon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>

                    {/* TASTO MUSICA SOTTO I GETTONI */}
                    <button 
                        onClick={() => setMusicEnabled(!musicEnabled)}
                        className={`pointer-events-auto hover:scale-110 active:scale-95 transition-all outline-none ${!musicEnabled ? 'grayscale opacity-60' : ''}`}
                        title={musicEnabled ? "Spegni Musica" : "Accendi Musica"}
                    >
                        <img src={AUDIO_ICON_IMG} alt="Audio" className="w-14 h-14 md:w-20 h-auto drop-shadow-xl" />
                    </button>
                </div>
            </div>

            {/* ENIGMA AREA (CENTRO PERGAMENA) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-12 md:px-24">
                <div className="w-full max-w-[460px] h-[50%] md:h-[60%] flex flex-col items-center justify-center mt-0 md:mt-2">
                    <div className="w-full h-full flex flex-col items-center justify-center p-1 md:p-2 overflow-hidden">
                        {currentEnigma && (
                            <div className="animate-in fade-in zoom-in duration-500 w-full max-h-full overflow-y-auto no-scrollbar text-scroll-area pointer-events-auto px-4 md:px-12">
                                {gameState === 'SOLVED' ? (
                                    <div className="flex flex-col items-center gap-2 md:gap-4">
                                        <p className={`font-sans font-black text-green-800 leading-tight whitespace-pre-wrap break-words text-justify ${getExplanationFontSize(currentEnigma.explanation)}`}>
                                            {currentEnigma.explanation}
                                        </p>
                                        <div className="bg-yellow-400 text-black px-4 py-1 rounded-full font-black text-xs md:text-base border-2 md:border-4 border-black animate-pulse shadow-lg shrink-0 flex items-center gap-2">
                                            +4 GETTONI! <TokenIcon className="w-4 h-4 md:w-6 md:h-6" />
                                        </div>
                                    </div>
                                ) : (
                                    <p className={`font-sans font-black text-slate-800 leading-tight md:leading-snug whitespace-pre-wrap break-words text-justify ${getEnigmaFontSize(currentEnigma.enigmaText)}`}>
                                        {currentEnigma.enigmaText}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ANSWERS / NEXT BUTTON (SOTTO PERGAMENA) */}
            <div className="absolute bottom-4 md:bottom-6 inset-x-0 z-20 flex flex-col items-center gap-4 px-6">
                {gameState === 'SOLVED' ? (
                    <button 
                        onClick={pickRandomEnigma}
                        className="hover:scale-105 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_NEXT_ENIGMA} alt="Prossimo Enigma" className="w-48 md:w-64 h-auto drop-shadow-2xl" />
                    </button>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-5xl">
                        {currentEnigma?.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={gameState === 'WRONG' || timeLeft > 0}
                                className={`
                                    py-4 md:py-6 px-4 rounded-3xl border-4 transition-all active:scale-95 shadow-xl font-black text-sm md:text-2xl uppercase tracking-tight
                                    ${selectedIdx === idx && gameState === 'WRONG' ? 'bg-red-500 border-red-700 text-white animate-shake' : 
                                      selectedIdx === idx && (gameState as string) === 'SOLVED' ? 'bg-green-500 border-green-700 text-white' :
                                      'bg-white/30 backdrop-blur-xl border-white/40 text-blue-900 hover:bg-white/50'}
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* TITOLO IN BASSO (PICCOLO) */}
            <div className="absolute bottom-1 left-6 opacity-30 pointer-events-none">
                <span className="text-white font-black text-[10px] uppercase tracking-[0.4em]">SOTTERRANEI DELLA TORRE</span>
            </div>
        </div>
    );
};

export default SubEnigmasPage;