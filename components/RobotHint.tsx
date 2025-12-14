
import React from 'react';

// Interfaces kept for compatibility with existing calls
export interface RobotConfig {
    textTop: number;
    textLeft: number;
    textWidth: number;
    textHeight: number;
    textRotate: number;
    robotBottom: number;
    robotRight: number;
    robotWidth: number;
}

interface RobotHintProps {
    show: boolean;
    message?: string;
    variant?: 'ROBOT' | 'GHOST';
    customConfig?: Partial<RobotConfig>; 
}

const RobotHint: React.FC<RobotHintProps> = ({ 
    show, 
    message = "TOCCA GLI OGGETTI DELL'IMMAGINE",
    variant = 'ROBOT'
}) => {
    
    if (!show) return null;

    return (
        <div 
            className="absolute z-50 flex justify-end select-none pointer-events-none animate-in slide-in-from-right duration-700 ease-out"
            style={{ 
                bottom: '30px', 
                right: '20px',
                maxWidth: '90%', // Prevents text from being too wide on mobile
                width: 'auto'
            }}
        >
            <div className="relative">
                {/* Text Bubble Container */}
                <div 
                    className="bg-white px-6 py-4 rounded-[2rem] border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] transform -rotate-2 flex items-center justify-center max-w-[240px]"
                >
                    <span 
                        className={`font-luckiest text-2xl md:text-3xl lg:text-4xl drop-shadow-sm select-none uppercase whitespace-pre-line text-center ${variant === 'GHOST' ? 'text-purple-600' : 'text-blue-500'}`}
                        style={{ 
                            WebkitTextStroke: '1px black',
                            textShadow: '2px 2px 0px black',
                            lineHeight: '1.1'
                        }}
                    >
                        {message}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RobotHint;
