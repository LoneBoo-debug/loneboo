
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { AppView, SchoolLesson, LessonProgress } from '../types';
import { fetchAllMiddleSchoolLessons } from '../services/curriculumService';
import { getInReadingLessons } from '../services/progressService';
import { Search, X, Loader2 } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolamediaday.webp';
const BG_NIGHT_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/internoscuolanonight.webp';
const BTN_BACK_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tornacityrainbowse.webp';
const BTN_SEARCH_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_creami+un+pulsante+quadrato+st_485956893698539528+(1).webp';

// PREMIUM ASSETS
const PREMIUM_LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libercloased44fx33.webp';
const PREMIUM_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libercloased44fx33.webp';
const BTN_PREMIUM_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/returncloded44fx332.webp';
const BTN_PREMIUM_INFO_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/infoblocked44fx33.webp';

const SUBJECT_ICONS: Record<string, string> = {
    'ITALIANO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/italianobookmedie.webp',
    'INGLESE': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/inglesebookmedie.webp',
    'STORIA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/storiabookmedie.webp',
    'GEOGRAFIA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geografiabookmedie.webp',
    'MATEMATICA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/matematicaboomedie.webp',
    'SCIENZE': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scienzebookmedie.webp',
    'ARTE': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/aartebookmedie.webp',
    'TECNOLOGIA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tencologiabookmedie.webp',
    'CIVICA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/civicabookmedie.webp',
    'MOTORIA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/motoriboomedie.webp',
    'ESPERIMENTI': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/epserimentobookmedie2.webp',
    'INFORMATICA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/informaticabookmedie2.webp'
};

const GRADE_VIEWS: Record<number, AppView> = {
    6: AppView.RAINBOW_CITY_SCUOLA_MEDIA_1,
    7: AppView.RAINBOW_CITY_SCUOLA_MEDIA_2,
    8: AppView.RAINBOW_CITY_SCUOLA_MEDIA_3
};

const SUBJECT_VIEWS: Record<string, AppView> = {
    'ITALIANO': AppView.MEDIE_ITALIANO,
    'INGLESE': AppView.MEDIE_INGLESE,
    'STORIA': AppView.MEDIE_STORIA,
    'GEOGRAFIA': AppView.MEDIE_GEOGRAFIA,
    'MATEMATICA': AppView.MEDIE_MATEMATICA,
    'SCIENZE': AppView.MEDIE_SCIENZE,
    'ARTE': AppView.MEDIE_ARTE,
    'TECNOLOGIA': AppView.MEDIE_TECNOLOGIA,
    'CIVICA': AppView.MEDIE_CIVICA,
    'MOTORIA': AppView.MEDIE_MOTORIA,
    'ESPERIMENTI': AppView.MEDIE_ESPERIMENTI,
    'INFORMATICA': AppView.MEDIE_INFORMATICA
};

interface Point { x: number; y: number }

type AreaId = 'PRIMA_MEDIA' | 'SECONDA_MEDIA' | 'TERZA_MEDIA';

interface AreaConfig {
    id: AreaId;
    name: string;
    view: AppView;
    points: Point[];
}

const DEFAULT_AREAS: Record<AreaId, AreaConfig> = {
    PRIMA_MEDIA: { 
        id: 'PRIMA_MEDIA', 
        name: '1 Media', 
        view: AppView.RAINBOW_CITY_SCUOLA_MEDIA_1, 
        points: [
            { "x": 21.6, "y": 37.48 },
            { "x": 21.87, "y": 59.97 },
            { "x": 32, "y": 62.37 },
            { "x": 32, "y": 35.68 }
        ] 
    },
    SECONDA_MEDIA: { 
        id: 'SECONDA_MEDIA', 
        name: '2 Media', 
        view: AppView.RAINBOW_CITY_SCUOLA_MEDIA_2, 
        points: [
            { "x": 40.8, "y": 32.83 },
            { "x": 40, "y": 64.77 },
            { "x": 60.53, "y": 69.27 },
            { "x": 60.53, "y": 28.04 }
        ] 
    },
    TERZA_MEDIA: { 
        id: 'TERZA_MEDIA', 
        name: '3 Media', 
        view: AppView.RAINBOW_CITY_SCUOLA_MEDIA_3, 
        points: [
            { "x": 73.07, "y": 21.74 },
            { "x": 73.07, "y": 72.11 },
            { "x": 98.67, "y": 78.26 },
            { "x": 98.4, "y": 15.44 }
        ] 
    }
};

interface RainbowCityScuolaMediaProps {
    setView: (view: AppView) => void;
}

const RainbowCityScuolaMedia: React.FC<RainbowCityScuolaMediaProps> = ({ setView }) => {
    const [isNight, setIsNight] = useState(false);
    const [allLessons, setAllLessons] = useState<SchoolLesson[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SchoolLesson[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isPremiumActive, setIsPremiumActive] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [inReadingLessons, setInReadingLessons] = useState<LessonProgress[]>([]);
    const [isNotificationsExpanded, setIsNotificationsExpanded] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const premium = localStorage.getItem('is_premium_active') === 'true';
        setIsPremiumActive(premium);
        setInReadingLessons(getInReadingLessons());
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);

        const checkTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTimeInMinutes = hours * 60 + minutes;

            const nightStart = 20 * 60 + 15; // 20:15
            const nightEnd = 6 * 60 + 30;   // 06:30

            if (currentTimeInMinutes >= nightStart || currentTimeInMinutes < nightEnd) {
                setIsNight(true);
            } else {
                setIsNight(false);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000);

        // Load all lessons for search
        fetchAllMiddleSchoolLessons().then(lessons => {
            setAllLessons(lessons);
        });

        setInReadingLessons(getInReadingLessons());

        return () => clearInterval(interval);
    }, []);

    const normalizeText = (text: string) => {
        return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const handleSearch = () => {
        const query = normalizeText(searchQuery.trim());
        if (!query) return;

        setIsSearching(true);
        setShowResults(true);

        // Simulate a small delay for "searching" feel
        setTimeout(() => {
            const results = allLessons.filter(lesson => {
                const titleMatch = normalizeText(lesson.title).includes(query);
                const textMatch = normalizeText(lesson.text).includes(query);
                return titleMatch || textMatch;
            });

            // Sort results: titles first
            const sortedResults = results.sort((a, b) => {
                const aTitleMatch = normalizeText(a.title).includes(query);
                const bTitleMatch = normalizeText(b.title).includes(query);
                if (aTitleMatch && !bTitleMatch) return -1;
                if (!aTitleMatch && bTitleMatch) return 1;
                return 0;
            });

            setSearchResults(sortedResults);
            setIsSearching(false);
        }, 500);
    };

    const getClipPath = (pts: Point[]) => {
        if (!pts || pts.length < 3) return 'none';
        return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
    };

    const handleAreaClick = (area: AreaConfig) => {
        if (area.points.length < 3) return;
        setView(area.view);
    };

    const navigateToLesson = (lesson: SchoolLesson) => {
        if (lesson.isPremium && !isPremiumActive) {
            setShowPremiumModal(true);
            return;
        }

        const gradeView = GRADE_VIEWS[lesson.grade || 6];
        const subjectView = SUBJECT_VIEWS[lesson.subject || 'ITALIANO'];

        if (gradeView && subjectView) {
            sessionStorage.setItem('pending_subject', (lesson.subject || 'ITALIANO').toUpperCase());
            sessionStorage.setItem('pending_lesson_id', lesson.id);
            setView(gradeView);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden select-none">
            {/* Background Layer */}
            <img 
                src={isNight ? BG_NIGHT_URL : BG_URL} 
                alt="Scuola Media" 
                className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000"
            />

            {/* CLICKABLE AREAS */}
            {Object.values(DEFAULT_AREAS).map(area => (
                area.points.length >= 3 && (
                    <div 
                        key={area.id}
                        onClick={(e) => { e.stopPropagation(); handleAreaClick(area); }}
                        className="absolute inset-0 z-10 cursor-pointer transition-colors hover:bg-white/10"
                        style={{ clipPath: getClipPath(area.points) }}
                    />
                )
            ))}

            {/* UI CONTROLS */}
            <div className="absolute top-6 left-6 right-6 z-50 flex items-start gap-4 pointer-events-none">
                <button 
                    onClick={() => setView(AppView.RAINBOW_CITY)}
                    className="hover:scale-110 active:scale-95 transition-all outline-none pointer-events-auto shrink-0"
                >
                    <img src={BTN_BACK_URL} alt="Indietro" className="w-20 h-20 md:w-32 h-auto drop-shadow-2xl" />
                </button>

                {/* NOTIFICATIONS BOX */}
                {inReadingLessons.length > 0 && (
                    <motion.div 
                        layout
                        initial={false}
                        animate={{ height: isNotificationsExpanded ? 'auto' : 'auto' }}
                        className="flex-1 bg-white/40 backdrop-blur-md border-2 border-white/40 rounded-3xl p-4 shadow-xl animate-in slide-in-from-left-4 duration-500 pointer-events-auto cursor-pointer overflow-hidden"
                        onClick={() => setIsNotificationsExpanded(!isNotificationsExpanded)}
                    >
                        <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-2">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <h4 className="font-luckiest text-green-500 text-xs md:text-sm uppercase tracking-wider whitespace-nowrap">
                                    {isNotificationsExpanded ? 'Tutte le lezioni in corso:' : 'Continua a leggere:'}
                                </h4>
                                {inReadingLessons.length > 1 && !isNotificationsExpanded && (
                                    <span className="text-green-600 font-black text-xs md:text-sm">
                                        +{inReadingLessons.length - 1}
                                    </span>
                                )}
                            </div>
                            <motion.div
                                animate={{ rotate: isNotificationsExpanded ? 180 : 0 }}
                                className="text-green-500 shrink-0"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </motion.div>
                        </div>

                        <div className={`flex flex-col gap-4 ${isNotificationsExpanded ? 'max-h-[300px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                            {(isNotificationsExpanded ? inReadingLessons : [inReadingLessons[0]]).map(lesson => (
                                <div key={lesson.lessonId} className="flex flex-col min-w-0 py-1">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-red-600 font-black text-[10px] md:text-[11px] uppercase leading-none truncate">
                                            {lesson.subject} - {lesson.grade === 6 ? '1ª' : lesson.grade === 7 ? '2ª' : '3ª'} MEDIA
                                        </span>
                                        <span className="text-black font-black text-[10px] shrink-0">{Math.round(lesson.scrollPercentage)}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-black font-bold text-[11px] md:text-sm truncate drop-shadow-sm flex-1">{lesson.title}</span>
                                        <div className="w-16 md:w-24 h-2 bg-black/10 rounded-full overflow-hidden shrink-0 border border-black/5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${lesson.scrollPercentage}%` }}
                                                className="h-full bg-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* SEARCH BAR AT THE BOTTOM */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl flex items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-3xl border-2 border-white/30 shadow-2xl">
                <div className="relative flex-1">
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cerca una lezione..."
                        className="w-full bg-white/90 rounded-2xl px-6 py-3 md:py-4 text-blue-900 font-bold outline-none focus:ring-4 ring-blue-500/30 text-lg md:text-xl placeholder-blue-300"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>
                <button 
                    onClick={handleSearch}
                    className="hover:scale-110 active:scale-95 transition-all outline-none shrink-0"
                >
                    <img src={BTN_SEARCH_URL} alt="Cerca" className="w-20 h-20 md:w-28 h-auto drop-shadow-2xl" />
                </button>
            </div>

            {/* SEARCH RESULTS MODAL */}
            {showResults && (
                <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="bg-white/10 border-4 border-white/30 rounded-[3rem] w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl relative">
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowResults(false)}
                            className="absolute top-4 right-4 z-50 bg-red-500 text-white p-2 rounded-full border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>

                        <div className="p-8 md:p-12 pb-0 flex-1 flex flex-col overflow-hidden">
                            <h2 className="font-luckiest text-white text-xl md:text-3xl uppercase tracking-wider mb-4 mt-8 md:mt-4 drop-shadow-lg text-center">
                                Risultati per: <span className="text-yellow-400">"{searchQuery}"</span>
                            </h2>

                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                {isSearching ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-6">
                                        <Loader2 className="w-16 h-16 text-white animate-spin" />
                                        <p className="font-luckiest text-white text-2xl uppercase">Ricerca in corso...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-6 md:gap-10">
                                        {searchResults.map((lesson) => (
                                            <div 
                                                key={lesson.id}
                                                onClick={() => navigateToLesson(lesson)}
                                                className="flex flex-col md:flex-row items-center gap-4 md:gap-8 cursor-pointer transition-all hover:scale-105 active:scale-95 group"
                                            >
                                                <div className="relative w-24 h-24 md:w-36 md:h-36 shrink-0 flex items-center justify-center">
                                                    <img 
                                                        src={SUBJECT_ICONS[lesson.subject || 'ITALIANO'] || SUBJECT_ICONS['ITALIANO']} 
                                                        alt={lesson.subject} 
                                                        className="w-full h-full object-contain drop-shadow-2xl group-hover:rotate-6 transition-transform"
                                                    />
                                                    {lesson.isPremium && !isPremiumActive && (
                                                        <div className="absolute top-0 right-0 bg-white/90 rounded-full p-1 shadow-lg border border-slate-200">
                                                            <img src={PREMIUM_LOCK_IMG} alt="Locked" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 bg-yellow-400 text-blue-900 font-luckiest text-base md:text-3xl px-2 py-0.5 md:px-4 md:py-1 rounded-lg md:rounded-2xl border-2 md:border-4 border-white shadow-xl">
                                                        {lesson.grade === 6 ? '1ª' : lesson.grade === 7 ? '2ª' : '3ª'}
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="font-luckiest text-white text-base md:text-3xl uppercase leading-tight mb-1 md:mb-3 group-hover:text-yellow-300 transition-colors line-clamp-2">
                                                        {lesson.title}
                                                    </h3>
                                                    <p className="text-white/80 font-bold text-xs md:text-lg line-clamp-1">
                                                        {lesson.text.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                                        <div className="text-8xl">🔍</div>
                                        <p className="font-luckiest text-white text-3xl uppercase">Nessun risultato trovato</p>
                                        <p className="text-white/60 font-bold text-xl">Prova con un'altra parola!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PREMIUM BLOCKED MODAL */}
            {showPremiumModal && (
                <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-2xl p-6 animate-in fade-in duration-500">
                    <div className="bg-white/95 p-4 md:p-6 rounded-[2.5rem] border-8 border-yellow-400 shadow-2xl flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in duration-300">
                        <div className="w-full mb-3 flex justify-center">
                            <img 
                                src={PREMIUM_HEADER_IMG} 
                                alt="Contenuto Bloccato" 
                                className="w-full h-auto max-w-[140px] md:max-w-[180px] drop-shadow-md" 
                            />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-blue-900 uppercase mb-1 tracking-tighter leading-none">Contenuto Premium</h3>
                        <p className="text-gray-600 font-bold mb-4 text-xs md:text-base leading-snug">
                            Questa lezione è riservata agli abbonati di Lone Boo World! 👑 <br/> 
                            <span className="text-[10px] text-slate-400 mt-1 block">Chiedi a mamma o papà!</span>
                        </p>
                        <div className="flex gap-3 w-full justify-center">
                            <button 
                                onClick={() => setShowPremiumModal(false)} 
                                className="hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                                <img src={BTN_PREMIUM_BACK_IMG} alt="Torna Indietro" className="w-20 md:w-28 h-auto drop-shadow-lg" />
                            </button>
                            <button 
                                onClick={() => setView(AppView.PREMIUM_INFO)} 
                                className="hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                                <img src={BTN_PREMIUM_INFO_IMG} alt="Info" className="w-20 md:w-28 h-auto drop-shadow-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default RainbowCityScuolaMedia;
