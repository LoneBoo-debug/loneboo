
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GradeCurriculumData, SchoolSubject, SchoolChapter, SchoolLesson, AppView } from '../types';
import { Book, ChevronLeft, Volume2, ArrowRight, Star, X, Pause, ImageIcon, PlayCircle, ChevronRight, ArrowLeft, Lock, Info, ChevronDown, Play, Square, ZoomIn } from 'lucide-react';
import { markQuizComplete, markActivityComplete } from '../services/tokens';
import TeacherChat from './TeacherChat';

// --- SFONDI PER GLI INDICI (LISTA CAPITOLI) ---
const GRADE1_ITALIAN_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/indexita44.webp';
const GRADE1_MATH_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/indexmate33.webp';
const GRADE1_HISTORY_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/indexstori554.webp';
const GRADE1_GEOGRAPHY_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/indexgeo443.webp';
const GRADE1_SCIENCE_INDEX_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/indexscince4432.webp';

// --- SFONDI PER LE LEZIONI (CONTENUTO) ---
const GRADE1_ITALIAN_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfitaa44fxcse3322.webp';
const GRADE1_MATH_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfbglessonmate55f331q+(2).webp';
const GRADE1_HISTORY_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfbglessonmate55f331q+(4).webp';
const GRADE1_GEOGRAPHY_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfbglessonmate55f331q+(6).webp';
const GRADE1_SCIENCE_LESSON_BG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/sfbglessonmate55f331q+(8).webp';

const CUSTOM_CLOSE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/chiudisade.webp';
const CUSTOM_VERIFY_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esercschol4321.webp';
const CUSTOM_VISUAL_BTN = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/visuallibrsches432.webp';
const IMG_SCROLL_INDEX = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/freccigiuscroolindex44e32.webp';

// --- ASSET MODALE PREMIUM E INDICI ---
const PREMIUM_LOCK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libercloased44fx33.webp';
const PREMIUM_FREE_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/freebokuj776gt.webp';
const PREMIUM_HEADER_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/libercloased44fx33.webp';
const BTN_PREMIUM_BACK_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/returncloded44fx332.webp';
const BTN_PREMIUM_INFO_IMG = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/infoblocked44fx33.webp';

// --- ASSET MODALI CONTENUTI IN ARRIVO (SENZA TESTO) ---
const IMG_VIDEO_COMING_SOON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/videorijfh77arrivo09oi8.webp';
const IMG_GAME_COMING_SOON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/giocoinarrivof56tg7y.webp';
const IMG_ACTIVITY_COMING_SOON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/attivitiesinarrivo872xx.webp';
const IMG_EXERCISE_COMING_SOON = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/esercizioinarrivopop998u.webp';

const ORNELLA_TALK_ANIM = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/ornelaspiega.mp4';

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
  "VISUAL_ACTIVITY": [{"x": 29.34, "y": 88.01}, {"x": 29.08, "y": 94.01}, {"x": 50.15, "y": 94.16}, {"x": 49.89, "y": 88.31}],
  "GAMES": [{"x": 53.35, "y": 88.31}, {"x": 53.62, "y": 94.01}, {"x": 73.36, "y": 94.16}, {"x": 72.56, "y": 88.46}],
  "YOUTUBE": [{"x": 76.56, "y": 88.46}, {"x": 76.83, "y": 93.86}, {"x": 97.1, "y": 94.16}, {"x": 96.84, "y": 88.61}]
};

const HISTORY_GRADE_HOTSPOTS = {
  "CLOSE_BOOK": [{"x": 62.42, "y": 11.54}, {"x": 62.69, "y": 17.39}, {"x": 71.49, "y": 17.84}, {"x": 71.23, "y": 11.54}],
  "LISTEN_AUDIO": [{"x": 73.89, "y": 11.39}, {"x": 74.7, "y": 17.84}, {"x": 84.03, "y": 17.84}, {"x": 83.77, "y": 11.24}],
  "ASK_TEACHER": [{"x": 86.43, "y": 11.09}, {"x": 86.97, "y": 17.39}, {"x": 97.37, "y": 17.39}, {"x": 96.57, "y": 10.94}],
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
  "GAMES": [{"x": 52.29, "y": 89.06}, {"x": 52.29, "y": 93.41}, {"x": 73.36, "y": 93.56}, {"x": 73.09, "y": 88.76}],
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
  const [selectedLesson, setSelectedLesson] = useState<SchoolLesson | null>(() => {
    const pendingId = sessionStorage.getItem('pending_lesson_id');
    if (pendingId) {
        const chapters = data.subjects[initialSubject] || [];
        for (const ch of chapters) {
            const found = ch.lessons.find(l => l.id === pendingId);
            if (found) {
                sessionStorage.removeItem('pending_lesson_id');
                return found;
            }
        }
    }
    return null;
  });

  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExerciseOpen, setIsExerciseOpen] = useState(false);
  
  const [isVisualActivityOpen, setIsVisualActivityOpen] = useState(false);
  const [currentActivityIdx, setCurrentActivityIdx] = useState(0);
  const [activityAnswer, setActivityAnswer] = useState<number | null>(null);
  const [showActivityFeedback, setShowActivityFeedback] = useState(false);

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showTeacherChat, setShowTeacherChat] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  const indexScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDownIndex, setCanScrollDownIndex] = useState(false);

  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const [comingSoonModal, setComingSoonModal] = useState<{ active: boolean, type: 'GAME' | 'VIDEO' | 'ACTIVITY' | 'EXERCISE' }>({ active: false, type: 'GAME' });
  const [zoomedLessonImage, setZoomedLessonImage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- COORDINATE CALIBRATE FINALI ---
  const calib = {
    tvTop: 9,
    tvLeft: 3,
    tvSize: 120,
    playerTop: 20,
    playerRight: 2,
    playerWidth: 228
  };

  useEffect(() => {
    const premium = localStorage.getItem('is_premium_active') === 'true';
    setIsPremiumActive(premium);
  }, []);

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

  // Funzione per il calcolo delle pagine (stabile come useCallback)
  const checkPages = useCallback(() => {
    const container = textContainerRef.current;
    if (container && selectedLesson) {
        if (isImageUrl(selectedLesson.text)) {
            setTotalPages(1);
            setCurrentPage(1);
            return;
        }
        const tolerance = 25;
        const total = Math.ceil((container.scrollHeight - tolerance) / (container.clientHeight || 1));
        setTotalPages(total > 0 ? total : 1);
        container.scrollTop = (currentPage - 1) * container.clientHeight;
    }
  }, [selectedLesson, currentPage]);

  const renderMixedContent = (text: string) => {
      const imgRegex = /(https?:\/\/\S+\.(?:webp|jpg|jpeg|png|gif)(?:\?\S*)?|https?:\/\/loneboo-images\.s3\S+)/gi;
      const parts = text.split(imgRegex);
      
      return parts.map((part, index) => {
          if (isImageUrl(part)) {
              const url = part.trim();
              return (
                <div key={index} className="w-full flex justify-center my-4 group">
                    <div className="relative inline-block max-w-[85%] md:max-w-[70%]">
                        <img 
                            src={url} 
                            alt="Immagine Lezione" 
                            className="w-full h-auto rounded-2xl border-4 border-white shadow-md animate-in zoom-in duration-500 cursor-zoom-in hover:scale-[1.01] transition-transform" 
                            onLoad={() => {
                                setTimeout(checkPages, 100);
                            }}
                            onClick={() => setZoomedLessonImage(url)}
                        />
                        <div 
                            onClick={() => setZoomedLessonImage(url)}
                            className="absolute bottom-3 right-3 bg-blue-600/80 text-white p-2 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all md:opacity-0 md:group-hover:opacity-100"
                        >
                            <ZoomIn size={18} strokeWidth={3} />
                        </div>
                    </div>
                </div>
              );
          }
          if (part.trim() === '') return null;
          return (
            <div key={index} className="font-sans font-black text-slate-800 text-base md:text-4xl w-full leading-relaxed whitespace-pre-wrap">
                {part}
            </div>
          );
      });
  };

  const formatAudioTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === null) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getClipPath = (pts: Point[]) => `polygon(${pts.map(p => `${p.x}% ${p.y}%`).join(', ')})`;

  useEffect(() => {
    if (selectedLesson && !selectedLesson.isPremium) {
        const timers = [
            setTimeout(checkPages, 100),
            setTimeout(checkPages, 500),
            setTimeout(checkPages, 1500)
        ];
        
        window.addEventListener('resize', checkPages);
        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('resize', checkPages);
        };
    }
  }, [selectedLesson, checkPages]);

  const handleManualScroll = () => {
    const container = textContainerRef.current;
    if (container) {
        const usableHeight = container.clientHeight || 1;
        const isAtBottom = container.scrollHeight - container.scrollTop <= usableHeight + 10;
        const page = isAtBottom ? totalPages : Math.floor(container.scrollTop / usableHeight) + 1;
        
        if (page !== currentPage && page <= totalPages && page > 0) {
            setCurrentPage(page);
        }
    }
  };

  const checkIndexScrollStatus = () => {
    if (indexScrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = indexScrollRef.current;
        setCanScrollDownIndex(scrollHeight > clientHeight + scrollTop + 20);
    }
  };

  useEffect(() => {
    if (!selectedLesson) {
        setTimeout(checkIndexScrollStatus, 100);
        window.addEventListener('resize', checkIndexScrollStatus);
        return () => window.removeEventListener('resize', checkIndexScrollStatus);
    }
  }, [selectedLesson, selectedSubject]);

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
        setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
        setAudioDuration(audioRef.current.duration);
    }
  };

  const toggleLessonAudio = (url: string) => {
    if (!url || selectedLesson?.isPremium) return;
    
    if (audioRef.current && audioRef.current.src === url) {
        if (isAudioPlaying) { 
            audioRef.current.pause(); 
            setIsAudioPlaying(false); 
        } else { 
            audioRef.current.play(); 
            setIsAudioPlaying(true); 
            setShowAudioPlayer(true);
        }
    } else {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeEventListener('timeupdate', handleAudioTimeUpdate);
            audioRef.current.removeEventListener('loadedmetadata', handleAudioLoadedMetadata);
        }
        
        const audio = new Audio(url);
        audio.addEventListener('timeupdate', handleAudioTimeUpdate);
        audio.addEventListener('loadedmetadata', handleAudioLoadedMetadata);
        audio.onended = () => {
            setIsAudioPlaying(false);
            setShowAudioPlayer(false);
        };
        
        audio.play();
        audioRef.current = audio;
        setIsAudioPlaying(true);
        setShowAudioPlayer(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsAudioPlaying(false);
        setShowAudioPlayer(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
        audioRef.current.currentTime = time;
        setAudioCurrentTime(time);
    }
  };

  const handleQuizChoice = (idx: number) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    setShowFeedback(true);
    const quiz = selectedLesson?.quizzes[currentQuizIdx];
    if (idx === quiz?.correctIndex) {
        if (selectedLesson) markQuizComplete(selectedLesson.id, currentQuizIdx);
    } else {
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

  const handleActivityChoice = (idx: number) => {
    if (activityAnswer !== null) return;
    setActivityAnswer(idx);
    setShowActivityFeedback(true);
    const activity = selectedLesson?.activities[currentActivityIdx];
    if (idx === activity?.correctIndex) {
        if (selectedLesson) markActivityComplete(selectedLesson.id, currentActivityIdx);
    } else {
        setTimeout(() => { setActivityAnswer(null); setShowActivityFeedback(false); }, 2000);
    }
  };

  const nextActivity = () => {
    if (selectedLesson && currentActivityIdx < selectedLesson.activities.length - 1) {
        setCurrentActivityIdx(prev => prev + 1);
        setActivityAnswer(null);
        setShowActivityFeedback(false);
    } else {
        setIsVisualActivityOpen(false);
    }
  };

  const handleOpenLesson = (lesson: SchoolLesson) => {
    setIsExerciseOpen(false);
    setIsVisualActivityOpen(false);
    setIsVideoOpen(false);
    setCurrentQuizIdx(0);
    setCurrentActivityIdx(0);
    setQuizAnswer(null);
    setActivityAnswer(null);
    setShowFeedback(false);
    setShowActivityFeedback(false);
    setCurrentPage(1);
    setSelectedLesson(lesson);
  };

  const handleCloseLesson = () => {
    setSelectedLesson(null);
    setCurrentQuizIdx(0);
    setCurrentActivityIdx(0);
    setIsExerciseOpen(false);
    setIsVisualActivityOpen(false);
    setIsVideoOpen(false);
    stopAudio();
  };

  const handleOpenPremiumInfo = () => {
      if (setView) setView(AppView.PREMIUM_INFO);
  };

  const handleVideoClick = () => {
      if (selectedLesson?.videoUrl && selectedLesson.videoUrl !== "") {
          setIsVideoOpen(true);
      } else {
          setComingSoonModal({ active: true, type: 'VIDEO' });
      }
  };

  const activeHotspots = selectedSubject === SchoolSubject.MATEMATICA ? MATH_GRADE_HOTSPOTS : 
                        selectedSubject === SchoolSubject.STORIA ? HISTORY_GRADE_HOTSPOTS : 
                        selectedSubject === SchoolSubject.GEOGRAFIA ? GEOGRAPHY_GRADE_HOTSPOTS : 
                        selectedSubject === SchoolSubject.SCIENZE ? SCIENCE_GRADE_HOTSPOTS : ITALIAN_1_HOTSPOTS;

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
        <div className="flex-1 flex flex-col items-center z-10 pt-52 md:pt-66 overflow-hidden">
            <div className="w-full max-w-4xl px-12 md:px-24 flex flex-col items-center">
                <div 
                    ref={indexScrollRef}
                    onScroll={checkIndexScrollStatus}
                    className="w-full overflow-y-auto overflow-x-hidden no-scrollbar max-h-[60vh] md:max-h-[68vh]"
                    style={{ touchAction: 'pan-y' }}
                >
                    <div className="space-y-1">
                        {chapters.map(ch => {
                            const isChapterPremium = ch.lessons[0]?.isPremium;
                            const isLocked = isChapterPremium && !isPremiumActive;
                            const iconUrl = isLocked ? PREMIUM_LOCK_IMG : PREMIUM_FREE_IMG;
                            
                            return (
                                <button 
                                    key={ch.id} 
                                    onClick={() => ch.lessons.length > 0 && handleOpenLesson(ch.lessons[0])} 
                                    className="w-full text-left font-luckiest text-blue-700 text-lg md:text-3xl uppercase tracking-wide hover:text-blue-500 transition-colors py-1 flex justify-between items-center group active:scale-98"
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <img 
                                            src={iconUrl} 
                                            alt={isLocked ? "Bloccato" : "Libero"} 
                                            className="w-8 f-8 md:w-11 md:h-11 object-contain drop-shadow-md" 
                                        />
                                        <span className="leading-none">{ch.title}</span>
                                    </div>
                                    <ArrowRight size={28} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={`mt-3 transition-all duration-300 ${canScrollDownIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
                    <img 
                        src={IMG_SCROLL_INDEX} 
                        alt="Scorri giù" 
                        className="w-12 h-auto drop-shadow-lg animate-bounce" 
                    />
                </div>
            </div>
        </div>
      </div>
    );
  }

  const currentQuiz = selectedLesson.quizzes[currentQuizIdx];
  const currentActivity = selectedLesson.activities[currentActivityIdx];
  const videoId = selectedLesson.videoUrl ? (selectedLesson.videoUrl.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)?.[2]) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : "";

  return (
      <div className="fixed inset-0 z-100 flex flex-col bg-white overflow-hidden">
          <img src={getSpecialBg(true)} alt="" className="absolute inset-0 w-full h-full object-fill z-0" />

          <div className="absolute inset-0 z-40 pointer-events-none">
              <button onClick={handleCloseLesson} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.CLOSE_BOOK), inset: 0 }} />
              
              {!selectedLesson.isPremium && (
                <>
                    <button onClick={() => toggleLessonAudio(selectedLesson.audioUrl)} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.LISTEN_AUDIO), inset: 0 }} />
                    <button onClick={() => setShowTeacherChat(true)} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.ASK_TEACHER), inset: 0 }} />
                    <button onClick={() => selectedLesson.quizzes.length > 0 ? setIsExerciseOpen(true) : setComingSoonModal({ active: true, type: 'EXERCISE' })} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.EXERCISES), inset: 0 }} />
                    <button onClick={() => selectedLesson.activities.length > 0 ? setIsVisualActivityOpen(true) : setComingSoonModal({ active: true, type: 'ACTIVITY' })} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.VISUAL_ACTIVITY), inset: 0 }} />
                    <button onClick={() => setComingSoonModal({ active: true, type: 'GAME' })} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.GAMES), inset: 0 }} />
                    <button onClick={handleVideoClick} className="absolute pointer-events-auto outline-none" style={{ clipPath: getClipPath(activeHotspots.YOUTUBE), inset: 0 }} />
                </>
              )}
          </div>

          {/* --- MINI TV MAESTRA (POSIZIONAMENTO CALIBRATO) --- */}
          {showAudioPlayer && !selectedLesson.isPremium && (
              <div 
                className="absolute z-50 animate-in slide-in-from-left duration-500"
                style={{ 
                    top: `${calib.tvTop}%`, 
                    left: `${calib.tvLeft}%`, 
                    width: `${calib.tvSize}px`, 
                    height: `${calib.tvSize}px` 
                }}
              >
                  <div className="relative w-full h-full bg-black/40 backdrop-blur-sm rounded-[2.5rem] border-4 md:border-8 border-yellow-400 shadow-2xl overflow-hidden flex items-center justify-center">
                      <video 
                          src={ORNELLA_TALK_ANIM} 
                          autoPlay={isAudioPlaying}
                          loop 
                          muted 
                          playsInline 
                          className="w-full h-full object-cover" 
                          style={{ 
                              mixBlendMode: 'screen', 
                              filter: 'contrast(1.1) brightness(1.1)',
                              opacity: isAudioPlaying ? 1 : 0.5 
                          }} 
                          ref={(el) => {
                              if (el) {
                                  if (isAudioPlaying) el.play().catch(() => {});
                                  else el.pause();
                              }
                          }}
                      />
                      {!isAudioPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Pause size={32} className="text-white/60" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                  </div>
              </div>
          )}

          {/* --- MINI PLAYER COMPATTO (POSIZIONAMENTO CALIBRATO) --- */}
          {showAudioPlayer && !selectedLesson.isPremium && (
            <div 
                className="absolute z-50 animate-in slide-in-from-right duration-500"
                style={{ 
                    top: `${calib.playerTop}%`, 
                    right: `${calib.playerRight}%`,
                    width: `${calib.playerWidth}px`
                }}
            >
                <div className="bg-white/30 backdrop-blur-md border-4 border-yellow-400 p-1.5 md:p-2 rounded-2xl shadow-2xl flex flex-row items-center gap-2 md:gap-4 h-12 md:h-16">
                    <div className="flex gap-1 shrink-0">
                        <button 
                            onClick={() => toggleLessonAudio(selectedLesson.audioUrl)}
                            className="bg-white w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black flex items-center justify-center active:scale-90 transition-transform"
                        >
                            {isAudioPlaying ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" className="translate-x-0.5" />}
                        </button>
                        <button 
                            onClick={stopAudio}
                            className="bg-red-500 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black flex items-center justify-center active:scale-90 transition-transform"
                        >
                            <Square size={14} fill="white" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                        <input 
                            type="range" 
                            min="0" 
                            max={audioDuration || 100} 
                            value={audioCurrentTime} 
                            onChange={handleSeek}
                            className="w-full h-1 bg-black/20 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[8px] font-black text-black/80 uppercase">
                            <span>{formatAudioTime(audioCurrentTime)}</span>
                            <span>{formatAudioTime(audioDuration)}</span>
                        </div>
                    </div>
                </div>
            </div>
          )}

          <div className="flex-1 flex flex-col items-center z-10 pt-44 md:pt-56 px-6 overflow-hidden">
              <div className="relative w-full max-w-5xl px-8 md:px-16 flex flex-col items-center h-full justify-start overflow-hidden">
                  
                  {selectedLesson.isPremium && !isPremiumActive ? (
                      <div className="flex-1 w-full flex flex-col items-center justify-center">
                          <div className="bg-white/95 backdrop-blur-md p-6 md:p-10 rounded-[3rem] border-8 border-yellow-400 shadow-2xl flex flex-col items-center text-center max-sm">
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

                              <div className="flex gap-4 w-full justify-center">
                                  <button onClick={handleCloseLesson} className="hover:scale-110 active:scale-95 transition-all outline-none">
                                      <img src={BTN_PREMIUM_BACK_IMG} alt="Torna Indietro" className="w-24 md:w-32 h-auto drop-shadow-lg" />
                                  </button>
                                  <button onClick={handleOpenPremiumInfo} className="hover:scale-110 active:scale-95 transition-all outline-none" style={{ marginLeft: '10px' }}>
                                      <img src={BTN_PREMIUM_INFO_IMG} alt="Info" className="w-24 md:w-32 h-auto drop-shadow-lg" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  ) : (
                      <>
                        <div className="w-full flex flex-col items-center justify-center min-h-[60px] md:min-h-[120px] mb-4 md:mb-6 shrink-0 mt-8 md:mt-12">
                            <h3 className="font-luckiest text-center text-blue-700 text-xl md:text-5xl uppercase leading-tight drop-shadow-sm">
                                {selectedLesson.title}
                            </h3>
                        </div>

                        {/* Pagination box vertical on the left side, positioned just above the text container */}
                        <div className="absolute left-1 md:left-4 top-[14%] md:top-[20%] flex flex-col items-center z-30 pointer-events-none">
                            <div className="px-2 py-1.5 md:px-4 md:py-3 flex flex-col items-center transition-all pointer-events-auto">
                                <span className="font-black text-blue-700 text-[8px] md:text-xs uppercase tracking-widest leading-none mb-1">
                                    Pagina
                                </span>
                                <span className="font-black text-blue-700 text-xs md:text-2xl leading-none">
                                    {currentPage}/{totalPages}
                                </span>
                            </div>
                        </div>

                        <div 
                            ref={textContainerRef}
                            onScroll={handleManualScroll}
                            className="w-full overflow-y-auto overflow-x-hidden no-scrollbar pointer-events-auto block"
                            style={{
                                height: '48vh', 
                                scrollSnapType: 'y proximity',
                                touchAction: 'pan-y'
                            }}
                        >
                            <div className="flex flex-col gap-4">
                                {renderMixedContent(selectedLesson.text)}
                            </div>
                        </div>
                      </>
                  )}
              </div>
          </div>

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

          {isVisualActivityOpen && currentActivity && (!selectedLesson.isPremium || isPremiumActive) && (
              <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 md:p-4">
                  <div className="bg-white w-full max-w-2xl rounded-[3rem] border-8 border-orange-500 shadow-2xl overflow-hidden relative flex flex-col h-[90vh] md:h-auto max-h-[800px]">
                      <button onClick={() => setIsVisualActivityOpen(false)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 active:scale-90 transition-transform z-10"><X size={24} strokeWidth={4} /></button>
                      
                      <div className="p-3 md:p-4 flex justify-center border-b-4 border-slate-100 shrink-0">
                          <img src={CUSTOM_VISUAL_BTN} alt="Attività" className="h-10 md:h-14 w-auto object-contain" />
                      </div>

                      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden gap-3">
                          <div className="text-center">
                              <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">Attività {currentActivityIdx + 1} di {selectedLesson.activities.length}</span>
                          </div>

                          <div className="w-full aspect-video bg-slate-100 border-4 border-orange-200 overflow-hidden shadow-inner flex items-center justify-center shrink-0">
                               <img src={currentActivity.image} className="w-full h-full object-contain" alt="Immagine Attività" />
                          </div>

                          <p className="text-lg md:text-xl font-black text-slate-800 leading-tight text-center px-2">{currentActivity.question}</p>

                          <div className="grid grid-cols-1 gap-1.5 flex-1">
                              {currentActivity.options.map((opt, idx) => (
                                  <button 
                                    key={idx} 
                                    onClick={() => handleActivityChoice(idx)} 
                                    className={`py-2 px-3 rounded-xl font-black text-base md:text-lg border-2 md:border-4 transition-all text-left shadow-md flex items-center gap-3 ${activityAnswer === null ? 'bg-slate-50 border-slate-200 text-orange-600 hover:border-orange-500 hover:bg-white' : ''} ${activityAnswer === idx && idx === currentActivity.correctIndex ? 'bg-green-500 border-green-700 text-white' : ''} ${activityAnswer === idx && idx !== currentActivity.correctIndex ? 'bg-red-500 border-red-300 text-white animate-shake' : (activityAnswer !== null ? 'opacity-50 border-slate-100 text-orange-600' : '')}`}
                                  >
                                      <span className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${activityAnswer === idx ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'}`}>{String.fromCharCode(65 + idx)}</span>
                                      <span className="truncate">{opt}</span>
                                  </button>
                              ))}
                          </div>

                          <div className="min-h-[60px] flex items-center justify-center">
                              {showActivityFeedback && (
                                  <div className="w-full p-2 rounded-2xl bg-orange-50 border-2 border-orange-200 text-center animate-in zoom-in">
                                      {activityAnswer === currentActivity.correctIndex ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-green-600 font-black text-base md:text-lg uppercase tracking-tighter dream-glow leading-tight">{currentActivity.feedback}</p>
                                            <button onClick={nextActivity} className="bg-green-500 text-white px-6 py-2 rounded-full font-black flex items-center gap-2 shadow-md hover:scale-105 transition-transform uppercase text-[10px]">
                                                {currentActivityIdx < selectedLesson.activities.length - 1 ? 'Attività Successiva' : 'Fine Attività'} <ChevronRight size={14} />
                                            </button>
                                        </div>
                                      ) : <p className="text-red-600 font-black text-sm uppercase tracking-tighter">Ops! Riprova! 💪</p>}
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {comingSoonModal.active && (!selectedLesson.isPremium || isPremiumActive) && (
              <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in duration-300 flex items-center justify-center">
                  <div className="bg-white rounded-[3rem] border-8 border-yellow-400 p-0 w-full max-w-[240px] md:max-w-[320px] max-h-[75vh] text-center shadow-2xl relative overflow-hidden animate-in zoom-in duration-300 flex items-center justify-center">
                      <button onClick={() => setComingSoonModal({ ...comingSoonModal, active: false })} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full border-2 border-black hover:scale-110 active:scale-95 transition-all z-20 shadow-lg"><X size={18} strokeWidth={4} /></button>
                      
                      <div className="w-full h-full flex flex-col items-center justify-center">
                          <img 
                              src={
                                  comingSoonModal.type === 'VIDEO' ? IMG_VIDEO_COMING_SOON : 
                                  comingSoonModal.type === 'ACTIVITY' ? IMG_ACTIVITY_COMING_SOON :
                                  comingSoonModal.type === 'EXERCISE' ? IMG_EXERCISE_COMING_SOON :
                                  IMG_GAME_COMING_SOON
                              } 
                              alt="In arrivo" 
                              className="w-full h-auto object-contain block" 
                          />
                      </div>
                  </div>
              </div>
          )}

          {isVideoOpen && (!selectedLesson.isPremium || isPremiumActive) && (
              <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-0 md:p-4 animate-in fade-in">
                  <div className="relative w-full max-w-5xl bg-white rounded-[30px] md:rounded-[40px] border-[6px] md:border-[8px] border-red-600 shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setIsVideoOpen(false)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black hover:scale-110 z-[210]"><X size={24} /></button>
                      <div className="flex-1 w-full aspect-video bg-black"><iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen allow="autoplay; fullscreen" /></div>
                      <div className="p-4 text-center bg-white shrink-0 border-t border-gray-100 flex items-center justify-center gap-3"><PlayCircle className="text-red-600" /><h3 className="text-gray-800 text-lg md:text-xl font-black uppercase truncate px-2">Impariamo con Lone Boo!</h3></div>
                  </div>
              </div>
          )}

          {/* --- MODALE ZOOM IMMAGINE LEZIONE --- */}
          {zoomedLessonImage && (
              <div 
                className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in duration-300"
                onClick={() => setZoomedLessonImage(null)}
              >
                  <button 
                    onClick={() => setZoomedLessonImage(null)}
                    className="absolute top-20 md:top-28 right-6 z-[510] bg-red-500 text-white p-2 md:p-3 rounded-full border-4 border-white shadow-xl hover:scale-110 transition-all active:scale-95"
                  >
                      <X size={24} strokeWidth={4} />
                  </button>

                  <div 
                    className="relative max-w-full max-h-[75vh] bg-white p-2 md:p-4 rounded-[2rem] md:rounded-[3rem] border-8 border-yellow-400 shadow-[0_0_50px_rgba(255,255,255,0.2)] overflow-hidden flex items-center justify-center"
                    onClick={e => e.stopPropagation()}
                  >
                      <img 
                        src={zoomedLessonImage} 
                        alt="Ingrandimento" 
                        className="max-w-full max-h-[70vh] object-contain rounded-2xl" 
                      />
                  </div>
              </div>
          )}

          {showTeacherChat && (!selectedLesson.isPremium || isPremiumActive) && <TeacherChat onClose={() => setShowTeacherChat(false)} />}
      </div>
  );
};

export default CurriculumView;
