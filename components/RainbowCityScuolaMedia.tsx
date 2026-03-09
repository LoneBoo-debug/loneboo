
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { AppView, SchoolLesson, LessonProgress } from '../types';
import { fetchAllMiddleSchoolLessons } from '../services/curriculumService';
import { getInReadingLessons } from '../services/progressService';
import { Search, X, Loader2, Check } from 'lucide-react';

const BG_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scuolamediaday.webp';
const BG_NIGHT_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/internoscuolanonight.webp';
const BTN_BACK_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tornacityrainbowse.webp';
const BTN_SEARCH_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_creami+un+pulsante+quadrato+st_485956893698539528+(1).webp';
const BTN_REOPEN_DISCLAIMER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/avvisodidatti55r3eco.webp';
const DISCLAIMER_ICON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tgf65rfdxzaq10oo0o.webp';

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
    const [showDisclaimer, setShowDisclaimer] = useState(() => {
        return localStorage.getItem('middle_school_disclaimer_accepted') !== 'true';
    });
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
        if (showDisclaimer) return;
        if (area.points.length < 3) return;
        setView(area.view);
    };

    const handleAcceptDisclaimer = () => {
        localStorage.setItem('middle_school_disclaimer_accepted', 'true');
        setShowDisclaimer(false);
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
        <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden select-none">
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
                <div className="flex flex-col gap-3 pointer-events-auto">
                    <button 
                        onClick={() => setView(AppView.RAINBOW_CITY)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none shrink-0"
                    >
                        <img src={BTN_BACK_URL} alt="Indietro" className="w-20 h-20 drop-shadow-2xl" />
                    </button>

                    <button 
                        onClick={() => setShowDisclaimer(true)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none w-20 h-20 shrink-0 animate-in slide-in-from-left duration-700"
                    >
                        <img src={BTN_REOPEN_DISCLAIMER_IMG} alt="Avviso Didattico" className="w-full h-auto drop-shadow-2xl" />
                    </button>
                </div>

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
                                <h4 className="font-luckiest text-green-500 text-xs uppercase tracking-wider whitespace-nowrap">
                                    {isNotificationsExpanded ? 'Tutte le lezioni in corso:' : 'Continua a leggere:'}
                                </h4>
                                {inReadingLessons.length > 1 && !isNotificationsExpanded && (
                                    <span className="text-green-600 font-black text-xs">
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
                                        <span className="text-red-600 font-black text-[10px] uppercase leading-none truncate">
                                            {lesson.subject} - {lesson.grade === 6 ? '1ª' : lesson.grade === 7 ? '2ª' : '3ª'} MEDIA
                                        </span>
                                        <span className="text-black font-black text-[10px] shrink-0">{Math.round(lesson.scrollPercentage)}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-black font-bold text-[11px] truncate drop-shadow-sm flex-1">{lesson.title}</span>
                                        <div className="w-16 h-2 bg-black/10 rounded-full overflow-hidden shrink-0 border border-black/5">
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
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md flex items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-3xl border-2 border-white/30 shadow-2xl">
                <div className="relative flex-1">
                    <input 
                        ref={searchInputRef}
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Cerca una lezione..."
                        className="w-full bg-white/90 rounded-2xl px-6 py-3 text-blue-900 font-bold outline-none focus:ring-4 ring-blue-500/30 text-lg placeholder-blue-300"
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
                    <img src={BTN_SEARCH_URL} alt="Cerca" className="w-20 h-20 drop-shadow-2xl" />
                </button>
            </div>

            {/* SEARCH RESULTS MODAL */}
            {showResults && (
                <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white/10 border-4 border-white/30 rounded-[3rem] w-full max-w-md h-[80vh] flex flex-col overflow-hidden shadow-2xl relative">
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowResults(false)}
                            className="absolute top-4 right-4 z-50 bg-red-500 text-white p-2 rounded-full border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>

                        <div className="p-8 pb-0 flex-1 flex flex-col overflow-hidden">
                            <h2 className="font-luckiest text-white text-xl uppercase tracking-wider mb-4 mt-8 drop-shadow-lg text-center">
                                Risultati per: <span className="text-yellow-400">"{searchQuery}"</span>
                            </h2>

                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                {isSearching ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-6">
                                        <Loader2 className="w-16 h-16 text-white animate-spin" />
                                        <p className="font-luckiest text-white text-2xl uppercase">Ricerca in corso...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="flex flex-col gap-6">
                                        {searchResults.map((lesson) => (
                                            <div 
                                                key={lesson.id}
                                                onClick={() => navigateToLesson(lesson)}
                                                className="flex flex-col items-center gap-4 cursor-pointer transition-all hover:scale-105 active:scale-95 group"
                                            >
                                                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                                    <img 
                                                        src={SUBJECT_ICONS[lesson.subject || 'ITALIANO'] || SUBJECT_ICONS['ITALIANO']} 
                                                        alt={lesson.subject} 
                                                        className="w-full h-full object-contain drop-shadow-2xl group-hover:rotate-6 transition-transform"
                                                    />
                                                    {lesson.isPremium && !isPremiumActive && (
                                                        <div className="absolute top-0 right-0 bg-white/90 rounded-full p-1 shadow-lg border border-slate-200">
                                                            <img src={PREMIUM_LOCK_IMG} alt="Locked" className="w-6 h-6 object-contain" />
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-1 -left-1 bg-yellow-400 text-blue-900 font-luckiest text-base px-2 py-0.5 rounded-lg border-2 border-white shadow-xl">
                                                        {lesson.grade === 6 ? '1ª' : lesson.grade === 7 ? '2ª' : '3ª'}
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center">
                                                    <h3 className="font-luckiest text-white text-base uppercase leading-tight mb-1 group-hover:text-yellow-300 transition-colors line-clamp-2">
                                                        {lesson.title}
                                                    </h3>
                                                    <p className="text-white/80 font-bold text-xs line-clamp-1">
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
                    <div className="bg-white/95 p-4 rounded-[2.5rem] border-8 border-yellow-400 shadow-2xl flex flex-col items-center text-center max-w-sm w-full animate-in zoom-in duration-300">
                        <div className="w-full mb-3 flex justify-center">
                            <img 
                                src={PREMIUM_HEADER_IMG} 
                                alt="Contenuto Bloccato" 
                                className="w-full h-auto max-w-[140px] drop-shadow-md" 
                            />
                        </div>
                        <h3 className="text-xl font-black text-blue-900 uppercase mb-1 tracking-tighter leading-none">Contenuto Premium</h3>
                        <p className="text-gray-600 font-bold mb-4 text-xs leading-snug">
                            Questa lezione è riservata agli abbonati di Lone Boo World! 👑 <br/> 
                            <span className="text-[10px] text-slate-400 mt-1 block">Chiedi a mamma o papà!</span>
                        </p>
                        <div className="flex gap-3 w-full justify-center">
                            <button 
                                onClick={() => setShowPremiumModal(false)} 
                                className="hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                                <img src={BTN_PREMIUM_BACK_IMG} alt="Torna Indietro" className="w-20 h-auto drop-shadow-lg" />
                            </button>
                            <button 
                                onClick={() => setView(AppView.PREMIUM_INFO)} 
                                className="hover:scale-110 active:scale-95 transition-all outline-none"
                            >
                                <img src={BTN_PREMIUM_INFO_IMG} alt="Info" className="w-20 h-auto drop-shadow-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- BOX DISCLAIMER OBBLIGATORIO --- */}
            {showDisclaimer && (
                <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] border-8 border-blue-600 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-w-md w-full animate-in zoom-in duration-500 relative max-h-[85vh] flex flex-col overflow-hidden">
                        
                        {/* Header Modale */}
                        <div className="flex items-center gap-4 mb-6 shrink-0 border-b-4 border-blue-50 pb-4">
                            <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                                <img src={DISCLAIMER_ICON_IMG} alt="Avviso" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h3 className="font-black text-blue-900 text-2xl uppercase tracking-tight leading-none">Avviso Didattico</h3>
                                <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mt-1">Leggere con attenzione</p>
                            </div>
                        </div>
                        
                        {/* Area Testo Scrollabile */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                            <section className="bg-slate-50 p-4 rounded-2xl border-l-8 border-blue-500">
                                <p className="text-slate-800 font-bold text-base leading-relaxed text-justify">
                                    Le lezioni sviluppate per gli alunni della Scuola Media di Città degli Arcobaleni, pur seguendo con attenzione le direttive ministeriali e i programmi ufficiali, sono realizzate con un approccio pedagogico innovativo. L’obiettivo principale non è limitarsi alla semplice trasmissione di nozioni o all’elencazione di concetti, numeri o liste, ma coinvolgere attivamente lo studente, stimolando la comprensione reale, il pensiero critico e la curiosità verso ogni materia.
                                </p>
                            </section>

                            <p className="text-slate-700 font-medium text-sm leading-relaxed text-justify px-2">
                                Ogni lezione è progettata affinché l’alunno possa vivere la conoscenza, integrando esempi concreti, curiosità, esperimenti pratici e narrazioni che rendono l’apprendimento più vicino all’esperienza quotidiana. L’uso di linguaggio chiaro, descrizioni narrative e connessioni tra concetti facilita la memorizzazione e la comprensione profonda dei contenuti scolastici.
                            </p>

                            <div className="bg-blue-600/5 p-4 rounded-2xl border-2 border-blue-100">
                                <p className="text-slate-800 font-bold text-sm leading-relaxed text-justify">
                                    Inoltre, le lezioni sono sviluppate sfruttando i più moderni strumenti e tecnologie digitali, incluse applicazioni avanzate di intelligenza artificiale, per arricchire i contenuti, suggerire esempi interattivi e proporre spiegazioni personalizzate. Questo approccio innovativo permette di creare materiali didattici più dinamici e coinvolgenti, pur mantenendo un alto standard qualitativo e autorevolezza scientifica.
                                </p>
                            </div>

                            <p className="text-slate-600 font-bold text-sm leading-relaxed text-justify px-2 border-l-4 border-slate-200">
                                È importante sottolineare, tuttavia, che nonostante l’impegno nella verifica e nell’aggiornamento dei contenuti, alcune informazioni potrebbero contenere piccole imprecisioni o variazioni rispetto alle fonti ufficiali. Pertanto, le lezioni non sostituiscono lo studio diretto in classe, l’approfondimento personale dei libri di testo, né il ruolo insostituibile del docente, che guida, chiarisce dubbi e accompagna l’alunno nel percorso di apprendimento.
                            </p>

                            <div className="bg-blue-600/5 p-4 rounded-2xl border-2 border-blue-100">
                                <p className="text-slate-800 font-bold text-sm leading-relaxed text-justify">
                                    Il materiale proposto ha quindi valore di integrazione e supporto, pensato per arricchire l’esperienza scolastica, stimolare la partecipazione e promuovere una maggiore autonomia nello studio. Invitiamo pertanto studenti, genitori e docenti a utilizzare le lezioni come strumento di approfondimento, confronto e pratica, valorizzando sempre il ruolo centrale della scuola, del docente e della sperimentazione pratica nella formazione completa degli alunni.
                                </p>
                            </div>

                            <section className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
                                <p className="text-slate-700 font-medium text-xs leading-relaxed text-justify italic">
                                    Le lezioni della Scuola Media di Città degli Arcobaleni rappresentano un equilibrio tra rigore didattico, approccio creativo e innovazione tecnologica, con l’obiettivo di rendere lo studio un’esperienza significativa, piacevole e realmente efficace, senza sostituirsi mai al percorso educativo formale in aula.
                                </p>
                            </section>
                        </div>

                        {/* Footer Pulsante */}
                        <div className="mt-8 pt-4 border-t-2 border-slate-100 shrink-0">
                            <button 
                                onClick={handleAcceptDisclaimer} 
                                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl border-b-8 border-blue-800 hover:brightness-110 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3 text-xl shadow-xl"
                            >
                                <Check size={28} strokeWidth={4} /> HO CAPITO
                            </button>
                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-widest">Responsabilità Didattica • Lone Boo World</p>
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
