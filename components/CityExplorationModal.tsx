
import React from 'react';
import { X } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';

interface ExplorationItem {
    image: string;
    text: string;
}

interface CityExplorationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    headerDescription?: string;
    items: ExplorationItem[];
}

const CityExplorationModal: React.FC<CityExplorationModalProps> = ({ isOpen, onClose, title, headerDescription, items }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-28 md:pt-36 animate-in fade-in duration-300" onClick={onClose}>
            <div 
                className="bg-white rounded-[40px] border-8 border-yellow-400 w-full max-w-2xl max-h-[75vh] flex flex-col shadow-2xl relative overflow-hidden animate-in zoom-in duration-300"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-yellow-400 p-4 md:p-6 border-b-4 border-yellow-600 flex justify-between items-center shrink-0">
                    <h2 className="text-2xl md:text-4xl font-luckiest text-blue-900 uppercase tracking-tight leading-none drop-shadow-sm">
                        {title}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src="https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp" alt="Chiudi" className="w-14 h-14 md:w-22 md:h-22 object-contain drop-shadow-md" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 custom-scrollbar bg-slate-50">
                    
                    {/* Intro Text */}
                    {headerDescription && (
                        <div className="bg-blue-600 text-white p-6 rounded-[2rem] border-4 border-blue-800 shadow-lg mb-8 animate-in slide-in-from-top-4 duration-500">
                            <p className="font-luckiest text-lg md:text-2xl text-center leading-tight uppercase">
                                {headerDescription}
                            </p>
                        </div>
                    )}

                    {items.length > 0 ? items.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                            {/* Contenitore immagine con object-contain per vedere la foto intera */}
                            <div className="w-full bg-slate-200 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl mb-6 flex items-center justify-center min-h-[200px]">
                                <img src={item.image} alt="" className="w-full h-auto max-h-[400px] object-contain" />
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-lg w-full max-w-lg">
                                <p className="text-slate-700 font-bold text-lg md:text-2xl leading-relaxed text-center italic">
                                    "{item.text}"
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                             <span className="text-6xl mb-4">🚧</span>
                             <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Contenuto in arrivo...</h3>
                        </div>
                    )}
                    
                    {/* Final Footer Decor */}
                    <div className="py-12 flex flex-col items-center opacity-30">
                        <img src={OFFICIAL_LOGO} alt="" className="w-16 h-16 mb-2 grayscale" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Lone Boo World • 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CityExplorationModal;
