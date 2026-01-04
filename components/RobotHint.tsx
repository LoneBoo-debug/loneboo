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
    variant?: 'ROBOT' | 'GHOST' | 'GREEN' | 'PURPLE' | 'YELLOW' | 'BROWN';
    customConfig?: Partial<RobotConfig>; 
}

const RobotHint: React.FC<RobotHintProps> = ({ 
    show, 
    message = "TOCCA GLI OGGETTI DELL'IMMAGINE",
    variant = 'ROBOT'
}) => {
    
    if (!show) return null;

    // Configurazione colori basata sulla variante
    const getStyles = () => {
        switch(variant) {
            case 'GHOST': 
                return {
                    text: 'text-purple-600',
                    border: 'border-black',
                    shadow: 'shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]',
                    textStroke: '1px black',
                    textShadow: '2px 2px 0px black'
                };
            case 'GREEN': 
                return {
                    text: 'text-green-600',
                    border: 'border-green-600',
                    shadow: 'shadow-[6px_6px_0px_0px_rgba(22,101,52,0.4)]',
                    textStroke: '1px #166534',
                    textShadow: '2px 2px 0px #166534'
                };
            case 'PURPLE':
                return {
                    text: 'text-[#9333ea]', // Viola acceso
                    border: 'border-[#9333ea]',
                    shadow: 'shadow-[6px_6px_0px_0px_rgba(147,51,234,0.4)]',
                    textStroke: '1px #581c87',
                    textShadow: '2px 2px 0px #581c87'
                };
            case 'YELLOW':
                return {
                    text: 'text-yellow-500',
                    border: 'border-yellow-400',
                    shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.6)]',
                    textStroke: '1px #854d0e',
                    textShadow: '2px 2px 0px rgba(250,204,21,0.4)'
                };
            case 'BROWN':
                return {
                    text: 'text-[#78350f]', // Amber-900
                    border: 'border-[#78350f]',
                    shadow: 'shadow-[6px_6px_0px_0px_rgba(120,53,15,0.4)]',
                    textStroke: '1px #451a03',
                    textShadow: '2px 2px 0px #451a03'
                };
            default: // ROBOT / Default
                return {
                    text: 'text-blue-500',
                    border: 'border-black',
                    shadow: 'shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]',
                    textStroke: '1px black',
                    textShadow: '2px 2px 0px black'
                };
        }
    };

    const styles = getStyles();

    return (
        <div 
            className="absolute z-50 flex justify-end select-none pointer-events-none animate-in fade-in duration-500 ease-out"
            style={{ 
                bottom: '30px', 
                right: '20px',
                maxWidth: '90%', 
                width: 'auto'
            }}
        >
            <div className="relative">
                {/* Text Bubble Container */}
                <div 
                    className={`bg-white px-6 py-4 rounded-[2rem] border-4 transition-all duration-300 transform -rotate-2 flex items-center justify-center max-w-[240px] ${styles.border} ${styles.shadow}`}
                >
                    <span 
                        className={`font-luckiest text-2xl md:text-3xl lg:text-4xl drop-shadow-sm select-none uppercase whitespace-pre-line text-center ${styles.text}`}
                        style={{ 
                            WebkitTextStroke: styles.textStroke,
                            textShadow: styles.textShadow,
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