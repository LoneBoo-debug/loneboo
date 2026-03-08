
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppView, SchoolLesson, SchoolSubject } from '../types';
import { fetchMiddleSchoolCurriculum } from '../services/curriculumService';
import { Loader2, ChevronLeft, X, Info } from 'lucide-react';
import { updateMedieProgress } from '../services/progressService';

const BTN_BACK_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiduilibromediepage.webp';
const BTN_SOMMARIO_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sommariotastomedie.webp';
const BTN_VERIFICA_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/verificatasterde33.webp';

const CORRECT_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/11l-victory_trumpet-1749704498589-358767.mp3';
const WRONG_SOUND_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/cartoon-fail-trumpet-278822.mp3';

// PREMIUM ASSETS
const PREMIUM_LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libercloased44fx33.webp';
const PREMIUM_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libercloased44fx33.webp';
const BTN_PREMIUM_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/returncloded44fx332.webp';
const BTN_PREMIUM_INFO_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/infoblocked44fx33.webp';

interface MedieSubjectPageProps {
    bgUrl: string;
    setView: (view: AppView) => void;
    backView: AppView;
    grade: number;
    subject: SchoolSubject;
}

const MedieSubjectPage: React.FC<MedieSubjectPageProps> = ({ bgUrl, setView, backView, grade, subject }) => {
    const [lessons, setLessons] = useState<SchoolLesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<SchoolLesson | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [isPremiumActive, setIsPremiumActive] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const premium = localStorage.getItem('is_premium_active') === 'true';
        setIsPremiumActive(premium);
    }, []);

    const handleScroll = () => {
        if (!scrollRef.current || !selectedLesson) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        updateMedieProgress(
            selectedLesson.id,
            selectedLesson.grade || 0,
            selectedLesson.subject || '',
            selectedLesson.title,
            scrollPercentage
        );
    };

    useEffect(() => {
        if (selectedLesson) {
            // Initial mark as "In Lettura"
            updateMedieProgress(
                selectedLesson.id,
                selectedLesson.grade || 0,
                selectedLesson.subject || '',
                selectedLesson.title,
                0
            );
        }
    }, [selectedLesson]);

    useEffect(() => {
        const loadLessons = async () => {
            setLoading(true);
            const data = await fetchMiddleSchoolCurriculum(grade, subject);
            setLessons(data);
            setLoading(false);

            // Handle auto-selection from search results
            const pendingLessonId = sessionStorage.getItem('pending_lesson_id');
            if (pendingLessonId) {
                const lesson = data.find(l => l.id === pendingLessonId);
                if (lesson) {
                    if (lesson.isPremium && !isPremiumActive) {
                        setShowPremiumModal(true);
                    } else {
                        setSelectedLesson(lesson);
                    }
                }
                // Clear pending data so it doesn't trigger again
                sessionStorage.removeItem('pending_lesson_id');
                sessionStorage.removeItem('pending_subject');
            }
        };
        loadLessons();
    }, [grade, subject]);

    const handleLessonClick = (lesson: SchoolLesson) => {
        if (lesson.isPremium && !isPremiumActive) {
            setShowPremiumModal(true);
        } else {
            setSelectedLesson(lesson);
            setShowQuizModal(false);
            setCurrentQuizIndex(0);
            setQuizFeedback(null);
            setIsQuizFinished(false);
        }
    };

    const handleQuizAnswer = (optionIndex: number) => {
        if (!selectedLesson || quizFeedback) return;
        
        setSelectedOptionIndex(optionIndex);
        const quiz = selectedLesson.quizzes[currentQuizIndex];
        const isCorrect = optionIndex === quiz.correctIndex;
        
        const audio = new Audio(isCorrect ? CORRECT_SOUND_URL : WRONG_SOUND_URL);
        audio.play().catch(e => console.log("Audio play blocked", e));

        if (isCorrect) {
            setQuizFeedback(quiz.feedback || "Bravissimo! ✨");
        } else {
            setQuizFeedback("Ops! Riprova... 🧐");
        }
    };

    const handleNextQuiz = () => {
        if (!selectedLesson) return;
        
        if (currentQuizIndex < selectedLesson.quizzes.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
            setQuizFeedback(null);
            setSelectedOptionIndex(null);
        } else {
            setIsQuizFinished(true);
        }
    };

    const handleRetryQuestion = () => {
        setQuizFeedback(null);
        setSelectedOptionIndex(null);
    };

    const getVictoryImage = () => {
        switch (subject) {
            case SchoolSubject.ITALIANO:
            case SchoolSubject.INGLESE:
                return 'https://loneboo-images.s3.eu-south-1.amazonaws.com/utaridemaesrt33.webp';
            case SchoolSubject.STORIA:
            case SchoolSubject.GEOGRAFIA:
                return 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sroriaridemae322w.webp';
            case SchoolSubject.MATEMATICA:
            case SchoolSubject.SCIENZE:
                return 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scienzeridemaesr32.webp';
            case SchoolSubject.ARTE:
            case SchoolSubject.TECNOLOGIA:
                return 'https://loneboo-images.s3.eu-south-1.amazonaws.com/tecnoridemaese32w1.webp';
            case SchoolSubject.CIVICA:
            case SchoolSubject.MOTORIA:
                return 'https://loneboo-images.s3.eu-south-1.amazonaws.com/civiride32ws.webp';
            case SchoolSubject.ESPERIMENTI:
            case SchoolSubject.INFORMATICA:
                return 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esperide43ew.webp';
            default:
                return null;
        }
    };

    const isImageUrl = (text: string) => {
        if (!text) return false;
        const trimmed = text.trim();
        return trimmed.startsWith('http') && (
            trimmed.endsWith('.webp') || 
            trimmed.endsWith('.jpg') || 
            trimmed.endsWith('.jpeg') || 
            trimmed.endsWith('.png') || 
            trimmed.endsWith('.gif') ||
            trimmed.includes('loneboo-images.s3')
        );
    };

    const renderMixedContent = (text: string) => {
        const imgRegex = /(https?:\/\/\S+\.(?:webp|jpg|jpeg|png|gif)(?:\?\S*)?|https?:\/\/loneboo-images\.s3\.eu-south-1\.amazonaws.com\/\S+)/gi;
        const parts = text.split(imgRegex);
        
        return parts.map((part, index) => {
            if (isImageUrl(part) || (part && part.includes('loneboo-images.s3.eu-south-1.amazonaws.com'))) {
                const url = part.trim();
                return (
                    <div key={index} className="w-full flex justify-center my-6">
                        <img 
                            src={url} 
                            alt="Immagine Lezione" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setZoomedImage(url);
                            }}
                            className="max-w-[90%] md:max-w-[70%] h-auto rounded-3xl border-8 border-white shadow-2xl cursor-zoom-in hover:scale-[1.02] transition-transform pointer-events-auto" 
                        />
                    </div>
                );
            }
            if (part.trim() === '') return null;
            return (
                <div key={index} className="font-sans font-bold text-slate-800 text-base md:text-2xl leading-relaxed whitespace-pre-wrap px-4">
                    {part}
                </div>
            );
        });
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden">
            <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={bgUrl} 
                alt="Subject Background" 
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="relative z-10 w-full h-full flex flex-col items-center pt-36 md:pt-56 pb-6 px-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-4"
                        >
                            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                            <span className="text-blue-800 font-black text-2xl uppercase tracking-widest">Caricamento lezioni...</span>
                        </motion.div>
                    ) : !selectedLesson ? (
                        <motion.div 
                            key="summary"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-4xl flex flex-col items-center"
                        >
                            <h2 className="font-luckiest text-blue-700 text-3xl md:text-5xl uppercase mt-12 mb-12 drop-shadow-md">Sommario</h2>
                            <div className="w-full max-h-[55vh] overflow-y-auto no-scrollbar space-y-2 px-4">
                                {lessons.length > 0 ? lessons.map((lesson) => (
                                    <button 
                                        key={lesson.id}
                                        onClick={() => handleLessonClick(lesson)}
                                        className="w-full bg-transparent py-1 px-2 hover:translate-x-2 transition-all text-left group flex items-center justify-between"
                                    >
                                        <span className="font-luckiest text-blue-800 text-lg md:text-2xl uppercase drop-shadow-sm group-hover:text-blue-600 transition-colors">
                                            {lesson.title}
                                        </span>
                                        {lesson.isPremium && !isPremiumActive && (
                                            <img src={PREMIUM_LOCK_IMG} alt="Locked" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                                        )}
                                    </button>
                                )) : (
                                    <div className="text-center p-12 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-dashed border-blue-300">
                                        <p className="text-blue-800 font-bold text-xl md:text-2xl">Nessuna lezione disponibile per questa materia.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="lesson"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-5xl h-full flex flex-col items-center"
                        >
                            <div className="w-full flex flex-col items-start gap-4 mb-6 shrink-0">
                                <button 
                                    onClick={() => setSelectedLesson(null)}
                                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                                >
                                    <img src={BTN_SOMMARIO_URL} alt="Sommario" className="w-24 h-24 md:w-32 h-auto drop-shadow-lg" />
                                </button>
                                <h3 className="w-full font-luckiest text-blue-700 text-xl md:text-4xl uppercase text-center leading-tight drop-shadow-sm">
                                    {selectedLesson.title}
                                </h3>
                            </div>
                            
                            <div 
                                ref={scrollRef}
                                onScroll={handleScroll}
                                className="w-full flex-1 overflow-y-auto no-scrollbar p-6 md:p-10"
                            >
                                <div className="flex flex-col gap-6">
                                    {renderMixedContent(selectedLesson.text)}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* EXIT BUTTONS BOTTOM RIGHT */}
            <div className="absolute bottom-4 right-4 z-50 flex flex-col items-center gap-4">
                {selectedLesson && (
                    <button 
                        onClick={() => {
                            setShowQuizModal(true);
                            setCurrentQuizIndex(0);
                            setQuizFeedback(null);
                            setIsQuizFinished(false);
                        }}
                        className="hover:scale-110 active:scale-95 transition-all outline-none"
                    >
                        <img src={BTN_VERIFICA_URL} alt="Verifica" className="w-12 h-12 md:w-18 h-auto drop-shadow-2xl" />
                    </button>
                )}
                <button 
                    onClick={() => setView(backView)}
                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                >
                    <img src={BTN_BACK_URL} alt="Chiudi" className="w-12 h-12 md:w-18 h-auto drop-shadow-2xl" />
                </button>
            </div>

            {/* QUIZ MODAL */}
            <AnimatePresence>
                {showQuizModal && selectedLesson && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white/95 rounded-[2.5rem] border-6 md:border-8 border-blue-500 shadow-2xl w-full max-w-lg p-4 md:p-6 relative flex flex-col items-center"
                        >
                            <button 
                                onClick={() => setShowQuizModal(false)}
                                className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-white shadow-xl hover:scale-110 transition-all"
                            >
                                <X size={20} strokeWidth={4} />
                            </button>

                            {selectedLesson.quizzes && selectedLesson.quizzes.length > 0 ? (
                                !isQuizFinished ? (
                                    <div className="w-full flex flex-col items-center">
                                        <div className="bg-blue-100 px-3 py-1 rounded-full mb-3">
                                            <span className="font-luckiest text-blue-600 text-xs md:text-sm uppercase">
                                                Domanda {currentQuizIndex + 1} di {selectedLesson.quizzes.length}
                                            </span>
                                        </div>

                                        <h3 className="font-luckiest text-blue-900 text-lg md:text-xl text-center mb-4 leading-tight">
                                            {selectedLesson.quizzes[currentQuizIndex].question}
                                        </h3>

                                        <div className="grid grid-cols-1 gap-2 w-full">
                                            {selectedLesson.quizzes[currentQuizIndex].options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuizAnswer(idx)}
                                                    disabled={!!quizFeedback}
                                                    className={`w-full py-2 px-4 rounded-xl font-bold text-sm md:text-base transition-all border-2 md:border-4 ${
                                                        quizFeedback && idx === selectedOptionIndex && idx !== selectedLesson.quizzes[currentQuizIndex].correctIndex
                                                            ? 'bg-red-500 border-red-600 text-white scale-[1.01]'
                                                            : quizFeedback && idx === selectedOptionIndex && idx === selectedLesson.quizzes[currentQuizIndex].correctIndex
                                                            ? 'bg-green-500 border-green-600 text-white scale-[1.01]'
                                                            : quizFeedback && idx !== selectedOptionIndex
                                                            ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
                                                            : 'bg-white border-blue-200 text-blue-900 hover:border-blue-400 hover:bg-blue-50 active:scale-95'
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {quizFeedback && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="mt-4 flex flex-col items-center gap-3 w-full"
                                                >
                                                    <div className={`font-luckiest text-base md:text-lg text-center uppercase tracking-wider ${
                                                        quizFeedback.includes('Ops') ? 'text-red-500' : 'text-green-600'
                                                    }`}>
                                                        {quizFeedback}
                                                    </div>
                                                    {quizFeedback.includes('Ops') ? (
                                                        <button
                                                            onClick={handleRetryQuestion}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white font-luckiest text-sm md:text-base px-8 py-2 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                                                        >
                                                            Riprova
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={handleNextQuiz}
                                                            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-luckiest text-sm md:text-base px-6 py-2 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                                                        >
                                                            {currentQuizIndex < selectedLesson.quizzes.length - 1 ? 'Prossima' : 'Risultato'}
                                                        </button>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center py-6">
                                        <div className="w-32 h-32 md:w-48 md:h-48 mb-6">
                                            {getVictoryImage() ? (
                                                <img src={getVictoryImage()!} alt="Vittoria" className="w-full h-full object-contain drop-shadow-xl" />
                                            ) : (
                                                <div className="text-6xl md:text-8xl text-center">🏆</div>
                                            )}
                                        </div>
                                        <h3 className="font-luckiest text-blue-900 text-2xl md:text-4xl text-center mb-3 uppercase">Verifica Completata!</h3>
                                        <p className="text-slate-600 font-bold text-lg md:text-xl text-center mb-8">Hai risposto correttamente a tutte le domande!</p>
                                        <button 
                                            onClick={() => setShowQuizModal(false)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-luckiest text-xl px-10 py-3 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
                                        >
                                            Ottimo!
                                        </button>
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center py-8">
                                    <div className="text-5xl mb-4">📝</div>
                                    <h3 className="font-luckiest text-blue-900 text-2xl md:text-3xl text-center uppercase tracking-wider">
                                        Verifica in preparazione
                                    </h3>
                                    <p className="text-slate-500 font-bold text-base mt-3">Torna presto per metterti alla prova!</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULLSCREEN IMAGE ZOOM */}
            <AnimatePresence>
                {zoomedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setZoomedImage(null)}
                        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
                    >
                        <motion.img 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            src={zoomedImage} 
                            alt="Zoomed Lesson" 
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                        />
                        <button 
                            onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
                            className="absolute top-6 right-6 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors"
                        >
                            <X size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PREMIUM BLOCKED MODAL */}
            <AnimatePresence>
                {showPremiumModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-2xl p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white/95 p-4 md:p-6 rounded-[2.5rem] border-8 border-yellow-400 shadow-2xl flex flex-col items-center text-center max-w-sm w-full"
                        >
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
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MedieSubjectPage;
