
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Clock, Circle } from 'lucide-react';
import { getMedieProgress, getSubjectProgress } from '../services/progressService';
import { fetchAllMiddleSchoolLessons } from '../services/curriculumService';
import { SchoolLesson, LessonStatus, SchoolSubject } from '../types';

const REGISTER_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/Hailuo_Image_creami+una+immagine+nello+stil_485990668612460550.webp';

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

interface StudyRegisterProps {
    isOpen: boolean;
    onClose: () => void;
    grade: number;
}

const StudyRegister: React.FC<StudyRegisterProps> = ({ isOpen, onClose, grade }) => {
    const [allLessons, setAllLessons] = useState<SchoolLesson[]>([]);
    const [loading, setLoading] = useState(true);
    const progress = getMedieProgress();

    useEffect(() => {
        const load = async () => {
            const data = await fetchAllMiddleSchoolLessons();
            setAllLessons(data);
            setLoading(false);
        };
        if (isOpen) load();
    }, [isOpen]);

    const subjects = [
        SchoolSubject.ITALIANO,
        SchoolSubject.MATEMATICA,
        SchoolSubject.STORIA,
        SchoolSubject.GEOGRAFIA,
        SchoolSubject.SCIENZE,
        SchoolSubject.INGLESE,
        SchoolSubject.ARTE,
        SchoolSubject.TECNOLOGIA,
        SchoolSubject.INFORMATICA,
        SchoolSubject.CIVICA,
        SchoolSubject.MOTORIA
    ];

    const getStatusIcon = (status: LessonStatus) => {
        switch (status) {
            case LessonStatus.LETTO:
                return <CheckCircle2 className="text-green-500 w-4 h-4" />;
            case LessonStatus.IN_LETTURA:
                return <Clock className="text-yellow-500 w-4 h-4" />;
            default:
                return <Circle className="text-slate-300 w-4 h-4" />;
        }
    };

    const getGradeLabel = (g: number) => {
        if (g === 6) return '1ª MEDIA';
        if (g === 7) return '2ª MEDIA';
        if (g === 8) return '3ª MEDIA';
        return '';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-2 md:p-8"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2rem] md:rounded-[3rem] border-4 md:border-8 border-blue-400 shadow-2xl w-full max-w-5xl h-[95vh] md:h-[90vh] flex flex-col overflow-hidden relative"
                    >
                        {/* HEADER - COMPACT */}
                        <div className="bg-blue-400 p-3 md:p-4 flex items-center justify-center relative shrink-0">
                            <button 
                                onClick={onClose}
                                className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/20 hover:bg-white/40 text-white p-1 md:p-2 rounded-full transition-colors z-50"
                            >
                                <X size={24} className="md:w-8 md:h-8" />
                            </button>
                            
                            <div className="flex items-center gap-3">
                                <img src={REGISTER_HEADER_IMG} alt="Registro" className="w-12 h-12 md:w-16 md:h-16 object-contain drop-shadow-lg" />
                                <h2 className="font-luckiest text-white text-xl md:text-3xl uppercase tracking-wider drop-shadow-md">
                                    Registro di Studio - {getGradeLabel(grade)}
                                </h2>
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 overflow-y-auto p-3 md:p-6 bg-slate-50">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {subjects.map(subject => {
                                        const subjectLessons = allLessons.filter(l => l.grade === grade && l.subject === subject);
                                        if (subjectLessons.length === 0) return null;
                                        
                                        const subjectProgress = getSubjectProgress(grade, subject, subjectLessons.length);
                                        const icon = SUBJECT_ICONS[subject];

                                        return (
                                            <div key={subject} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-slate-200 flex flex-col h-fit">
                                                <div className="flex items-center gap-2 mb-3">
                                                    {icon && <img src={icon} alt={subject} className="w-8 h-8 md:w-10 md:h-10 object-contain" />}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-luckiest text-blue-600 text-lg md:text-xl uppercase truncate leading-none">{subject}</h3>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase">{subjectProgress}% COMPLETATO</div>
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 flex-1 pr-1">
                                                    {subjectLessons.map(lesson => {
                                                        const lessonProgress = progress[lesson.id];
                                                        const status = lessonProgress?.status || LessonStatus.NON_LETTO;
                                                        
                                                        return (
                                                            <div key={lesson.id} className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                                                <div className="shrink-0">{getStatusIcon(status)}</div>
                                                                <span className="font-bold text-slate-700 truncate text-[11px] md:text-xs flex-1">{lesson.title}</span>
                                                                {status === LessonStatus.IN_LETTURA && (
                                                                    <span className="text-[8px] font-black text-yellow-600 bg-yellow-100 px-1 rounded uppercase">In corso</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* PROGRESS BAR - COMPACT */}
                                                <div className="mt-3 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${subjectProgress}%` }}
                                                        className="h-full bg-blue-500 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StudyRegister;
