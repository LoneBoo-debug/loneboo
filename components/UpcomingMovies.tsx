import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView } from '../types';
import { fetchUpcomingMovies, UpcomingMovie } from '../services/movieService';
import { X } from 'lucide-react';

interface UpcomingMoviesProps {
    setView: (view: AppView) => void;
}

interface ItemConfig {
    x: number;
    y: number;
    scale: number;
    rotate: number;
    skewX: number;
    skewY: number;
}

interface MovieConfig {
    poster: ItemConfig;
    content: ItemConfig;
}

const BACKGROUND_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/anteprimelocandinefilm44.webp';

const UpcomingMovies: React.FC<UpcomingMoviesProps> = ({ setView }) => {
    const [movies, setMovies] = useState<UpcomingMovie[]>([]);
    const [loading, setLoading] = useState(true);

    // Final coordinates for 4 movies
    const configs: MovieConfig[] = [
        {
            poster: { x: -72, y: -153, scale: 0.4, rotate: 1, skewX: 0, skewY: 0 },
            content: { x: 49, y: -393, scale: 0.45, rotate: 1, skewX: 0, skewY: 0 }
        },
        {
            poster: { x: -70, y: -558, scale: 0.4, rotate: 1, skewX: 0, skewY: 0 },
            content: { x: 46.5, y: -807.5, scale: 0.45, rotate: 1, skewX: 0, skewY: 0 }
        },
        {
            poster: { x: -68.5, y: -962.5, scale: 0.4, rotate: 1, skewX: 0, skewY: 0 },
            content: { x: 50.5, y: -1222.5, scale: 0.45, rotate: 1, skewX: 0, skewY: 0 }
        },
        {
            poster: { x: -69.5, y: -1411.5, scale: 0.4, rotate: 1, skewX: 0, skewY: 0 },
            content: { x: 49.5, y: -1642.5, scale: 0.45, rotate: 1, skewX: 0, skewY: 0 }
        }
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
            {/* Background */}
            <img 
                src={BACKGROUND_IMG} 
                alt="Upcoming Movies Background" 
                className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                referrerPolicy="no-referrer"
            />

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col p-4 md:p-8 overflow-hidden">
                
                {/* Header with Close Button */}
                <div className="flex items-center justify-end mb-8 pt-16 md:pt-4">
                    <button 
                        onClick={() => setView(AppView.CINEMA_PREVIEW)}
                        className="p-2 bg-red-600 text-white rounded-full border-4 border-white shadow-2xl hover:scale-110 active:scale-95 transition-all"
                    >
                        <X size={32} strokeWidth={3} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto w-full space-y-24 pb-40">
                        {movies.map((movie, index) => (
                            <div 
                                key={index}
                                className="relative flex flex-col md:flex-row gap-8 items-center md:items-start min-h-[300px]"
                            >
                                {/* Thumbnail */}
                                <motion.div 
                                    animate={{ 
                                        x: configs[index].poster.x,
                                        y: configs[index].poster.y,
                                        scale: configs[index].poster.scale,
                                        rotate: configs[index].poster.rotate,
                                        skewX: configs[index].poster.skewX,
                                        skewY: configs[index].poster.skewY
                                    }}
                                    transition={{ duration: 0 }}
                                    className="relative shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 shadow-lg w-40 md:w-56 aspect-[2/3]"
                                >
                                    <img 
                                        src={movie.thumbnail} 
                                        alt={movie.title} 
                                        className="w-full h-full object-cover pointer-events-none"
                                        referrerPolicy="no-referrer"
                                    />
                                </motion.div>

                                {/* Info */}
                                <motion.div 
                                    animate={{ 
                                        x: configs[index].content.x,
                                        y: configs[index].content.y,
                                        scale: configs[index].content.scale,
                                        rotate: configs[index].content.rotate,
                                        skewX: configs[index].content.skewX,
                                        skewY: configs[index].content.skewY
                                    }}
                                    transition={{ duration: 0 }}
                                    className="flex-1 flex flex-col h-full text-center md:text-left"
                                >
                                    <h2 className="font-luckiest text-red-600 text-4xl md:text-7xl uppercase tracking-wide mb-3 drop-shadow-lg">
                                        {movie.title}
                                    </h2>
                                    <p className="text-blue-600 font-bold text-xl md:text-4xl leading-tight mb-6 drop-shadow-md line-clamp-2">
                                        {movie.description}
                                    </p>
                                    {movie.releaseDate && (
                                        <div className="flex justify-center md:justify-start">
                                            <div className="bg-yellow-400 text-black font-black px-6 py-2 rounded-xl text-xl md:text-3xl uppercase shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transform -rotate-2 inline-block border-2 border-black/10">
                                                {movie.releaseDate}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        ))}

                        {movies.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-white font-luckiest text-2xl uppercase opacity-60">
                                    Nessuna anteprima disponibile al momento
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
