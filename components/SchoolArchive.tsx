
import React, { useState, useEffect, useRef } from 'react';
import { AppView, SchoolLesson } from '../types';
import { SCHOOL_DATA_CSV_URL, OFFICIAL_LOGO } from '../constants';
import { X, Loader2, Send, AlertTriangle } from 'lucide-react';
import ExtraArgumentsView from './ExtraArgumentsView';

const ARCHIVE_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/archivioarchivista5543.webp';
const BTN_EXIT_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esciarchivio5r4r3e.webp';
const BTN_ASK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiediarchivio5r4r.webp';
const IMG_NOT_FOUND = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/argomentonotrovato43e3.webp';
const BTN_EXTRA_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/extraarguments99.webp';
const BOOK_EXTRA_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libroextralectionschool89.webp';
const DICTIONARY_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sonicontreaiconews.webp';
const MATH_EXERCISES_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esematerescds.webp';

// Asset Audio e Video
const ARCHIVE_AUDIO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/a77febf7-70a5-4800-a65d-c6b6ce1e6fe8.mp3';
const SECOND_AUDIO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/31d01b31-0cdf-4583-a9e4-b45cce93257c.mp3';
const BOO_TALK_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tmpzpu5rw91.mp4';

// Mappa Icone Libri
const SUBJECT_BOOK_ICONS: Record<string, string> = {
    'MATEMATICA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/metematicolibroicojd43w.webp',
    'ITALIANO': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/italianolibroico3e3.webp',
    'SCIENZE': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scienzelibroico44.webp',
    'STORIA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/storialibroiconr7h3.webp',
    'GEOGRAFIA': 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geogrfilibroico998.webp'
};

// Colori per i numeri delle classi
const GRADE_NUM_COLORS: Record<number, string> = {
    0: 'text-purple-600', // EX in viola per classe 0
    1: 'text-green-500',
    2: 'text-yellow-400',
    3: 'text-amber-900',
    4: 'text-blue-500',
    5: 'text-red-600'
};

const superNormalize = (text: string): string => {
    if (!text) return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/['’]/g, " ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
};

const parseCSV = (text: string): SchoolLesson[] => {
    const results: SchoolLesson[] = [];
    const cleanText = text.replace(/^\uFEFF/, ''); 
    
    let i = 0;
    let inQuotes = false;
    let currentCell = '';
    let currentRow: string[] = [];
    
    const separator = cleanText.includes(';') && !cleanText.includes(',') ? ';' : ',';

    const processRow = (row: string[]) => {
        if (row.length >= 5) {
            if (row[0].toLowerCase().includes('classe')) return;
            const gradeStr = row[0].trim();
            const grade = parseInt(gradeStr);
            if (!isNaN(grade) && grade >= 0 && grade <= 5) {
                const subject = (row[1] || '').trim().toUpperCase();
                const iconUrl = (row[2] || '').trim();
                const title = (row[3] || 'Senza Titolo').trim();
                const lessonText = (row[4] || '').trim();
                if (title !== 'Senza Titolo' && lessonText.length > 2) {
                    results.push({
                        grade,
                        subject,
                        iconUrl,
                        id: `dyn_${grade}_${subject}_${title}`.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
                        title,
                        text: lessonText,
                        audioUrl: (row[5] || '').trim(),
                        quizzes: [],
                        activities: []
                    });
                }
            }
        }
    };

    while (i < cleanText.length) {
        const char = cleanText[i];
        const nextChar = cleanText[i + 1];
        if (inQuotes) {
            if (char === '"') {
                if (nextChar === '"') { currentCell += '"'; i++; } 
                else { inQuotes = false; }
            } else { currentCell += char; }
        } else {
            if (char === '"') { inQuotes = true; } 
            else if (char === separator) { currentRow.push(currentCell); currentCell = ''; } 
            else if (char === '\n' || char === '\r') {
                if (char === '\r' && nextChar === '\n') i++;
                currentRow.push(currentCell);
                processRow(currentRow);
                currentRow = []; currentCell = '';
            } else { currentCell += char; }
        }
        i++;
    }
    if (currentCell !== '' || currentRow.length > 0) {
        currentRow.push(currentCell);
        processRow(currentRow);
    }
    return results;
};

const SchoolArchive: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const [allLessons, setAllLessons] = useState<SchoolLesson[]>([]);
    const [filteredResults, setFilteredResults] = useState<SchoolLesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [dbError, setDbError] = useState(false);
    const [query, setQuery] = useState('');
    const [manualInput, setManualInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [showExtraView, setShowExtraView] = useState(() => {
        const immediate = sessionStorage.getItem('show_extra_immediately');
        if (immediate === 'true') {
            sessionStorage.removeItem('show_extra_immediately');
            return true;
        }
        return false;
    });
    
    const [isAudioOn, setIsAudioOn] = useState(() => localStorage.getItem('loneboo_music_enabled') === 'true');
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const recognitionRef = useRef<any>(null);

    // CRITICO: Ref per bypassare la closure del SpeechRecognition
    const lessonsRef = useRef<SchoolLesson[]>([]);

    const loadData = async () => {
        setIsLoading(true);
        setDbError(false);
        try {
            const separator = SCHOOL_DATA_CSV_URL.includes('?') ? '&' : '?';
            const fetchUrl = `${SCHOOL_DATA_CSV_URL}${separator}t=${Date.now()}`;
            const res = await fetch(fetchUrl);
            if (res.ok) {
                const text = await res.text();
                if (text.trim().toLowerCase().startsWith('<!doctype')) { setDbError(true); return; }
                const data = parseCSV(text);
                if (data.length === 0) { 
                    setDbError(true); 
                } else { 
                    setAllLessons(data);
                    lessonsRef.current = data; // Sincronizziamo il ref
                }
            } else { setDbError(true); }
        } catch (e) { setDbError(true); } finally { setIsLoading(false); }
    };

    // Funzione di ricerca riutilizzabile che usa il ref se necessario
    const performSearch = (searchText: string) => {
        const cleanQuery = superNormalize(searchText);
        if (!cleanQuery) { 
            setFilteredResults([]); 
            setQuery(""); 
            return; 
        }

        setIsSearching(true);
        setQuery(searchText);

        setTimeout(() => {
            const words = cleanQuery.split(" ").filter(w => w.length > 0);
            // Usiamo il ref per essere sicuri di avere i dati più recenti nel callback vocale
            const sourceData = lessonsRef.current.length > 0 ? lessonsRef.current : allLessons;

            const results = sourceData
                .map(lesson => {
                    const normalizedTitle = superNormalize(lesson.title);
                    const normalizedText = superNormalize(lesson.text);
                    let score = 0;
                    if (words.every(w => normalizedTitle.includes(w))) score = 100;
                    else if (words.every(w => normalizedText.includes(w))) score = 50;
                    else if (words.some(w => normalizedTitle.includes(w))) score = 25;
                    return { lesson, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.lesson);

            setFilteredResults(results.slice(0, 40));
            setIsSearching(false);
        }, 350);
    };

    useEffect(() => {
        loadData();
        if (!audioRef.current) {
            audioRef.current = new Audio(ARCHIVE_AUDIO_URL);
            audioRef.current.loop = false;
            audioRef.current.volume = 0.5;
            audioRef.current.addEventListener('play', () => setIsPlaying(true));
            audioRef.current.addEventListener('pause', () => setIsPlaying(false));
            audioRef.current.addEventListener('ended', () => {
                if (audioRef.current?.src.includes('a77febf7-70a5-4800-a65d-c6b6ce1e6fe8')) {
                    audioRef.current.src = SECOND_AUDIO_URL;
                    audioRef.current.play().catch(() => {});
                } else {
                    setIsPlaying(false);
                    if (audioRef.current) { audioRef.current.src = ARCHIVE_AUDIO_URL; audioRef.current.currentTime = 0; }
                }
            });
        }
        if (isAudioOn) audioRef.current.play().catch(e => console.log("Autoplay blocked", e));

        const handleGlobalAudioChange = () => {
            const enabled = localStorage.getItem('loneboo_music_enabled') === 'true';
            setIsAudioOn(enabled);
            if (enabled) audioRef.current?.play().catch(() => {});
            else { 
                audioRef.current?.pause(); 
                if (audioRef.current) { audioRef.current.src = ARCHIVE_AUDIO_URL; audioRef.current.currentTime = 0; } 
            }
        };
        window.addEventListener('loneboo_audio_changed', handleGlobalAudioChange);

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'it-IT';
            recognition.interimResults = false;
            
            recognition.onstart = () => setIsListening(true);
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                // Chiamiamo performSearch invece di handleSearch per evitare closures stale
                performSearch(transcript);
            };
            recognition.onerror = (e: any) => {
                console.error("Speech Error:", e);
                setIsListening(false);
            };
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }

        return () => { 
            window.removeEventListener('loneboo_audio_changed', handleGlobalAudioChange); 
            if (audioRef.current) audioRef.current.pause(); 
        };
    }, []);

    const handleManualSearch = () => {
        if (manualInput.trim()) { 
            performSearch(manualInput);
            setManualInput(''); 
        }
    };

    const startListening = () => { 
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start(); 
        } else if (!recognitionRef.current) {
            alert("Il tuo browser non supporta la ricerca vocale.");
        }
    };

    const clearSearch = () => { setQuery(""); setFilteredResults([]); setManualInput(""); };

    const navigateToLesson = (lesson: SchoolLesson) => {
        if (lesson.grade === 0) {
            sessionStorage.setItem('pending_subject', (lesson.subject || 'FILOSOFIA').toUpperCase());
            sessionStorage.setItem('pending_lesson_id', lesson.id);
            setShowExtraView(true);
            return;
        }
        sessionStorage.setItem('pending_subject', (lesson.subject || 'ITALIANO').toUpperCase());
        sessionStorage.setItem('pending_lesson_id', lesson.id); 
        const targetMap: Record<number, AppView> = {
            1: AppView.SCHOOL_FIRST_GRADE, 2: AppView.SCHOOL_SECOND_GRADE, 3: AppView.SCHOOL_THIRD_GRADE, 
            4: AppView.SCHOOL_FOURTH_GRADE, 5: AppView.SCHOOL_FIFTH_GRADE
        };
        setView(targetMap[lesson.grade || 1] || AppView.SCHOOL_FIRST_FLOOR);
    };

    if (showExtraView) {
        return <ExtraArgumentsView lessons={allLessons.filter(l => l.grade === 0)} onBack={() => setShowExtraView(false)} setView={setView} />;
    }

    return (
        <div className="fixed inset-0 z-0 bg-slate-900 flex flex-col animate-in fade-in overflow-hidden">
            <style>{`
                .custom-scroll::-webkit-scrollbar { display: none; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .text-stroke-lucky { -webkit-text-stroke: 1.5px black; text-shadow: 2px 2px 0px rgba(0,0,0,0.5); }
                .text-stroke-lucky-small { -webkit-text-stroke: 1.2px black; text-shadow: 2px 2px 0px rgba(0,0,0,0.5); }
            `}</style>
            <div className="absolute inset-0 z-0"><img src={ARCHIVE_BG} alt="" className="w-full h-full object-fill select-none" /></div>
            {isAudioOn && isPlaying && (
                <div className="absolute top-20 md:top-28 left-4 z-[110] animate-in zoom-in duration-500">
                    <div className="relative bg-black/40 backdrop-blur-sm p-0 rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center w-28 h-28 md:w-52 md:h-52">
                        <video src={BOO_TALK_VIDEO} autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ mixBlendMode: 'screen', filter: 'contrast(1.1) brightness(1.1)' }} />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            )}

            {/* HEADER - OTTIMIZZATO PER SPAZIO ORIZZONTALE */}
            <div className="relative z-50 w-full pt-20 md:pt-28 px-4 md:px-12 flex justify-between items-start pointer-events-none">
                
                {/* SINISTRA: I TRE LIBRI */}
                <div className="flex flex-row items-end gap-1.5 md:gap-3 pointer-events-auto shrink-0">
                    {/* 1. LIBRO ESERCIZI MATEMATICA */}
                    <button 
                        onClick={() => setView(AppView.SCHOOL_MATH_EXERCISES)} 
                        className="hover:scale-110 active:scale-95 transition-all outline-none relative"
                    >
                        <img src={MATH_EXERCISES_ICON} alt="Esercizi Matematica" className="w-18 h-24 md:w-40 md:h-52 object-fill drop-shadow-[0_0_25px_rgba(255,255,255,0.9)]" />
                    </button>

                    {/* 2. DIZIONARIO */}
                    <button 
                        onClick={() => setView(AppView.SCHOOL_DICTIONARY)} 
                        className="hover:scale-110 active:scale-95 transition-all outline-none relative"
                    >
                        <img src={DICTIONARY_ICON} alt="Dizionario" className="w-18 h-24 md:w-40 md:h-52 object-fill drop-shadow-[0_0_25px_rgba(255,255,255,0.9)]" />
                    </button>

                    {/* 3. LIBRO EXTRA */}
                    <button 
                        onClick={() => { sessionStorage.removeItem('pending_lesson_id'); setShowExtraView(true); }} 
                        className="hover:scale-110 active:scale-95 transition-all outline-none relative group"
                    >
                        <img src={BOOK_EXTRA_ICON} alt="Extra" className="w-18 h-24 md:w-40 md:h-52 object-fill drop-shadow-[0_0_25px_rgba(255,255,255,0.9)]" />
                    </button>
                </div>

                {/* DESTRA: TASTO ESCI (TITOLO RIMOSSO) */}
                <div className="flex flex-col items-end gap-3 shrink-0 pointer-events-none">
                    <button 
                        onClick={() => setView(AppView.SCHOOL_SECOND_FLOOR)} 
                        className="hover:scale-110 active:scale-95 transition-all outline-none pointer-events-auto mr-4 md:mr-8"
                    >
                        <img src={BTN_EXIT_IMG} alt="Esci" className="w-16 h-16 md:w-28 drop-shadow-2xl" />
                    </button>
                </div>
            </div>

            {/* AREA RISULTATI RICERCA - CENTRATA E SU UNA RIGA */}
            {query && filteredResults.length > 0 && !isSearching && (
                <div className="relative z-[60] w-full mt-2 flex justify-center animate-in slide-in-from-top-4 duration-500 px-4">
                    <div className="bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border-2 border-white/20 shadow-2xl flex items-center gap-4 pointer-events-auto">
                        <p 
                            className="font-luckiest text-yellow-400 uppercase text-lg md:text-4xl whitespace-nowrap leading-none"
                            style={{ WebkitTextStroke: '1.5px black', textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}
                        >
                            Ho trovato questo...
                        </p>
                        <button 
                            onClick={clearSearch}
                            className="bg-red-500 text-white p-1 rounded-full border-2 border-white shadow-lg hover:scale-110 active:scale-95 transition-all"
                            title="Cancella ricerca"
                        >
                            <X size={14} strokeWidth={4} />
                        </button>
                    </div>
                </div>
            )}

            {/* AREA CONTENUTO */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scroll p-2 md:p-6 pt-2 md:pt-4 pb-48">
                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-white mb-4" size={48} />
                            <span className="text-white font-black uppercase">Caricamento Archivio...</span>
                        </div>
                    ) : dbError ? (
                        <div className="bg-red-500/80 backdrop-blur-md p-8 rounded-[3rem] border-4 border-white text-center animate-in zoom-in shadow-2xl">
                            <AlertTriangle className="text-white mx-auto mb-4" size={60} />
                            <h3 className="text-white font-black text-xl md:text-3xl uppercase">Errore Database</h3>
                            <p className="text-white font-bold mb-4">Impossibile leggere i dati. Controlla la connessione o prova a ricaricare la pagina.</p>
                            <button onClick={loadData} className="bg-white text-red-600 px-8 py-3 rounded-full font-black uppercase shadow-lg active:scale-95 transition-all">RIPROVA ORA</button>
                        </div>
                    ) : isSearching ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="animate-spin text-white mb-4" size={48} />
                            <span className="text-white font-black uppercase">Consulto l'enciclopedia...</span>
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 md:gap-6 animate-in fade-in duration-500">
                            {filteredResults.map((lesson) => {
                                const isExtra = lesson.grade === 0;
                                return (
                                <div key={lesson.id} onClick={() => navigateToLesson(lesson)} className="bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-[2.5rem] p-3 md:p-6 shadow-2xl cursor-pointer hover:bg-white/20 transition-all active:scale-[0.98] flex flex-col items-center gap-2 md:gap-4 group overflow-hidden">
                                    <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center shrink-0">
                                        <img src={isExtra ? BOOK_EXTRA_ICON : (SUBJECT_BOOK_ICONS[lesson.subject?.toUpperCase() || 'ITALIANO'] || SUBJECT_BOOK_ICONS['ITALIANO'])} alt={lesson.subject} className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform" />
                                        <div className={`absolute -bottom-2 -left-2 font-luckiest text-5xl md:text-8xl text-stroke-lucky ${GRADE_NUM_COLORS[lesson.grade || 0]}`}>{isExtra ? 'EX' : `${lesson.grade}ª`}</div>
                                    </div>
                                    <div className="w-full flex flex-col text-center">
                                        <h3 className="font-black text-white text-xs md:text-2xl uppercase tracking-tighter leading-tight group-hover:text-yellow-300 transition-colors mb-1 line-clamp-2 min-h-[2em] flex items-center justify-center">{lesson.title}</h3>
                                        <p className="text-white/60 font-bold text-[10px] md:text-lg line-clamp-2 leading-tight">{lesson.text.replace(/https?:\/\/\S+/gi, '').trim()}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    ) : query ? (
                        <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500 pt-1 pb-10">
                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-[3rem] border-4 border-white/20 shadow-2xl max-sm md:max-w-lg overflow-hidden relative">
                                <button 
                                    onClick={clearSearch}
                                    className="absolute top-4 right-4 z-50 bg-red-500 text-white p-2 rounded-full border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                                    title="Chiudi"
                                >
                                    <X size={20} strokeWidth={4} />
                                </button>
                                <img src={IMG_NOT_FOUND} alt="Argomento non trovato" className="w-full h-auto rounded-[2rem] shadow-inner" />
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="fixed bottom-6 left-6 z-[70] flex items-end gap-3 w-[90%] max-w-2xl animate-in slide-in-from-bottom duration-500">
                <div className="flex flex-col items-center shrink-0">
                    {isListening && (
                        <div className="bg-red-600 text-white px-4 py-1 rounded-full font-black uppercase text-[10px] animate-pulse border-2 border-white shadow-xl mb-2">Ti ascolto...</div>
                    )}
                    <button onClick={startListening} className={`hover:scale-110 active:scale-95 transition-all outline-none ${isListening ? 'animate-pulse' : ''}`}>
                        <img src={BTN_ASK_IMG} alt="Chiedi" className="w-20 md:w-36 h-auto drop-shadow-2xl" />
                    </button>
                </div>
                <div className="flex-1 flex gap-2 bg-white/30 backdrop-blur-xl p-2 rounded-2xl border-2 border-white/30 shadow-2xl mb-2 items-center">
                    <input type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()} placeholder="Cerca argomento..." className="flex-1 bg-white/80 rounded-xl px-4 py-2 text-blue-900 font-bold outline-none focus:ring-4 ring-blue-500/20 text-xs md:text-base placeholder-blue-300 h-10 md:h-12" />
                    <button onClick={handleManualSearch} disabled={!manualInput.trim()} className="bg-blue-600 text-white p-2 md:p-3 rounded-xl shadow-lg hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 shrink-0"><Send size={20} strokeWidth={3} /></button>
                </div>
            </div>
            {!query && !isSearching && !isLoading && !dbError && (
                <div className="fixed bottom-40 left-1/2 -translate-x-1/2 z-[60] w-[80%] max-w-lg pointer-events-none">
                    <div className="bg-white/10 backdrop-blur-md p-3 md:p-5 rounded-[2.5rem] border-4 border-white/20 text-center animate-in slide-in-from-bottom duration-700 shadow-2xl">
                        <p className="text-white font-luckiest text-lg md:text-3xl uppercase tracking-tighter leading-tight" style={{ WebkitTextStroke: '1px black' }}>Tocca il microfono <br className="md:hidden"/> o scrivi un argomento!</p>
                    </div>
                </div>
            )}
            <div className="absolute bottom-4 left-4 opacity-10 pointer-events-none"><img src={OFFICIAL_LOGO} className="w-8 h-8 grayscale" alt="" /></div>
        </div>
    );
};

export default SchoolArchive;
