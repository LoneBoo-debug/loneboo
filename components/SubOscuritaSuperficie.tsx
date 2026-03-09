
import React, { useMemo } from 'react';
import { AppView } from '../types';
import { getWeatherForDate, isNightTime } from '../services/weatherService';

const BG_IMAGES = {
    SUN: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sftornainsuperifcioea.webp",
    WIND: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sfventotornainsupericies.webp",
    RAIN: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sfpioggitornainsuperivies.webp",
    NIGHT: "https://loneboo-images.s3.eu-south-1.amazonaws.com/sfnottetornainsupericiei.webp"
};

interface SubOscuritaSuperficieProps {
    setView: (view: AppView, skipAnim?: boolean) => void;
}

type AreaId = 'MUSEO' | 'BIBLIOTECA' | 'TORRE_MAGICA' | 'BACK_TO_OSCURITA';
interface Point { x: number; y: number }

const DEFAULT_POLYGONS: Record<AreaId, Point[]> = {
    MUSEO: [
        { "x": 32.8, "y": 31.18 },
        { "x": 32.53, "y": 39.73 },
        { "x": 46.13, "y": 40.48 },
        { "x": 44.8, "y": 30.28 }
    ],
    BIBLIOTECA: [
        { "x": 4.27, "y": 22.19 },
        { "x": 5.6, "y": 40.63 },
        { "x": 23.2, "y": 46.03 },
        { "x": 24.8, "y": 29.09 }
    ],
    TORRE_MAGICA: [
        { "x": 51.47, "y": 1.05 },
        { "x": 48.27, "y": 42.13 },
        { "x": 77.33, "y": 42.13 },
        { "x": 71.73, "y": 2.85 }
    ],
    BACK_TO_OSCURITA: [
        { "x": 27.47, "y": 80.36 },
        { "x": 16.27, "y": 89.66 },
        { "x": 74.4, "y": 89.51 },
        { "x": 66.67, "y": 79.91 }
    ]
};

const SubOscuritaSuperficie: React.FC<SubOscuritaSuperficieProps> = ({ setView }) => {
    const currentBg = useMemo(() => {
        const now = new Date();
        if (isNightTime(now)) return BG_IMAGES.NIGHT;
        
        const weather = getWeatherForDate(now);
        switch (weather) {
            case 'WIND': return BG_IMAGES.WIND;
            case 'RAIN': return BG_IMAGES.RAIN;
            case 'SNOW': return BG_IMAGES.RAIN; // Default snow to rain if not specified
            case 'SUN':
            default:
                return BG_IMAGES.SUN;
        }
    }, []);

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleAreaClick = (id: AreaId) => {
        console.log(`Clicked area: ${id}`);
        if (id === 'MUSEO') {
            setView(AppView.FANART);
        } else if (id === 'BIBLIOTECA') {
            setView(AppView.BOOKS);
        } else if (id === 'TORRE_MAGICA') {
            setView(AppView.AI_MAGIC);
        } else if (id === 'BACK_TO_OSCURITA') {
            setView(AppView.SUB_OSCURITA, true);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[150] bg-black flex flex-col overflow-hidden select-none"
        >
            <img 
                src={currentBg} 
                alt="Superficie" 
                className="w-full h-full object-cover"
            />

            {/* CLICKABLE AREAS */}
            {Object.entries(DEFAULT_POLYGONS).map(([id, pts]) => (
                <div 
                    key={id}
                    onClick={(e) => { e.stopPropagation(); handleAreaClick(id as AreaId); }}
                    className="absolute inset-0 z-20 cursor-pointer hover:bg-white/5 transition-colors"
                    style={{ clipPath: getClipPath(pts) }}
                />
            ))}
        </div>
    );
};

export default SubOscuritaSuperficie;
