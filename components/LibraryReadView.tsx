import React, { useState, useEffect } from 'react';
import { AppView } from '../types';
import { READING_DATABASE, BookReading } from '../services/readingDatabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OFFICIAL_LOGO } from '../constants';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfliberlecturesolo.webp';
const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';

const LibraryReadView: React.FC<{ setView: (view: AppView) => void }> = ({ setView }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedBook, setSelectedBook] = useState<BookReading | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const img = new Image();
        img.src = BG_URL;
        img.onload = () => setIsLoaded(true);
    }, []);

    const openBook = (book: BookReading) => {
        setSelectedBook(book);
        setCurrentPage(0);
    };

    const closeBook = () => {
        setSelectedBook(null);
    };

    const nextPage = () => {
        if (selectedBook && currentPage < selectedBook.pages.length - 1) {
            setCurrentPage(prev => prev + 1);
            const container = document.getElementById('book-page-container');
            if (container) container.scrollTop = 0;
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            const container = document.getElementById('book-page-container');
            if (container) container.scrollTop = 0;
        }
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-[#3e2723] overflow-hidden touch-none overscroll-none select-none flex flex-col">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .page-shadow { filter: drop-shadow(0 10px 25px rgba(0,0,0,0.6)); }
            `}</style>

            {!isLoaded && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-amber-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-6" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">Apro la Libreria...</span>
                </div>
            )}

            <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                    src={BG_URL} 
                    alt="Sfondo" 
                    className={`w-full h-full object-fill transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
                />
            </div>

            {/* HEADER AREA LETTURA */}
            <div className="relative z-10 w-full pt-[80px] md:pt-[110px] px-4 flex flex-col shrink-0">
                <div className="w-full flex justify-between items-center mb-1">
                    <button onClick={() => setView(AppView.BOOKS_LIST)} className="hover:scale-110 active:scale-95 transition-all outline-none pointer-events-auto">
                        <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-12 h-12 md:w-20 h-auto drop-shadow-xl" />
                    </button>
                    <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border-2 border-white/40 shadow-lg">
                        <h2 className="text-white font-luckiest text-xl md:text-4xl uppercase tracking-widest" style={{ WebkitTextStroke: '1px black' }}>Area Lettura</h2>
                    </div>
                    <div className="w-12 md:w-20"></div>
                </div>

                {/* NOTA RINGRAZIAMENTO TRASLUCIDA ALLINEATA A DESTRA - UN'UNICA RIGA */}
                <div className="self-end mr-2 md:mr-10 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-2xl border border-white/20 shadow-md">
                    <p className="text-white font-bold text-[8px] md:text-[11px] uppercase tracking-tight leading-tight text-right italic whitespace-nowrap" style={{ textShadow: '1px 1px 2px black' }}>
                        Si ringrazia il sito ririro.com per aver fornito i libri presenti nella stanza
                    </p>
                </div>
            </div>

            {/* GRIGLIA LIBRI */}
            <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-4 pt-6 pb-28">
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 max-w-7xl mx-auto">
                    {READING_DATABASE.map((book) => (
                        <div 
                            key={book.id}
                            onClick={() => openBook(book)}
                            className="group relative bg-white/10 backdrop-blur-sm rounded-2xl border-2 md:border-4 border-white/20 p-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xl flex flex-col h-full pointer-events-auto"
                        >
                            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden border-2 border-white shadow-md mb-2">
                                <img src={book.thumbnail} alt={book.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-white rounded-lg p-1.5 text-center mt-auto shadow-inner">
                                <h3 className="text-gray-900 font-black text-[9px] md:text-xs uppercase leading-tight line-clamp-2">
                                    {book.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALE LETTORE (READER) - VISUALE OTTIMIZZATA A TUTTO SCHERMO */}
            {selectedBook && (
                <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-md flex flex-col animate-in fade-in duration-300">
                    {/* Header Lettore */}
                    <div className="w-full pt-[74px] md:pt-[106px] px-6 pb-2 flex justify-between items-center shrink-0 border-b border-white/10">
                        <div className="flex-1">
                            <h3 className="text-white font-black text-sm md:text-2xl uppercase truncate drop-shadow-md pr-4">{selectedBook.title}</h3>
                        </div>
                        <button onClick={closeBook} className="hover:scale-110 active:scale-95 transition-all outline-none">
                            <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-10 h-10 md:w-14 h-auto drop-shadow-xl" />
                        </button>
                    </div>

                    {/* Area Pagina - Riempie tutto lo spazio disponibile senza tagliare */}
                    <div 
                        id="book-page-container"
                        className="flex-1 w-full overflow-hidden flex items-center justify-center p-2 md:p-4"
                    >
                        <img 
                            key={currentPage}
                            src={selectedBook.pages[currentPage]} 
                            className="max-w-full max-h-full object-contain rounded-lg page-shadow border-2 border-white/10 animate-in fade-in slide-in-from-right-4 duration-500" 
                            alt={`Pagina ${currentPage + 1}`}
                        />
                    </div>

                    {/* Controlli Navigazione */}
                    <div className="w-full h-[90px] md:h-[130px] shrink-0 flex items-center justify-center gap-4 md:gap-12 pb-4 bg-gradient-to-t from-black/90 to-transparent">
                        <button 
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            className={`p-3 md:p-5 rounded-full border-4 border-black shadow-[4px_4px_0_0_black] transition-all active:translate-y-1 active:shadow-none ${currentPage === 0 ? 'bg-gray-500 opacity-30 grayscale' : 'bg-yellow-400 hover:bg-yellow-300'}`}
                        >
                            <ChevronLeft size={28} strokeWidth={4} className="text-black" />
                        </button>

                        <div className="bg-white px-5 py-2 md:px-10 md:py-4 rounded-2xl md:rounded-3xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] flex flex-col items-center">
                            <span className="text-[8px] md:text-sm font-black text-gray-400 uppercase tracking-widest">Pagina</span>
                            <span className="text-lg md:text-3xl font-black text-blue-600 leading-none">
                                {currentPage + 1} <span className="text-gray-300">/</span> {selectedBook.pages.length}
                            </span>
                        </div>

                        <button 
                            onClick={nextPage}
                            disabled={currentPage === selectedBook.pages.length - 1}
                            className={`p-3 md:p-5 rounded-full border-4 border-black shadow-[4px_4px_0_0_black] transition-all active:translate-y-1 active:shadow-none ${currentPage === selectedBook.pages.length - 1 ? 'bg-gray-500 opacity-30 grayscale' : 'bg-green-500 hover:bg-green-400'}`}
                        >
                            <ChevronRight size={28} strokeWidth={4} className="text-black" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibraryReadView;