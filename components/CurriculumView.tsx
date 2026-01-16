import React, { useState, useEffect, useRef } from 'react';
import { GradeCurriculumData, SchoolSubject, SchoolChapter, SchoolLesson, AppView } from '../types';
import { Book, ChevronLeft, Volume2, ArrowRight, Star, X, Pause, ImageIcon, PlayCircle, ChevronRight, ArrowLeft, Lock, Info } from 'lucide-react';
import TeacherChat from './TeacherChat';

// --- SFONDI PER GLI INDICI (LISTA CAPITOLI) ---
const GRADE1_ITALIAN_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/italiensfond4rtrtrt4dx32.webp';
const GRADE1_MATH_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/matgre44zx1.webp';
const GRADE1_HISTORY_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/storid77x66e3.webp';
const GRADE1_GEOGRAPHY_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geofr66xz89i.webp';
const GRADE1_SCIENCE_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scie55gfrfxz10i.webp';

// --- SFONDI PER LE LEZIONI (CONTENUTO) ---
const GRADE1_ITALIAN_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/italiensfond44dx32.webp';
const GRADE1_MATH_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/mafret56x88.webp';
const GRADE1_HISTORY_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/storidfjg7djx90o.webp';
const GRADE1_GEOGRAPHY_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/geofr66x8zs1.webp';
const GRADE1_SCIENCE_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/scierf55tg7zxs10.webp';

const CUSTOM_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiudisade.webp';
const CUSTOM_VERIFY_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esercschol4321.webp';
const CUSTOM_VISUAL_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/visuallibrsches432.webp';

// --- ASSET MODALE PREMIUM E INDICI ---
const PREMIUM_LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libercloased44fx33.webp';
const PREMIUM_FREE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/freebokuj776gt.webp';
const PREMIUM_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libercloased44fx33.webp';
const BTN_PREMIUM_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/returncloded44fx332.webp';
const BTN_PREMIUM_INFO_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/infoblocked44fx33.webp';

const VOCALI_VIDEO_URL = 'https://www.youtube.com/embed/W12CrAsUK-w?autoplay=1&rel=0&modestbranding=1';

interface Point { x: number; y: number; }

const ITALIAN_1_HOTSPOTS = {
  "CLOSE_BOOK": [{"x": 60.69, "y": 11.24}, {"x": 60.96, "y": 17.08}, {"x": 71.07, "y": 17.08}, {"x": 70.8, "y": 11.09}],
  "LISTEN_AUDIO": [{"x": 74, "y": 10.94}, {"x": 74, "y": 17.23}, {"x": 83.32, "y": 17.23}, {"x": 83.32, "y": 10.79}],
  "ASK_TEACHER": [{"x": 85.98, "y": 10.94}, {"x": 85.98, "y": 17.08}, {"x": 96.36, "y": 17.08}, {"x": 96.36, "y": 10.64}],
  "EXERCISES": [{"x": 4.53, "y": 88.54}, {"x": 4.26, "y": 94.38}, {"x": 25.29, "y": 94.08}, {"x": 24.49, "y": 88.54}],
  "VISUAL_ACTIVITY": [{"x": 28.75, "y": 88.54}, {"x": 28.75, "y": 93.93}, {"x": 49.51, "y": 94.23}, {"x": 49.24, "y": 88.84}],
  "GAMES": [{"x": 53.5, "y": 88.84}, {"x": 53.24, "y": 94.23}, {"x": 73.2, "y": 94.08}, {"x": 72.93, "y": 88.54}],
  "YOUTUBE": [{"x": 76.13, "y": 88.54}, {"x": 76.39, "y": 94.08}, {"x": 96.89, "y": 94.08}, {"x": 96.89, "y": 88.24}]
};

const MATH_GRADE_HOTSPOTS = {
  "CLOSE_BOOK": [{"x": 61.36, "y": 11.09}, {"x": 61.36, "y": 17.54}, {"x": 71.23, "y": 17.39}, {"x": 70.96, "y": 10.94}],
  "LISTEN_AUDIO": [{"x": 74.16, "y": 10.65}, {"x": 73.89, "y": 17.09}, {"x": 83.77, "y": 17.39}, {"x": 83.77, "y": 10.8}],
  "ASK_TEACHER": [{"x": 87.23, "y": 10.65}, {"x": 87.23, "y": 17.39}, {"x": 97.37, "y": 17.39}, {"x": 96.57, "y": 10.94}],
  "EXERCISES": [{"x": 3.73, "y": 88.16}, {"x": 4, "y": 93.86}, {"x": 25.88, "y": 94.16}, {"x": 25.88, "y": 88.16}],
  "VISUAL_ACTIVITY": [{"x": 29.34, "y": 88.01}, {"x": 29.08, "y": 94.01}, {"x": 50.15, "y": 94.16}, {"x": 49.89, "max-width": "100%", "y": 88.31}],
  "GAMES": [{"x": 53.35, "y": 88.31}, {"x": 53.62, "y": 94.01}, {"x": 73.36, "y": 94.16}, {"x": 72.56, "y": 88.46}],
  "YOUTUBE": [{"x": 76.56, "y": 88.46}, {"x": 76.83, "y": 93.86}, {"x": 97.1, "y": 94.16}, {"x": 96.84, "y": 88.61}]
};

const HISTORY_GRADE_HOTSPOTS = {
  "CLOSE_BOOK": [{"x": 62.42, "y": 11.54}, {"x": 62.69, "y": 17.39}, {"x": 71.49, "y": 17.84}, {"x": 71.23, "y": 11.54}],
  "LISTEN_AUDIO": [{"x": 73.89, "y": 11.39}, {"x": 74.7, "y": 17.84}, {"x": 84.03, "y": 17.84}, {"x": 83.77, "y": 11.24}],
  "ASK_TEACHER": [{"x": 86.43, "y": 11.09}, {"x": 86.97, "y": 17.39}, {"x": 97.37, "y": 17.84}, {"x": 96.57, "y": 10.94}],
  "EXERCISES": [{"x": 4.27, "y": 88.76}, {"x": 4.27, "y": 93.71}, {"x": 25.88, "y": 93.86}, {"x": 25.08, "y": 88.61}],
  "VISUAL_ACTIVITY": [{"x": 28.54, "y": 88.46}, {"x": 28.81, "y": 93.71}, {"x": 49.62, "y": 94.16}, {"x": 48.55, "y": 88.46}],
  "GAMES": [{"x": 52.29, "y": 88.61}, {"x": 52.82, "y": 93.86}, {"x": 73.63, "y": 94.01}, {"x": 73.09, "y": 88.91}],
  "YOUTUBE": [{"x": 76.3, "y": 88.61}, {"x": 77.1, "y": 93.86}, {"x": 97.1, "y": 93.56}, {"x": 97.1, "y": 88.61}]
};

const GEOGRAPHY_GRADE_HOTSPOTS = {
  "CLOSE_BOOK": [{"x": 61.36, "y": 11.09}, {"x": 61.36, "y": 17.09}, {"x": 72.03, "y": 17.24}, {"x": 71.23, "y": 10.94}],
  "LISTEN_AUDIO": [{"x": 74.43, "y": 10.94}, {"x": 75.23, "y": 16.79}, {"x": 84.03, "y": 17.09}, {"x": 83.77, "y": 10.94}],
  "ASK_TEACHER": [{"x": 86.97, "y": 10.8}, {"x": 86.97, "y": 16.79}, {"x": 97.1, "y": 17.09}, {"x": 96.84, "y": 10.8}],
  "EXERCISES": [{"x": 4.54, "y": 88.91}, {"x": 4.27, "y": 93.56}, {"x": 25.34, "y": 93.71}, {"x": 24.81, "y": 88.76}],
  "VISUAL_ACTIVITY": [{"x": 28.54, "y": 88.76}, {"x": 28.81, "y": 93.41}, {"x": 48.82, "y": 93.86}, {"x": 48.82, "y": 88.91}],
  "GAMES": [{"x": 52.29, "y": 89.06}, {"x": 52.29, "y": 93.41}, {"x": 73.36, "text-align": "center", "y": 93.56}, {"x": 73.09, "y": 88.76}],
  "YOUTUBE": [{"x": 76.56, "y": 88.91}, {"x": 76.56, "y": 93.71}, {"x": 96.84, "y": 93.86}, {"x": 96.84, "y": 89.06}]
};

const SCIENCE_GRADE_HOTSPOTS = {
  "CLOSE_BOOK": [{"x": 61.88, "y": 11.53}, {"x": 61.88, "y": 17.52}, {"x": 71.48, "y": 17.22}, {"x": 70.95, "y": 11.23}],
  "LISTEN_AUDIO": [{"x": 74.68, "y": 11.23}, {"x": 74.68, "y": 17.07}, {"x": 84.28, "y": 17.37}, {"x": 83.75, "y": 11.23}],
  "ASK_TEACHER": [{"x": 86.95, "y": 11.38}, {"x": 86.95, "y": 17.07}, {"x": 97.62, "y": 17.37}, {"x": 96.55, "y": 11.08}],
  "EXERCISES": [{"x": 4, "y": 89.41}, {"x": 4, "y": 94.65}, {"x": 25.6, "y": 94.5}, {"x": 25.07, "y": 89.56}],
  "VISUAL_ACTIVITY": [{"x": 28.81, "y": 89.26}, {"x": 29.34, "y": 94.65}, {"x": 50.41, "y": 94.95}, {"x": 49.61, "y": 89.56}],
  "GAMES": [{"x": 52.81, "y": 89.41}, {"x": 53.34, "y": 94.65}, {"x": 73.61, "y": 95.1}, {"x": 73.35, "y": 89.41}],
  "YOUTUBE": [{"x": 76.55, "y": 89.41}, {"x": 76.81, "y": 94.95}, {"x": 97.35, "y": 94.65}, {"x": 97.08, "y": 89.56}]
};

interface CurriculumViewProps {
  data: GradeCurriculumData;
  initialSubject: SchoolSubject;
  onExit: () => void;
  bgUrl: string;
  setView?: (view: AppView) => void;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ data, initialSubject, onExit, bgUrl, setView }) => {
  const [selectedSubject, setSelectedSubject] = useState<SchoolSubject>(initialSubject);
  const [selectedLesson, setSelectedLesson] = useState<SchoolLesson | null>(null);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [isVisualExerciseOpen, setIsVisualExerciseOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showTeacherChat, setShowTeacherChat] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  
  // Stati per la paginazione del testo
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const [comingSoonModal, setComingSoonModal] = useState<{ active: boolean, type: 'GAME' | 'VIDEO' }>({ active: false, type: 'GAME' });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Controllo stato abbonamento
    const premium = localStorage.getItem('is_premium_active') === 'true';
    setIsPremiumActive(premium);
  }, []);

  const isMathSubject = selectedSubject === SchoolSubject.MATEMATICA;
  const isHistorySubject = selectedSubject === SchoolSubject.STORIA;
  const isGeographySubject = selectedSubject === SchoolSubject.GEOGRAFIA;
  const isScienceSubject = selectedSubject === SchoolSubject.SCIENZE;

  const getSpecialBg = (isLessonView: boolean) => {
    switch (selectedSubject) {
        case SchoolSubject.ITALIANO: return isLessonView ? GRADE1_ITALIAN_LESSON_BG : GRADE1_ITALIAN_INDEX_BG;
        case SchoolSubject.MATEMATICA: return isLessonView ? GRADE1_MATH_LESSON_BG : GRADE1_MATH_INDEX_BG;
        case SchoolSubject.STORIA: return isLessonView ? GRADE1_HISTORY_LESSON_BG : GRADE1_HISTORY_INDEX_BG;
        case SchoolSubject.GEOGRAFIA: return isLessonView ? GRADE1_GEOGRAPHY_LESSON_BG : GRADE1_GEOGRAPHY_INDEX_BG;
        case SchoolSubject.SCIENZE: return isLessonView ? GRADE1_SCIENCE_LESSON_BG : GRADE1_SCIENCE_INDEX_BG;
        default: return GRADE1_ITALIAN_LESSON_BG;
    }
  };

  const getClipPath = (pts: Point[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

  // Logica per calcolare le pagine quando la lezione cambia
  useEffect(() => {
    if (selectedLesson && !selectedLesson.isPremium && textContainerRef.current) {
        const checkPages = () => {
            const container = textContainerRef.current;
            if (container) {
                const total = Math.ceil(container.scrollHeight / container.clientHeight);
                setTotalPages(total > 0 ? total : 1);
                setCurrentPage(1);
                container.scrollTop = 0;
            }
        };
        // Piccolo ritardo per assicurarsi che il testo sia renderizzato
        setTimeout(checkPages, 50);
    }
  }, [selectedLesson]);

  const handleNextTextPage = () => {
      if (textContainerRef.current && currentPage < totalPages) {
          textContainerRef.current.scrollTop += textContainerRef.current.clientHeight;
          setCurrentPage(prev => prev + 1);
      }
  };

  const handlePrevTextPage = () => {
      if (textContainerRef.current && currentPage > 1) {
          textContainerRef.current.scrollTop -= textContainerRef.current.clientHeight;
          setCurrentPage(prev => prev - 1);
      }
  };

  const toggleLessonAudio = (url: string) => {
    if (!url || selectedLesson?.isPremium) return;
    if (audioRef.current && audioRef.current.src === url) {
        if (isAudioPlaying) { audioRef.current.pause(); setIsAudioPlaying(false); }
        else { audioRef.current.play(); setIsAudioPlaying(true); }
    } else {
        if (audioRef.current) audioRef.current.pause();
        const audio = new Audio(url);
        audio.onended = () => setIsAudioPlaying(false);
        audio.play();
        audioRef.current = audio;
        setIsAudioPlaying(true);
    }
  };

  const handleQuizChoice = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    setShowFeedback(true);
    const quiz = selectedLesson?.quizzes[currentQuizIdx];
    if (idx !== quiz?.correctIndex) {
        setTimeout(() => { setQuizAnswer(null); setShowFeedback(false); }, 2000);
    }
  };

  const nextQuestion = () => {
    if (selectedLesson && currentQuizIdx < selectedLesson.quizzes.length - 1) {
        setCurrentQuizIdx(prev => prev + 1);
        setQuizAnswer(null);
        setShowFeedback(false);
    } else {
        setIsExerciseOpen(false);
    }
  };

  const handleOpenLesson = (lesson: SchoolLesson) => {
    // Reset di tutti gli stati dei modali prima di aprire una nuova lezione
    setIsExerciseOpen(false);
    setIsVisualExerciseOpen(false);
    setIsVideoOpen(false);
    setCurrentQuizIdx(0);
    setQuizAnswer(null);
    setShowFeedback(false);
    setCurrentPage(1);
    setSelectedLesson(lesson);
  };

  const handleCloseLesson = () => {
    setSelectedLesson(null);
    setCurrentQuizIdx(0);
    setIsExerciseOpen(false);
    setIsVisualExerciseOpen(false);
    setIsVideoOpen(false);
    if (audioRef.current) audioRef.current.pause();
    setIsAudioPlaying(false);
  };

  const handleOpenPremiumInfo = () => {
      if (setView) setView(AppView.PREMIUM_INFO);
  };

  const activeHotspots = isMathSubject ? MATH_GRADE_HOTSPOTS : 
                        isHistorySubject ? HISTORY_GRADE_HOTSPOTS : 
                        isGeographySubject ? GEOGRAPHY_GRADE_HOTSPOTS : 
                        isScienceSubject ? SCIENCE_GRADE_HOTSPOTS : ITALIAN_1_HOTSPOTS;

  if (!selectedLesson) {
    const chapters = data.subjects[selectedSubject] || [];
    return (
      <div className="fixed inset-0 z-[150] flex flex-col bg-white overflow-hidden">
        <img src={getSpecialBg(false)} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />
        <div 
            onClick={onExit}
            className="absolute z-50 cursor-pointer"
            style={{ clipPath: getClipPath([{"x": 60.5, "y": 10.64}, {"x": 60.5, "y": 17.39}, {"x": 72.49, "y": 17.09}, {"x": 71.96, "y": 10.34}]), inset: 0 }}
        />
        <div className="flex-1 flex flex-col items-center z-10 pt-40 md:pt-52">
            <div className="w-full max-w-4xl space-y-1 px-12 md:px-24">
                {chapters.map(ch => {
                    const isChapterPremium = ch.lessons[0]?.isPremium;
                    const isLocked = isChapterPremium && !isPremiumActive;
                    const iconUrl = isLocked ? PREMIUM_LOCK_IMG : PREMIUM_FREE_IMG;
                    
                    return (
                        <button 
                            key={ch.id} 
                            onClick={() => ch.lessons.length > 0 && handleOpenLesson(ch.lessons[0])} 
                            className="w-full text-left font-luckiest text-blue-700 text-xl md:text-4xl uppercase tracking-wide hover:text-blue-500 transition-colors py-1 flex justify-between items-center group active:scale-98"
                        >
                            <div className="flex items-center gap-3 md:gap-4">
                                <img 
                                    src={iconUrl} 
                                    alt={isLocked ? "Bloccato" : "Libero"} 
                                    className="w-8 h-8 md:w-11 md:h-11 object-contain drop-shadow-md" 
                                />
                                <span className="leading-none">{ch.title}</span>
                            </div>
                            <ArrowRight size={28} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                        </button>
                    );
                })}
            </div>
        </div>
      </div>
    );
  }

  const currentQuiz = selectedLesson.quizzes[currentQuizIdx];

  return (
      <div className="fixed inset-0 z-[160] flex flex-col bg-white overflow-hidden">
          <img src={getSpecialBg(true)} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />

          {/* HOTSPOTS */}
          <div className="absolute inset-0 z-40 pointer-events-none">
              <button onClick={handleCloseLesson} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.CLOSE_BOOK), inset: 0 }} />
              
              {!selectedLesson.isPremium && (
                <>
                    <button onClick={() => toggleLessonAudio(selectedLesson.audioUrl)} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.LISTEN_AUDIO), inset: 0 }} />
                    <button onClick={() => setShowTeacherChat(true)} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.ASK_TEACHER), inset: 0 }} />
                    <button onClick={() => selectedLesson.quizzes.length > 0 && setIsExerciseOpen(true)} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.EXERCISES), inset: 0 }} />
                    <button onClick={() => setIsVisualExerciseOpen(true)} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.VISUAL_ACTIVITY), inset: 0 }} />
                    <button onClick={() => setComingSoonModal({ active: true, type: 'GAME' })} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.GAMES), inset: 0 }} />
                    <button onClick={() => setIsVideoOpen(true)} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.YOUTUBE), inset: 0 }} />
                </>
              )}
          </div>

          {/* CONTENUTO LEZIONE O BLOCCO ABBONAMENTO */}
          <div className="flex-1 flex flex-col items-center z-10 pt-14 md:pt-18 px-4 overflow-hidden">
              <div className="relative w-full max-w-5xl px-8 md:px-16 flex flex-col items-center h-full justify-center">
                  
                  {selectedLesson.isPremium && !isPremiumActive ? (
                      /* VISTA BLOCCO PREMIUM - CENTRATA */
                      <div className="flex-1 w-full flex flex-col items-center justify-center">
                          <div className="bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-[3rem] border-8 border-yellow-400 shadow-2xl flex flex-col items-center text-center max-w-sm">
                              {/* HEADER IMMAGINE FISSA - RIDOTTA */}
                              <div className="w-full mb-6 flex justify-center">
                                  <img 
                                    src={PREMIUM_HEADER_IMG} 
                                    alt="Contenuto Bloccato" 
                                    className="w-full h-auto max-w-[200px] drop-shadow-md" 
                                  />
                              </div>

                              <h3 className="text-2xl md:text-3xl font-black text-blue-900 uppercase mb-2 tracking-tighter leading-none">Contenuto Premium</h3>
                              <p className="text-gray-600 font-bold mb-8 text-sm md:text-lg leading-snug">
                                  Questa lezione è riservata agli abbonati di Lone Boo World! 👑 <br/> 
                                  <span className="text-xs text-slate-400 mt-2 block">Chiedi a mamma o papà!</span>
                              </p>

                              {/* TASTI GRAFICI - RIDOTTI */}
                              <div className="flex gap-4 w-full justify-center">
                                  <button 
                                    onClick={handleCloseLesson}
                                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                                  >
                                      <img src={BTN_PREMIUM_BACK_IMG} alt="Torna Indietro" className="w-24 md:w-32 h-auto drop-shadow-lg" />
                                  </button>
                                  <button 
                                    onClick={handleOpenPremiumInfo}
                                    className="hover:scale-110 active:scale-95 transition-all outline-none"
                                  >
                                      <img src={BTN_PREMIUM_INFO_IMG} alt="Info" className="w-24 md:w-32 h-auto drop-shadow-lg" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  ) : (
                      /* VISTA LEZIONE NORMALE (O PREMIUM SBLOCCATA) */
                      <>
                        <div 
                            ref={textContainerRef}
                            className="w-full h-[58vh] md:h-[62vh] overflow-hidden scroll-smooth flex flex-col"
                        >
                            {/* TITOLO LEZIONE CENTRATO */}
                            <h3 className="font-luckiest text-center text-blue-700 text-xl md:text-4xl uppercase mt-2 md:mt-4 mb-4 md:mb-6 shrink-0 leading-tight">
                                {selectedLesson.title}
                            </h3>

                            <p className="leading-relaxed whitespace-pre-wrap font-sans font-black text-slate-800 text-base md:text-3xl text-justify w-full">
                                {selectedLesson.text}
                            </p>
                        </div>

                        {/* CONTRELLI PAGINAZIONE (FRECCE SFOGLIABILI) - POSIZIONATE PIU' IN BASSO */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between w-full mt-2 md:mt-4 px-2">
                                <button 
                                    onClick={handlePrevTextPage}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-full border-4 border-black transition-all ${currentPage === 1 ? 'bg-gray-300 opacity-20 grayscale' : 'bg-yellow-400 hover:scale-110 active:scale-95 shadow-md'}`}
                                >
                                    <ArrowLeft size={24} strokeWidth={4} className="text-black" />
                                </button>

                                <div className="bg-white/60 backdrop-blur-sm px-4 py-1 rounded-full border-2 border-slate-200">
                                    <span className="font-black text-slate-500 text-xs md:text-lg uppercase">Pagina {currentPage} di {totalPages}</span>
                                </div>

                                <button 
                                    onClick={handleNextTextPage}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-full border-4 border-black transition-all ${currentPage === totalPages ? 'bg-gray-300 opacity-20 grayscale' : 'bg-yellow-400 hover:scale-110 active:scale-95 shadow-md'}`}
                                >
                                    <ArrowRight size={24} strokeWidth={4} className="text-black" />
                                </button>
                            </div>
                        )}
                      </>
                  )}
              </div>
          </div>

          {/* MODALE ESERCIZI (SEQUENZIALE) */}
          {isExerciseOpen && currentQuiz && (!selectedLesson.isPremium || isPremiumActive) && (
              <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-white w-full max-md rounded-[3rem] border-8 border-blue-500 shadow-2xl overflow-hidden relative flex flex-col">
                      <button onClick={() => setIsExerciseOpen(false)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all z-10"><X size={24} strokeWidth={4} /></button>
                      <div className="p-3 md:p-4 flex justify-center border-b-4 border-slate-100 shrink-0"><img src={CUSTOM_VERIFY_BTN} alt="Esercizio" className="h-10 md:h-16 w-auto object-contain" /></div>
                      <div className="p-4 md:p-6 overflow-y-auto no-scrollbar flex-1 flex flex-col gap-3">
                          <div className="text-center mb-2">
                              <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-black text-xs uppercase">Domanda {currentQuizIdx + 1} di {selectedLesson.quizzes.length}</span>
                          </div>
                          <p className="text-xl md:text-2xl font-black text-slate-800 leading-tight text-center">{currentQuiz.question}</p>
                          <div className="grid grid-cols-1 gap-2.5 mt-1">
                              {currentQuiz.options.map((opt, idx) => (
                                  <button key={idx} onClick={() => handleQuizChoice(idx)} className={`p-2.5 rounded-[1.5rem] font-black text-lg md:text-xl border-4 transition-all text-left shadow-lg flex items-center gap-4 ${quizAnswer === null ? 'bg-slate-50 border-slate-200 text-blue-600 hover:border-blue-500 hover:bg-white' : ''} ${quizAnswer === idx && idx === currentQuiz.correctIndex ? 'bg-green-500 border-green-700 text-white' : ''} ${quizAnswer === idx && idx !== currentQuiz.correctIndex ? 'bg-red-500 border-red-300 text-white animate-shake' : (quizAnswer !== null ? 'opacity-50 border-slate-100 text-blue-600' : '')}`}><span className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm md:text-base shrink-0 ${quizAnswer === idx ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>{String.fromCharCode(65 + idx)}</span>{opt}</button>
                              ))}
                          </div>
                          {showFeedback && (
                              <div className="mt-2 p-3 rounded-[2rem] bg-blue-50 border-4 border-blue-200 text-center">
                                  {quizAnswer === currentQuiz.correctIndex ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="text-green-600 font-black text-base md:text-lg uppercase tracking-tighter dream-glow leading-tight">{currentQuiz.feedback}</p>
                                        <button onClick={nextQuestion} className="bg-green-500 text-white px-8 py-3 rounded-full font-black flex items-center gap-2 shadow-md hover:scale-105 transition-transform uppercase text-sm">
                                            {currentQuizIdx < selectedLesson.quizzes.length - 1 ? 'Prossima Domanda' : 'Fine Esercizio'} <ChevronRight size={18} />
                                        </button>
                                    </div>
                                  ) : <p className="text-red-600 font-black text-base md:text-lg uppercase tracking-tighter">Ops! Riprova! 💪</p>}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* ALTRI MODALI (In Arrivo, Video, etc) */}
          {comingSoonModal.active && (!selectedLesson.isPremium || isPremiumActive) && (
              <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-white rounded-[3rem] border-8 border-yellow-400 p-8 w-full max-sm text-center shadow-2xl relative">
                      <button onClick={() => setComingSoonModal({ ...comingSoonModal, active: false })} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all"><X size={20} strokeWidth={4} /></button>
                      <div className="w-32 h-32 md:w-40 md:h-40 bg-yellow-100 rounded-full flex items-center justify-center mb-6 border-4 border-dashed border-yellow-400 animate-pulse">
                          {comingSoonModal.type === 'VIDEO' ? <PlayCircle size={64} className="text-yellow-600" /> : <Star size={64} className="text-yellow-600" />}
                      </div>
                      <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2 leading-none">
                          {comingSoonModal.type === 'VIDEO' ? 'VIDEO IN ARRIVO!' : 'GIOCO IN ARRIVO!'}
                      </h3>
                      <p className="text-lg font-bold text-slate-500 leading-tight mb-8">
                          Lone Boo sta preparando <br/> {comingSoonModal.type === 'VIDEO' ? 'un video magico' : 'una sfida divertente'} <br/> per questa lezione! 👻
                      </p>
                      <button onClick={() => setComingSoonModal({ ...comingSoonModal, active: false })} className="w-full bg-blue-500 text-white font-black py-4 rounded-full border-b-8 border-blue-700 active:translate-y-1 active:border-b-0 transition-all text-xl uppercase shadow-lg">OK, ASPETTO!</button>
                  </div>
              </div>
          )}

          {isVideoOpen && (!selectedLesson.isPremium || isPremiumActive) && (
              <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-0 md:p-4">
                  <div className="relative w-full max-w-5xl bg-white rounded-[30px] md:rounded-[40px] border-[6px] md:border-[8px] border-red-600 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setIsVideoOpen(false)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 z-[210]"><X size={24} /></button>
                      <div className="flex-1 w-full aspect-video bg-black"><iframe src={VOCALI_VIDEO_URL} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" /></div>
                      <div className="p-4 text-center bg-white shrink-0 border-t border-gray-100 flex items-center justify-center gap-3"><PlayCircle className="text-red-600" /><h3 className="text-gray-800 text-lg md:text-xl font-black uppercase truncate px-2">Impariamo con Lone Boo!</h3></div>
                  </div>
              </div>
          )}

          {showTeacherChat && (!selectedLesson.isPremium || isPremiumActive) && <TeacherChat onClose={() => setShowTeacherChat(false)} />}
      </div>
  );
};

export default CurriculumView;