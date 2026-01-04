import React, { useState, useEffect, useRef } from 'react';

const VIDEO_URL = 'https://res.cloudinary.com/djax1tgxn/video/upload/v1741169007/BOO_ANIMAZIONE_CON_NOME_h6p5q0.mp4';

interface IntroVideoProps {
    onFinish: () => void;
}

const IntroVideo: React.FC<IntroVideoProps> = ({ onFinish }) => {
    const [isExiting, setIsExiting] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFinish = () => {
        if (isExiting) return;
        setIsExiting(true);
        // Salviamo nella sessione che il video è stato visto
        sessionStorage.setItem('loneboo_intro_seen', 'true');
        // Piccolo ritardo per l'animazione di uscita (fade out)
        setTimeout(onFinish, 600);
    };

    // Gestione autoplay per browser restrittivi
    useEffect(() => {
        if (videoRef.current) {
            // Proviamo l'autoplay. Se bloccato, il video rimarrà fermo finché l'utente non tocca (cliccabile).
            videoRef.current.play().catch(error => {
                console.log("Autoplay blocked, waiting for interaction", error);
            });
        }
    }, []);

    return (
        <div 
            onClick={handleFinish}
            className={`fixed inset-0 z-[10000] bg-black flex items-center justify-center cursor-pointer transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
        >
            <video
                ref={videoRef}
                src={VIDEO_URL}
                autoPlay
                playsInline
                onEnded={handleFinish}
                className="w-full h-full object-contain"
            />
            
            {/* Indicazione visiva per l'utente */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 font-black text-[10px] md:text-xs uppercase tracking-widest animate-pulse pointer-events-none text-center">
                Tocca per entrare nel mondo di Lone Boo
            </div>
        </div>
    );
};

export default IntroVideo;