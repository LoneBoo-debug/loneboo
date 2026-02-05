
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, SchoolSubject, GradeCurriculumData, SchoolLesson } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { getProgress } from '../services/tokens';
import { fetchGradeCurriculum } from '../services/curriculumService';
import { GRADE1_DATA } from '../services/curriculum/grade1';
import { GRADE2_DATA } from '../services/curriculum/grade2';
import { GRADE3_DATA } from '../services/curriculum/grade3';
import { GRADE4_DATA } from '../services/curriculum/grade4';
import { GRADE5_DATA } from '../services/curriculum/grade5';
import { Loader2, MessageCircle, X, Volume2, VolumeX, Play, Square, Star, Award, CheckCircle2 } from 'lucide-react';

const DIARY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfdiarrde7659kj00u.webp';
const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const BTN_GO_LESS = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vaiallalezioneicone44ew2.webp';
const BTN_EVALUATION_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/valytazion3edediary44.webp';
const PAGELLA_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/pagellaintest55r4xsw.webp';
const PAGELLA_MAESTRA_READING = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/estraorneleggepage3ws.webp';

// Mappa immagini Titoli Diari per classe
const DIARIO_TITLE_IMAGES: Record<number, string> = {
    1: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diario1ele1ele.webp',
    2: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diariesmateries45ele3ele+(1).webp',
    3: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diariesmateries45ele3ele+(2).png',
    4: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diariesmateries45ele3ele+(3).png',
    5: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/diariesmateries45ele3ele+(4).png'
};

// Icone di stato
const ICON_STATUS_TODO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quiznonfattimapresneu44+(1).webp';
const ICON_STATUS_DONE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quizfatto54hhr7h3.webp';
const ICON_STATUS_EMPTY = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/quizninskeinauns88sjwh7.webp';

// Mappa icone materie
const SUBJECT_ICONS: Record<SchoolSubject, string> = {
    [SchoolSubject.ITALIANO]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tabletteraulhhf44ed+(2).webp',
    [SchoolSubject.MATEMATICA]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tabletteraulhhf44ed+(3).webp',
    [SchoolSubject.STORIA]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tabletteraulhhf44ed+(5).webp',
    [SchoolSubject.GEOGRAFIA]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tabletteraulhhf44ed+(1).webp',
    [SchoolSubject.SCIENZE]: 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tabletteraulhhf44ed+(4).webp',
};

interface SchoolDiaryViewProps {
    setView: (view: AppView) => void;
}

const SchoolDiaryView: React.FC<SchoolDiaryViewProps> = ({ setView }) => {
    const [grade, setGrade] = useState<number>(1);
    const [curriculum, setCurriculum] = useState<GradeCurriculumData | null>(null);
    const [activeSubject, setActiveSubject] = useState<SchoolSubject>(SchoolSubject.ITALIANO);
    const [progress, setProgress] = useState(getProgress());
    const [isLoaded, setIsLoaded] = useState(false);
    const [isEvalOpen, setIsEvalOpen] = useState(false);

    useEffect(() => {
        const currentGrade = parseInt(sessionStorage.getItem('current_diary_grade') || '1');
        setGrade(currentGrade);

        const loadData = async () => {
            let baseData: GradeCurriculumData;
            switch(currentGrade) {
                case 1: baseData = GRADE1_DATA; break;
                case 2: baseData = GRADE2_DATA; break;
                case 3: baseData = GRADE3_DATA; break;
                case 4: baseData = GRADE4_DATA; break;
                case 5: baseData = GRADE5_DATA; break;
                default: baseData = GRADE1_DATA;
            }

            const dynamic = await fetchGradeCurriculum(currentGrade);
            if (dynamic) {
                const merged = { ...baseData };
                (Object.keys(dynamic.subjects) as SchoolSubject[]).forEach(s => {
                    if (dynamic.subjects[s].length > 0) merged.subjects[s] = dynamic.subjects[s];
                });
                setCurriculum(merged);
            } else {
                setCurriculum(baseData);
            }
            setIsLoaded(true);
        };

        loadData();

        const handleProgressUpdate = () => {
            setProgress(getProgress());
        };
        window.addEventListener('progressUpdated', handleProgressUpdate);
        return () => window.removeEventListener('progressUpdated', handleProgressUpdate);
    }, []);

    const handleExit = () => {
        const returnMap: Record<number, AppView> = {
            1: AppView.SCHOOL_FIRST_GRADE,
            2: AppView.SCHOOL_SECOND_GRADE,
            3: AppView.SCHOOL_THIRD_GRADE,
            4: AppView.SCHOOL_FOURTH_GRADE,
            5: AppView.SCHOOL_FIFTH_GRADE
        };
        setView(returnMap[grade] || AppView.SCHOOL_FIRST_FLOOR);
    };

    const handleLessonNavigate = (subject: SchoolSubject, lessonId: string) => {
        sessionStorage.setItem('pending_subject', subject);
        sessionStorage.setItem('pending_lesson_id', lessonId);
        
        const targetMap: Record<number, AppView> = {
            1: AppView.SCHOOL_FIRST_GRADE,
            2: AppView.SCHOOL_SECOND_GRADE,
            3: AppView.SCHOOL_THIRD_GRADE,
            4: AppView.SCHOOL_FOURTH_GRADE,
            5: AppView.SCHOOL_FIFTH_GRADE
        };
        setView(targetMap[grade] || AppView.SCHOOL_FIRST_FLOOR);
    };

    const isLessonQuizComplete = (lesson: SchoolLesson) => {
        if (!lesson.quizzes || lesson.quizzes.length === 0) return false;
        const done = progress.completedQuizzes?.[lesson.id] || [];
        const target = Math.min(3, lesson.quizzes.length);
        return done.filter(Boolean).length >= target;
    };

    const isLessonActivityComplete = (lesson: SchoolLesson) => {
        if (!lesson.activities || lesson.activities.length === 0) return false;
        const done = progress.completedActivities?.[lesson.id] || [];
        const target = Math.min(2, lesson.activities.length);
        return done.filter(Boolean).length >= target;
    };

    const getStatusIcon = (hasContent: boolean, isComplete: boolean) => {
        if (!hasContent) return ICON_STATUS_EMPTY;
        return isComplete ? ICON_STATUS_DONE : ICON_STATUS_TODO;
    };

    // LOGICA PAGELLA
    const evaluationData = useMemo(() => {
        if (!curriculum) return null;
        
        const stats: Record<SchoolSubject, { total: number, done: number }> = {} as any;
        let grandTotal = 0;
        let grandDone = 0;

        Object.values(SchoolSubject).forEach(subj => {
            const lessons = curriculum.subjects[subj].flatMap(ch => ch.lessons);
            let subjTotal = 0;
            let subjDone = 0;

            lessons.forEach(l => {
                if (l.quizzes && l.quizzes.length > 0) {
                    subjTotal++;
                    if (isLessonQuizComplete(l)) subjDone++;
                }
                if (l.activities && l.activities.length > 0) {
                    subjTotal++;
                    if (isLessonActivityComplete(l)) subjDone++;
                }
            });

            stats[subj] = { total: subjTotal, done: subjDone };
            grandTotal += subjTotal;
            grandDone += subjDone;
        });

        const percentage = grandTotal > 0 ? (grandDone / grandTotal) * 100 : 0;
        
        let comment = "";
        if (percentage === 0) {
            comment = "Ciao tesoro! Vedo che il tuo diario è ancora tutto da scrivere. Sono sicura che sei un bambino molto curioso! Proviamo a fare il primo esercizio? ✨";
        } else if (percentage < 30) {
            comment = "Ben fatto! Hai mosso i primi passi. Ricorda che ogni grande scrittore ha iniziato proprio come te. Continua così, diventerai bravissimo! Forza! 🍎";
        } else if (percentage < 70) {
            comment = "Splendido lavoro! Stai diventando un vero esperto. Mi piace moltissimo come ti impegni nelle attività. Continua a studiare con questa gioia! 🌟";
        } else if (percentage < 100) {
            comment = "Sei quasi al traguardo, che meraviglia! I tuoi risultati sono eccellenti e dimostrano che sei un alunno attento e volenteroso. Manca pochissimo! 🎈";
        } else {
            comment = "INCREDIBILE! Hai completato ogni singola sfida! Sei un vero campione e hai dimostrato un impegno straordinario. Bravissimo! 🏆✨";
        }

        return { stats, grandTotal, grandDone, percentage, comment };
    }, [curriculum, progress]);

    return (
        <div className="fixed inset-0 z-0 bg-sky-100 flex flex-col pt-[64px] md:pt-[96px] overflow-hidden">
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-50">
                <img src={DIARY_BG} alt="" className="w-full h-full object-cover blur-sm" />
            </div>

            {/* Header Pagina */}
            <div className="relative z-20 w-full p-3 md:p-4 flex justify-between items-center bg-white/70 backdrop-blur-md border-b-4 border-white/30 shrink-0">
                <div className="flex items-center gap-2">
                    <img 
                        src={DIARIO_TITLE_IMAGES[grade] || DIARIO_TITLE_IMAGES[1]} 
                        alt={`Diario ${grade}ª`} 
                        className="h-14 md:h-22 w-auto drop-shadow-lg" 
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsEvalOpen(true)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Valutazione Maestra"
                    >
                        <img src={BTN_EVALUATION_IMG} alt="Valutazione" className="w-12 h-12 md:w-16 h-auto drop-shadow-lg" />
                    </button>

                    <button onClick={handleExit} className="hover:scale-110 active:scale-95 transition-all outline-none">
                        <img src={BTN_BACK_IMG} alt="Chiudi" className="w-14 h-14 md:w-20 h-auto drop-shadow-lg" />
                    </button>
                </div>
            </div>

            {/* TABS MATERIE */}
            <div className="relative z-20 p-4 grid grid-cols-5 w-full shrink-0 gap-3 items-center">
                {Object.values(SchoolSubject).map((subj) => {
                    const isActive = activeSubject === subj;
                    return (
                        <button
                            key={subj}
                            onClick={() => setActiveSubject(subj)}
                            className={`transition-all duration-300 outline-none flex items-center justify-center ${isActive ? 'scale-125 z-10' : 'scale-110 hover:scale-115'}`}
                        >
                            <img 
                                src={SUBJECT_ICONS[subj]} 
                                alt={subj} 
                                className="w-full h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]" 
                            />
                        </button>
                    );
                })}
            </div>

            {/* LISTA LEZIONI */}
            <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-3 md:p-6">
                <div className="max-w-4xl mx-auto pb-24 space-y-3">
                    {!curriculum ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                            <span className="font-black uppercase tracking-widest text-xs">Caricamento...</span>
                        </div>
                    ) : (
                        curriculum.subjects[activeSubject].flatMap(chapter => chapter.lessons).map((lesson) => {
                            const hasQuizzes = lesson.quizzes && lesson.quizzes.length > 0;
                            const hasActivities = lesson.activities && lesson.activities.length > 0;
                            const quizDone = isLessonQuizComplete(lesson);
                            const actDone = isLessonActivityComplete(lesson);

                            return (
                                <div 
                                    key={lesson.id} 
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-md transition-all"
                                >
                                    <span className="font-bold text-slate-800 text-base md:text-3xl leading-tight truncate mr-4">
                                        {lesson.title}
                                    </span>
                                    
                                    <div className="flex items-center gap-4 md:gap-8 shrink-0">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[6px] md:text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Quiz</span>
                                            <img 
                                                src={getStatusIcon(hasQuizzes, quizDone)} 
                                                alt="" 
                                                className="w-5 h-5 md:w-8 md:h-8 object-contain drop-shadow-sm" 
                                            />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[6px] md:text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Attività</span>
                                            <img 
                                                src={getStatusIcon(hasActivities, actDone)} 
                                                alt="" 
                                                className="w-5 h-5 md:w-8 md:h-8 object-contain drop-shadow-sm" 
                                            />
                                        </div>

                                        <button 
                                            onClick={() => handleLessonNavigate(activeSubject, lesson.id)}
                                            className="ml-2 hover:scale-110 active:scale-95 transition-all outline-none shrink-0"
                                            title="Vai alla lezione"
                                        >
                                            <img 
                                                src="https://loneboo-images.s3.eu-south-1.amazonaws.com/vaiallalezioneicone44ew2.webp" 
                                                alt="Vai" 
                                                className="w-9 h-9 md:w-14 h-auto drop-shadow-md" 
                                            />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* MODALE VALUTAZIONE - LAYOUT RESTRUTTURATO E ABBASSATO */}
            {isEvalOpen && evaluationData && (
                <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setIsEvalOpen(false)}>
                    <div 
                        className="bg-[#fdfcf0] w-full max-w-4xl max-h-[85vh] rounded-[3rem] border-8 border-blue-500 shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in duration-300 transform translate-y-6"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Tasto Chiudi */}
                        <button onClick={() => setIsEvalOpen(false)} className="absolute top-4 right-4 z-[3050] bg-red-500 text-white p-2 md:p-3 rounded-full border-4 border-black hover:scale-110 transition-all shadow-lg active:scale-95">
                            <X size={20} strokeWidth={4} />
                        </button>

                        {/* Header Modale */}
                        <div className="bg-blue-600 p-4 md:p-6 border-b-4 border-blue-800 flex items-center gap-4 shrink-0">
                            <div className="w-12 h-12 md:w-20 md:h-20 shrink-0">
                                <img src={PAGELLA_HEADER_IMG} className="w-full h-full object-contain" alt="Maestra" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-luckiest text-xl md:text-5xl uppercase leading-none tracking-tight">La mia Pagella</h3>
                                <p className="text-blue-100 font-bold text-[8px] md:text-sm uppercase tracking-widest mt-1">I miei progressi nel diario</p>
                            </div>
                        </div>

                        {/* Corpo Modale - Scrollabile */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-white/20">
                            <div className="flex flex-col gap-8">
                                
                                {/* 1. BOX MESSAGGIO MAESTRA (TOP - FISSO) */}
                                <div className="relative bg-[#fffde7] p-5 md:p-10 rounded-[2.5rem] border-4 border-yellow-400 shadow-xl flex flex-row items-center text-left gap-6 md:gap-10">
                                    {/* BADGE AGGIORNATO */}
                                    <div className="absolute -top-3 left-6 md:left-12 bg-yellow-400 text-black px-4 py-1 rounded-full font-black text-[10px] md:text-xs uppercase shadow-md whitespace-nowrap z-10 border-2 border-black/10">
                                        La Maestra Ornella dice...
                                    </div>
                                    
                                    <div className="w-32 h-32 md:w-60 md:h-60 shrink-0">
                                        <img 
                                            src={PAGELLA_MAESTRA_READING} 
                                            className="w-full h-full object-contain drop-shadow-2xl" 
                                            alt="Maestra Ornella" 
                                        />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <p className="text-slate-800 font-black text-sm md:text-3xl leading-snug italic">
                                            "{evaluationData.comment}"
                                        </p>
                                    </div>
                                </div>

                                {/* 2. BOX RIEPILOGO */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-3xl border-4 border-blue-400 shadow-lg flex flex-col items-center justify-center text-center">
                                        <CheckCircle2 className="text-blue-500 mb-1" size={32} />
                                        <span className="text-[10px] md:text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Attività Svolte</span>
                                        <span className="text-2xl md:text-5xl font-black text-blue-700 leading-none">{evaluationData.grandDone} / {evaluationData.grandTotal}</span>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-3xl border-4 border-green-400 shadow-lg flex flex-col items-center justify-center text-center">
                                        <Star className="text-green-500 mb-1" size={32} />
                                        <span className="text-[10px] md:text-xs font-black text-green-400 uppercase tracking-widest mb-1">Media Totale</span>
                                        <span className="text-2xl md:text-5xl font-black text-green-700 leading-none">{Math.round(evaluationData.percentage)}%</span>
                                    </div>
                                </div>

                                {/* 3. ELENCO MATERIE */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 mb-2 px-2">
                                        <Award className="text-blue-600" size={32} />
                                        <h4 className="text-blue-900 font-black text-xs md:text-lg uppercase tracking-widest">Dettaglio per Materia</h4>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {Object.values(SchoolSubject).map(subj => {
                                            const stats = evaluationData.stats[subj];
                                            const perc = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
                                            
                                            return (
                                                <div key={subj} className="bg-white/80 p-3 md:p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center gap-4 group transition-all hover:border-blue-300">
                                                    <div className="w-10 h-10 md:w-16 md:h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
                                                        <img src={SUBJECT_ICONS[subj]} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt="" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <span className="font-black text-[10px] md:text-sm uppercase text-slate-800 truncate">{subj}</span>
                                                            <span className="font-black text-blue-600 text-[10px] md:text-sm">{perc}%</span>
                                                        </div>
                                                        <div className="w-full h-2.5 md:h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                            <div 
                                                                className="h-full bg-blue-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                                                                style={{ width: `${perc}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        {/* Footer Modale */}
                        <div className="bg-slate-50 p-2 md:p-4 border-t border-slate-200 shrink-0 text-center">
                            <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Lone Boo World • Scuola Arcobaleno 2025</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Decor */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-20 pointer-events-none z-0">
                <img src={OFFICIAL_LOGO} alt="" className="w-10 h-10 object-contain grayscale" />
            </div>
        </div>
    );
};

export default SchoolDiaryView;
