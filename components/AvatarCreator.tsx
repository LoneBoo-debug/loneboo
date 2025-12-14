
import React, { useState } from 'react';
import { Check, X, Shuffle, User, Palette } from 'lucide-react';
import { AvatarConfig } from '../types';

// --- ASSETS & OPTIONS ---
// 1. CHARACTERS (Emojis) - High Quality, Expressive, Universal
export const CHARACTERS = [
    '👦', '👧', '👱', '👱‍♀️', '🧑‍🦱', '👩‍🦱', '🧑‍🦰', '👩‍🦰', 
    '👶', '🧒', '😎', '🤓', '🤠', '🥳', '👻', '🤖', 
    '👾', '👽', '💀', '🎃', '🤡', '🦸', '🦸‍♀️', '🥷', 
    '🤴', '👸', '🧙', '🧚', '🧜', '🧞', '🐶', '🐱', 
    '🦁', '🐯', '🐻', '🐼', '🐨', '🐰', '🦊', '🦄',
    '🐲', '🦖', '⚽', '🏀', '🏈', '⚾', '🎾', '🍕'
];

// 2. BACKGROUND COLORS - Vibrant Card Colors
export const BG_COLORS = [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#84CC16', // Lime
    '#1F2937', // Dark Gray
];

interface AvatarCreatorProps {
    initialConfig?: AvatarConfig;
    onSave: (config: AvatarConfig, dataUrl: string) => void;
    onClose: () => void;
}

const DEFAULT_CONFIG: AvatarConfig = {
    charIndex: 0, // Boy
    bgIndex: 0    // Blue
};

// --- HELPER: Generate SVG Data URL String ---
// Updated to 300x450 (2:3 Ratio) to fill vertical space on card
export const generateAvatarDataUrl = (charIdx: number, bgIdx: number): string => {
    const char = CHARACTERS[charIdx] || CHARACTERS[0];
    const color = BG_COLORS[bgIdx] || BG_COLORS[0];
    
    const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
            <rect width="300" height="450" fill="${color}"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="200">${char}</text>
        </svg>
    `.trim();
    
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
};

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ initialConfig, onSave, onClose }) => {
    const [config, setConfig] = useState<AvatarConfig>(initialConfig || DEFAULT_CONFIG);
    const [tab, setTab] = useState<'CHAR' | 'BG'>('CHAR');

    const handleSave = () => {
        const dataUrl = generateAvatarDataUrl(config.charIndex, config.bgIndex);
        onSave(config, dataUrl);
    };

    const handleRandomize = () => {
        setConfig({
            charIndex: Math.floor(Math.random() * CHARACTERS.length),
            bgIndex: Math.floor(Math.random() * BG_COLORS.length)
        });
    };

    const currentChar = CHARACTERS[config.charIndex] || CHARACTERS[0];
    const currentColor = BG_COLORS[config.bgIndex] || BG_COLORS[0];

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[30px] border-4 border-black shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* HEADER */}
                <div className="bg-boo-purple p-3 flex justify-between items-center text-white shrink-0">
                    <h3 className="font-black text-xl uppercase tracking-wide">Crea Avatar</h3>
                    <div className="flex gap-2">
                         <button onClick={handleRandomize} className="p-2 bg-white/20 rounded-full hover:bg-white/40"><Shuffle size={20}/></button>
                         <button onClick={onClose} className="p-2 bg-red-500 rounded-full hover:bg-red-600 border-2 border-white"><X size={20}/></button>
                    </div>
                </div>

                {/* PREVIEW AREA - Updated to match 2:3 Ratio */}
                <div className="flex justify-center p-6 bg-gray-100 border-b-4 border-gray-200 shrink-0">
                    <div 
                        className="w-[180px] h-[270px] rounded-[30px] shadow-xl border-4 border-black flex items-center justify-center text-8xl select-none transition-colors duration-300"
                        style={{ backgroundColor: currentColor }}
                    >
                        {currentChar}
                    </div>
                </div>

                {/* TABS */}
                <div className="flex bg-gray-200 p-1 gap-1 shrink-0">
                    <button 
                        onClick={() => setTab('CHAR')} 
                        className={`flex-1 py-3 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-2 ${tab === 'CHAR' ? 'bg-white shadow text-boo-purple' : 'text-gray-500'}`}
                    >
                        <User size={18} /> Personaggio
                    </button>
                    <button 
                        onClick={() => setTab('BG')} 
                        className={`flex-1 py-3 rounded-xl font-black text-sm uppercase flex items-center justify-center gap-2 ${tab === 'BG' ? 'bg-white shadow text-boo-purple' : 'text-gray-500'}`}
                    >
                        <Palette size={18} /> Sfondo
                    </button>
                </div>

                {/* SELECTION GRID */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50">
                    {tab === 'CHAR' ? (
                        <div className="grid grid-cols-5 gap-3">
                            {CHARACTERS.map((char, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setConfig(prev => ({ ...prev, charIndex: idx }))}
                                    className={`
                                        aspect-square flex items-center justify-center text-3xl rounded-xl border-2 transition-all hover:scale-110 active:scale-95
                                        ${config.charIndex === idx ? 'bg-white border-boo-purple shadow-md scale-110' : 'bg-white border-gray-200 hover:border-gray-300'}
                                    `}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-4">
                            {BG_COLORS.map((color, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setConfig(prev => ({ ...prev, bgIndex: idx }))}
                                    className={`
                                        aspect-square rounded-full border-4 transition-all hover:scale-110 active:scale-95 shadow-sm
                                        ${config.bgIndex === idx ? 'border-black scale-110' : 'border-transparent'}
                                    `}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t-2 border-gray-100 bg-white shrink-0">
                    <button 
                        onClick={handleSave}
                        className="w-full bg-green-500 text-white font-black text-xl py-3 rounded-2xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                        <Check size={24} strokeWidth={4} /> SALVA
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AvatarCreator;
