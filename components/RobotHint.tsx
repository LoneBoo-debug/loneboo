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
    noRotate?: boolean;
    isStatic?: boolean;
    compact?: boolean;
}

const RobotHint: React.FC<RobotHintProps> = ({ 
    show, 
    message = "TOCCA GLI OGGETTI DELL'IMMAGINE",
    variant = 'ROBOT',
    noRotate = false,
    isStatic = false,
    compact = false
}) => {
    
    if (!show) return null;

    // Configurazione colori basata sulla variante
    const getStyles = () => {
        switch(variant) {
            case 'GHOST': 
                return {
                    bg: 'bg-white',
                    text: 'text-purple-600',
                    border: 'border-black',
                    shadow: 'shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]',
                    textStroke: '1px black',
                    textShadow: '2px 2px 0px black'
                };
            case 'GREEN': 
                return {
                    bg: 'bg-white',
                    text: 'text-green-600',
                    border: 'border-green-600',
                    shadow: 'shadow-[6px_6px_0_0_rgba(22,101,52,0.4)]',
                    textStroke: '1px #166534',
                    textShadow: '2px 2px 0px #166534'
                };
            case 'PURPLE':
                return {
                    bg: 'bg-white',
                    text: 'text-[#9333ea]', // Viola acceso
                    border: 'border-[#9333ea]',
                    shadow: 'shadow-[6px_6px_0_0_rgba(147,51,234,0.4)]',
                    textStroke: '1px #581c87',
                    textShadow: '2px 2px 0px #581c87'
                };
            case 'YELLOW':
                return {
                    bg: 'bg-white/10 backdrop-blur-sm', // Ancora più trasparente
                    text: 'text-yellow-500',
                    border: 'border-yellow-400',
                    shadow: 'shadow-[0_0_20px_rgba(250,204,21,0.4)]',
                    textStroke: '1px #854d0e',
                    textShadow: '2px 2px 0px rgba(250,204,21,0.3)'
                };
            case 'BROWN':
                return {
                    bg: 'bg-white',
                    text: 'text-[#78350f]', // Amber-900
                    border: 'border-[#78350f]',
                    shadow: 'shadow-[6px_6px_0_0_rgba(120,53,15,0.4)]',
                    textStroke: '1px #451a03',
                    textShadow: '2px 2px 0px #451a03'
                };
            default: // ROBOT / Default
                return {
                    bg: 'bg-white',
                    text: 'text-blue-500',
                    border: 'border-black',
                    shadow: 'shadow-[6px_6px_0_0_rgba(0,0,0,0.4)]',
                    textStroke: '1px black',
                    textShadow: '2px 2px 0px black'
                };
        }
    };

    const styles = getStyles();

    // Funzione per formattare il testo: rimpicciolisce quello tra parentesi
    const formatMessage = (msg: string) => {
        const parts = msg.split(/(\(.*?\))/g);
        return parts.map((part, i) => {
            if (part.startsWith('(') && part.endsWith(')')) {
                return (
                    <span key={i} className="block text-[10px] md:text-sm mt-1 font-sans font-black opacity-90 lowercase first-letter:uppercase">
                        {part}
                    </span>
                );
            }
            return <React.Fragment key={i}>{part}</React.Fragment>;
        });
    };

    return (
        <div 
            className={`${isStatic ? 'relative' : 'absolute bottom-[30px] right-[20px]'} z-50 flex justify-end select-none pointer-events-none animate-in fade-in duration-500 ease-out`}
            style={!isStatic ? { 
                bottom: '30px', 
                right: '20px',
                maxWidth: '90%', 
                width: 'auto'
            } : { maxWidth: '100%', width: 'auto' }}
        >
            <div className="relative">
                {/* Text Bubble Container - Riconfigurato per essere più stretto tramite prop compact */}
                <div 
                    className={`${styles.bg} ${compact ? 'px-3 py-2' : 'px-4 py-4'} rounded-[2rem] border-4 transition-all duration-300 flex items-center justify-center max-w-[210px] ${styles.border} ${styles.shadow} ${noRotate ? '' : '-rotate-2'}`}
                >
                    <span 
                        className={`font-luckiest text-xl md:text-2xl lg:text-3xl drop-shadow-sm select-none uppercase whitespace-pre-line text-center ${styles.text}`}
                        style={{ 
                            WebkitTextStroke: styles.textStroke,
                            textShadow: styles.textShadow,
                            lineHeight: '1.05'
                        }}
                    >
                        {formatMessage(message)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RobotHint;