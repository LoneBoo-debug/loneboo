
import React, { useState, useEffect, useRef } from 'react';
import { GradeCurriculumData, SchoolSubject, SchoolChapter, SchoolLesson, AppView } from '../types';
import { Book, ChevronLeft, Volume2, ArrowRight, Star, X, Pause, ImageIcon, PlayCircle } from 'lucide-react';
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

const BTN_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/btn-close.webp';
const CUSTOM_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiudisade.webp';
const CUSTOM_VERIFY_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esercschol4321.webp';
const CUSTOM_VISUAL_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/visuallibrsches432.webp';

const VOCALI_VIDEO_URL = 'https://www.youtube.com/embed/W12CrAsUK-w?autoplay=1&rel=0&modestbranding=1';

interface Point { x: number; y: number; }

// --- COORDINATE PRE-SETTATE PER ITALIANO 1 ---
const ITALIAN_1_HOTSPOTS: Record<string, Point[]> = {
  "CLOSE_BOOK": [{"x": 60.69, "y": 11.24}, {"x": 60.96, "y": 17.08}, {"x": 71.07, "y": 17.08}, {"x": 70.8, "y": 11.09}],
  "LISTEN_AUDIO": [{"x": 74, "y": 10.94}, {"x": 74, "y": 17.23}, {"x": 83.32, "y": 17.23}, {"x": 83.32, "y": 10.79}],
  "ASK_TEACHER": [{"x": 85.98, "y": 10.94}, {"x": 85.98, "y": 17.08}, {"x": 96.36, "y": 17.08}, {"x": 96.36, "y": 10.64}],
  "EXERCISES": [{"x": 4.53, "y": 88.54}, {"x": 4.26, "y": 94.38}, {"x": 25.29, "y": 94.08}, {"x": 24.49, "y": 88.54}],
  "VISUAL_ACTIVITY": [{"x": 28.75, "y": 88.54}, {"x": 28.75, "y": 93.93}, {"x": 49.51, "y": 94.23}, {"x": 49.24, "y": 88.84}],
  "GAMES": [{"x": 53.5, "y": 88.84}, {"x": 53.24, "y": 94.23}, {"x": 73.2, "y": 94.08}, {"x": 72.93, "y": 88.54}],
  "YOUTUBE": [{"x": 76.13, "y": 88.54}, {"x": 76.39, "y": 94.08}, {"x": 96.89, "y": 94.08}, {"x": 96.89, "y": 88.24}]
};

// --- COORDINATE PRE-SETTATE PER MATEMATICA (TUTTE LE CLASSI) ---
const MATH_GRADE_HOTSPOTS: Record<string, Point[]> = {
  "CLOSE_BOOK": [{"x": 61.36, "y": 11.09}, {"x": 61.36, "y": 17.54}, {"x": 71.23, "y": 17.39}, {"x": 70.96, "y": 10.94}],
  "LISTEN_AUDIO": [{"x": 74.16, "y": 10.65}, {"x": 73.89, "y": 17.09}, {"x": 83.77, "y": 17.39}, {"x": 83.77, "y": 10.8}],
  "ASK_TEACHER": [{"x": 87.23, "y": 10.65}, {"x": 87.23, "y": 17.39}, {"x": 97.37, "y": 17.39}, {"x": 96.57, "y": 10.94}],
  "EXERCISES": [{"x": 3.73, "y": 88.16}, {"x": 4, "y": 93.86}, {"x": 25.88, "y": 94.16}, {"x": 25.88, "y": 88.16}],
  "VISUAL_ACTIVITY": [{"x": 29.34, "y": 88.01}, {"x": 29.08, "y": 94.01}, {"x": 50.15, "y": 94.16}, {"x": 49.89, "y": 88.31}],
  "GAMES": [{"x": 53.35, "y": 88.31}, {"x": 53.62, "y": 94.01}, {"x": 73.36, "y": 94.16}, {"x": 72.56, "y": 88.46}],
  "YOUTUBE": [{"x": 76.56, "y": 88.46}, {"x": 76.83, "y": 93.86}, {"x": 97.1, "y": 94.16}, {"x": 96.84, "y": 88.61}]
};

// --- COORDINATE PRE-SETTATE PER STORIA (TUTTE LE CLASSI) ---
const HISTORY_GRADE_HOTSPOTS: Record<string, Point[]> = {
  "CLOSE_BOOK": [{"x": 62.42, "y": 11.54}, {"x": 62.69, "y": 17.39}, {"x": 71.49, "y": 17.84}, {"x": 71.23, "y": 11.54}],
  "LISTEN_AUDIO": [{"x": 73.89, "y": 11.39}, {"x": 74.7, "y": 17.84}, {"x": 84.03, "y": 17.84}, {"x": 83.77, "y": 11.24}],
  "ASK_TEACHER": [{"x": 86.43, "y": 11.09}, {"x": 86.97, "y": 17.39}, {"x": 97.37, "y": 17.84}, {"x": 96.57, "y": 10.94}],
  "EXERCISES": [{"x": 4.27, "y": 88.76}, {"x": 4.27, "y": 93.71}, {"x": 25.88, "y": 93.86}, {"x": 25.08, "y": 88.61}],
  "VISUAL_ACTIVITY": [{"x": 28.54, "y": 88.46}, {"x": 28.81, "y": 93.71}, {"x": 49.62, "y": 94.16}, {"x": 48.55, "y": 88.46}],
  "GAMES": [{"x": 52.29, "y": 88.61}, {"x": 52.82, "y": 93.86}, {"x": 73.63, "y": 94.01}, {"x": 73.09, "y": 88.91}],
  "YOUTUBE": [{"x": 76.3, "y": 88.61}, {"x": 77.1, "y": 93.86}, {"x": 97.1, "y": 93.56}, {"x": 97.1, "y": 88.61}]
};

// --- COORDINATE PRE-SETTATE PER GEOGRAFIA (TUTTE LE CLASSI) ---
const GEOGRAPHY_GRADE_HOTSPOTS: Record<string, Point[]> = {
  "CLOSE_BOOK": [{"x": 61.36, "y": 11.09}, {"x": 61.36, "y": 17.09}, {"x": 72.03, "y": 17.24}, {"x": 71.23, "y": 10.94}],
  "LISTEN_AUDIO": [{"x": 74.43, "y": 10.94}, {"x": 75.23, "y": 16.79}, {"x": 84.03, "y": 17.09}, {"x": 83.77, "y": 10.94}],
  "ASK_TEACHER": [{"x": 86.97, "y": 10.8}, {"x": 86.97, "y": 16.79}, {"x": 97.1, "y": 17.09}, {"x": 96.84, "y": 10.8}],
  "EXERCISES": [{"x": 4.54, "y": 88.91}, {"x": 4.27, "y": 93.56}, {"x": 25.34, "y": 93.71}, {"x": 24.81, "y": 88.76}],
  "VISUAL_ACTIVITY": [{"x": 28.54, "y": 88.76}, {"x": 28.81, "y": 93.41}, {"x": 48.82, "y": 93.86}, {"x": 48.82, "y": 88.91}],
  "GAMES": [{"x": 52.29, "y": 89.06}, {"x": 52.29, "y": 93.41}, {"x": 73.36, "y": 93.56}, {"x": 73.09, "y": 88.76}],
  "YOUTUBE": [{"x": 76.56, "y": 88.91}, {"x": 76.56, "y": 93.71}, {"x": 96.84, "y": 93.86}, {"x": 96.84, "y": 89.06}]
};

// --- COORDINATE PRE-SETTATE PER SCIENZE (TUTTE LE CLASSI) ---
const SCIENCE_GRADE_HOTSPOTS: Record<string, Point[]> = {
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
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  const [isVisualExerciseOpen, setIsVisualExerciseOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showTeacherChat, setShowTeacherChat] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  
  // Modale "In Arrivo"
  const [comingSoonModal, setComingSoonModal] = useState<{ active: boolean, type: 'GAME' | 'VIDEO' }>({ active: false, type: 'GAME' });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- LOGICA GESTIONE CLIC ---
  
  const handleOpenExercise = () => {
    setIsExerciseOpen(true);
  };

  const handleOpenVisual = () => {
    setIsVisualExerciseOpen(true);
  };

  const handleOpenGame = () => {
    if (selectedLesson?.id === 'it1_c4_l1') {
        // Le Parole rimanda al gioco WordGuess interno
        handleJumpToGame('WORDGUESS');
    } else {
        // Mostra modale gioco in arrivo
        setComingSoonModal({ active: true, type: 'GAME' });
    }
  };

  const handleOpenVideo = () => {
    if (selectedLesson?.id === 'it1_c1_l1') {
        // Vocali apre il video Youtube
        setIsVideoOpen(true);
    } else {
        // Mostra modale video in arrivo
        setComingSoonModal({ active: true, type: 'VIDEO' });
    }
  };

  // Coordinate specifiche per l'indice (Definitive per tutte le classi)
  const indexCalibPoints: Record<string, Point[]> = {
      "INDEX_CLOSE": [
        { "x": 60.5, "y": 10.64 },
        { "x": 60.5, "y": 17.39 },
        { "x": 72.49, "y": 17.09 },
        { "x": 71.96, "y": 10.34 }
      ]
  };

  const getClipPath = (pts: Point[]) => {
      if (!pts || pts.length < 3) return 'none';
      return `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;
  };

  // --- LOGICA CURRICULUM ---
  const isSpecialBook = selectedSubject === SchoolSubject.ITALIANO || 
                        selectedSubject === SchoolSubject.MATEMATICA || 
                        selectedSubject === SchoolSubject.STORIA ||
                        selectedSubject === SchoolSubject.GEOGRAFIA ||
                        selectedSubject === SchoolSubject.SCIENZE;

  const isMathSubject = selectedSubject === SchoolSubject.MATEMATICA;
  const isHistorySubject = selectedSubject === SchoolSubject.STORIA;
  const isGeographySubject = selectedSubject === SchoolSubject.GEOGRAFIA;
  const isScienceSubject = selectedSubject === SchoolSubject.SCIENZE;

  // Hotspots abilitati per tutte le materie speciali
  const useHotspots = isSpecialBook;
  
  const getSpecialBg = (isLessonView: boolean) => {
    switch (selectedSubject) {
        case SchoolSubject.ITALIANO: return isLessonView ? GRADE1_ITALIAN_LESSON_BG : GRADE1_ITALIAN_INDEX_BG;
        case SchoolSubject.MATEMATICA: return isLessonView ? GRADE1_MATH_LESSON_BG : GRADE1_MATH_INDEX_BG;
        case SchoolSubject.STORIA: return isLessonView ? GRADE1_HISTORY_LESSON_BG : GRADE1_HISTORY_INDEX_BG;
        case SchoolSubject.GEOGRAFIA: return isLessonView ? GRADE1_GEOGRAPHY_LESSON_BG : GRADE1_GEOGRAPHY_INDEX_BG;
        case SchoolSubject.SCIENZE: return isLessonView ? GRADE1_SCIENCE_LESSON_BG : GRADE1_SCIENCE_INDEX_BG;
        default: return isLessonView ? GRADE1_ITALIAN_LESSON_BG : GRADE1_ITALIAN_INDEX_BG;
    }
  };

  const subjects = [
    { key: SchoolSubject.ITALIANO, label: 'Italiano', color: 'bg-red-500', icon: '✍️' },
    { key: SchoolSubject.MATEMATICA, label: 'Matematica', color: 'bg-blue-500', icon: '🔢' },
    { key: SchoolSubject.STORIA, label: 'Storia', color: 'bg-amber-600', icon: '⏳' },
    { key: SchoolSubject.GEOGRAFIA, label: 'Geografia', color: 'bg-green-600', icon: '🌍' },
    { key: SchoolSubject.SCIENZE, label: 'Scienze', color: 'bg-purple-500', icon: '🧪' },
  ];

  const subjectInfo = subjects.find(s => s.key === selectedSubject)!;

  const toggleLessonAudio = (url: string) => {
    if (!url) {
        alert("Audio non ancora disponibile per questa lezione.");
        return;
    }

    if (audioRef.current && audioRef.current.src === url) {
        if (isAudioPlaying) {
            audioRef.current.pause();
            setIsAudioPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.error("Audio error", e));
            setIsAudioPlaying(true);
        }
    } else {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const audio = new Audio(url);
        audio.onended = () => setIsAudioPlaying(false);
        audio.play().catch(e => console.error("Audio error", e));
        audioRef.current = audio;
        setIsAudioPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const handleQuizChoice = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    setShowFeedback(true);
    if (idx !== selectedLesson?.quiz.correctIndex) {
        setTimeout(() => {
            setQuizAnswer(null);
            setShowFeedback(false);
        }, 2000);
    }
  };

  const handleJumpToGame = (gameId: string) => {
    if (setView) {
        sessionStorage.setItem('target_game', gameId);
        setView(AppView.PLAY);
    }
  };

  // --- RENDERER: INDICE DEL LIBRO ---
  if (!selectedLesson) {
    const chapters = data.subjects[selectedSubject] || [];
    const indexBg = getSpecialBg(false);

    return (
      <div className="fixed inset-0 z-[150] flex flex-col bg-white overflow-hidden animate-in slide-in-from-right">
        
        {isSpecialBook && <img src={indexBg} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />}

        {/* AREA CLICCABILE DEFINITIVA PER CHIUDI INDICE */}
        {isSpecialBook && indexCalibPoints.INDEX_CLOSE?.length >= 3 && (
             <button 
                onClick={onExit}
                className="absolute z-50 pointer-events-auto outline-none"
                style={{ clipPath: getClipPath(indexCalibPoints.INDEX_CLOSE), inset: 0 }}
             />
        )}

        {!isSpecialBook && (
            <div className={`${subjectInfo.color} p-4 md:p-6 flex items-center justify-between border-b-8 border-black/10 shrink-0 mt-[64px] md:mt-[96px] z-10`}>
                <button onClick={onExit} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all">
                    <ChevronLeft size={32} strokeWidth={3} />
                </button>
                <h2 className="text-white font-black text-2xl md:text-4xl uppercase tracking-tighter drop-shadow-md">Indice di {subjectInfo.label}</h2>
                <div className="w-10"></div>
            </div>
        )}

        {/* BOTTONE CHIUDI DEFAULT (Sempre visibile se non c'è calibrazione attiva) */}
        {isSpecialBook && indexCalibPoints.INDEX_CLOSE?.length < 3 && (
            <button onClick={onExit} className="fixed top-48 left-10 md:top-64 md:left-16 z-50 hover:scale-110 active:scale-95 transition-all outline-none">
                <img src={CUSTOM_CLOSE_IMG} alt="Chiudi" className="w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl" />
            </button>
        )}

        <div className={`flex-1 flex flex-col items-center z-10 ${isSpecialBook ? 'pt-40 md:pt-52 bg-transparent' : 'bg-slate-50 p-6 overflow-y-auto'}`}>
            <div className={`w-full max-w-4xl space-y-1 md:space-y-2 ${isSpecialBook ? 'px-12 md:px-24' : ''}`}>
                {chapters.length > 0 ? chapters.map(ch => (
                    <div key={ch.id} className={isSpecialBook ? "" : "bg-white rounded-3xl border-4 border-slate-200 p-6 shadow-sm mb-4"}>
                        {isSpecialBook ? (
                            <button onClick={() => ch.lessons.length > 0 && setSelectedLesson(ch.lessons[0])} className="w-full text-left font-luckiest text-blue-700 text-2xl md:text-5xl uppercase tracking-wide hover:text-blue-500 transition-colors py-1 md:py-2 flex justify-between items-center group active:scale-98">
                                <span>{ch.title}</span>
                                <ArrowRight size={28} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                            </button>
                        ) : (
                            <>
                                <h3 className="font-black text-xl md:text-3xl text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-tight"><Book className={subjectInfo.color.replace('bg-', 'text-')} /> {ch.title}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {ch.lessons.map(ls => (
                                        <button key={ls.id} onClick={() => setSelectedLesson(ls)} className="bg-slate-100 hover:bg-white hover:border-blue-400 border-2 border-transparent p-4 rounded-2xl text-left font-bold text-slate-600 transition-all flex justify-between items-center group shadow-sm active:scale-95">
                                            <span className="truncate">{ls.title}</span>
                                            <ArrowRight size={24} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <Book size={64} className="mb-4" />
                        <span className="font-black text-3xl uppercase">Lezioni in arrivo...</span>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  // --- RENDERER: VISTA LEZIONE ATTIVA ---
  const lessonBg = getSpecialBg(true);
  
  const activeHotspots = (isMathSubject ? MATH_GRADE_HOTSPOTS : (isHistorySubject ? HISTORY_GRADE_HOTSPOTS : (isGeographySubject ? GEOGRAPHY_GRADE_HOTSPOTS : (isScienceSubject ? SCIENCE_GRADE_HOTSPOTS : ITALIAN_1_HOTSPOTS))));

  return (
      <div className="fixed inset-0 z-[160] flex flex-col bg-white overflow-hidden animate-in zoom-in-95 duration-300">
          
          {isSpecialBook && <img src={lessonBg} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />}

          {/* --- HOTSPOTS FUNZIONALI --- */}
          {useHotspots && (
              <div className="absolute inset-0 z-40 pointer-events-none">
                  {/* CHIUDI LIBRO */}
                  {activeHotspots.CLOSE_BOOK?.length >= 3 && (
                      <button 
                        onClick={() => { setSelectedLesson(null); if (audioRef.current) { audioRef.current.pause(); setIsAudioPlaying(false); } }}
                        className="absolute pointer-events-auto outline-none"
                        style={{ clipPath: getClipPath(activeHotspots.CLOSE_BOOK), inset: 0 }}
                      />
                  )}
                  {/* ASCOLTA */}
                  {activeHotspots.LISTEN_AUDIO?.length >= 3 && (
                      <button 
                        onClick={() => toggleLessonAudio(selectedLesson.audioUrl)}
                        className="absolute pointer-events-auto outline-none"
                        style={{ clipPath: getClipPath(activeHotspots.LISTEN_AUDIO), inset: 0 }}
                      />
                  )}
                  {/* MAESTRA */}
                  {activeHotspots.ASK_TEACHER?.length >= 3 && (
                      <button 
                        onClick={() => setShowTeacherChat(true)}
                        className="absolute pointer-events-auto outline-none"
                        style={{ clipPath: getClipPath(activeHotspots.ASK_TEACHER), inset: 0 }}
                      />
                  )}
                  {/* ESERCIZI */}
                  {activeHotspots.EXERCISES?.length >= 3 && (
                      <button 
                        onClick={handleOpenExercise}
                        className="absolute pointer-events-auto outline-none"
                        style={{ clipPath: getClipPath(activeHotspots.EXERCISES), inset: 0 }}
                      />
                  )}
                  {/* ATTIVITÀ */}
                  {activeHotspots.VISUAL_ACTIVITY?.length >= 3 && (
                      <button 
                        onClick={handleOpenVisual}
                        className="absolute pointer-events-auto outline-none"
                        style={{ clipPath: getClipPath(activeHotspots.VISUAL_ACTIVITY), inset: 0 }}
                      />
                  )}
                  {/* GIOCHI */}
                  {activeHotspots.GAMES?.length >= 3 && (
                      <button 
                        onClick={handleOpenGame}
                        className="absolute pointer-events-auto outline-none"
                        style={{ clipPath: getClipPath(activeHotspots.GAMES), inset: 0 }}
                      />
                  )}
                  {/* YOUTUBE */}
                  {activeHotspots.YOUTUBE?.length >= 3 && (
                      <button 
                        onClick={handleOpenVideo}
                        className="absolute pointer-events-auto outline-none"
                        style={{ clipPath: getClipPath(activeHotspots.YOUTUBE), inset: 0 }}
                      />
                  )}
              </div>
          )}

          {!isSpecialBook && (
            <div className={`${subjectInfo.color} p-4 md:p-6 flex items-center justify-between border-b-8 border-black/10 shrink-0 mt-[64px] md:mt-[96px] z-10`}>
                <button onClick={() => { setSelectedLesson(null); setQuizAnswer(null); setShowFeedback(false); if (audioRef.current) { audioRef.current.pause(); setIsAudioPlaying(false); } }} className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition-all">
                    <ChevronLeft size={32} strokeWidth={3} />
                </button>
                <div className="text-center">
                    <span className="text-white/60 font-black text-[10px] uppercase block mb-1 tracking-widest">{selectedSubject}</span>
                    <h2 className="text-white font-black text-xl md:text-3xl uppercase tracking-tighter truncate max-w-[200px] md:max-w-md drop-shadow-md">{selectedLesson.title}</h2>
                </div>
                <button onClick={() => toggleLessonAudio(selectedLesson.audioUrl)} className="bg-yellow-400 p-3 rounded-full text-black hover:scale-110 active:scale-90 transition-all shadow-lg border-4 border-white">
                    {isAudioPlaying ? <Pause size={28} strokeWidth={2.5} /> : <Volume2 size={28} strokeWidth={2.5} />}
                </button>
            </div>
          )}

          <div className={`flex-1 flex flex-col items-center z-10 overflow-hidden ${isSpecialBook ? 'pt-52 md:pt-64 bg-transparent' : 'bg-white pt-10'}`}>
              <div className={`w-full max-w-4xl h-full flex flex-col items-center ${isSpecialBook ? 'px-14 md:px-32' : 'px-4'}`}>
                  <div className="w-full flex-1 flex flex-col items-center justify-center">
                      <h2 
                        className={`text-center transition-all ${useHotspots ? 'opacity-0 h-0 overflow-hidden' : 'font-luckiest text-blue-600 text-3xl md:text-6xl mb-4 md:mb-8 uppercase tracking-tighter drop-shadow-sm'}`}
                      >
                        {selectedLesson.title}
                      </h2>
                      <p className={`leading-relaxed whitespace-pre-wrap font-sans font-black ${isSpecialBook ? 'text-slate-800 text-base md:text-3xl text-justify' : 'text-center text-slate-700 text-lg md:text-2xl p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 shadow-inner'}`}>{selectedLesson.text}</p>
                  </div>

                  {!useHotspots && isSpecialBook && (
                      <div className="pb-32 md:pb-44 shrink-0 w-full flex justify-start items-center gap-4 -ml-4 md:-ml-24">
                          <button onClick={handleOpenExercise} className="hover:scale-110 active:scale-95 transition-all outline-none rotate-[-3deg]">
                              <img src={CUSTOM_VERIFY_BTN} alt="Verifica" className="w-28 h-12 md:w-44 md:h-18 object-fill drop-shadow-xl rounded-xl" />
                          </button>
                          <button onClick={handleOpenVisual} className="hover:scale-110 active:scale-95 transition-all outline-none">
                              <img src={CUSTOM_VISUAL_BTN} alt="Esercizio Visuale" className="w-28 h-12 md:w-44 md:h-18 object-fill drop-shadow-xl rounded-xl" />
                          </button>
                      </div>
                  )}

                  {!isSpecialBook && (
                      <div className="w-full bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white mb-20 mt-10">
                          <div className="flex items-center gap-3 mb-6"><Star className="text-yellow-400 fill-yellow-400" size={24} /><h4 className="text-xl font-black uppercase tracking-tight">Mini Sfida!</h4></div>
                          <p className="text-lg font-bold mb-8 text-blue-200">{selectedLesson.quiz.question}</p>
                          <div className="grid grid-cols-1 gap-4">
                              {selectedLesson.quiz.options.map((opt, idx) => (
                                  <button key={idx} onClick={() => handleQuizChoice(idx)} className={`p-5 rounded-2xl font-black text-lg border-4 transition-all text-left ${quizAnswer === null ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : ''} ${quizAnswer === idx && idx === selectedLesson.quiz.correctIndex ? 'bg-green-500 border-green-300 text-white' : ''} ${quizAnswer === idx && idx !== selectedLesson.quiz.correctIndex ? 'bg-red-500 border-red-300 text-white animate-shake' : ''}`}>{opt}</button>
                              ))}
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* MODALE "IN ARRIVO" */}
          {comingSoonModal.active && (
              <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                  <div className="bg-white w-full max-w-sm rounded-[3rem] border-8 border-yellow-400 p-8 flex flex-col items-center text-center shadow-2xl relative animate-in zoom-in duration-300">
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

          {isExerciseOpen && isSpecialBook && (
              <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                  <div className="bg-white w-full max-md rounded-[3rem] border-8 border-blue-500 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col">
                      <button onClick={() => { setIsExerciseOpen(false); setQuizAnswer(null); setShowFeedback(false); if (audioRef.current) { audioRef.current.pause(); setIsAudioPlaying(false); } }} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all z-10"><X size={24} strokeWidth={4} /></button>
                      <div className="p-3 md:p-4 flex justify-center border-b-4 border-slate-100 shrink-0"><img src={CUSTOM_VERIFY_BTN} alt="Esercizio" className="h-10 md:h-16 w-auto object-contain" /></div>
                      <div className="p-4 md:p-6 overflow-y-auto no-scrollbar flex-1 flex flex-col gap-3">
                          <p className="text-xl md:text-2xl font-black text-slate-800 leading-tight text-center">{selectedLesson.quiz.question}</p>
                          <div className="grid grid-cols-1 gap-2.5 mt-1">
                              {selectedLesson.quiz.options.map((opt, idx) => (
                                  <button key={idx} onClick={() => handleQuizChoice(idx)} className={`p-2.5 rounded-[1.5rem] font-black text-lg md:text-xl border-4 transition-all text-left shadow-lg flex items-center gap-4 ${quizAnswer === null ? 'bg-slate-50 border-slate-200 text-blue-600 hover:border-blue-500 hover:bg-white' : ''} ${quizAnswer === idx && idx === selectedLesson.quiz.correctIndex ? 'bg-green-500 border-green-700 text-white' : ''} ${quizAnswer === idx && idx !== selectedLesson.quiz.correctIndex ? 'bg-red-500 border-red-300 text-white animate-shake' : (quizAnswer !== null ? 'opacity-50 border-slate-100 text-blue-600' : '')}`}><span className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-sm md:text-base shrink-0 ${quizAnswer === idx ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>{String.fromCharCode(65 + idx)}</span>{opt}</button>
                              ))}
                          </div>
                          {showFeedback && (
                              <div className="mt-2 p-3 rounded-[2rem] bg-blue-50 border-4 border-blue-200 animate-in zoom-in">
                                  {quizAnswer === selectedLesson.quiz.correctIndex ? <div className="text-green-600 text-center"><p className="font-black text-base md:text-lg uppercase tracking-tighter leading-tight">{selectedLesson.quiz.feedback}</p></div> : <div className="text-red-600 text-center"><p className="font-black text-base md:text-lg uppercase tracking-tighter">Ops! Riprova! 💪</p></div>}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {isVisualExerciseOpen && isSpecialBook && (
              <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
                  <div className="bg-white w-full max-lg rounded-[3rem] border-8 border-purple-500 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col min-h-[400px]">
                      <button onClick={() => setIsVisualExerciseOpen(false)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-95 transition-all z-10"><X size={24} strokeWidth={4} /></button>
                      <div className="p-3 md:p-4 flex justify-center border-b-4 border-slate-100 shrink-0"><img src={CUSTOM_VISUAL_BTN} alt="Esercizio Visuale" className="h-10 md:h-16 w-auto object-contain" /></div>
                      <div className="p-8 flex-1 flex flex-col items-center justify-center text-center gap-6"><div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center"><ImageIcon size={48} className="text-purple-500" /></div><h3 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Sfida Visuale in Arrivo!</h3><p className="text-lg font-bold text-slate-500 leading-tight">Qui troverai esercizi basati su immagini magiche di Lone Boo. <br/><span className="text-purple-600">Torna a trovarci presto!</span> 👻</p></div>
                  </div>
              </div>
          )}

          {isVideoOpen && isSpecialBook && (
              <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-0 md:p-4 animate-in fade-in" onClick={() => setIsVideoOpen(false)}>
                  <div className="relative w-full max-w-5xl bg-white rounded-[30px] md:rounded-[40px] border-[6px] md:border-[8px] border-red-600 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setIsVideoOpen(false)} className="video-modal-close absolute top-4 right-4 z-[210] hover:scale-110 transition-transform">
                        <img src={BTN_CLOSE_IMG} alt="Chiudi" className="w-10 h-10 md:w-20 md:h-20" />
                      </button>
                      <div className="flex-1 w-full aspect-video bg-black"><iframe src={VOCALI_VIDEO_URL} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" /></div>
                      <div className="p-4 text-center bg-white shrink-0 border-t border-gray-100 flex items-center justify-center gap-3"><PlayCircle className="text-red-600" /><h3 className="text-gray-800 text-lg md:text-xl font-black uppercase truncate px-2">Impariamo con Lone Boo!</h3></div>
                  </div>
              </div>
          )}

          {showTeacherChat && <TeacherChat onClose={() => setShowTeacherChat(false)} />}
      </div>
  );
};

export default CurriculumView;
