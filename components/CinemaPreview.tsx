
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';
import { fetchUpcomingMovies, UpcomingMovie } from '../services/movieService';
import { X } from 'lucide-react';

interface CinemaPreviewProps {
    setView: (view: AppView) => void;
    returnView?: AppView;
}

const BACKGROUND_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfondoeventisalotto.webp';
const GO_TO_CINEMA_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_creami+in+stile+cartoon+l_imma_498596413283635205.webp';
const DEFAULT_POSTER = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/locandinabooalmanre.webp';

const CinemaPreview: React.FC<CinemaPreviewProps> = ({ setView, returnView }) => {
    const [posterUrl, setPosterUrl] = useState(DEFAULT_POSTER);

    // Definitive coordinates
    const config = {
        right: 30,
        bottom: 4,
        scale: 1.7,
        rotate: -12,
        skewX: 1,
        skewY: 5
    };

    useEffect(() => {
        const loadPoster = async () => {
            const movies = await fetchUpcomingMovies();
            const tabellone = movies.find(m => m.isTabellone);
            if (tabellone) {
                setPosterUrl(tabellone.thumbnail);
            }
        };
        loadPoster();
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 overflow-hidden bg-black"
        >
            {/* Full screen adaptive background */}
            <img 
                src={BACKGROUND_IMG} 
                alt="Cinema Preview Background" 
                className="absolute inset-0 w-full h-full object-cover md:object-fill select-none pointer-events-none"
                referrerPolicy="no-referrer"
            />

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4 pt-24">
                
                {/* Close Button - Top Right */}
                <button 
                    onClick={() => setView(returnView || AppView.BOO_LIVING_ROOM)}
                    className="absolute top-20 right-4 z-50 p-2 bg-red-600 text-white rounded-full border-4 border-white shadow-2xl hover:scale-110 active:scale-95 transition-all"
                >
                    <X size={32} strokeWidth={3} />
                </button>

                {/* Go to Cinema Button - Bottom Right */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute bottom-8 right-4 z-20"
                >
                    <button 
                        onClick={() => setView(AppView.VIDEOS)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                    >
                        <img 
                            src={GO_TO_CINEMA_BTN} 
                            alt="Vai al Cinema" 
                            className="w-32 md:w-64 h-auto"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                </motion.div>

                {/* Poster - Bottom Right - Clickable */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: 1,
                        scale: config.scale,
                        rotate: config.rotate,
                        skewX: config.skewX,
                        skewY: config.skewY
                    }}
                    transition={{ 
                        opacity: { duration: 0.5, delay: 0.4 },
                        scale: { duration: 0 },
                        rotate: { duration: 0 },
                        skewX: { duration: 0 },
                        skewY: { duration: 0 }
                    }}
                    className="absolute z-10 flex flex-col items-center gap-2 cursor-pointer"
                    style={{ 
                        right: `${config.right}%`, 
                        bottom: `${config.bottom}%`,
                        transformOrigin: 'bottom right'
                    }}
                    onClick={() => setView(AppView.UPCOMING_MOVIES)}
                >
                    <div className="hover:scale-105 active:scale-95 transition-transform duration-300">
                        <img 
                            src={posterUrl} 
                            alt="Locandina" 
                            className="w-24 md:w-48 h-auto rounded-lg shadow-2xl border-2 border-white/20"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CinemaPreview;
