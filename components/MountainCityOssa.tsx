
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { MOUNTAIN_CITY_OSSA_CSV_URL } from '../constants';
import { fetchOssaData, OssaData } from '../services/mountainCityService';
import { X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface MountainCityOssaProps {
    setView: (view: AppView) => void;
}

const MountainCityOssa: React.FC<MountainCityOssaProps> = ({ setView }) => {
    const [allData, setAllData] = useState<OssaData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<OssaData | null>(null);
    const [showDescription, setShowDescription] = useState(false);
    const [loading, setLoading] = useState(true);
    const boxRef = useRef<HTMLDivElement>(null);

    const categories = [
        { id: 'RETTILI PREISTORICI', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/rettilipreistoricibutton.webp' },
        { id: 'ANIMALI PREISTORICI', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aniamalipreistoricibutton.webp' },
        { id: 'ANIMALI ESTINTI', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/animaliestintibutton.webp' }
    ];

    const [showTimeline, setShowTimeline] = useState(false);

    const timelineData = [
        { era: 'Precambriano', period: 'Archeano/Proterozoico', years: '4600 - 541 Ma', event: 'Prime forme di vita unicellulari e batteri.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/archeanominia.webp' },
        { era: 'Paleozoico', period: 'Cambriano', years: '541 - 485 Ma', event: 'Esplosione della vita marina: Trilobiti e molluschi.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cambrianominia.webp' },
        { era: 'Paleozoico', period: 'Ordoviciano', years: '485 - 444 Ma', event: 'Primi vertebrati: pesci senza mascelle.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ordovicianominia.webp' },
        { era: 'Paleozoico', period: 'Siluriano', years: '444 - 419 Ma', event: 'Prime piante terrestri e artropodi.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/silurianominia.webp' },
        { era: 'Paleozoico', period: 'Devoniano', years: '419 - 359 Ma', event: 'Età dei pesci e primi anfibi.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/devonianominia.webp' },
        { era: 'Paleozoico', period: 'Carbonifero', years: '359 - 299 Ma', event: 'Insetti giganti e grandi foreste.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/carboniferominia.webp' },
        { era: 'Paleozoico', period: 'Permiano', years: '299 - 252 Ma', event: 'Diversificazione dei rettili.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/permianominia.webp' },
        { era: 'Mesozoico', period: 'Triassico', years: '252 - 201 Ma', event: 'Primi dinosauri e piccoli mammiferi.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/triassicominia.webp' },
        { era: 'Mesozoico', period: 'Giurassico', years: '201 - 145 Ma', event: 'Dinosauri giganti e primi uccelli.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giurassicominia.webp' },
        { era: 'Mesozoico', period: 'Cretacico', years: '145 - 66 Ma', event: 'T-Rex e scomparsa dei dinosauri.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cretacicominia.webp' },
        { era: 'Cenozoico', period: 'Paleogene/Neogene', years: '66 - 2.6 Ma', event: 'I mammiferi dominano la Terra.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/paleogeneminia.webp' },
        { era: 'Cenozoico', period: 'Quaternario', years: '2.6 Ma - Oggi', event: 'Evoluzione dell\'uomo e ere glaciali.', img: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quaternariominia.webp' },
    ];

    useEffect(() => {
        const loadData = async () => {
            const cacheBuster = `&t=${new Date().getTime()}`;
            const data = await fetchOssaData(MOUNTAIN_CITY_OSSA_CSV_URL + cacheBuster);
            setAllData(data);
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredItems = allData.filter(item => item.category.toUpperCase() === selectedCategory?.toUpperCase());

    return (
        <div className="fixed inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-stone-900">
            {/* BACKGROUND */}
            <img 
                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/ossascavisarcheolo99.webp" 
                alt="Ossa Animali" 
                className="absolute inset-0 w-full h-full object-cover select-none animate-in fade-in duration-1000"
                referrerPolicy="no-referrer"
            />

            {/* BACK BUTTON & INTRO TEXT */}
            <div className="fixed top-2 left-2 z-[100] flex items-center gap-4 md:gap-8">
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => setView(AppView.MOUNTAIN_CITY)}
                        className="hover:scale-110 active:scale-95 transition-all drop-shadow-2xl flex-shrink-0"
                    >
                        <img 
                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/bacdsthecity67676.webp" 
                            alt="Torna in Città" 
                            className="w-24 md:w-44 h-auto rounded-2xl"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                    
                    {/* TIMELINE BUTTON */}
                    <button 
                        onClick={() => setShowTimeline(!showTimeline)}
                        className="hover:scale-110 active:scale-95 transition-all drop-shadow-2xl flex-shrink-0 self-center"
                    >
                        <img 
                            src="https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_creami+in+stile+cartoon+un+tas_492854640048046087+(1)+(1).webp" 
                            alt="Linea del Tempo" 
                            className="w-16 md:w-32 h-auto rounded-full"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                </div>
                <p 
                    className="font-luckiest text-white text-sm md:text-2xl uppercase tracking-widest drop-shadow-[0_4px_8px_rgba(0,0,0,1)] leading-tight max-w-[200px] md:max-w-xl"
                    style={{ WebkitTextStroke: '1px black' }}
                >
                    questi i reperti che abbiamo trovato per adesso in città delle montagne...
                </p>
            </div>

            {/* VERTICAL TIMELINE */}
            <AnimatePresence>
                {showTimeline && (
                    <motion.div 
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        className="fixed top-24 right-4 bottom-32 w-[85%] md:w-[450px] z-[150] overflow-y-auto custom-scrollbar p-4 md:p-8 pointer-events-auto"
                        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
                    >
                        <div className="relative w-full flex flex-col gap-16 py-10">
                            {/* THE LINE - positioned on the right */}
                            <div className="absolute top-0 bottom-0 right-8 w-2 bg-white/40 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                            
                            {timelineData.map((item, idx) => (
                                <div key={idx} className="relative z-10 flex flex-row-reverse items-start w-full pr-6">
                                    {/* DOT - on the line */}
                                    <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-white shadow-[0_0_15px_rgba(250,204,21,0.6)] flex-shrink-0 mt-2" />
                                    
                                    {/* CONTENT - to the left of the line */}
                                    <div className="text-right mr-6 flex-grow max-w-[70%]">
                                        <div className="bg-black/60 backdrop-blur-md p-4 md:p-6 rounded-[2rem] border-2 border-white/20 shadow-2xl">
                                            <span className="font-luckiest text-yellow-300 text-[10px] md:text-sm uppercase tracking-widest block mb-1 drop-shadow-md">
                                                {item.era}
                                            </span>
                                            <span className="font-luckiest text-white text-sm md:text-lg uppercase tracking-widest block mb-1 drop-shadow-md leading-tight">
                                                {item.period}
                                            </span>
                                            <span className="font-luckiest text-white/80 text-[10px] md:text-xs uppercase tracking-widest block mb-3">
                                                {item.years}
                                            </span>
                                            <div className="mb-3 drop-shadow-lg flex justify-end">
                                                <img 
                                                    src={item.img} 
                                                    alt={item.period} 
                                                    className="w-16 md:w-24 h-auto rounded-lg"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </div>
                                            <p className="font-luckiest text-white text-[11px] md:text-[14px] uppercase tracking-wider leading-relaxed drop-shadow-sm break-words whitespace-normal">
                                                {item.event}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* CLOSE TIMELINE BUTTON */}
                        <button 
                            onClick={() => setShowTimeline(false)}
                            className="fixed top-28 right-8 z-[160] bg-red-500 hover:bg-red-400 text-white p-2 rounded-full shadow-xl border-2 border-white transition-all hover:scale-110 active:scale-90"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CATEGORY BUTTONS AT BOTTOM */}
            <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center gap-4 px-4">
                {categories.map((cat) => (
                    <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`hover:scale-110 active:scale-95 transition-all drop-shadow-xl ${selectedCategory === cat.id ? 'scale-105 brightness-110' : 'opacity-90'}`}
                    >
                        <img 
                            src={cat.img} 
                            alt={cat.id} 
                            className="w-24 md:w-56 h-auto block rounded-xl"
                            referrerPolicy="no-referrer"
                        />
                    </button>
                ))}
            </div>

            {/* TRANSLUCENT BOX (GRID OF ICONS) */}
            <AnimatePresence>
                {selectedCategory && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative z-40 w-[90%] max-w-4xl h-[60vh] bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-[3rem] p-8 shadow-2xl flex flex-col"
                    >
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className="absolute -top-4 -right-4 z-50 bg-red-500 hover:bg-red-400 text-white p-3 rounded-full shadow-xl border-4 border-white transition-all hover:scale-110 active:scale-90"
                        >
                            <X size={32} strokeWidth={3} />
                        </button>

                        <h2 className="font-luckiest text-white text-3xl md:text-5xl uppercase tracking-widest mb-8 text-center drop-shadow-md">
                            {selectedCategory}
                        </h2>

                        <div className="flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar px-6 md:px-12">
                            <div className="grid grid-cols-2 gap-x-12 gap-y-16 md:gap-x-20 md:gap-y-24 py-8">
                                {filteredItems.map((item, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedItem(item)}
                                        className="flex flex-col items-center gap-4 group w-full"
                                    >
                                        <div className="w-full aspect-square overflow-hidden transition-all duration-300 group-hover:scale-110 drop-shadow-2xl">
                                            <img 
                                                src={item.iconImage} 
                                                alt={item.iconName} 
                                                className="w-full h-full object-contain"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                        <span className="font-luckiest text-white text-[10px] sm:text-xs md:text-lg lg:text-xl uppercase tracking-widest text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-yellow-300 transition-colors leading-tight w-full whitespace-nowrap overflow-hidden text-ellipsis px-1">
                                            {item.iconName}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {filteredItems.length === 0 && (
                                <div className="text-white/50 text-center italic mt-10">Nessun elemento in questa categoria.</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULL SCREEN MODAL */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
                    >
                        <img 
                            src={selectedItem.fullImage} 
                            alt={selectedItem.iconName} 
                            className="w-full h-full object-contain select-none"
                            referrerPolicy="no-referrer"
                        />

                        {/* MODAL CONTROLS */}
                        {/* SPIEGA BUTTON (BOTTOM LEFT) */}
                        <button 
                            onClick={() => setShowDescription(!showDescription)}
                            className="absolute bottom-6 left-6 z-[210] hover:scale-110 active:scale-95 transition-all drop-shadow-2xl"
                        >
                            <img 
                                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/spiegabuttonarcheo.webp" 
                                alt="Spiega" 
                                className="w-16 md:w-28 h-auto rounded-xl"
                                referrerPolicy="no-referrer"
                            />
                        </button>

                        {/* CLOSE BUTTON (BOTTOM RIGHT) */}
                        <button 
                            onClick={() => { setSelectedItem(null); setShowDescription(false); }}
                            className="absolute bottom-6 right-6 z-[210] hover:scale-110 active:scale-95 transition-all drop-shadow-2xl"
                        >
                            <img 
                                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/chiudibuttonarcheo.webp" 
                                alt="Chiudi" 
                                className="w-16 md:w-28 h-auto rounded-xl"
                                referrerPolicy="no-referrer"
                            />
                        </button>

                        {/* DESCRIPTION OVERLAY */}
                        <AnimatePresence>
                            {showDescription && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    className="absolute inset-x-8 top-20 bottom-32 z-[205] bg-black/70 backdrop-blur-lg border-2 border-white/20 rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-luckiest text-yellow-400 text-3xl md:text-5xl uppercase tracking-widest">
                                            {selectedItem.iconName}
                                        </h3>
                                        <button 
                                            onClick={() => setShowDescription(false)}
                                            className="text-white/50 hover:text-white"
                                        >
                                            <X size={32} />
                                        </button>
                                    </div>
                                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-4">
                                        <div className="text-white text-lg md:text-2xl font-medium leading-relaxed prose prose-invert max-w-none prose-p:my-4 prose-strong:text-yellow-400">
                                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                                                {selectedItem.description}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LOADING STATE */}
            {loading && (
                <div className="absolute inset-0 z-[300] flex flex-col items-center justify-center bg-stone-900/90 backdrop-blur-sm">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
                    <span className="text-white font-luckiest uppercase tracking-widest animate-pulse">Caricamento Ossa...</span>
                </div>
            )}
        </div>
    );
};

export default MountainCityOssa;
