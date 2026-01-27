
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
import { GraduationCap, Loader2, Star, Award, MessageCircle, CheckCircle2, TrendingUp, X } from 'lucide-react';

const DIARY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfdiarrde7659kj00u.webp';
const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const BTN_GO_LESSON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vaiallalezioneicone44ew2.webp';
const BTN_EVALUATION_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/valytazion3edediary44.webp';
const TEACHER_AVATAR = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/dffdfdfdfds+(1)9870.webp';

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
                    <div className="bg-blue-600 p-1.5 rounded-xl border-2 border-white shadow-md">
                        < GraduationCap className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-3xl font-luckiest text-blue-900 uppercase leading-none tracking-tight">Diario {grade}ª</h2>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsEvalOpen(true)}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                        title="Valutazione Maestra"
                    >
                        <img src={BTN_EVALUATION_IMG} alt="Valutazione" className="w-14 h-14 md:w-20 h-auto drop-shadow-lg" />
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
                                                src={BTN_GO_LESSON_IMG} 
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

            {/* MODALE VALUTAZIONE - Z-INDEX MASSIMO E LAYOUT ALLUNGATO */}
            {isEvalOpen && evaluationData && (
                <div className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-xl flex items-start justify-center p-4 animate-in fade-in duration-300" onClick={() => setIsEvalOpen(false)}>
                    <div 
                        className="bg-[#fdfcf0] w-full max-w-4xl rounded-[4rem] border-8 border-blue-500 shadow-2xl flex flex-col overflow-hidden relative mt-24 md:mt-32"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Tasto Chiudi */}
                        <button onClick={() => setIsEvalOpen(false)} className="absolute top-4 right-4 z-[3050] bg-red-500 text-white p-2 md:p-3 rounded-full border-4 border-black hover:scale-110 transition-all shadow-lg active:scale-95">
                            <X size={24} strokeWidth={4} />
                        </button>

                        {/* Header Modale */}
                        <div className="bg-blue-600 p-4 md:p-8 border-b-4 border-blue-800 flex items-center gap-4 shrink-0">
                            <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-2xl p-1 shadow-lg">
                                <img src={TEACHER_AVATAR} className="w-full h-full object-contain" alt="Maestra" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-luckiest text-xl md:text-5xl uppercase leading-none tracking-tight">La mia Pagella</h3>
                                <p className="text-blue-100 font-bold text-[8px] md:text-sm uppercase tracking-widest mt-1">I progressi della Scuola Arcobaleno</p>
                            </div>
                        </div>

                        {/* Corpo Modale - Layout Orizzontale Allungato */}
                        <div className="py-6 md:py-12 px-4 md:px-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-white/20 flex flex-col gap-6 md:gap-12">
                            
                            {/* GRIGLIA MATERIE - COMPATTA */}
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-6">
                                {Object.values(SchoolSubject).map(subj => {
                                    const stats = evaluationData.stats[subj];
                                    const perc = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
                                    
                                    return (
                                        <div key={subj} className="bg-white/90 p-2 md:p-4 rounded-3xl border-2 border-slate-200 shadow-sm flex flex-col items-center gap-1 md:gap-3 text-center">
                                            <img src={SUBJECT_ICONS[subj]} className="w-10 h-10 md:w-16 md:h-16 object-contain" alt="" />
                                            <div className="w-full">
                                                <span className="font-black text-[7px] md:text-[11px] uppercase text-slate-500 block mb-1 truncate">{subj}</span>
                                                <div className="w-full h-1.5 md:h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${perc}%` }}></div>
                                                </div>
                                                <span className="font-black text-blue-600 text-[8px] md:text-[12px] mt-1 block">{perc}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ZONA CENTRALE: COMMENTO + RECAP */}
                            <div className="flex flex-col md:flex-row gap-4 md:gap-12 items-stretch min-h-[140px] md:min-h-[220px]">
                                
                                {/* COMMENTO MAESTRA - Testo Aumentato */}
                                <div className="flex-1 relative bg-white p-5 md:p-8 rounded-[2.5rem] border-4 border-yellow-400 shadow-xl flex items-center gap-4 md:gap-8">
                                    <div className="absolute -top-3.5 left-8 bg-yellow-400 text-black px-4 py-1 rounded-full font-black text-[9px] md:text-[11px] uppercase shadow-md flex items-center gap-2">
                                        <MessageCircle size={14} fill="currentColor" /> Messaggio per te
                                    </div>
                                    
                                    <div className="w-16 h-16 md:w-32 md:h-32 shrink-0">
                                        <img src={TEACHER_AVATAR} className="w-full h-full object-contain drop-shadow-md" alt="" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-slate-700 font-bold text-sm md:text-2xl leading-snug italic">
                                            "{evaluationData.comment}"
                                        </p>
                                    </div>
                                </div>

                                {/* RECAP FINALE */}
                                <div className="flex flex-row md:flex-col justify-center gap-3 md:gap-5 shrink-0">
                                    <div className="flex-1 md:flex-none bg-blue-100 px-4 md:px-8 py-3 md:py-6 rounded-3xl border-2 border-blue-200 flex flex-col items-center shadow-sm justify-center">
                                        <span className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Svolte</span>
                                        <span className="text-xl md:text-4xl font-black text-blue-700 leading-none">{evaluationData.grandDone} / {evaluationData.grandTotal}</span>
                                    </div>
                                    <div className="flex-1 md:flex-none bg-green-100 px-4 md:px-8 py-3 md:py-6 rounded-3xl border-2 border-green-200 flex flex-col items-center shadow-sm justify-center">
                                        <span className="text-[8px] md:text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Media</span>
                                        <span className="text-xl md:text-4xl font-black text-green-700 leading-none">{Math.round(evaluationData.percentage)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Modale */}
                        <div className="bg-white p-3 md:p-6 border-t-4 border-slate-100 text-center opacity-40 shrink-0">
                            <span className="text-[8px] md:text-sm font-black uppercase tracking-[0.2em] text-slate-400"> Registro Scolastico Ufficiale • Lone Boo World </span>
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
