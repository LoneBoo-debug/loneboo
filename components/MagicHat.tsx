import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, Download, Copy, ChevronLeft, ChevronRight, ZoomIn, Beaker } from 'lucide-react';
import { HAT_INPUT_ITEMS, HAT_RECIPES, HatItem, HatRecipe } from '../services/dbMagicHat';
import { generateHybridImage } from '../services/ai';

const HAT_IMG = 'https://i.postimg.cc/X7qKBDrZ/sdfasadfdfsa-(1)-(1)-(1).png';
const BTN_MIX_IMG = 'https://i.postimg.cc/DfPfkbX2/desd-(1)-(1).png';

const MagicHat: React.FC = () => {
    const [selectedItems, setSelectedItems] = useState<HatItem[]>([]);
    const [isMixing, setIsMixing] = useState(false);
    const [isHatShaking, setIsHatShaking] = useState(false);
    const [result, setResult] = useState<HatRecipe | null>(null);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    
    // Developer Tool State
    const [isAdmin, setIsAdmin] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [aiImage, setAiImage] = useState<string | null>(null);
    const [isJiggling, setIsJiggling] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleHatClick = () => {
        if (isMixing || isHatShaking) return;
        
        // Feedback visivo immediato al clic
        setIsJiggling(true);
        setTimeout(() => setIsJiggling(false), 300);

        setClickCount(prev => {
            const next = prev + 1;
            if (next >= 5) {
                setTimeout(() => {
                    setIsAdmin(current => {
                        const newState = !current;
                        alert(newState ? "🧪 LABORATORIO ATTIVATO! \n\nUsa l'IA per creare nuove immagini." : "✨ Modalità Gioco.");
                        return newState;
                    });
                }, 50);
                return 0;
            }
            return next;
        });
    };

    const handleSelectItem = (item: HatItem) => {
        if (selectedItems.length < 2 && !selectedItems.find(i => i.id === item.id)) {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const removeSelectedItem = (index: number) => {
        if (isMixing || isHatShaking) return;
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
        setResult(null);
        setAiImage(null);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 240;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleMix = async () => {
        if (selectedItems.length !== 2) return;
        
        setIsMixing(true);
        setResult(null);
        const sortedIds = selectedItems.map(i => i.id).sort();
        const key = sortedIds.join('-');
        
        // Sincronizzazione: caduta ingredienti -> scuotimento
        setTimeout(async () => {
            setIsHatShaking(true);
            
            if (isAdmin) {
                try {
                    const img = await generateHybridImage(selectedItems[0].name, selectedItems[1].name);
                    setIsHatShaking(false);
                    setIsMixing(false);
                    if (img) {
                        setAiImage(img);
                        setResult({
                            name: `Mix ${selectedItems[0].name} + ${selectedItems[1].name}`,
                            img: img,
                            desc: "Creato nel laboratorio di Lone Boo!"
                        });
                    }
                } catch (e) {
                    setIsHatShaking(false);
                    setIsMixing(false);
                    alert("Errore magico durante la creazione IA.");
                }
            } else {
                // Tempo di scuotimento 2 secondi
                setTimeout(() => {
                    setIsHatShaking(false);
                    setIsMixing(false);
                    const found = HAT_RECIPES[key];
                    if (found) {
                        setResult(found);
                    } else {
                        setResult({
                            name: 'Oggetto Misterioso',
                            img: 'https://i.postimg.cc/1360vPBq/close.png',
                            desc: 'Questa combinazione non è ancora stata scoperta!'
                        });
                    }
                }, 2000);
            }
        }, 1200);
    };

    const downloadAsset = () => {
        if (!aiImage || selectedItems.length < 2) return;
        const sortedIds = selectedItems.map(i => i.id).sort();
        const filename = `${sortedIds[0]}_${sortedIds[1]}.png`;
        const link = document.createElement('a');
        link.href = aiImage;
        link.download = filename;
        link.click();
    };

    const copyJson = () => {
        if (selectedItems.length < 2) return;
        const sortedIds = selectedItems.map(i => i.id).sort();
        const key = `${sortedIds[0]}-${sortedIds[1]}`;
        const code = `'${key}': { 
    name: 'NOME_DA_INVENTARE', 
    img: '/assets/images/magichat/${sortedIds[0]}_${sortedIds[1]}.webp', 
    desc: 'DESCRIZIONE_DIVERTENTE' 
},`;
        navigator.clipboard.writeText(code);
        alert("Codice JSON copiato!");
    };

    const reset = () => {
        setSelectedItems([]);
        setResult(null);
        setAiImage(null);
        setIsZoomOpen(false);
        setIsMixing(false);
        setIsHatShaking(false);
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] flex flex-col bg-transparent overflow-hidden touch-none select-none">
            <style>{`
                @keyframes fall-into-hat-left {
                    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
                    100% { transform: translate(60px, 280px) scale(0.1) rotate(45deg); opacity: 0; }
                }
                @keyframes fall-into-hat-right {
                    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
                    100% { transform: translate(-60px, 280px) scale(0.1) rotate(45deg); opacity: 0; }
                }
                @keyframes hat-shake-magic {
                    0%, 100% { transform: rotate(0deg) scale(1.1); }
                    20% { transform: rotate(-5deg) scale(1.15); }
                    40% { transform: rotate(5deg) scale(1.1); }
                    60% { transform: rotate(-3deg) scale(1.15); }
                    80% { transform: rotate(3deg) scale(1.1); }
                }
                @keyframes magic-result-show {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; filter: blur(10px); }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; filter: blur(0); }
                }
                @keyframes hat-jiggle {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(0.9, 1.1); }
                    50% { transform: scale(1.1, 0.9); }
                }
                .animate-fall-left { animation: fall-into-hat-left 1.2s cubic-bezier(0.5, 0, 0.5, 1) forwards; }
                .animate-fall-right { animation: fall-into-hat-right 1.2s cubic-bezier(0.5, 0, 0.5, 1) forwards; }
                .animate-hat-shake { animation: hat-shake-magic 0.3s infinite ease-in-out; }
                .animate-magic-result { animation: magic-result-show 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                .animate-jiggle { animation: hat-jiggle 0.3s ease-in-out; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* ZOOM OVERLAY */}
            {isZoomOpen && result && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setIsZoomOpen(false)}>
                    <button className="absolute top-24 right-6 bg-red-500 text-white p-3 rounded-full border-4 border-white shadow-xl hover:scale-110">
                        <X size={32} strokeWidth={4} />
                    </button>
                    <div className="w-full max-w-lg aspect-square rounded-[40px] border-8 border-yellow-400 overflow-hidden shadow-2xl relative mb-4">
                        <img src={result.img} alt={result.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 drop-shadow-md uppercase text-center">{result.name}</h3>
                </div>
            )}

            <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 pt-40 md:pt-52 relative">
                
                {/* SELECTED ITEMS */}
                <div className="flex justify-center gap-6 md:gap-12 mb-4 h-28 md:h-40">
                    {[0, 1].map(idx => (
                        <div key={idx} className="relative w-32 md:w-44 h-full">
                            {selectedItems[idx] && (
                                <div className={`
                                    w-full h-full bg-transparent flex items-center justify-center p-2 relative
                                    ${isMixing ? (idx === 0 ? 'animate-fall-left' : 'animate-fall-right') : 'animate-in zoom-in duration-300'}
                                `}>
                                    <img src={selectedItems[idx].img} className="w-full h-full object-contain drop-shadow-2xl" alt="" />
                                    {!isMixing && (
                                        <button 
                                            onClick={() => removeSelectedItem(idx)} 
                                            className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full border-2 border-white shadow-lg z-20"
                                        >
                                            <X size={14} strokeWidth={4} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* THE HAT & RESULT WRAPPER */}
                <div className="relative flex flex-col items-center mb-16 md:mb-24">
                    {isAdmin && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white px-4 py-1 rounded-full border-2 border-yellow-400 shadow-xl flex items-center gap-2 animate-bounce">
                            <Beaker size={16} className="text-yellow-400" />
                            <span className="font-black text-[10px] uppercase">LABORATORIO IA</span>
                        </div>
                    )}

                    <div className={`absolute inset-0 bg-purple-500 rounded-full blur-3xl opacity-20 ${isMixing ? 'animate-pulse' : ''}`}></div>
                    
                    <button 
                        onClick={handleHatClick}
                        className={`relative z-10 transition-transform duration-300 ${isHatShaking ? 'animate-hat-shake' : (isJiggling ? 'animate-jiggle' : '')}`}
                        disabled={isMixing}
                    >
                        <img 
                            src={HAT_IMG} 
                            alt="Cappello Magico" 
                            className={`w-64 md:w-[500px] h-auto drop-shadow-2xl ${isHatShaking ? 'brightness-125' : ''}`} 
                        />
                    </button>

                    {selectedItems.length === 2 && !result && !isMixing && (
                        <div className="absolute bottom-[-15px] md:bottom-[-25px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-in slide-in-from-bottom-4 duration-500">
                            {/* Box nero non traslucido e aderente */}
                            <div className="bg-black p-1 md:p-1.5 rounded-[30px] border-2 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                                <button 
                                    onClick={handleMix}
                                    className="hover:scale-105 active:scale-95 transition-all outline-none flex items-center justify-center"
                                >
                                    <img 
                                        src={BTN_MIX_IMG} 
                                        alt="Mescola" 
                                        className="w-72 md:w-[580px] h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] block" 
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* RESULT DISPLAY */}
                {result && !isMixing && (
                    <div className="fixed top-1/2 left-1/2 z-[80] w-[95%] max-w-lg animate-magic-result flex flex-col items-center">
                        <div className="bg-white/95 backdrop-blur-2xl p-6 md:p-10 rounded-[50px] border-8 border-purple-500 shadow-[0_30px_100px_rgba(0,0,0,0.6)] relative flex flex-col items-center w-full">
                            <div className="absolute -top-5 -right-5">
                                <button onClick={reset} className="bg-red-500 text-white p-2.5 rounded-full border-4 border-white shadow-xl hover:scale-110 transition-transform"><X size={24} strokeWidth={4} /></button>
                            </div>
                            
                            <div className="relative w-40 h-40 md:w-64 md:h-64 mb-6 cursor-zoom-in group" onClick={() => setIsZoomOpen(true)}>
                                <div className="absolute inset-0 bg-purple-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                                <img src={result.img} alt={result.name} className="relative z-10 w-full h-full object-cover rounded-[40px] border-4 border-white shadow-xl group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-[40px]">
                                    <ZoomIn className="text-white drop-shadow-md" size={40} />
                                </div>
                            </div>

                            <h4 className="text-3xl md:text-5xl font-black text-purple-600 mb-2 uppercase tracking-tighter text-center leading-none">{result.name}</h4>
                            <p className="text-gray-600 font-bold text-sm md:text-lg mb-8 leading-snug italic text-center px-4">"{result.desc}"</p>

                            <div className="flex gap-3 w-full">
                                <button onClick={reset} className="flex-1 bg-yellow-400 text-black font-black py-4 rounded-[25px] border-b-8 border-yellow-600 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 text-lg shadow-lg">
                                    <RotateCcw size={24} /> ANCORA!
                                </button>
                                
                                {isAdmin && aiImage && (
                                    <div className="flex gap-2">
                                        <button onClick={downloadAsset} title="Scarica PNG" className="bg-blue-500 text-white p-4 rounded-[25px] border-b-8 border-blue-700 active:border-b-0 active:translate-y-1 shadow-lg hover:brightness-110">
                                            <Download size={24} />
                                        </button>
                                        <button onClick={copyJson} title="Copia JSON" className="bg-purple-600 text-white p-4 rounded-[25px] border-b-8 border-purple-800 active:border-b-0 active:translate-y-1 shadow-lg hover:brightness-110">
                                            <Copy size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ITEM SELECTOR */}
            <div className="relative w-full h-24 md:h-32 z-40 flex items-center mb-12 md:mb-16 px-4">
                <button 
                    onClick={() => scroll('left')} 
                    className="absolute left-2 md:left-6 z-50 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white backdrop-blur-md transition-all active:scale-90 shadow-md border border-white/10"
                >
                    <ChevronLeft size={28} strokeWidth={3} />
                </button>
                
                <div 
                    ref={scrollRef} 
                    className="flex-1 h-full overflow-x-auto no-scrollbar flex items-center gap-4 px-12 md:px-20 scroll-smooth"
                >
                    {HAT_INPUT_ITEMS.map((item) => {
                        const isSel = selectedItems.find(i => i.id === item.id);
                        return (
                            <button 
                                key={item.id} 
                                onClick={() => handleSelectItem(item)}
                                disabled={isSel !== undefined || selectedItems.length >= 2 || isMixing || isHatShaking}
                                className={`
                                    h-[85%] aspect-square shrink-0 transition-all relative flex items-center justify-center
                                    ${isSel ? 'opacity-10 grayscale scale-75' : 'hover:scale-110 active:scale-90 drop-shadow-lg'}
                                    disabled:cursor-default
                                `}
                            >
                                <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                            </button>
                        );
                    })}
                </div>

                <button 
                    onClick={() => scroll('right')} 
                    className="absolute right-2 md:right-6 z-50 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white backdrop-blur-md transition-all active:scale-90 shadow-md border border-white/10"
                >
                    <ChevronRight size={28} strokeWidth={3} />
                </button>
            </div>
        </div>
    );
};

export default MagicHat;