import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AppView } from '../types';
import { fetchUpcomingMovies, UpcomingMovie } from '../services/movieService';
import { X } from 'lucide-react';

interface UpcomingMoviesProps {
    setView: (view: AppView) => void;
}

const BACKGROUND_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/anteprimelocandinefilm44.webp';

const UpcomingMovies: React.FC<UpcomingMoviesProps> = ({ setView }) => {
    const [movies, setMovies] = useState<UpcomingMovie[]>([]);
    const [loading, setLoading] = useState(true);

    // Percentage based positions to ensure responsiveness on all devices.
    // These coordinates map precisely to the 4 visual slots in the background image.
    const positions = [
        { top: '13.5%', left: '16%', height: '17%' },
        { top: '34.5%', left: '16%', height: '17%' },
        { top: '55.5%', left: '16%', height: '17%' },
        { top: '76.8%', left: '16%', height: '17%' },
    ];

    useEffect(() => {
        const loadMovies = async () => {
            const allMovies = await fetchUpcomingMovies();
            const visibleMovies = allMovies.filter(m => m.isVisible).slice(0, 4);
            setMovies(visibleMovies);
            setLoading(false);
        };
        loadMovies();
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 overflow-hidden bg-black"
        >
            {/* Background - object-fill guarantees that percentages will always land on the same spot of the image */}
            <img 
                src={BACKGROUND_IMG} 
                alt="Upcoming Movies Background" 
                className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none"
                referrerPolicy="no-referrer"
            />

            {/* Content Container */}
            <div className="absolute inset-0 w-full h-full z-10 p-4 md:p-8">
                
                {/* Header with Close Button */}
                <div className="flex items-center justify-end pt-12 md:pt-4 pr-2">
                    <button 
                        onClick={() => setView(AppView.CINEMA_PREVIEW)}
                        className="p-2 bg-red-600 text-white rounded-full border-4 border-white shadow-2xl hover:scale-110 active:scale-95 transition-all"
                    >
                        <X size={28} className="md:w-8 md:h-8" strokeWidth={3} />
                    </button>
                </div>

                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                        {movies.map((movie, index) => {
                            const pos = positions[index];
                            if (!pos) return null;

                            return (
                                <div 
                                    key={index}
                                    className="absolute flex items-center gap-[4%] w-[70%] max-w-4xl"
                                    style={{ 
                                        top: pos.top, 
                                        left: pos.left, 
                                        height: pos.height 
                                    }}
                                >
                                    {/* Thumbnail sticker-style */}
                                    <div className="h-full aspect-[2/3] shrink-0 overflow-hidden rounded-lg border-2 border-white/30 shadow-2xl transform rotate-1">
                                        <img 
                                            src={movie.thumbnail} 
                                            alt={movie.title} 
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>

                                    {/* Movie Info */}
                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <h2 className="font-luckiest text-red-600 text-[1.2rem] sm:text-[1.8rem] md:text-[3rem] uppercase leading-none mb-1 drop-shadow-md truncate">
                                            {movie.title}
                                        </h2>
                                        <p className="text-blue-700 font-bold text-[0.7rem] sm:text-[0.9rem] md:text-[1.8rem] leading-tight mb-2 line-clamp-2 drop-shadow-sm">
                                            {movie.description}
                                        </p>
                                        {movie.releaseDate && (
                                            <div className="flex justify-start">
                                                <div className="bg-yellow-400 text-black font-black px-2 py-0.5 md:px-4 md:py-1 rounded-lg text-[0.6rem] sm:text-[0.8rem] md:text-[1.4rem] uppercase shadow-md transform -rotate-1 inline-block border border-black/10">
                                                    {movie.releaseDate}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {movies.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-white font-luckiest text-2xl uppercase opacity-60">
                                    Prossimamente...
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default UpcomingMovies;
