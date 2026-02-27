
import React, { useState } from 'react';
import { ArrowLeft, Maximize2, X } from 'lucide-react';
import { getProgress } from '../services/tokens';
import { HAT_RECIPES } from '../services/dbMagicHat';
import { PlayerProgress } from '../types';

const MagicHatAlbum: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [progress] = useState<PlayerProgress>(getProgress());
    const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
    const stickers = progress.magicHatStickers || [];
    const totalPossible = 190;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-lg flex flex-col animate-in fade-in duration-500 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 pt-[80px] md:pt-[120px] p-4 md:p-8 flex flex-col md:flex-row justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/10 gap-4">
                <div className="flex items-center w-full md:w-auto justify-between md:justify-start gap-6">
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 text-white font-black uppercase text-xs md:text-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} /> Torna al Cappello
                    </button>
                    
                    <div className="bg-purple-600/80 px-4 py-1 rounded-full border-2 border-yellow-400 shadow-lg">
                        <span className="text-white font-black text-xs md:text-lg tracking-tighter">
                            {stickers.length} / {totalPossible} <span className="text-[10px] md:text-xs opacity-70 ml-1">RACCOLTE</span>
                        </span>
                    </div>
                </div>

                <h2 className="text-xl md:text-4xl font-black text-yellow-400 drop-shadow-md uppercase tracking-tighter">Album Magico</h2>
                
                <div className="hidden md:block w-32"></div> {/* Spacer */}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-3 md:p-12 custom-scrollbar relative z-10">
                {stickers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full flex items-center justify-center mb-6 border-4 border-dashed border-white/20">
                            <span className="text-6xl">🎩</span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-black text-white mb-2 uppercase">L'Album è Vuoto!</h3>
                        <p className="text-gray-400 font-bold text-sm md:text-lg max-w-md">Mescola gli oggetti nel Cappello Magico e colleziona le tue creazioni preferite!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6">
                        {stickers.map((id) => {
                            const recipe = HAT_RECIPES[id];
                            if (!recipe) return null;
                            return (
                                <button 
                                    key={id} 
                                    onClick={() => setSelectedSticker(id)}
                                    className="group relative aspect-square bg-white/5 backdrop-blur-sm rounded-xl md:rounded-[30px] border-2 md:border-4 border-white/10 overflow-hidden shadow-xl hover:border-purple-500 transition-all animate-in zoom-in duration-300"
                                >
                                    <img src={recipe.img} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Maximize2 className="text-white" size={24} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Full Screen Overlay */}
            {selectedSticker && (
                <div 
                    className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300"
                    onClick={() => setSelectedSticker(null)}
                >
                    <button className="absolute top-20 md:top-32 right-6 md:right-10 text-white hover:scale-110 transition-transform">
                        <X size={48} strokeWidth={3} />
                    </button>
                    
                    <div className="relative max-w-4xl w-full aspect-square md:aspect-video flex items-center justify-center">
                        <img 
                            src={HAT_RECIPES[selectedSticker]?.img} 
                            alt="" 
                            className="max-w-full max-h-full object-contain rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.4)] border-4 border-white/20"
                        />
                    </div>
                    
                    <div className="mt-8 text-center">
                        <p className="text-white/70 text-lg md:text-2xl font-bold italic">
                            "{HAT_RECIPES[selectedSticker]?.desc}"
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicHatAlbum;
