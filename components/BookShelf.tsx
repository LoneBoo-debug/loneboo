
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { OFFICIAL_LOGO } from '../constants';
import { BOOKS_DATABASE } from '../services/booksDatabase';
import { X } from 'lucide-react';
import { Book, AppView } from '../types';
import { isNightTime } from '../services/weatherService';

const LIBRARY_BG_MOBILE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/library.webp';
const LIBRARY_BG_NIGHT = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bibliononttevista.webp';
const AMAZON_STORE_URL = 'https://www.amazon.it/stores/Lone-Boo/author/B0G3JTJSTB';
const BTN_LIBRERIA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-library-shelf.webp';
const BTN_SEE_AMAZON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-amazon.webp';

// Asset Audio e Video
const LIBRARY_VOICE_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/bibliotecaspechboovoice44ew.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

type Point = { x: number; y: number };
type ZoneConfig = { id: string; name: string; points: Point[]; };

const ZONES_DATA: ZoneConfig[] = [
  { "id": "book1", "name": "Libro: Concerto Vita", "points": [{ "x": 11.47, "y": 22.49 }, { "x": 12.53, "y": 32.23 }, { "x": 21.87, "y": 32.83 }, { "x": 20.27, "y": 23.54 }] },
  { "id": "book2", "name": "Libro: Enigmi", "points": [{ "x": 25.87, "y": 24.44 }, { "x": 26.93, "y": 33.28 }, { "x": 35.73, "y": 33.43 }, { "x": 34.4, "y": 25.19 }] },
  { "id": "book3", "name": "Libro: Avventure", "points": [{ "x": 11.47, "y": 38.23 }, { "x": 12.27, "y": 46.63 }, { "x": 21.6, "y": 46.78 }, { "x": 20.8, "y": 38.53 }] },
  { "id": "amazon_store", "name": "Store Amazon", "points": [{ "x": 44, "y": 50.07 }, { "x": 50.4, "y": 57.72 }, { "x": 72.27, "y": 56.97 }, { "x": 64, "y": 49.18 }] },
  { "id": "back_city", "name": "Torna in Città", "points": [{ "x": 5.87, "y": 76.01 }, { "x": 6.13, "y": 87.86 }, { "x": 32.8, "y": 82.91 }, { "x": 32, "y": 72.86 }] }
];

interface BookShelfProps {
    setView: (view: AppView) => void;
}

const BookShelf: React.FC<BookShelfProps> = ({ setView }) => {
    const [now, setNow] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // Gestione Audio e Video sincronizzata con l'header
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentBg = useMemo(() => {
        return isNightTime(now) ? LIBRARY_BG_NIGHT : LIBRARY_BG_MOBILE;
    }, [now]);

    useEffect(() => {
        // Aggiorna l'orario ogni minuto per gestire il cambio giorno/notte
        const timeInterval = setInterval(() => setNow(new Date()), 60000);

        const img = new Image(); 
        img.src = currentBg;
        img.onload = () => setIsLoaded(true);

        // Inizializzazione Audio specifico per la Biblioteca
        if (!audioRef.current) {
            audioRef.current = new Audio(LIBRARY_VOICE_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;

            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
                if (audioRef.current) audioRef.current.currentTime = 0;
            });
        }

        // Avvio automatico rispettando lo stato globale dell'header
        if (isAudioOn) {
            audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
        }

        // Listener per il tasto audio globale nell'header
        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled) {
                audioRef.current?.play().catch(() => {});
            } else {
                audioRef.current?.pause();
                if (audioRef.current) audioRef.current.currentTime = 0;
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        const timer = setTimeout(() => setIsLoaded(true), 2000);
        window.scrollTo(0, 0);

        return () => {
            clearInterval(timeInterval);
            clearTimeout(timer);
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [currentBg]);

    const handleExternalClick = (url: string) => {
        if (localStorage.getItem('disable_external_links') === 'true') {
            alert("Link bloccati dai genitori! 🔒");
            return;
        }
        window.open(url, '_blank');
    };

    const handleZoneInteraction = (zoneId: string) => {
        if (zoneId.startsWith('book')) {
            const book = BOOKS_DATABASE.find(b => b.id === zoneId);
            if (book) setSelectedBook(book);
        } else if (zoneId === 'amazon_store') {
            handleExternalClick(AMAZON_STORE_URL);
        } else if (zoneId === 'back_city') {
            setView(AppView.CITY_MAP);
        }
    };

    const getClipPath = (points: Point[]) => `polygon(${points.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    
    const getBoundingBox = (points: Point[]) => {
        const xs = points.map(p => p.x); const ys = points.map(p => p.y);
        const minX = Math.min(...xs); const maxX = Math.max(...xs);
        const minY = Math.min(...ys); const maxY = Math.max(...ys);
        return { left: `${minX}%`, top: `${minY}%`, width: `${maxX - minX}%`, height: `${maxY - minY}%`, minX, minY, maxX, maxY };
    };

    const getRelativeClipPath = (points: Point[], box: any) => {
        const { minX, minY, maxX, maxY } = box;
        const w = maxX - minX; const h = maxY - minY;
        if (w === 0 || h === 0) return 'none';
        const relPoints = points.map(p => `${((p.x - minX) / w) * 100}% ${((p.y - minY) / h) * 100}%`);
        return `polygon(${relPoints.join(', ')})`;
    };

    return (
        <div className="fixed inset-0 top-0 left-0 w-full h-[100dvh] z-0 bg-amber-900 overflow-hidden touch-none overscroll-none select-none">
            {!isLoaded && (
                <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-amber-900/95 backdrop-blur-md">
                    <img src={OFFICIAL_LOGO} alt="Caricamento..." className="w-32 h-32 object-contain animate-spin-horizontal mb-4" />
                    <span className="text-white font-black text-lg tracking-widest animate-pulse uppercase">STO CARICANDO...</span>
                </div>
            )}

            {/* Mini TV di Boo - Posizionato a SINISTRA */}
            {isLoaded && isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video 
                            src={BOO_TALK_VIDEO}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ 
                                mixBlendMode: 'screen',
                                filter: 'contrast(1.1) brightness(1.1)'
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 z-0 w-full h-full cursor-default">
                <img src={currentBg} alt="Biblioteca" className={`w-full h-full object-fill transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} draggable={false} />
                {isLoaded && ZONES_DATA.map(zone => {
                    const book = zone.id.startsWith('book') ? BOOKS_DATABASE.find(b => b.id === zone.id) : null;
                    const box = getBoundingBox(zone.points);
                    if (book && box) {
                        return (
                            <div key={zone.id} onClick={(e) => { e.stopPropagation(); handleZoneInteraction(zone.id); }} className="absolute cursor-pointer hover:brightness-110 transition-all shadow-sm" style={{ left: box.left, top: box.top, width: box.width, height: box.height, clipPath: getRelativeClipPath(zone.points, box) }}>
                                <img src={book.coverImage} className="w-full h-full object-cover" alt={book.title} />
                            </div>
                        );
                    }
                    return ( <div key={zone.id} onClick={(e) => { e.stopPropagation(); handleZoneInteraction(zone.id); }} className="absolute inset-0 cursor-pointer active:bg-white/10 transition-colors" style={{ clipPath: getClipPath(zone.points) }} /> );
                })}
            </div>

            <div className="absolute top-[58%] right-6 md:right-12 z-40">
                <button onClick={() => setView(AppView.BOOKS_LIST)} className="outline-none group">
                    <img src={BTN_LIBRERIA_IMG} alt="Vai alla Libreria" className="w-24 md:w-40 lg:w-48 h-auto drop-shadow-2xl" />
                </button>
            </div>

            {selectedBook && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in" onClick={() => setSelectedBook(null)}>
                    <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                    <div className="bg-white w-full max-w-lg rounded-[40px] border-8 border-blue-500 p-6 shadow-2xl relative animate-in zoom-in flex flex-col h-[75vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setSelectedBook(null)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all shadow-lg z-[450] flex items-center justify-center"><X size={24} strokeWidth={4} /></button>
                        <div className="flex-1 overflow-y-auto no-scrollbar pr-0">
                            <div className="flex flex-col items-center mb-6 pt-2">
                                <div className="w-48 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-black shadow-2xl mb-4 transform -rotate-2">
                                    <img src={selectedBook.coverImage} alt={selectedBook.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-blue-700 uppercase leading-none text-center mb-1">{selectedBook.title}</h3>
                                <span className="bg-orange-400 text-white px-3 py-1 rounded-full font-black text-xs uppercase shadow-sm">{selectedBook.subtitle}</span>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-3xl border-2 border-blue-100 mb-6">
                                 <p className="text-gray-700 font-bold text-sm md:text-base leading-relaxed whitespace-pre-wrap">{selectedBook.description}</p>
                            </div>
                        </div>
                        <div className="pt-4 mt-auto border-t-2 border-gray-100 flex justify-center shrink-0">
                            <button onClick={() => handleExternalClick(selectedBook.amazonUrl)} className="w-full max-w-[200px] hover:scale-105 active:scale-95 transition-transform outline-none">
                                <img src={BTN_SEE_AMAZON_IMG} alt="Vedi su Amazon" className="w-full h-auto drop-shadow-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookShelf;
