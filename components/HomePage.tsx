
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';

const BG_INITIAL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/firsstephmepageinit.webp';
const BTN_STONE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/feddre33.webp';
const ANIMATION_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newanimboohpge.mp4';
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boosplashscreenintrowelcone55ezxx22.mp3';

const HomePage: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [isInitialLoaded, setIsInitialLoaded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // Inizializza Audio
        if (!audioRef.current) {
            audioRef.current = new Audio(BG_MUSIC_URL);
            audioRef.current.loop = false; // Si ferma alla fine per tornare alla statica
            audioRef.current.volume = 0.6;
            
            audioRef.current.onended = () => {
                setIsAnimating(false);
            };
        }

        // Fade in iniziale
        const loadTimer = setTimeout(() => setIsInitialLoaded(true), 100);
        
        // Comparsa tasto dopo 2 secondi
        const buttonTimer = setTimeout(() => {
            setShowButton(true);
            // Effetto traballamento dopo che il tasto "cade" (durata animazione caduta ~0.5s)
            setTimeout(() => setIsShaking(true), 500);
            setTimeout(() => setIsShaking(false), 1000);
        }, 2000);

        return () => {
            clearTimeout(loadTimer);
            clearTimeout(buttonTimer);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.onended = null;
            }
        };
    }, []);

    const toggleInteraction = () => {
        const nextState = !isAnimating;
        
        if (nextState) {
            // Reset e Play del video per sincronia perfetta
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {});
            }
            audioRef.current?.play().catch(() => {});
            localStorage.setItem('loneboo_music_enabled', 'true');
        } else {
            audioRef.current?.pause();
            if (audioRef.current) audioRef.current.currentTime = 0;
            // Opzionale: mettiamo in pausa il video per risparmiare risorse quando non visibile
            if (videoRef.current) videoRef.current.pause();
            localStorage.setItem('loneboo_music_enabled', 'false');
        }
        
        setIsAnimating(nextState);
        window.dispatchEvent(new Event('loneboo_audio_changed'));
    };

    return (
        <motion.div 
            className="absolute inset-0 z-0 bg-black overflow-hidden flex flex-col items-center justify-center select-none"
            animate={isShaking ? {
                x: [0, -10, 10, -10, 10, 0],
                y: [0, 5, -5, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.4 }}
        >
            {/* BACKGROUNDS CON CROSSFADE FLUIDO (OVERLAPPING) */}
            <div className="absolute inset-0 z-0">
                {/* Immagine Statica di Base */}
                <motion.img
                    src={BG_INITIAL}
                    alt="Initial Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isAnimating ? 0 : (isInitialLoaded ? 1 : 0) }}
                    transition={{ duration: 0.8, ease: "linear" }}
                />
                
                {/* Video Animazione in Overlay */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isAnimating ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: "linear" }}
                    style={{ pointerEvents: isAnimating ? 'auto' : 'none' }}
                >
                    <video
                        ref={videoRef}
                        src={ANIMATION_VIDEO}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </div>

            {/* TASTO PIETRA */}
            <AnimatePresence>
                {showButton && (
                    <motion.button
                        onClick={toggleInteraction}
                        className="absolute top-[20%] right-[5%] z-50 outline-none hover:scale-105 active:scale-95 transition-transform"
                        initial={{ scale: 4, opacity: 0, y: -200 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 100, 
                            damping: 15,
                            duration: 0.6 
                        }}
                    >
                        <img 
                            src={BTN_STONE} 
                            alt="Stone Button" 
                            className={`w-24 h-auto drop-shadow-2xl transition-all duration-500 ${isAnimating ? 'brightness-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'brightness-100'}`}
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* OVERLAY PER ENTRARE (Opzionale, ma utile se l'utente vuole procedere) */}
            {isInitialLoaded && (
                <motion.div 
    className="absolute z-30"
    style={{
        top: "75%",
        left: "50%",
        width: "50%",
        height: "15%",
        transform: "translate(-50%, -50%)"
    }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 3 }}
>
    <button 
        onClick={() => setView(AppView.BOO_GARDEN)}
        className="w-full h-full bg-transparent border-none outline-none cursor-pointer"
    />
</motion.div>
            )}
        </motion.div>
    );
};

export default HomePage;
