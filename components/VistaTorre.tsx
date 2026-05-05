
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { AppView } from '../types';
import { getWeatherForDate } from '../services/weatherService';

interface VistaTorreProps {
    setView: (view: AppView) => void;
}

const BG_MAP = {
    DAY: {
        SUN: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sopratorreeede.webp',
        RAIN: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vistatorrepioggia.webp',
        WIND: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vistatorrevento.webp',
        SNOW: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vistatorreneve.webp'
    },
    NIGHT: {
        SUN: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torrenottesole.webp',
        RAIN: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torrenottepioggia.webp',
        WIND: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torrenottevento.webp',
        SNOW: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/torrenotteneve.webp'
    }
};

type Point = { x: number; y: number };

const NAVIGATION_AREAS: Record<string, { view: AppView, points: Point[] }> = {
    "torre_magica": { 
        view: AppView.AI_MAGIC, 
        points: [{ "x": 46.13, "y": 79.46 }, { "x": 34.4, "y": 91 }, { "x": 33.33, "y": 98.05 }, { "x": 66.67, "y": 99.25 }, { "x": 65.87, "y": 89.66 }, { "x": 51.47, "y": 77.51 }] 
    }
};

const VistaTorre: React.FC<VistaTorreProps> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const now = useMemo(() => new Date(), []);
    const weather = useMemo(() => getWeatherForDate(now), [now]);
    
    const isNight = useMemo(() => {
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const totalMinutes = hours * 60 + minutes;
        const nightStart = 20 * 60 + 15; // 20:15
        const nightEnd = 6 * 60 + 45;   // 06:45
        return totalMinutes >= nightStart || totalMinutes <= nightEnd;
    }, [now]);

    const currentBg = useMemo(() => {
        const set = isNight ? BG_MAP.NIGHT : BG_MAP.DAY;
        switch (weather) {
            case 'RAIN': return set.RAIN;
            case 'WIND': return set.WIND;
            case 'SNOW': return set.SNOW;
            default: return set.SUN;
        }
    }, [isNight, weather]);

    useEffect(() => {
        setIsLoaded(false);
        const img = new Image();
        img.src = currentBg;
        img.onload = () => setIsLoaded(true);
    }, [currentBg]);

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 overflow-hidden bg-slate-900 select-none cursor-default">
            {/* Background adaptive a scivolamento */}
            <motion.img 
                key={currentBg}
                src={currentBg} 
                alt="Vista Torre" 
                className={`absolute inset-0 w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                initial={{ scale: 1.1, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                draggable={false}
            />

            {/* Clickable Areas */}
            {isLoaded && Object.entries(NAVIGATION_AREAS).map(([id, config]) => (
                <div 
                    key={id}
                    onClick={() => setView(config.view)}
                    className="absolute inset-0 z-10 cursor-pointer active:bg-white/10 transition-colors"
                    style={{ clipPath: getClipPath(config.points) }}
                />
            ))}

            {!isLoaded && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900 z-[100]">
                    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default VistaTorre;
