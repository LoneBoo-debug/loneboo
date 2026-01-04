import React, { useEffect } from 'react';
import { AppView } from '../types';
import RobotHint from './RobotHint';

const BOOKS_LIST_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflibrettre.webp';

type Point = { x: number; y: number };

// Coordinate fisse per le aree interattive
const FIXED_ZONES = {
    READ: [
        { "x": 75.96, "y": 22.63 },
        { "x": 75.69, "y": 36.57 },
        { "x": 27.72, "y": 36.27 },
        { "x": 34.91, "y": 20.08 }
    ],
    CARDS: [
        { "x": 27.72, "y": 49.01 },
        { "x": 70.9, "y": 49.31 },
        { "x": 77.29, "y": 61.3 },
        { "x": 21.86, "y": 62.8 }
    ]
};

interface BooksListViewProps {
    setView: (view: AppView) => void;
}

const BooksListView: React.FC<BooksListViewProps> = ({ setView }) => {
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getClipPath = (pts: Point[]) => {
        if (pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden select-none touch-none">
            {/* BACKGROUND IMAGE */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <img 
                    src={BOOKS_LIST_BG} 
                    alt="Sfondo Libreria" 
                    className="w-full h-full object-fill object-center animate-fade-in select-none"
                    draggable={false}
                />
            </div>

            {/* INTERACTIVE ZONES */}
            <div 
                onClick={(e) => { e.stopPropagation(); setView(AppView.LIBRARY_READ); }}
                className="absolute inset-0 z-20 cursor-pointer active:bg-white/10 transition-colors"
                style={{ clipPath: getClipPath(FIXED_ZONES.READ) }}
                title="Leggi un libro"
            />
            <div 
                onClick={(e) => { e.stopPropagation(); setView(AppView.LIBRARY_CARDS); }}
                className="absolute inset-0 z-20 cursor-pointer active:bg-white/10 transition-colors"
                style={{ clipPath: getClipPath(FIXED_ZONES.CARDS) }}
                title="Gioca a carte"
            />
            
            {/* HINT BUBBLE */}
            <RobotHint 
                show={true} 
                message={"GIOCA A CARTE\nO LEGGI UN LIBRO"} 
                variant="BROWN" 
            />

            {/* BACK BUTTON - MOVED TO BOTTOM LEFT AND RESIZED */}
            <button 
                onClick={(e) => { e.stopPropagation(); setView(AppView.BOOKS); }} 
                className="absolute bottom-6 left-4 z-50 hover:scale-110 active:scale-95 transition-all outline-none"
            >
                <img 
                    src="https://loneboo-images.s3.eu-south-1.amazonaws.com/bktobibliostede.webp" 
                    alt="Torna alla Biblioteca" 
                    className="w-32 md:w-48 h-auto drop-shadow-2xl" 
                />
            </button>
        </div>
    );
};

export default BooksListView;