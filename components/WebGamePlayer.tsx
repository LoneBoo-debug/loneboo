
import React from 'react';
import { ArrowLeft, Maximize2 } from 'lucide-react';

interface WebGamePlayerProps {
    src: string;
    title: string;
    onBack: () => void;
    isFullScreen?: boolean; // New prop to toggle immersive mode
}

const WebGamePlayer: React.FC<WebGamePlayerProps> = ({ src, title, onBack, isFullScreen = false }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 animate-in fade-in duration-300">
            {/* ARCADE HEADER */}
            <div className="flex items-center justify-between p-3 bg-slate-800 border-b-4 border-purple-600 shadow-lg shrink-0 z-20">
                <button 
                    onClick={onBack}
                    className="bg-red-500 text-white p-2 rounded-full border-2 border-white hover:scale-110 active:scale-95 transition-transform shadow-[0_0_10px_red]"
                >
                    <ArrowLeft size={24} strokeWidth={3} />
                </button>
                
                <h2 className="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-widest drop-shadow-sm truncate px-4">
                    {title}
                </h2>
                
                <div className="w-10"></div> {/* Spacer for alignment */}
            </div>

            {/* GAME CONTAINER (FRAME) */}
            <div className={`flex-1 relative overflow-hidden flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] ${isFullScreen ? 'p-0' : 'p-2 md:p-6'}`}>
                
                {/* The Screen Bezel 
                    If isFullScreen (Arcade), we remove border and rounding to maximize space.
                    If not (Educational), we keep the bezel for the "Console" look.
                */}
                <div className={`
                    relative w-full h-full bg-black overflow-hidden flex flex-col
                    ${isFullScreen ? 'rounded-none border-0' : 'md:max-w-6xl rounded-2xl md:rounded-[30px] border-[8px] md:border-[12px] border-slate-700 shadow-[0_0_50px_rgba(168,85,247,0.4)]'}
                `}>
                    
                    {/* Screen Glare Effect (Optional/Subtle on mobile) */}
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none z-10 pointer-events-none"></div>

                    {/* THE IFRAME */}
                    <iframe 
                        src={src} 
                        title={title}
                        className={`w-full h-full border-0 bg-slate-900 ${isFullScreen ? '' : 'rounded-lg'}`}
                        allow="autoplay; gyroscope; accelerometer; encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        scrolling="no"
                        loading="lazy"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />

                    {/* SAFETY CORNER (INVISIBLE SHIELD) - To prevent click-jacking of fullscreen button if native but allow game interaction */}
                    <div className="absolute bottom-0 right-0 w-[1px] h-[1px] bg-transparent z-20 pointer-events-auto"></div>
                </div>
            </div>

            {/* FOOTER HINT - Hide on fullscreen arcade games to save space */}
            {!isFullScreen && (
                <div className="bg-slate-800 p-2 text-center border-t-2 border-slate-700 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest shrink-0">
                    Powered by Lone Boo Arcade System
                </div>
            )}
        </div>
    );
};

export default WebGamePlayer;
