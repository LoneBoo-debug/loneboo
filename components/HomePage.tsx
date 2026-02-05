
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { OFFICIAL_LOGO } from '../constants';

const BG_HOME_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/splashscreennewhpg44ezwx.webp';
const BG_HOME_DESKTOP = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/splashnewsdrftoo7zaq.webp';
const BTN_ENTER_WORLD = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/starbuttsplashscreehp009.webp';
const WELCOME_LOGO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/headlogheadrilo.webp';

// Asset Audio
const BTN_AUDIO_ON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/musicatiicaggdg3edcde+(1).webp';
const BTN_AUDIO_OFF = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/musicadisattivusns6hsg2+(1).webp';
const IMG_ACTIVATE_AUDIO_HINT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/attivaaudiosnssdfgsa+(2).webp';
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boosplashscreenintrowelcone55ezxx22.mp3';

// Video unico richiesto
const BOO_VIDEO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/saluta_qoqfmf.webm';

const HomePage: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    
    // Partiamo sempre con l'audio DISATTIVATO come richiesto
    const [isAudioOn, setIsAudioOn] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Salva subito lo stato disattivato nel localStorage all'avvio
        localStorage.setItem('loneboo_music_enabled', 'false');
        window.dispatchEvent(new Event('loneboo_audio_changed'));

        // Precarica sfondi
        const imgM = new Image(); imgM.src = BG_HOME_MOBILE;
        const imgD = new Image(); imgD.src = BG_HOME_DESKTOP;
        
        // Inizializza Audio
        if (!audioRef.current) {
            audioRef.current = new Audio(BG_MUSIC_URL);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }

        const timer = setTimeout(() => setIsLoaded(true), 500);
        
        return () => {
            clearTimeout(timer);
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    // Gestione toggle audio
    const toggleAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextState = !isAudioOn;
        if (nextState && audioRef.current) {
            audioRef.current.play().catch(() => {});
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsAudioOn(nextState);
        // Salva la scelta nel localStorage: verrà letta dalle stanze successive (Giardino, etc)
        localStorage.setItem('loneboo_music_enabled', String(nextState));
        window.dispatchEvent(new Event('loneboo_audio_changed'));
    };

    const handleEnterWorld = () => {
        // La navigazione porterà al giardino che leggerà 'loneboo_music_enabled' dal localStorage
        setView(AppView.BOO_GARDEN);
    };

    // Imposta la velocità del video al 50%
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5;
        }
    }, [isLoaded]);

    return (
        <div className="fixed inset-0 z-0 bg-black overflow-hidden flex flex-col items-center justify-center select-none">
            <style>{`
                @keyframes pulse-magical {
                    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(255,255,255,0.7)); }
                    50% { transform: scale(1.08); filter: drop-shadow(0 0 25px rgba(255,255,255,0.9)); }
                }
                @keyframes float-sparkle {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
                }
                .animate-pulse-magical { animation: pulse-magical 2.5s ease-in-out infinite; }
                .sparkle {
                    position: absolute;
                    background: white;
                    border-radius: 50%;
                    pointer-events: none;
                    animation: float-sparkle linear infinite;
                }
            `}</style>

            <div className="absolute inset-0 z-0">
                <picture>
                    <source media="(max-width: 768px)" srcSet={BG_HOME_MOBILE} />
                    <img 
                        src={BG_HOME_DESKTOP} 
                        alt="Lone Boo World Background" 
                        className={`w-full h-full object-cover md:object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                </picture>
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i}
                        className="sparkle"
                        style={{
                            width: Math.random() * 6 + 2 + 'px',
                            height: Math.random() * 6 + 2 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                            animationDuration: Math.random() * 3 + 2 + 's',
                            animationDelay: Math.random() * 5 + 's'
                        }}
                    />
                ))}
            </div>

            <div className={`relative z-20 flex flex-col items-center justify-center w-full h-full transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                
                <div className="absolute top-4 md:top-6 right-4 md:right-6 flex flex-col items-center gap-2 animate-in slide-in-from-top duration-700 z-50">
                    <img 
                        src={OFFICIAL_LOGO} 
                        alt="Lone Boo" 
                        className="w-16 md:w-28 h-auto drop-shadow-2xl mb-1 md:mb-2"
                    />
                    
                    <div className="flex flex-col items-center gap-1">
                        <button 
                            onClick={toggleAudio}
                            className="hover:scale-110 active:scale-95 transition-transform outline-none"
                        >
                            <img 
                                src={isAudioOn ? BTN_AUDIO_ON : BTN_AUDIO_OFF} 
                                alt="Musica" 
                                className="w-16 md:w-28 h-auto drop-shadow-lg" 
                            />
                        </button>
                        
                        {/* IMMAGINE DI INVITO ALL'ATTIVAZIONE (visibile solo se audio è off) - Spostata ulteriormente a sinistra */}
                        {!isAudioOn && (
                            <div className="animate-in fade-in zoom-in duration-500 -translate-x-10 md:-translate-x-16">
                                <img 
                                    src={IMG_ACTIVATE_AUDIO_HINT} 
                                    alt="Attiva l'audio" 
                                    className="w-24 md:w-40 h-auto drop-shadow-md"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute top-36 md:top-32 left-[10%] md:left-[15%] z-30 w-48 md:w-96 aspect-square flex items-center justify-center pointer-events-none">
                    <video 
                        ref={videoRef}
                        src={BOO_VIDEO_URL}
                        muted
                        autoPlay
                        playsInline
                        loop
                        className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(255,255,255,0.4)]"
                    />
                </div>

                <div className="mt-80 md:mt-[520px] flex flex-col items-center gap-10 md:gap-14">
                    <button 
                        onClick={handleEnterWorld}
                        className="relative group transition-transform hover:scale-110 active:scale-95 outline-none"
                    >
                        <div className="absolute -inset-10 bg-yellow-400/20 blur-3xl rounded-full animate-pulse group-hover:bg-yellow-400/40"></div>
                        <img 
                            src={BTN_ENTER_WORLD} 
                            alt="Entra" 
                            className="w-32 md:w-44 h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] animate-pulse-magical"
                        />
                    </button>
                    
                    <div className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/20 shadow-xl flex items-center justify-center translate-y-4 md:translate-y-8">
                        <p className="font-luckiest text-white text-lg md:text-3xl uppercase tracking-widest text-center whitespace-nowrap flex items-center gap-2">
                            Benvenuti in 
                            <img src={WELCOME_LOGO} alt="Lone Boo" className="h-6 md:h-12 w-auto drop-shadow-sm" />
                            World
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-8 left-6 right-6 flex justify-end items-end">
                    <div className="hidden md:block text-right">
                        <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em]">
                            LONE BOO OFFICIAL APP • 2025
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
