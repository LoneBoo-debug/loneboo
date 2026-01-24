
import React, { useState, useEffect } from 'react';
import { AppView, SchoolSubject, GradeCurriculumData, SchoolLesson } from '../types';
import { OFFICIAL_LOGO } from '../constants';
import { getProgress } from '../services/tokens';
import { fetchGradeCurriculum } from '../services/curriculumService';
import { GRADE1_DATA } from '../services/curriculum/grade1';
import { GRADE2_DATA } from '../services/curriculum/grade2';
import { GRADE3_DATA } from '../services/curriculum/grade3';
import { GRADE4_DATA } from '../services/curriculum/grade4';
import { GRADE5_DATA } from '../services/curriculum/grade5';
import { GraduationCap, Loader2 } from 'lucide-react';

const DIARY_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfgirdinfeemoxion55f4300.webp';
const BTN_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const BTN_GO_LESSON_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/vaiallalezioneicone44ew2.webp';

// Nuove icone di stato
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

        // Listener per aggiornare il progresso in tempo reale quando vengono completati i quiz
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
                <button onClick={handleExit} className="hover:scale-110 active:scale-95 transition-all outline-none">
                    <img src={BTN_BACK_IMG} alt="Chiudi" className="w-14 h-14 md:w-20 h-auto drop-shadow-lg" />
                </button>
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
                                        {/* CAMPO QUIZ */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-[6px] md:text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Quiz</span>
                                            <img 
                                                src={getStatusIcon(hasQuizzes, quizDone)} 
                                                alt="" 
                                                className="w-5 h-5 md:w-8 md:h-8 object-contain drop-shadow-sm" 
                                            />
                                        </div>
                                        {/* CAMPO ATTIVITÀ */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-[6px] md:text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Attività</span>
                                            <img 
                                                src={getStatusIcon(hasActivities, actDone)} 
                                                alt="" 
                                                className="w-5 h-5 md:w-8 md:h-8 object-contain drop-shadow-sm" 
                                            />
                                        </div>

                                        {/* TASTO VAI ALLA LEZIONE */}
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

            {/* Footer Decor */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-20 pointer-events-none z-0">
                <img src={OFFICIAL_LOGO} alt="" className="w-10 h-10 object-contain grayscale" />
            </div>
        </div>
    );
};

export default SchoolDiaryView;
