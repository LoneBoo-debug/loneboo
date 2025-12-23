
import React, { useState, useEffect } from 'react';
import { Wand2, X, Type, Eye, ZapOff, Check } from 'lucide-react';

const ICON_MAGIC = 'https://i.postimg.cc/nLF3F9GS/accessdre-(1).png';
const BTN_CLOSE_IMG = 'https://i.postimg.cc/0NdtYdcJ/tasto-chiudi-(1)-(1).png';

interface AccessibilityMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ isOpen, onClose }) => {
    // States
    const [dyslexicFont, setDyslexicFont] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [zenMode, setZenMode] = useState(false);

    // Initialize from local storage
    useEffect(() => {
        const dFont = localStorage.getItem('a11y_dyslexic') === 'true';
        const hCont = localStorage.getItem('a11y_contrast') === 'true';
        const zMode = localStorage.getItem('a11y_zen') === 'true';

        setDyslexicFont(dFont);
        setHighContrast(hCont);
        setZenMode(zMode);

        updateBodyClass('a11y-font-dyslexic', dFont);
        updateBodyClass('a11y-high-contrast', hCont);
        updateBodyClass('a11y-zen-mode', zMode);
    }, []);

    const updateBodyClass = (className: string, active: boolean) => {
        if (active) document.body.classList.add(className);
        else document.body.classList.remove(className);
    };

    const toggleDyslexic = () => {
        const newVal = !dyslexicFont;
        setDyslexicFont(newVal);
        localStorage.setItem('a11y_dyslexic', String(newVal));
        updateBodyClass('a11y-font-dyslexic', newVal);
    };

    const toggleContrast = () => {
        const newVal = !highContrast;
        setHighContrast(newVal);
        localStorage.setItem('a11y_contrast', String(newVal));
        updateBodyClass('a11y-high-contrast', newVal);
    };

    const toggleZen = () => {
        const newVal = !zenMode;
        setZenMode(newVal);
        localStorage.setItem('a11y_zen', String(newVal));
        updateBodyClass('a11y-zen-mode', newVal);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-start p-4 pt-24 animate-in fade-in" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-[2rem] border-4 border-blue-600 shadow-2xl overflow-hidden animate-in slide-in-from-top-4 relative" onClick={e => e.stopPropagation()}>
                
                {/* Header Styled like Notifications */}
                <div className="bg-blue-600 p-4 flex justify-between items-center border-b-4 border-blue-800">
                    <div className="flex items-center gap-3">
                        <img src={ICON_MAGIC} alt="Magia" className="w-12 h-12 object-contain drop-shadow-md" />
                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide drop-shadow-sm">Magia per Tutti</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-14 h-14 md:w-18 md:h-18 object-contain drop-shadow-md" />
                    </button>
                </div>

                <div className="p-4 bg-blue-50 flex flex-col gap-3">
                    
                    {/* DYSLEXIC FONT */}
                    <button 
                        onClick={toggleDyslexic}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all active:scale-95 ${dyslexicFont ? 'bg-blue-100 border-blue-500 shadow-inner' : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'}`}
                    >
                        <div className={`p-2 rounded-full ${dyslexicFont ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <Type size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <span className="block font-black text-gray-800 text-lg">Font Leggibile</span>
                            <span className="text-xs text-gray-500 font-bold">Facilita la lettura (Dislessia)</span>
                        </div>
                        {dyslexicFont && <div className="bg-blue-500 text-white p-1 rounded-full"><Check size={20} strokeWidth={4} /></div>}
                    </button>

                    {/* HIGH CONTRAST */}
                    <button 
                        onClick={toggleContrast}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all active:scale-95 ${highContrast ? 'bg-yellow-100 border-yellow-500 shadow-inner' : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'}`}
                    >
                        <div className={`p-2 rounded-full ${highContrast ? 'bg-yellow-500 text-black' : 'bg-gray-100 text-gray-400'}`}>
                            <Eye size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <span className="block font-black text-gray-800 text-lg">Super Colori</span>
                            <span className="text-xs text-gray-500 font-bold">Contrasto elevato</span>
                        </div>
                        {highContrast && <div className="bg-yellow-500 text-black p-1 rounded-full"><Check size={20} strokeWidth={4} /></div>}
                    </button>

                    {/* ZEN MODE */}
                    <button 
                        onClick={toggleZen}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all active:scale-95 ${zenMode ? 'bg-green-100 border-green-500 shadow-inner' : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm'}`}
                    >
                        <div className={`p-2 rounded-full ${zenMode ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <ZapOff size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <span className="block font-black text-gray-800 text-lg">Modo Calmo</span>
                            <span className="text-xs text-gray-500 font-bold">Stop animazioni e distrazioni</span>
                        </div>
                        {zenMode && <div className="bg-green-500 text-white p-1 rounded-full"><Check size={20} strokeWidth={4} /></div>}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default AccessibilityMenu;
