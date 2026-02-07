
import React, { useState, useMemo, useEffect } from 'react';
import { AppView, SchoolLesson } from '../types';
import { X, ChevronRight, BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
import CurriculumView from './CurriculumView';

const EXTRA_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/archivioarchivista5543.webp';
const EXTRA_BOOK_ICON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libroextralectionschool89.webp';
const EXTRA_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sflezionextra55gr3.webp';

const CATEGORIES = [
    "RELAZIONI ED EMOZIONI",
    "IDENTITÀ E CRESCITA PERSONALE",
    "ETICA QUOTIDIANA",
    "EDUCAZIONE CIVICA E SOCIALE",
    "DIGITALE E MONDO MODERNO",
    "CURA DEL MONDO E DEGLI ALTRI",
    "FILOSOFIA",
    "FOLKLORE, TRADIZIONI E CULTURA ITALIANA",
    "PERSONAGGI FAMOSI"
];

interface ExtraArgumentsViewProps {
    lessons: SchoolLesson[];
    onBack: () => void;
    setView: (view: AppView) => void;
}

const ExtraArgumentsView: React.FC<ExtraArgumentsViewProps> = ({ lessons, onBack, setView }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeLesson, setActiveLesson] = useState<SchoolLesson | null>(null);
    const [isDirectFromArchive, setIsDirectFromArchive] = useState(false);

    // Effetto per gestire l'apertura diretta dall'Archivio
    useEffect(() => {
        const pendingId = sessionStorage.getItem('pending_lesson_id');
        if (pendingId) {
            const found = lessons.find(l => l.id === pendingId);
            if (found) {
                // Trovata la lezione cercata: la impostiamo come attiva
                setActiveLesson(found);
                setSelectedCategory(found.subject || null);
                setIsDirectFromArchive(true); // Segniamo che veniamo dall'Archivio
                
                // IMPORTANTE: Puliamo subito la sessione affinché il click sul tasto Extra generico 
                // mostri l'indice e non questa lezione.
                sessionStorage.removeItem('pending_lesson_id');
            }
        }
    }, [lessons]);

    const filteredLessons = useMemo(() => {
        if (!selectedCategory) return [];
        return lessons.filter(l => l.subject?.toUpperCase() === selectedCategory.toUpperCase());
    }, [lessons, selectedCategory]);

    // Gestione chiusura lezione
    const handleExitLesson = () => {
        if (isDirectFromArchive) {
            // Se siamo entrati direttamente dall'archivio, torniamo all'archivio (tramite onBack del genitore)
            setIsDirectFromArchive(false);
            setActiveLesson(null);
            onBack();
        } else {
            // Altrimenti torniamo alla lista della categoria
            setActiveLesson(null);
        }
    };

    if (activeLesson) {
        // Struttura dati fittizia per il visualizzatore curriculum
        const mockData = {
            grade: 0,
            subjects: {
                [activeLesson.subject as any]: [{
                    id: 'extra_ch',
                    title: selectedCategory || 'Extra',
                    lessons: [activeLesson]
                }]
            }
        };

        return (
            <CurriculumView 
                data={mockData as any} 
                initialSubject={activeLesson.subject as any} 
                onExit={handleExitLesson} 
                bgUrl={EXTRA_LESSON_BG} 
                setView={setView}
                initialLesson={activeLesson}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .text-stroke-lucky { -webkit-text-stroke: 1.5px black; text-shadow: 2px 2px 0px rgba(0,0,0,0.5); }
            `}</style>

            <img src={EXTRA_BG} alt="" className="absolute inset-0 w-full h-full object-fill opacity-40 z-0" />

            {/* HEADER */}
            <div className="relative z-20 w-full pt-20 md:pt-28 px-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    {selectedCategory && (
                        <button onClick={() => setSelectedCategory(null)} className="bg-white/20 text-white p-2 rounded-full border-2 border-white/20 hover:bg-white/40 transition-all mr-2">
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <div className="bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border-2 border-white/20 shadow-xl">
                        <h2 className="text-white font-luckiest text-xl md:text-5xl uppercase tracking-widest leading-none" style={{ WebkitTextStroke: '1px black' }}>
                            {selectedCategory ? selectedCategory : "Argomenti Extra"}
                        </h2>
                    </div>
                </div>
                <button onClick={onBack} className="bg-red-500 text-white p-2 rounded-full border-4 border-white shadow-xl hover:scale-110 active:scale-95 transition-all ml-4">
                    <X size={24} strokeWidth={4} />
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pt-8">
                <div className="max-w-4xl mx-auto flex flex-col gap-4 pb-32">
                    
                    {!selectedCategory ? (
                        // VISTA 1: LISTA DELLE CATEGORIE
                        CATEGORIES.map(cat => {
                            const count = lessons.filter(l => l.subject?.toUpperCase() === cat).length;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className="w-full bg-white/10 backdrop-blur-xl p-5 md:p-8 rounded-[2.5rem] border-2 border-white/20 text-left flex items-center justify-between group hover:bg-white/20 transition-all active:scale-[0.99] shadow-xl"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 md:w-24 md:h-24 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <img src={EXTRA_BOOK_ICON} alt="" className="w-full h-full object-contain drop-shadow-lg" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-luckiest text-lg md:text-4xl uppercase leading-tight tracking-wide">{cat}</h3>
                                            <p className="text-white/40 font-bold text-[10px] md:text-sm mt-1 uppercase tracking-widest">{count} {count === 1 ? 'lezione disponibile' : 'lezioni disponibili'}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-white opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all" size={32} strokeWidth={3} />
                                </button>
                            );
                        })
                    ) : (
                        // VISTA 2: INDICE DELLE LEZIONI NELLA CATEGORIA
                        filteredLessons.length > 0 ? (
                            filteredLessons.map(lesson => (
                                <button
                                    key={lesson.id}
                                    onClick={() => setActiveLesson(lesson)}
                                    className="w-full bg-white/90 backdrop-blur-xl p-4 md:p-6 rounded-[2.5rem] border-4 border-white text-left flex items-center gap-4 md:gap-8 group hover:scale-[1.02] transition-all active:scale-[0.99] shadow-2xl"
                                >
                                    <div className="w-20 h-20 md:w-32 md:h-32 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                        {lesson.iconUrl ? (
                                            <img src={lesson.iconUrl} alt="" className="w-full h-full object-contain drop-shadow-md" />
                                        ) : (
                                            <img src={EXTRA_BOOK_ICON} alt="" className="w-[80%] h-[80%] object-contain opacity-50" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-blue-900 font-black text-lg md:text-4xl uppercase leading-tight tracking-tight">{lesson.title}</h3>
                                        <p className="text-blue-400 font-black text-[10px] md:text-base uppercase tracking-widest mt-1">Tocca per leggere la lezione</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in">
                                <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full flex items-center justify-center border-4 border-dashed border-white/20 mb-6">
                                    <Sparkles size={60} className="text-white/20" />
                                </div>
                                <h3 className="text-white font-black text-xl md:text-3xl uppercase opacity-50">Nessuna lezione ancora presente</h3>
                                <p className="text-white/40 font-bold mt-2">Stiamo preparando nuovi contenuti magici per questa categoria!</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExtraArgumentsView;
